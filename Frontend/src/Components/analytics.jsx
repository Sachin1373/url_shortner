import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import axios from 'axios';
import styles from "../Styles/links.module.css";

function Analytics() {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get('https://url-shortner-0tbr.onrender.com/api/v1/link/getclickanalytics', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            page: currentPage,
            limit: 8
          }
        });
        const analyticsData = response.data.clicks;
        setData(analyticsData);
        setTotalPages(response.data.pagination.totalPages); 
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('An error occurred while fetching the analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [currentPage]);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Short link copied to clipboard!');
    }).catch(err => {
      console.error('Error copying text: ', err);
    });
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error}</div>; 
  }

  return (
    <>
      <table className={styles.linksTable}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>IP Address</th>
            <th>User Device</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{new Date(row.timestamp).toLocaleString()}</td> 
              <td className={styles.linkCell}>
                <a href={row.originalLink} target="_blank" rel="noopener noreferrer">{row.originalUrl}</a>
              </td>
              <td className={styles.linkCell}>
                <div className={styles.linkContainer}>
                  <span className={styles.shortLinkText}>https://url-shortner-0tbr.onrender.com/{row.shortCode}</span>
                  <Copy 
                    className={styles.copyIcon} 
                    onClick={() => copyToClipboard(`https://url-shortner-0tbr.onrender.com/${row.shortCode}`)} 
                  />
                </div>
              </td>
              <td>{row.ipAddress}</td> 
              <td className={styles.linkCell}>
                {row.device}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
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
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>
    </>
  );
}

export default Analytics;
