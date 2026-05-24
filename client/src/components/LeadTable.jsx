import { FiEdit2, FiTrash2, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

export default function LeadTable({ leads, onEdit, onDelete, onStatusChange }) {
  const [expandedId, setExpandedId] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Converted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Email</th>
              <th className="hidden md:table-cell">Phone</th>
              <th className="hidden lg:table-cell">Company</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="font-semibold">{lead.name}</td>
                <td className="hidden sm:table-cell text-sm">{lead.email}</td>
                <td className="hidden md:table-cell text-sm">{lead.phone || '-'}</td>
                <td className="hidden lg:table-cell text-sm">{lead.company || '-'}</td>
                <td>
                  <select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead.id, e.target.value)}
                    className={`badge px-3 py-1 rounded cursor-pointer font-medium ${getStatusColor(lead.status)}`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(lead)}
                      className="btn-secondary btn-small"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(lead.id)}
                      className="btn-danger btn-small"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
