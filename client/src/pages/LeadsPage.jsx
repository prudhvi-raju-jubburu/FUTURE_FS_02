import { useState } from 'react';
import { useLeads } from '../hooks/useLeads.js';
import MainLayout from '../layouts/MainLayout.jsx';
import LeadForm from '../components/LeadForm.jsx';
import LeadTable from '../components/LeadTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { exportToCSV, toast } from '../utils/helpers.js';
import { FiPlus, FiDownload } from 'react-icons/fi';

export default function LeadsPage() {
  const { leads, loading, filters, setFilters, addLead, updateLead, updateLeadStatus, deleteLead } = useLeads();
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleAddLead = async (formData) => {
    await addLead(formData);
    setShowForm(false);
  };

  const handleEditLead = async (formData) => {
    await updateLead(editingLead.id, formData);
    setEditingLead(null);
  };

  const handleDeleteLead = async () => {
    if (deletingLeadId) {
      await deleteLead(deletingLeadId);
      setDeletingLeadId(null);
    }
  };

  const handleUpdateStatus = async (leadId, newStatus) => {
    await updateLeadStatus(leadId, newStatus);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value });
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setFilters({ ...filters, status: value });
  };

  const handleExport = () => {
    exportToCSV(leads);
    toast('Leads exported to CSV', 'success');
  };

  if (loading && leads.length === 0) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leads...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Leads</h1>
            <p className="text-gray-600 mt-1">Manage and track your client leads</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={leads.length === 0}
              className="btn-secondary flex items-center gap-2"
            >
              <FiDownload size={18} />
              Export
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FiPlus size={18} />
              Add Lead
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field"
            />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Lead Table or Empty State */}
        {leads.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">No leads found</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Your First Lead
            </button>
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onEdit={setEditingLead}
            onDelete={setDeletingLeadId}
            onStatusChange={handleUpdateStatus}
          />
        )}
      </div>

      {/* Lead Form Modal */}
      {(showForm || editingLead) && (
        <LeadForm
          lead={editingLead}
          onSubmit={editingLead ? handleEditLead : handleAddLead}
          onClose={() => {
            setShowForm(false);
            setEditingLead(null);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deletingLeadId && (
        <ConfirmDialog
          title="Delete Lead"
          message="Are you sure you want to delete this lead? This action cannot be undone."
          onConfirm={handleDeleteLead}
          onCancel={() => setDeletingLeadId(null)}
          confirmText="Delete"
          isDanger={true}
        />
      )}
    </MainLayout>
  );
}
