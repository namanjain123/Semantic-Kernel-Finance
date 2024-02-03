import React, { useState, useEffect, useRef } from "react";
import MessagingBar from "./messagingbar";
import GenerateButton from "./Generation/GenerateButton";
import AiChat from "./ChatsManagement/AI/AiChat";
import Userchat from "./ChatsManagement/User/userChat";
import "./chatwindow.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import TabSkeleton from "./Other/TabSkeleton";
import { connect, useSelector } from "react-redux";
const MainContent = ({ selectedId }) => {

  const chatContainerRef = useRef(null);
  const [loading, setLoadingState] = useState(false);
  const [content, setContent] = useState(null);
  const [intialScreen, setInitialScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const startLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      scrollToBottom(); // Scroll to bottom after updating content
    }, 200);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };
  const chatNameChange = (text) => {
    var myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");
    const senddata = {
      userId: "1",
      chatId: selectedId,
      chatName: text,
      createdTime: "string",
      updatedTime: "string",
      isActive: 1,
    };
    fetch("https://localhost:44373/api/userdata/create/create", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(senddata),
    })
      .then((response) => {
        response.json();
      })
      .catch((error) => console.error("Error adding data:", error));
  };
  const getdata = () => {
    if (selectedId) {
      setLoadingState(true);
      fetch(
        `https://localhost:44373/api/chathistory/View?userId=1&chatId=${selectedId.id}`
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }  else {
            throw new Error("Failed to fetch chat data");
          }
        })
        .then((data) => {
          setContent(data);
          setLoadingState(false);
          setInitialScreen(false);
          if (data[0].ai.message === "Please Enter the data") {
            setInitialScreen(true);
          }
          setTimeout(() => {
            scrollToBottom(); // Scroll to bottom after updating content
          }, 100); // Assuming the API response has a structure similar to your dummyData
        })
        .catch((error) => {
          console.error(error);
          setContent(null);
        });
    }
  };
  const captureRef = useRef(null);

  const pdfgeneration = () => {
    const captureElement = captureRef.current;
    const dpi = window.devicePixelRatio; // Get the screen DPI

    html2canvas(captureElement, { scale: dpi }).then((canvas) => {
      const width = captureElement.offsetWidth;
      const height = captureElement.offsetHeight;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portratit",
        unit: "px",
        format: [width, height], // Set the format based on element size
      });

      pdf.addImage(imgData, "PNG", 20, 20);
      pdf.save("Report.pdf");
    });
  };
  const onMessageSend = (message, id) => {
    setTimeout(() => {
      scrollToBottom(); // Scroll to bottom after updating content
    }, 20);
    if (id != null) {
      chatNameChange(message.length >= 10 ? message.slice(0, 10) : message);
      setInitialScreen(false);
      startLoading();
      if (message === "download") {
      }
      const newListObject = {
        user: message,
        ai: {
          data: "null",
          message: "null",
          report: "null",
        },
      };
      content.push(newListObject);
      // Define the data to send in the POST request
      const data = { userid: "1", chatid: id, isActive: 0, chat: content };
      axios
        .post(`https://localhost:44373/api/chathistory/Create`, data)
        .then((response) => {
          if (response.data === "Added" || response.data === "Updated") {
            stopLoading();
            getdata();
          } else {
            stopLoading();
            getdata();
          }
        })
        .catch((error) => {
          // Handle errors here, e.g., display an error message
          console.error("Error sending message:", error);
        });
      setTimeout(() => {
        scrollToBottom(); // Scroll to bottom after updating content
      }, 100);
    }
  };
  useEffect(() => {
    getdata();
    console.log(selectedId);
    setTimeout(() => {
      scrollToBottom(); // Scroll to bottom after updating content
    }, 200);
  }, [selectedId]);
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom(); // Scroll to bottom after updating content
    }, 200); // Scroll to bottom whenever content updates
  }, [content]);
  const report_data_change = (id, report_data_main) => {
    content[id].ai.report = report_data_main;
    const data = { userid: "1", chatid: id, isActive: 0, chat: content };
    axios
      .post(`https://localhost:44373/api/chathistory/Create`, data)
      .then((response) => {
        if (response.data === "Added" || response.data === "Updated") {
          getdata();
        } else {
          getdata();
        }
      })
      .catch((error) => {
        // Handle errors here, e.g., display an error message
        console.error("Error sending message:", error);
      });
    setTimeout(() => {
      scrollToBottom(); // Scroll to bottom after updating content
    }, 100);
  };
  const lastChat = "";
  const SetLastChat = (id) => {
    if (id > 1) {
      lastChat = content[id].user;
    }
  };

  return (
    <div className="ChatWindow">
      <div className="main-content">
        <div style={{ height: "600px" }}>
          {content ? (
            <>
              <div className="chat-container" >
                {intialScreen ? (
                  <div className="IntitalScreen">
                    <p className="WelcomeMessage one">
                      Welcome to <br />
                      Celebal Co-Pilot
                    </p>
                    <img
                      alt="ct-logo"
                      src="InitialPage.png"
                      style={{ transform: "scale(0.8)" }}
                    />
                  </div>
                ) : (
                  content.map((chat, index) => (
                    <div key={"chat-message " + index} className="chat-message">
                      {chat.user !== null && (
                        <Userchat key={"useChat" + index} data={chat.user} />
                      )}
                      {chat.ai != null &&
                        chat.ai.message !== "null" &&
                        chat.ai.message !== "Please Enter the data" && (
                          <AiChat
                            lastchat={index > 0 ? chat.user : ""}
                            key={"aichat " + index}
                            data={chat.ai}
                            id_ai={index}
                            chat_id={selectedId}
                            report_data_change={report_data_change}
                          />
                        )}
                    </div>
                  ))
                )}
                <div className="loading" ref={chatContainerRef}>
                  {isLoading && (
                    <div id="loading-bubble" className="grey">
                      <div className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ):(<>
          <div className="chat-container" >
            <div className="msg left-msg"><div className="imgai">
        <img src="ailogo.png" alt="AI Logo" />{" "}
        {/* Add alt text for accessibility */}
      </div>
        <TabSkeleton times={1} /></div>
        <div className="msg right-msg">
      <div className="imguser">
          <img src='userimg.png'/>
        </div>
            <TabSkeleton times={1} /></div>
          </div>
          </>)}
          <MessagingBar onMessageSend={onMessageSend} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  selectedId: state.selectedId,
});

export default connect(mapStateToProps)(MainContent);
