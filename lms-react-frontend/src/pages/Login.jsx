import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/'); // Redirect to dashboard
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Ensure backend server is running');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
      <div className="card form-card" style={{ width: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Library Admin Login</h2>
        {error && <p className="red-text" style={{ textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" onChange={e => setCredentials({...credentials, username: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" onChange={e => setCredentials({...credentials, password: e.target.value})} required />
          </div>
          <button type="submit" className="btn btn-primary full-width">Login</button>
        </form>
      </div>
    </div>
  );
}
