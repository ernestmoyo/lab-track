import { useState, useEffect } from 'react';
import api from '../services/api';

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getTests()
      .then(setTests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-gray-500">Loading tests...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sample</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-primary-700">
                    {test.sample_code} ({test.sample_type})
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{test.test_type}</td>
                  <td className="px-6 py-4 text-sm">
                    <StatusBadge status={test.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {test.started_at ? new Date(test.started_at).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {test.completed_at ? new Date(test.completed_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
              {tests.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No tests found. Create a test from the Samples page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}
