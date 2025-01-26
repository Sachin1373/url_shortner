import React,{useState} from 'react'
import styles from '../styles/editlink.module.css'
import { X, Calendar } from 'lucide-react'

function Editlink({closeeditlinkmodal}) {

    const [formData, setFormData] = useState({
        destinationUrl: '',
        remarks: '',
        expiration: '',
        hasExpiration: false
      });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
        onClose();
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
          <h2>Edit Link</h2>
          <button className={styles.closeButton} onClick={closeeditlinkmodal}>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Editlink
