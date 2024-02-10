import React, { useState } from 'react';
import './filewindow.css';
import LoadingRabbit from './Other/RabitLoading';
import { useDispatch, connect } from 'react-redux';
import { setSelectedId } from "../redux/action/tabmoduleaction";
import { useNavigate } from 'react-router-dom';

const FileUpload = ({ setSelectedId }) => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [file, setFile] = useState(null);
  const [fieldName, setFieldName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setIsFormValid(selectedFile && fieldName);
  };

  const handleFieldNameChange = (e) => {
    const inputFieldName = e.target.value;
    setFieldName(inputFieldName);
    setIsFormValid(inputFieldName && file);
  };
  const handleFileSubmit = async () => {
    try {
      // Check if file and field name are present before submitting
      if (!file || !fieldName) {
        console.error('Please select a file and enter a field name.');
        return;
      }

      setLoading(true); // Set loading to true while waiting for the response

      // Call your file processing API here
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fieldName', fieldName);

      const response = await fetch('your-file-api-endpoint', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Dispatch action to update Redux store
      dispatch(setSelectedId(data));

      // Redirect to ChatWindow upon successful file processing
      history('/chat');

    } catch (error) {
      setLoading(true);
      setTimeout(() => {
       console.error('File processing failed', error);// Scroll to bottom after updating content
    }, 10000);
    console.error('File processing failed', error);
    } finally {
      setLoading(false); // Set loading back to false when the response is received
    }
  };

  return (
     <div className="file-upload-container">
      <div className="form-container">
        {loading ? (
          <LoadingRabbit />
        ) : (
          <form>
            <label>
              Field Name:
              <input type="text" value={fieldName} onChange={handleFieldNameChange} />
            </label>
            <label className="file-label">
              Select File:
              <input type="file" onChange={handleFileChange} />
            </label>
            <button type="button" onClick={handleFileSubmit} disabled={!isFormValid}>
              Process File
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default connect(null, { setSelectedId })(FileUpload);

