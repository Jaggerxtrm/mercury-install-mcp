#!/usr/bin/env python3
"""
scope.py — Read service-registry.json and output a formatted service catalog.

Used by the /scope skill to provide registry data for agent reasoning before
any files are touched. The agent uses this output to map a task description
to the relevant registered service(s).
"""

import json
import os
import sys
from pathlib import Path


def find_registry() -> Path | None:
    def candidates(root: Path):
        # 1. User packs (canonical location managed by xt)
        packs_dir = root / ".xtrm" / "skills" / "user" / "packs"
        if packs_dir.is_dir():
            for pack in sorted(packs_dir.iterdir()):
                p = pack / "service-registry.json"
                if p.exists():
                    yield p
        # 2. Active layer alias (legacy fallback)
        yield root / ".claude" / "skills" / "service-registry.json"

    project_dir = os.environ.get("CLAUDE_PROJECT_DIR")
    if project_dir:
        for p in candidates(Path(project_dir)):
            if p.exists():
                return p

    cwd = Path.cwd()
    for parent in [cwd, *cwd.parents]:
        for p in candidates(parent):
            if p.exists():
                return p
        if (parent / ".git").exists():
            break

    return None


def main() -> None:
    registry_path = find_registry()

    if not registry_path:
        print("ERROR: service-registry.json not found.")
        print("Run /creating-service-skills to set up service skills first.")
        sys.exit(1)

    try:
        with open(registry_path, encoding="utf-8") as f:
            registry = json.load(f)
    except json.JSONDecodeError as e:
        print(f"ERROR: service-registry.json is malformed: {e}")
        sys.exit(1)

    services = registry.get("services", {})
    if not services:
        print("Registry is empty — no services registered.")
        sys.exit(0)

    print(f"Registry  : {registry_path}")
    print(f"Version   : {registry.get('version', 'unknown')}")
    print(f"Services  : {len(services)} registered")
    print("─" * 60)

    for service_id, info in services.items():
        territories = ", ".join(info.get("territory", [])) or "—"
        print(f"\n[{service_id}]")
        print(f"  Container  : {info.get('container', 'unknown')}")
        print(f"  Territory  : {territories}")
        print(f"  Skill      : {info.get('skill_path', 'unknown')}")
        print(f"  Description: {info.get('description', '—')}")

    print("\n" + "─" * 60)
    print("Map the task description to the service(s) above, then load their skills.")


if __name__ == "__main__":
    main()
