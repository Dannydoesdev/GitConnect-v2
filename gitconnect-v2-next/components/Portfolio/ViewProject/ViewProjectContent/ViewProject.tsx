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
// import { DBlock } from '../extensions/dBlock';
import { CustomResizableImage } from '../../RichTextEditor/extensions/image/customResizableImage';
import { ResizableMedia } from '../../RichTextEditor/extensions/resizableMedia';
import { notitapEditorClass } from '../../RichTextEditor/proseClassString';
import useStyles from './ViewProject.styles';

type RichTextEditorVanillaProps = {
  repoId?: string;
  userId?: string;
  readme?: string;
  existingContent?: string | null | undefined;
  textContent?: string | null | undefined;
  otherProjectData?: any;
  onUpdateEditor?: (content: string) => void;
};

// lowlight.registerLanguage('ts', tsLanguageSyntax);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

function ViewProject({
  // existingContent,
  // repoId,
  // userId,
  // readme,
  textContent,
  otherProjectData,
}: // onUpdateEditor,
RichTextEditorVanillaProps) {
  // const [editorContent, setEditorContent] = useState('');
  // const [content, setContent] = useState(textContent);
  // const [newReadme, setNewReadme] = useState('');
  // const [imgUrl, setImgUrl] = useState('');
  // const [progresspercent, setProgresspercent] = useState(0);
  const [editable, setEditable] = useState(false);
  const { classes, theme } = useStyles();

  // useEffect(() => {
  //   if (readme && readme !== newReadme) {
  //     setNewReadme(readme);
  //     editor?.commands.setContent(readme);
  //   }
  // }, [readme]);

  useEffect(() => {
    if (textContent && editor) {
      editor?.commands.setContent(textContent);
    }
  }, [textContent]);

  // useEffect(() => {
  //   if (existingContent && editor) {
  //     editor?.commands.setContent(existingContent);
  //   }
  // }, [existingContent]);

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
    content: textContent,
    editorProps: {
      attributes: {
        // class: `${notitapEditorClass} focus:outline-none w-full project-edit-tiptap`,
        // class: `${notitapEditorClass} focus:outline-none w-full view-only-mode`,
        class: `view-only-mode`,

        spellcheck: 'false',
        suppressContentEditableWarning: 'true',
      },
    },
    // onUpdate({ editor }) {
    // Update state every time the editor content changes
    // setEditorContent(editor.getHTML());
    // onUpdateEditor?.(editor.getHTML());
    // },
  });

  useEffect(() => {
    if (!editor) {
      return undefined;
    }

    editor.setEditable(editable);
  }, [editor, editable]);

  if (!editor) {
    return null;
  }

  return (
    // <Group w="100%" position='center'>

    <Container size='xl' px='xl' py="lg" className={classes.container}>
      <Card shadow="md" radius="md" p="xl" className={classes.card}>
        {/* dangerouslySetInnerHTML={{ __html: content }} */}
        <RichTextEditor
          // mt={40}
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
  // <RichTextEditor
  //   mt={40}
  //   editor={editor}
  //   w="100%"
  //   styles={(theme) => ({
  //     root: {
  //       // backgroundColor: '#00acee',
  //       border: 0,
  //     },
  //   })}
  // >
  //   <RichTextEditor.Content />
  // </RichTextEditor>
  // </Group>
}

export default ViewProject;
