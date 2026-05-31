import React, { useState } from 'react';

const PlansList = ({ plans, onDeletePlan }) => {
  const [expandedPlan, setExpandedPlan] = useState(null);

  const togglePlanDetails = (planId) => {
    setExpandedPlan(expandedPlan === planId ? null : planId);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (plans.length === 0) {
    return (
      <div className="plans-list">
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <h2 style={{ color: '#667eea', marginBottom: '20px' }}>📋 No Travel Plans Yet</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '30px' }}>
            Create your first AI-powered travel plan to get started!
          </p>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✈️</div>
          <p style={{ color: '#999' }}>
            Click on "Plan Trip" to create your first amazing travel plan with AI assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="plans-list">
      <h2 style={{ 
        textAlign: 'center', 
        color: 'white', 
        marginBottom: '30px',
        fontSize: '2rem',
        textShadow: '0 4px 8px rgba(0,0,0,0.3)'
      }}>
        📋 Your Travel Plans ({plans.length})
      </h2>

      <div className="grid">
        {plans.map(plan => (
          <div key={plan.id} className="card plan-card">
            <div className="plan-header">
              <div style={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)', 
                color: 'white', 
                padding: '10px 15px', 
                borderRadius: '8px', 
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 'bold' }}>🤖 AI Generated Plan</span>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {formatDate(plan.created_at)}
                </span>
              </div>
              
              <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>
                📍 {plan.ai_plan.destination.name}
              </h3>
            </div>

            <div className="plan-summary">
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>💰 Budget:</strong>
                  <span>${plan.user_input.budget}</span>
                </div>
                <div className="summary-item">
                  <strong>👥 Travelers:</strong>
                  <span>{plan.user_input.travelers}</span>
                </div>
                <div className="summary-item">
                  <strong>🌍 Destinations:</strong>
                  <span>{plan.user_input.destinations}</span>
                </div>
                <div className="summary-item">
                  <strong>💵 Estimated Cost:</strong>
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                    ${plan.ai_plan.total_estimated_cost}
                  </span>
                </div>
              </div>

              {plan.user_input.start_date && plan.user_input.end_date && (
                <div className="date-range">
                  <strong>📅 Travel Dates:</strong>
                  <span>{formatDate(plan.user_input.start_date)} to {formatDate(plan.user_input.end_date)}</span>
                </div>
              )}
            </div>

            <div className="plan-actions">
              <button 
                className="btn"
                onClick={() => togglePlanDetails(plan.id)}
                style={{ 
                  marginRight: '10px',
                  background: expandedPlan === plan.id 
                    ? 'linear-gradient(45deg, #28a745, #20c997)' 
                    : 'linear-gradient(45deg, #667eea, #764ba2)'
                }}
              >
                {expandedPlan === plan.id ? '📖 Hide Details' : '👁️ View Details'}
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => onDeletePlan(plan.id)}
              >
                🗑️ Delete
              </button>
            </div>

            {expandedPlan === plan.id && (
              <div className="plan-details">
                <div className="details-section">
                  <h4>📋 Itinerary</h4>
                  {plan.ai_plan.itinerary && plan.ai_plan.itinerary.length > 0 ? (
                    <div className="itinerary-list">
                      {plan.ai_plan.itinerary.map((day, index) => (
                        <div key={index} className="itinerary-day">
                          <h5>Day {day.day}: {day.title}</h5>
                          <ul>
                            {day.activities.map((activity, actIndex) => (
                              <li key={actIndex}>{activity}</li>
                            ))}
                          </ul>
                          <p><strong>Estimated Cost:</strong> ${day.estimated_cost}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Detailed itinerary available in AI response.</p>
                  )}
                </div>

                {plan.ai_plan.budget_breakdown && (
                  <div className="details-section">
                    <h4>💰 Budget Breakdown</h4>
                    <div className="budget-breakdown">
                      {Object.entries(plan.ai_plan.budget_breakdown).map(([category, amount]) => (
                        <div key={category} className="budget-item">
                          <span style={{ textTransform: 'capitalize' }}>{category}:</span>
                          <span>${amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan.ai_plan.tips && (
                  <div className="details-section">
                    <h4>💡 Travel Tips</h4>
                    <ul className="tips-list">
                      {plan.ai_plan.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {plan.ai_plan.local_cuisine && (
                  <div className="details-section">
                    <h4>🍜 Local Cuisine</h4>
                    <div className="cuisine-list">
                      {plan.ai_plan.local_cuisine.map((food, index) => (
                        <span key={index} className="cuisine-tag">{food}</span>
                      ))}
                    </div>
                  </div>
                )}

                {plan.ai_plan.ai_response && (
                  <div className="details-section">
                    <h4>🤖 AI Response</h4>
                    <div className="ai-response">
                      <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                        {plan.ai_plan.ai_response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .plan-card {
          transition: all 0.3s ease;
        }

        .plan-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 15px 0;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .date-range {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #e3f2fd;
          border-radius: 8px;
          margin-top: 15px;
        }

        .plan-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .plan-details {
          margin-top: 25px;
          padding-top: 25px;
          border-top: 2px solid #e9ecef;
        }

        .details-section {
          margin-bottom: 25px;
        }

        .details-section h4 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 1.2rem;
        }

        .itinerary-day {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 15px;
        }

        .itinerary-day h5 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .itinerary-day ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .budget-breakdown {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 10px;
        }

        .budget-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .tips-list {
          padding-left: 20px;
        }

        .tips-list li {
          margin-bottom: 8px;
        }

        .cuisine-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cuisine-tag {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .ai-response {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default PlansList;
