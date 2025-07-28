import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/firebase/clientApp';
import { Group } from '@mantine/core';
import {
  RichTextEditor,
  Link,
  useRichTextEditorContext,
} from '@mantine/tiptap';
import { IconCode, IconPhotoPlus, IconSourceCode } from '@tabler/icons-react';
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
import css from 'highlight.js/lib/languages/css';
import { useAtom } from 'jotai';
import { textEditorAtom, unsavedChangesAtom } from '@/atoms/jotaiAtoms';
import { lowlight } from 'lowlight/lib/core';
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
        aria-label='Code block'
        title='Code block'
      >
        <IconSourceCode stroke={1.5} size='1rem' />
      </RichTextEditor.Control>
      <RichTextEditor.Control
        onClick={() => editor.chain().focus().toggleCode().run()}
        aria-label='Code'
        title='Code'
      >
        <IconCode stroke={1.5} size='1rem' />
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

function ProjectRichTextEditor({ repoId, userId }: RichTextEditorVanillaProps) {
  const router = useRouter();

  const [textContentState, setTextContentState] = useAtom(textEditorAtom);
  const [initialContent, setInitialContent] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useAtom(unsavedChangesAtom);

  const [content, setContent] = useState(textContentState);

  useEffect(() => {
    const getFirebaseData = async () => {
      const docRef = doc(
        db,
        `users/${userId}/repos/${repoId}/projectData/mainContent`
      );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mainContent = docSnap.data();
        const htmlOutput = mainContent.htmlOutput;
        handleSetTipTap(htmlOutput);
        if (htmlOutput?.length > 0) {
          setInitialContent(htmlOutput);
          setTextContentState(htmlOutput);
          editor?.commands.setContent(htmlOutput);
        }
      }
    };

    getFirebaseData();
  }, [router, repoId, userId]);

  function handleSetTipTap(content: any) {
    editor?.commands.setContent(content);
  }

  useEffect(() => {
    editor?.commands.setContent(initialContent);
  }, [initialContent]);

  useEffect(() => {
    if (textContentState && textContentState !== editor?.getHTML()) {
      editor?.commands.setContent(textContentState);
    }
  }, [textContentState]);

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
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `${notitapEditorClass} focus:outline-none w-full project-edit-tiptap`,
        spellcheck: 'false',
        suppressContentEditableWarning: 'true',
      },
    },
    onUpdate({ editor }) {
      setTextContentState(editor.getHTML());
      setUnsavedChanges(true);
    },
  });

  return (
    <Group w='100%'>
      <RichTextEditor mt={40} editor={editor} w='100%'>
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
              aria-label='Insert an image'
              title='Insert an image'
            >
              <IconPhotoPlus stroke={1.5} size='1rem' />
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
          <FloatingMenu
            editor={editor}
            tippyOptions={{ placement: 'top-start', duration: 100 }}
          >
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
                  aria-label='Insert an image'
                  title='Insert an image'
                >
                  <IconPhotoPlus stroke={1.5} size='1rem' />
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

export default ProjectRichTextEditor;
