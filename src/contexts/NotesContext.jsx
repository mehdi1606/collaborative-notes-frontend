import React, { createContext, useContext, useState, useCallback } from 'react';
import { notesAPI } from '../services/api';
import { useNotification } from './NotificationContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const { showNotification } = useNotification();

  const fetchNotes = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await notesAPI.getAll(filters);
      setNotes(response.data.notes);
    } catch (error) {
      showNotification('Failed to fetch notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const fetchSharedNotes = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await notesAPI.getShared(filters);
      setSharedNotes(response.data.notes);
    } catch (error) {
      showNotification('Failed to fetch shared notes', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const createNote = async (noteData) => {
    try {
      const response = await notesAPI.create(noteData);
      const newNote = response.data.note;
      setNotes(prev => [newNote, ...prev]);
      showNotification('Note created successfully', 'success');
      return { success: true, note: newNote };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to create note';
      showNotification(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const fetchNote = async (id) => {
    try {
      const response = await notesAPI.getById(id);
      setCurrentNote(response.data.note);
      return { success: true, note: response.data.note };
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to fetch note';
      showNotification(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const searchNotes = async (query, filters = {}) => {
    setLoading(true);
    try {
      const response = await notesAPI.search({ q: query, ...filters });
      setNotes(response.data.notes);
      return { success: true, notes: response.data.notes };
    } catch (error) {
      showNotification('Failed to search notes', 'error');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    notes,
    sharedNotes,
    currentNote,
    loading,
    fetchNotes,
    fetchSharedNotes,
    createNote,
    updateNote,
    deleteNote,
    fetchNote,
    searchNotes,
    setCurrentNote
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
