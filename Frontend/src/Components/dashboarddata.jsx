import React from 'react'
import { LayoutDashboard, Link, BarChart2, Settings, Plus, Search, Menu } from 'lucide-react';
import styles from "../Styles/dashboarddata.module.css"
function Dashboarddata() {

    const dateWiseClicks = [
        { date: '21-01-25', clicks: 1234 },
        { date: '20-01-25', clicks: 1140 },
        { date: '19-01-25', clicks: 134 },
        { date: '18-01-25', clicks: 34 },
      ];
    
      const deviceClicks = [
        { device: 'Mobile', clicks: 134 },
        { device: 'Desktop', clicks: 40 },
        { device: 'Tablet', clicks: 3 },
      ];
  return (
    <>
       <div className={styles.stats}>
                   <div className={styles.totalClicks}>
                     <h3>Total Clicks</h3>
                     <p className={styles.clickCount}>1234</p>
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
                               style={{ width: `${(item.clicks / 1234) * 100}%` }}
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
                       {deviceClicks.map((item) => (
                         <div key={item.device} className={styles.barGroup}>
                           <div className={styles.barLabel}>{item.device}</div>
                           <div className={styles.barWrapper}>
                             <div
                               className={styles.bar}
                               style={{ width: `${(item.clicks / 134) * 100}%` }}
                             />
                           </div>
                           <div className={styles.barValue}>{item.clicks}</div>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
    </>
  )
}

export default Dashboarddata
