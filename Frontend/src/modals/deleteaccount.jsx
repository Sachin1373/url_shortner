import React, { useState } from 'react';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Styles/deletelink.module.css"

function DeleteAccount({closedeleteaccmodal}) {

    const handleclosemodal = () =>{
        closedeleteaccmodal();
    }

    const navigate = useNavigate();

    const deleteacc = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Unauthorized: No token found. Please log in.', { position: 'top-center' });
          return;
        }
      
        try {
          const response = await axios.delete('https://url-shortner-0tbr.onrender.com/api/v1/auth/deleteaccount', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (response.status === 200) {
            toast.success('Account deleted successfully', { position: 'top-center' });
            setTimeout(() => {
              localStorage.clear();
              navigate('/login');
            }, 2000);
          } else {
            toast.error('Failed to delete account', { position: 'top-center' });
          }
        } catch (error) {
          console.error('Error deleting account:', error);
          toast.error('An error occurred while deleting the account', { position: 'top-center' });
        }
      }


  return (
    <div className={styles.modal}>
    <ToastContainer />
   <div className={styles.modalContent}>
     <p> Are you sure, you want to delete this account ?</p>
     <RxCross2 className={styles.cross} onClick={handleclosemodal} />
     <div className={styles.buttons}>
       <button className={styles.NoButton} onClick={handleclosemodal}>NO</button>
       <button className={styles.YesButton} onClick={deleteacc}>YES</button>
     </div>
   </div>
 </div>
  )
}

export default DeleteAccount
