import React, { useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';


function Redirect() {
    const { id } = useParams();
    const username = localStorage.getItem('username');
    console.log(username)
    const redirect = async () => {
      try {
        const response = await axios.get(`https://url-shortner-0tbr.onrender.com/api/v1/link/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            username: username, 
          },
        });
    
        console.log('Redirect response:', response.data); 
        if (response.data.url) {
          window.location.href = response.data.url; 
        } else {
          alert('Invalid redirect URL');
        }
      } catch (error) {
        console.error('Error redirecting:', error.message);
        alert('There was an error redirecting to the link');
      }
    };

   useEffect(() => {
    redirect();
   }, []);
  


  return (
    <div>
       <h1>Redirect</h1>
    </div>
  )
}

export default Redirect
