import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail 
} from 'firebase/auth';

// Your active Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFd-gY04hLGtbrgZ-uhF8i_HztSxrEwd8",
  authDomain: "lms-auth-6ae40.firebaseapp.com",
  projectId: "lms-auth-6ae40",
  storageBucket: "lms-auth-6ae40.firebasestorage.app",
  messagingSenderId: "216256261012",
  appId: "1:216256261012:web:cd2fc8a2d5997b7bf2fd81",
  measurementId: "G-XZ92XW3BN7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleStandardAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Admin fallback
    if (credentials.username === 'admin' && credentials.password === 'library2026') {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });
        if (response.ok) {
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/');
        } else {
          setError('Invalid admin credentials');
        }
      } catch (err) {
        setError('Ensure backend server is running');
      }
      return;
    }

    // Firebase Email/Password Auth for standard users
    try {
      let result;
      if (isRegistering) {
        result = await createUserWithEmailAndPassword(auth, credentials.username, credentials.password);
      } else {
        result = await signInWithEmailAndPassword(auth, credentials.username, credentials.password);
      }
      
      const token = await result.user.getIdToken();
      
      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        setError('Backend verification failed');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.username || !credentials.username.includes('@')) {
      setError('Please enter a valid email address in the Username field first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, credentials.username);
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      
      const response = await fetch('/api/auth/social', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.ok) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/');
      } else {
        setError('Social login verification failed on backend');
      }
    } catch (err) {
      setError(`Social login failed: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
      <div className="card form-card" style={{ width: '400px', padding: '30px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Library Login</h2>
        
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center', marginBottom: '15px', fontSize: '14px' }}>{message}</p>}
        
        <form onSubmit={handleStandardAuth} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email / Username</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px' }} 
              onChange={e => setCredentials({...credentials, username: e.target.value})} 
              required 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px' }} 
              onChange={e => setCredentials({...credentials, password: e.target.value})} 
              required 
            />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: isRegistering ? '#10B981' : '#3B82F6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}>
            {isRegistering ? 'Register New Account' : 'Login'}
          </button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '20px' }}>
          <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: '#3B82F6', cursor: 'pointer', padding: 0 }}>
            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
          {!isRegistering && (
            <button onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#6B7280', cursor: 'pointer', padding: 0 }}>
              Forgot Password?
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
          <span style={{ padding: '0 10px', color: '#6B7280', fontSize: '14px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => handleSocialLogin(new GoogleAuthProvider())} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#ffffff', border: '1px solid #D1D5DB', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px' }} />
            Continue with Google
          </button>
          <button onClick={() => handleSocialLogin(new GithubAuthProvider())} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#24292F', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
            <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" style={{ width: '20px', filter: 'invert(1)' }} />
            Continue with GitHub
          </button>
          <button onClick={() => handleSocialLogin(new FacebookAuthProvider())} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#1877F2', color: 'white', border: 'none', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontWeight: '500' }}>
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" style={{ width: '20px' }} />
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}