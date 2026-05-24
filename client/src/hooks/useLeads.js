import { useState, useEffect, useCallback } from 'react';
import { leadService, dashboardService } from '../services/api.js';
import { toast } from '../utils/helpers.js';

export function useLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const response = await leadService.getAllLeads(filters);
      setLeads(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast('Failed to fetch leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const addLead = async (leadData) => {
    try {
      const response = await leadService.createLead(leadData);
      setLeads([response.data.lead, ...leads]);
      toast('Lead created successfully', 'success');
      return response.data.lead;
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to create lead', 'error');
      throw err;
    }
  };

  const updateLead = async (id, leadData) => {
    try {
      const response = await leadService.updateLead(id, leadData);
      setLeads(leads.map(l => l.id === id ? response.data.lead : l));
      toast('Lead updated successfully', 'success');
      return response.data.lead;
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update lead', 'error');
      throw err;
    }
  };

  const updateLeadStatus = async (id, status) => {
    try {
      const response = await leadService.updateLeadStatus(id, status);
      setLeads(leads.map(l => l.id === id ? response.data.lead : l));
      toast(`Lead status updated to ${status}`, 'success');
      return response.data.lead;
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to update status', 'error');
      throw err;
    }
  };

  const deleteLead = async (id) => {
    try {
      await leadService.deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
      toast('Lead deleted successfully', 'success');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to delete lead', 'error');
      throw err;
    }
  };

  return {
    leads,
    loading,
    error,
    filters,
    setFilters,
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    refreshLeads: fetchLeads
  };
}

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
}
