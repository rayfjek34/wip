import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { CVProvider } from './store/CVContext';
import LandingPage from './components/editor/LandingPage';
import EditorPanel from './components/editor/EditorPanel';
import PreviewPanel from './components/preview/PreviewPanel';
import Toolbar from './components/editor/Toolbar';
import FeedbackModal from './components/ui/FeedbackModal';
import styles from './App.module.css';

function AppContent() {
  const { appState, theme, showFeedback } = useApp();
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (appState === 'landing') return <LandingPage />;

  return (
    <div className={styles.app}>
      <Toolbar
        onTogglePreview={() => setPreviewVisible(v => !v)}
        previewVisible={previewVisible}
      />
      <div className={styles.workspace}>
        <div className={`${styles.editorCol} ${previewVisible ? styles.hidden : ''}`}>
          <EditorPanel />
        </div>
        <div className={`${styles.previewCol} ${previewVisible ? styles.mobileVisible : ''}`}>
          <PreviewPanel />
        </div>
      </div>
      {showFeedback && <FeedbackModal />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <CVProvider>
        <AppContent />
      </CVProvider>
    </AppProvider>
  );
}
