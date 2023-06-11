import { useState, useEffect, useContext } from 'react';
import { Button, Center, Container, Group, Modal, TextInput } from '@mantine/core';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TipTapCustomImage } from './extensions/image';
import { UploadFn } from './extensions/image/upload_image';
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
import tsLanguageSyntax from 'highlight.js/lib/languages/typescript';
import { lowlight } from 'lowlight';
import { db } from '../../firebase/clientApp';
import { Video } from './extensions/video';
import { CustomImage } from './extensions/CustomImage';
import { ResizableMedia } from './extensions/resizableMedia';
// import "tippy.js/animations/shift-toward-subtle.css";
import { notitapEditorClass } from './proseClassString';
import { read } from 'fs';

type RichTextEditorBeefyProps = {
  repoId?: string;
  userId?: string;
  withImage?: boolean;
  // handleUpload: UploadFn;
  existingContent?: string | null | undefined;
};

lowlight.registerLanguage('ts', tsLanguageSyntax);

function RichTextEditorBeefy({
  existingContent,
  withImage,
  // handleUpload,
}: RichTextEditorBeefyProps) {
  const [editorContent, setEditorContent] = useState('');
  const [content, setContent] = useState(existingContent);
  const [readme, setReadme] = useState('');

  const [isVideoInputModalOpen, setIsVideoInputModalOpen] = useState(false);

  const [videoUrl, setVideoUrl] = useState(
    'https://user-images.githubusercontent.com/45892659/168123851-5fb7a3c3-d83f-4659-845f-3f96d4a2236c.mov'
  );


  const [image, setImage] = useState<File | undefined>();

  function promptFileInput(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        setImage(fileInput.files[0]);
        // readFileAsDataURL(fileInput.files[0])
        //   .then((result) => {
        //   console.log(result);
        // setEditorContent(result);
      }
      fileInput.click();
    });
  };
  

  function readFileAsDataURL(file: File): Promise<string> {
    // console.log(file)
    return new Promise(function (resolve, reject) {
      // const fileInput = document.createElement('input');
      // let imageToShow;
      // fileInput.type = 'file';
      // fileInput.accept = 'image/*';
      // fileInput.addEventListener('change', () => {
      //   if (fileInput.files && fileInput.files[0]) {
      //     setImage(fileInput.files[0]);
          let fr = new FileReader()

          fr.onload = function () {
            resolve(fr.result as string)
          }

          fr.onerror = function () {
            reject(fr)
          }

          fr.readAsDataURL(file)
        })
  }

	const handleUpload = async (file: File) => {
		const result = await readFileAsDataURL(file)

		return result;
	};

	// const extensions = getTipTapExtensions({ withImage, handleUpload, limit: charLimit, placeholder });

	useEffect(() => {
		async function handleImageUpload() {
			if (image && editor) {
				const src = await handleUpload(image);
				console.log({ src });
				editor.chain().focus()?.setImage({ src })?.run();
			}
		}
		handleImageUpload();
	}, [image]);

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
      // Resizable Media
      Video,
      // CustomImage,
      // Image.configure({
      //   allowBase64: true,
      // }),
      // CustomImage.configure({
      //   allowBase64: true,
      // }),
      ResizableMedia.configure({
        uploadFn: async (image) => {
          const fd = new FormData();

          fd.append('file', image);

          try {
            const response = await fetch('https://api.imgur.com/3/image', {
              method: 'POST',
              body: fd,
            });

            console.log(await response.json());
          } catch {
            // do your thing
          } finally {
            // do your thing
          }

          return 'https://source.unsplash.com/8xznAGy4HcY/800x400';
        },
      }),
      withImage ?
        TipTapCustomImage(handleUpload) :
        CustomImage.configure({
        allowBase64: true,
      }),
    ],
    content,
    // Taken from Notitap:
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

  useEffect(() => {
    existingContent && editor?.commands.setContent(existingContent);
  }, [existingContent, editor]);

  const addImage = () => editor?.commands.insertImage;
  // function addImage() {
  //   // editor &&
  //   if (editor && editor != undefined) {
  //     editor.commands.insertImage();
  //   }
  // }
  // editor?.commands.setMedia({
  //   src: 'https://source.unsplash.com/8xznAGy4HcY/800x400',
  //   'media-type': 'img',
  //   alt: 'Something else',
  //   title: 'placeholder',
  //   width: '800',
  //   height: '400',
  // });

  //   <RichTextEditor.ControlsGroup>
  //   <Button onClick={() => editor?.commands.insertImage()}>Upload Image</Button>
  // </RichTextEditor.ControlsGroup>

  const addVideo = () => editor?.commands.setVideo(videoUrl) && closeModal();

  const openModal = () => setIsVideoInputModalOpen(true);

  const closeModal = () => setIsVideoInputModalOpen(false);


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
    <Group w="100%">
      {/* <Container> */}

      {/* <Group position='center'> */}
      <Button onClick={openModal}>Add Video</Button>
      {/* <Button onClick={() => addImage()}>Add Image</Button> */}
      <Button onClick={() => editor?.commands.insertImage()}>Add Image</Button>
      {withImage && (
        <Button
          // onClick={(event: any) => setImage(event)}
          onClick={(event: any) => promptFileInput(event)}
        >
          Add an Image (New)
							{/* type="image"
							label="Add an image" */}
							{/* icon={IconFormatImage} */}
				</Button>
	)}
      {editor && (
        <RichTextEditor
          mt={40}
          editor={editor}
          w="100%"
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
      )}
      <Modal
        size="auto"
        opened={isVideoInputModalOpen}
        onClose={closeModal}
        title="Add Vieo Url"
      >
        {/* Modal content */}
        <Group noWrap mt="md">
          <TextInput
            label="Add Video Url"
            placeholder="Enter Video Url"
            value={videoUrl}
            onInput={(e) => setVideoUrl((e.target as HTMLInputElement).value)}
          />
        </Group>
        <Group position="center">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button onClick={addVideo}>Add Video</Button>
        </Group>
      </Modal>
    </Group>
  );
}

export default RichTextEditorBeefy;
