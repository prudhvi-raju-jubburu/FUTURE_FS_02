import { useNavigate } from 'react-router-dom';
import { useDashboardStats, useLeads } from '../hooks/useLeads.js';
import MainLayout from '../layouts/MainLayout.jsx';
import {
  FiTrendingUp,
  FiUser,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight
} from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color, trend }) {
  return (
    <div className="card hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-800">{value || 0}</p>
          {trend && <p className={`text-xs mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, loading } = useDashboardStats();
  const { leads } = useLeads();

  const recentLeads = leads.slice(0, 5);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your sales overview.</p>
          </div>
          <button
            onClick={() => navigate('/leads')}
            className="btn-primary mt-4 sm:mt-0 flex items-center gap-2"
          >
            Add New Lead <FiArrowRight size={18} />
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={FiTrendingUp}
            label="Total Leads"
            value={stats?.total}
            color="bg-blue-600"
          />
          <StatCard
            icon={FiUser}
            label="New Leads"
            value={stats?.new}
            color="bg-purple-600"
          />
          <StatCard
            icon={FiPhone}
            label="Contacted"
            value={stats?.contacted}
            color="bg-yellow-600"
          />
          <StatCard
            icon={FiCheckCircle}
            label="Converted"
            value={stats?.converted}
            color="bg-green-600"
          />
          <StatCard
            icon={FiXCircle}
            label="Rejected"
            value={stats?.rejected}
            color="bg-red-600"
          />
        </div>

        {/* Recent Leads */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Leads</h2>
            <button
              onClick={() => navigate('/leads')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-12">
              <FiUser size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No leads yet. Start by adding one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{lead.name}</p>
                    <p className="text-sm text-gray-600">{lead.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-gray-600">{lead.company}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {stats?.total > 0 ? ((stats?.converted / stats?.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Contact Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats?.total > 0 ? ((stats?.contacted / stats?.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Rejection Rate</p>
            <p className="text-2xl font-bold text-red-600">
              {stats?.total > 0 ? ((stats?.rejected / stats?.total) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
