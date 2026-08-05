import re
from typing import Dict, Any, Tuple

def validate_extracted_data(text: str) -> Tuple[int, str, list]:
    """
    Validates extracted text using heuristics to simulate an AI.
    Returns: (confidence_score, validation_status, uncertain_fields)
    """
    confidence_score = 100
    uncertain_fields = []
    
    text_lower = text.lower()
    
    # Heuristic: Check if document looks like an experience certificate
    is_exp = "experience" in text_lower or "certificate" in text_lower or "employment" in text_lower
    # Heuristic: Check if it looks like an educational certificate
    is_edu = "degree" in text_lower or "university" in text_lower or "college" in text_lower or "qualification" in text_lower
    # Heuristic: Check if residence permit
    is_res = "residence" in text_lower or "permit" in text_lower or "visa" in text_lower
    
    # Heuristic: Check if identity card
    is_id = "identity" in text_lower or "id" in text_lower or "aadhaar" in text_lower or "passport" in text_lower
    
    if not (is_exp or is_edu or is_res or is_id):
        confidence_score -= 30
        uncertain_fields.append("Document Type")
        
    # Check for blurriness (simulated by low word count)
    words = text.split()
    if len(words) < 20:
        confidence_score -= 20
        uncertain_fields.append("Readability")
        
    # Determine Status
    if confidence_score >= 90:
        status = "Verified"
    elif confidence_score >= 60:
        status = "Manual Review Required"
    else:
        status = "Not Verified"
        
    return confidence_score, status, uncertain_fields

def extract_fields_from_text(text: str) -> Dict[str, Any]:
    """
    Extracts structured fields from raw text using regex.
    """
    data = {}
    
    # Try to extract full name (Look for Name: John Doe)
    name_match = re.search(r'(?i)name[:\s]+([A-Za-z\s]+)', text)
    if name_match:
        data['full_name'] = name_match.group(1).strip()
        
    # Department
    dept_match = re.search(r'(?i)department[:\s]+([A-Za-z\s]+)', text)
    if dept_match:
        data['department'] = dept_match.group(1).strip()
        
    # Designation
    desig_match = re.search(r'(?i)designation[:\s]+([A-Za-z\s]+)', text)
    if desig_match:
        data['designation'] = desig_match.group(1).strip()
        
    # Experience
    exp_match = re.search(r'(?i)(\d+)\s+(?:years|yrs)\s+experience', text)
    if exp_match:
        data['experience_years'] = int(exp_match.group(1))
        
    # Qualification
    qual_match = re.search(r'(?i)(bachelor|master|phd|diploma|degree)', text)
    if qual_match:
        data['qualification'] = qual_match.group(1).capitalize()
        
    return data
