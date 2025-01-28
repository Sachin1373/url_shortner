import React, { useEffect } from 'react'
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from 'react-router-dom';


function Redirect() {
    const { id } = useParams();
  
    const redirect = async () => {
      try {
        const response = await axios.get(`https://url-shortner-0tbr.onrender.com/api/v1/link/redirect/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          }
      });
      
        
        if (response.data.url) {
          window.location.href = response.data.url; 
        } else {
          alert('Invalid redirect URL');
        }
      } catch (error) {
        console.error('Error redirecting:', error.message);
        toast.error(error.response?.data?.error || 'An error occurred while redirecting');
      }
    };

   useEffect(() => {
    redirect();
   }, []);
  


  return (
    <div>
      <ToastContainer />
       <h1>Redirect</h1>
    </div>
  )
}

export default Redirect
