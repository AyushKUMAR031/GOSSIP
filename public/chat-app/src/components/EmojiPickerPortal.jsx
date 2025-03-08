import React from "react";
import ReactDOM from "react-dom";
import Picker from "emoji-picker-react";
import styled from "styled-components";

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 60px; /* Adjust this value as needed */
  left: 0;
  z-index: 10; /* Ensure it appears above other elements */
  background-color: #080420;
  box-shadow: 0 5px 10px #9a86f3;
  border-color: #9a86f3;
  max-height: 300px; /* Set a maximum height */
  overflow-y: auto; /* Enable vertical scrolling */
  .emoji-scroll-wrapper::-webkit-scrollbar {
    background-color: #080420;
    width: 5px;
    &-thumb {
      background-color: #9a86f3;
    }
  }
  .emoji-categories {
    button {
      filter: contrast(0);
    }
  }
  .emoji-search {
    background-color: transparent;
    border-color: #9a86f3;
  }
  .emoji-group:before {
    background-color: #080420;
  }
`;

const EmojiPickerPortal = ({ onEmojiClick, container }) => {
  return ReactDOM.createPortal(
    <EmojiPickerWrapper>
      <Picker onEmojiClick={onEmojiClick} />
    </EmojiPickerWrapper>,
    container
  );
};

export default EmojiPickerPortal;