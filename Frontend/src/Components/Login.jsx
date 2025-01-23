import React from 'react'
import styles from "../Styles/Login.module.css"
const Login = () => {
  return (
    <div className={styles.container}>
          <div className={styles.imageSection}>
            <img src="logo.png" alt="logo" className={styles.logo} />
          </div>
          
          <div className={styles.formSection}>
            <div className={styles.header}>
              <a href="#" className={styles.signUpBtn}>SignUp</a>
              <a href="#" className={styles.loginBtn}>Login</a>
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
                <a href="#" className={styles.loginLink}>SignUp</a>
              </p>
            </div>
          </div>
        </div>
  )
}

export default Login
