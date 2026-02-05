import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/samples', label: 'Samples' },
  { path: '/tests', label: 'Tests' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-primary-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold">LabTrack</Link>
              <div className="hidden md:flex space-x-4">
                {navItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? 'bg-primary-800 text-white'
                        : 'text-primary-100 hover:bg-primary-600'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-primary-200">
                {user?.fullName || user?.full_name}
              </span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm bg-primary-800 hover:bg-primary-900 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
