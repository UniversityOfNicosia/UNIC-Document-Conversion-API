import datetime
import os

import codecs
import pypandoc
from fastapi import Depends, FastAPI, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

app = FastAPI()

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


class MarkdownRequest(BaseModel):
    md: str


# Converts markdown string to a docx file and returns the filename
def md2word(md: str) -> str:
    print(f"Content passed to pypandoc:\n{md}")
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.docx'
    output_path = os.path.join(OUTPUT_DIR, filename)
    pypandoc.convert_text(md, 'docx', format='md', outputfile=output_path)
    return filename


@app.post("/md2word")
def convert_md2word(request: MarkdownRequest):
    request.md = codecs.decode(request.md, 'unicode_escape')
    print(f"Received markdown content: {request.md}")
    try:
        filename = md2word(request.md)
        return {"message": "Conversion successful!", "filename": filename, "result": request.md}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/download/{filename}")
def download_file(filename: str):
    path = os.path.join(OUTPUT_DIR, filename)
    headers = {"Content-Disposition": f"attachment; filename={filename}"}
    return FileResponse(path, headers=headers)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
