import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedId } from "../redux/action/tabmoduleaction";
import { useHistory } from 'react-router-dom';

const FileUpload = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const history = useHistory();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = async () => {
    try {
      // Call your file processing API here
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('your-file-api-endpoint', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Dispatch action to update Redux store
      dispatch(setSelectedId(data));

      // Redirect to ChatWindow upon successful file processing
      history.push('/chat');

    } catch (error) {
      console.error('File processing failed', error);
    }
  };

  return (
    <div>
      <h2>File Upload</h2>
      <form>
        <label>
          Select File:
          <input type="file" onChange={handleFileChange} />
        </label>
        <br />
        <button type="button" onClick={handleFileSubmit}>
          Process File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
