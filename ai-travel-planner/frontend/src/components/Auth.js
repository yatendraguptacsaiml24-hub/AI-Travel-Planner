import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const API_BASE = "https://ai-travel-planner-2-msg9.onrender.com";
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin
  ? `${API_BASE}/api/login`
  : `${API_BASE}/api/register`;
    const data = isLogin 
      ? { 
          email: formData.email, 
          mobile: formData.mobile, 
          password: formData.password 
        }
      : formData;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        onLogin(result.user);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      mobile: '',
      password: '',
      confirm_password: ''
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🤖 AI Travel Planner</h1>
        <p className="auth-subtitle">Plan your perfect trip with AI assistance</p>
        
        <div className="auth-toggle">
          <button 
            className={isLogin ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'toggle-btn active' : 'toggle-btn'}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">👤 Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">📧 Email (Optional for login):</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">📱 Mobile Number (Optional for login):</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter 10-digit mobile number"
              pattern="[0-9]{10}"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirm_password">🔒 Confirm Password:</label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}

          <button type="submit" className="btn auth-btn" disabled={loading}>
            {loading 
              ? (isLogin ? '🔄 Logging in...' : '🔄 Registering...') 
              : (isLogin ? '🚀 Login' : '🎯 Register')
            }
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button className="link-btn" onClick={toggleMode}>
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px;
          padding: 40px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          color: #333;
          text-align: center;
        }

        .auth-card h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }

        .auth-toggle {
          display: flex;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 30px;
        }

        .toggle-btn {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .toggle-btn.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .auth-form {
          text-align: left;
        }

        .auth-btn {
          width: 100%;
          margin-top: 20px;
        }

        .auth-footer {
          margin-top: 30px;
          text-align: center;
        }

        .link-btn {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          font-weight: bold;
          text-decoration: underline;
        }

        .link-btn:hover {
          color: #764ba2;
        }
      `}</style>
    </div>
  );
};

export default Auth;
