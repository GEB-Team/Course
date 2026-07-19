import enum
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class RoleEnum(str, enum.Enum):
    EMPLOYEE = "EMPLOYEE"
    ADMIN = "ADMIN"

class ApplicantTypeEnum(str, enum.Enum):
    CITIZEN = "CITIZEN"
    NON_CITIZEN = "NON_CITIZEN"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    role = Column(Enum(RoleEnum), nullable=False)
    
    # Common Authentication Fields
    full_name = Column(String, nullable=False)
    username = Column(String, unique=True, index=True, nullable=True) # Optional for Google SSO
    email = Column(String, unique=True, index=True, nullable=False)
    phone_number = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)
    
    # Google SSO specific
    google_id = Column(String, unique=True, nullable=True, index=True)
    profile_picture = Column(String, nullable=True)
    
    # Employee Specific Fields
    applicant_type = Column(Enum(ApplicantTypeEnum), nullable=True)
    experience_years = Column(Integer, nullable=True)
    experience_months = Column(Integer, nullable=True)
    group = Column(String, nullable=True)
    sub_category = Column(String, nullable=True)
    
    # Non-Citizen Specific Fields
    residence_number = Column(String, nullable=True)
    residence_expiry_date = Column(DateTime, nullable=True)

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Digital Service Record Core Fields
    employee_id = Column(String, unique=True, index=True, nullable=True)
    employee_category = Column(String, nullable=True) # e.g. Professional, Graduate, Executive
    qualification = Column(String, nullable=True)
    department = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    verification_status = Column(String, default="Verified")
    verification_confidence = Column(Integer, nullable=True)
    recommended_courses = Column(String, nullable=True) # JSON String
    
    # Personal Information
    date_of_birth = Column(String, nullable=True, default="1992-05-14")
    gender = Column(String, nullable=True, default="Male")
    nationality = Column(String, nullable=True, default="Indian")
    blood_group = Column(String, nullable=True, default="O+")
    alternate_phone = Column(String, nullable=True, default="+91 98765 01234")
    residential_address = Column(Text, nullable=True, default="B-42, Government Officers Enclave, Sector 62, New Delhi - 110001")
    emergency_contact_name = Column(String, nullable=True, default="Priya Sharma (Spouse)")
    emergency_contact_phone = Column(String, nullable=True, default="+91 98111 22334")
    
    # Employment Details
    office_name = Column(String, nullable=True, default="Government Engineering Board Headquarters")
    office_address = Column(Text, nullable=True, default="Vikas Bhawan, Block C, Pragati Maidan, New Delhi - 110002")
    reporting_officer = Column(String, nullable=True, default="Dr. Rajeshwar Verma (Joint Secretary & Chief Engineer)")
    office_email = Column(String, nullable=True)
    employee_status = Column(String, nullable=True, default="Permanent / Full-Time")
    joining_date = Column(String, nullable=True, default="2023-04-10")
    
    # Registration Details
    registration_number = Column(String, nullable=True, default="GEB/REG/2026/08912")
    registration_category = Column(String, nullable=True, default="Class-A Registered Public Engineer")
    registration_date = Column(String, nullable=True, default="2023-04-10")
    registration_expiry = Column(String, nullable=True, default="2028-04-09")
    verification_date = Column(String, nullable=True, default="2023-04-12")
    verification_officer = Column(String, nullable=True, default="Board Verification Cell (Emp ID: GEB-ADM-004)")
    registration_status = Column(String, nullable=True, default="Approved")
    
    # Security & Preferences
    profile_completion_percentage = Column(Integer, default=92)
    two_factor_enabled = Column(Boolean, default=True)
    language_preference = Column(String, default="English (US)")
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=False)
    privacy_contact_masked = Column(Boolean, default=False)

    # Relationships
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
    login_history = relationship("LoginHistory", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("EmployeeDocument", back_populates="user", cascade="all, delete-orphan")
    service_documents = relationship("ServiceRecordDocument", back_populates="user", cascade="all, delete-orphan")
    qualifications = relationship("EmployeeQualification", back_populates="user", cascade="all, delete-orphan")
    employment_history = relationship("EmploymentHistory", back_populates="user", cascade="all, delete-orphan")
    training_records = relationship("TrainingRecord", back_populates="user", cascade="all, delete-orphan")
    certification_records = relationship("CertificationRecord", back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="refresh_tokens")

class LoginHistory(Base):
    __tablename__ = "login_history"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    login_time = Column(DateTime, default=datetime.utcnow)
    ip_address = Column(String, nullable=True)
    user_agent = Column(String, nullable=True)

    user = relationship("User", back_populates="login_history")

class EmployeeDocument(Base):
    __tablename__ = "employee_documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    file_path = Column(String, nullable=False)
    document_type = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)
    extracted_text = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")

