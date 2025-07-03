import { useState } from 'react';
import type { Experience } from '../types';

const initialExperience = {
  anneeDebut: '',
  dureeEnMois: '',
  tempsPlein: '',
  employeur: '',
  intitule: '',
  descriptif: ''
};

export function useExperienceForm() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [currentExperience, setCurrentExperience] = useState(initialExperience);
  const [aucuneExperience, setAucuneExperience] = useState(false);

  const addExperience = () => {
    if (editingExperience) {
      // Update existing experience
      setExperiences(prev => prev.map(exp => 
        exp.id === editingExperience 
          ? { ...currentExperience, id: editingExperience }
          : exp
      ));
      setEditingExperience(null);
    } else {
      // Add new experience
      const newExperience: Experience = {
        ...currentExperience,
        id: Date.now().toString()
      };
      setExperiences(prev => [...prev, newExperience]);
    }
    
    // Reset form
    setCurrentExperience(initialExperience);
    setShowExperienceForm(false);
  };

  const editExperience = (id: string) => {
    const experience = experiences.find(exp => exp.id === id);
    if (experience) {
      setCurrentExperience({
        anneeDebut: experience.anneeDebut,
        dureeEnMois: experience.dureeEnMois,
        tempsPlein: experience.tempsPlein,
        employeur: experience.employeur,
        intitule: experience.intitule,
        descriptif: experience.descriptif
      });
      setEditingExperience(id);
      setShowExperienceForm(true);
    }
  };

  const deleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };

  const cancelExperienceForm = () => {
    setCurrentExperience(initialExperience);
    setEditingExperience(null);
    setShowExperienceForm(false);
  };

  const handleAucuneExperience = (value: boolean) => {
    setAucuneExperience(value);
    if (value) {
      setExperiences([]);
      setShowExperienceForm(false);
    }
  };

  return {
    experiences,
    setExperiences,
    showExperienceForm,
    setShowExperienceForm,
    editingExperience,
    currentExperience,
    setCurrentExperience,
    aucuneExperience,
    addExperience,
    editExperience,
    deleteExperience,
    cancelExperienceForm,
    handleAucuneExperience,
  };
}
