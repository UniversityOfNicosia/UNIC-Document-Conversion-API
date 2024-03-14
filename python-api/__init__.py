"""
This module is the entry point for the python-api package.
It imports the md2pptx and md2word functions from the conversion_logic module.
"""

from .conversion_logic import md2pptx, md2word

__all__ = ['md2pptx', 'md2word']
