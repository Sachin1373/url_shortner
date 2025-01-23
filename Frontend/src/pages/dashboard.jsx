import React from 'react';
import { LayoutDashboard, Link, BarChart2, Settings, Plus, Search } from 'lucide-react';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
   
    

  const dateWiseClicks = [
    { date: '21-01-25', clicks: 1234 },
    { date: '20-01-25', clicks: 1140 },
    { date: '19-01-25', clicks: 134 },
    { date: '18-01-25', clicks: 34 },
  ];

  const deviceClicks = [
    { device: 'Mobile', clicks: 134 },
    { device: 'Destop', clicks: 40 },
    { device: 'Tablet', clicks: 3 },
  ];

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
         <img src="logo.png" alt="logo" className={styles.logo} />
        
        <nav className={styles.nav}>
          <a href="#" className={`${styles.navItem} ${styles.active}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className={styles.navItem}>
            <Link size={20} />
            Links
          </a>
          <a href="#" className={styles.navItem}>
            <BarChart2 size={20} />
            Analytics
          </a>
          <a href="#" className={styles.navItem}>
            <Settings size={20} />
            Settings
          </a>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.greeting}>
            <span className={styles.star}>⭐</span>
            <div>
              <h2 className={styles.welcomeText}>Good morning, Sujith</h2>
              <p className={styles.date}>Tue Jan 25</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.searchContainer}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by remarks"
                className={styles.searchInput}
              />
            </div>
            <button className={styles.createButton}>
              <Plus size={20} />
              Create new
            </button>
            <div className={styles.avatar}>SU</div>
          </div>
        </header>

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
      </main>
    </div>
  );
};

export default Dashboard;