import React, { useState} from 'react';

export default function GenerateButton({chatid,userid}) {
  const [documentUrl, setDocumentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAndDownloadReport = async () => {      try {
          setIsLoading(true); // Set loading state to true
          const response = await fetch(`http://127.0.0.1:5000/api/generarive/${userid}/${chatid.id}`);
          if (!response.ok) {
              throw new Error('Failed to fetch document URL');
          }
          const data = await response.json();
          const apiUrl = data.documentUrl; // Replace with the actual field name
          if (apiUrl) {
              setDocumentUrl(apiUrl);
              const anchor = document.createElement('a');
              anchor.style.display = 'none';
              document.body.appendChild(anchor);
              anchor.href = apiUrl;
              anchor.download = 'report.pdf'; // You can specify the desired filename
              anchor.click();
              document.body.removeChild(anchor);
          } else {
              console.error('No document URL available');
          }
      } catch (error) {
          console.error('Error fetching or downloading document URL:', error);
      } finally {
          setIsLoading(false); // Set loading state to false when done
      }
  };

  return (
      <>
          <button className="generationButton" onClick={fetchAndDownloadReport} disabled={isLoading}>
              {isLoading ? 'Making Report...' : 'Generate Report'}
          </button>
      </>
  )
}
