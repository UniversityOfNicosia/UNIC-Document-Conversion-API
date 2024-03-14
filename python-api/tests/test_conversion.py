"""
This module contains tests for converting Markdown to DOCX and PPTX formats.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_markdown_to_docx():
    """
    Test case for converting Markdown to DOCX.

    Sends a POST request to the '/markdown_to_docx/' endpoint with a Markdown content.
    Asserts that the response status code is 200, content-type,
    and content-disposition is 'attachment; filename=Hello_World.docx'.
    """
    response = client.post(
        "/markdown_to_docx/",
        json={"md": "# Hello, World!"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    assert response.headers["content-disposition"] == "attachment; filename=Hello_World.docx"

def test_markdown_to_pptx():
    """
    Test case for converting Markdown to PPTX.

    Sends a POST request to the '/markdown_to_pptx/' endpoint with a sample Markdown content.
    Asserts that the response status code is 200, content-type,
    and content-disposition is 'attachment; filename=Hello_World.pptx'.
    """
    response = client.post(
        "/markdown_to_pptx/",
        json={"md": "# Hello, World!"}
    )
    assert response.status_code == 200
    assert response.headers["content-type"] == (
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
    assert response.headers["content-disposition"] == "attachment; filename=Hello_World.pptx"    
