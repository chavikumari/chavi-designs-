"""Prepare the static site for a GitHub Pages root or repository subpath."""
from pathlib import Path
import os
import re
import shutil

root = Path(__file__).resolve().parent.parent
destination = root / '_site'
base = os.environ.get('PAGES_BASE_PATH', '').strip('/')
prefix = f'/{base}/' if base else '/'
if base and not re.fullmatch(r'[A-Za-z0-9._/-]+', base):
    raise ValueError('Invalid Pages base path')
shutil.copytree(root / 'dist', destination, dirs_exist_ok=True,
                ignore=shutil.ignore_patterns('.openai', '.DS_Store'))
for file in destination.rglob('*'):
    if file.suffix not in {'.html', '.css', '.js'}:
        continue
    text = file.read_text()
    if base:
        # Root-relative HTML attributes, CSS URLs and JS asset strings.
        text = re.sub(r'''(["'`(])/(?!/)(?=[A-Za-z0-9_?\#"'`])''',
                      lambda match: match[1] + prefix, text)
    file.write_text(text)
(destination / '.nojekyll').touch()
print(f'Prepared {destination} for {prefix}')
