import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AuthContext } from '@/contexts/AuthContext';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchCourses = async (userId = null) => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase.from('courses').select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `).order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setCourses(data || []);
    } catch (e) {
      console.error("Error fetching courses:", e);
      setError(e.message);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourseById = async (courseId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('id', courseId)
        .single();
      
      if (fetchError) throw fetchError;
      return data;
    } catch (e) {
      console.error("Error fetching course by ID:", e);
      setError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  const addCourse = async (courseData) => {
    if (!user) {
      setError("User must be logged in to add a course.");
      return null;
    }
    setIsLoading(true);
    setError(null);
    try {
      const coursePayload = {
        ...courseData,
        user_id: user.id,
      };
      const { data, error: insertError } = await supabase
        .from('courses')
        .insert(coursePayload)
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setCourses(prevCourses => [data, ...prevCourses]);
      return data;
    } catch (e) {
      console.error("Error adding course:", e);
      setError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCourse = async (courseId, updatedCourseData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: updateError } = await supabase
        .from('courses')
        .update(updatedCourseData)
        .eq('id', courseId)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setCourses(prevCourses => 
        prevCourses.map(course => (course.id === courseId ? data : course))
      );
      return data;
    } catch (e) {
      console.error("Error updating course:", e);
      setError(e.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (deleteError) throw deleteError;
      
      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      return true;
    } catch (e) {
      console.error("Error deleting course:", e);
      setError(e.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CourseContext.Provider value={{ 
      courses, 
      isLoading, 
      error, 
      fetchCourses, 
      fetchCourseById,
      addCourse, 
      updateCourse, 
      deleteCourse 
    }}>
      {children}
    </CourseContext.Provider>
  );
};