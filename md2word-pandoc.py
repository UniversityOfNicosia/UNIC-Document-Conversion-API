from flask import Flask, request, jsonify, send_from_directory
import pypandoc
import os

app = Flask(__name__)

# Directory to save the converted files
OUTPUT_DIR = 'converted_files'
if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)


# Converts markdown string to a docx file and returns the filename
def md2word(md):
    date = datetime.datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = f'markdown-{date}.docx'
    output_path = os.path.join(OUTPUT_DIR, filename)
    pypandoc.convert_text(md, 'docx', format='md', outputfile=output_path)
    return unique_filename


@app.route('/md2word', methods=['POST'])
def convert_md2word():
    try:
        md = request.json['md']
        filename = md2word(md)
        return jsonify({'message': 'Conversion successful!', 'filename': filename})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
