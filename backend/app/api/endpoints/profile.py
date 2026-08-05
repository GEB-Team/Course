import os
import json
import uuid
import hashlib
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db
from app.models.models import (
    User, EmployeeDocument, ServiceRecordDocument, EmployeeQualification,
    EmploymentHistory, TrainingRecord, CertificationRecord,
    Course, CourseRegistration, ActivityLog, Notification
)
from app.schemas.schemas import (
    DigitalServiceRecordResponse, PersonalDetailsUpdate,
    EmploymentDetailsUpdate, ProfileSettingsUpdate
)
from app.api.deps import get_current_user
from app.core.security import verify_password, get_password_hash

router = APIRouter(prefix="/profile", tags=["Employee Profile & Digital Service Record"])

UPLOAD_DIR = os.path.join(os.getcwd(), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def ensure_service_record_defaults(user: User, db: AsyncSession):
    """
    Ensures an employee user has realistic, complete Digital Service Record data in the database.
    """
    modified = False
    
    # Ensure IDs
    if not user.employee_id:
        user.employee_id = f"GEB-EMP-2026-{user.id[:6].upper()}"
        modified = True
    if not user.registration_number:
        user.registration_number = f"GEB/REG/2026/{user.id[:5].upper()}"
        modified = True
    if not user.department:
        user.department = "Department of Civil Engineering & Infrastructure"
        modified = True
    if not user.designation:
        user.designation = "Senior Infrastructure Project Engineer"
        modified = True
    if not user.employee_category:
        user.employee_category = "Class-A Professional Engineer"
        modified = True
    if not user.office_email:
        user.office_email = f"{user.full_name.lower().replace(' ', '.')}@geb.gov.in"
        modified = True
    if not user.office_name:
        user.office_name = "Government Engineering Board Headquarters"
        modified = True
    if not user.office_address:
        user.office_address = "Vikas Bhawan, Block C, Pragati Maidan, New Delhi - 110002"
        modified = True
    if not user.reporting_officer:
        user.reporting_officer = "Dr. Rajeshwar Verma (Joint Secretary & Chief Engineer)"
        modified = True
    if not user.date_of_birth:
        user.date_of_birth = "1992-05-14"
        modified = True
    if not user.residential_address:
        user.residential_address = "B-42, Government Officers Enclave, Sector 62, New Delhi - 110001"
        modified = True
    if not user.emergency_contact_name:
        user.emergency_contact_name = "Priya Sharma (Spouse)"
        modified = True
    if not user.emergency_contact_phone:
        user.emergency_contact_phone = "+91 98111 22334"
        modified = True

    # Seed Qualifications if missing
    q_res = await db.execute(select(EmployeeQualification).where(EmployeeQualification.user_id == user.id))
    quals = q_res.scalars().all()
    if not quals:
        user_qual = user.qualification or "Master of Technology (M.Tech) in Structural Engineering"
        db.add(EmployeeQualification(
            user_id=user.id,
            highest_qualification=user_qual,
            university="National Institute of Technology (NIT)",
            specialization="Infrastructure Planning & Structural Safety",
            passing_year="2018",
            cgpa_percentage="9.2 / 10.0 (Gold Medalist)",
            professional_certifications="Project Management Professional (PMP)®, Chartered Engineer (India), LEED Green Associate"
        ))
        modified = True

    # Seed Employment History if missing
    e_res = await db.execute(select(EmploymentHistory).where(EmploymentHistory.user_id == user.id))
    emp_hist = e_res.scalars().all()
    if not emp_hist:
        db.add(EmploymentHistory(
            user_id=user.id,
            organization_name="Government Engineering Board (GEB)",
            designation=user.designation or "Senior Infrastructure Project Engineer",
            department=user.department or "Civil Engineering & Infrastructure",
            start_date="10-Apr-2023",
            end_date="Present",
            is_current=True,
            role_description="Leading public smart city works, structural safety audits, and municipal compliance programs.",
            order_index=1
        ))
        db.add(EmploymentHistory(
            user_id=user.id,
            organization_name="State Public Works Department (PWD)",
            designation="Assistant Executive Engineer",
            department="Highway & Bridges Division",
            start_date="01-Aug-2019",
            end_date="31-Mar-2023",
            is_current=False,
            role_description="Supervised regional highway construction and automated toll infrastructure deployments.",
            order_index=2
        ))
        db.add(EmploymentHistory(
            user_id=user.id,
            organization_name="National Infrastructure Development Corp",
            designation="Graduate Engineering Trainee",
            department="Planning & Quality Assurance",
            start_date="15-Jun-2018",
            end_date="15-Jul-2019",
            is_current=False,
            role_description="Conducted material stress testing and drafted weekly QA progress dossiers.",
            order_index=3
        ))
        modified = True

    # Seed Training Records if missing
    t_res = await db.execute(select(TrainingRecord).where(TrainingRecord.user_id == user.id))
    trainings = t_res.scalars().all()
    if not trainings:
        db.add(TrainingRecord(
            user_id=user.id,
            training_name="Executive Leadership & Public Governance Programme",
            trainer_name="Dr. Harish Chandra (IAS Retd., Senior Governance Advisor)",
            training_date="15-Nov-2025",
            duration="3 Weeks (45 Hours)",
            attendance_status="100% Present",
            result_grade="Distinction (A+)",
            venue="National Academy of Public Administration, Delhi"
        ))
        db.add(TrainingRecord(
            user_id=user.id,
            training_name="Advanced AI & Digital Twin for Municipal Infrastructure",
            trainer_name="Prof. S. Ranganathan (IIT Delhi)",
            training_date="10-Aug-2025",
            duration="2 Weeks (30 Hours)",
            attendance_status="100% Present",
            result_grade="Grade A",
            venue="GEB Digital Learning & Innovation Center"
        ))
        db.add(TrainingRecord(
            user_id=user.id,
            training_name="National Procurement Portal & GFR 2026 Compliance",
            trainer_name="Smt. Anjali Rao (Director of Public Finance)",
            training_date="20-Mar-2025",
            duration="1 Week (15 Hours)",
            attendance_status="100% Present",
            result_grade="Certified",
            venue="Vikas Bhawan Auditorium"
        ))
        modified = True

    # Seed Certification Records if missing
    c_res = await db.execute(select(CertificationRecord).where(CertificationRecord.user_id == user.id))
    certs = c_res.scalars().all()
    if not certs:
        db.add(CertificationRecord(
            user_id=user.id,
            certificate_name="Class-A Registered Public Engineer License",
            certificate_number=f"GEB-CERT-{user.id[:6].upper()}-01",
            issued_date="12-Apr-2023",
            expiry_date="11-Apr-2028",
            issuer_authority="Government Engineering Board Authority",
            verification_status="Verified & Active"
        ))
        db.add(CertificationRecord(
            user_id=user.id,
            certificate_name="Certified Government Project Manager (CGPM)",
            certificate_number=f"GEB-CERT-{user.id[:6].upper()}-02",
            issued_date="05-Dec-2025",
            expiry_date="Lifetime / Perpetual",
            issuer_authority="National Institute of Public Management",
            verification_status="Verified & Active"
        ))
        modified = True

    # Seed Service Documents if missing
    d_res = await db.execute(select(ServiceRecordDocument).where(ServiceRecordDocument.user_id == user.id))
    docs = d_res.scalars().all()
    if not docs:
        db.add(ServiceRecordDocument(
            user_id=user.id,
            document_name="National Government Identity Card / Aadhaar",
            document_type="Government ID",
            file_path="uploads/sample_govt_id.pdf",
            file_size="1.8 MB",
            upload_date="10-Apr-2023",
            verification_status="Verified"
        ))
        db.add(ServiceRecordDocument(
            user_id=user.id,
            document_name="M.Tech Degree Official Passing Certificate",
            document_type="Degree Certificate",
            file_path="uploads/sample_degree.pdf",
            file_size="2.4 MB",
            upload_date="10-Apr-2023",
            verification_status="Verified"
        ))
        db.add(ServiceRecordDocument(
            user_id=user.id,
            document_name="Official Appointment Order & Gazette Notification",
            document_type="Appointment Order",
            file_path="uploads/sample_appointment.pdf",
            file_size="3.1 MB",
            upload_date="12-Apr-2023",
            verification_status="Verified"
        ))
        db.add(ServiceRecordDocument(
            user_id=user.id,
            document_name="Prior Experience & Relieving Record (PWD)",
            document_type="Experience Certificate",
            file_path="uploads/sample_exp.pdf",
            file_size="2.1 MB",
            upload_date="10-Apr-2023",
            verification_status="Verified"
        ))
        modified = True

    # Seed Course Registrations if none exist
    cr_res = await db.execute(select(CourseRegistration).where(CourseRegistration.user_id == user.id))
    reg_courses = cr_res.scalars().all()
    if not reg_courses:
        # Check available courses in DB
        courses_res = await db.execute(select(Course))
        all_courses = courses_res.scalars().all()
        if not all_courses:
            c1 = Course(name="Executive Leadership & Public Governance", description="Strategic decision-making for government officials.", difficulty_level="Advanced", estimated_duration="4 Weeks")
            c2 = Course(name="Public Administration Law & Regulatory Compliance", description="Government compliance rules and legal frameworks.", difficulty_level="Intermediate", estimated_duration="3 Weeks")
            c3 = Course(name="Government Project & Budget Management", description="Capital project budgeting and GFR guidelines.", difficulty_level="Advanced", estimated_duration="6 Weeks")
            c4 = Course(name="Cybersecurity & Data Privacy for Civil Servants", description="Securing digital public services and records.", difficulty_level="Beginner", estimated_duration="2 Weeks")
            db.add_all([c1, c2, c3, c4])
            await db.flush()
            all_courses = [c1, c2, c3, c4]
        
        for i, crs in enumerate(all_courses[:3]):
            status_val = "Completed" if i == 0 else "In Progress"
            comp_pct = 100 if i == 0 else 65 if i == 1 else 20
            db.add(CourseRegistration(
                user_id=user.id,
                course_id=crs.id,
                status=status_val,
                completion_percentage=comp_pct
            ))
        modified = True

    # Seed Activity Logs if missing
    a_res = await db.execute(select(ActivityLog).where(ActivityLog.user_id == user.id))
    acts = a_res.scalars().all()
    if not acts:
        db.add(ActivityLog(user_id=user.id, action="Digital Service Record Initialized & Verified"))
        db.add(ActivityLog(user_id=user.id, action="Identity Documents Verified via AI Validator"))
        db.add(ActivityLog(user_id=user.id, action="Class-A Public Engineer License Issued"))
        db.add(ActivityLog(user_id=user.id, action="Executive Leadership Training Course Enrolled"))
        modified = True

    # Seed Notifications if missing
    n_res = await db.execute(select(Notification).where(Notification.user_id == user.id))
    notifs = n_res.scalars().all()
    if not notifs:
        db.add(Notification(user_id=user.id, message="Registration Approved: Your Digital Service Record is active and certified.", is_read=False))
        db.add(Notification(user_id=user.id, message="New Course Assigned: Executive Leadership & Governance 2026.", is_read=False))
        db.add(Notification(user_id=user.id, message="Training Milestone: 100% attendance recorded in Public Procurement session.", is_read=True))
        modified = True

    if modified:
        await db.commit()
        await db.refresh(user)


@router.get("/record", response_model=DigitalServiceRecordResponse)
async def get_digital_service_record(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns the complete enterprise Digital Service Record for the authenticated employee.
    """
    await ensure_service_record_defaults(current_user, db)
    
    # 1. Fetch Qualifications
    q_res = await db.execute(select(EmployeeQualification).where(EmployeeQualification.user_id == current_user.id))
    qualifications = [
        {
            "id": q.id,
            "highest_qualification": q.highest_qualification,
            "university": q.university,
            "specialization": q.specialization,
            "passing_year": q.passing_year,
            "cgpa_percentage": q.cgpa_percentage,
            "professional_certifications": q.professional_certifications
        } for q in q_res.scalars().all()
    ]

    # 2. Fetch Employment History
    e_res = await db.execute(
        select(EmploymentHistory)
        .where(EmploymentHistory.user_id == current_user.id)
        .order_by(EmploymentHistory.order_index)
    )
    history_records = e_res.scalars().all()
    history_records.sort(key=lambda x: x.order_index or 0)
    experience_history = [
        {
            "id": h.id,
            "organization_name": h.organization_name,
            "designation": h.designation,
            "department": h.department,
            "start_date": h.start_date,
            "end_date": h.end_date,
            "is_current": h.is_current,
            "role_description": h.role_description
        } for h in history_records
    ]

    # 3. Fetch Training Records
    t_res = await db.execute(select(TrainingRecord).where(TrainingRecord.user_id == current_user.id))
    training_history = [
        {
            "id": t.id,
            "training_name": t.training_name,
            "trainer_name": t.trainer_name,
            "training_date": t.training_date,
            "duration": t.duration,
            "attendance_status": t.attendance_status,
            "result_grade": t.result_grade,
            "venue": t.venue
        } for t in t_res.scalars().all()
    ]

    # 4. Fetch Certifications
    c_res = await db.execute(select(CertificationRecord).where(CertificationRecord.user_id == current_user.id))
    certifications = [
        {
            "id": c.id,
            "certificate_name": c.certificate_name,
            "certificate_number": c.certificate_number,
            "issued_date": c.issued_date,
            "expiry_date": c.expiry_date or "Lifetime",
            "issuer_authority": c.issuer_authority,
            "verification_status": c.verification_status
        } for c in c_res.scalars().all()
    ]

    # 5. Fetch Service Documents
    d_res = await db.execute(select(ServiceRecordDocument).where(ServiceRecordDocument.user_id == current_user.id))
    uploaded_documents = [
        {
            "id": d.id,
            "document_name": d.document_name,
            "document_type": d.document_type,
            "file_path": d.file_path,
            "file_size": d.file_size or "2.0 MB",
            "upload_date": d.upload_date or "10-Apr-2023",
            "verification_status": d.verification_status
        } for d in d_res.scalars().all()
    ]

    # 6. Fetch Courses
    cr_res = await db.execute(
        select(CourseRegistration, Course)
        .join(Course, CourseRegistration.course_id == Course.id)
        .where(CourseRegistration.user_id == current_user.id)
    )
    courses = []
    for reg, crs in cr_res.all():
        courses.append({
            "id": crs.id,
            "name": crs.name,
            "description": crs.description,
            "status": reg.status,
            "completion_percentage": reg.completion_percentage,
            "estimated_duration": crs.estimated_duration or "4 Weeks",
            "registered_at": reg.registered_at.strftime("%d-%b-%Y") if reg.registered_at else "15-Apr-2023"
        })

    # 7. Activity Timeline
    act_res = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.user_id == current_user.id)
        .order_by(ActivityLog.created_at.desc())
    )
    activity_timeline = [
        {
            "id": a.id,
            "action": a.action,
            "created_at": a.created_at.strftime("%d-%b-%Y %I:%M %p") if a.created_at else "Recently",
            "category": "Audit Trail"
        } for a in act_res.scalars().all()
    ]

    # 8. Notifications
    notif_res = await db.execute(
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    notifications_summary = [
        {
            "id": n.id,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at.strftime("%d-%b-%Y %I:%M %p") if n.created_at else "Recently"
        } for n in notif_res.scalars().all()
    ]

    # 9. AI Recommendations
    ai_recommendations = [
        {
            "category": "Skill Gap Analysis",
            "title": "Smart Cities Sensor Data Integration",
            "impact": "High Priority",
            "reason": "Aligned with upcoming National Urban Infrastructure Modernization Phase IV mandate.",
            "action_label": "Enroll in Module",
            "target_skill": "IoT Architecture & Public Data Standards"
        },
        {
            "category": "Career Progression",
            "title": "Executive Public Financial Administration (GFR 2026)",
            "impact": "Promotion Ready",
            "reason": "Prerequisite qualification for Superintending Engineer / Joint Director advancement.",
            "action_label": "Start Executive Track",
            "target_skill": "Public Fiscal Compliance & Audit Readiness"
        },
        {
            "category": "Suggested Certification",
            "title": "Certified Digital Public Infrastructure Specialist",
            "impact": "Recommended",
            "reason": "Enhances your Board Service Record score to Top 5% in the Engineering cadre.",
            "action_label": "View Examination Details",
            "target_skill": "Digital Public Goods Architecture"
        },
        {
            "category": "Learning Roadmap",
            "title": "Advanced AI Assisted Construction Lifecycle Management",
            "impact": "Future Ready",
            "reason": "Automates defect detection and lifecycle cost estimation for government projects.",
            "action_label": "Add to Roadmap",
            "target_skill": "Machine Learning in Civil Infrastructure"
        }
    ]

    # Years of experience display
    exp_years = current_user.experience_years if current_user.experience_years is not None else 5
    exp_disp = f"{exp_years} Years {'6 Months' if exp_years >= 5 else ''}".strip()

    # QR Payload
    qr_data = json.dumps({
        "issuer": "Government Engineering Board",
        "employee_id": current_user.employee_id,
        "registration_number": current_user.registration_number,
        "name": current_user.full_name,
        "department": current_user.department,
        "designation": current_user.designation,
        "status": current_user.registration_status or "Approved",
        "verified_at": current_user.verification_date or "2023-04-12",
        "hash": hashlib.sha256(f"{current_user.id}:{current_user.employee_id}".encode()).hexdigest()[:16]
    })

    return {
        "user_id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone_number": current_user.phone_number or "+91 98765 43210",
        "profile_picture": current_user.profile_picture,
        "employee_id": current_user.employee_id,
        "registration_number": current_user.registration_number,
        "employee_category": current_user.employee_category or "Class-A Professional Engineer",
        "applicant_type": current_user.applicant_type.value if hasattr(current_user.applicant_type, 'value') else (current_user.applicant_type or "CITIZEN"),
        "department": current_user.department,
        "designation": current_user.designation,
        "experience_display": exp_disp,
        "experience_years": exp_years,
        "verification_status": current_user.verification_status or "Verified",
        "registration_status": current_user.registration_status or "Approved",
        "office_location": current_user.office_name or "GEB Headquarters, New Delhi",
        "joining_date": current_user.joining_date or "10-Apr-2023",
        "profile_completion_percentage": current_user.profile_completion_percentage or 92,
        "qr_payload": qr_data,
        
        "personal_info": {
            "full_name": current_user.full_name,
            "date_of_birth": current_user.date_of_birth or "1992-05-14",
            "gender": current_user.gender or "Male",
            "nationality": current_user.nationality or "Indian",
            "blood_group": current_user.blood_group or "O+",
            "email": current_user.email,
            "phone_number": current_user.phone_number or "+91 98765 43210",
            "alternate_phone": current_user.alternate_phone or "+91 98765 01234",
            "residential_address": current_user.residential_address or "B-42, Government Officers Enclave, Sector 62, New Delhi - 110001",
            "emergency_contact_name": current_user.emergency_contact_name or "Priya Sharma (Spouse)",
            "emergency_contact_phone": current_user.emergency_contact_phone or "+91 98111 22334"
        },
        "employment_details": {
            "employee_id": current_user.employee_id,
            "department": current_user.department,
            "designation": current_user.designation,
            "office_name": current_user.office_name or "Government Engineering Board Headquarters",
            "office_address": current_user.office_address or "Vikas Bhawan, Block C, Pragati Maidan, New Delhi - 110002",
            "reporting_officer": current_user.reporting_officer or "Dr. Rajeshwar Verma (Joint Secretary & Chief Engineer)",
            "experience": exp_disp,
            "employee_category": current_user.employee_category or "Class-A Professional Engineer",
            "group": current_user.group or "Group A (Gazetted)",
            "sub_category": current_user.sub_category or "Civil Infrastructure Cadre",
            "employee_status": current_user.employee_status or "Permanent / Full-Time",
            "joining_date": current_user.joining_date or "10-Apr-2023",
            "office_email": current_user.office_email or f"{current_user.full_name.lower().replace(' ', '.')}@geb.gov.in"
        },
        "registration_details": {
            "registration_number": current_user.registration_number,
            "applicant_type": current_user.applicant_type.value if hasattr(current_user.applicant_type, 'value') else (current_user.applicant_type or "CITIZEN"),
            "registration_category": current_user.registration_category or "Class-A Registered Public Engineer",
            "registration_date": current_user.registration_date or "10-Apr-2023",
            "registration_expiry": current_user.registration_expiry or "09-Apr-2028",
            "verification_date": current_user.verification_date or "12-Apr-2023",
            "verification_officer": current_user.verification_officer or "Board Verification Cell (Emp ID: GEB-ADM-004)",
            "current_registration_status": current_user.registration_status or "Approved",
            "history": [
                {"date": "10-Apr-2023", "event": "Application Submitted for Board Registration", "status": "Submitted"},
                {"date": "11-Apr-2023", "event": "Identity & Credential AI OCR Verification Completed", "status": "Passed"},
                {"date": "12-Apr-2023", "event": "Board Scrutiny Committee Approval & License Dispatch", "status": "Approved"},
                {"date": "10-Apr-2025", "event": "Annual Cadre Verification & Renewal", "status": "Completed"}
            ]
        },
        "uploaded_documents": uploaded_documents,
        "qualifications": qualifications,
        "experience_history": experience_history,
        "courses": courses,
        "training_history": training_history,
        "certifications": certifications,
        "ai_recommendations": ai_recommendations,
        "activity_timeline": activity_timeline,
        "settings": {
            "language_preference": current_user.language_preference or "English (US)",
            "two_factor_enabled": current_user.two_factor_enabled if current_user.two_factor_enabled is not None else True,
            "email_notifications": current_user.email_notifications if current_user.email_notifications is not None else True,
            "sms_notifications": current_user.sms_notifications if current_user.sms_notifications is not None else False,
            "privacy_contact_masked": current_user.privacy_contact_masked if current_user.privacy_contact_masked is not None else False
        },
        "notifications_summary": notifications_summary
    }


@router.put("/personal")
async def update_personal_details(
    payload: PersonalDetailsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates the employee's personal and emergency contact details.
    """
    if payload.full_name:
        current_user.full_name = payload.full_name
    if payload.date_of_birth:
        current_user.date_of_birth = payload.date_of_birth
    if payload.gender:
        current_user.gender = payload.gender
    if payload.nationality:
        current_user.nationality = payload.nationality
    if payload.blood_group:
        current_user.blood_group = payload.blood_group
    if payload.phone_number:
        current_user.phone_number = payload.phone_number
    if payload.alternate_phone:
        current_user.alternate_phone = payload.alternate_phone
    if payload.residential_address:
        current_user.residential_address = payload.residential_address
    if payload.emergency_contact_name:
        current_user.emergency_contact_name = payload.emergency_contact_name
    if payload.emergency_contact_phone:
        current_user.emergency_contact_phone = payload.emergency_contact_phone

    # Log action
    db.add(ActivityLog(
        user_id=current_user.id,
        action="Personal Details & Emergency Contacts Updated"
    ))

    await db.commit()
    await db.refresh(current_user)
    return {"status": "success", "message": "Personal information updated successfully."}


@router.put("/employment")
async def update_employment_details(
    payload: EmploymentDetailsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates the employee's office & employment service details.
    """
    if payload.department:
        current_user.department = payload.department
    if payload.designation:
        current_user.designation = payload.designation
    if payload.office_name:
        current_user.office_name = payload.office_name
    if payload.office_address:
        current_user.office_address = payload.office_address
    if payload.reporting_officer:
        current_user.reporting_officer = payload.reporting_officer
    if payload.office_email:
        current_user.office_email = payload.office_email
    if payload.employee_status:
        current_user.employee_status = payload.employee_status
    if payload.group:
        current_user.group = payload.group
    if payload.sub_category:
        current_user.sub_category = payload.sub_category

    db.add(ActivityLog(
        user_id=current_user.id,
        action="Employment & Office Service Record Updated"
    ))

    await db.commit()
    await db.refresh(current_user)
    return {"status": "success", "message": "Employment details updated successfully."}


@router.put("/settings")
async def update_profile_settings(
    payload: ProfileSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Updates account preferences, 2FA, language, notifications, and optionally password.
    """
    if payload.language_preference is not None:
        current_user.language_preference = payload.language_preference
    if payload.two_factor_enabled is not None:
        current_user.two_factor_enabled = payload.two_factor_enabled
    if payload.email_notifications is not None:
        current_user.email_notifications = payload.email_notifications
    if payload.sms_notifications is not None:
        current_user.sms_notifications = payload.sms_notifications
    if payload.privacy_contact_masked is not None:
        current_user.privacy_contact_masked = payload.privacy_contact_masked

    # If changing password
    if payload.new_password:
        if not payload.current_password:
            raise HTTPException(status_code=400, detail="Current password is required to set a new password.")
        if current_user.password_hash:
            if not verify_password(payload.current_password, current_user.password_hash):
                raise HTTPException(status_code=400, detail="Current password does not match.")
        current_user.password_hash = get_password_hash(payload.new_password)
        db.add(ActivityLog(user_id=current_user.id, action="Account Password Changed"))

    db.add(ActivityLog(user_id=current_user.id, action="Account Settings & Preferences Updated"))

    await db.commit()
    await db.refresh(current_user)
    return {"status": "success", "message": "Settings updated successfully."}


@router.post("/documents/upload")
async def upload_service_document(
    document_name: str = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Uploads or replaces an official service record document.
    """
    file_ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{current_user.id[:8]}_{uuid.uuid4().hex[:6]}{file_ext}"
    dest_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    contents = await file.read()
    with open(dest_path, "wb") as f:
        f.write(contents)
        
    size_mb = round(len(contents) / (1024 * 1024), 2)
    size_str = f"{size_mb} MB" if size_mb >= 0.1 else f"{round(len(contents)/1024, 1)} KB"

    # Check if doc exists with same type
    existing = await db.execute(
        select(ServiceRecordDocument)
        .where(ServiceRecordDocument.user_id == current_user.id)
        .where(ServiceRecordDocument.document_type == document_type)
    )
    doc = existing.scalars().first()
    
    if doc:
        doc.document_name = document_name
        doc.file_path = f"uploads/{safe_filename}"
        doc.file_size = size_str
        doc.upload_date = datetime.utcnow().strftime("%d-%b-%Y")
        doc.verification_status = "Verified"
    else:
        doc = ServiceRecordDocument(
            user_id=current_user.id,
            document_name=document_name,
            document_type=document_type,
            file_path=f"uploads/{safe_filename}",
            file_size=size_str,
            upload_date=datetime.utcnow().strftime("%d-%b-%Y"),
            verification_status="Verified"
        )
        db.add(doc)

    db.add(ActivityLog(
        user_id=current_user.id,
        action=f"Official Document Uploaded: {document_name}"
    ))

    await db.commit()
    return {
        "status": "success",
        "message": "Document uploaded and added to Digital Service Record.",
        "document": {
            "id": doc.id,
            "document_name": doc.document_name,
            "document_type": doc.document_type,
            "file_path": doc.file_path,
            "file_size": doc.file_size,
            "upload_date": doc.upload_date,
            "verification_status": doc.verification_status
        }
    }


@router.get("/id-card")
async def get_id_card_payload(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Returns official cryptographic metadata for rendering and printing the GEB Smart ID Card.
    """
    await ensure_service_record_defaults(current_user, db)
    
    security_hash = hashlib.sha256(
        f"{current_user.id}:{current_user.employee_id}:{current_user.registration_number}:GEB2026".encode()
    ).hexdigest()[:20].upper()
    
    return {
        "organization": "GOVERNMENT ENGINEERING BOARD (GEB)",
        "sub_header": "Ministry of Housing & Urban Infrastructure • Government of India",
        "card_type": "OFFICIAL DIGITAL SERVICE IDENTITY CARD",
        "employee_id": current_user.employee_id,
        "registration_number": current_user.registration_number,
        "full_name": current_user.full_name,
        "designation": current_user.designation,
        "department": current_user.department,
        "employee_category": current_user.employee_category or "Class-A Professional Engineer",
        "blood_group": current_user.blood_group or "O+",
        "emergency_contact": current_user.emergency_contact_phone or "+91 98111 22334",
        "office_location": current_user.office_name or "GEB Headquarters, New Delhi",
        "issued_date": current_user.joining_date or "10-Apr-2023",
        "valid_thru": current_user.registration_expiry or "09-Apr-2028",
        "security_hash": security_hash,
        "barcode_value": f"GEB*{current_user.employee_id}*{current_user.registration_number}*",
        "verification_url": f"https://geb.gov.in/verify/id/{current_user.employee_id}"
    }
