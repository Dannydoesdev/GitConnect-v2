import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";


function BlockNote() {
  // Creates a new editor instance.
  const editor: BlockNoteEditor | null = useBlockNote({});

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} />;
}

export default BlockNote;