import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Link, BarChart2, Settings, Plus, Search, Menu } from 'lucide-react';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [userInitials, setUserInitials] = useState('');
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserName(storedUsername);
      const nameParts = storedUsername.split(' ');
      const initials = nameParts.length > 1
        ? nameParts.map((part) => part[0].toUpperCase()).join('')
        : storedUsername.slice(0, 2).toUpperCase();
      setUserInitials(initials);
    }

    const hours = new Date().getHours();
    let greetingMessage = 'Hello';
    if (hours >= 5 && hours < 12) {
      greetingMessage = 'Good morning';
    } else if (hours >= 12 && hours < 17) {
      greetingMessage = 'Good afternoon';
    } else if (hours >= 17 && hours < 21) {
      greetingMessage = 'Good evening';
    } else {
      greetingMessage = 'Good night';
    }
    setGreeting(greetingMessage);

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(formattedDate);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
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
        <header className={styles.headerSection}>
          <div className={styles.greeting}>
            <span className={styles.star}>⭐</span>
            <div>
              <h2 className={styles.welcomeText}>{greeting}, {userName || 'Guest'}</h2>
              <p className={styles.date}>{currentDate}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.createButton}>
              <Plus size={20} />
              <span className={styles.buttonText}>Create new</span>
            </button>
            <div className={styles.searchContainer}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by remarks"
                className={styles.searchInput}
              />
            </div>
            <div className={styles.avatar}>{userInitials}</div>
          </div>
        </header>

        <section className={styles.contentSection}>
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
        </section>
      </main>
    </div>
  );
};

export default Dashboard;