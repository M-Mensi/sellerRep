import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EmployeeDashboard.css";
import FormModal from "./FormModal";

// Sample forms data - can be replaced with API call
const AVAILABLE_FORMS = [
  {
    id: "daily-tracker",
    title: "Daily Tracker",
    description:
      "Track your daily activities, achievements, and performance metrics.",
    badges: ["Routine", "Daily"],
    link: "/daily-tracker",
  },
  {
    id: "achievement",
    title: "Achievements",
    description: "Submit your significant achievements and accomplishments.",
    badges: ["Achievement", "Recognition"],
  },
  {
    id: "leave-request",
    title: "Leave Request",
    description: "Request leave or time off with detailed information.",
    badges: ["HR", "Request"],
  },
  {
    id: "client-feedback",
    title: "Client Feedback",
    description: "Submit feedback from client interactions and meetings.",
    badges: ["Feedback", "Customer"],
  },
];

const BADGE_COLORS = {
  Routine: "technical",
  Daily: "technical",
  Achievement: "strategy",
  Recognition: "strategy",
  HR: "meeting",
  Request: "meeting",
  Feedback: "optimization",
  Customer: "optimization",
};

export default function EmployeeDashboard() {
  const [selectedForm, setSelectedForm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenForm = (form) => {
    setSelectedForm(form);

    // If form has a direct link, navigate to it
    if (form.link) {
      navigate(form.link);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedForm(null);
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Select a form to get started</p>
      </div>

      <div className="card-grid">
        {AVAILABLE_FORMS.map((form) => (
          <div
            key={form.id}
            className="guide-card"
            role="button"
            tabIndex="0"
            onClick={() => handleOpenForm(form)}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenForm(form);
              }
            }}
            aria-label={`Open form for ${form.title}`}
          >
            <div className="badges">
              {form.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className={`badge ${BADGE_COLORS[badge] || "default"}`}
                >
                  {badge}
                </span>
              ))}
            </div>
            <h3 className="card-title">{form.title}</h3>
            <p className="card-desc">{form.description}</p>
            <span className="guide-link">Open Form →</span>
          </div>
        ))}
      </div>

      {selectedForm && !selectedForm.link && (
        <FormModal
          form={selectedForm}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
