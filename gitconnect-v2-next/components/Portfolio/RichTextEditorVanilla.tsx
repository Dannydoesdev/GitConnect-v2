import { useState, useEffect, useContext } from 'react';
import { Button, Center, Container, Group } from '@mantine/core';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import { lowlight } from 'lowlight';
import { CustomImage } from './extensions/image/customImageNew';
import { IconStar } from '@tabler/icons-react';
import { storage } from '@/firebase/clientApp';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '@/context/AuthContext';

function InsertImageControl() {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor?.chain().focus().insertImage().run()}
      aria-label="Insert an image"
      title="Insert an image"
    >
      <IconStar stroke={1.5} size="1rem" />
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


  const { userData } = useContext(AuthContext)
  const userId = userData.userId;
  const repoId = 519774186;


  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      CustomImage,
      CodeBlockLowlight.configure({
        HTMLAttributes: {
          class: 'lowlight',
        },
        lowlight,
      }),
      Underline,
      // Link.configure({
      //   HTMLAttributes: {
      //     target: '_blank',
      //   },
      // }),
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    // content,
     // See https://www.codemzy.com/blog/tiptap-drag-drop-image - for below logic explanatino
     editorProps: {
      handleDrop: function (view, event, slice, moved) {
        // test if dropping external files
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {

          let file = event.dataTransfer.files[0]; // the dropped file
          let filesize: any = ((file.size / 1024) / 1024).toFixed(4); // get the filesize in MB
          console.log(filesize)
          console.log(file.type)
          // Check for accepted file types
          // if ((file.type === "image/jpeg" || file.type === "image/png") || file.type === "image/svg+xml" || file.type === "image/gif" || file.type === "image/webp" && filesize < 10) {
          //   console.log(filesize < 15)
          // console.log(file.type == "image")
          // console.log(file.type.startsWith("image/"))
          if (file.type.startsWith("image/") && filesize < 15) {
            // if (file.type === "image/*" && filesize < 15) {
            //  valid image so upload to server
              // console.log(filesize <= 15)
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
            window.alert("Editor files must be images and need to be less than 15mb in size.");
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

    // onUpdate({ editor }) {
    //   // Update state every time the editor content changes
    //   setEditorContent(editor.getHTML());
    // },
  // });

  // useEffect(() => {
  //   existingContent && editor?.commands.setContent(existingContent);
  // }, [existingContent, editor]);

  return (
    <Group w="100%">
      <Button onClick={() => editor?.chain().focus().insertImage().run()}>
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
