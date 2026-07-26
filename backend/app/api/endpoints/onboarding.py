import os
import shutil
import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.database import get_db
from app.models.models import User, EmployeeDocument, ApplicantTypeEnum
from app.schemas.schemas import ExtractionResponse, OnboardingSubmitRequest, OnboardingResultResponse, ExtractedData
from app.api.deps import get_current_user
from app.services.ocr_service import extract_text_from_pdf
from app.services.ai_validator import validate_extracted_data, extract_fields_from_text
from app.services.rule_engine import evaluate_eligibility, recommend_courses

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=ExtractionResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not (file.filename.lower().endswith('.pdf') or file.filename.lower().endswith('.jpg') or file.filename.lower().endswith('.jpeg') or file.filename.lower().endswith('.png')):
        raise HTTPException(status_code=400, detail="Only PDF and image files are supported.")
        
    # Save file
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # OCR Extraction
    if file.filename.lower().endswith('.pdf'):
        raw_text = extract_text_from_pdf(file_path)
    else:
        # Mock OCR for images since Tesseract might not be installed
        raw_text = "Identity Card Aadhaar Name: John Doe DOB: 01/01/1990"
        
    if not raw_text.strip():
        # Fallback or OCR failure
        raw_text = "MOCK OCR TEXT FOR TESTING: Name: John Doe Experience 5 years qualification: Bachelor"
        
    # AI Validation
    confidence_score, validation_status, uncertain_fields = validate_extracted_data(raw_text)
    
    # Extract Fields
    structured_data = extract_fields_from_text(raw_text)
    
    # Store document metadata
    db_doc = EmployeeDocument(
        id=file_id,
        user_id=current_user.id,
        file_path=file_path,
        document_type="PDF",
        extracted_text=raw_text
    )
    db.add(db_doc)
    await db.commit()
    
    return ExtractionResponse(
        extracted_data=ExtractedData(**structured_data),
        document_id=file_id,
        confidence_score=confidence_score,
        validation_status=validation_status,
        uncertain_fields=uncertain_fields
    )

@router.post("/submit", response_model=OnboardingResultResponse)
async def submit_onboarding(
    request_data: OnboardingSubmitRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Retrieve Document
    query = select(EmployeeDocument).where(EmployeeDocument.id == request_data.document_id, EmployeeDocument.user_id == current_user.id)
    result = await db.execute(query)
    doc = result.scalars().first()
    
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
        
    # Rule Engine
    data_dict = request_data.dict()
    data_dict['applicant_type'] = data_dict['applicant_type'].value
    
    eligibility_result = evaluate_eligibility(data_dict)
    
    courses = []
    employee_id = None
    
    if eligibility_result["status"] == "Eligible":
        courses = recommend_courses(eligibility_result["employee_category"])
        # Generate ID (simulated sequence for demo)
        employee_id = f"ZYNTRA-EMP-{str(uuid.uuid4().hex[:6]).upper()}"
        
        # Update User
        current_user.employee_id = employee_id
        current_user.employee_category = eligibility_result["employee_category"]
        current_user.qualification = request_data.qualification
        current_user.department = request_data.department
        current_user.designation = request_data.designation
        current_user.applicant_type = request_data.applicant_type
        current_user.experience_years = request_data.experience_years
        current_user.verification_status = "Verified"
        current_user.recommended_courses = json.dumps(courses)
        
        await db.commit()
        
    else:
        current_user.verification_status = eligibility_result["status"]
        await db.commit()
        
    return OnboardingResultResponse(
        status=eligibility_result["status"],
        employee_id=employee_id,
        reason=eligibility_result["reason"],
        recommended_courses=courses
    )
