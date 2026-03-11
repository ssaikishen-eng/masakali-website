import React, { useState } from 'react';
import axios from 'axios';
import './CateringForm.css';

const CateringForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guests: '',
    eventType: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      eventDate: form.eventDate,
      eventType: form.eventType,
      guests: Number(form.guests),
      notes: form.message,
    };

    try {
      const apiBase = import.meta.env.DEV ? 'http://localhost:4000' : 'https://masakali-website.vercel.app';
      await axios.post(`${apiBase}/api/catering`, payload)
        .then(() => setSubmitted(true))
        .catch((err) => {
          console.error(err);
          const msg = (err.response && err.response.data && err.response.data.error) || err.message || 'Submission failed';
          setError(msg);
        })
        .finally(() => setSubmitting(false));
    } catch (err) {
      setError(err.message || 'Submission failed');
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="reservation-success">
        <h3>Thank you! Your catering inquiry has been received.</h3>
        <p>We sent a confirmation to {form.email}. If you have any questions, please call 408-857-6274.</p>
      </div>
    );
  }

  return (
    <div className="catering-form-outer catering-form-bg">
      <h2 className="reservation-form-title">Catering Inquiry</h2>
      <div className="reservation-form-notes">
        <ul>
          <li>For large events (50+ guests), please call us directly to discuss special arrangements and menu options.</li>
          <li>Custom menus and dietary accommodations available upon request.</li>
          <li>Your catering inquiry will be reviewed by our team. We will contact you to confirm details and availability.</li>
          <li>If you have any food allergies or special requests, please mention them below.</li>
        </ul>
      </div>
      <form className="reservation-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="form-row-container">
          <div className="form-input-group">
            <label className="input-label" htmlFor="catering-name">Full Name</label>
            <input className="text-input-field" type="text" name="name" id="catering-name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-input-group">
            <label className="input-label" htmlFor="catering-phone">Phone Number</label>
            <input className="text-input-field" type="tel" name="phone" id="catering-phone" value={form.phone} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-input-group">
          <label className="input-label" htmlFor="catering-email">Email Address</label>
          <input className="text-input-field" type="email" name="email" id="catering-email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-row-container">
          <div className="form-input-group">
            <label className="input-label" htmlFor="event-date">Event Date</label>
            <input className="date-input-field" type="date" name="eventDate" id="event-date" value={form.eventDate} onChange={handleChange} required />
          </div>
          <div className="form-input-group">
            <label className="input-label" htmlFor="catering-guests">Number of Guests</label>
            <input className="text-input-field" type="number" name="guests" id="catering-guests" min="1" max="200" value={form.guests} onChange={handleChange} required />
          </div>
          <div className="form-input-group">
            <label className="input-label" htmlFor="event-type">Event Type</label>
            <input className="text-input-field" type="text" name="eventType" id="event-type" value={form.eventType} onChange={handleChange} placeholder="e.g., Wedding, Corporate" />
          </div>
        </div>
        <div className="form-input-group">
          <label className="input-label" htmlFor="catering-message">Details / Requests</label>
          <textarea className="textarea-field" name="message" id="catering-message" value={form.message} onChange={handleChange} />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="reservation-submit-btn" disabled={submitting}><span>{submitting ? 'Sending…' : 'Send Inquiry'}</span></button>
      </form>
    </div>
  );
};

export default CateringForm;
