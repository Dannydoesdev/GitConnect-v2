import { useContext, useEffect, useState } from 'react';
import { Button, Card, Center, Container, Group, Paper } from '@mantine/core';
import { Link, RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
// import { lowlight } from 'lowlight/lib/core'
// import { lowlight } from 'lowlight';
import { lowlight } from 'lowlight/lib/common.js';
import { CustomResizableImage } from '@/components/Portfolio/Project/EditProject/RichTextEditor/extensions/image/customResizableImage';
import { ResizableMedia } from '@/components/Portfolio/Project/EditProject/RichTextEditor/extensions/resizableMedia';
// import { notitapEditorClass } from '../../Portfolio/RichTextEditor/proseClassString';
// import useStyles from './ViewPreviewProjectContent.styles';
import useStyles from './RichTextEditorDisplay.styles';

type RichTextEditorVanillaProps = {
  content?: string | null | undefined;
};

// console.log(lowlight.listLanguages())

// lowlight.register('ts', tsLanguageSyntax);
// lowlight.registerLanguage('html', html);
// lowlight.registerLanguage('css', css);
// lowlight.registerLanguage('js', js);
// lowlight.registerLanguage('ts', ts);

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
    <Container size="lg" px="lg" py="lg" className={classes.container}>
      {/* <Paper shadow="xl" p="xl"> */}
      <Card shadow="md" radius="md" p="xl">
        {/* // className={classes.card}> */}
        <RichTextEditor
          // withTypographyStyles={false}
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

// function RichTextEditorDisplay({ content }: TipTapDisplayProps) {

//   const { classes, theme } = useStyles();

//   return (
//     <Container
//       id='second-section'
//       py="xl"
//       className={classes.container}
//     >

//       <Card
//         shadow="md"
//         radius="md"
//         p="xl"
//         className={classes.card}

//         >
//           {/* dangerouslySetInnerHTML={{ __html: content }} */}
//       <div dangerouslySetInnerHTML={{ __html: content }} />

//       </Card>
//     </Container>

//   )

// }

// export default RichTextEditorDisplay;
