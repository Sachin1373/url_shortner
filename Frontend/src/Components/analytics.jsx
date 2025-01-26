import React from 'react'
import { Copy } from 'lucide-react';
import styles from "../Styles/links.module.css"

function Analytics() {
    const data = [
        {
          date: 'Jan 14, 2025 16:30',
          originalLink: 'https://docs.google.com/document/d/1hKwvvtIufHXOTSvmzZboXhG_zN',
          shortLink: 'https://lc/campaign1',
          remarks: 'campaign1',
          ip : '198.57.1.50',
          Device: 'Mobile',
        },
        {
          date: 'Jan 14, 2025 05:45',
          originalLink: 'https://docs.google.com/document/d/1hKwvvtIufHXOTSvmzZboXhG_zN',
          shortLink: 'https://lc/campaign2',
          remarks: 'campaign2',
          ip : '198.57.1.50',
          Device: 'Dekstop',
        },
        {
          date: 'Jan 14, 2025 07:43',
          originalLink: 'https://docs.google.com/document/d/1hKwvvtIufHXOTSvmzZboXhG_zN',
          shortLink: 'https://lc/campaign3',
          ip : '198.57.1.50',
          Device: 'Tablet',
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
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Original Link</th>
          <th>Short Link</th>
          <th>ip address</th>
          <th>User Device</th>
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
            <td>{row.ip}</td>
            <td className={styles.linkCell}>
              {row.Device}
            </td>
           
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Analytics
