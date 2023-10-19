import { storage } from '@/firebase/clientApp';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customImage: {
      /**
       * Set an image node
       */
      insertImage: () => ReturnType;
      // insertResizableImage:  () => ReturnType;
    };
  }
}

const userId = 'bO4o8u9IskNbFk2wXZmjtJhAYkR2';
const repoId = 519774186;


export const CustomImage = TiptapImage.extend({
  addCommands() {
    return {
      insertImage:
      // insertResizableImage:
        () =>
        ({ commands, editor }) => {
          // handleDrop: function (view, event, slice, moved) {
          // test if dropping external files
          // if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
              let file = fileInput.files[0]; // the dropped file
              // let file = event.dataTransfer.files[0]; // the dropped file
              let filesize: any = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
              // console.log(filesize);
              // console.log(file.type);
              if (file.type.startsWith('image/') && filesize < 15) {
                // const reader = new FileReader();
                // reader.onload = (e) => {
                //   const src = e.target?.result;
                //   if (typeof src === 'string') {
                // const { tr } = editor.state;
                // const imageNode = editor.schema.nodes.image.create({ src });
                // const transaction = tr.insert(editor.selection.from, imageNode);
                // editor.view.dispatch(transaction);
                // }

                const uploadImage = (file: any) => {
                  if (!file) return;
                  const storageRef = ref(
                    storage,
                    `users/${userId}/repos/${repoId}/tiptap/${file.name}`
                  );
                  const uploadTask = uploadBytesResumable(storageRef, file);

                  uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                      const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                      );
                      // setProgresspercent(progress);
                    },
                    (error) => {
                      alert(error);
                    },
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        // setImgUrl(downloadURL);
                        // let imgUrl = downloadURL;
                        // place the now uploaded image in the editor where it was dropped
                        const { view } = editor;
                        const { schema, selection } = view.state;
                        // const coordinates: any = view.posAtCoords({
                        //   left: event.clientX,
                        //   top: event.clientY,
                        // });
                        const position = selection.$head
                          ? selection.$head.pos
                          : selection.$to.pos;
                        const node = schema.nodes.image.create({ src: downloadURL }); // creates the image element
                        const transaction = view.state.tr.insert(position, node);

                        // const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
                        return view.dispatch(transaction);
                      });
                    }
                  );
                };

                uploadImage(file);
                // reader.readAsDataURL(fileInput.files[0]);
              } else {
                window.alert(
                  'Editor files must be images and need to be less than 15mb in size.'
                );
              }
              return true; // not handled use default behaviour
            }
            return false; // not handled use default behaviour
          });
          fileInput.click();
          return true;
        },
    };
  },
});

// export const CustomImage = TiptapImage.extend({
//   addCommands() {
//     return {
//       insertImage:
//         () =>
//         ({ commands, editor }) => {
//           // handleDrop: function (view, event, slice, moved) {
//           // test if dropping external files
//           // if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
//           const fileInput = document.createElement('input');
//           fileInput.type = 'file';
//           fileInput.accept = 'image/*';
//           fileInput.addEventListener('change', () => {
//             if (fileInput.files && fileInput.files[0]) {
//               let file = fileInput.files[0]; // the dropped file
//               // let file = event.dataTransfer.files[0]; // the dropped file
//               let filesize: any = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
//               console.log(filesize);
//               console.log(file.type);
//               if (file.type.startsWith('image/') && filesize < 15) {
//                 // const reader = new FileReader();
//                 // reader.onload = (e) => {
//                 //   const src = e.target?.result;
//                 //   if (typeof src === 'string') {
//                 // const { tr } = editor.state;
//                 // const imageNode = editor.schema.nodes.image.create({ src });
//                 // const transaction = tr.insert(editor.selection.from, imageNode);
//                 // editor.view.dispatch(transaction);
//                 // }

