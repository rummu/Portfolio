import os
import time
import numpy as np
import faiss
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv

# --- Load .env from chatbot-api/ or parent portfolio directory ---
env_path = Path(__file__).resolve().parent.parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# --- Configuration ---
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
EMBEDDING_MODEL = "models/gemini-embedding-001"
GENERATION_MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-2.5-flash"]  # Fallback list
TOP_K = 3  # Number of relevant chunks to retrieve
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

# --- Initialize FastAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global state (cached across warm invocations) ---
faiss_index = None
chunks = []
chunk_embeddings = None


def load_knowledge_base():
    """Load and chunk the knowledge base file by section headers."""
    kb_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge_base.txt")
    with open(kb_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Split by section headers (## SECTION_NAME)
    sections = content.split("\n## ")
    result = []
    for section in sections:
        section = section.strip()
        if not section:
            continue
        # Add back the header prefix if it was removed by split
        if not section.startswith("## "):
            section = "## " + section
        result.append(section)
    return result


def get_embedding(text: str) -> list:
    """Get embedding for a single text using Google's embedding model."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def get_query_embedding(text: str) -> list:
    """Get embedding for a query using Google's embedding model."""
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]


def build_faiss_index():
    """Build the FAISS index from knowledge base chunks."""
    global faiss_index, chunks, chunk_embeddings

    if faiss_index is not None:
        return  # Already built (warm invocation)

    # Configure Gemini
    genai.configure(api_key=GEMINI_API_KEY)

    # Load and chunk knowledge base
    chunks = load_knowledge_base()

    # Generate embeddings for all chunks with retry logic
    embeddings = []
    for chunk in chunks:
        for attempt in range(MAX_RETRIES):
            try:
                emb = get_embedding(chunk)
                embeddings.append(emb)
                break
            except Exception as e:
                if "429" in str(e) and attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY * (attempt + 1))
                else:
                    raise

    chunk_embeddings = np.array(embeddings, dtype=np.float32)

    # Build FAISS index (Inner Product for cosine similarity on normalized vectors)
    dimension = chunk_embeddings.shape[1]
    faiss.normalize_L2(chunk_embeddings)
    faiss_index = faiss.IndexFlatIP(dimension)
    faiss_index.add(chunk_embeddings)


def retrieve_relevant_chunks(query: str, top_k: int = TOP_K) -> list:
    """Retrieve the top-k most relevant chunks for a given query."""
    query_emb = np.array([get_query_embedding(query)], dtype=np.float32)
    faiss.normalize_L2(query_emb)

    scores, indices = faiss_index.search(query_emb, top_k)

    results = []
    for i, idx in enumerate(indices[0]):
        if idx < len(chunks):
            results.append({
                "chunk": chunks[idx],
                "score": float(scores[0][i]),
            })
    return results


SYSTEM_PROMPT = """You are Rumman's AI Portfolio Assistant. You answer questions about Rumman Ahmad based ONLY on the provided context below. 

Rules:
1. Only answer questions related to Rumman Ahmad's background, education, skills, experience, projects, publications, awards, certifications, and hobbies.
2. If the question is not related to Rumman or cannot be answered from the context, politely say: "I can only answer questions about Rumman Ahmad. Feel free to ask about his skills, experience, projects, or education!"
3. Be concise, friendly, and professional.
4. Use bullet points for lists when appropriate.
5. Do not make up information that is not in the context.
6. When referring to Rumman, use "Rumman" (not "he" or "the user").

Context:
{context}
"""


def generate_with_retry(prompt: str, user_message: str) -> str:
    """Try generating with multiple models and retry on rate limits."""
    last_error = None
    
    for model_name in GENERATION_MODELS:
        for attempt in range(MAX_RETRIES):
            try:
                model = genai.GenerativeModel(model_name)
                response = model.generate_content(
                    f"System Instructions: {prompt}\n\nUser Question: {user_message}"
                )
                return response.text
            except Exception as e:
                last_error = e
                if "429" in str(e) and attempt < MAX_RETRIES - 1:
                    time.sleep(RETRY_DELAY * (attempt + 1))
                elif "429" in str(e):
                    break  # Try next model
                else:
                    raise
    
    raise last_error


@app.post("/api/chat")
async def chat(request: Request):
    """Handle chat requests with RAG pipeline."""
    try:
        # Build index on first request (or use cached)
        build_faiss_index()

        # Parse request
        body = await request.json()
        user_message = body.get("message", "").strip()

        if not user_message:
            return JSONResponse(
                content={"error": "Message is required"},
                status_code=400,
            )

        # Step 1: Retrieve relevant chunks from FAISS
        relevant_chunks = retrieve_relevant_chunks(user_message)
        context = "\n\n---\n\n".join([r["chunk"] for r in relevant_chunks])

        # Step 2: Generate answer with Gemini (with retry + fallback)
        prompt = SYSTEM_PROMPT.format(context=context)
        answer = generate_with_retry(prompt, user_message)

        return JSONResponse(content={
            "answer": answer,
            "sources": [r["chunk"][:100] + "..." for r in relevant_chunks],
        })

    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg:
            return JSONResponse(
                content={"error": "API rate limit reached. Please wait a moment and try again."},
                status_code=429,
            )
        return JSONResponse(
            content={"error": f"An error occurred: {error_msg}"},
            status_code=500,
        )


@app.options("/api/chat")
async def chat_options():
    """Handle CORS preflight requests."""
    return JSONResponse(content={}, status_code=200)




# .\.venv\Scripts\python.exe -m uvicorn api.chat:app --reload --port 8000



