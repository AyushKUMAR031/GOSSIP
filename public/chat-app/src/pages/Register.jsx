import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import Logo from "../assets/logo.svg";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

function Register() {

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.",toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error("Username should be greater than 3 characters.",toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error("Password should be equal or greater than 8 characters.",toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, { 
        username,
        email,
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
            <h1>Gossip</h1>
          </div>
          <input type="text" placeholder="Username" name="username" onChange={(e) => handleChange(e)}/>
          <input type="email" placeholder="Email" name="email" onChange={(e) => handleChange(e)}/>
          <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)}/>
          <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={(e) => handleChange(e)}/>
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
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
      height: 4rem;  /* Slightly smaller logo for smaller screens */
    }
    h1 {
      color: white;
      text-transform: uppercase;
      font-size: 1.5rem; /* Responsive text size */
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 2.5rem 3rem;  /* Adjusted padding for better spacing */
    width: 90%;  /* Flexible width */
    max-width: 400px; /* Limits form width on larger screens */
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
      background-color: #4e0eff;
    }
  }

  span {
    color: white;
    text-transform: uppercase;
    text-align: center;  /* Center text for mobile devices */
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }

  /* Media Query for Smaller Screens (Mobile) */
  @media (max-width: 768px) {
    form {
      padding: 2rem; /* Reduced padding for better space usage */
      width: 100%;
    }

    .brand img {
      height: 3rem;  /* Smaller logo for better fit */
    }

    h1 {
      font-size: 1.2rem; /* Smaller text for mobile */
    }

    input,
    button {
      font-size: 0.9rem; /* Slightly smaller text for better fit */
    }
  }
`;

export default Register;