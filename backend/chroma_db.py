import chromadb

client = chromadb.PersistentClient(path="memory_db")

collection = client.get_or_create_collection(
    name="documents"
)