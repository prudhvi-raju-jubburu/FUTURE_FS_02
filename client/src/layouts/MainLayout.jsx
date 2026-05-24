import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  FiMenu,
  FiX,
  FiHome,
  FiUsers,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import { toast } from '../utils/helpers.js';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      toast('Logout failed', 'error');
    }
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: 'Dashboard', icon: FiHome, path: '/' },
    { name: 'Leads', icon: FiUsers, path: '/leads' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 w-64 h-screen bg-gray-900 text-white transition-transform duration-300 z-30`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <span className="bg-blue-600 px-3 py-1 rounded">CRM</span>
          </h1>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-blue-600'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-gray-800 transition text-red-400"
          >
            <FiLogOut size={20} />
            Logout
          </button>
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-600"
          >
            <FiMenu size={24} />
          </button>

          <div className="flex-1 lg:flex-none"></div>

          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="text-right">
                <p className="font-medium text-gray-800">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-600">Admin</p>
              </div>
              <FiChevronDown
                size={20}
                className={`transition ${userMenuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-40">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600 flex items-center gap-2"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
