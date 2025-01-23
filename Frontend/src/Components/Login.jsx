import React from 'react'
import {  useNavigate } from 'react-router-dom'
import styles from "../Styles/Login.module.css"
const Login = () => {
    const navigate = useNavigate()
  return (
    <div className={styles.container}>
          <div className={styles.imageSection}>
            <img src="logo.png" alt="logo" className={styles.logo} />
          </div>
          
          <div className={styles.formSection}>
            <div className={styles.header}>
              <p className={styles.signUpBtn} onClick={()=> navigate('/signup')}>SignUp</p>
              <p  className={styles.loginBtn} onClick={()=> navigate('/login')}>Login</p>
            </div>
    
            <div className={styles.formContainer}>
              <h1 className={styles.title}>Login</h1>
              
              <form className={styles.form}>
                <input 
                  type="email" 
                  placeholder="Email id" 
                  className={styles.input}
                />
                
                <input 
                  type="password" 
                  placeholder="Password" 
                  className={styles.input}
                />
                
                <button type="submit" className={styles.registerBtn}>
                  Register
                </button>
              </form>
    
              <p className={styles.loginText}>
                Dont't have an account?
                <p className={styles.loginLink} onClick={()=> navigate('/signup')}>SignUp</p>
              </p>
            </div>
          </div>
        </div>
  )
}

export default Login
