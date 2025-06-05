// import React from 'react'

// import { Editor } from '@tiptap/react'

// // import {
// //   BoldSVG,
// //   BulletsSVG,
// //   ImageSVG,
// //   ItalicSVG,
// //   LinkSVG,
// //   StrikeSVG,
// //   UnderlineSVG,
// // } from '~/assets'

// // your upload function, takes a file, return a Promise<any>
// const upload = (file: File) => {
//   // handle upload logic here
// }

// const EditorNavbar = ({ editor }: INavbarProps) => {
//   if (!editor) {
//     return null
//   }

//   // Adding anchor link
//   const setLink = () => {
//     const url = window.prompt('URL')

//     if (!url) return

//     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
//   }

//   // Adding image to the editor
//   const addImage = (url: string) => {
//     if (url) {
//       editor.chain().focus().setImage({ src: url }).run()
//     }
//   }

//   const command = editor?.chain()

//   // list of extensions i am using
//   const extentions = [
//     {
//       icon: <BoldSVG aria-label='bold' className='w-4 h-4' />,
//       title: 'Bold',
//       key: 'bold',
//       command: () => command?.toggleBold()?.run(),
//       disabled: false,
//     },
//     {
//       icon: <ItalicSVG aria-label='italic' className='w-4 h-4' />,
//       title: 'Italic',
//       key: 'italic',
//       command: () => command?.toggleItalic().run(),
//       disabled: false,
//     },
//     {
//       icon: <UnderlineSVG aria-label='underline' className='w-4 h-4' />,
//       title: 'Underline',
//       key: 'underline',
//       command: () => command?.toggleUnderline().run(),
//       disabled: false,
//     },
//     {
//       icon: <LinkSVG aria-label='link' className='w-4 h-4' />,
//       title: 'Link',
//       key: 'link',
//       command: setLink,
//       disabled: false,
//     },
//     {
//       icon: <StrikeSVG aria-label='strike' className='w-4 h-4' />,
//       title: 'Strike',
//       key: 'strike',
//       command: () => command?.toggleStrike().run(),
//       disabled: false,
//     },
//     {
//       icon: <BulletsSVG aria-label='bullets' className='w-4 h-4' />,
//       title: 'List',
//       key: 'list',
//       command: () => command?.toggleBulletList().run(),
//       disabled: false,
//     },
//   ]

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e?.target?.files?.[0]) return
//     upload(e.target.files[0])
//       .then((res) => addImage(res))
//       .catch((err) => console.error(err))
//   }

//   return (
//     <div className='editor-navbar-container'>
//       {extentions.map((extention) => (
//         <button
//           key={extention.key}
//           className={editor.isActive(extention.key) ? 'active' : ''}
//           disabled={extention.disabled}
//           title={extention.title}
//           type='button'
//           onClick={() => extention.command()}>
//           {extention.icon}
//         </button>
//       ))}
//       {/* Add a hidden input file type */}
//       <label className='inline-block px-2 cursor-pointer' htmlFor='upload'>
//         <ImageSVG aria-label='image' className='w-4 h-4' />
//         <input
//           className='hidden'
//           id='upload'
//           type='file'
//           onChange={handleChange}
//         />
//       </label>
//     </div>
//   )
// }

// interface INavbarProps {
//   editor: Editor | null
// }

// export default EditorNavbar