import os
from typing import Optional, List
from supabase import create_client, Client


def get_client() -> Optional[Client]:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_ROLE") or os.getenv("SUPABASE_ANON_KEY")
    if not url or not key:
        return None
    return create_client(url, key)


def ensure_tables(client: Client) -> None:
    # Expecting tables created via SQL migrations externally; placeholder no-op
    _ = client


def upsert_document(client: Client, table: str, doc: dict) -> None:
    client.table(table).upsert(doc).execute()


