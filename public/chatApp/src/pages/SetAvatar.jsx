import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "../assets/loader.gif";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { SetAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from 'buffer';

const SetAvatar = () => {
    const api = "https://api.multiavatar.com/45678945";
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const fetchAvatar = async (retryCount = 0) => {
        try {
            const { data } = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
            const buffer = Buffer.from(data); // Ensure this is the correct way to handle the data
            return buffer.toString("base64");
        } catch (error) {
            if (error.response && error.response.status === 429 && retryCount < 5) {
                // Exponential backoff
                const delay = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchAvatar(retryCount + 1);
            } else {
                throw error;
            }
        }
    };
    
    useEffect(() => {
        const fetchAvatars = async () => {
            const avatarArray = [];
            try {
                for (let i = 0; i < 4; i++) {
                    const avatar = await fetchAvatar();
                    avatarArray.push(avatar);
                }
                setAvatars(avatarArray);
                setLoading(false);
            } catch (error) {
                toast.error("Error fetching avatars. Please try again later.", toastOptions);
                setLoading(false);
            }
        };
        fetchAvatars();
    }, []);

    const handleSubmit = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select an avatar", toastOptions);
            return;
        }
        const user = JSON.parse(localStorage.getItem("chat-app-user"));
        try {
            const { data } = await axios.post(`${SetAvatarRoute}/${user._id}`, {
                image: avatars[selectedAvatar],
            });
            if (data.isSet) {
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chat-app-user", JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        } catch (error) {
            toast.error("Error setting avatar. Please try again.", toastOptions);
        }
    };
    

    return (
        <>
            {isLoading ? (
                <Container>
                    <img src={Loader} alt="loader" className="loader" />
                </Container>
            ) : (
                <Container>
                    <div className="title-container">
                        <h1>Pick an avatar as your profile picture</h1>
                    </div>
                    <div className="avatars">
                        {avatars.map((avatar, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                    onClick={() => setSelectedAvatar(index)}
                                >
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" />
                                </div>
                            );
                        })}
                    </div>
                    <button onClick={handleSubmit} className="submit-btn">
                        Set as Profile Picture
                    </button>
                </Container>
            )}
            <ToastContainer />
        </>
    );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
