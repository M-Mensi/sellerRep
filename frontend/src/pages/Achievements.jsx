import { useState } from "react";
import { submitAchievement } from "../api/achievements.api";
import "./Achievements.css";

export default function Achievements() {
  const [form, setForm] = useState({
    achievement_date: "",
    title: "",
    description: "",
    category: "",
    impact: "",
  });

  const submit = async () => {
    await submitAchievement(form);
    alert("Achievement saved!");
  };

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2>Achievements</h2>
      </div>
      <div className="achievement-form">
        <h3>Log New Achievement</h3>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="achievement_date">Date</label>
              <input
                id="achievement_date"
                type="date"
                value={form.achievement_date || ""}
                onChange={(e) =>
                  setForm({ ...form, achievement_date: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Achievement title"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                type="text"
                placeholder="e.g., Sales, Project, Team"
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="impact">Impact</label>
              <input
                id="impact"
                type="text"
                placeholder="e.g., High, Medium, Low"
                value={form.impact || ""}
                onChange={(e) => setForm({ ...form, impact: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe your achievement in detail"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <button className="submit-btn" onClick={submit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
