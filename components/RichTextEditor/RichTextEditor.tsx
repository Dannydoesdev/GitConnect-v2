import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { useState, useEffect, useContext } from 'react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Button, Center } from '@mantine/core';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { AuthContext } from '../../context/AuthContext';

type TipTapProps = {
  repoId?: string
  initialFirebaseData?: string
}

const templateContent =
  '<h2 style="text-align: center;">Welcome to GitConnect; rich text editor</h2><p style="text-align: center;">You can edit this box and use the toolbar above to style - <em>currently, your changes will not save on refresh</em></p><hr><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';


function TipTapEditor({ repoId, initialFirebaseData }: TipTapProps) {
  const { userData } = useContext(AuthContext)

  const [editorContent, setEditorContent] = useState("");
  const [editable, setEditable] = useState(false)
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [firebaseData, setFirebaseData] = useState('');
  const [initialContent, setinitialContent] = useState(templateContent)
  const [content, setContent] = useState(templateContent);


  // Load any existing data from Firestore & put in state

  useEffect(() => {

    const getFirebaseData = async () => {

      const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const mainContent = docSnap.data()
        const htmlOutput = mainContent.htmlOutput

        if (htmlOutput.length > 0) {
          setinitialContent(htmlOutput);

        }
      }

    };
    getFirebaseData();
  }, []);


  // Set the existing data as the editor content if found

  useEffect(() => {
    editor?.commands.setContent(initialContent);
  }, [initialContent]);


  const editor = useEditor({
    editable,
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate({ editor }) {

      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
    },
  });


  // One button currently for 'edit' and 'save'
  // When clicking 'edit' this button will change the editor to 'editable'
  // When updates are finished - clicking 'save' will send the html content to Firestore
  // Checks whether the user was actually editing before sending

  function handleDoneAdding() {
    if (!editor) {
      return undefined
    }
    if (editable === true) {

      sendContentToFirebase()
    }

    setEditable(!editable)
  }

  const userId = userData.userId
  const userName = userData.userName



  // Updates whatever was in the 'htmlOutput' in Firestore with what is currently in the editor upon saving
  // Note - to check if this creates a document even when the path doesn't exist yet

  async function sendContentToFirebase() {

    const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Current document data:", docSnap.data());
      // console.log('adding the following content to the document:')
      // console.log(editorContent)

      await setDoc(docRef, { htmlOutput: editorContent }, { merge: true });
      // const newDocSnap = await getDoc(docRef);
      // console.log("New document data:", newDocSnap.data());
    } else {
      console.log("No such document!");
    }

  }

  useEffect(() => {
    if (!editor) {
      return undefined
    }
    if (editor.isEditable == editable) return

    if (editor.isEditable != editable) {

      editor.setEditable(editable)

      // Work around for updating on first editable change
      setEditorEnabled(editable)
    }

  }, [editable]);

  if (!editor) {
    return null
  }

  return (
    <>
      <RichTextEditor
        mt={70}
        editor={editor}
        styles={(theme) => ({
          content: {
            color: editor.isEditable ? 'auto' : '#999',
          },
          root: {
            cursor: editor.isEditable ? 'auto' : 'not-allowed',
          },
        })}
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
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
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

      <Center>
        <Button
          component="a"
          size="lg"
          radius="md"
          mt={40}
          className='mx-auto'
          onClick={handleDoneAdding}
          styles={(theme) => ({
            root: {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.blue[6],
              width: '40%',
              [theme.fn.smallerThan('sm')]: {
                width: '70%',
              },
              '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.blue[7],
              },
            },
          })}
        >
          {editor.isEditable ? 'Save Changes' : 'Edit Project'}
        </Button>
      </Center>
    </>
  );
}

export default TipTapEditor
