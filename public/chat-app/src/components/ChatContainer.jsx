import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import axios from "axios";
import Logout from "./logout";

import { getMessagesRoute, sendMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, currentUser }) {
  const [messages, setMessages] = useState([]);
  
  // //render previous chat initially
  // useEffect(async() => {
  //   const fetchMessages = async () => {
  //     if (!currentUser || !currentChat) return; // Prevent fetching if data is missing
  
  //     try {
  //       const response = await axios.post(getMessagesRoute, {
  //         from: currentUser._id,
  //         to: currentChat._id,
  //       });
  //       setMessages(response.data);
  //     } catch (error) {
  //       console.error("Error fetching messages:", error);
  //     }
  //   };
  
  //   fetchMessages();
  // }, [currentChat,currentUser]);

  // //update the chat when a new message is sent
  // const handleSendMsg = async (msg) => {
  //   await axios.post(sendMessageRoute, {
  //     from: currentUser._id,
  //     to: currentChat._id,
  //     message: msg,
  //   });
  // };

  //render previous chat initially
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !currentChat) return;
      try {
        const response = await axios.post(getMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser]);

  //update the chat when a new message is sent
  const handleSendMsg = async (msg) => {
    if (!currentUser || !currentChat) return;
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
  };

  if (!currentUser || !currentChat) {
    return <div>Loading chat...</div>;
  }

  return (
      <>
      {currentChat && (
          <Container>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                    <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="userAvatar" />
                </div>
                <div className="username">
                    <h3>{currentChat.username}</h3>
                </div>
              </div>
                <Logout />
            </div>
            <div className="chat-messages">
              {
                messages.map((message) => {
                  return(
                    <div>
                      <div className={`message ${message.fromSelf ? "sended" : "recieved" }`}>
                        <div className="content">
                          <p>
                            {message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <ChatInput handleSendMsg = {handleSendMsg}/>
          </Container>
      )}
      </>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;