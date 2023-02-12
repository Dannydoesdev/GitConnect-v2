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



const templateContentTwo = `
  <h2>Hello World!</h2>
  <p>This is a sample template content.</p>
`;

// const RichTextEditor = () => {
//   const [content, setContent] = useState(templateContentTwo);

//   useEffect(() => {
//     const fetchData = async () => {
//       const db = firebase.firestore();
//       const docRef = db.collection("documents").doc("myDoc");
//       const doc = await docRef.get();
//       if (doc.exists) {
//         const htmlOutput = doc.data().htmlOutput;
//         if (htmlOutput) {
//           setContent(htmlOutput);
//         }
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <Editor
//       extensions={[
//         blockquote,
//         code_block,
//         hard_break,
//         heading,
//         list_item,
//         ordered_list,
//         bullet_list,
//         code,
//         table,
//         table_cell,
//         table_header,
//         table_row,
//         horizontal_rule,
//         mention,
//       ]}
//       content={content}
//       onUpdate={(newContent) => setContent(newContent)}
//     />
//   );
// };

// export default RichTextEditor;


const templateContent =
  '<h2 style="text-align: center;">Welcome to GitConnect; rich text editor</h2><p style="text-align: center;">You can edit this box and use the toolbar above to style - <em>currently, your changes will not save on refresh</em></p><hr><p><code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a href="https://tiptap.dev/" rel="noopener noreferrer" target="_blank">Tiptap.dev</a> and supports all of its features:</p><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li><li>And all <a href="https://tiptap.dev/extensions" target="_blank" rel="noopener noreferrer">other extensions</a></li></ul>';


// export async function getStaticProps({ repoId }: TipTapProps) {
//   console.log('hi')
//   const { userData } = useContext(AuthContext)
//   // const res = await fetch(`https://www.swapi.tech/api/films/`)
//   // const data = await res.json()

//   let initialFirebaseData;

//   const docRef = doc(db, `users/${userData.userId}/repos/${repoId}/projectData/mainContent`)
//   console.log('testStaticProps')
//   console.log(userData.userId)
//   console.log(repoId)
//   const docSnap = await getDoc(docRef);
//   if (docSnap.exists()) {

//     const mainContent = docSnap.data()
//     const htmlOutput = mainContent.htmlOutput
//     // console.log("Current document data:", docSnap.data());
//     console.log("Current html data:", mainContent.htmlOutput);
//     console.log(htmlOutput.length)

//     if (htmlOutput.length > 0) {
//       console.log('updating content')
//       initialFirebaseData = htmlOutput;
//       // setFirebaseData(htmlOutput)
//       // setinitialContent(htmlOutput)
//       // content = firebaseData;
//       // console.log(content)
//     } else { initialFirebaseData = templateContent; }
//           // setFirebaseData()

//     // const newDocSnap = await getDoc(docRef);
//     // console.log("New document data:", newDocSnap.data());
//   } else {

//     initialFirebaseData = templateContent;
//     // setinitialContent(templateContent)

//     // doc.data() will be undefined in this case
//     console.log("No such document!");

//   }
//   // console.log(initialContent)
//   return {
//     props: {
//       initialData: initialFirebaseData
//       // films: data.result
//     },
//     revalidate: 100,
//   };
// }


