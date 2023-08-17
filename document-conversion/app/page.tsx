'use client'
import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import gfm from "remark-gfm";

/**
 * This function is used to edit the markdown text and display the preview,
 * leveraging the 'react-markdown' library to render the markdown text,
 * the 'remark-gfm' library to render the markdown text with GitHub Flavored
 * Markdown (GFM) support, and the 'react-syntax-highlighter' library to
 * render the markdown text with syntax highlighting.
 */
export default function Home() {
  const [markdown, setMarkdown] = useState('# markdown preview');
  const [fileName, setFileName] = useState('default');

  const handleExport = () => {
    const generatedFileName = `markdown_${Date.now()}`;
    setFileName(generatedFileName);

    window.open(`/api/startOAuth?content=${encodeURIComponent(markdown)}&fileName=${encodeURIComponent(generatedFileName)}`, '_blank');
  }

  return (
    <main>
      <section className="markdown  mx-auto p-4">
        <textarea 
          className="markdown"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        >
        </textarea>
        <article className="preview">
          <ReactMarkdown 
            children={markdown}
            remarkPlugins={[gfm]}
            components={{
              code({node, inline, className, children, ...props}) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                    wrapLongLines={true}
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          />
        </article>
      </section>
    </main>
  )
}