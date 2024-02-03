import React, { useRef, useState } from "react";
import "./Feedback.css";
import toast, { Toaster } from 'react-hot-toast';
import EmailSearch from "./EmailSearch";

export default function Feedback({
  onCopyClick,
  onReportChange,
  showOption,
  excelExport,
  emailExport,
  powerpointExport,
  pdfExport
}) {
  const modifedPieceRef = useRef(null);
  const scrollToBottom = () => {
    modifedPieceRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };
  const [liked, setLiked] = useState(false);
  const [input_email, setInputEmail] = useState("");
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showThreedot, setThreeDot] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [downloadOption, setDownloadOption] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [name_display, setSelectedName] = useState([]);
  const [emailShow, setEmailMenu] = useState(false);
  const handleMessageChange = (event) => {
    setInputEmail(event.target.value);
    handleSearch();
  };
  const handleSearch = async () => {
    try {
      // Use Microsoft Graph API to search for email addresses based on the input
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users?$filter=startsWith(mail, '${input_email}')`,
        {
          method: "GET",
          headers: {
            Authorization:
              "eyJ0eXAiOiJKV1QiLCJub25jZSI6ImV6TnJGN2pDYkdmNzlxbmNIX1FnVlJCblMzT3hiblk2ZWFfTVh0QWNJV1UiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9lNGUzNDAzOC1lYTFmLTQ4ODItYjZlOC1jY2Q3NzY0NTljYTAvIiwiaWF0IjoxNjk4NzUzODEyLCJuYmYiOjE2OTg3NTM4MTIsImV4cCI6MTY5ODg0MDUxMiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFhUUFXLzhVQUFBQTNETjVxWmEvNUY4QXR3eVUyM3NOTzlqZkJLbHltTFB4d2xrM0JmYVhqNEM4QjVhQWdQZjQ3SmU0RThxT0FwNU9ndW9Dc2MxRGlNSExKeEZBai9OaGNGVXNYZW9LbVNSR1VkVVVVMnljSHlyUC93Vy9iUDR0dUE3NDlCejdjTCtPdlpzcHI4YzdFemZDV1doRmUyNWNZMW5qTHh5UFNRdjRIMVdxMktRMDE2djdsbEhmaFVNU2xkRElhTjZaYlJndHd5bGFtNlcxSmNUY0xJd01yZ21nUXc9PSIsImFtciI6WyJyc2EiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiMzFjYTIyMjQtOTI3Ny00ZmQ3LWI1YmMtMTFjYWUyNDFiNmFlIiwiZmFtaWx5X25hbWUiOiJZYWRhdiIsImdpdmVuX25hbWUiOiJKYXRpbiIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjExNy4yMDcuMTMwLjExNyIsIm5hbWUiOiJKYXRpbiBZYWRhdiIsIm9pZCI6IjQ4MzFkODIwLWNkN2QtNDYzYS1iMjRhLTg1ZTFmZmY2NjE0MiIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMjY5MjAwMjNGIiwicmgiOiIwLkFVa0FPRURqNUJfcWdraTI2TXpYZGtXY29BTUFBQUFBQUFBQXdBQUFBQUFBQUFCSkFNNC4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZFdyaXRlIENoYXQuQ3JlYXRlIENoYXQuUmVhZCBDaGF0LlJlYWRCYXNpYyBDaGF0LlJlYWRXcml0ZSBDb250YWN0cy5SZWFkV3JpdGUgRGV2aWNlTWFuYWdlbWVudFJCQUMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudFNlcnZpY2VDb25maWcuUmVhZC5BbGwgRGlyZWN0b3J5LlJlYWQuQWxsIERpcmVjdG9yeS5SZWFkV3JpdGUuQWxsIEZpbGVzLlJlYWRXcml0ZS5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBHcm91cE1lbWJlci5SZWFkLkFsbCBJZGVudGl0eVJpc2tFdmVudC5SZWFkLkFsbCBMZWFybmluZ1Byb3ZpZGVyLlJlYWQgTWFpbC5SZWFkIE1haWwuUmVhZFdyaXRlIE1haWxib3hTZXR0aW5ncy5SZWFkV3JpdGUgTm90ZXMuUmVhZFdyaXRlLkFsbCBvcGVuaWQgUGVvcGxlLlJlYWQgUGxhY2UuUmVhZCBQcmVzZW5jZS5SZWFkIFByZXNlbmNlLlJlYWQuQWxsIFByaW50ZXJTaGFyZS5SZWFkQmFzaWMuQWxsIFByaW50Sm9iLkNyZWF0ZSBQcmludEpvYi5SZWFkQmFzaWMgcHJvZmlsZSBSZXBvcnRzLlJlYWQuQWxsIFNpdGVzLlJlYWRXcml0ZS5BbGwgVGFza3MuUmVhZFdyaXRlIFRlYW1zQWN0aXZpdHkuU2VuZCBVc2VyLlJlYWQgVXNlci5SZWFkLkFsbCBVc2VyLlJlYWRCYXNpYy5BbGwgVXNlci5SZWFkV3JpdGUgVXNlci5SZWFkV3JpdGUuQWxsIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImR2Y19tbmdkIiwiZHZjX2NtcCIsImttc2kiXSwic3ViIjoiejQ5dk5FaUlCcWprYmR4TnJGY2pBR2h3cm5QNUpjOEFrcFcwa1RqMmhLQSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6ImU0ZTM0MDM4LWVhMWYtNDg4Mi1iNmU4LWNjZDc3NjQ1OWNhMCIsInVuaXF1ZV9uYW1lIjoiamF0aW4ueWFkYXZAY2VsZWJhbHRlY2guY29tIiwidXBuIjoiamF0aW4ueWFkYXZAY2VsZWJhbHRlY2guY29tIiwidXRpIjoib1Y4REJyQm9aRXVXLVJMdUVxeHlBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoiNlBhZnVRU0R5MnAzWVFuVGxTWXhfdmZmY3gzTGZWZG9fVmRUeklzdUY5ayJ9LCJ4bXNfdGNkdCI6MTQ4MzE3ODg2MH0.OBrh80Q3qUto3GExrKpGOXDhTCDGqUNbVnMoXbkGlTDetWosc7G3sYjz2S1i1er1li-jCz0DKNwRnxOhsED0N3nfHDegcizlSvPf59lIta-9F0wwGyM7icrjzkrP-BGBQi5mHEXuuL6NOImVcO0r-c7VLWJHAGCv7-NSngMcD4J2xBa7INGOomldD_gr3cX_NBIL9vt6FrMOBNCvteOempHatnMiqruaQqCCCPkbfiwpJfwDi6rptA-1D-afLy64GMAOAIKHE3AWrEAcwzNK6TADfOHtK1Hp2Wb0gGq4ewSy3dvFkrPsk5jZ4nsI8iBGtvPutqYVCIeoARBn_8YF2g"
            },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Extract the email addresses from the API response
        const emails = data.value.map((user) => user.mail);
        const name_display = data.value.map((user) => user.displayName);
        setSelectedName(name_display);
        setSearchResults(emails);
      } else {
        console.error("Failed to fetch data from Microsoft Graph API");
      }
    } catch (error) {
      console.error("An error occurred while searching for emails", error);
    }
  };

  const handleEmailSelect = (selectedEmail) => {
    const updatedSelectedEmails = [...selectedEmails, selectedEmail];
    setSelectedEmails(updatedSelectedEmails);
    setInputEmail(updatedSelectedEmails.join(", "));
    setSearchResults([]); // Clear the search results
  };
  const likebutton = () => {
    if (liked === true) {
      setLiked(false);
    } else {
      setLiked(true);
    }
    setDisliked(false);
  };
  const setEmailMenuOption = (show) => {
    setEmailMenu(show);
  };
  const sendMail = (email_id) => {
    console.log("test");
    setEmailMenu(false);
    emailExport(email_id);
  };
  const dislikebutton = () => {
    if (disliked === true) {
      setDisliked(false);
    } else {
      setDisliked(true);
    }
    setLiked(false);
  };
  const handlepdfExport=()=>{
    toast.success('Pdf Making in Process');
    pdfExport();
  }
  const likeButtonClassName = liked ? "icon-sm liked" : "icon-sm";
  const dislikeButtonClassName = disliked ? "icon-sm disliked" : "icon-sm";
  const copiedButtonClassName = copied ? "icon-sm copy" : "icon-sm";
  const copyIconChange = () => {
    onCopyClick();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };
  const openOptions = () => {
    setTimeout(() => {
      setThreeDot(false);
      setShowOptions(true);
    }, 500);
  };

  const closeOptions = () => {
    setShowOptions(false);
    setThreeDot(true);
  };
  const handleOptionClick = (option) => {
    // Handle the option click here
    onReportChange(option);
    scrollToBottom();
    // Close the options menu
    setShowOptions(false);
  };

  return (
    <>
    <Toaster
  position="top-right"
  reverseOrder={false}
/>
      <div className="flex-container" ref={modifedPieceRef}>
        <div className="button-container">
          <div className="button-container">
            <button className="feedback-button" onClick={likebutton}>
              {liked ? (
                <svg
                  width="24"
                  className={likeButtonClassName}
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 9V21H1V9H5ZM9 21C8.46957 21 7.96086 20.7893 7.58579 20.4142C7.21071 20.0391 7 19.5304 7 19V9C7 8.45 7.22 7.95 7.59 7.59L14.17 1L15.23 2.06C15.5 2.33 15.67 2.7 15.67 3.11L15.64 3.43L14.69 8H21C21.5304 8 22.0391 8.21071 22.4142 8.58579C22.7893 8.96086 23 9.46957 23 10V12C23 12.26 22.95 12.5 22.86 12.73L19.84 19.78C19.54 20.5 18.83 21 18 21H9Z"
                    fill="#00A89C"
                  />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="20"
                  viewBox="0 0 22 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={likeButtonClassName}
                >
                  <path
                    d="M4 8V20H0V8H4ZM8 20C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18V8C6 7.45 6.22 6.95 6.59 6.59L13.17 0L14.23 1.06C14.5 1.33 14.67 1.7 14.67 2.11L14.64 2.43L13.69 7H20C20.5304 7 21.0391 7.21071 21.4142 7.58579C21.7893 7.96086 22 8.46957 22 9V11C22 11.26 21.95 11.5 21.86 11.73L18.84 18.78C18.54 19.5 17.83 20 17 20H8ZM8 18H17.03L20 11V9H11.21L12.34 3.68L8 8.03V18Z"
                    fill="#999999"
                  />
                </svg>
              )}
            </button>
            <button className="feedback-button" onClick={dislikebutton}>
              {disliked ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={dislikeButtonClassName}
                >
                  <path
                    d="M19 15L19 3L23 3L23 15L19 15ZM15 3C15.5304 3 16.0391 3.21071 16.4142 3.58579C16.7893 3.96086 17 4.46957 17 5L17 15C17 15.55 16.78 16.05 16.41 16.41L9.83 23L8.77 21.94C8.5 21.67 8.33 21.3 8.33 20.89L8.36 20.57L9.31 16L3 16C2.46957 16 1.96086 15.7893 1.58579 15.4142C1.21072 15.0391 1 14.5304 1 14L1 12C1 11.74 1.05 11.5 1.14 11.27L4.16 4.22C4.46 3.5 5.17 3 6 3L15 3Z"
                    fill="#00A89C"
                  />
                </svg>
              ) : (
                <svg
                  className={dislikeButtonClassName}
                  width="22"
                  height="20"
                  viewBox="0 0 22 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 12L18 -3.49691e-07L22 0L22 12L18 12ZM14 -6.99382e-07C14.5304 -6.5301e-07 15.0391 0.210714 15.4142 0.585786C15.7893 0.960859 16 1.46957 16 2L16 12C16 12.55 15.78 13.05 15.41 13.41L8.83 20L7.77 18.94C7.5 18.67 7.33 18.3 7.33 17.89L7.36 17.57L8.31 13L2 13C1.46957 13 0.96086 12.7893 0.585787 12.4142C0.210715 12.0391 7.40433e-07 11.5304 7.86805e-07 11L9.61651e-07 9C9.8438e-07 8.74 0.0500002 8.5 0.14 8.27L3.16 1.22C3.46 0.499998 4.17 -1.55875e-06 5 -1.48619e-06L14 -6.99382e-07ZM14 2L4.97 2L2 9L2 11L10.79 11L9.66 16.32L14 11.97L14 2Z"
                    fill="#999999"
                  />
                </svg>
              )}
            </button>
            <button className="feedback-button" onClick={copyIconChange}>
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={copiedButtonClassName}
                height="24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 11C6 8.172 6 6.757 6.879 5.879C7.757 5 9.172 5 12 5H15C17.828 5 19.243 5 20.121 5.879C21 6.757 21 8.172 21 11V16C21 18.828 21 20.243 20.121 21.121C19.243 22 17.828 22 15 22H12C9.172 22 7.757 22 6.879 21.121C6 20.243 6 18.828 6 16V11Z"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
                <path
                  d="M6 19C5.20435 19 4.44129 18.6839 3.87868 18.1213C3.31607 17.5587 3 16.7956 3 16V10C3 6.229 3 4.343 4.172 3.172C5.343 2 7.229 2 11 2H15C15.7956 2 16.5587 2.31607 17.1213 2.87868C17.6839 3.44129 18 4.20435 18 5"
                  stroke="#999999"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            {showOption && (
              <>
                <button
                  className="feedback-button"
                  onClick={() => {downloadOption?setDownloadOption(false):setDownloadOption(true)}}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.75 2.4375H6.75C6.4019 2.4375 6.06806 2.57578 5.82192 2.82192C5.57578 3.06806 5.4375 3.4019 5.4375 3.75V6.1875H3.75C3.4019 6.1875 3.06806 6.32578 2.82192 6.57192C2.57578 6.81806 2.4375 7.1519 2.4375 7.5V16.5C2.4375 16.8481 2.57578 17.1819 2.82192 17.4281C3.06806 17.6742 3.4019 17.8125 3.75 17.8125H5.4375V20.25C5.4375 20.5981 5.57578 20.9319 5.82192 21.1781C6.06806 21.4242 6.4019 21.5625 6.75 21.5625H18.75C19.0981 21.5625 19.4319 21.4242 19.6781 21.1781C19.9242 20.9319 20.0625 20.5981 20.0625 20.25V3.75C20.0625 3.4019 19.9242 3.06806 19.6781 2.82192C19.4319 2.57578 19.0981 2.4375 18.75 2.4375ZM14.8125 9.5625H18.9375V14.4375H14.8125V9.5625ZM18.9375 3.75V8.4375H14.8125V7.5C14.8125 7.1519 14.6742 6.81806 14.4281 6.57192C14.1819 6.32578 13.8481 6.1875 13.5 6.1875H13.3125V3.5625H18.75C18.7997 3.5625 18.8474 3.58225 18.8826 3.61742C18.9177 3.65258 18.9375 3.70027 18.9375 3.75ZM6.5625 3.75C6.5625 3.70027 6.58225 3.65258 6.61742 3.61742C6.65258 3.58225 6.70027 3.5625 6.75 3.5625H12.1875V6.1875H6.5625V3.75ZM3.5625 16.5V7.5C3.5625 7.45027 3.58225 7.40258 3.61742 7.36742C3.65258 7.33225 3.70027 7.3125 3.75 7.3125H13.5C13.5497 7.3125 13.5974 7.33225 13.6326 7.36742C13.6677 7.40258 13.6875 7.45027 13.6875 7.5V16.5C13.6875 16.5497 13.6677 16.5974 13.6326 16.6326C13.5974 16.6677 13.5497 16.6875 13.5 16.6875H3.75C3.70027 16.6875 3.65258 16.6677 3.61742 16.6326C3.58225 16.5974 3.5625 16.5497 3.5625 16.5ZM6.5625 20.25V17.8125H12.1875V20.4375H6.75C6.70027 20.4375 6.65258 20.4177 6.61742 20.3826C6.58225 20.3474 6.5625 20.2997 6.5625 20.25ZM18.75 20.4375H13.3125V17.8125H13.5C13.8481 17.8125 14.1819 17.6742 14.4281 17.4281C14.6742 17.1819 14.8125 16.8481 14.8125 16.5V15.5625H18.9375V20.25C18.9375 20.2997 18.9177 20.3474 18.8826 20.3826C18.8474 20.4177 18.7997 20.4375 18.75 20.4375ZM6.31781 13.89L7.89281 12L6.31781 10.11C6.26984 10.0533 6.23356 9.98773 6.21106 9.91697C6.18857 9.84622 6.1803 9.77171 6.18674 9.69774C6.19319 9.62377 6.21421 9.55181 6.2486 9.48601C6.28299 9.42021 6.33006 9.36186 6.38711 9.31434C6.44416 9.26682 6.51005 9.23107 6.58099 9.20914C6.65192 9.18721 6.72649 9.17954 6.80041 9.18657C6.87432 9.19361 6.94611 9.2152 7.01163 9.25012C7.07716 9.28503 7.13513 9.33257 7.18219 9.39L8.625 11.1216L10.0678 9.39C10.1637 9.27673 10.3005 9.20595 10.4483 9.19308C10.5962 9.1802 10.7431 9.22627 10.8571 9.32125C10.9712 9.41624 11.043 9.55243 11.0571 9.70017C11.0712 9.84791 11.0263 9.99522 10.9322 10.11L9.35719 12L10.9322 13.89C10.9802 13.9467 11.0164 14.0123 11.0389 14.083C11.0614 14.1538 11.0697 14.2283 11.0633 14.3023C11.0568 14.3762 11.0358 14.4482 11.0014 14.514C10.967 14.5798 10.9199 14.6381 10.8629 14.6857C10.8058 14.7332 10.7399 14.7689 10.669 14.7909C10.5981 14.8128 10.5235 14.8205 10.4496 14.8134C10.3757 14.8064 10.3039 14.7848 10.2384 14.7499C10.1728 14.715 10.1149 14.6674 10.0678 14.61L8.625 12.8784L7.18219 14.61C7.0863 14.7233 6.94953 14.794 6.80168 14.8069C6.65384 14.8198 6.5069 14.7737 6.39287 14.6787C6.27884 14.5838 6.20697 14.4476 6.19291 14.2998C6.17885 14.1521 6.22374 14.0048 6.31781 13.89Z"
                      fill="#999999"
                    />
                    <circle cx="19" cy="19" r="4" fill="#737373" />
                    <path
                      d="M19.3 17C19.3 16.8343 19.1657 16.7 19 16.7C18.8343 16.7 18.7 16.8343 18.7 17H19.3ZM18.7879 21.2121C18.905 21.3293 19.095 21.3293 19.2121 21.2121L21.1213 19.3029C21.2385 19.1858 21.2385 18.9958 21.1213 18.8787C21.0042 18.7615 20.8142 18.7615 20.6971 18.8787L19 20.5757L17.3029 18.8787C17.1858 18.7615 16.9958 18.7615 16.8787 18.8787C16.7615 18.9958 16.7615 19.1858 16.8787 19.3029L18.7879 21.2121ZM18.7 17V21H19.3V17H18.7Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <>
                  {emailShow ? (
                    <>
                      <div className="MailForm-Container">
                        <div className="MailForm">
                          <div className="MailContainer-Header">
                            <div className="MailHeader-Text">Share Data</div>
                            <button
                              onClick={() => setEmailMenu(false)}
                              type="button"
                              className="btn btn-info MailHeader-Close"
                            ></button>
                          </div>
                          <input
                            className="MailContainer-input"
                            value={input_email}
                            placeholder="Search by name or E-mail"
                            onChange={handleMessageChange}
                          />
                          {searchResults.length > 0 && (
                            <div className="SearchResults">
                              {searchResults
                                .slice(0, 10)
                                .map((email, index) => (
                                  <div
                                    key={index}
                                    className="SearchResult"
                                    onClick={() => handleEmailSelect(email)}
                                  >
                                   <p> {name_display[index]} <br /><span className="searchResultMail">({email})</span></p>
                                  </div>
                                ))}
                            </div>
                          )}
                          <div className="MailContainer-Buttons">
                            <button
                              onClick={() => setEmailMenu(false)}
                              className="MailButtons-Cancel"
                            >
                              <div className="MailCancelBtn-text">Cancel</div>
                            </button>
                            <button
                              className="MailButtons-Send"
                              onClick={() => sendMail(input_email)}
                            >
                              <div className="MailSendBtn-text">Send</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div> </div>
                  )}
                  <button
                    className="feedback-button"
                    onClick={() => setEmailMenu(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="22"
                      height="22"
                      viewBox="0 0 30 30"
                    >
                      <path
                        d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"
                        fill="#999999"
                      ></path>
                    </svg>
                  </button>
                </>
              </>
            )}
          </div>
          {showOption && (
            <div
              className="reportchange-menu"
              onMouseEnter={openOptions}
              onMouseLeave={closeOptions}
            >
              {showThreedot && (
                <button className="feedback-button">
                  {/* Triple-dot menu icon */}
                  <svg
                    className={copiedButtonClassName}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3.99992H3C2.46957 3.99992 1.96086 4.21063 1.58579 4.5857C1.21071 4.96078 1 5.46948 1 5.99992V16.9999C1 17.5304 1.21071 18.0391 1.58579 18.4141C1.96086 18.7892 2.46957 18.9999 3 18.9999H14C14.5304 18.9999 15.0391 18.7892 15.4142 18.4141C15.7893 18.0391 16 17.5304 16 16.9999V11.9999M14.586 2.58592C14.7705 2.3949 14.9912 2.24253 15.2352 2.13772C15.4792 2.0329 15.7416 1.97772 16.0072 1.97542C16.2728 1.97311 16.5361 2.02371 16.7819 2.12427C17.0277 2.22484 17.251 2.37334 17.4388 2.56113C17.6266 2.74891 17.7751 2.97222 17.8756 3.21801C17.9762 3.4638 18.0268 3.72716 18.0245 3.99272C18.0222 4.25828 17.967 4.52072 17.8622 4.76473C17.7574 5.00874 17.605 5.22942 17.414 5.41392L8.828 13.9999H6V11.1719L14.586 2.58592Z"
                      stroke="#999999"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              )}
              {/* Options menu */}
              {showOptions && (
                <div className="popup-overlay">
                  <div className="popup-content">
                    <div className="options-menu">
                      <button onClick={() => handleOptionClick("proffesional")}>
                        Refined
                      </button>
                      <button onClick={() => handleOptionClick("short")}>
                        Short
                      </button>
                      <button onClick={() => handleOptionClick("elaborate")}>
                        Long
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="DownloadOption">
        {downloadOption ? <ul className="DownloadOptionMenu">
          <li onClick={excelExport}><img src="icon_excel.png" className="downloadIcon"/> Download Excel</li>
          <li onClick={handlepdfExport}><img src="icon_pdf.png" className="downloadIcon"/> Download Pdf</li>
          <li disabled title="Work in Progress"onClick={powerpointExport}><img src="icon_powerpoint.png" className="downloadIcon"/> Download PPT</li>
        </ul> : <></>}
      </div>
    </>
  );
}
