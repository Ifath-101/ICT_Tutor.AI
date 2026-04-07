import argparse
import sys
import os

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.rag_service import ingest_pdf

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest a PDF into the RAG system for a specific lesson")
    parser.add_argument("lesson_id", help="The ID of the lesson (e.g. lesson1)")
    parser.add_argument("file_path", help="The path to the PDF file")
    
    args = parser.parse_args()
    
    print(f"Ingesting {args.file_path} for lesson '{args.lesson_id}'...")
    try:
        ingest_pdf(args.lesson_id, args.file_path)
    except Exception as e:
        print(f"Failed to ingest: {e}")
        sys.exit(1)
