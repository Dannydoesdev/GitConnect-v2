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

// function createObjectUrl(file: File) {
//   throw new Error('Function not implemented.');
// }

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

  // const uploadImage = (file: any) => {
  //   // e.preventDefault()
  //   // const file = e.target[0]?.files[0]
  //   if (!file) return;
  //   console.log(file)
  //   const storageRef = ref(storage, `users/${userId}/repos/${repoId}/tiptap/${file.name}`);
  //   console.log(storageRef)
  //   const uploadTask = uploadBytesResumable(storageRef, file);

  //   uploadTask.on("state_changed",
  //     (snapshot) => {
  //       const progress =
  //         Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  //       setProgresspercent(progress);
  //     },
  //     (error) => {
  //       alert(error);
  //     },
  //     () => {
  //       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //         setImgUrl(downloadURL)
  //         return downloadURL
  //         console.log(downloadURL)
  //       });
  //     }
  //   );

  // }

  // function uploadImage(file: any) {
  //   const data = new FormData();
  //   data.append('file', file);
  //   return axios.post('/documents/image/upload', data);
  // };

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
      Image,
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
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
          console.log(event.dataTransfer.files)
          let file = event.dataTransfer.files[0]; // the dropped file
          let filesize: any = ((file.size / 1024) / 1024).toFixed(4); // get the filesize in MB
          // console.log(filesize)
          if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) {
            
            // img.onload = function () {
            // if (this.width > 5000 || this.height > 5000) {
              // window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
              // } else {
            //  valid image so upload to server
              // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
            
              const uploadImage = (file: any) => {
                // e.preventDefault()
                // const file = e.target[0]?.files[0]
                if (!file) return;
                console.log(file)
                const storageRef = ref(storage, `users/${userId}/repos/${repoId}/tiptap/${file.name}`);
                console.log(storageRef)
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
                      const { schema } = view.state;
                      console.log(schema)
                      const coordinates: any = view.posAtCoords({ left: event.clientX, top: event.clientY });
                      console.log(coordinates)
                      const node = schema.nodes.image.create({ src: downloadURL }); // creates the image element
                      console.log(node)
                      const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                      console.log(transaction)
                      return view.dispatch(transaction);
                    });
                  }
                );
            
              }
            
            
            uploadImage(file)
            // async function setImageInTipTap(params: any) {
              // const imageReturn = uploadImage(file)
              // console.log(imageReturn)
           
                // }
                 
              // .then(function (response) { 
              //    response is the image url for where it has been saved
              // pre-load the image before responding so loading indicators can stay
              // and swaps out smoothly when image is ready
              // let image = new Image();
              // image.src = response;
              // image.onload = function() {
              // place the now uploaded image in the editor where it was dropped
                
              //     const { schema } = view.state;
              //     const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
              //     const node = schema.nodes.image.create({ src: response }); // creates the image element
              //     const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
              // return view.dispatch(transaction);
                
              //   }
              // }).catch(function(error) {
              //   if (error) {
              //     window.alert("There was a problem uploading your image, please try again.");
              //   }
            // }
            //   }
            // })
            // }

          } else {
            window.alert("Images need to be in jpg or png format and less than 10mb in size.");
          }  // check valid image type under 10MB
          // check the dimensions
          // let _URL = window.URL || window.webkitURL;
          // const objectURL = window.URL.createObjectURL(file);
          // let URL = createObjectUrl(file)
          // let imgSrc = _URL.createObjectURL(file);
          // console.log('MDN method' + objectURL)
          // console.log('article method' + imgSrc)
          // console.log('simple' + URL)
          // let img: any = new Image(); /* global Image */
          // img.src = _URL.createObjectURL(file);
          // img.onload = function () {
          // if (this.width > 5000 || this.height > 5000) {
          // window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
          // } else {
          // valid image so upload to server
          // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
          // uploadImage(file).then(function(response) { // response is the image url for where it has been saved
          // do something with the response
          // }).catch(function(error) {
          // if (error) {
          // window.alert("There was a problem uploading your image, please try again.");
          // }
          // });
          // }
          // };
        
          return true; // handled
        // } else {
          // window.alert("Images need to be in jpg or png format and less than 10mb in size.");
          // }
          // return true; // handled
          }
          return false; // not handled use default behaviour
        // }
      }  
    },
    content,
    onUpdate({ editor }) {

      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
    },
  });


 // full code:
//  editorProps: {
//   handleDrop: function(view, event, slice, moved) {
//     if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) { // if dropping external files
//       let file = event.dataTransfer.files[0]; // the dropped file
//       let filesize = ((file.size/1024)/1024).toFixed(4); // get the filesize in MB
//       if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) { // check valid image type under 10MB
//         // check the dimensions
//         let _URL = window.URL || window.webkitURL;
//         let img = new Image(); /* global Image */
//         img.src = _URL.createObjectURL(file);
//         img.onload = function () {
//           if (this.width > 5000 || this.height > 5000) {
//             window.alert("Your images need to be less than 5000 pixels in height and width."); // display alert
//           } else {
//             // valid image so upload to server
//             // uploadImage will be your function to upload the image to the server or s3 bucket somewhere
//             uploadImage(file).then(function(response) { // response is the image url for where it has been saved
//               // pre-load the image before responding so loading indicators can stay
//               // and swaps out smoothly when image is ready
//               let image = new Image();
//               image.src = response;
//               image.onload = function() {
//                 // place the now uploaded image in the editor where it was dropped
//                 const { schema } = view.state;
//                 const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
//                 const node = schema.nodes.image.create({ src: response }); // creates the image element
//                 const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
//                 return view.dispatch(transaction);
//               }
//             }).catch(function(error) {
//               if (error) {
//                 window.alert("There was a problem uploading your image, please try again.");
//               }
//             });
//           }
//         };
//       } else {
//         window.alert("Images need to be in jpg or png format and less than 10mb in size.");
//       }
//       return true; // handled
//     }
//     return false; // not handled use default behaviour
//   }
// },
// content: `
//   <p>Hello World!</p>
//   <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
// `,
// });


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
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
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

