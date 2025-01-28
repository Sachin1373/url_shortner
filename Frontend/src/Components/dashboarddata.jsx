import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../Styles/dashboarddata.module.css";

function Dashboarddata() {
  const [totalClicks, setTotalClicks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceWiseClicks, setDeviceWiseClicks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('https://url-shortner-0tbr.onrender.com/api/v1/link/getclickanalytics', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
       

        const { totalClicks, dateWiseClicks, deviceWiseClicks } = response.data.data;

        setTotalClicks(totalClicks);
        setDateWiseClicks(dateWiseClicks);
        setDeviceWiseClicks(deviceWiseClicks);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={styles.stats}>
        <div className={styles.totalClicks}>
          <h3>Total Clicks</h3>
          <p className={styles.clickCount}>{totalClicks}</p>
        </div>
      </div>

      <div className={styles.charts}>
        
        <div className={styles.dateWiseClicks}>
          <h3>Date-wise Clicks</h3>
          <div className={styles.barChart}>
            {dateWiseClicks.map((item) => (
              <div key={item.date} className={styles.barGroup}>
                <div className={styles.barLabel}>{item.date}</div>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{ width: `${(item.clicks / totalClicks) * 100}%` }}
                  />
                </div>
                <div className={styles.barValue}>{item.clicks}</div>
              </div>
            ))}
          </div>
        </div>

       
        <div className={styles.clickDevices}>
          <h3>Click Devices</h3>
          <div className={styles.barChart}>
            {deviceWiseClicks.map((item) => (
              <div key={item.device} className={styles.barGroup}>
                <div className={styles.barLabel}>{item.device}</div>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{
                      width: `${(item.clicks / deviceWiseClicks.reduce((acc, curr) => acc + curr.clicks, 0)) * 100}%`
                    }}
                  />
                </div>
                <div className={styles.barValue}>{item.clicks}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboarddata;
