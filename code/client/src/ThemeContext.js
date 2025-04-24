import React, { createContext, useState, useEffect } from "react";

export const colorSchemes = {
  Default:   { mainBg: "#EDEBE9", panelBg: "#F5F4F2", text: "#2B2B2B"},
  Pastel:    { mainBg: "#F6F5F3", panelBg: "#FFFFFF", text: "#3F3F3F", accent: "#B4CDE6" },
  Forest:    { mainBg: "#E8F0E8", panelBg: "#F6FBF4", text: "#344E41", accent: "#5F7B6F" },
  SoftDark:  { mainBg: "#22252B", panelBg: "#2C2F36", text: "#DADADA", accent: "#5E7A97" },
  Dark:      { mainBg:  "#2B2927", panelBg: "#3D3A38", text: "#EDE3D0", accent:  "#755247"},
  Light:     { mainBg:  "#F4EFEB", panelBg: "#FFFFFF", text: "#4A423D", accent:  "#A67B5B"}
};
export const ThemeContext = createContext({
  schemeName: "Default",
  scheme: colorSchemes.Default,
  setSchemeName: (_name) => {}
});

export function ThemeProvider({ children }) {
  const [schemeName, _setSchemeName] = useState("Default");

  // on mount, fetch the user's saved scheme from API
  useEffect(() => {
    fetch("/api/settings")                  // adjust to GET endpoint
      .then(res => res.json())
      .then(data => {
        if (data.colorScheme && colorSchemes[data.colorScheme]) {
          _setSchemeName(data.colorScheme);
        }
      })
      .catch(console.error);
  }, []);

  const setSchemeName = (name) => {
    if (!colorSchemes[name]) return;
    _setSchemeName(name);

    // persist back to server
    fetch("/api/settings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ colorScheme: name })
    }).catch(console.error);
  };

  const scheme = colorSchemes[schemeName] || colorSchemes.Default;

  return (
    <ThemeContext.Provider value={{ schemeName, scheme, setSchemeName }}>
      {children}
    </ThemeContext.Provider>
  );
}