function TipTapEditorTest({ repoId, initialFirebaseData }: TipTapProps) {
  const { userData } = useContext(AuthContext)

  const [editorContent, setEditorContent] = useState("");
  const [editable, setEditable] = useState(false)
  const [editorEnabled, setEditorEnabled] = useState(false);
  const [firebaseData, setFirebaseData] = useState('');
  const [initialContent, setinitialContent] = useState(templateContent)
  const [content, setContent] = useState(templateContent);
  // const content = initialContent;

  // console.log('initial data:' + initialFirebaseData)

  async function getFirebaseData() {
    console.log(initialContent)
    const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {

      const mainContent = docSnap.data()
      const htmlOutput = mainContent.htmlOutput
      // console.log("Current document data:", docSnap.data());
      console.log("Current html data:", mainContent.htmlOutput);
      console.log(htmlOutput.length)

      if (htmlOutput.length > 0) {
        console.log('updating content')
        setFirebaseData(htmlOutput)
        setinitialContent(htmlOutput)
        // content = firebaseData;
        console.log(content)
      }
      // setFirebaseData()

      // const newDocSnap = await getDoc(docRef);
      // console.log("New document data:", newDocSnap.data());
    } else {

      setinitialContent(templateContent)

      // doc.data() will be undefined in this case
      console.log("No such document!");

    }
    console.log(initialContent)
  }

  // trying a new method to fetch on load and if exists to setContent
  // In editor I have set the content to be the state

  useEffect(() => {
    console.log('useEffect hit')
    const fetchData = async () => {

      const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)
      const docSnap = await getDoc(docRef);

      console.log('getting initial Data')
      if (docSnap.exists()) {
        const mainContent = docSnap.data()
        const htmlOutput = mainContent.htmlOutput
        // const htmlOutput = docSnap.data().htmlOutput;
        console.log('initial data (new):' + htmlOutput)
        if (htmlOutput) {
          setinitialContent(htmlOutput);
          // setContent(htmlOutput);
        }
      }
      console.log('state content:' + content)
    };
    fetchData();
  }, []);

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
    // content,
    content,
    // content: content,
    onUpdate({ editor }) {

      // Testing updating the state on each pass and referencing the state itself as the 'content' above
      // setContent(editor.getHTML())

      setEditorContent(editor.getHTML());
    },
  });




  function handleDoneAdding() {
    console.log(editable);
    if (!editor) {
      return undefined
    }
    if (editable === true) {

      sendContentToFirebase()
    }

    setEditable(!editable)

    console.log(editable);

  }


  // useEffect(() => {


  //   getFirebaseData()




  // }, [])




  const userId = userData.userId
  const userName = userData.userName

  console.log(repoId)
  console.log(userId)
  async function sendContentToFirebase() {

    // Note the format to find: 
    // /users/bO4o8u9IskNbFk2wXZmjtJhAYkR2/repos/572895196/projectData
    // WHERE DocumentID == mainContent

    // map through selected repos
    const projectRef = collection(db, `users/${userId}/repos/${repoId}/projectData`)
    const q = query(projectRef, where('DocumentID', '==', 'mainContent'))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });


    const docRef = doc(db, `users/${userId}/repos/${repoId}/projectData/mainContent`)

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Current document data:", docSnap.data());

      console.log('adding the following content to the document:')
      console.log(editorContent)
      await setDoc(docRef, { htmlOutput: editorContent }, { merge: true });
      const newDocSnap = await getDoc(docRef);
      console.log("New document data:", newDocSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    // .id('MainContent')
    // const q = query(projectRef, where('DocumentID', '==', 'mainContent'))

    // the document of the user in the users collection
    // const rootRef = collection(db, 'users')
    // const repoName = repoData.name;
    // const repoId = repoData.id
    // const docRef = doc(db, 'users', userId);
    // const q = query(collection(db, 'users'), where('userName', '==', userName));
    // const querySnapshot = await getDocs(q);
    // const queryData = querySnapshot.docs.map((detail: any) => {
    // });

    // console.log(queryData);


    // queryData.map(async (v) => {
    //   // console.log(v)
    //   await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { ...repoData, userId: userId  }, { merge: true })
    //     .then(() => {
    //       console.log(`Repo ${repoName} added to firestore under user ${userName} with ID: , ${repoId}`);
    //     })
    //     .catch((e) => { console.log(e); })
    // })


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

export default TipTapEditorTest

// Note the format to find: 
// /users/bO4o8u9IskNbFk2wXZmjtJhAYkR2/repos/572895196/projectData
// WHERE DocumentID == mainContent

//   const newRepo = (repoName: string, repo: any, isChecked: boolean) => {
    // add the selected repo to the selected repo state array
  //   setAddRepoData([...addRepoData, repo])
  //   // console.log(addRepoData)
  // }

  // const userId = userData.userId
  // const userName = userData.userName
  // // handle when user hits the 'done' button
  // const handleDoneAdding = () => {

  //   // map through selected repos
  //   addRepoData.map(async (repoData: any) => {
  //     // the document of the user in the users collection
  //     // const rootRef = collection(db, 'users')
  //     const repoName = repoData.name;
  //     const repoId = repoData.id
  //     const docRef = doc(db, 'users', userId);
  //     const q = query(collection(db, 'users'), where('userName', '==', userName));
  //     const querySnapshot = await getDocs(q);
  //     const queryData = querySnapshot.docs.map((detail: any) => {
  //     });

  //     // console.log(queryData);
  //     queryData.map(async (v) => {
  //       // console.log(v)
  //       //Removing the createdAt timestamp - was breaking the code
  //       //createdAt: serverTimestamp()
  //       await setDoc(doc(db, `users/${userId}/repos/${repoId}`), { ...repoData, userId: userId  }, { merge: true })
  //         .then(() => {
  //           console.log(`Repo ${repoName} added to firestore under user ${userName} with ID: , ${repoId}`);
  //         })
  //         .catch((e) => { console.log(e); })
  //     })
  //   })
  //   Router.push('/')
  // }
