import dynamic from 'next/dynamic'
import { useRef } from 'react'

export default function AboutBlog() {
  const quillDefaultText = ''
  const quillRef = useRef(null)
  const ReactQuill = dynamic(
    async () => {
      const { default: RQ, Quill } = await import("react-quill");
      return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />
    },
    { ssr: false }
  )

  const modules = {
    // syntax: true,
    toolbar: {
      container: [
        [{ 'header': 1 }, { 'header': 2 }, 'code'],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'list': 'bullet' }],
        ['link', 'image'],
        // [{ 'background': [] }],
      ],
    }
  }

  return (
    <div className="overflow-auto max-h-36">
          <ReactQuill
            className="flex-1 max-w-5xl m-5 bg-white h-5/6 max-w-80"
            forwardedRef={quillRef}
            modules={modules}
            value={quillDefaultText}
            // onChange={topicTypingFn} 
            />
    </div>
  )
}