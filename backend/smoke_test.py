import asyncio
import io
import sys
import uuid
import httpx
from app.main import app
from app.db.init_db import init_and_migrate_db

async def run_smoke_test():
    print("=" * 60)
    print("Starting GEB Platform Comprehensive Smoke Test (15 Suites)...")
    print("=" * 60)

    # Initialize database schema and admin seed
    await init_and_migrate_db()

    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver/api", timeout=30.0) as client:
        # 1. Health Check
        print("\n[Step 1] Testing Backend Health Check (/api/health)...")
        res = await client.get("http://testserver/api/health")
        assert res.status_code == 200, f"FastAPI health check failed: {res.status_code}"
        print("  -> Backend FastAPI Health Check is LIVE & responding (200 OK)")

        # 2. Admin Login
        print("\n[Step 2] Testing Admin Login (/api/auth/login/manual)...")
        login_res = await client.post("/auth/login/manual", json={
            "email": "admin@geb.gov",
            "password": "Admin@123"
        })
        assert login_res.status_code == 200, f"Admin login failed: {login_res.text}"
        admin_tokens = login_res.json()
        admin_access = admin_tokens["access_token"]
        print("  -> Admin Login Successful! Bearer Token received.")

        # 3. Admin /api/auth/me
        print("\n[Step 3] Testing Current User Info (/api/auth/me) for Admin...")
        me_res = await client.get("/auth/me", headers={"Authorization": f"Bearer {admin_access}"})
        assert me_res.status_code == 200, f"/auth/me failed: {me_res.text}"
        admin_user = me_res.json()
        assert admin_user["role"] == "ADMIN", f"Expected ADMIN role, got {admin_user['role']}"
        print(f"  -> Admin Profile Verified: {admin_user['full_name']} ({admin_user['email']}), Role: {admin_user['role']}")

        # 4. Admin Summary & Dashboard Data
        print("\n[Step 4] Testing Admin Metrics (/api/admin/summary)...")
        summary_res = await client.get("/admin/summary", headers={"Authorization": f"Bearer {admin_access}"})
        assert summary_res.status_code == 200, f"/admin/summary failed: {summary_res.text}"
        summary_data = summary_res.json()
        print(f"  -> Admin Summary Loaded: Total Employees: {summary_data['metrics']['total_employees']}, Verified: {summary_data['metrics']['verified_employees']}, Docs: {summary_data['metrics']['total_documents']}")

        # 5. Register New Employee
        print("\n[Step 5] Testing Employee Registration (/api/auth/register)...")
        unique_id = uuid.uuid4().hex[:6]
        emp_email = f"emp_{unique_id}@geb.gov"
        emp_username = f"emp_{unique_id}"
        reg_payload = {
            "full_name": f"Smoke Test Employee {unique_id}",
            "username": emp_username,
            "email": emp_email,
            "password": "Password123!",
            "confirm_password": "Password123!",
            "phone_number": "+91 9876543210",
            "applicant_type": "CITIZEN",
            "experience_years": 4,
            "experience_months": 6,
            "group": "Group A",
            "sub_category": "Administration"
        }
        reg_res = await client.post("/auth/register", json=reg_payload)
        assert reg_res.status_code == 200, f"Registration failed: {reg_res.text}"
        emp_data = reg_res.json()
        print(f"  -> Employee Registered: {emp_data['full_name']} ({emp_data['email']}), ID: {emp_data['id']}")

        # 6. Employee Login
        print("\n[Step 6] Testing Employee Login & /auth/me...")
        emp_login_res = await client.post("/auth/login/manual", json={
            "email": emp_email,
            "password": "Password123!"
        })
        assert emp_login_res.status_code == 200, f"Employee login failed: {emp_login_res.text}"
        emp_tokens = emp_login_res.json()
        emp_access = emp_tokens["access_token"]

        emp_me_res = await client.get("/auth/me", headers={"Authorization": f"Bearer {emp_access}"})
        assert emp_me_res.status_code == 200
        emp_profile = emp_me_res.json()
        assert emp_profile["role"] == "EMPLOYEE"
        print(f"  -> Employee Authenticated Successfully! Role: {emp_profile['role']}, Status: {emp_profile['verification_status']}")

        # 7. Document Upload (Simulated PDF upload)
        print("\n[Step 7] Testing Document Upload & AI OCR (/api/onboarding/upload)...")
        dummy_file_bytes = b"%PDF-1.4 Mock Document Verification Certificate Name: Smoke Test Employee Experience: 4 years"
        files = {"file": ("experience_cert.pdf", dummy_file_bytes, "application/pdf")}
        upload_res = await client.post(
            "/onboarding/upload",
            headers={"Authorization": f"Bearer {emp_access}"},
            files=files
        )
        assert upload_res.status_code == 200, f"Document upload failed: {upload_res.text}"
        upload_data = upload_res.json()
        doc_id = upload_data.get("document_id")
        print(f"  -> Document Uploaded & OCR Processed! Doc ID: {doc_id}, Confidence: {upload_data.get('confidence_score')}%")

        # 8. Data Review & Validation
        print("\n[Step 8] Testing Document Data Review & Course Assignment (/api/onboarding/submit)...")
        submit_payload = {
            "document_id": doc_id,
            "full_name": emp_profile["full_name"],
            "applicant_type": "CITIZEN",
            "experience_years": 4,
            "qualification": "Master of Public Policy",
            "department": "Department of Administration",
            "designation": "Administrative Officer"
        }
        review_res = await client.post(
            "/onboarding/submit",
            headers={"Authorization": f"Bearer {emp_access}"},
            json=submit_payload
        )
        assert review_res.status_code == 200, f"Submit failed: {review_res.text}"
        review_data = review_res.json()
        print(f"  -> Verification Status: {review_data.get('status')}, Assigned Employee ID: {review_data.get('employee_id')}")
        print(f"  -> Recommended Courses: {review_data.get('recommended_courses')}")

        # 9. Employee Dashboard Data Retrieval
        print("\n[Step 9] Testing Employee Dashboard Retrieval (/api/dashboard/)...")
        dash_res = await client.get("/dashboard/", headers={"Authorization": f"Bearer {emp_access}"})
        assert dash_res.status_code == 200, f"Dashboard retrieval failed: {dash_res.text}"
        dash_data = dash_res.json()
        print(f"  -> Dashboard Payload Verified! User: {dash_data['user']['full_name']}, Total Registered Courses: {dash_data['stats']['registered_courses']}")

        # 10. Admin Document Review & Approval
        print("\n[Step 10] Testing Admin Document Approval (/api/admin/documents/{doc_id}/approve)...")
        if doc_id:
            approve_res = await client.post(
                f"/admin/documents/{doc_id}/approve",
                headers={"Authorization": f"Bearer {admin_access}"}
            )
            assert approve_res.status_code == 200, f"Admin approve failed: {approve_res.text}"
            print("  -> Admin Approved Document successfully!")

        # 11. Admin User Directory
        print("\n[Step 11] Testing Admin User Directory (/api/admin/users)...")
        users_res = await client.get("/admin/users", headers={"Authorization": f"Bearer {admin_access}"})
        assert users_res.status_code == 200
        user_list = users_res.json()
        print(f"  -> Admin User Directory loaded {len(user_list)} total users.")

        # 12. Complete Employee Profile & Digital Service Record
        print("\n[Step 12] Testing Digital Service Record Retrieval (/api/profile/record)...")
        profile_res = await client.get("/profile/record", headers={"Authorization": f"Bearer {emp_access}"})
        assert profile_res.status_code == 200, f"Profile record retrieval failed: {profile_res.text}"
        profile_record = profile_res.json()
        assert "personal_info" in profile_record
        assert "employment_details" in profile_record
        assert "registration_details" in profile_record
        assert "uploaded_documents" in profile_record
        assert "qualifications" in profile_record
        assert "experience_history" in profile_record
        assert "courses" in profile_record
        assert "training_history" in profile_record
        assert "certifications" in profile_record
        assert "ai_recommendations" in profile_record
        assert "activity_timeline" in profile_record
        assert "settings" in profile_record
        print(f"  -> Digital Service Record Verified: 12 Dimensions Active, Emp ID: {profile_record['employee_id']}, Completion: {profile_record['profile_completion_percentage']}%")

        # 13. Update Personal Details
        print("\n[Step 13] Testing Personal Details Update (/api/profile/personal)...")
        update_pers_res = await client.put(
            "/profile/personal",
            headers={"Authorization": f"Bearer {emp_access}"},
            json={
                "full_name": f"Smoke Test Employee {unique_id}",
                "blood_group": "B+",
                "emergency_contact_name": "Family Contact",
                "emergency_contact_phone": "+91 9988776655"
            }
        )
        assert update_pers_res.status_code == 200, f"Personal update failed: {update_pers_res.text}"
        print("  -> Personal details and emergency contact successfully updated.")

        # 14. Update Profile Settings
        print("\n[Step 14] Testing Profile Settings & 2FA Toggle (/api/profile/settings)...")
        update_set_res = await client.put(
            "/profile/settings",
            headers={"Authorization": f"Bearer {emp_access}"},
            json={
                "language_preference": "English (US)",
                "two_factor_enabled": True,
                "email_notifications": True
            }
        )
        assert update_set_res.status_code == 200, f"Settings update failed: {update_set_res.text}"
        print("  -> Security settings & preferences successfully updated.")

        # 15. Official Smart ID Card Data
        print("\n[Step 15] Testing Smart ID Card Payload (/api/profile/id-card)...")
        id_card_res = await client.get("/profile/id-card", headers={"Authorization": f"Bearer {emp_access}"})
        assert id_card_res.status_code == 200, f"ID card retrieval failed: {id_card_res.text}"
        id_card_data = id_card_res.json()
        assert id_card_data["employee_id"] == profile_record["employee_id"]
        print(f"  -> Smart ID Card Cryptographic Payload Generated: Hash {id_card_data['security_hash']}")

    print("\n" + "=" * 60)
    print("ALL 15 SMOKE TEST SUITES PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(run_smoke_test())
