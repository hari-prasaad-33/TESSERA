"""
OpenAI LLM call → 31-band target curve.

Calls GPT-4o with the grounded prompt and parses the JSON response.
Temperature is set to 0.3 (lower than current AIBrain.h 0.7) because
the RAG context already provides creative direction.
"""

from __future__ import annotations
import json
import re

from tessera_rag.config import LLM_MODEL, LLM_TEMPERATURE, ISO_31_FREQS
from tessera_rag.data.schema import TargetCurve


_EXPECTED_KEYS = {str(f) for f in ISO_31_FREQS}

# Strip markdown code fences if the model wraps its JSON despite instructions
_CODE_FENCE_RE = re.compile(r"```(?:json)?\s*([\s\S]*?)\s*```")


def _strip_fences(text: str) -> str:
    m = _CODE_FENCE_RE.search(text)
    return m.group(1) if m else text


def _fix_trailing_commas(text: str) -> str:
    """Remove trailing commas before } or ] (common LLM JSON error)."""
    return re.sub(r",\s*([}\]])", r"\1", text)


def _parse_response(content: str) -> TargetCurve:
    """Parse LLM JSON response into a TargetCurve."""
    cleaned = _fix_trailing_commas(_strip_fences(content.strip()))
    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"LLM returned invalid JSON: {e}\n\nContent:\n{content[:500]}") from e

    explanation = data.get("explanation", "")
    raw_curve = data.get("target_curve", {})

    if not raw_curve:
        raise ValueError("LLM response missing 'target_curve' key.")

    # Normalise keys (some models may omit decimal point: "315" vs "31.5")
    gains: dict[str, float] = {}
    for k, v in raw_curve.items():
        try:
            gains[str(k)] = max(-24.0, min(24.0, float(v)))
        except (TypeError, ValueError):
            pass

    # Fill any missing keys with 0 dB (flat)
    for k in _EXPECTED_KEYS:
        gains.setdefault(k, 0.0)

    return TargetCurve(explanation=explanation, gains=gains)


class EQGenerator:
    def __init__(self, api_key: str, model: str = LLM_MODEL) -> None:
        import openai  # type: ignore
        self.client = openai.OpenAI(api_key=api_key)
        self.model = model

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        model: str | None = None,
    ) -> TargetCurve:
        """
        Call the LLM and return a 31-band TargetCurve.
        Raises ValueError if the response cannot be parsed.

        model: if provided, overrides self.model for this call only.
               Use CHEAP_MODEL ("gpt-4o-mini") for moderate-confidence queries.
        """
        effective_model = model if model is not None else self.model
        response = self.client.chat.completions.create(
            model=effective_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_prompt},
            ],
            response_format={"type": "json_object"},
            temperature=LLM_TEMPERATURE,
            max_tokens=800,
        )
        content = response.choices[0].message.content or ""
        return _parse_response(content)
