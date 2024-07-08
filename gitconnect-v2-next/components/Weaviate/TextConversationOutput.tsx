import { useEffect, useState } from 'react';
import { Container, Group } from '@mantine/core';
import { Link, RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import { lowlight } from 'lowlight';

type CaseStudyProps = {
  repoId?: string;
  userId?: string;
  newContent: string;
};

lowlight.registerLanguage('ts', tsLanguageSyntax);

function TextConversationOutput({ newContent }: CaseStudyProps) {
  const [existingContent, setExistingContent] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        HTMLAttributes: {
          class: 'lowlight',
        },
        lowlight,
      }),
      Underline,
      Link.configure({
        HTMLAttributes: {
          target: '_blank',
        },
      }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    autofocus: 'end',
    editable: false,
    content: existingContent,
    onUpdate({ editor }) {
      // Update state every time the editor content changes
      setExistingContent(editor.getHTML());
      editor.commands.selectTextblockEnd();
      editor.commands.scrollIntoView();
    },
  });

  useEffect(() => {
    if (editor) {
      // Append new content to existing content
      editor.commands.setContent(existingContent + newContent);
      editor.commands.selectTextblockEnd();
      // Scroll to the bottom of the editor
      editor.commands.scrollIntoView();
    }
  }, [newContent, editor, existingContent]);

  return (
    <div>
      <Container p="lg" fluid>
        <Group position="center">
          <RichTextEditor
            // p='lg'
            mt={10}
            editor={editor}
            w="100%"
            styles={(theme) => ({
              root: {
                border: 0,
                height: '30vh',
                overflowY: 'auto',
              },
            })}
          >
            <RichTextEditor.Content />
          </RichTextEditor>
        </Group>
      </Container>
    </div>
  );
}

export default TextConversationOutput;
