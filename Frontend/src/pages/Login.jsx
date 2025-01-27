import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../Styles/Login.module.css';

const Login = () => {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://url-shortner-0tbr.onrender.com/api/v1/auth/login', formData);
      toast.success(response.data.message || 'Login successful!');
      
      const { token, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid login credentials';
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
          <h1 className={styles.title}>Login</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email id"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className={styles.loginBtn}>
              Login
            </button>
          </form>

          <p className={styles.loginText}>
            Don't have an account?
            <span className={styles.loginLink} onClick={() => navigate('/signup')}>
              SignUp
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
