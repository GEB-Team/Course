import pdfplumber
import os

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts text from a given PDF file using pdfplumber."""
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        return text
    except Exception as e:
        print(f"Error in OCR extraction: {e}")
        return ""
