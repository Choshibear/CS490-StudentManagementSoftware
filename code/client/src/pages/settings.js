import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext, colorSchemes } from '../ThemeContext';

const roleSettingsConfig = {
  admin: {
    notifications: ["Inbox alerts"],
    ui: ["Update school logo"],
    management: ["Manage user details"]
  },
  parent: {
    notifications: [
      "New assignment created",
      "Past due assignment reminder",
      "Inbox alerts",
      "Assignment graded",
      "Grade below expected performance"
    ],
  },
  student: {
    notifications: [
      "New assignment created",
      "Assignment submitted",
      "Assignment graded",
      "Inbox alerts",
      "Teacher feedback"
    ],
  },
  teacher: {
    notifications: [
      "Assignment submission alerts", 
      "Inbox alerts"
    ],
  }
};

function Settings() {
  const { schemeName, setSchemeName } = useContext(ThemeContext);
  const [user, setUser] = useState({ role: 'admin' }); // or fetch real user
  const [settings, setSettings] = useState({});
  const [logo, setLogo] = useState('logo.png');
  const [showThemeOptions, setShowThemeOptions] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.user) setUser(data.user);
        if (data.settings) setSettings(data.settings);
        if (data.logo) setLogo(data.logo);
      } catch (err) {
        console.error('Could not load settings:', err);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    setSettings(roleSettingsConfig[user.role] || {});
  }, [user.role]);

  // logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    const form = new FormData();
    form.append('schoolLogo', file);
    await fetch('/api/settings/uploadLogo', { method: 'POST', body: form });
  };

  // save everything back to server
  const handleSaveChanges = async () => {
    try {
      const payload = {
        user,
        settings,
        logo,
        colorScheme: schemeName
      };
      const res = await fetch('/api/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) alert('Settings saved!');
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const renderNotifications = () => (
    <div style={{ marginBottom: 20 }}>
      <h4>Notifications</h4>
      {settings.notifications?.map((notif, i) => (
        <label key={i} style={{ display: 'block', marginBottom: 10 }}>
          <input type="checkbox" /> {notif}
        </label>
      ))}
    </div>
  );

  const renderUI = () => (
    <div style={{ marginBottom: 20 }}>
      <h4>User Interface</h4>
      {user.role === 'admin' && (
        <>
          <button
            onClick={() => setShowThemeOptions(prev => !prev)}
            style={{
              marginBottom: 20,
              padding: '8px 16px',
              backgroundColor: schemeName === 'Default' ? '#007bff' : (colorSchemes[schemeName]?.accent || '#007bff'),
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Change Theme
          </button>

          {showThemeOptions && (
            <div style={{ marginBottom: 20 }}>
              <h5>Admin Color Scheme</h5>
              {Object.entries(colorSchemes).map(([name, colors]) => (
                <label
                  key={name}
                  style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
                >
                  <input
                    type="radio"
                    name="colorScheme"
                    value={name}
                    checked={schemeName === name}
                    onChange={() => setSchemeName(name)}
                    style={{ marginRight: 8 }}
                  />
                  <span style={{ marginRight: 12, fontWeight: 500 }}>{name}</span>
                  <div style={{ display: 'flex' }}>
                    <div
                      title="Main BG"
                      style={{
                        backgroundColor: colors.mainBg,
                        width: 20,
                        height: 20,
                        marginRight: 4,
                        border: '1px solid #ccc'
                      }}
                    />
                    <div
                      title="Panel BG"
                      style={{
                        backgroundColor: colors.panelBg,
                        width: 20,
                        height: 20,
                        marginRight: 4,
                        border: '1px solid #ccc'
                      }}
                    />
                    {colors.accent && (
                      <div
                        title="Accent"
                        style={{
                          backgroundColor: colors.accent,
                          width: 20,
                          height: 20,
                          border: '1px solid #ccc'
                        }}
                      />
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 10 }}>
              Upload School Logo:
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>
          </div>
        </>
      )}
    </div>
  );

  const currentScheme = colorSchemes[schemeName] || colorSchemes.Default;

  return (
    <div
      style={{
        padding: 30,
        backgroundColor: currentScheme.mainBg,
        color: currentScheme.text,
        minHeight: '100vh'
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: '0 auto',
          backgroundColor: currentScheme.panelBg,
          padding: 60,
          borderRadius: 8,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
      >
        <h2>Settings</h2>

        {renderNotifications()}
        {renderUI()}

        <button
          onClick={handleSaveChanges}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            backgroundColor: currentScheme.accent || '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer'
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Settings;





