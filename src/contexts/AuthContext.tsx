"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Matches the Prisma Role Enum
export type Role = "LEARNER" | "COMPANY_ADMIN" | "ENTERPRISE_ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  companyId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const mockSuperAdmin: User = {
  id: "user-sa-1",
  name: "Sarah Admin",
  email: "sarah@vbv-platform.ch",
  role: "SUPER_ADMIN",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with a mock Super Admin for Sprint 0/1 development
  const [user, setUser] = useState<User | null>(mockSuperAdmin);
  const [isLoading, setIsLoading] = useState(false);

  const login = (newUser: User) => setUser(newUser);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
