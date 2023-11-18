import { useContext, useEffect, useState } from 'react';
import { aiEditorAtom } from '@/atoms';
import { Blockquote, Button, Group } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useAtom } from 'jotai';
import { InfoCircle } from 'tabler-icons-react';
import { useDisclosure } from '@mantine/hooks';
import { GenerateCoverImageModal } from './GenerateImage';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/router';


// export function NarrativeEditor({ generatedContent }: any) {
export function NarrativeEditor() {
  // const [content, setContent] = useState();
  const [editorContent, setEditorContent] = useState('');
  const [textContentState, setTextContentState] = useAtom(aiEditorAtom);
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const { userData } = useContext(AuthContext);

  const userId = userData?.uid;
  const repoId = router.query.repoId;

  useEffect(() => {
    if (textContentState && textContentState !== editor?.getHTML()) {
      editor?.commands.setContent(textContentState);
    }
  }, [textContentState]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    // content,
    onUpdate({ editor }) {
      // Update state every time the editor content changes
      setEditorContent(editor.getHTML());
    },
  });

  // Sync the editor content with the streamed content
  // useEffect(() => {
  //   // if (editor && content !== editor.getHTML()) {
  //     editor?.commands.setContent(generatedContent);
  //   // }
  // }, [generatedContent, editor]);

  // if (!editor) {
  //   return null;
  // }

  return (
    <div>
       <GenerateCoverImageModal
            // settingsOnly={settingsOnly}
            // handleNewCoverImage={handleNewCoverImage}
        repoId={repoId}
        userId={userId}
            // handlePublish={handlePublish}
            // handleSaveAsDraft={handleSaveAndFinish}
            // handleSaveSettings={handleSaveSettings}
            // handleSaveAsDraft={handleSaveAsDraft}
            opened={opened}
            open={open}
        close={close}
      />
      <Blockquote
        cite="- GitConnect tips"
        color="indigo"
        icon={<InfoCircle size="1.5rem" />}
      >
        Below is the generated project which you can editor <br /> You will be able to
        further customise your project at the next step
      </Blockquote>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            {/* Define your toolbar controls here */}
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            {/* ... add other controls as needed */}
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />

        {/* <EditorContent editor={editor} /> */}
      </RichTextEditor>
      <Group position="center" mt="xl">
        <Button
          // onClick={handleBackStep}
          variant="default"
          onClick={open}
          // disabled={currentStep === 0}
        >
          Generate an image
        </Button>
        <Button>
          Save and Continue
        </Button>
      </Group>
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { RichTextEditor } from '@mantine/tiptap';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Highlight from '@tiptap/extension-highlight';
// import Subscript from '@tiptap/extension-subscript';
// import Superscript from '@tiptap/extension-superscript';
// import Link from '@tiptap/extension-link';

// export function NarrativeEditor({ content, setContent }: any) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       Superscript,
//       Subscript,
//       Highlight,
//       TextAlign.configure({ types: ['heading', 'paragraph'] }),
//     ],
//     content: content,
//   });

//   // Sync the editor content with the streamed content
//   useEffect(() => {
//     if (editor && content !== editor.getHTML()) {
//       editor.commands.setContent(content);
//     }
//   }, [content, editor]);

//   // Update parent component's state on editor update
//   useEffect(() => {
//     if (editor) {
//       editor.on('update', () => {
//         setContent(editor.getHTML());
//       });
//     }
//   }, [editor, setContent]);

//   if (!editor) {
//     return null;
//   }

//   return (
//     <RichTextEditor editor={editor}>
//       <RichTextEditor.Toolbar>
//         {/* Define your toolbar controls here */}
//         <RichTextEditor.Bold />
//         <RichTextEditor.Italic />
//         <RichTextEditor.Underline />
//         {/* ... add other controls as needed */}
//       </RichTextEditor.Toolbar>

//       <EditorContent editor={editor} />
//     </RichTextEditor>
//   );
// }
