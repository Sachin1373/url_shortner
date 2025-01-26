import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import axios from 'axios';
import styles from "../styles/createlink.module.css";

function CreateLink({  closecreatelinkmodal }) {
  const [formData, setFormData] = useState({
    destinationUrl: '',
    remarks: '',
    expiration: '',
    hasExpiration: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    
      const data = {
        originalUrl: formData.destinationUrl,
        remarks: formData.remarks,
        expiresAt: formData.hasExpiration ? formData.expiration : null
      };

 
      const response = await axios.post('http://localhost:5000/api/v1/link/create-link', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        }
      });

      closecreatelinkmodal();
    
    } catch (error) {
      console.error('Error creating link:', error);
      alert('There was an error creating the link');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>New Link</h2>
          <button className={styles.closeButton} onClick={closecreatelinkmodal}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="destinationUrl">
              Destination Url <span className={styles.required}>*</span>
            </label>
            <input
              type="url"
              id="destinationUrl"
              name="destinationUrl"
              value={formData.destinationUrl}
              onChange={handleChange}
              placeholder="https://web.whatsapp.com/"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="remarks">
              Remarks <span className={styles.required}>*</span>
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Add remarks"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.expirationHeader}>
              <label htmlFor="expiration">Link Expiration</label>
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={formData.hasExpiration}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hasExpiration: e.target.checked
                  }))}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            {formData.hasExpiration && (
              <div className={styles.dateInputWrapper}>
                <input
                  type="datetime-local"
                  id="expiration"
                  name="expiration"
                  value={formData.expiration}
                  onChange={handleChange}
                />
                <Calendar className={styles.calendarIcon} size={20} />
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button 
              type="button" 
              className={styles.clearButton}
              onClick={() => setFormData({
                destinationUrl: '',
                remarks: '',
                expiration: '',
                hasExpiration: false
              })}
            >
              Clear
            </button>
            <button type="submit" className={styles.createButton}>
              Create new
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLink;
