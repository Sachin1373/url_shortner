import React from 'react'
import styles from "../Styles/logout.module.css"


function logout() {
  return (
    <div className={styles.logout_wrapper}>
        <button className={styles.logbtn}>Logout</button>
    </div>
  )
}

export default logout
