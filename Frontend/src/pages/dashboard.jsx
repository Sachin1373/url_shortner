import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoIosLink } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import Dashboarddata from "../Components/dashboarddata";
import Links from "../Components/links";
import CreatLink from "../modals/createlink";
import Setting from "../Components/settings";
import Analytics from "../Components/analytics";
import styles from "../Styles/dashboard.module.css";

const Dashboard = () => {
  const [userInitials, setUserInitials] = useState("");
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showLogout, setShowLogout] = useState(false);
  const [searchbyremarks, setSearchbyremarks] = useState("");
  const [createlinkmodal, setcreatelinkmodal] = useState(false);
  const navigate = useNavigate();

  const opencreatelinkmodal = () => {
    setcreatelinkmodal(true);
  };

  const closecreatelinkmodal = () => {
    setcreatelinkmodal(false);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUserName(storedUsername);
      const nameParts = storedUsername.split(" ");
      const initials =
        nameParts.length > 1
          ? nameParts.map((part) => part[0].toUpperCase()).join("")
          : storedUsername.slice(0, 2).toUpperCase();
      setUserInitials(initials);
    }

    const hours = new Date().getHours();
    let greetingMessage = "Hello";
    if (hours >= 5 && hours < 12) {
      greetingMessage = "Good morning";
    } else if (hours >= 12 && hours < 17) {
      greetingMessage = "Good afternoon";
    } else if (hours >= 17 && hours < 21) {
      greetingMessage = "Good evening";
    } else {
      greetingMessage = "Good night";
    }
    setGreeting(greetingMessage);

    const options = { weekday: "short", month: "short", day: "numeric" };
    const formattedDate = new Date().toLocaleDateString("en-US", options);
    setCurrentDate(formattedDate);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleLogout = (e) => {
    e.stopPropagation();
    setShowLogout(!showLogout);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogout && !event.target.closest(`.${styles.avatarContainer}`)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showLogout]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchbyremarks(value);

  
    if (activeTab !== "links") {
      setActiveTab("links");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <img src="logo.png" alt="logo" className={styles.logo} />
        <nav className={styles.nav}>
          <a
            href="#"
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.active : ""}`}
            onClick={() => handleTabChange("dashboard")}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a
            href="#"
            className={`${styles.navItem} ${activeTab === "links" ? styles.active : ""}`}
            onClick={() => handleTabChange("links")}
          >
            <IoIosLink size={20} />
            Links
          </a>
          <a
            href="#"
            className={`${styles.navItem} ${activeTab === "analytics" ? styles.active : ""}`}
            onClick={() => handleTabChange("analytics")}
          >
            <FaArrowTrendUp size={20} />
            Analytics
          </a>
          <a
            href="#"
            className={`${styles.navItem} ${activeTab === "settings" ? styles.active : ""}`}
            onClick={() => handleTabChange("settings")}
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
              <h2 className={styles.welcomeText}>
                {greeting}, {userName || "Guest"}
              </h2>
              <p className={styles.date}>{currentDate}</p>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.createButton} onClick={opencreatelinkmodal}>
              <Plus size={20} />
              <span className={styles.buttonText}>Create new</span>
            </button>
            <div className={styles.searchContainer}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by remarks"
                className={styles.searchInput}
                value={searchbyremarks}
                onChange={handleSearchChange}
              />
            </div>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar} onClick={toggleLogout}>
                {userInitials}
              </div>
              {showLogout && (
                <button className={styles.logoutButton} onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        <section className={styles.contentSection}>
          {activeTab === "dashboard" && <Dashboarddata />}
          {activeTab === "links" && <Links searchTerm={searchbyremarks} />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "settings" && <Setting />}
        </section>

        {createlinkmodal && <CreatLink closecreatelinkmodal={closecreatelinkmodal} />}
      </main>
    </div>
  );
};

export default Dashboard;
