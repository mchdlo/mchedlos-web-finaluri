function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (errorEl) errorEl.textContent = message;
}

function clearError(fieldId) {
  showError(fieldId, '');
}

function validateName() {
  const value = document.getElementById('name').value.trim();
  if (!value) {
    showError('name', 'Name is required.');
    return false;
  }
  clearError('name');
  return true;
}

function validateEmail() {
  const value = document.getElementById('email').value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) {
    showError('email', 'Email is required.');
    return false;
  }
  if (!pattern.test(value)) {
    showError('email', 'Enter a valid email address.');
    return false;
  }
  clearError('email');
  return true;
}

function validateType() {
  const value = document.getElementById('type').value;
  if (!value) {
    showError('type', 'Please select a request type.');
    return false;
  }
  clearError('type');
  return true;
}

function validateMessage() {
  const value = document.getElementById('message').value.trim();
  if (!value) {
    showError('message', 'Message is required.');
    return false;
  }
  if (value.length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    return false;
  }
  clearError('message');
  return true;
}

function setFeedback(message, isError) {
  const feedback = document.getElementById('form-feedback');
  feedback.textContent = message;
  feedback.style.color = isError ? 'var(--color-accent)' : 'var(--color-text)';
}

function clearForm() {
  document.getElementById('contact-form').reset();
}

async function submitToNetlify(form) {
  const formData = new FormData(form);
  const body = new URLSearchParams(formData).toString();

  return fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
}

async function handleSubmit(e) {
  e.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isTypeValid = validateType();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isTypeValid || !isMessageValid) {
    setFeedback('Please fix the errors above.', true);
    return;
  }

  const form = document.getElementById('contact-form');

  setFeedback('Message sent — thanks for reaching out!', false);
  clearForm();
}

function setupRealtimeValidation() {
  const debouncedName = debounce(validateName, 400);
  const debouncedEmail = debounce(validateEmail, 400);
  const debouncedMessage = debounce(validateMessage, 400);

  document.getElementById('name').addEventListener('input', debouncedName);
  document.getElementById('email').addEventListener('input', debouncedEmail);
  document.getElementById('message').addEventListener('input', debouncedMessage);
  document.getElementById('type').addEventListener('change', validateType);
}

function init() {
  document.getElementById('contact-form').addEventListener('submit', handleSubmit);
  setupRealtimeValidation();
}

document.addEventListener('DOMContentLoaded', init);