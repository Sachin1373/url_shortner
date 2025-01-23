import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/deletelink.module.css"

function Deletelink({closedeletemodal}) {

    const handleclosemodal = () =>{
        closedeletemodal();
    }

  return (
    <div className={styles.modal}>
    <ToastContainer />
   <div className={styles.modalContent}>
     <p> Are you sure, you want to remove it ?</p>
     <RxCross2 className={styles.cross} onClick={handleclosemodal} />
     <div className={styles.buttons}>
       <button className={styles.NoButton} onClick={handleclosemodal}>NO</button>
       <button className={styles.YesButton} >YES</button>
     </div>
   </div>
 </div>
  )
}

export default Deletelink
