import React, { createContext, useState, useEffect } from 'react';
import { getUserUID } from '../Services/AuthService';
import { api } from '../Lib/axios';

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
      const response = await api.get(`/user/${userId}`);
      console.log("USER", response.data);
      setUser(response.data);
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
