import data from './site_data.json' assert { type: 'json' };

function validate(fields) {
  // Simple phone/email validation
  if (!(fields.name && fields.phone && fields.email)) return false;
  if (!(new RegExp('^([A-Za-z\\s]{2,})$').test(fields.name.trim()))) return false;
  if (!(new RegExp('^[\\d\\-\$\$\\s]{7,}$').test(fields.phone.trim()))) return false;
  if (!(new RegExp('^\\S+@\\S+\\.\\S+$').test(fields.email.trim()))) return false;
  return true;
}

function handleBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  form.onsubmit = function(e) {
    e.preventDefault();
    const fields = {};
    Array.from(form.elements).forEach(f => {
      if (f.name) fields[f.name] = f.value;
      if (f.id) fields[f.id] = f.value;
    });
    const out = document.getElementById('booking-status');
    if (!validate(fields)) {
      out.innerHTML = '<span class="text-red-600 font-bold">Please fill all fields with valid info.</span>';
      return;
    }
    out.innerHTML = '<span class="text-blue-500">Submitting...</span>';
    setTimeout(() => {
      out.innerHTML = '<span class="text-green-600 font-bold">Thank you! We received your request and will reach out soon.</span>';
      form.reset();
    }, 700);
  };
}

window.addEventListener('DOMContentLoaded', handleBookingForm);
