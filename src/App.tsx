/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { TouristDestination, StudentRegistration } from "./types";
import StudentRegister from "./components/StudentRegister";
import DestinationExplorer from "./components/DestinationExplorer";
import PreferenceForm from "./components/PreferenceForm";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import { FALLBACK_DESTINATIONS } from "./data/fallbackDestinations";

type AppView = "register" | "explorer" | "preference-form" | "admin-login" | "admin-dashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("register");
  const [student, setStudent] = useState<StudentRegistration | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<TouristDestination | null>(null);
  const [destinations, setDestinations] = useState<TouristDestination[]>(FALLBACK_DESTINATIONS);
  
  // Admin credentials state
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  // Load destinations on mount
  useEffect(() => {
    fetchDestinations();
    
    // Check if admin is already logged in
    const storedToken = sessionStorage.getItem("admin_token");
    const storedUser = sessionStorage.getItem("admin_user");
    if (storedToken) {
      setAdminToken(storedToken);
      setAdminUser(storedUser);
    }
  }, []);

  const fetchDestinations = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5 second timeout

    try {
      const response = await fetch("/api/destinations", { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        const text = await response.text();
        if (text && text.trim()) {
          const data = JSON.parse(text);
          if (Array.isArray(data) && data.length > 0) {
            setDestinations(data);
          }
        }
      }
    } catch (error) {
      console.warn("Failed or timed out fetching dynamic destinations; using premium fallback.", error);
    }
  };

  const handleStudentRegister = (registeredStudent: StudentRegistration) => {
    setStudent(registeredStudent);
    setCurrentView("explorer");
  };

  const handleSelectPreference = (dest: TouristDestination) => {
    setSelectedDestination(dest);
    setCurrentView("preference-form");
  };

  const handleCompleteSubmission = () => {
    // Reset back to register for a new student submission
    setStudent(null);
    setSelectedDestination(null);
    setCurrentView("register");
  };

  const handleAdminLoginSuccess = (token: string, username: string) => {
    setAdminToken(token);
    setAdminUser(username);
    sessionStorage.setItem("admin_token", token);
    sessionStorage.setItem("admin_user", username);
    setCurrentView("admin-dashboard");
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    setAdminUser(null);
    sessionStorage.removeItem("admin_token");
    sessionStorage.removeItem("admin_user");
    setCurrentView("register");
  };

  return (
    <div className="min-h-screen antialiased selection:bg-primary selection:text-white">
      {currentView === "register" && (
        <StudentRegister
          onRegister={handleStudentRegister}
          onAdminClick={() => {
            if (adminToken) {
              setCurrentView("admin-dashboard");
            } else {
              setCurrentView("admin-login");
            }
          }}
        />
      )}

      {currentView === "explorer" && student && (
        <DestinationExplorer
          student={student}
          destinations={destinations}
          onSelectPreference={handleSelectPreference}
          onLogout={() => {
            setStudent(null);
            setCurrentView("register");
          }}
        />
      )}

      {currentView === "preference-form" && student && selectedDestination && (
        <PreferenceForm
          student={student}
          selectedDestination={selectedDestination}
          onBackToExplorer={() => setCurrentView("explorer")}
          onCompleteSubmission={handleCompleteSubmission}
        />
      )}

      {currentView === "admin-login" && (
        <AdminLogin
          onLoginSuccess={handleAdminLoginSuccess}
          onBackToStudent={() => setCurrentView("register")}
        />
      )}

      {currentView === "admin-dashboard" && adminToken && (
        <AdminDashboard
          token={adminToken}
          onLogout={handleAdminLogout}
          destinations={destinations}
          onRefreshDestinations={fetchDestinations}
        />
      )}
    </div>
  );
}
