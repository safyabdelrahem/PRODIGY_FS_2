import styled from "styled-components";
import { useState } from "react";
import Picker from 'emoji-picker-react';
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

function Chatinput({ handleSendMsg }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiClick = (event, emojiObject) => {
    setMsg(msg + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleChange = (e) => {
    setMsg(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMsg(msg);
    setMsg(""); // Clear the input after sending
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji" onClick={toggleEmojiPicker}>
          <BsEmojiSmileFill />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={handleChange}
        />
        <button className="submit" type="submit">
          <IoMdSend />
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 5% 92%;
  align-items: center;
  background-color: #080420;
  padding: 0 2rem;
  padding-bottom: 0.3rem;

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      font-size: 1.5rem;
      color: #ffff00c8;
      cursor: pointer;

      .emoji-picker-react {
        position: absolute;
        top: -350px; /* Adjust this value to position the picker properly */
        background-color: #080420;
        box-shadow: 0 5px 10px #9a86f3;
        border-color: #9a86f3;
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 2rem;
    border-radius: 2rem;
    background-color: #ffffff34;

    input {
      width: 90%;
      background-color: transparent;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      &::placeholder {
        color: #ccc;
      }
      &:focus {
        outline: none;
      }
    }

    button.submit {
      background-color: #9a86f3;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      svg {
        font-size: 1.5rem;
        color: white;
      }
    }
  }
`;

export default Chatinput;
