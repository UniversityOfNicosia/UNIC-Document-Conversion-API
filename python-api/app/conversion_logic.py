"""
conversion_logic.py

This module contains functions to convert Markdown content to different formats using pypandoc.
It provides functions to convert Markdown to PPTX and Word documents. The converted files are 
saved in a specified output directory.
"""
import datetime
from pathlib import Path
import pypandoc

# Directory to save the converted files
OUTPUT_DIR = '../converted_files'
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)

def md2pptx(md: str) -> str:
    """
    Convert Markdown to PPTX.

    Args:
        md (str): The Markdown content to be converted.

    Returns:
        str: The filename of the converted PPTX file.
    """
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.pptx'
    output_path = Path(OUTPUT_DIR) / filename
    pypandoc.convert_text(md, 'pptx', format='md', outputfile=str(output_path))
    return filename

def md2word(md: str) -> str:
    """
    Convert Markdown to Word.

    Args:
        md (str): The Markdown content to be converted.

    Returns:
        str: The filename of the converted Word document.
    """
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.docx'
    output_path = Path(OUTPUT_DIR) / filename
    pypandoc.convert_text(md, 'docx', format='md', outputfile=str(output_path))
    return filename
