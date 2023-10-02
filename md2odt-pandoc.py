import pypandoc
import datetime
import os

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Converts markdown string to an odt file and returns the filename
def md2odt(md):
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.odt'
    output_path = os.path.join(OUTPUT_DIR, filename)
    pypandoc.convert_text(md, 'odt', format='md', outputfile=output_path)
    return filename

# Example usage
md = """
# This is a heading
- This is a bullet point
- This is another bullet point
"""

filename = md2odt(md)
print(filename)
