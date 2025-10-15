#!/usr/bin/env python3
"""
Generador simple de IMMORTAL_EVOLUTION_REPORT desde plantilla.
Uso: python3 scripts/generate_report.py --output IMMORTAL_EVOLUTION_REPORT_<ts>.md
"""
import argparse
import datetime
from pathlib import Path

TEMPLATE = Path("IMMORTAL_EVOLUTION_REPORT_TEMPLATE.md")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--output", required=True)
    args = p.parse_args()

    out = Path(args.output)
    ts = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")

    if TEMPLATE.exists():
        text = TEMPLATE.read_text()
        text = text.replace("{{TIMESTAMP}}", ts)
    else:
        text = f"# IMMORTAL EVOLUTION REPORT {ts}\n\nGenerado por Aion.\n"

    # Añadir un resumen de health-check logs si existen
    log_candidates = [Path(".logs/health-check.log"), Path("logs/health-check.log")]
    logs = []
    for lc in log_candidates:
        if lc.exists():
            logs.append(lc.read_text())
            break

    if logs:
        text += "\n## Health Check Logs\n\n```\n" + logs[0] + "\n```\n"

    out.write_text(text)
    print(f"[generate_report] Report written to {out}")

if __name__ == '__main__':
    main()
