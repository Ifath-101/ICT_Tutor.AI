import os
from pypdf import PdfReader
import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from services.llm_service import client

# Configuration paths
DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
CHROMA_PATH = os.path.join(DATA_DIR, "chroma_db")
MATERIALS_PATH = os.path.join(DATA_DIR, "materials")

os.makedirs(CHROMA_PATH, exist_ok=True)
os.makedirs(MATERIALS_PATH, exist_ok=True)

# Initialize chromadb client using persistent storage
chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

# Get or create the collection using Chroma's default ultra-light local embeddings (all-MiniLM-L6-v2)
collection = chroma_client.get_or_create_collection(
    name="syllabus_collection"
)

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 150) -> list[str]:
    """Splits full text into chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def ingest_pdf(lesson_id: str, file_path: str):
    """
    Extracts text from a given PDF, chunks it, and stories it in vector DB 
    associated with the given lesson_id as metadata.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF not found at {file_path}")

    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        txt = page.extract_text()
        if txt:
            full_text += txt + "\n"
    
    if not full_text.strip():
        print(f"Warning: No text extracted from {file_path}")
        return

    # Delete old chunks for this lesson_id to prevent duplicates
    try:
        collection.delete(where={"lesson_id": lesson_id})
    except Exception:
        pass

    chunks = chunk_text(full_text)
    
    ids = [f"{lesson_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"lesson_id": lesson_id} for _ in range(len(chunks))]

    collection.add(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )

    print(f"Successfully ingested {len(chunks)} chunks for lesson '{lesson_id}'")

def retrieve_context(lesson_id: str, query: str, n_results: int = 3) -> str:
    """
    Retrieves the most relevant chunks of text from the PDF associated with the lesson_id.
    """
    try:
        results = collection.query(
            query_texts=[query],
            n_results=n_results,
            where={"lesson_id": lesson_id}
        )
        
        if not results["documents"] or len(results["documents"][0]) == 0:
            return ""
            
        return "\n\n".join(results["documents"][0])
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return ""
