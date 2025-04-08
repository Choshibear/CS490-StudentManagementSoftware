import React, { useState, useEffect } from 'react';

const roleSettingsConfig = {
  admin: {
    notifications: ["Inbox alerts"],
    ui: ["Toggle theme", "Update school logo"],
    management: ["Manage user details"]
  },
  parent: {
    notifications: [
      "New assignment created",
      "Past due assignment reminder",
      "Inbox alerts",
      "Assignment graded"
    ],
    ui: ["Toggle theme"]
  },
  student: {
    notifications: [
      "New assignment created",
      "Assignment submitted",
      "Assignment graded",
      "Inbox alerts",
      "Teacher feedback"
    ],
    ui: ["Toggle theme"]
  },
  teacher: {
    notifications: ["Assignment submission alerts", "Inbox alerts"],
    ui: ["Toggle theme"]
  }
};

function Settings() {
  const [user, setUser] = useState({ role: 'parent' }); // Replace dynamic user role parent/teacher/admin/student
  const [theme, setTheme] = useState('light'); 
  const [settings, setSettings] = useState({}); 
  const [logo, setLogo] = useState(null); // the uploaded logo

  useEffect(() => {
    setSettings(roleSettingsConfig[user.role] || {});
  }, [user.role]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogo(file);
      try {
        const formData = new FormData();
        formData.append('schoolLogo', file);

        const response = await fetch('/api/settings/uploadLogo', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Logo uploaded successfully!');
        } else {
          console.error('Failed to upload logo:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading logo:', error);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, theme, settings })
      });
      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        console.error('Failed to save settings:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const renderNotifications = () => (
    <div style={{ marginBottom: '20px' }}>
      <h4>Notifications</h4>
      {settings.notifications && settings.notifications.map((notif, index) => (
        <label key={index} style={{ display: 'block', marginBottom: '10px' }}>
          <input type="checkbox" /> {notif}
        </label>
      ))}
    </div>
  );

  const renderUI = () => (
    <div style={{ marginBottom: '20px' }}>
      <h4>User Interface</h4>
      <button onClick={toggleTheme} style={{ marginBottom: '10px' }}>
        Toggle Theme ({theme === 'light' ? 'Light' : 'Dark'})
      </button>
      {}
      {user.role === 'admin' && (
        <div>
          <label style={{ display: 'block', marginTop: '10px' }}>
            Upload School Logo:
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </label>
        </div>
      )}
    </div> 
  );

  return ( /////////
    <div
      style={{
        padding: '30px',
        backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
        color: theme === 'light' ? '#000' : '#fff',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          width: '1000px',
          backgroundColor: theme === 'light' ? '#fff' : '#444',
          padding: '90px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2>Settings</h2>
        <p>Role: <strong>{user.role}</strong></p>
        {renderNotifications()}
        {renderUI()}
        <button
          onClick={handleSaveChanges}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings; ////





