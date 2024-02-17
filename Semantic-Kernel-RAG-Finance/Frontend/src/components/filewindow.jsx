import React, { useState } from 'react';
import './filewindow.css';
import LoadingRabbit from './Other/RabitLoading';
import { useDispatch, connect } from 'react-redux';
import { setSelectedId } from "../redux/action/tabmoduleaction";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const FileUpload = ({ setSelectedId }) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [files, setFile] = useState([]);
  const allowedFileTypes = ['application/pdf', 'application/msword', 'text/plain'];
  const [fieldName, setFieldName] = useState('');
  const[token,setToken]=useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFiles = Array.from(files).filter(file => allowedFileTypes.includes(file.type));
  if (validFiles.length === 0) {
    toast.error('Please select a valid file type Doc , PDF or TXT file only');
  }
    setFile([...files,...validFiles]);
    setIsFormValid(validFiles.length > 0 && fieldName);
  };
  const handleFieldNameChange = (e) => {
    const inputFieldName = e.target.value;
    setFieldName(inputFieldName);
    setIsFormValid(inputFieldName > 0 && fieldName);
  };
  const fetchToken = async () => {
      try {
        const response = await fetch('http://localhost:3255/antiforgery/token');
        if (!response.ok) {
          console.log(response)
          toast.error('Backend Error Please try after check');
        }
        const result =  await response.text(); 
        setToken(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Backend Error Please try after check');
      }
    };
  const handleFileSubmit = async () => {
    try {
      // Check if file and field name are present before submitting
      if (!files || !fieldName) {
        console.error('Please select a file and enter a field name.');
        toast.error('Eneter Both the File and Field Name');
        return;
      }
      setLoading(true); // Set loading to true while waiting for the response
      //Call for the Forgery token
      await fetchToken();
      // Call your file processing API here
      const requestData = {
      files: [],
    };

      const readFileAsBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    for (const file of files) {
      const base64Content = await readFileAsBase64(file);
      requestData.files.push({
        name: file.name,
        type: file.type,
        content: base64Content,
      });
    }
      const requestOptions = {
          method: 'POST',
          headers: {
            'X-XSRF-TOKEN': token,
          },
          body: JSON.stringify(requestData)
        };
        console.log(JSON.stringify(requestData));
        console.log(requestOptions);
      const response = await fetch(`http://localhost:3255/api/summarization/file?collection=${fieldName}`, requestOptions);
      if (!response.ok) {
        toast.error('Backend Error Please try after check');
          throw new Error('Network response was not ok');
      }
      // Dispatch action to update Redux store for the collection name
      dispatch(setSelectedId(fieldName));
      // Redirect to ChatWindow upon successful file processing
      history('/chat');

    } catch (error) {
      setLoading(true);
      setTimeout(() => {
      toast.error('File Process fail');
    }, 10000);
    console.error('File processing failed', error);
    } finally {
      setLoading(false); // Set loading back to false when the response is received
    }
  };

  return (
    <div className="file-upload-container">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="form-container">
        {loading ? (
          <LoadingRabbit />
        ) : (
          <form>
            <div className="file-input-container">
              <label>
              Collection Name:
              <input type="text" value={fieldName} onChange={handleFieldNameChange} />
            </label>

              <label className="file-label">
                Select Files:
                <input type="file" onChange={handleFileChange} multiple />
              </label>
              {files.length > 0 && (
                <div className="selected-files">
                  Selected Files:
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <button type="button" onClick={handleFileSubmit} disabled={!isFormValid}>
              Process Files
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default connect(null, { setSelectedId })(FileUpload);

