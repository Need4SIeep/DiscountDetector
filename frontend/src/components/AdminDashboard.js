import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getUsers();
        setUsers(response.data.users || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.isAdmin]);

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await authAPI.updateUserRole(userId, !currentStatus);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isAdmin: !currentStatus } : u
      ));

      setSuccessMessage('User role updated! ✓');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user role');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="admin-restricted">
        <p>⛔ Admin access only</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>👑 Admin Dashboard - User Management</h2>
        <p className="admin-subtitle">Enable or disable admin rights for users</p>
      </div>

      {error && (
        <div className="admin-error">
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-btn">✕</button>
        </div>
      )}

      {successMessage && (
        <div className="admin-success">
          {successMessage}
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="admin-empty">No users found</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Admin Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={u.isAdmin ? 'admin-user' : ''}>
                  <td className="user-id">#{u.id}</td>
                  <td className="username">{u.username}</td>
                  <td className="admin-status">
                    <span className={`badge ${u.isAdmin ? 'badge-admin' : 'badge-user'}`}>
                      {u.isAdmin ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="created-date">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="action-cell">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={u.isAdmin}
                        onChange={() => handleToggleAdmin(u.id, u.isAdmin)}
                        disabled={u.id === user.id}
                        title={u.id === user.id ? "Can't change your own role" : 'Toggle admin status'}
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-footer">
        <p className="footer-info">
          ℹ️ Toggle the switch to grant or revoke admin privileges. You cannot modify your own role.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
