import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../assets/logo.svg";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

function Login() {

  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  
  const navigate = useNavigate();

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const validateForm = () => {
    const { password,username } = values;
    if (password === "") {
      toast.error("Username and Password is required.",toastOptions);
      return false;
    } else if (username.length === "") {
      toast.error("Username and Password is required.",toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>GOSSIP</h1>
          </div>
          <input type="text" placeholder="Username" name="username" onChange={(e) => handleChange(e)} min="3"/>
          <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
          <button type="submit">Log In</button>
          <span> Don't have an account ? <Link to="/register">Create One.</Link> </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 4rem; /* Reduced size for better scaling */
    }
    h1 {
      color: white;
      text-transform: uppercase;
      font-size: 1.5rem; /* Responsive heading size */
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 4rem;

    @media screen and (max-width: 768px) {
      padding: 2rem; /* Smaller padding on mobile */
      width: 90%; /* Wider layout for mobile screens */
    }

    @media screen and (max-width: 480px) {
      padding: 1.5rem; /* Further reduce padding for small devices */
      width: 95%;
    }
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }

  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #997af0;
    }

    @media screen and (max-width: 480px) {
      padding: 0.8rem; /* Smaller padding for mobile */
      font-size: 0.9rem;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    font-size: 0.9rem;

    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }

    @media screen and (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
`;

export default Login;