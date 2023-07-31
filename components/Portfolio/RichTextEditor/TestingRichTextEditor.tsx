import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { textEditorAtom } from '@/atoms/jotaiAtoms';
import { db } from '@/firebase/clientApp';
import { Button, Center, Container, Group } from '@mantine/core';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { IconCode, IconPhoto, IconPhotoPlus, IconSourceCode } from '@tabler/icons-react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { doc, getDoc } from 'firebase/firestore';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { useAtom } from 'jotai';
import { lowlight } from 'lowlight/lib/core';
import { text } from 'stream/consumers';
import css from 'highlight.js/lib/languages/css';
import { DBlock } from './extensions/dBlock';
import { CustomResizableImage } from './extensions/image/customResizableImage';
import { ResizableMedia } from './extensions/resizableMedia';
import { notitapEditorClass } from './proseClassString';

function InsertCodeControls() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.ControlsGroup>
      <RichTextEditor.Control
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        aria-label="Code block"
        title="Code block"
      >
        <IconSourceCode stroke={1.5} size="1rem" />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label="Code"
        title="Code"
      >
        <IconCode stroke={1.5} size="1rem" />
      </RichTextEditor.Control>
    </RichTextEditor.ControlsGroup>
  );
}

type RichTextEditorVanillaProps = {
  repoId?: string;
  userId?: string;
  readme?: string | null;
  existingContent?: string | null | undefined;
  updatedContent?: string | null | undefined;
  onUpdateEditor?: (content: string) => void;
};

// lowlight.registerLanguage('ts', tsLanguageSyntax);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('js', js);
lowlight.registerLanguage('ts', ts);

function TestingRichTextEditor({
  // existingContent,
  // updatedContent,
  repoId,
  userId,
}: // readme,
// onUpdateEditor,
RichTextEditorVanillaProps) {
  // const [editorContent, setEditorContent] = useState('');
  // const [content, setContent] = useState('');
  // const [newReadme, setNewReadme] = useState('');
  // const [initialContent, setinitialContent] = useState(existingContent);
  const router = useRouter();

  const [textContentState, setTextContentState] = useAtom(textEditorAtom);
  const [initialContent, setInitialContent] = useState('');
  // const [editorContent, setEditorContent] = useState('');

  // console.log('Initial TextEditorState inside editor');
  // console.log(textContentState);

  const [content, setContent] = useState(textContentState);

  useEffect(() => {
    const getFirebaseData = async () => {
      const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mainContent = docSnap.data();
        const htmlOutput = mainContent.htmlOutput;
        handleSetTipTap(htmlOutput);
        if (htmlOutput?.length > 0) {
          // console.log('returned htmlOutput from firebase')
          // console.log(htmlOutput)
          setInitialContent(htmlOutput);
          // handleSetTipTap(htmlOutput);
          setTextContentState(htmlOutput);
          // setInitial
          editor?.commands.setContent(htmlOutput);
        }
      }
    };

    getFirebaseData();
    // }, [repoId, router, userId]);
  }, [router, repoId, userId]);

  function handleSetTipTap(content: any) {
    editor?.commands.setContent(content);
  }

  // useEffect(() => {
  //   if (!textContentState) return;
  //   editor?.commands?.setContent(textContentState);
  // }, [textContentState]);

  useEffect(() => {
    editor?.commands.setContent(initialContent);
  }, [initialContent]);

  // useEffect(() => {
  //   if (updatedContent && editor) {
  //     // setTimeout(() => {
  //     editor?.commands.setContent(updatedContent);
  //   // });
  //     }
  // }, []);

  useEffect(() => {
    // console.log('preuseEffect textContentState inside editor', textContentState);
    // if (!editor || !textContentState) return;
    if (textContentState && textContentState !== editor?.getHTML()) {
      editor?.commands.setContent(textContentState);
    }
    // console.log('postuseEffect textContentState inside editor', textContentState);
  }, [textContentState]);

  // useEffect(() => {

  //   console.log('useEffecttextContentState inside editor', textContentState);

  // }, [textContentState]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      ResizableMedia.configure({
        uploadFn: async (file: File): Promise<string> => {
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
      DBlock,
      Link.configure({
        HTMLAttributes: {
          target: '_blank',
        },
      }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialContent,
    // content,
    // content: updatedContent || existingContent,
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full project-edit-tiptap`,
        spellcheck: 'false',
        suppressContentEditableWarning: 'true',
      },
    },
    onUpdate({ editor }) {
      // const htmlOutput = editor.getHTML();
      // console.log('updating state');
      // if (textContentState && (textContentState !== editor.getHTML())) {
      // setEditorContent(editor.getHTML());
      setTextContentState(editor.getHTML());
      // }
      // Update state every time the editor content changes
      // setEditorContent(editor.getHTML());
      // onUpdateEditor?.(editor.getHTML());
    },
  });

  return (
    <Group w="100%">
      <RichTextEditor mt={40} editor={editor} w="100%">
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          {userId && repoId && (
            <RichTextEditor.Control
              onClick={() =>
                editor
                  ?.chain()
                  .focus()
                  .insertResizableImage({
                    userId: userId,
                    repoId: repoId,
                  })
                  .run()
              }
              aria-label="Insert an image"
              title="Insert an image"
            >
              <IconPhotoPlus stroke={1.5} size="1rem" />
            </RichTextEditor.Control>
          )}

          <InsertCodeControls />

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
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
        {editor && (
          <BubbleMenu
            editor={editor}
            shouldShow={({ editor, view, state, oldState, from, to }) => {
              return (
                from !== to &&
                (editor.isActive('text') ||
                  editor.isActive('link') ||
                  editor.isActive('heading') ||
                  editor.isActive('bulletList') ||
                  editor.isActive('orderedList') ||
                  editor.isActive('blockquote'))
              );
            }}
          >
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Link />
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}
        {editor && (
          <FloatingMenu editor={editor}>
            <RichTextEditor.ControlsGroup>
              {userId && repoId && (
                <RichTextEditor.Control
                  onClick={() =>
                    editor
                      ?.chain()
                      .focus()
                      .insertResizableImage({
                        userId: userId,
                        repoId: repoId,
                      })
                      .run()
                  }
                  aria-label="Insert an image"
                  title="Insert an image"
                >
                  <IconPhotoPlus stroke={1.5} size="1rem" />
                </RichTextEditor.Control>
              )}
              <InsertCodeControls />
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </FloatingMenu>
        )}
        <RichTextEditor.Content />
      </RichTextEditor>
    </Group>
  );
}

export default TestingRichTextEditor;
