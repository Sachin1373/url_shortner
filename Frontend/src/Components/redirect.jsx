import React, { useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { use } from 'react';

function Redirect() {
    const { id } = useParams();
    console.log('id:', id);

   const redirect = async () =>{
    try {
        const response = await axios.get(`https://url-shortner-0tbr.onrender.com/api/v1/link/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            }

        );
        console.log('Redirected:', response.data);
        window.location.href = response.data.url;
      } catch (error) {
        console.error('Error redirecting:', error.message);
        alert('There was an error redirecting to the link');
      }

   }

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
