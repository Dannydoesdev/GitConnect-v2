import { Image as TiptapImage } from '@tiptap/extension-image';
import { Command } from '@tiptap/core';
import { Node, nodeInputRule } from '@tiptap/react'


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      /**
       * Set a video node
       */
      insertImage: () => ReturnType,
      /**
       * Toggle a video
       */
      // toggleVideo: (src: string) => ReturnType,
    }
  }
}

export const CustomImage = TiptapImage.extend({

  addAttributes() {
    return {
      ...this.parent?.(),
      fileInput: {
        default: null,
        parseHTML: () => ({
          fileInput: null,
        }),
        renderHTML: () => ({
          fileInput: null,
        }),
      },
    };
  },

  addCommands() {
    return {
      insertImage: () => ({ commands }) => {
        const fileInput = document.createElement('input');
        let imageToShow;
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', () => {
          if (fileInput.files && fileInput.files[0]) {
            // console.log(fileInput.files[0]);
            // Here you can call your upload function and insert the image into the editor
            commands.insertContent('<h1>Example Text</h1>')

            // commands.insertContent([
            //   {
            //     type: 'paragraph',
            //     content: [
            //       {
            //         type: 'text',
            //         text: 'Test'
            //       }
            //     ],
            //   }
            // ])
          
            // const imgSrc = URL.createObjectURL(fileInput.files[0]);
            // console.log(imgSrc)
            // commands.insertContent({
            //   type: 'image',
            //   src: imgSrc,
            // });
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result;
              // console.log(src)
              if (typeof src === 'string') {
                // This command inserts the image at the current selection
                // You should replace this with your upload function
                imageToShow = src;
                // return (
                //   commands.insertContent({
                //     type: 'image',
                //     attrs: {
                //       allowBase64: true,
                //     },
                //   src: src,
                //   })
                // )

                // commands.insertContent({
                //   type: 'image',
                //   src: src,
                // });
                // commands.insertContent(`<img src="${src}" />`);
                // commands.setImage({ src: src  })
              }
            };
            reader.readAsDataURL(fileInput.files[0]);
            // console.log(reader.readAsDataURL(fileInput.files[0]));
          }
        });
        fileInput.click();
        // return true;
        return (
          commands.insertContent({
            type: 'image',
            src: imageToShow,
            settings: {
              allowBase64: true,
            },
          
          })
        )
        return commands.insertContent('<h1>Example Text</h1>');
      },
    };
  },


});

