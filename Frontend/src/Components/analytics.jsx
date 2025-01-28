import React, { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import axios from 'axios';
import styles from "../Styles/links.module.css";

function Analytics() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get('https://url-shortner-0tbr.onrender.com/api/v1/link/getlinkclicks', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: {
            page: currentPage,
            limit: 8
          }
        });
        setOriginalUrl(response.data.originalUrl);
        setShortCode(response.data.shortCode);
        const analyticsData = response.data.clicks;
        setData(analyticsData);
        // Ensure that currentPage is an integer
        setCurrentPage(parseInt(response.data.pagination.currentPage, 10));
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
                <a href={row.originalUrl} target="_blank" rel="noopener noreferrer">{originalUrl}</a>
              </td>
              <td className={styles.linkCell}>
                <div className={styles.linkContainer}>
                  <span className={styles.shortLinkText}>https://url-shortner-0tbr.onrender.com/link/{shortCode}</span>
                  <Copy 
                    className={styles.copyIcon} 
                    onClick={() => copyToClipboard(`https://url-shortner-three-sigma.vercel.app/redirect/${shortCode}`)} 
                  />
                </div>
              </td>
              <td>{row.ipAddress}</td> 
              <td className={styles.linkCell}>
                {row.userAgent}
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
