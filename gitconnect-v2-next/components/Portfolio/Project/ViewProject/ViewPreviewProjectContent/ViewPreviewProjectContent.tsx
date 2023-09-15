import { useState, useEffect, useContext } from 'react';
import { Button, Card, Center, Container, Group } from '@mantine/core';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { lowlight } from 'lowlight/lib/core';
import css from 'highlight.js/lib/languages/css';
import { CustomResizableImage } from '../../EditProject/RichTextEditor/extensions/image/customResizableImage';
import { ResizableMedia } from '../../EditProject/RichTextEditor/extensions/resizableMedia';
import { notitapEditorClass } from '../../EditProject/RichTextEditor/proseClassString';
import useStyles from './ViewPreviewProjectContent.styles';

type RichTextEditorVanillaProps = {
  updatedContent?: string | null | undefined;
};

// lowlight.registerLanguage('ts', tsLanguageSyntax);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

function ViewPreviewProjectEditor({
  updatedContent,
}:
RichTextEditorVanillaProps) {

  const [editable, setEditable] = useState(false);
  const { classes, theme } = useStyles();

  useEffect(() => {
    if (updatedContent && editor) {
      editor?.commands.setContent(updatedContent);
    }
  }, [updatedContent]);

  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      ResizableMedia.configure({
        uploadFn: async (file: File): Promise<string> => {
          // Optional Logic to handle pasting images into editor
          // This should return a Promise that resolves with the URL of the uploaded file.
          return '';
        },
      }),
      CustomResizableImage,
      // Info here https://tiptap.dev/api/nodes/code-block-lowlight
      CodeBlockLowlight.configure({
        HTMLAttributes: {
          class: 'lowlight',
        },
        lowlight,
      }),
      Underline,
      // DBlock,
      Link.configure({
        HTMLAttributes: {
          target: '_blank',
        },
      }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: updatedContent,
    editorProps: {
      attributes: {
        // class: `${notitapEditorClass} focus:outline-none w-full project-edit-tiptap`,
        // class: `${notitapEditorClass} focus:outline-none w-full view-only-mode`,
        class: `view-only-mode`,
        spellcheck: 'false',
        suppressContentEditableWarning: 'true',
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    editor.setEditable(false);
  }, [editor, editable]);

  if (!editor) {
    return null;
  }

  return (

    <Container size='xl' px='xl' py="lg" className={classes.container}>
      <Card shadow="md" radius="md" p="xl" className={classes.card}>
        <RichTextEditor
          editor={editor}
          w="100%"
          styles={(theme) => ({
            root: {
              // backgroundColor: '#00acee',
              border: 0,
            },
            content: {
              backgroundColor: '#00000000',
              border: 0,
            }
          })}
        >
          <RichTextEditor.Content />
        </RichTextEditor>
      </Card>
    </Container>
  );
}

export default ViewPreviewProjectEditor;