//                 const uploadImage = (file: any) => {
//                   if (!file) return;
//                   const storageRef = ref(
//                     storage,
//                     `users/${userId}/repos/${repoId}/tiptap/${file.name}`
//                   );
//                   const uploadTask = uploadBytesResumable(storageRef, file);

//                   uploadTask.on(
//                     'state_changed',
//                     (snapshot) => {
//                       const progress = Math.round(
//                         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                       );
//                       // setProgresspercent(progress);
//                     },
//                     (error) => {
//                       alert(error);
//                     },
//                     () => {
//                       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                         // setImgUrl(downloadURL);
//                         // let imgUrl = downloadURL;
//                         // place the now uploaded image in the editor where it was dropped
//                         const { view } = editor;
//                         const { schema, selection } = view.state;
//                         // const coordinates: any = view.posAtCoords({
//                         //   left: event.clientX,
//                         //   top: event.clientY,
//                         // });
//                         const position = selection.$head
//                           ? selection.$head.pos
//                           : selection.$to.pos;
//                         const node = schema.nodes.image.create({ src: downloadURL }); // creates the image element
//                         const transaction = view.state.tr.insert(position, node);

//                         // const transaction = view.state.tr.insert(coordinates.pos, node); // places it in the correct position
//                         return view.dispatch(transaction);
//                       });
//                     }
//                   );
//                 };

//                 uploadImage(file);
//                 // reader.readAsDataURL(fileInput.files[0]);
//               } else {
//                 window.alert(
//                   'Editor files must be images and need to be less than 15mb in size.'
//                 );
//               }
//               return true; // not handled use default behaviour
//             }
//             return false; // not handled use default behaviour
//           });
//           fileInput.click();
//           return true;
//         },
//     };
//   },
// });

//   insertImage: () => ({ commands, editor }) => {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = 'image/*';
//     fileInput.addEventListener('change', () => {
//       if (fileInput.files && fileInput.files[0]) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const src = e.target?.result;
//           if (typeof src === 'string') {
//             const { tr } = editor.state;
//             const imageNode = editor.schema.nodes.image.create({ src });
//             const transaction = tr.insert(editor.selection.from, imageNode);
//             editor.view.dispatch(transaction);
//           }
//         };
//         reader.readAsDataURL(fileInput.files[0]);
//       }
//     });
//     fileInput.click();
//     return true;
//   },
// };
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
//   addOptions() {
//     return {
//       ...this.parent?.(),
//       allowBase64: true,
//     }
//   },
//   // defaultOptions: {
//   //   ...TiptapImage.defaultOptions,
//   //   allowBase64: true,
//   // },
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
//                 // console.log(src);
//                 // This command inserts the image at the current selection
//                 commands.insertContent({
//                   type: 'image',
//                   // src: src,
//                   src: '/img/gc-sml.webp'
//                 });
//               }
//             };
//             reader.readAsDataURL(fileInput.files[0]);
//           }
//         });
//         fileInput.click();
//         return true;
//         (
//           commands.insertContent({
//             type: 'image',
//             // src: src,
//             src: '/img/gc-sml.webp'
//           })
//         )
// // true;
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

// export const CustomImage = TiptapImage.extend({
//   addOptions() {
//     return {
//       ...this.parent?.(),
//       allowBase64: true,
//     }
//   },
//   // defaultOptions: {
//   //   ...TiptapImage.defaultOptions,
//   //   allowBase64: true,
//   // },
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
//                 // console.log(src);
//                 // This command inserts the image at the current selection
//                 commands.insertContent({
//                   type: 'image',
//                   // src: src,
//                   src: '/img/gc-sml.webp'
//                 });
//               }
//             };
//             reader.readAsDataURL(fileInput.files[0]);
//           }
//         });
//         fileInput.click();
//         return true;
//         (
//           commands.insertContent({
//             type: 'image',
//             // src: src,
//             src: '/img/gc-sml.webp'
//           })
//         )
// // true;
//       },
//     };
// },
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
// });
