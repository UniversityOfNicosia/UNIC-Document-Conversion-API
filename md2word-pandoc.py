import pypandoc

# Converts markdown string to a docx file
def md2word(md, output_filename='md2word.docx'):
    pypandoc.convert_text(md, 'docx', format='md', outputfile=output_filename)


if __name__ == '__main__':
    try:
        md2word('**Hello World!**')
    except Exception as e:
        print("Error in Md2Word Export: ", e)
