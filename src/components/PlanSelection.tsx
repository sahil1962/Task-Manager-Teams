// PlanSelection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PlanSelectionProps {
  plans: any[];
  onSelectPlan: (planId: string) => void;
}

export default function PlanSelection({ plans, onSelectPlan }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    onSelectPlan(selectedPlan);
    navigate("/dashboard");
  };
  
  if (plans.length === 0) {
    return <div className="loading">No plans found. Create a plan in Microsoft Planner first.</div>;
  }
  
  return (
    <div className="plan-selection">
      <h2>Select a Plan</h2>
      
      {plans.length === 0 ? (
        <div className="no-plans">
          <p>No plans found in your Microsoft 365 groups.</p>
          <p>To get started:</p>
          <ol>
            <li>Create a Microsoft 365 team in Teams</li>
            <li>Add a Planner tab to the team</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      ) : (
        <>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
          >
            <option value="">Select a plan</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.title}
                {/* {plan.title} - {plan.container?.name || 'Unknown Group'} */}
              </option>
            ))}
          </select>
          <button onClick={handleContinue}>Continue</button>
        </>
      )}
    </div>
  );
} 