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
```

## Installing Pandoc

`pypandoc` requires Pandoc to be installed on your system as it acts as a wrapper around the Pandoc document converter. Follow these steps to install Pandoc:

### For Linux and macOS:

1. Open a terminal and execute the following command:

    ```shell
    sudo apt-get install pandoc
    ```

    This command is for Debian-based Linux distributions. If you are using a different Linux distribution or macOS with Homebrew, you might need to adjust the command accordingly, such as using `brew install pandoc` for macOS.

### For Windows:

1. Download the latest Pandoc installer from the [Pandoc releases page](https://github.com/jgm/pandoc/releases).
2. Run the installer and follow the instructions to complete the installation.

### Verifying the Installation:

After installation, you can verify that Pandoc is correctly installed by running:

```shell
pandoc --version
```

This command should display the version of Pandoc installed on your system.