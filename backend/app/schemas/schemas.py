from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
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
    credential: str  # The ID token from Google

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
    # Corrected values from the user
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
