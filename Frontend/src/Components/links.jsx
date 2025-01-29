import React, { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import Editlink from "../modals/editlink";
import { Copy } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Deletelink from "../modals/deletelink";
import axios from "axios";
import styles from "../Styles/links.module.css";

const LinksTable = ({ searchTerm }) => {
  const [deletemodal, setdeletemodal] = useState(false);
  const [editlinkmodal, seteditlinkmodal] = useState(false);
  const [links, setLinks] = useState([]);
  const [linkID, setLinkID] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const openeditlinkmodal = (linkID) => {
    setLinkID(linkID);
    seteditlinkmodal(true);
  };

  const closeeditlinkmodal = () => {
    setLinkID("");
    seteditlinkmodal(false);
  };

  const opendeletemodal = (linkID) => {
    setLinkID(linkID);
    setdeletemodal(true);
  };

  const closedeletemodal = () => {
    setLinkID("");
    setdeletemodal(false);
  };

  const copyToClipboard = (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        toast.success("Short link copied to clipboard!", {
          position: "bottom-left",
          autoClose: 500,
        });
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  const fetchLinks = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get("https://url-shortner-0tbr.onrender.com/api/v1/link/get-links", {
        params: { page, limit: 8 },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const linksData = response.data.links;
      setLinks(Array.isArray(linksData) ? linksData : []);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks(currentPage);
  }, [currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <table className={styles.linksTable}>
        <ToastContainer />
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
          {links.map((link, index) => {
            const isExpired = link.expiresAt ? new Date(link.expiresAt).getTime() < Date.now() : false;
           
            return (
              <tr key={index}>
                <td>{new Date(link.createdAt).toLocaleString()}</td>
                <td className={styles.linkCell}>{link.originalUrl}</td>
                <td className={styles.linkCell}>
                  <div className={styles.linkContainer}>
                    <span className={styles.shortLinkText}>
                      https://url-shortner.com/{link.shortCode}
                    </span>
                    <Copy
                      className={`${styles.copyIcon} ${isExpired ? styles.disabled : ""}`}
                      onClick={() => !isExpired && copyToClipboard(`https://url-shortner-three-sigma.vercel.app/redirect/${link.shortCode}`)}
                      size={30}
                      style={{ cursor: isExpired ? "not-allowed" : "pointer", opacity: isExpired ? 0.5 : 1 }}
                    />
                  </div>
                </td>
                <td>{link.remarks}</td>
                <td>{link.clicks}</td>
                <td className={isExpired ? styles.inactive : link.isActive ? styles.active : styles.inactive}>
                  {isExpired ? "Inactive" : link.isActive ? "Active" : "Inactive"}
                </td>
                <td>
                  <div className={styles.actions}>
                    <MdEdit className={styles.edit} onClick={() => openeditlinkmodal(link._id)} />
                    <RiDeleteBin6Line className={styles.delete} onClick={() => opendeletemodal(link._id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editlinkmodal && <Editlink closeeditlinkmodal={closeeditlinkmodal} linkID={linkID} linkdata={links} refreshLinks={fetchLinks} />}
      {deletemodal && <Deletelink closedeletemodal={closedeletemodal} linkID={linkID} refreshLinks={fetchLinks} />}

      <div className={styles.pagination}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          {"<"}
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
          <button
            key={page}
            className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          {">"}
        </button>
      </div>
    </>
  );
};

export default LinksTable;
