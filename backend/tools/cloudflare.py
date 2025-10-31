import os
from typing import Optional


class CloudflareClientStub:
    def __init__(self, token: str, account_id: str) -> None:
        self.token = token
        self.account_id = account_id

    def deploy_worker(self, name: str, script: str) -> str:
        _ = (name, script)
        return "ok"


def get_client() -> Optional[CloudflareClientStub]:
    token = os.getenv("CLOUDFLARE_API_TOKEN")
    acc = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    if not token or not acc:
        return None
    return CloudflareClientStub(token, acc)


