import {
  RichTextEditor,
  Link,
  useRichTextEditorContext,
} from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { useState, useEffect, useContext } from 'react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import { Button, Center, Container, Group } from '@mantine/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../../firebase/clientApp';

type RichTextEditorBeefyProps = {
  repoId?: string;
  userId?: string;
  existingContent?: string | null | undefined;
};

lowlight.registerLanguage('ts', tsLanguageSyntax);

function RichTextEditorBeefy({ existingContent }: RichTextEditorBeefyProps) {
  const [editorContent, setEditorContent] = useState('');
  const [content, setContent] = useState(existingContent);
  const [readme, setReadme] = useState('');

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
    content,
    onUpdate({ editor }) {
      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
    },
  });

  useEffect(() => {
    existingContent && editor?.commands.setContent(existingContent);
  }, [existingContent, editor]);

  const handleSave = async () => {
    // Save the edited content back to Firebase
    // const docRef = doc(db, `users/${userId}/repos/${repoId}`);
    // await updateDoc(docRef, {
    //   caseStudy: editor?.getHTML(),
    // });
    console.log('Saving changes...');
    console.log('editorContent: ', editorContent);
  };

  return (
    <Group w='100%'>
      {/* <Container> */}
      
        {/* <Group position='center'> */}
          <RichTextEditor
            mt={40}
            editor={editor}
            w='100%'
            // mx={200}
            // styles={(theme) => ({
            //   content: {
            //     color: editor?.isEditable ? 'auto' : '#999',
            //     minHeight: 500,

            //   },
            //   root: {
            //     cursor: editor?.isEditable ? 'auto' : 'not-allowed',
            //   },
            // })}
          >
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
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
        {/* </Group> */}
      {/* </Container> */}
    </Group>
  );
}

export default RichTextEditorBeefy;
