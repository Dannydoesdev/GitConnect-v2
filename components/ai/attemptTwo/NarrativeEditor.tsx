import { useEffect, useState } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function NarrativeEditor({ generatedContent }: any) {
  const [content, setContent] = useState(generatedContent);
  const [editorContent, setEditorContent] = useState('');


  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate({ editor }) {
      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
    },
  });

  // Sync the editor content with the streamed content
  useEffect(() => {
    // if (editor && content !== editor.getHTML()) {
      editor?.commands.setContent(generatedContent);
    // }
  }, [generatedContent, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div>
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          {/* Define your toolbar controls here */}
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          {/* ... add other controls as needed */}
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />

      {/* <EditorContent editor={editor} /> */}
      </RichTextEditor>
      </div>
  );
}

// import { useState, useEffect } from 'react';
// import { RichTextEditor } from '@mantine/tiptap';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Highlight from '@tiptap/extension-highlight';
// import Subscript from '@tiptap/extension-subscript';
// import Superscript from '@tiptap/extension-superscript';
// import Link from '@tiptap/extension-link';

// export function NarrativeEditor({ content, setContent }: any) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       Superscript,
//       Subscript,
//       Highlight,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: content,
//   });

//   // Sync the editor content with the streamed content
//   useEffect(() => {
//     if (editor && content !== editor.getHTML()) {
//       editor.commands.setContent(content);
//     }
//   }, [content, editor]);

//   // Update parent component's state on editor update
//   useEffect(() => {
//     if (editor) {
//       editor.on('update', () => {
//         setContent(editor.getHTML());
//       });
//     }
//   }, [editor, setContent]);

//   if (!editor) {
//     return null;
//   }

//   return (
//     <RichTextEditor editor={editor}>
//       <RichTextEditor.Toolbar>
//         {/* Define your toolbar controls here */}
//         <RichTextEditor.Bold />
//         <RichTextEditor.Italic />
//         <RichTextEditor.Underline />
//         {/* ... add other controls as needed */}
//       </RichTextEditor.Toolbar>

//       <EditorContent editor={editor} />
//     </RichTextEditor>
//   );
// }
