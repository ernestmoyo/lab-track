import { useState, useEffect } from 'react';
import api from '../services/api';

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getDashboardStats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
        Failed to load dashboard: {error}
      </div>
    );
  }

  if (!stats) {
    return <div className="text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Samples" value={stats.totalSamples} color="text-primary-700" />
        <StatCard label="In Testing" value={stats.samples?.in_testing || 0} color="text-yellow-600" />
        <StatCard label="Completed" value={stats.samples?.completed || 0} color="text-green-600" />
        <StatCard label="Total Tests" value={stats.totalTests} color="text-indigo-700" />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Samples</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentSamples?.map((sample) => (
                <tr key={sample.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {sample.sample_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sample.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={sample.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <PriorityBadge priority={sample.priority} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    registered: 'bg-blue-100 text-blue-800',
    in_testing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    disposed: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const colors = {
    low: 'bg-gray-100 text-gray-600',
    normal: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[priority] || 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
}
