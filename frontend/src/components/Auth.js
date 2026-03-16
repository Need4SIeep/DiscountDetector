import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Auth() {
  const { login, register, isLoggedIn, user, logout, loginAsGuest, isGuest } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const result = await register(username, password);
        if (!result.success) {
          setError(result.error);
        }
      } else {
        const result = await login(username, password);
        if (!result.success) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="auth-logged-in">
        <div className="user-info">
          {isGuest ? (
            <>
              <p>👤 <strong>Guest Mode</strong> - Limited features</p>
              <button onClick={logout} className="logout-btn">Exit Guest Mode</button>
            </>
          ) : (
            <>
              <p>Logged in as: <strong>{user.username}</strong></p>
              {user.isAdmin && <span className="admin-badge">👑 Admin</span>}
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isRegistering ? '📝 Create Account' : '🔐 Login'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
              minLength="6"
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                disabled={loading}
                minLength="6"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? '⏳ Processing...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button 
          type="button"
          onClick={loginAsGuest}
          className="guest-btn"
        >
          👤 Continue as Guest
        </button>

        <p className="toggle-auth">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="link-btn"
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Auth;
