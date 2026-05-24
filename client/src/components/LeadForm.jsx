import { useState } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';

export default function LeadForm({ lead, onSubmit, onClose }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    source: lead?.source || '',
    status: lead?.status || 'New',
    notes: lead?.notes || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <label className="label">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="label">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="john@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="label">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Company Name"
            />
            {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
          </div>

          <div>
            <label className="label">Source</label>
            <input
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="input-field"
              placeholder="Website, LinkedIn, Referral..."
            />
            {errors.source && <p className="text-red-600 text-sm mt-1">{errors.source}</p>}
          </div>

          <div>
            <label className="label">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Rejected">Rejected</option>
            </select>
            {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input-field"
              placeholder="Add any notes about this lead..."
              rows="3"
            />
            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading && <FiLoader className="animate-spin" />}
            {loading ? 'Saving...' : (lead ? 'Update' : 'Add')} Lead
          </button>
        </div>
      </div>
    </div>
  );
}
