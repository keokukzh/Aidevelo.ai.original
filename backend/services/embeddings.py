from typing import List
import os


_MODEL = None


def _load_model():
    global _MODEL
    if _MODEL is None:
        from sentence_transformers import SentenceTransformer
        name = os.getenv("EMBEDDING_MODEL", "BAAI/bge-m3")
        _MODEL = SentenceTransformer(name)
    return _MODEL


def embed_texts(texts: List[str]) -> List[List[float]]:
    model = _load_model()
    return model.encode(texts, normalize_embeddings=True).tolist()


