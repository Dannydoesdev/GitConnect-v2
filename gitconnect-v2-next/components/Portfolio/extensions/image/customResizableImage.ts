import { storage } from '@/firebase/clientApp';
import { mergeAttributes, Node, nodeInputRule } from '@tiptap/core';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     customResizableImage: {
//       insertResizableImage: () => ReturnType;
//     };
//   }
// }

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customResizableImage: {
      insertResizableImage: (attributes: {
        userId: string;
        repoId: string;
      }) => ReturnType;
    };
  }
}
export interface MediaOptions {
  repoId: string;
  userId: string;
  // inline: boolean, // we have floating support, so block is good enough
  // HTMLAttributes: Record<string, any>;
  // uploadFn: UploadFnType;
}

export const CustomResizableImage = Node.create<MediaOptions>({
  name: 'customResizableImage',
  // export const CustomResizableImage = TiptapImage.extend({

  draggable: true,
  selectable: true,

  addOptions() {
    return {
      repoId: '',
      userId: '',
    };
  },

  addAttributes() {
    return {
      userId: {
        default: null,
      },
      repoId: {
        default: null,
      },
    };
  },

  addCommands() {
    return {
      // insertResizableImage: () =>
      insertResizableImage:
        (attributes) =>
        ({ commands, editor }) => {
          const { userId, repoId } = attributes;
          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
              let file = fileInput.files[0]; // the dropped file
              let filesize: any = (file.size / 1024 / 1024).toFixed(4); // get the filesize in MB
              // console.log(filesize);
              // console.log(file.type);
              if (file.type.startsWith('image/') && filesize < 15) {
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
                        const { view } = editor;
                        const { schema, selection } = view.state;

                        const position = selection.$head
                          ? selection.$head.pos
                          : selection.$to.pos;

                        // Insert as a resizableMedia node with media-type as "img"
                        const node = schema.nodes.resizableMedia.create({
                          'media-type': 'img',
                          src: downloadURL,
                          width: '600',
                          height: 'auto',
                        });

                        // Insert as an image node
                        // const node = schema.nodes.image.create({ src: downloadURL }); //

                        // creates the image element
                        const transaction = view.state.tr.insert(position, node);

                        return view.dispatch(transaction);
                      });
                    }
                  );
                };

                uploadImage(file);
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
