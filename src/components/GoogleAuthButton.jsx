import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const GoogleAuthButton = ({ onError }) => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/google`, {
        credential: credentialResponse.credential,
      });
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user || {}));
      }
      navigate('/islands');
    } catch (err) {
      onError && onError(err.response?.data?.error || 'Google sign-in failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError && onError('Google sign-in failed')}
        theme="filled_black"
        shape="pill"
        text="continue_with"
      />
    </div>
  );
};

export default GoogleAuthButton;
