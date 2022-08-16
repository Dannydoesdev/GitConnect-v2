import { useRef, useState } from 'react'
import { storageRef } from '../firebase/clientApp'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UploadFile = () => {
  const inputEl = useRef<any>(null)
  const [value, setValue] = useState(0)


  function uploadFile() {


    // get file
    const file = inputEl.current.files[0]

    // create a storage ref
    const fileName = 'user_uploads' + file.name
    // const storageRefUpload = ref(storageRef, fileName)
    const storageRefUpload = ref(storageRef, 'user_uploads')

    // upload file
    const task = uploadBytesResumable(storageRefUpload, file)

    // update progress bar
    task.on('state_changed',

      function progress(snapshot: any) {
        setValue((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      },

      function error(err: any) {
        alert(err)
      },

      function complete() {
        alert('Uploaded to firebase storage successfully!')
      }
    )
  }
    return (
      <div style={{ margin: '5px 0' }}>
      <progress value={value} max="100" style={{ width: '100%' }}></progress>
      <br />
      <input
          type="file"
          onChange={uploadFile}
          ref={inputEl}
      />
  </div>
    )
  
}

export default UploadFile