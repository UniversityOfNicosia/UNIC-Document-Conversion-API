# Python API

This directory contains a Python API for document conversion. Follow the steps below to set up the development environment.

## Setting Up a Virtual Environment

1. **Find the Python interpreter path**: Use the `which` command to get the path to your Python3 interpreter. For example:

    ```shell
    which python3
    ```

    This command will print the path to your Python3 interpreter.

2. **Create a virtual environment**: Use the Python interpreter to create a virtual environment in the `.venv` directory. Replace `PYTHON_PATH` with the path you got from the previous step:

    ```shell
    PYTHON_PATH -m venv .venv
    ```

3. **Prevent tracking of virtual environment files**: Create a `.gitignore` file in the `.venv` directory to prevent the virtual environment files from being tracked by Git:

    ```shell
    echo "*" > .venv/.gitignore
    ```

4. **Activate the virtual environment**: Use the following command to activate the virtual environment:

    ```shell
    source .venv/bin/activate
    ```

    After running this command, your terminal prompt should change to indicate that you are now working inside a virtual environment.

## Installing Dependencies

After setting up and activating the virtual environment, install the necessary dependencies using pip:

```shell
pip install -r requirements.txt
````