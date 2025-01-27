import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/deletelink.module.css"

function Deletelink({closedeletemodal,linkID,refreshLinks}) {

    const handleclosemodal = () =>{
        closedeletemodal();
    }

   

     const deletelink = async() =>{
        try {
            const response = await axios.delete(`https://url-shortner-0tbr.onrender.com/api/v1/link/delete/${linkID}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, 
              },
            });
            console.log('Link deleted:', response.data);
            closedeletemodal();
            refreshLinks();
            toast.success('Link deleted successfully');
          } catch (error) {
            console.error('Error deleting link:', error.message);
            alert('There was an error deleting the link');
          }
    }



  return (
    <div className={styles.modal}>
    <ToastContainer />
   <div className={styles.modalContent}>
     <p> Are you sure, you want to remove it ?</p>
     <RxCross2 className={styles.cross} onClick={handleclosemodal} />
     <div className={styles.buttons}>
       <button className={styles.NoButton} onClick={handleclosemodal}>NO</button>
       <button className={styles.YesButton} onClick={deletelink} >YES</button>
     </div>
   </div>
 </div>
  )
}

export default Deletelink
