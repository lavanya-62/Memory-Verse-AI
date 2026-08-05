import os
import json
import shutil
import fitz

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from google import genai

from database import conn, cursor
from chroma_db import collection


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise Exception("GEMINI_API_KEY not found in .env")

print("Gemini API Loaded")

client = genai.Client(api_key=API_KEY)


def generate_with_gemini(prompt):
    models = [
        "gemini-3.5-flash",
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
    ]

    last_error = None

    for model in models:
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
            )
            return response
        except Exception as e:
            print(f"{model} failed:", e)
            last_error = e

    raise last_error


print("Available Models:\n")

for model in client.models.list():
    print(model.name)


app = FastAPI(title="MemoryVerse AI")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://memory-verse-ai-49l3-git-main-lavanya-62s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "status": "Running",
        "project": "MemoryVerse AI"
    }



@app.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):

    try:

        if not file.filename.lower().endswith(".pdf"):
            return {
                "error": "Only PDF files are supported."
            }

        file_path = os.path.join(
            UPLOAD_FOLDER,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        pdf = fitz.open(file_path)

        text = ""

        for page in pdf:
            text += page.get_text()

        pdf.close()

        prompt = f"""
You are an expert Resume Analyzer.

Return ONLY valid JSON.

{{
"document_type":"",
"summary":"",
"skills":[],
"projects":[],
"certifications":[],
"internships":[],
"achievements":[]
}}

Resume

{text}
"""

        response = generate_with_gemini(prompt)

        try:

            text = response.text.strip()

            if text.startswith("```json"):
                text = text.replace("```json", "").replace("```", "").strip()

            analysis = json.loads(text)

        except:

            analysis = {
                "document_type": "Unknown",
                "summary": response.text,
                "skills": [],
                "projects": [],
                "certifications": [],
                "internships": [],
                "achievements": []
            }

        cursor.execute(
            """
            INSERT INTO documents(
            filename,
            document_type,
            summary,
            skills,
            projects,
            certifications,
            internships,
            achievements
            )
            VALUES(?,?,?,?,?,?,?,?)
            """,
            (
                file.filename,
                analysis["document_type"],
                analysis["summary"],
                json.dumps(analysis["skills"]),
                json.dumps(analysis["projects"]),
                json.dumps(analysis["certifications"]),
                json.dumps(analysis["internships"]),
                json.dumps(analysis["achievements"])
            )
        )

        conn.commit()

        try:
            collection.delete(ids=[file.filename])
        except:
            pass

        collection.add(
            ids=[file.filename],
            documents=[json.dumps(analysis)]
        )

        return {
            "filename": file.filename,
            "analysis": analysis
        }

    except Exception as e:

        return {
            "error": str(e)
        }

   
@app.get("/documents")
def get_documents():

    cursor.execute("""
        SELECT
            id,
            filename,
            document_type,
            summary,
            skills,
            projects,
            certifications,
            internships,
            achievements
        FROM documents
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()

    documents = []

    for row in rows:

        documents.append({

            "id": row[0],
            "filename": row[1],
            "document_type": row[2],
            "summary": row[3],

            "skills": json.loads(row[4]) if row[4] else [],

            "projects": json.loads(row[5]) if row[5] else [],

            "certifications": json.loads(row[6]) if row[6] else [],

            "internships": json.loads(row[7]) if row[7] else [],

            "achievements": json.loads(row[8]) if row[8] else []

        })

    return documents




@app.get("/analyze/{doc_id}")
def get_analysis(doc_id: int):

    cursor.execute("""

        SELECT
            id,
            filename,
            document_type,
            summary,
            skills,
            projects,
            certifications,
            internships,
            achievements

        FROM documents

        WHERE id=?

    """, (doc_id,))

    row = cursor.fetchone()

    if row is None:

        return {
            "error": "Document not found"
        }

    skills = json.loads(row[4]) if row[4] else []

    projects = json.loads(row[5]) if row[5] else []

    certifications = json.loads(row[6]) if row[6] else []

    internships = json.loads(row[7]) if row[7] else []

    achievements = json.loads(row[8]) if row[8] else []

    recommendation = (
        "Build more real-world projects, add cloud technologies "
        "like AWS and Docker, and earn certifications to strengthen "
        "your profile."
    )

    return {

        "id": row[0],

        "filename": row[1],

        "document_type": row[2],

        "summary": row[3],

        "skills": skills,

        "projects": projects,

        "certifications": certifications,

        "experience": internships,

        "achievements": achievements,

        "education": "B.Tech Computer Science and Business Systems",

        "keywords": skills,

        "recommendation": recommendation

    }



@app.get("/search")
def keyword_search(keyword: str):

    cursor.execute("SELECT * FROM documents")

    rows = cursor.fetchall()

    results = []

    for row in rows:

        data = {

            "id": row[0],

            "filename": row[1],

            "document_type": row[2],

            "summary": row[3],

            "skills": json.loads(row[4]),

            "projects": json.loads(row[5]),

            "certifications": json.loads(row[6]),

            "internships": json.loads(row[7]),

            "achievements": json.loads(row[8])

        }

        if keyword.lower() in json.dumps(data).lower():

            results.append(data)

    return {

        "count": len(results),

        "results": results

    }



@app.get("/ai-search")
def ai_search(question: str):

    try:

        search_result = collection.query(

            query_texts=[question],

            n_results=3

        )

        docs = search_result["documents"][0]

        if len(docs) == 0:

            return {

                "answer": "No matching document found."

            }

        context = "\n\n".join(docs)

        prompt = f"""

You are MemoryVerse AI.

Answer ONLY using the following context.

Context:

{context}

Question:

{question}

Give a short and accurate answer.

"""

        response = generate_with_gemini(prompt)

        return {

            "question": question,

            "answer": response.text

        }

    except Exception as e:

        return {

            "error": str(e)

        }



@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int):

    cursor.execute(
        "SELECT filename FROM documents WHERE id=?",
        (doc_id,)
    )

    row = cursor.fetchone()

    if row is None:

        return {
            "error": "Document not found"
        }

    filename = row[0]

    

    try:

        collection.delete(ids=[filename])

    except Exception:

        pass

    

    file_path = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    if os.path.exists(file_path):

        os.remove(file_path)

   

    cursor.execute(

        "DELETE FROM documents WHERE id=?",

        (doc_id,)

    )

    conn.commit()

    return {

        "message": "Document deleted successfully."

    }



@app.get("/dashboard")
def dashboard():

    cursor.execute("SELECT * FROM documents")

    rows = cursor.fetchall()

    total_documents = len(rows)

    total_skills = 0
    total_projects = 0
    total_certifications = 0
    total_achievements = 0
    resume_count = 0

    recent_documents = []

    for row in rows:

        if row[2] == "Resume":
            resume_count += 1

        skills = json.loads(row[4]) if row[4] else []
        projects = json.loads(row[5]) if row[5] else []
        certifications = json.loads(row[6]) if row[6] else []
        achievements = json.loads(row[8]) if row[8] else []

        total_skills += len(skills)
        total_projects += len(projects)
        total_certifications += len(certifications)
        total_achievements += len(achievements)

        recent_documents.append({

            "id": row[0],

            "filename": row[1],

            "document_type": row[2]

        })

    all_skills = []

    for row in rows:

        skills = json.loads(row[4]) if row[4] else []

        all_skills.extend(skills)

    skill_frequency = {}

    for skill in all_skills:

        skill_frequency[skill] = skill_frequency.get(skill, 0) + 1

    top_skills = sorted(

        skill_frequency.items(),

        key=lambda x: x[1],

        reverse=True

    )[:5]

    return {

        "total_documents": total_documents,

        "total_skills": total_skills,

        "total_projects": total_projects,

        "total_certifications": total_certifications,

        "total_achievements": total_achievements,

        "resume_count": resume_count,

        "other_documents": total_documents - resume_count,

        "top_skills": top_skills,

        "recent_documents": recent_documents[-5:]

    }




@app.get("/health")
def health():

    return {

        "status": "success",

        "message": "MemoryVerse AI Backend Running",

        "database": "SQLite Connected",

        "vector_database": "ChromaDB Connected",

        "ai_model": "Gemini Connected"

    }




if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )