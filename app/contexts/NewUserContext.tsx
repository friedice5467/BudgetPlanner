import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AppUser } from '../models/appUser';
import { BaseBudget } from '../models/budget/budget';

interface ProfileContextType {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  baseBudget: BaseBudget | null;
  setBaseBudget: (budget: BaseBudget) => void;
  onProfileUpdate: (user: AppUser) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: ReactNode, onProfileUpdate: (user: AppUser) => void }> = ({ children, onProfileUpdate }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [baseBudget, setBaseBudget] = useState<BaseBudget | null>(null);

  // Provide all values and the function through context
  const value = {
    user,
    setUser,
    baseBudget,
    setBaseBudget,
    onProfileUpdate,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};
