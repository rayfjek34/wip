import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('cvmaker-theme') || 'light');
  const [template, setTemplate] = useState('classic');
  const [appState, setAppState] = useState('landing'); // landing | editor
  const [versions, setVersions] = useState([]);
  const [activeVersion, setActiveVersion] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [pendingExport, setPendingExport] = useState(null); // 'pdf' | 'docx'
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('cvmaker-theme', next);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      template, setTemplate,
      appState, setAppState,
      versions, setVersions,
      activeVersion, setActiveVersion,
      showFeedback, setShowFeedback,
      pendingExport, setPendingExport,
      feedbackGiven, setFeedbackGiven,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
