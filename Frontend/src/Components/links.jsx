import React, { useState } from 'react';
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import Editlink from '../modals/editlink';
import { Copy } from 'lucide-react';
import Deletelink from '../modals/deletelink';
import styles from '../Styles/links.module.css';

const LinksTable = () => {

    const [deletemodal,setdeletemodal] = useState(false)
    const [editlinkmodal,seteditlinkmodal] = useState(false)

    const openeditlinkmodal = () =>{
        seteditlinkmodal(true)
    }

    const closeeditlinkmodal = () =>{
        seteditlinkmodal(false)

    }

    const opendeletemodal = () =>{
          setdeletemodal(true)
    }

    const closedeletemodal = () =>{
        setdeletemodal(false)
    }

  const data = [
    {
      date: 'Jan 14, 2025 16:30',
      originalLink: 'https://docs.google.com/document/d/1hKwvvtIufHXOTSvmzZboXhG_zN',
      shortLink: 'https://lc/campaign1',
      remarks: 'campaign1',
      clicks: 5,
      status: 'Active',
    },
    {
      date: 'Jan 14, 2025 05:45',
      originalLink: 'https://docs.google.com/document/d/1hKwvvtIufHXOTSvmzZboXhG_zN',
      shortLink: 'https://lc/campaign2',
      remarks: 'campaign2',
      clicks: 5,
      status: 'Inactive',
    },
    {
      date: 'Jan 14, 2025 07:43',
      originalLink: 'https://docs.google.com/document/d/1hKwvvtIufHXOTSvmzZboXhG_zN',
      shortLink: 'https://lc/campaign3',
      remarks: 'campaign3',
      clicks: 5,
      status: 'Inactive',
    },
  ];

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Short link copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  return (
    <table className={styles.linksTable}>
       {deletemodal ? <Deletelink closedeletemodal={closedeletemodal}  /> : null}
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
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.date}</td>
            <td className={styles.linkCell}>{row.originalLink}</td>
            <td className={styles.linkCell}>
              <div className={styles.linkContainer}>
                <span className={styles.shortLinkText}>{row.shortLink}</span>
                <Copy 
                  className={styles.copyIcon} 
                  onClick={() => copyToClipboard(row.shortLink)} 
                />
              </div>
            </td>
            <td>{row.remarks}</td>
            <td>{row.clicks}</td>
            <td className={row.status === 'Active' ? styles.active : styles.inactive}>
              {row.status}
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
