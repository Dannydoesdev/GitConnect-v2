import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import { useState, useEffect, useContext } from 'react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import { Button, Center } from '@mantine/core';
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { storage } from '../../firebase/clientApp'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from '../../context/AuthContext';
import DOMPurify from 'dompurify';

type TipTapProps = {
  repoId?: string
  initialFirebaseData?: string
}

const templateContent =
  '<h2 style="text-align: center;">Welcome to GitConnect; rich text editor</h2><p style="text-align: center;">You can edit this box and use the toolbar above to style - <em>currently, your changes will not save on refresh</em></p><hr><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul><img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />';


function TipTapEditor({ repoId }: TipTapProps) {
  const { userData } = useContext(AuthContext)
  const userId = userData.userId
  const userName = userData.userName

  const [editorContent, setEditorContent] = useState("");
  const [editable, setEditable] = useState(false)
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [firebaseData, setFirebaseData] = useState('');
  const [initialContent, setinitialContent] = useState(templateContent)
  const [content, setContent] = useState(templateContent);

  const [imgUrl, setImgUrl] = useState('');
  const [progresspercent, setProgresspercent] = useState(0);

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
      Image.configure({
        inline: true,
        // TODO: suggest moving the sizing to CSS properties based on class
        HTMLAttributes: {
          class: 'tiptapimage',
          height: 'auto',
          width: '100%',
        },
      }),
      Underline,
      Link.configure({
        HTMLAttributes: {
          target: '_blank',
        },
      }),
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    // See https://www.codemzy.com/blog/tiptap-drag-drop-image - for below logic explanatino
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        // test if dropping external files
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {

          let file = event.dataTransfer.files[0]; // the dropped file
          let filesize: any = ((file.size / 1024) / 1024).toFixed(4); // get the filesize in MB

          // Check for accepted file types
          if ((file.type === "image/jpeg" || file.type === "image/png") || file.type === "image/svg+xml" || file.type === "image/gif" || file.type === "image/webp" && filesize < 10) {

            //  valid image so upload to server
            
            // TODO: extract function outside handeDrop
            const uploadImage = (file: any) => {

              if (!file) return;
              // console.log(file)
              const storageRef = ref(storage, `users/${userId}/repos/${repoId}/tiptap/${file.name}`);
              const uploadTask = uploadBytesResumable(storageRef, file);

              uploadTask.on("state_changed",
                (snapshot) => {
                  const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  setProgresspercent(progress);
                },
                (error) => {
                  alert(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                    // place the now uploaded image in the editor where it was dropped
                    const { schema } = view.state;
                    const coordinates: any = view.posAtCoords({ left: event.clientX, top: event.clientY });
                    const node = schema.nodes.image.create({ src: downloadURL }); // creates the image element
                    const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                    return view.dispatch(transaction);
                  });
                }
              );
            }

            uploadImage(file)
       
          } else {
            window.alert("Images need to be in jpg, png, gif or webp format and less than 10mb in size.");
          }  
          return true; // handled
        }
        return false; // not handled use default behaviour
      }
    },
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

  // const userId = userData.userId
  // const userName = userData.userName

  // Updates whatever was in the 'htmlOutput' in Firestore with what is currently in the editor upon saving
  // Note - to check if this creates a document even when the path doesn't exist yet

  async function sendContentToFirebase() {

    // Sanitize with DomPurify before upload
    // need to add 'target = _blank' back in
    const sanitizedHTML = DOMPurify.sanitize(editorContent, { ADD_ATTR: ['target'] });

    const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)
    
    await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {

      
    // } else {
      // console.log("No such document!");
    //   await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
    // }

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
          {editor.isEditable ? 'Save Changes in Text Editor' : 'Unlock Text Editor'}
        </Button>
      </Center>

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

      {
        !imgUrl && progresspercent > 0 &&
        <div className='outerbar'>
          <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
        </div>
      }
    </>
  );
}

export default TipTapEditor

