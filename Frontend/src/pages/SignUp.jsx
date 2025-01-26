import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from '../styles/SignUp.module.css';


const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
    
      const response = await axios.post("http://localhost:5000/api/v1/auth/signup", formData);

     
      toast.success(response.data.message || "Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
     
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.imageSection}>
        <img src="logo.png" alt="logo" className={styles.logo} />
      </div>

      <div className={styles.formSection}>
        <div className={styles.header}>
          <p className={styles.signUpBtn} onClick={() => navigate('/signup')}>SignUp</p>
          <p className={styles.loginBtn} onClick={() => navigate('/login')}>Login</p>
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.title}>Join us Today!</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={styles.input}
              value={formData.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile no."
              className={styles.input}
              value={formData.mobile}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button type="submit" className={styles.registerBtn}>
              Register
            </button>
          </form>

          <p className={styles.loginText}>
            Already have an account?{" "}
            <span className={styles.loginLink} onClick={() => navigate('/login')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
