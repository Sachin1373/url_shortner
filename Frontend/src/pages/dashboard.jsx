import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Link, BarChart2, Settings, Plus, Search, Menu, LogOut } from 'lucide-react';
import Dashboarddata from '../Components/dashboarddata';
import Links from '../Components/links';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [userInitials, setUserInitials] = useState('');
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogout && !event.target.closest(`.${styles.avatarContainer}`)) {
        setShowLogout(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLogout]);

  const handleTabChange = (tab) => {
    setActiveTab(tab); 
  };

  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <img src="logo.png" alt="logo" className={styles.logo} />
        <nav className={styles.nav}>
          <a 
            href="#"
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a 
            href="#"
            className={`${styles.navItem} ${activeTab === 'links' ? styles.active : ''}`}
            onClick={() => handleTabChange('links')}
          >
            <Link size={20} />
            Links
          </a>
          <a 
            href="#"
            className={`${styles.navItem} ${activeTab === 'analytics' ? styles.active : ''}`}
            onClick={() => handleTabChange('analytics')}
          >
            <BarChart2 size={20} />
            Analytics
          </a>
          <a 
            href="#"
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => handleTabChange('settings')}
          >
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
            <div className={styles.avatarContainer}>
              <div 
                className={styles.avatar} 
                onClick={() => setShowLogout(!showLogout)}
              >
                {userInitials}
              </div>
              {showLogout && (
                <div className={styles.logoutMenu}>
                  <button onClick={handleLogout} className={styles.logoutButton}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={styles.contentSection}>
          {activeTab === 'dashboard' && <Dashboarddata />}
          {activeTab === 'links' && <Links />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'settings' && <Settings />}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
