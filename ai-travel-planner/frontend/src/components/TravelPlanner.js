import React, { useState } from 'react';

const TravelPlanner = ({ onPlanCreated }) => {
  const [formData, setFormData] = useState({
    budget: '',
    travelers: 1,
    destinations: '',
    start_date: '',
    end_date: '',
    preferences: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.budget || formData.budget <= 0) {
      setError('Please enter a valid budget');
      return;
    }

    if (!formData.destinations.trim()) {
      setError('Please enter destinations you want to visit');
      return;
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      const planData = {
        budget: parseFloat(formData.budget),
        travelers: parseInt(formData.travelers),
        destinations: formData.destinations,
        start_date: formData.start_date,
        end_date: formData.end_date,
        preferences: formData.preferences,
        notes: formData.notes
      };

      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        const newPlan = await response.json();
        setSuccess('🎉 AI Travel plan generated successfully!');
        onPlanCreated(newPlan);
        
        // Reset form
        setFormData({
          budget: '',
          travelers: 1,
          destinations: '',
          start_date: '',
          end_date: '',
          preferences: '',
          notes: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate travel plan');
      }
    } catch (error) {
      setError('Error generating travel plan. Please check if backend is running.');
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-planner">
      <div className="card">
        <h2 style={{
          textAlign: 'center',
          color: '#2c3e50',
          fontSize: '2rem',
          marginBottom: '20px'
        }}>
          🎯 Tell Us About Your Dream Trip
        </h2>
        <p style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#7f8c8d',
          fontSize: '1.1rem'
        }}>
          Our AI will create a personalized travel plan just for you!
        </p>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="budget">💰 Budget (USD):</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              min="1"
              step="0.01"
              placeholder="e.g., 2000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="destinations">🌍 Destinations (comma-separated):</label>
            <input
              type="text"
              id="destinations"
              name="destinations"
              value={formData.destinations}
              onChange={handleInputChange}
              placeholder="e.g., Paris, Tokyo, New York"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="travelers">👥 Number of Travelers:</label>
            <select
              id="travelers"
              name="travelers"
              value={formData.travelers}
              onChange={handleInputChange}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="start_date">🗓️ Start Date (Optional):</label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="end_date">🏁 End Date (Optional):</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferences">🎯 Travel Preferences:</label>
            <textarea
              id="preferences"
              name="preferences"
              value={formData.preferences}
              onChange={handleInputChange}
              placeholder="e.g., Adventure activities, Cultural sites, Food tours, Relaxation, Shopping, etc."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">📝 Additional Notes (Optional):</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '20px',
              fontSize: '18px',
              padding: '15px'
            }}
          >
            {loading ? '🤖 AI is creating your amazing plan...' : '🚀 Generate AI Travel Plan'}
          </button>
        </form>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#667eea', marginBottom: '15px' }}>🤖 AI Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>📋 Detailed Itinerary</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>Day-by-day activity plans</p>
            </div>
            <div>
              <strong>💰 Budget Breakdown</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>Cost analysis for all expenses</p>
            </div>
            <div>
              <strong>🏨 Accommodation Tips</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>Hotel recommendations</p>
            </div>
            <div>
              <strong>🍜 Local Cuisine</strong>
              <p style={{ fontSize: '0.9rem', color: '#666', margin: '5px 0' }}>Food recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanner;
