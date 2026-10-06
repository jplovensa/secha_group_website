"""Package the main website and a built, independent Studio+ checkout."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--studio-source", required=True, type=Path)
args = parser.parse_args()
source = args.studio_source.resolve()
runtime = ["index.html", "assets", "css", "js", "vendor"]
for entry in runtime:
    if not (source / entry).exists():
        parser.error(f"Missing built Studio+ runtime: {entry}")
if not (source / "css/utilities.css").is_file():
    parser.error("Build Studio+ first with npm ci && npm run build")

output = ROOT / "_site"
if output.is_symlink():
    parser.error("Refusing to replace a symlink at _site")
if output.exists():
    shutil.rmtree(output)
output.mkdir()
for entry in ["index.html", "robots.txt", "assets"]:
    origin = ROOT / entry
    if origin.is_dir():
        shutil.copytree(origin, output / entry)
    else:
        shutil.copy2(origin, output / entry)
studio = output / "studio"
studio.mkdir()
for entry in runtime:
    origin = source / entry
    if origin.is_dir():
        shutil.copytree(origin, studio / entry)
    else:
        shutil.copy2(origin, studio / entry)

page = (studio / "index.html").read_text()
page = page.replace("</head>", '<link rel="stylesheet" href="../assets/fonts.css">\n<link rel="stylesheet" href="secha-integration.css">\n</head>', 1)
brand = '<div class="text-xl font-black tracking-tighter uppercase">SECHA+</div>'
if brand not in page:
    raise ValueError("Studio+ navigation changed; update the home-link integration")
page = page.replace(brand, '<a href="../" class="text-xl font-black tracking-tighter uppercase" aria-label="SECHA home">SECHA+</a>', 1)
(studio / "index.html").write_text(page)
shutil.copy2(ROOT / "studio/integration.css", studio / "secha-integration.css")
sha = subprocess.check_output(["git", "-C", str(source), "rev-parse", "HEAD"], text=True).strip()
(studio / "source.json").write_text(json.dumps({"repository": "jplovensa/sechastudio-", "commit": sha}, indent=2) + "\n")
(output / ".nojekyll").touch()
print(f"Packaged Studio+ {sha} at {studio}")
