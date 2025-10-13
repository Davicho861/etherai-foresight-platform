import os
import subprocess
import tempfile
import unittest
from pathlib import Path


class GenerateReportTest(unittest.TestCase):
    def test_generate_report_creates_file(self):
        repo_root = Path(__file__).resolve().parents[2]
        script = repo_root / 'scripts' / 'generate_report.py'
        self.assertTrue(script.exists(), "generate_report.py no existe")

        out = Path(tempfile.mkdtemp()) / 'IMMORTAL_EVOLUTION_REPORT_TEST.md'
        cmd = ['python3', str(script), '--output', str(out)]
        res = subprocess.run(cmd, cwd=str(repo_root), capture_output=True, text=True)
        # Debug output (visible in CI logs)
        print(res.stdout)
        print(res.stderr)
        self.assertEqual(res.returncode, 0, f"El script fallo: {res.stderr}")
        self.assertTrue(out.exists(), "El archivo de salida no fue creado")
        content = out.read_text()
        self.assertTrue(('IMMORTAL EVOLUTION REPORT' in content) or ('Generado por Aion' in content))


if __name__ == '__main__':
    unittest.main()
