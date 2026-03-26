import { useState } from "react";
import { submitClient } from "../api/clients.api";
import "./Clients.css";

export default function Clients() {
  const [form, setForm] = useState({
    client_name: "",
    contact_person: "",
    email: "",
    phone: "",
    industry: "",
    status: "active",
  });

  const submit = async () => {
    await submitClient(form);
    alert("Client saved!");
  };

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h2>Clients</h2>
      </div>
      <div className="client-form">
        <h3>Add New Client</h3>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client_name">Client Name</label>
              <input
                id="client_name"
                type="text"
                placeholder="Enter client name"
                value={form.client_name || ""}
                onChange={(e) =>
                  setForm({ ...form, client_name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact_person">Contact Person</label>
              <input
                id="contact_person"
                type="text"
                placeholder="Enter contact person name"
                value={form.contact_person || ""}
                onChange={(e) =>
                  setForm({ ...form, contact_person: e.target.value })
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={form.phone || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="industry">Industry</label>
              <input
                id="industry"
                type="text"
                placeholder="Enter industry"
                value={form.industry || ""}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={form.status || "active"}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <button className="submit-btn" onClick={submit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
