import pypandoc
import datetime
import os

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


# Converts markdown string to a pptx file and returns the filename
def md2pptx(md):
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.pptx'
    output_path = os.path.join(OUTPUT_DIR, filename)
    pypandoc.convert_text(md, 'pptx', format='md', outputfile=output_path)
    return filename