class ServiceRecordDocument(Base):
    __tablename__ = "service_record_documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_name = Column(String, nullable=False)
    document_type = Column(String, nullable=False) # Govt ID, Experience, Degree, Residence Permit, Appointment Order
    file_path = Column(String, nullable=False)
    file_size = Column(String, nullable=True, default="2.4 MB")
    upload_date = Column(String, nullable=True)
    verification_status = Column(String, default="Verified") # Verified, Pending, Under Review
    
    user = relationship("User", back_populates="service_documents")

class EmployeeQualification(Base):
    __tablename__ = "employee_qualifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    highest_qualification = Column(String, nullable=False) # e.g. M.Tech / B.Tech / MBA
    university = Column(String, nullable=False)
    specialization = Column(String, nullable=False)
    passing_year = Column(String, nullable=False)
    cgpa_percentage = Column(String, nullable=False)
    professional_certifications = Column(Text, nullable=True) # JSON or comma separated

    user = relationship("User", back_populates="qualifications")

class EmploymentHistory(Base):
    __tablename__ = "employment_histories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_name = Column(String, nullable=False)
    designation = Column(String, nullable=False)
    department = Column(String, nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String, nullable=False) # e.g. "Present" or "2023-03-31"
    is_current = Column(Boolean, default=False)
    role_description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    user = relationship("User", back_populates="employment_history")

class TrainingRecord(Base):
    __tablename__ = "training_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    training_name = Column(String, nullable=False)
    trainer_name = Column(String, nullable=False)
    training_date = Column(String, nullable=False)
    duration = Column(String, nullable=False) # e.g. "3 Weeks (45 Hours)"
    attendance_status = Column(String, default="100% Present")
    result_grade = Column(String, default="Distinction (A+)")
    venue = Column(String, default="National Academy of Public Administration")

    user = relationship("User", back_populates="training_records")

class CertificationRecord(Base):
    __tablename__ = "certification_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    certificate_name = Column(String, nullable=False)
    certificate_number = Column(String, unique=True, index=True, nullable=False)
    issued_date = Column(String, nullable=False)
    expiry_date = Column(String, nullable=True, default="Lifetime / Perpetual")
    issuer_authority = Column(String, default="Government Engineering Board Authority")
    verification_status = Column(String, default="Verified & Active")

    user = relationship("User", back_populates="certification_records")

class Course(Base):
    __tablename__ = "courses"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    difficulty_level = Column(String, nullable=True)
    estimated_duration = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CourseRegistration(Base):
    __tablename__ = "course_registrations"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(String, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, default="Pending") # Pending, In Progress, Completed
    completion_percentage = Column(Integer, default=0)
    estimated_completion_date = Column(DateTime, nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="course_registrations")
    course = relationship("Course")

class TrainingSession(Base):
    __tablename__ = "training_sessions"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String, nullable=False)
    trainer = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    time = Column(String, nullable=False)
    venue = Column(String, nullable=False)

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    issue_date = Column(DateTime, default=datetime.utcnow)
    certificate_number = Column(String, unique=True, index=True, nullable=False)
    
    user = relationship("User", backref="certificates")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Integer, nullable=False)
    status = Column(String, default="Pending") # Pending, Completed
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="payments")

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="notifications")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", backref="activity_logs")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
