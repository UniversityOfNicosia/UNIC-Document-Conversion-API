"""
This module defines a FastAPI application that provides endpoints for converting Markdown 
content to DOCX and PPTX files.

The application defines two POST endpoints:
- /markdown_to_docx/ : Converts Markdown content to a DOCX file.
- /markdown_to_pptx/ : Converts Markdown content to a PPTX file.

Each endpoint accepts a request object of the MarkdownRequest model, which contains the 
Markdown content to be converted.

The conversion logic is handled by the md2word and md2pptx functions from 
the conversion_logic module.

The application is run using the uvicorn ASGI server, with the host set to 0.0.0.0 and 
the port set to 8000.
"""
import codecs
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from conversion_logic import md2pptx, md2word


app = FastAPI()

class MarkdownRequest(BaseModel):
    """
    Represents a request to convert Markdown to another format.
    """

    md: str

@app.post("/markdown_to_docx/")
async def markdown_to_docx(request: MarkdownRequest):
    """
    Converts Markdown content to a DOCX file.

    Args:
        request (MarkdownRequest): The request object containing the Markdown content.

    Returns:
        FileResponse: The converted DOCX file as a response.

    Raises:
        HTTPException: If an error occurs during the conversion process.
    """
    request.md = codecs.decode(request.md, 'unicode_escape')
    try:
        filename = md2word(request.md)
        return FileResponse(
            Path("../converted_files") / filename,
            media_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            filename=filename
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

@app.post("/markdown_to_pptx/")
async def markdown_to_pptx(request: MarkdownRequest):
    """
    Converts Markdown content to a PowerPoint presentation (PPTX) file.

    Args:
        request (MarkdownRequest): The request object containing the Markdown content.

    Returns:
        FileResponse: The converted PPTX file as a FileResponse object.

    Raises:
        HTTPException: If an error occurs during the conversion process.
    """
    request.md = codecs.decode(request.md, 'unicode_escape')
    try:
        filename = md2pptx(request.md)
        return FileResponse(
            Path("../converted_files") / filename,
            media_type='application/vnd.openxmlformats-officedocument.presentationml.presentation',
            filename=filename
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
