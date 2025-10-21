// frontend/src/hooks/useAutomation.js
import { useState, useEffect, useCallback } from "react";
import { automationAPI, workflowAPI, smsAPI, emailAPI } from "../services/api";
import toast from "react-hot-toast";

export const useAutomation = () => {
  const [automations, setAutomations] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    automation: null,
    workflow: null,
    sms: null,
    email: null,
  });

  // Fetch automations
  const fetchAutomations = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await automationAPI.getAutomations(params);
      setAutomations(response.automations || []);
      return response;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch automations');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch workflows
  const fetchWorkflows = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await workflowAPI.getWorkflows(params);
      setWorkflows(response.workflows || []);
      return response;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to fetch workflows');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all stats
  const fetchStats = useCallback(async () => {
    try {
      const [automationStats, workflowStats, smsStats, emailStats] = await Promise.all([
        automationAPI.getAutomationStats(),
        workflowAPI.getWorkflowStats(),
        smsAPI.getSMSStats(),
        emailAPI.getEmailStats(),
      ]);

      setStats({
        automation: automationStats,
        workflow: workflowStats,
        sms: smsStats,
        email: emailStats,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  }, []);

  // Create automation
  const createAutomation = useCallback(async (automationData) => {
    try {
      setLoading(true);
      const response = await automationAPI.createAutomation(automationData);
      toast.success('Automation created successfully!');
      await fetchAutomations();
      return response;
    } catch (err) {
      toast.error('Failed to create automation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAutomations]);

  // Update automation
  const updateAutomation = useCallback(async (automationId, data) => {
    try {
      setLoading(true);
      const response = await automationAPI.updateAutomation(automationId, data);
      toast.success('Automation updated successfully!');
      await fetchAutomations();
      return response;
    } catch (err) {
      toast.error('Failed to update automation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAutomations]);

  // Delete automation
  const deleteAutomation = useCallback(async (automationId) => {
    try {
      setLoading(true);
      await automationAPI.deleteAutomation(automationId);
      toast.success('Automation deleted successfully!');
      await fetchAutomations();
    } catch (err) {
      toast.error('Failed to delete automation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAutomations]);

  // Trigger automation
  const triggerAutomation = useCallback(async (automationId, triggerData = {}) => {
    try {
      setLoading(true);
      const response = await automationAPI.triggerAutomation(automationId, triggerData);
      toast.success('Automation triggered successfully!');
      await fetchAutomations();
      return response;
    } catch (err) {
      toast.error('Failed to trigger automation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAutomations]);

  // Toggle automation
  const toggleAutomation = useCallback(async (automationId, isActive) => {
    try {
      setLoading(true);
      await automationAPI.toggleAutomation(automationId, !isActive);
      toast.success(`Automation ${!isActive ? 'activated' : 'paused'}`);
      await fetchAutomations();
    } catch (err) {
      toast.error('Failed to toggle automation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAutomations]);

  // Create workflow
  const createWorkflow = useCallback(async (workflowData) => {
    try {
      setLoading(true);
      const response = await workflowAPI.createWorkflow(workflowData);
      toast.success('Workflow created successfully!');
      await fetchWorkflows();
      return response;
    } catch (err) {
      toast.error('Failed to create workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  // Execute workflow
  const executeWorkflow = useCallback(async (workflowId, inputData = {}) => {
    try {
      setLoading(true);
      const response = await workflowAPI.executeWorkflow(workflowId, inputData);
      toast.success('Workflow executed successfully!');
      await fetchWorkflows();
      return response;
    } catch (err) {
      toast.error('Failed to execute workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  // Toggle workflow
  const toggleWorkflow = useCallback(async (workflowId, isActive) => {
    try {
      setLoading(true);
      await workflowAPI.toggleWorkflow(workflowId, !isActive);
      toast.success(`Workflow ${!isActive ? 'activated' : 'paused'}`);
      await fetchWorkflows();
    } catch (err) {
      toast.error('Failed to toggle workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  // Delete workflow
  const deleteWorkflow = useCallback(async (workflowId) => {
    try {
      setLoading(true);
      await workflowAPI.deleteWorkflow(workflowId);
      toast.success('Workflow deleted successfully!');
      await fetchWorkflows();
    } catch (err) {
      toast.error('Failed to delete workflow');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWorkflows]);

  return {
    // State
    automations,
    workflows,
    loading,
    error,
    stats,

    // Automation methods
    fetchAutomations,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    triggerAutomation,
    toggleAutomation,

    // Workflow methods
    fetchWorkflows,
    createWorkflow,
    executeWorkflow,
    toggleWorkflow,
    deleteWorkflow,

    // Stats
    fetchStats,
  };
};

export default useAutomation;