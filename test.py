from pdf2image import convert_from_path

# Set paths for tesseract and poppler (adjust these to your local paths)
POPPLER_PATH = r'C:\Python Projects\OCR Rural Stint\Release-24.08.0-0\poppler-24.08.0\Library\bin'
TESSERACT_CMD = r'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'
pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

def extract_text_from_pdf(file_path):
    """Extracts text from a PDF file using PyPDF2."""
    with open(file_path, 'rb') as file:
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

def process_eshram(file_path):
    """Extracts data from E-Shram card PDFs using OCR."""
    pages = convert_from_path(file_path, 500, poppler_path=POPPLER_PATH)
    text = pytesseract.image_to_string((pages[0]))

    # Regex patterns
    patterns = {
        'name': r"Name-.*?/(.*?)\n",
        'dob': r"DOB\s*:\s*(\d{2}/\d{2}/\d{4})",
        'gender': r"Gender\s*:\s*(\w+)",
        'address': r"Current Address :(.*?)\n",
        'phone': r"Contact Number :\s*(\d{10})"
    }

    # Extract data using regex
    matches = {}
    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        matches[key] = match.group(1).strip() if match else "Not found"

    # Clean up address if found
    if matches['address'] != "Not found":
        matches['address'] = matches['address'].replace("\n", " ").strip()

    return {
        "beneficiaryName": matches['name'],
        "dob": matches['dob'],
        "gender": matches['gender'],
        "area": matches['address'],
        "phoneNumber": matches['phone']
    }

def process_abha(text):
    """Extracts data from ABHA card text."""
    text_list = text.split("\n")
    text_list[4] = re.sub(r' ', '', text_list[4])

    name = text_list[0]
    dob = text_list[3]
    gender = ("Male" if re.search(r"bhai", name, re.IGNORECASE) 
             else "Female" if re.search(r"ben", name, re.IGNORECASE) 
             else "")
    
    return {
        "beneficiaryName": name,
        "dob": dob,
        "gender": gender,
        "area": "",
        "phoneNumber": text_list[4]
    }

def process_ayushman(text):
    """Extracts data from Ayushman card text."""
    text_list = text.split("\n")
    
    # Clean up the area field
    area = text_list[2][9:]
    area = re.sub(r'[0-9-]+', '', area).strip()
    
    # Extract name and other details
    name = re.search(r"^(.+)$", text, re.MULTILINE).group(1).strip()
    dob_gender_match = re.search(r"^(\d{4})\s([MF])$", text, re.MULTILINE)
    
    if dob_gender_match:
        dob = dob_gender_match.group(1)
        gender = "Male" if dob_gender_match.group(2) == "M" else "Female"
    else:
        dob = "Not found"
        gender = "Not found"

    return {
        "beneficiaryName": name,
        "dob": dob,
        "gender": gender,
        "area": area,
        "phoneNumber": ""
    }

def process_pdf(file_path):
    """Main function to process a PDF file and extract data."""
    try:
        # First try to extract text using PyPDF2
        text = extract_text_from_pdf(file_path)
        
        # Determine the type of card and process accordingly
        if not text:
            return process_eshram(file_path)
        elif re.search(r"abdm", text, re.IGNORECASE):
            return process_abha(text)
        else:
            return process_ayushman(text)
            
    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return {
            "beneficiaryName": "Error",
            "dob": "Error",
            "gender": "Error",
            "area": "Error",
            "phoneNumber": "Error"
        }

def get_team_members():
    """Returns the list of team members."""
    return [
        'Bharvad Bahadur', 'Chauhan Tejashkumar Revadas', 'Chetan Tadvi',
        'Dinbandhu Tadvi', 'Kanchan Vasava', 'Kiranbhai', 'Manishbhau',
        'Nikita Chauhan', 'Nimisha Tadvi', 'Nitin Vasava',
        'Tadvi Rajnishbhai Prabhubhai', 'Tadvi Aruna', 'Tadvi Saurabh Bhai',
        'Tadvi Tejal', 'Tadvichetan', 'Vasava Charlesh Kumar', 'Yuvraj Vasava'
    ]

# Example usage:
if __name__ == "__main__":
    # Test with a sample PDF
    file_path = "sample.pdf"
    result = process_pdf(file_path)
    print(result)
