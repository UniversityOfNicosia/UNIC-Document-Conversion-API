import pypandoc
import datetime
import os

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


# Converts markdown string to an html file and returns the filename
def md2html(md):
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.html'
    output_path = os.path.join(OUTPUT_DIR, filename)
    pypandoc.convert_text(md, 'html', format='md', outputfile=output_path)
    return filename
