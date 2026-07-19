from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.models import RoleEnum, ApplicantTypeEnum

class UserCreate(BaseModel):
    full_name: str
    username: Optional[str] = None
    email: EmailStr
    phone_number: Optional[str] = None
    password: str
    confirm_password: str
    
    # Employee Fields
    applicant_type: Optional[ApplicantTypeEnum] = None
    experience_years: Optional[int] = None
    experience_months: Optional[int] = None
    group: Optional[str] = None
    sub_category: Optional[str] = None
    
    # Non-Citizen Fields
    residence_number: Optional[str] = None
    residence_expiry_date: Optional[datetime] = None

    @validator("confirm_password")
    def passwords_match(cls, v, values, **kwargs):
        if "password" in values and v != values["password"]:
            raise ValueError("passwords do not match")
        return v

class UserResponse(BaseModel):
    id: str
    role: RoleEnum
    full_name: str
    email: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class GoogleLoginRequest(BaseModel):
    credential: str

# Document Verification Schemas
class ExtractedData(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    employee_number: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    joining_date: Optional[str] = None
    organization: Optional[str] = None
    residence_number: Optional[str] = None
    residence_expiry_date: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None

class ExtractionResponse(BaseModel):
    extracted_data: ExtractedData
    document_id: str
    confidence_score: int
    validation_status: str
    uncertain_fields: List[str] = []

class OnboardingSubmitRequest(BaseModel):
    document_id: str
    full_name: str
    applicant_type: ApplicantTypeEnum
    experience_years: int
    qualification: str
    department: str
    designation: str
    residence_number: Optional[str] = None
    residence_expiry_date: Optional[str] = None

class OnboardingResultResponse(BaseModel):
    status: str
    employee_id: Optional[str] = None
    reason: Optional[str] = None
    recommended_courses: List[str] = []

# Digital Service Record Profile Schemas
class PersonalDetailsUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    nationality: Optional[str] = None
    blood_group: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    alternate_phone: Optional[str] = None
    residential_address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class EmploymentDetailsUpdate(BaseModel):
    department: Optional[str] = None
    designation: Optional[str] = None
    office_name: Optional[str] = None
    office_address: Optional[str] = None
    reporting_officer: Optional[str] = None
    office_email: Optional[str] = None
    employee_status: Optional[str] = None
    group: Optional[str] = None
    sub_category: Optional[str] = None

class ProfileSettingsUpdate(BaseModel):
    language_preference: Optional[str] = "English (US)"
    two_factor_enabled: Optional[bool] = True
    email_notifications: Optional[bool] = True
    sms_notifications: Optional[bool] = False
    privacy_contact_masked: Optional[bool] = False
    current_password: Optional[str] = None
    new_password: Optional[str] = None

class ServiceDocumentSchema(BaseModel):
    id: str
    document_name: str
    document_type: str
    file_path: str
    file_size: Optional[str] = "2.4 MB"
    upload_date: Optional[str] = None
    verification_status: str

class QualificationSchema(BaseModel):
    id: str
    highest_qualification: str
    university: str
    specialization: str
    passing_year: str
    cgpa_percentage: str
    professional_certifications: Optional[str] = None

class ExperienceHistorySchema(BaseModel):
    id: str
    organization_name: str
    designation: str
    department: str
    start_date: str
    end_date: str
    is_current: bool
    role_description: Optional[str] = None

class TrainingRecordSchema(BaseModel):
    id: str
    training_name: str
    trainer_name: str
    training_date: str
    duration: str
    attendance_status: str
    result_grade: str
    venue: str

class CertificationSchema(BaseModel):
    id: str
    certificate_name: str
    certificate_number: str
    issued_date: str
    expiry_date: Optional[str] = "Lifetime"
    issuer_authority: str
    verification_status: str

class CourseRecordSchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    status: str
    completion_percentage: int
    estimated_duration: Optional[str] = "6 Weeks"
    registered_at: Optional[str] = None

class AIRecommendationSchema(BaseModel):
    category: str
    title: str
    impact: str
    reason: str
    action_label: str
    target_skill: str

class ActivityLogSchema(BaseModel):
    id: str
    action: str
    created_at: str
    category: Optional[str] = "System"

class DigitalServiceRecordResponse(BaseModel):
    # Banner Summary
    user_id: str
    full_name: str
    email: str
    phone_number: Optional[str] = None
    profile_picture: Optional[str] = None
    employee_id: str
    registration_number: str
    employee_category: str
    applicant_type: str
    department: str
    designation: str
    experience_display: str
    experience_years: int
    verification_status: str
    registration_status: str
    office_location: str
    joining_date: str
    profile_completion_percentage: int
    qr_payload: str
    
    # 12 Tab Details
    personal_info: Dict[str, Any]
    employment_details: Dict[str, Any]
    registration_details: Dict[str, Any]
    uploaded_documents: List[ServiceDocumentSchema]
    qualifications: List[QualificationSchema]
    experience_history: List[ExperienceHistorySchema]
    courses: List[CourseRecordSchema]
    training_history: List[TrainingRecordSchema]
    certifications: List[CertificationSchema]
    ai_recommendations: List[AIRecommendationSchema]
    activity_timeline: List[ActivityLogSchema]
    settings: Dict[str, Any]
    notifications_summary: List[Dict[str, Any]]
