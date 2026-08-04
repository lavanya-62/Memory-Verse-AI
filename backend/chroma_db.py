import os
import chromadb

DB_PATH = os.path.join(os.getcwd(), "memory_db")

os.makedirs(DB_PATH, exist_ok=True)

client = chromadb.PersistentClient(path=DB_PATH)

collection = client.get_or_create_collection(
    name="documents"
)