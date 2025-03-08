import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute , host} from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";

export default function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isloaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  //if we dont have the user in local storage then we will navigate to login page
  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
        setIsLoaded(true);
      }
    }
    fetchData();
  },[]);

  //initializing the socket connection
  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser]);

  //if we have a user then we check if the user has set the avatar image or not
  //if set then we fetch all the users from the server
  useEffect(() => {
    async function fetchUsers() {
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }else{
          navigate("/setAvatar");
        }
      }
    }
    fetchUsers();
  },[currentUser]);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
          {isloaded && currentChat === undefined ? ( <Welcome/>) :(
            <ChatContainer currentChat={currentChat}  currentUser={currentUser} socket={socket}/>
          )}
        </div>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    border-radius: 1rem;
    overflow: hidden; /* Prevent content overflow */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.8); /* Subtle shadow for depth */

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }

    @media screen and (max-width: 720px) {
      grid-template-columns: 100%;
      height: 100vh;
      width: 100vw;
    }
  }

  .contacts {
    background-color: #1a1a2e;
    padding: 1rem;
    border-right: 2px solid #4e0eff;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #4e0eff;
      border-radius: 5px;
    }
  }

  .chat-container {
    background-color: #22243e;
    padding: 2rem;
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .chat-header {
      border-bottom: 2px solid #4e0eff;
      padding-bottom: 1rem;
    }

    .messages {
      flex: 1;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 5px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #4e0eff;
        border-radius: 5px;
      }
    }

    .input-area {
      display: flex;
      gap: 1rem;

      input {
        flex: 1;
        padding: 0.8rem;
        background-color: transparent;
        border: 2px solid #4e0eff;
        border-radius: 0.4rem;
        color: #fff;
        &:focus {
          border-color: #997af0;
        }
      }

      button {
        background-color: #4e0eff;
        color: #fff;
        border: none;
        border-radius: 0.4rem;
        padding: 0.8rem 1.5rem;
        cursor: pointer;
        text-transform: uppercase;
        font-weight: bold;
        transition: background 0.3s ease-in-out;

        &:hover {
          background-color: #5a2efe;
        }
      }
    }
  }
`;
