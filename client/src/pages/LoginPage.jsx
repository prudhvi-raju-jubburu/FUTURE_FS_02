import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from '../utils/helpers.js';
import { FiMail, FiLock, FiLoader } from 'react-icons/fi';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(email, password);
      toast('Login successful!', 'success');
      navigate('/');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast(error.response?.data?.message || 'Login failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mini CRM</h1>
            <p className="text-gray-600">Client Lead Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@crm.com"
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
              {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading && <FiLoader className="animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4">Demo Credentials:</p>
            <div className="bg-gray-50 rounded p-4 space-y-2 text-sm">
              <p><span className="font-semibold">Email:</span> admin@crm.com</p>
              <p><span className="font-semibold">Password:</span> admin123</p>
            </div> 
          </div> */}
        </div>
      </div>
    </div>
  );
}
