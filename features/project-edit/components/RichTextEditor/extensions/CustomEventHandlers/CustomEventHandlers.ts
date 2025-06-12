// import { Extension } from '@tiptap/core';
// import { Plugin, PluginKey } from 'prosemirror-state';

// // convert a blob to base64
// const blobToBase64 = async (blob: Blob) => {
//   return await new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(blob);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// };

// const CustomEventHandlers = Extension.create({
//   name: 'CustomEventHandlers',
  
//   addProseMirrorPlugins() {
//   return [
//     new Plugin({
//     key: new PluginKey('customEventHandlers'),
//     props: {
//       handleDOMEvents: {
//         drop: (view, _event: Event) => {
//           // event param must be Event type. don't change it to DragEvent type.
//           const event = _event as DragEvent;
//           const hasFiles = !!event.dataTransfer?.files?.length;
//         // drop: async (view, event) => {
          
          
//           if (hasFiles) {
//             let files = event.dataTransfer.files;
//             event.preventDefault();
//             const src =
//             blobToBase64(files[0]);
//             src && this.editor.chain().focus().setImage({ src }).run();
//           }
//         },
//       },
//     },
//     }),
//   ];
//   },
// });

// export default CustomEventHandlers;
// export { CustomEventHandlers };