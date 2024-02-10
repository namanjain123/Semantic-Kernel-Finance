import React, { useState, useEffect, useRef } from "react";
import MessagingBar from "./messagingbar";
import AiChat from "./ChatsManagement/AI/AiChat";
import Userchat from "./ChatsManagement/User/userChat";
import "./chatwindow.css";
import axios from "axios";
import TabSkeleton from "./Other/TabSkeleton";
import { connect, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
const MainContent = ({ selectedId }) => {
  const navigate=useNavigate();
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
  const getdata = () => {
    if (selectedId) {
      setLoadingState(true);
       const localChatData = localStorage.getItem(`chat-${selectedId.id}`);
       if(localChatData){
        setContent(JSON.parse(localChatData));
        setLoadingState(false);
       }
    }
  };
  const onMessageSend = (message) => {
    console.log(message)
    setInitialScreen(false);
    startLoading();
    // Update content locally need to be using the API Call
    const newListObject = {
      user: message,
      ai: {
        data: "null",
        message: "null",
        report: "null",
      },
    };
    setContent((prevContent) => [...prevContent, newListObject]);
    setTimeout(() => {
      stopLoading();
      scrollToBottom(); // Scroll to bottom after updating content
    }, 100);
  };
  useEffect(() => {
    // Mock initial data
    if(selectedId==null){
      navigate('/login');
    }
    const initialData = [
      { user: "null", ai: { data: "null", message: "null", report: "null" } },
    ];
    setInitialScreen(true);
    setContent(initialData);
  }, []);

  const report_data_change = (id, report_data_main) => {
    setContent((prevContent) => {
      const updatedContent = [...prevContent];
      updatedContent[id].ai.report = report_data_main;
      return updatedContent;
    });

    setTimeout(() => {
      scrollToBottom(); // Scroll to bottom after updating content
    }, 100);
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
                      Fiancial Assistant
                    </p>
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
