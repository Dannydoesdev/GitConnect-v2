import { useState, useEffect, useContext } from 'react';
import { Button, Center, Container, Group } from '@mantine/core';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { IconCode, IconPhoto, IconPhotoPlus, IconSourceCode } from '@tabler/icons-react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor, FloatingMenu, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import js from 'highlight.js/lib/languages/javascript';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { lowlight } from 'lowlight/lib/core';
import css from 'highlight.js/lib/languages/css';
import { DBlock } from './extensions/dBlock';
import { CustomResizableImage } from './extensions/image/customResizableImage';
import { ResizableMedia } from './extensions/resizableMedia';
import { notitapEditorClass } from './proseClassString';
import { useRouter } from 'next/router';
import { db } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { textEditorAtom } from '@/atoms/jotaiAtoms';
import { useAtom } from 'jotai';



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

function RichTextEditorVanilla({
  existingContent,
  updatedContent,
  repoId,
  userId,
  readme,
  onUpdateEditor,
}: RichTextEditorVanillaProps) {
  const [editorContent, setEditorContent] = useState('');
  const [content, setContent] = useState('');
  const [newReadme, setNewReadme] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);
  const [initialContent, setinitialContent] = useState(existingContent);
  const [textContentState, setTextContent] = useAtom(textEditorAtom);
  const router = useRouter();

  
  useEffect(() => {
    // if (readme && readme !== newReadme) {
      // setNewReadme(readme);
    if (readme) {
        // setTimeout(() => {
          editor?.commands.setContent(readme);
        // });
        // editor?.commands.insertContent(readme);
    }
  }, [readme]);

  // useEffect(() => {
  //   if (existingContent && editor) {
  //     editor?.commands.setContent(existingContent);
  //   }
  // }, []);


  useEffect(() => {
    const getFirebaseData = async () => {
      const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mainContent = docSnap.data();
        const htmlOutput = mainContent.htmlOutput;
        // handleSetTipTap(htmlOutput);
        if (htmlOutput?.length > 0) {
          // setinitialContent(htmlOutput);
          // handleSetTipTap(htmlOutput);
          editor?.commands.setContent(content);
        }
      }
    };

    getFirebaseData();
  }, [router, repoId, userId]);

  // function handleSetTipTap(content: any) {
  //   editor?.commands.setContent(content);
  // }

  // useEffect(() => {
  //   editor?.commands.setContent(initialContent);
  // }, [initialContent]);

  useEffect(() => {
    if (updatedContent && editor) {
      // setTimeout(() => {
      editor?.commands.setContent(updatedContent);
    // });
      }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      // BubbleMenu.configure({
      //   shouldShow: ({ editor, view, state, oldState, from, to }) => {
      //     // only show the bubble menu for images and links
      //     return editor.isActive('image') || editor.isActive('link')
      //   },
      // }),
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
      DBlock,
      Link.configure({
        HTMLAttributes: {
          target: '_blank',
        },
      }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: updatedContent || existingContent,
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full project-edit-tiptap`,
        spellcheck: 'false',
        suppressContentEditableWarning: 'true',
      },
    },
    onUpdate({ editor }) {
      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
      onUpdateEditor?.(editor.getHTML());
    },
  });

  function InsertImageControl() {
    // const { editor } = useRichTextEditorContext();
    if (!userId || !repoId) {
      return null;
    }
    return (
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
    );
  }

  // const shouldShow = ({ editor, view, state, oldState, from, to }) => { return editor.isActive('image') || editor.isActive('link') }

  return (
    <Group w="100%">
      {/* <Button onClick={() => editor?.chain().focus()?.insertImage()?.run()}>
        Insert Image
      </Button>
      <Button onClick={() => editor?.commands.insertImage()}>
        Insert Image single cmd
      </Button> */}

      <RichTextEditor
        mt={40}
        editor={editor}
        w="100%"
        styles={(theme) => ({
          control: {
            // backgroundColor: '#00acee',
            // border: 0,
          },
          // content: {
          //   backgroundColor: '#00000000',
          //   border: 0,
          // }
        })}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          {/* <InsertImageControl /> */}

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
          {/* <InsertImageControl userId={userId} repoId={repoId} /> */}

          {/* <InsertImageControlNew userId={userId as string} repoId={repoId as string} /> */}

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
              // console.log(from)
              // console.log(to)
              // don't show bubble menu on resizable images due to custom menu showing
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
              {/* <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 /> */}
              {/* <InsertImageControl /> */}
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

export default RichTextEditorVanilla;
