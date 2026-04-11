import chromadb
import os
import json

DATA_DIR = os.path.abspath('data')
c = chromadb.PersistentClient(path=os.path.join(DATA_DIR, 'chroma_db'))
coll = c.get_collection('syllabus_collection')
res = coll.query(query_texts=['biology'], n_results=1)

with open("test_out.json", "w", encoding="utf-8") as f:
    json.dump(res, f, indent=2)
