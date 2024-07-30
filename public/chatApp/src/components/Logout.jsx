import React from 'react';
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';

function Logout() {
    const navigate = useNavigate();

    const handleClick = async () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Button onClick={handleClick}>
            <BiPowerOff />
        </Button>
    );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #ff4d4d; /* Red background */
  color: white; /* White icon */
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff3333; /* Darker red on hover */
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export default Logout;
