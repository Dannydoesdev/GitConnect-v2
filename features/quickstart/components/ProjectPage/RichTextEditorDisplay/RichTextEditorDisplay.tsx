import { useContext, useEffect, useState } from 'react';
import { Button, Card, Center, Container, Group, Paper } from '@mantine/core';
import { Link, RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { lowlight } from 'lowlight/lib/common.js';
import { CustomResizableImage } from '@/components/Portfolio/Project/EditProject/RichTextEditor/extensions/image/customResizableImage';
import { ResizableMedia } from '@/components/Portfolio/Project/EditProject/RichTextEditor/extensions/resizableMedia';
import useStyles from './RichTextEditorDisplay.styles';

type RichTextEditorVanillaProps = {
  content?: string | null | undefined;
};

export default function RichTextEditorDisplay({ content }: RichTextEditorVanillaProps) {
  const [editable, setEditable] = useState(false);
  const { classes, theme } = useStyles();

  useEffect(() => {
    if (content && editor) {
      editor?.commands.setContent(content);
    }
  }, [content]);

  const editor = useEditor({
    editable,
    immediatelyRender: false,
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
        // highlight,
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
    content: content,
    editorProps: {
      attributes: {
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
    <Container fluid size="lg" px="lg" py="lg" className={classes.container}>
      <Card shadow="md" radius="md" p="xl">
        <RichTextEditor
          editor={editor}
          w="100%"
          styles={(theme) => ({
            root: {
              border: 0,
            },
            content: {
              backgroundColor: '#00000000',
              border: 0,
            },
          })}
        >
          <RichTextEditor.Content />
        </RichTextEditor>
      </Card>
      {/* </Paper> */}
    </Container>
  );
}

type TipTapDisplayProps = {
  content: string;
};
