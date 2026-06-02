import { createContext, useContext, useState, useCallback } from 'react';

const defaultCV = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    photo: null,
    linkedin: '',
    github: '',
    portfolio: '',
    website: '',
  },
  summary: '',
  experience: [
    { id: 1, company: '', position: '', startDate: '', endDate: '', description: '', current: false },
  ],
  education: [
    { id: 1, school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
  ],
  skills: [],
  languages: [
    { id: 1, name: '', level: 'Orta' },
  ],
  certifications: [
    { id: 1, name: '', issuer: '', date: '' },
  ],
  template: 'premium',
  primaryColor: '#2563eb',
  fontSize: 'medium',
};

const CVContext = createContext();

export function CVProvider({ children }) {
  const [cvData, setCVData] = useState(defaultCV);
  const [uploadedFile, setUploadedFile] = useState(null);

  const updatePersonal = useCallback((field, value) => {
    setCVData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
  }, []);

  const updateSummary = useCallback((value) => {
    setCVData(prev => ({ ...prev, summary: value }));
  }, []);

  const updateExperience = useCallback((id, field, value) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  }, []);

  const addExperience = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), company: '', position: '', startDate: '', endDate: '', description: '', current: false }],
    }));
  }, []);

  const removeExperience = useCallback((id) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id),
    }));
  }, []);

  const updateEducation = useCallback((id, field, value) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  }, []);

  const addEducation = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
    }));
  }, []);

  const removeEducation = useCallback((id) => {
    setCVData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  }, []);

  const updateSkill = useCallback((index, field, value) => {
    setCVData(prev => {
      const skills = [...prev.skills];
      skills[index] = { ...skills[index], [field]: value };
      return { ...prev, skills };
    });
  }, []);

  const addSkill = useCallback((category = 'other') => {
    setCVData(prev => ({
      ...prev,
      skills: [...prev.skills, { id: Date.now(), name: '', category, level: 'Orta' }],
    }));
  }, []);

  const removeSkill = useCallback((index) => {
    setCVData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  }, []);

  const updateLanguage = useCallback((id, field, value) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      ),
    }));
  }, []);

  const addLanguage = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      languages: [...prev.languages, { id: Date.now(), name: '', level: 'Orta' }],
    }));
  }, []);

  const removeLanguage = useCallback((id) => {
    setCVData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id),
    }));
  }, []);

  const updateCertification = useCallback((id, field, value) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      ),
    }));
  }, []);

  const addCertification = useCallback(() => {
    setCVData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { id: Date.now(), name: '', issuer: '', date: '' }],
    }));
  }, []);

  const removeCertification = useCallback((id) => {
    setCVData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id),
    }));
  }, []);

  const updateSetting = useCallback((field, value) => {
    setCVData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetCV = useCallback(() => {
    setCVData(defaultCV);
    setUploadedFile(null);
  }, []);

  return (
    <CVContext.Provider value={{
      cvData, setCVData,
      uploadedFile, setUploadedFile,
      updatePersonal,
      updateSummary,
      updateExperience, addExperience, removeExperience,
      updateEducation, addEducation, removeEducation,
      updateSkill, addSkill, removeSkill,
      updateLanguage, addLanguage, removeLanguage,
      updateCertification, addCertification, removeCertification,
      updateSetting,
      resetCV,
    }}>
      {children}
    </CVContext.Provider>
  );
}

export function useCV() {
  const context = useContext(CVContext);
  if (!context) throw new Error('useCV must be used within CVProvider');
  return context;
}
