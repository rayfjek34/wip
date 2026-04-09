import React, { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import { useCV } from '../../store/CVContext';
import {
  PersonalSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  CertificationsSection,
  LanguagesSection,
  InterestsSection,
  CustomSectionsEditor,
} from './EditorSections';
import ScoreBar from './ScoreBar';
import styles from './EditorPanel.module.css';

const SECTION_MAP = {
  personal:       PersonalSection,
  experience:     ExperienceSection,
  education:      EducationSection,
  skills:         SkillsSection,
  certifications: CertificationsSection,
  languages:      LanguagesSection,
  interests:      InterestsSection,
  customSections: CustomSectionsEditor,
};

export default function EditorPanel() {
  const { cv, dispatch } = useCV();
  const listRef  = useRef(null);
  const sortRef  = useRef(null);
  const orderRef = useRef(cv.sectionOrder); // keep fresh copy for onEnd closure

  // Keep orderRef in sync without re-creating Sortable
  useEffect(() => { orderRef.current = cv.sectionOrder; }, [cv.sectionOrder]);

  useEffect(() => {
    if (!listRef.current) return;
    sortRef.current = Sortable.create(listRef.current, {
      animation: 180,
      handle: `.${styles.dragHandle}`,
      ghostClass: styles.ghost,
      chosenClass: styles.chosen,
      dragClass: styles.dragging,
      onEnd(evt) {
        if (evt.oldIndex === evt.newIndex) return;
        const newOrder = [...orderRef.current];
        const [moved] = newOrder.splice(evt.oldIndex, 1);
        newOrder.splice(evt.newIndex, 0, moved);
        dispatch({ type: 'SET_SECTION_ORDER', payload: newOrder });
      },
    });
    return () => { sortRef.current?.destroy(); sortRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only mount once

  return (
    <div className={styles.editor}>
      <ScoreBar />
      <div className={styles.scrollArea}>
        <div ref={listRef} className={styles.sectionList}>
          {cv.sectionOrder.map((sectionId) => {
            const SectionComp = SECTION_MAP[sectionId];
            if (!SectionComp) return null;
            return (
              <div key={sectionId} className={styles.sectionWrapper}>
                <div
                  className={styles.dragHandle}
                  title="Drag to reorder section"
                  aria-label="Drag handle"
                >
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
                    <circle cx="3" cy="2"  r="1.5"/>
                    <circle cx="7" cy="2"  r="1.5"/>
                    <circle cx="3" cy="8"  r="1.5"/>
                    <circle cx="7" cy="8"  r="1.5"/>
                    <circle cx="3" cy="14" r="1.5"/>
                    <circle cx="7" cy="14" r="1.5"/>
                  </svg>
                </div>
                <div className={styles.sectionContent}>
                  <SectionComp />
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.bottomPad} />
      </div>
    </div>
  );
}
