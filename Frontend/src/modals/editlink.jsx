import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/editlink.module.css";
import { X, Calendar } from "lucide-react";

function Editlink({ closeeditlinkmodal, linkID, refreshLinks }) {
  const [linkdata, setLinkData] = useState(null);
  const [formData, setFormData] = useState({
    destinationUrl: "",
    remarks: "",
    expiration: "",
    hasExpiration: false,
  });

  
  const formatDateTimeLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };


  const getLinkData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/link/getlink/${linkID}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = response.data;
      setLinkData(data);
      setFormData({
        destinationUrl: data.originalUrl || "",
        remarks: data.remarks || "",
        expiration: data.expiresAt ? formatDateTimeLocal(data.expiresAt) : "",
        hasExpiration: !!data.expiresAt,
      });
    } catch (error) {
      console.error("Error fetching link data:", error.message);
      alert("There was an error fetching the link data");
    }
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        originalUrl: formData.destinationUrl,
        remarks: formData.remarks,
        expiresAt: formData.hasExpiration ? formData.expiration : null,
      };

      const response = await axios.patch(
        `http://localhost:5000/api/v1/link/edit/${linkID}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      closeeditlinkmodal();
      refreshLinks();
    } catch (error) {
      console.error("Error updating link:", error.message);
      alert("There was an error updating the link");
    }
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    getLinkData();
  }, []);

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
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      hasExpiration: e.target.checked,
                      expiration: e.target.checked ? prev.expiration : "",
                    }))
                  }
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
              onClick={() =>
                setFormData({
                  destinationUrl: "",
                  remarks: "",
                  expiration: "",
                  hasExpiration: false,
                })
              }
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
  );
}

export default Editlink;
