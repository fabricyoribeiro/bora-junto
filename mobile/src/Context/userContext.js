import React, { createContext, useState, useEffect } from 'react';
import { getUserUID } from '../Services/AuthService';
import { api } from '../Lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = getUserUID();

  async function getUser() {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem(`user_${userId}`);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      const response = await api.get(`/user/${userId}`);
      setUser(response.data);

      await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(response.data));
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, [userId]);

  const updateUser = async (newUser) => {
    setUser(newUser);

    try {
      await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(newUser));
    } catch (error) {
      console.log("Error updating user in AsyncStorage:", error);
    }
  };

  if (loading) {
    return null; // Ou algum tipo de indicador de carregamento
  }

  return (
    <UserContext.Provider value={{ user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
