import React, { createContext, useContext, useReducer, useCallback } from 'react';

const defaultCV = {
  personal: {
    firstName: '', middleName: '', lastName: '',
    email: '', phone: '', website: '',
    address: '', postalCode: '', photo: null,
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: ['personal', 'experience', 'education', 'skills', 'certifications', 'languages', 'interests', 'customSections'],
};

const newId = () => Math.random().toString(36).slice(2, 9);

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } };
    case 'ADD_EXPERIENCE':
      return { ...state, experience: [...state.experience, { id: newId(), title: '', company: '', startDate: '', endDate: '', current: false, description: '' }] };
    case 'UPDATE_EXPERIENCE':
      return { ...state, experience: state.experience.map(e => e.id === action.id ? { ...e, ...action.payload } : e) };
    case 'REMOVE_EXPERIENCE':
      return { ...state, experience: state.experience.filter(e => e.id !== action.id) };
    case 'REORDER_EXPERIENCE':
      return { ...state, experience: action.payload };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, { id: newId(), degree: '', institution: '', startDate: '', endDate: '', current: false, description: '' }] };
    case 'UPDATE_EDUCATION':
      return { ...state, education: state.education.map(e => e.id === action.id ? { ...e, ...action.payload } : e) };
    case 'REMOVE_EDUCATION':
      return { ...state, education: state.education.filter(e => e.id !== action.id) };
    case 'REORDER_EDUCATION':
      return { ...state, education: action.payload };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, { id: newId(), name: '', level: 'Intermediate' }] };
    case 'UPDATE_SKILL':
      return { ...state, skills: state.skills.map(s => s.id === action.id ? { ...s, ...action.payload } : s) };
    case 'REMOVE_SKILL':
      return { ...state, skills: state.skills.filter(s => s.id !== action.id) };
    case 'REORDER_SKILLS':
      return { ...state, skills: action.payload };
    case 'ADD_CERTIFICATION':
      return { ...state, certifications: [...state.certifications, { id: newId(), name: '', authority: '', description: '' }] };
    case 'UPDATE_CERTIFICATION':
      return { ...state, certifications: state.certifications.map(c => c.id === action.id ? { ...c, ...action.payload } : c) };
    case 'REMOVE_CERTIFICATION':
      return { ...state, certifications: state.certifications.filter(c => c.id !== action.id) };
    case 'ADD_LANGUAGE':
      return { ...state, languages: [...state.languages, { id: newId(), name: '', proficiency: 'Intermediate' }] };
    case 'UPDATE_LANGUAGE':
      return { ...state, languages: state.languages.map(l => l.id === action.id ? { ...l, ...action.payload } : l) };
    case 'REMOVE_LANGUAGE':
      return { ...state, languages: state.languages.filter(l => l.id !== action.id) };
    case 'ADD_INTEREST':
      return { ...state, interests: [...state.interests, { id: newId(), name: '', description: '' }] };
    case 'UPDATE_INTEREST':
      return { ...state, interests: state.interests.map(i => i.id === action.id ? { ...i, ...action.payload } : i) };
    case 'REMOVE_INTEREST':
      return { ...state, interests: state.interests.filter(i => i.id !== action.id) };
    case 'ADD_CUSTOM_SECTION':
      return { ...state, customSections: [...state.customSections, { id: newId(), title: 'Custom Section', entries: [] }] };
    case 'UPDATE_CUSTOM_SECTION':
      return { ...state, customSections: state.customSections.map(s => s.id === action.id ? { ...s, ...action.payload } : s) };
    case 'REMOVE_CUSTOM_SECTION':
      return { ...state, customSections: state.customSections.filter(s => s.id !== action.id) };
    case 'ADD_CUSTOM_ENTRY':
      return { ...state, customSections: state.customSections.map(s => s.id === action.sectionId ? { ...s, entries: [...s.entries, { id: newId(), content: '' }] } : s) };
    case 'UPDATE_CUSTOM_ENTRY':
      return { ...state, customSections: state.customSections.map(s => s.id === action.sectionId ? { ...s, entries: s.entries.map(e => e.id === action.id ? { ...e, content: action.content } : e) } : s) };
    case 'REMOVE_CUSTOM_ENTRY':
      return { ...state, customSections: state.customSections.map(s => s.id === action.sectionId ? { ...s, entries: s.entries.filter(e => e.id !== action.id) } : s) };
    case 'SET_SECTION_ORDER':
      return { ...state, sectionOrder: action.payload };
    case 'LOAD_CV':
      return { ...defaultCV, ...action.payload };
    case 'RESET_CV':
      return { ...defaultCV };
    default:
      return state;
  }
}

const CVContext = createContext(null);

export function CVProvider({ children }) {
  const [cv, dispatch] = useReducer(reducer, defaultCV);
  const update = useCallback((type, payload, extra) => dispatch({ type, payload, ...extra }), []);
  return <CVContext.Provider value={{ cv, dispatch, update }}>{children}</CVContext.Provider>;
}

export const useCV = () => useContext(CVContext);
export { defaultCV, newId };
