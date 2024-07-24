import React, { createContext, useState, useEffect } from 'react';
import { getUserUID } from '../Services/AuthService';
import { api } from '../Lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Adicionar estado de carregamento

  const userId = getUserUID();

  async function getUser() {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Primeiro tenta carregar o usuário do Async Storage
      const storedUser = await AsyncStorage.getItem(`user_${userId}`);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setLoading(false);
        return;
      }

      // Se não houver usuário no Async Storage, busca da API
      const response = await api.get(`/user/${userId}`);
      console.log("USER", response.data);
      setUser(response.data);
      
      // Salva o usuário no Async Storage
      await AsyncStorage.setItem(`user_${userId}`, JSON.stringify(response.data));
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUser();
  }, [userId]); // Adicionar userId como dependência para recarregar quando userId mudar

  if (loading) {
    return null; // Ou algum tipo de indicador de carregamento
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
