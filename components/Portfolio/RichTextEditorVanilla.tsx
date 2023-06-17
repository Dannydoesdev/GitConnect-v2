import { useState, useEffect, useContext } from 'react';
import { Button, Center, Container, Group } from '@mantine/core';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { IconPhoto, IconPhotoPlus } from '@tabler/icons-react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import { lowlight } from 'lowlight';
import { CustomResizableImage } from './extensions/image/customResizableImage';
import { ResizableMedia } from './extensions/resizableMedia';
import { notitapEditorClass } from './proseClassString';

function InsertImageControl() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor?.chain().focus().insertResizableImage().run()}
      aria-label="Insert an image"
      title="Insert an image"
    >
      <IconPhotoPlus stroke={1.5} size="1rem" />
    </RichTextEditor.Control>
  );
}

type RichTextEditorBeefyProps = {
  repoId?: string;
  userId?: string;
  existingContent?: string | null | undefined;
};

lowlight.registerLanguage('ts', tsLanguageSyntax);

function RichTextEditorVanilla({ existingContent }: RichTextEditorBeefyProps) {
  const [editorContent, setEditorContent] = useState('');
  const [content, setContent] = useState(existingContent);
  const [readme, setReadme] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);

  const editor = useEditor({
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
    content,
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full`,
        spellcheck: 'false',
        suppressContentEditableWarning: 'true',
      },
    },
    onUpdate({ editor }) {
      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
    },
  });

  return (
    <Group w="100%">
      <Button onClick={() => editor?.chain().focus()?.insertImage()?.run()}>
        Insert Image
      </Button>
      <Button onClick={() => editor?.commands.insertImage()}>
        Insert Image single cmd
      </Button>

      <RichTextEditor mt={40} editor={editor} w="100%">
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <InsertImageControl />
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
    </Group>
  );
}

export default RichTextEditorVanilla;
