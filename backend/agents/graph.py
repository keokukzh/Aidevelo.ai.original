from typing import Dict, Any
from . import planner, implementer, runner, fixer, reviewer
from ..services import agl


def execute_build(prompt: str) -> Dict[str, Any]:
    episode_id = f"build:{abs(hash(prompt))}"
    agl.emit_episode_start(episode_id, {"prompt_len": len(prompt)})
    plan_out = planner.plan(prompt)
    diffs = implementer.propose_edits(plan_out)
    rc, out, err = runner.run_commands(["echo build"])
    if rc != 0:
        fix = fixer.propose_fix(err)
        agl.emit_episode_end(episode_id, reward=0.0, meta={"status": "failed"})
        return {"status": "failed", "plan": plan_out, "diffs": diffs, "fix": fix}
    review_out = reviewer.review(diffs)
    agl.emit_reward(episode_id, 1.0 if review_out.get("approved") else 0.5, reasons="review decision")
    agl.emit_episode_end(episode_id, reward=1.0, meta={"status": "ok"})
    return {
        "status": "ok",
        "plan": plan_out,
        "diffs": diffs,
        "review": review_out,
        "logs": out,
    }


