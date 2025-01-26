import React, { useState } from 'react';
import DeleteAccount from '../modals/deleteaccount';
import styles from '../Styles/setting.module.css';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Settings() {
  const [deleteaccmodal, setdeleteaccmodal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const opendeleteaccmodal = () => {
    setdeleteaccmodal(true);
  };

  const closedeleteaccmodal = () => {
    setdeleteaccmodal(false);
  };

  const handleSaveChanges = async () => {
    if (!name || !email || !mobile) {
      toast.error('Please fill all the details', { position: 'top-center' });
      return;
    }

    const token = localStorage.getItem('token'); 
    console.log(token)
    if (!token) {
      toast.error('Unauthorized: No token found. Please log in.', { position: 'top-center' });
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/updateprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ name, email, mobile }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Profile Updated Successfully!', { position: 'top-center' });
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      } else {
        toast.error(result.message || 'Failed to update profile', { position: 'top-center' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile', { position: 'top-center' });
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      {deleteaccmodal ? <DeleteAccount closedeleteaccmodal={closedeleteaccmodal} /> : null}
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email id</label>
        <input
          type="email"
          id="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="mobile">Mobile no.</label>
        <input
          type="text"
          id="mobile"
          placeholder="Enter mobile no."
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <button type="button" className={styles.saveButton} onClick={handleSaveChanges}>
        Save Changes
      </button>
      <button type="button" className={styles.deleteButton} onClick={opendeleteaccmodal}>
        Delete Account
      </button>
    </div>
  );
}

export default Settings;
