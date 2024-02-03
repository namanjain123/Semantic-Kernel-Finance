import React, { useState, useEffect, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { setSelectedId } from "../redux/action/tabmoduleaction";
import "./tabmodule.css";
import TabSkeleton from "./Other/TabSkeleton";

const LeftTab = ({ setSelectedId }) => {
  const [loading, setLoadingState] = useState(false);
  const idused = "1";
  const [listHighlighted, setHighligted] = useState(null);
  const [names, setNames] = useState([]);
  const handleClick = (id) => {
    setHighligted(id);
    dispatch(setSelectedId(id));
  };
  const refreshTimeout = useRef(null);
  const refreshData = () => {
    fetch(`https://localhost:44373/api/userdata/view?id=${idused}`)
      .then((response) => response.json())
      .then((data) => {
        setLoadingState(true);
        setNames(data);
        dispatch(setSelectedId(data[0].chatId));
        setHighligted(data[0].chatId);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  useEffect(() => {
    refreshData();
    // Clear the timeout when the component unmounts
    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [idused]); //for calling the api

  const [newName, setNewName] = useState(""); // State for the new item

  const dispatch = useDispatch();

  const [buttonClassName, setButtonClassName] = useState("toggle-button");

  const toggleButtonClassName = () => {
    // Check the current class name and toggle it accordingly

    if (buttonClassName === "toggle-button") {
      setTimeout(() => {
        setButtonClassName("toggle-buttonafter");
      }, [200]);
    } else {
      setButtonClassName("toggle-button");
    }
  };
  const handleToggle = () => {
    const elementsToToggle = [
      ".left-tab",
      ".content",
      ".messaging-bar",
      ".ChatWindow",
    ];

    elementsToToggle.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.toggle("show");
      }
    });
    const aiChats = document.querySelectorAll(".right-msg");
    aiChats.forEach((aichat) => {
      aichat.classList.toggle("show");
    });
    const userchats = document.querySelectorAll(".left-msg");
    userchats.forEach((userchat) => {
      userchat.classList.toggle("show");
    });
  };

  const handleNewChat = () => {
    const lastId =
      names.length > 0 ? Math.max(...names.map((item) => item.chatId)) : 0;
    const newId = lastId + 1;

    var myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "application/json");
    const senddata = {
      userId: idused,
      chatId: newId,
      chatName: "newchat",
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
      .then(() => {
        // Schedule a refresh after a 2-second delay
        if (refreshTimeout.current) {
          clearTimeout(refreshTimeout.current);
        }
        refreshTimeout.current = setTimeout(() => {
          setLoadingState(true);
          refreshData();
        }, 1000);
      })
      .catch((error) => console.error("Error adding data:", error));
  };
  const highlighted = listHighlighted
    ? "chat-session selected"
    : "chat-session";

  return (
    <div>
      <div className="Generation">
        <button className="generationButton" onClick={handleNewChat}>
          + New Chat
        </button>
      </div>
      <div className="left-tab">
        <div className="togglediv">
          <p>Celebal Co-Pilot</p>
          <button
            className={buttonClassName}
            onClick={() => {
              toggleButtonClassName(); // Toggle class name on click
              handleToggle(); // Handle the toggle logic
            }}
          ></button>
        </div>
        {loading ? (
          <div className="chatlistdiv">
            <ul className="tabmodulebuttons" key="ul-main">
              {names.map((item,index) => (
                <li
                  className={`chat-session ${
                    item.chatId === listHighlighted
                      ? "chat-session selected"
                      : "chat-session"
                  }`} // Apply "selected" class conditionally
                  key={"tablist"+index}
                  onClick={() => handleClick(item.chatId)}
                >
                  <img
                    alt="ct-logo"
                    key={item.id}
                    src="comment.png"
                    height="20px"
                    width="20px"
                  />
                  <span key={item.id} className="truncate-text">
                    {item.chatName}
                  </span>
                </li>
              ))}
            </ul>
            <div className="celebalimg">
              <img alt="ct-logo" src="celeballogo.png" />
            </div>
          </div>
        ) : (
          <div className="chatlistdiv">
            <TabSkeleton times={6} />
          </div>
        )}
        <div className="celebalimg">
          <img alt="ct-logo" src="celeballogo.png" />
        </div>
      </div>
      <div className="content">
        <button
          className={buttonClassName}
          onClick={() => {
            toggleButtonClassName(); // Toggle class name on click

            handleToggle(); // Handle the toggle logic
          }}
        ></button>
      </div>
    </div>
  );
};

export default connect(null, { setSelectedId })(LeftTab);
