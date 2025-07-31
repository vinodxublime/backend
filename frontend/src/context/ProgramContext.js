import React, { createContext, useContext, useState, useEffect } from 'react';
import * as programsAPI from '../api/programs';
import { useAuth } from './AuthContext';

const ProgramContext = createContext();

export const usePrograms = () => {
  const context = useContext(ProgramContext);
  if (!context) {
    throw new Error('usePrograms must be used within a ProgramProvider');
  }
  return context;
};

export const ProgramProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);
  const [featuredPrograms, setFeaturedPrograms] = useState([]);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [programProgress, setProgramProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  
  // Fetch all programs
  const fetchPrograms = async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.getPrograms(params);
      setPrograms(response.programs);
      
      // Extract featured programs
      const featured = response.programs.filter(program => program.featured);
      setFeaturedPrograms(featured);
      
      return response.programs;
    } catch (error) {
      setError(error.message || 'Failed to fetch programs');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a single program by ID
  const fetchProgram = async (programId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.getProgram(programId);
      setCurrentProgram(response.program);
      return response.program;
    } catch (error) {
      setError(error.message || 'Failed to fetch program');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch enrolled programs for the current user
  const fetchEnrolledPrograms = async () => {
    if (!user) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.getEnrolledPrograms();
      setEnrolledPrograms(response.programs);
      return response.programs;
    } catch (error) {
      setError(error.message || 'Failed to fetch enrolled programs');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Enroll in a program
  const enrollProgram = async (programId) => {
    if (!user) return { success: false, message: 'You must be logged in to enroll' };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.enrollProgram(programId);
      
      // Update enrolled programs list
      await fetchEnrolledPrograms();
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to enroll in program');
      return { success: false, message: error.message || 'Failed to enroll in program' };
    } finally {
      setLoading(false);
    }
  };
  
  // Unenroll from a program
  const unenrollProgram = async (programId) => {
    if (!user) return { success: false, message: 'You must be logged in to unenroll' };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.unenrollProgram(programId);
      
      // Update enrolled programs list
      await fetchEnrolledPrograms();
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to unenroll from program');
      return { success: false, message: error.message || 'Failed to unenroll from program' };
    } finally {
      setLoading(false);
    }
  };
  
  // Get program progress
  const fetchProgramProgress = async (programId) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.getProgramProgress(programId);
      
      // Update progress state
      setProgramProgress(prev => ({
        ...prev,
        [programId]: response.progress
      }));
      
      return response.progress;
    } catch (error) {
      setError(error.message || 'Failed to fetch program progress');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a module as complete
  const markModuleComplete = async (programId, moduleId) => {
    if (!user) return { success: false, message: 'You must be logged in to track progress' };
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await programsAPI.markModuleComplete(programId, moduleId);
      
      // Update progress state
      await fetchProgramProgress(programId);
      
      return { success: true };
    } catch (error) {
      setError(error.message || 'Failed to mark module as complete');
      return { success: false, message: error.message || 'Failed to mark module as complete' };
    } finally {
      setLoading(false);
    }
  };
  
  // Check if user is enrolled in a program
  const isEnrolled = (programId) => {
    return enrolledPrograms.some(program => program._id === programId);
  };
  
  // Get program completion percentage
  const getProgramCompletion = (programId) => {
    const progress = programProgress[programId];
    if (!progress) return 0;
    
    const { completedModules, totalModules } = progress;
    if (!totalModules) return 0;
    
    return Math.round((completedModules / totalModules) * 100);
  };
  
  // Load enrolled programs when user changes
  useEffect(() => {
    if (user) {
      fetchEnrolledPrograms();
    } else {
      setEnrolledPrograms([]);
      setProgramProgress({});
    }
  }, [user]);
  
  // Alias for fetchProgram to match the function name used in ProgramDetails
  const fetchProgramById = fetchProgram;

  const value = {
    programs,
    enrolledPrograms,
    featuredPrograms,
    currentProgram,
    programProgress,
    loading,
    error,
    fetchPrograms,
    fetchProgram,
    fetchProgramById,
    fetchEnrolledPrograms,
    enrollProgram,
    enrollInProgram: enrollProgram, // Alias for enrollProgram to match the function name used in ProgramDetails
    unenrollProgram,
    fetchProgramProgress,
    markModuleComplete,
    isEnrolled,
    getProgramCompletion
  };
  
  return <ProgramContext.Provider value={value}>{children}</ProgramContext.Provider>;
};