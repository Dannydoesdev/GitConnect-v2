import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';

export const NarrativeEditor = ({ content }: any) => {
  const [streamedContent, setStreamedContent] = useState(content);
  const editor = useEditor({
    extensions: [StarterKit],
    content: streamedContent,
    editable: false // You can set this to true if you want the user to be able to edit
  });

  // Render only when the editor is ready
  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
};
