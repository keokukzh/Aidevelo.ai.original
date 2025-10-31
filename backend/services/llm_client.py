import os
import time
import httpx
from typing import Dict, Any, List, Optional
from . import agl as agl


class LLMClient:
    def __init__(self) -> None:
        self.vllm_base = os.getenv("MODEL_HOST_VLLM", "http://localhost:8000")
        self.ollama_base = os.getenv("MODEL_HOST_OLLAMA", "http://localhost:11434")
        self.reasoning_model = os.getenv("REASONING_MODEL", "")
        self.coding_model = os.getenv("CODING_MODEL", "")
        self.api_key = os.getenv("OPENAI_COMPAT_API_KEY", "local-key")

    async def chat_openai(self, model: str, messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 2048) -> str:
        url = f"{self.vllm_base}/v1/chat/completions"
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        agl.emit_prompt(model=model, messages=messages, tools=None, meta={"provider": "openai-compatible", "host": self.vllm_base})
        t0 = time.perf_counter()
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(url, headers=headers, json=payload)
            r.raise_for_status()
            data = r.json()
            content = data["choices"][0]["message"]["content"]
            latency_ms = (time.perf_counter() - t0) * 1000.0
            usage = data.get("usage", {})
            tokens = usage.get("total_tokens")
            agl.emit_completion(model=model, output=content, tokens=tokens, latency_ms=latency_ms, meta={"provider": "openai-compatible"})
            return content

    async def chat_ollama(self, model: str, messages: List[Dict[str, str]], temperature: float = 0.2) -> str:
        url = f"{self.ollama_base}/api/chat"
        payload = {"model": model, "messages": messages, "options": {"temperature": temperature}, "stream": False}
        agl.emit_prompt(model=model, messages=messages, tools=None, meta={"provider": "ollama", "host": self.ollama_base})
        t0 = time.perf_counter()
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
            data = r.json()
            # Ollama returns a streaming-like structure; final message present as 'message'
            if "message" in data and "content" in data["message"]:
                content = data["message"]["content"]
                agl.emit_completion(model=model, output=content, tokens=None, latency_ms=(time.perf_counter()-t0)*1000.0, meta={"provider": "ollama"})
                return content
            # or 'done' events; fallback
            content = data.get("content", "")
            agl.emit_completion(model=model, output=content, tokens=None, latency_ms=(time.perf_counter()-t0)*1000.0, meta={"provider": "ollama"})
            return content

    async def chat(self, kind: str, messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 2048) -> str:
        model = self.reasoning_model if kind == "reasoning" else self.coding_model
        # Try vLLM compatible first
        if self.vllm_base:
            try:
                return await self.chat_openai(model=model, messages=messages, temperature=temperature, max_tokens=max_tokens)
            except Exception:
                pass
        # Fallback to Ollama
        try:
            return await self.chat_ollama(model=model, messages=messages, temperature=temperature)
        except Exception:
            # Final fallback stub to keep pipeline moving in shadow mode
            prompt_tail = messages[-1]["content"][-120:] if messages else ""
            return f"[stub] Plan for: {prompt_tail}"


