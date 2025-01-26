import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import Editlink from "../modals/editlink";
import { Copy } from "lucide-react";
import Deletelink from "../modals/deletelink";
import axios from "axios";
import styles from "../Styles/links.module.css";

const LinksTable = () => {
  const [deletemodal, setdeletemodal] = useState(false);
  const [editlinkmodal, seteditlinkmodal] = useState(false);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const openeditlinkmodal = () => {
    seteditlinkmodal(true);
  };

  const closeeditlinkmodal = () => {
    seteditlinkmodal(false);
  };

  const opendeletemodal = () => {
    setdeletemodal(true);
  };

  const closedeletemodal = () => {
    setdeletemodal(false);
  };

  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        alert("Short link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  // Fetch links from the API
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/link/get-links", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Replace this with your auth token logic
          },
        });
        setLinks(response.data);
      } catch (error) {
        console.error("Error fetching links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <table className={styles.linksTable}>
      {deletemodal ? <Deletelink closedeletemodal={closedeletemodal} /> : null}
      <thead>
        <tr>
          <th>Date</th>
          <th>Original Link</th>
          <th>Short Link</th>
          <th>Remarks</th>
          <th>Clicks</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {links.map((link, index) => (
          <tr key={index}>
            <td>{new Date(link.createdAt).toLocaleString()}</td>
            <td className={styles.linkCell}>{link.originalUrl}</td>
            <td className={styles.linkCell}>
              <div className={styles.linkContainer}>
                <span className={styles.shortLinkText}>
                  http://localhost:5000/api/v1/link/{link.shortCode}
                </span>
                <Copy
                  className={styles.copyIcon}
                  onClick={() => copyToClipboard(`http://localhost:5000/api/v1/link/${link.shortCode}`)}
                  size={30}
                />
              </div>
            </td>
            <td>{link.remarks}</td>
            <td>{link.clicks}</td>
            <td
              className={
                link.isActive ? styles.active : styles.inactive
              }
            >
              {link.isActive ? "Active" : "Inactive"}
            </td>
            <td>
              <div className={styles.actions}>
                <MdEdit className={styles.edit} onClick={openeditlinkmodal} />
                <RiDeleteBin6Line className={styles.delete} onClick={opendeletemodal} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      {editlinkmodal ? <Editlink closeeditlinkmodal={closeeditlinkmodal} /> : null}
    </table>
  );
};

export default LinksTable;
