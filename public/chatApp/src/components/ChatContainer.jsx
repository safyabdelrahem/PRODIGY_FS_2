import styled from "styled-components";
import Logout from "./Logout";
import Chatinput from "./Chatinput";
import axios from 'axios';
import { sendMessageRoute, getAllMessagesRoute } from '../utils/APIRoutes';
import { useState, useEffect } from 'react';

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChat) {
        try {
          const response = await axios.post(getAllMessagesRoute, {
            from: currentUser._id,
            to: currentChat._id,
          });
          setMessages(response.data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        if (msg && typeof msg === 'object' && msg.message !== undefined) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        } else {
          console.error("Received message is invalid:", msg);
        }
      });
  
      return () => {
        socket.current.off("msg-recieve");
      };
    }
  }, [socket]);
  

  const handleSendMsg = async (msg) => {
    try {
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      });
      socket.current.emit("send-msg", {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      });
      setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

  if (!currentChat) {
    return null; // or return a loader/spinner
  }

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt="avatar" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.fromSelf ? "sended" : "received"}`}>
            <div className="content">
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      <Chatinput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  padding-top: 1rem;
  display: grid;
  grid-template-rows: 10% 78% 12%;
  
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
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 2rem;
    overflow: auto;

    .message {
      display: flex;
      align-items: center;

      &.sended {
        justify-content: flex-end;
      }

      &.received {
        justify-content: flex-start;
      }

      .content {
        max-width: 60%;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        background-color: #ffffff34;
        color: white;
        overflow-wrap: break-word;
        p {
          margin: 0;
        }
      }
    }
  }
`;

export default ChatContainer;
