import requests
from typing import Tuple

def generate_myfiles_path(api_key: str, app_id: str, jwt_token: str, additional_paths: list, is_internal: bool) -> Tuple[str, str, str, str]:
    """Generates a path on S3 using the MyFiles service.

    Args:
        api_key (str): API key for the external service.
        app_id (str): Application ID.
        jwt_token (str): JWT token of the user.
        additional_paths (list): Additional paths for file organization.
        is_internal (bool): Flag for internal file usage.

    Returns:
        Tuple[str, str, str, str]: Returns a tuple containing profile ID, S3 bucket name, S3 file prefix key, and callback URL.
    """
    url = "{{base_url}}/system/storage/generate-path"
    headers = {
        "X-Api-Key": api_key,
        "X-App-Id": app_id,
        "Authorization": f"Bearer {jwt_token}"
    }
    payload = {
        "AdditionalPaths": additional_paths,
        "IsInternal": is_internal
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    data = response.json()
    return data["ProfileID"], data["S3Bucket"], data["S3FilePrefixKey"], data["CallbackUrl"]

def save_file_to_myfiles(api_key: str, app_id: str, profile_id: str, file_mime_type: str, file_name: str, file_path: str, file_size: int) -> None:
    """Notifies the MyFiles service about the uploaded file.

    Args:
        api_key (str): API key for the external service.
        app_id (str): Application ID.
        profile_id (str): Profile ID of the user.
        file_mime_type (str): MIME type of the file.
        file_name (str): Display name of the file.
        file_path (str): Full path where the file is saved.
        file_size (int): Size of the file in bytes.
    """
    url = "{{base_url}}/system/storage/save"
    headers = {
        "X-Api-Key": api_key,
        "X-App-Id": app_id
    }
    payload = {
        "ProfileID": profile_id,
        "FileMimeType": file_mime_type,
        "FileName": file_name,
        "FilePath": file_path,
        "AppID": app_id,
        "FileSize": file_size
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
