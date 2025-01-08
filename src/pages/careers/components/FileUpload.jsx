import React, { useRef, useState } from 'react'

const FileUpload = () => {
  const [fileName, setFileName] = useState('')
  
  let handleFile = (file) => {
    setFileName(file?.name)
  }

  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };

  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };
  
  return (
    <>
      <button type='button' className="button-upload" onClick={handleClick}>
        {fileName ? <p>{fileName}</p> : <p>Upload File</p>}
      </button>
      <input
        name='resume'
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{display: 'none'}}
        required
      />
      <span style={{position: 'relative', top: '0.6em'}}>Please upload file</span>
    </>
  )
}

export default FileUpload