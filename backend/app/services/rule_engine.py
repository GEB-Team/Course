from typing import Dict, Any

def evaluate_eligibility(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Executes government business rules to determine eligibility.
    """
    applicant_type = data.get("applicant_type")
    try:
        experience_years = int(data.get("experience_years", 0))
    except (ValueError, TypeError):
        experience_years = 0
        
    residence_validity_months = data.get("residence_validity_months", 12)
    
    result = {
        "status": "Not Eligible",
        "employee_category": None,
        "reason": None
    }
    
    if applicant_type == "CITIZEN":
        if experience_years >= 5:
            result["status"] = "Eligible"
            result["employee_category"] = "Professional"
        elif experience_years >= 2:
            result["status"] = "Eligible"
            result["employee_category"] = "Graduate"
        elif experience_years >= 0:
            result["status"] = "Eligible"
            result["employee_category"] = "Entry-Level Associate"
        else:
            result["status"] = "Manual Review Required"
            result["reason"] = "Invalid experience recorded."
    
    elif applicant_type == "NON_CITIZEN":
        if residence_validity_months < 6 and experience_years < 4:
            result["status"] = "Manual Review Required"
            result["reason"] = "Residence validity must exceed six months or experience must be at least four years."
        elif experience_years >= 3:
            result["status"] = "Eligible"
            result["employee_category"] = "Professional Temporary"
        elif experience_years >= 0:
            result["status"] = "Eligible"
            result["employee_category"] = "Temporary Associate"
        else:
            result["status"] = "Manual Review Required"
            result["reason"] = "Experience requirements pending manual verification."
    else:
        result["status"] = "Not Eligible"
        result["reason"] = "Invalid Applicant Type."
        
    return result

def recommend_courses(employee_category: str) -> list:
    """
    Recommends training courses based on employee category.
    """
    if employee_category == "Entry-Level Associate":
        return [
            "Government Workplace Orientation",
            "Public Service Ethics & Conduct",
            "Digital Office Tools & E-Governance Basics",
            "Cybersecurity & Data Privacy Awareness"
        ]
    elif employee_category == "Graduate":
        return [
            "Government Office Procedures",
            "Communication & Administrative Writing Skills",
            "Digital File Management & Workflows",
            "Public Service Ethics & Compliance"
        ]
    elif employee_category == "Professional":
        return [
            "Executive Leadership & Governance",
            "Public Administration Law & Regulatory Compliance",
            "Government Project & Budget Management",
            "Data Analytics for Policy Decision Making",
            "Advanced Cyber & Information Security"
        ]
    elif employee_category in ["Professional Temporary", "Temporary Associate"]:
        return [
            "Temporary Employee Orientation",
            "Safety & Workplace Procedures",
            "Government Standard Protocols",
            "Digital Workplace Fundamentals"
        ]
    
    return [
        "Government Workplace Orientation",
        "Public Service Ethics"
    ]
