import { Command, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';

const ImageUpload = Extension.create({
  name: 'imageUpload',

  addCommands() {
    return {
      openImageUploadDialog: (): Command => ({ state, dispatch }) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', () => {
          if (fileInput.files && fileInput.files[0]) {
            // Here you can call your upload function and insert the image into the editor
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result;
              if (typeof src === 'string') {
                // This command inserts the image at the current selection
                // You should replace this with your upload function
                this.editor.chain().focus().setImage({ src }).run();
              }
            };
            reader.readAsDataURL(fileInput.files[0]);
          }
        });
        fileInput.click();
        return true;
      },
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-i': () => this.editor.commands.openImageUploadDialog(),
    };
  },
});