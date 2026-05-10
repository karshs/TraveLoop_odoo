import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (token) {
        try {
          // 1. Save token
          localStorage.setItem('token', token);

          // 2. Fetch user profile
          const res = await axios.get('http://localhost:5000/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });

          // 3. Update context
          setUser(res.data.data.user);

          // 4. Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Auth callback error:', error);
          navigate('/login?error=auth_failed');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#000', 
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Authenticating...</h2>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
