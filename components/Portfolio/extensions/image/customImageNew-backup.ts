import { Command } from '@tiptap/core';
import { Image } from '@tiptap/extension-image';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Node } from '@tiptap/core';

// export const CustomImage = TiptapImage.extend({
//   addCommands() {
//     return {
//       insertImage: () => ({ commands, editor }) => {
//         const fileInput = document.createElement('input');
//         fileInput.type = 'file';
//         fileInput.accept = 'image/*';
//         fileInput.addEventListener('change', () => {
//           if (fileInput.files && fileInput.files[0]) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//               const src = e.target?.result;
//               if (typeof src === 'string') {
//                 const { tr } = editor.state;
//                 const imageNode = editor.schema.nodes.image.create({ src });
//                 const transaction = tr.insert(editor.selection.from, imageNode);
//                 editor.view.dispatch(transaction);
//               }
//             };
//             reader.readAsDataURL(fileInput.files[0]);
//           }
//         });
//         fileInput.click();
//         return true;
//       },
//     };
//   },
// });

// export const CustomImage = TiptapImage.extend({
//   addCommands() {
//     return {
//       insertImage: () => ({ commands, editor }) => {
//         const fileInput = document.createElement('input');
//         fileInput.type = 'file';
//         fileInput.accept = 'image/*';
//         fileInput.addEventListener('change', () => {
//           if (fileInput.files && fileInput.files[0]) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//               const src = e.target?.result;
//               if (typeof src === 'string') {
//                 const imageNode = Node.create({
//                   type: 'image',
//                   attrs: {
//                     src: src,
//                   },
//                 });
//                 commands.insertNode(imageNode);
//               }
//             };
//             reader.readAsDataURL(fileInput.files[0]);
//           }
//         });
//         fileInput.click();
//         return true;
//       },
//     };
//   },
// });



declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      /**
       * Set an image node
       */
      insertImage: () => ReturnType;
    };
  }
}

// export const CustomImage = Image.extend({
//   addOptions() {
//     return {
//       ...this.parent?.(),
//       allowBase64: true,
//     };
//   },
//   renderHTML({ node, HTMLAttributes }) {
//     return [
//       'img',
//       {
//         ...HTMLAttributes,
//         src: node.attrs.src,
//         alt: node.attrs.alt,
//         title: node.attrs.title,
//       },
//       0,
//     ];
//   },
//   addCommands() {
//     return {
//       insertImage:
//         () =>
//         ({ commands, editor }) => {
//           const fileInput = document.createElement('input');
//           let imageSrc;
//           fileInput.type = 'file';
//           fileInput.accept = 'image/*';
//           fileInput.addEventListener('change', () => {
//             if (fileInput.files && fileInput.files[0]) {
//               const reader = new FileReader();
//               reader.onload = async (e) => {
//                 const src = e.target?.result;
//                 // console.log(src);
//                 // imageSrc =  await src;
//                 if (typeof src === 'string') {
                  
//                   // this.parent.
//                   commands.setContent({
//                   type: 'image',
//                     attrs: {
//                       src: '/img/gc-sml.webp',
//                     },
//                   });
               
//                   // this.editor.commands.setImage({
//                   //   // type: 'image',
//                   //   src: src,
//                   // });
//                 }
//               };
//               reader.readAsDataURL(fileInput.files[0]);
//             }
//           });
//           fileInput.click();
//           console.log('imageSrc');
//           console.log(imageSrc);
//           return true;
//           commands.setContent({
//             type: 'image',
//             attrs: {
//               src: imageSrc,
//             },
//             // commands.setImage({
//             //   src: imageSrc,
//             // })
//           });
//           // true;
//         },
//     };
//   },
// });

export const CustomImage = TiptapImage.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      allowBase64: true,
    }
  },
  // defaultOptions: {
  //   ...TiptapImage.defaultOptions,
  //   allowBase64: true,
  // },
  addCommands() {
    return {
      insertImage: () => ({ commands, editor }) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', () => {
          if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result;
              if (typeof src === 'string') {
                // console.log(src);
                // This command inserts the image at the current selection
                commands.insertContent({
                  type: 'image',
                  // src: src,
                  src: '/img/gc-sml.webp'
                });
              }
            };
            reader.readAsDataURL(fileInput.files[0]);
          }
        });
        fileInput.click();
        return true;
        (
          commands.insertContent({
            type: 'image',
            // src: src,
            src: '/img/gc-sml.webp'
          })
        )
// true;
      },
    };
  },
  // addNodeView() {
  //   return () => {
  //     const container = document.createElement('div');
  //     const content = document.createElement('div');
  //     container.append(content);
  //     return {
  //       dom: container,
  //       contentDOM: content,
  //     };
  //   };
  // },
});
