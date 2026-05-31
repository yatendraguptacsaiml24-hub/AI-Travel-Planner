import React, { useState, useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import TravelPlanner from './components/TravelPlanner';
import PlansList from './components/PlansList';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('planner');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const API_BASE = "https://ai-travel-planner-2-msg9.onrender.com";

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/user`, {
        credentials: 'include'
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        fetchPlans();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/plans`, {
        credentials: 'include'
      });
      if (response.ok) {
        const plansData = await response.json();
        setPlans(plansData);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    fetchPlans();
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setPlans([]);
      setCurrentView('planner');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePlanCreated = (newPlan) => {
    setPlans([newPlan, ...plans]);
    setCurrentView('plans');
  };

  const handleDeletePlan = async (planId) => {
    try {
      const response = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setPlans(plans.filter(plan => plan.id !== planId));
      }
    } catch (error) {
      console.error('Failed to delete plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>🤖 AI Travel Planner</h1>
          <div className="user-info">
            <span>Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <nav className="navigation">
        <button 
          className={currentView === 'planner' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('planner')}
        >
          🎯 Plan Trip
        </button>
        <button 
          className={currentView === 'plans' ? 'nav-btn active' : 'nav-btn'}
          onClick={() => setCurrentView('plans')}
        >
          📋 My Plans ({plans.length})
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'planner' && (
          <TravelPlanner onPlanCreated={handlePlanCreated} />
        )}
        {currentView === 'plans' && (
          <PlansList plans={plans} onDeletePlan={handleDeletePlan} />
        )}
      </main>
    </div>
  );
}

export default App;
