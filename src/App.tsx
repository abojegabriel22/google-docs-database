import React, { useState } from 'react';
import './App.css';

//Replace this string with your deployed Web App URL from Step 1
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby0kyb88UeXoyiVclTsUIvI6H3Ls-sYW1Y1RV7pH-Xua0lI3nNL0qIxe-6ZhoaYkIRGmg/exec';

interface FormData {
  title: string;
  fullName: string;
  email: string;
  phone: string;
  sex: string;
  ageBracket: string;
  location: string;
  organization: string;
  expectations: string;
}

const initialFormData: FormData = {
  title: 'Mr',
  fullName: '',
  email: '',
  phone: '',
  sex: 'Male',
  ageBracket: '18-25',
  location: '',
  organization: '',
  expectations: '',
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      // Send as POST request with text/plain content-type to bypass CORS preflight
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setStatusMessage({ type: 'success', text: 'Thank you for registering! Your response has been recorded.' });
        setFormData(initialFormData);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'An error occurred while submitting the form.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="form-card">
        <div className="header-badge">Event Registration</div>
        <h1>A New Africa Unveiling</h1>
        <p className="subtitle">Join us in shaping the vision and future of the continent.</p>

        {statusMessage && (
          <div className={`status-alert ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="title">Title *</label>
              <select id="title" name="title" value={formData.title} onChange={handleChange} required>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
                <option value="Engr">Engr</option>
                <option value="Chief">Chief</option>
              </select>
            </div>

            <div className="form-group flex-3">
              <label htmlFor="fullName">Full Name (First Name to Last Name) *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="e.g. Gabriel Aboje"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="phone">Phone Number (WhatsApp preferred) *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="sex">Sex *</label>
              <select id="sex" name="sex" value={formData.sex} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="ageBracket">Age Bracket *</label>
              <select id="ageBracket" name="ageBracket" value={formData.ageBracket} onChange={handleChange} required>
                <option value="18-25">18–25</option>
                <option value="25-35">25–35</option>
                <option value="35-50">35–50</option>
                <option value="50-70">50–70</option>
                <option value="70+">70+</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="location">City / Country *</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Abuja, Nigeria"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="organization">Organization / Occupation</label>
              <input
                type="text"
                id="organization"
                name="organization"
                placeholder="Company, University, or Independent"
                value={formData.organization}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="expectations">What are your key expectations for this event?</label>
            <textarea
              id="expectations"
              name="expectations"
              rows={3}
              placeholder="Share what you hope to learn, experience, or contribute..."
              value={formData.expectations}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting Registration...' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}