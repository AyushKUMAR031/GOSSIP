import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetch(){
      if(!localStorage.getItem('chat-app-User')){
        navigate("/login");
      }else{
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-User')));
      }
    }
    fetch();
  },[]);

  useEffect(() => {
    async function fetch(){
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        }else{
          navigate("/setAvatar");
        }
      }
    }
    fetch();
  },[currentUser]);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
          {currentChat === undefined ? ( <Welcome/>) :(
            <h1>Chat</h1> 
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
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;