// frontend/src/contexts/AutomationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAutomation } from "../hooks/useAutomation";

const AutomationContext = createContext(undefined);

export const AutomationProvider = ({ children }) => {
  const automation = useAutomation();
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Load initial data
  useEffect(() => {
    automation.fetchAutomations();
    automation.fetchWorkflows();
    automation.fetchStats();
  }, []);

  // Refresh data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      automation.fetchStats();
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const value = {
    ...automation,
    selectedAutomation,
    setSelectedAutomation,
    selectedWorkflow,
    setSelectedWorkflow,
    isCreating,
    setIsCreating,
  };

  return (
    <AutomationContext.Provider value={value}>
      {children}
    </AutomationContext.Provider>
  );
};

export const useAutomationContext = () => {
  const context = useContext(AutomationContext);
  if (context === undefined) {
    throw new Error('useAutomationContext must be used within AutomationProvider');
  }
  return context;
};

export default AutomationContext;