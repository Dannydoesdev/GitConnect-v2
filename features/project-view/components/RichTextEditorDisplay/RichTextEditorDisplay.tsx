import { useEffect, useState } from 'react';
import { Card, Container } from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { lowlight } from 'lowlight/lib/common.js';
import { CustomResizableImage } from '../../../project-edit/components/RichTextEditor/extensions/image/customResizableImage';
import { ResizableMedia } from '../../../project-edit/components/RichTextEditor/extensions/resizableMedia';
import useStyles from './RichTextEditorDisplay.styles';

type RichTextEditorVanillaProps = {
  content?: string | null | undefined;
};

// TODO: Compare using lowlight vs default code highlighting
// lowlight.registerLanguage('html', html);
// lowlight.registerLanguage('css', css);
// lowlight.registerLanguage('ts', ts);

export default function RichTextEditorDisplay({
  content,
}: RichTextEditorVanillaProps) {
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
    <Container size='lg' px='lg' py='lg' className={classes.container}>
      <Card shadow='md' radius='md' p='xl'>
        <RichTextEditor
          editor={editor}
          w='100%'
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
    </Container>
  );
}

type TipTapDisplayProps = {
  content: string;
};
