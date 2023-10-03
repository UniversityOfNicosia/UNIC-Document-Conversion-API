from fastapi import FastAPI, HTTPException, UploadFile, Form, Depends
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import pypandoc
import os
import datetime

app = FastAPI()

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

class MarkdownRequest(BaseModel):
    md: str


# Converts markdown string to a docx file and returns the filename
def md2word(md: str) -> str:
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.docx'
    output_path = os.path.join(OUTPUT_DIR, filename)
    pypandoc.convert_text(md, 'docx', format='md', outputfile=output_path)
    return filename

@app.post("/md2word")
def convert_md2word(request: MarkdownRequest):
    try:
        filename = md2word(request.md)
        return {"message": "Conversion successful!", "filename": filename, "result": request.md}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/download/{filename}")
def download_file(filename: str):
    return FileResponse(os.path.join(OUTPUT_DIR, filename), headers={"Content-Disposition": f"attachment; filename={filename}"})


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
