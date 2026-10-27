(() => {
  'use strict';
  const form = document.getElementById('booking-form');
  if (!form) return;
  const review = document.getElementById('booking-review');
  const summary = document.getElementById('booking-summary');
  const dialog = document.getElementById('booking-dialog');
  const bannerHost = document.getElementById('booking-banner-host');
  const bookingCard = document.getElementById('booking');
  let opener = null;
  document.querySelectorAll('[data-booking-open]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      dialog.appendChild(bookingCard);
      dialog.showModal();
      document.body.classList.add('booking-modal-open');
      if (form.hidden) document.getElementById('booking-review-title').focus();
      else steps[step].querySelector('input, textarea').focus();
    });
  });
  document.getElementById('booking-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    bannerHost.appendChild(bookingCard);
    document.body.classList.remove('booking-modal-open');
    opener?.focus();
  });

  const fields = [
    ['name', 'Name'], ['age', 'Age'], ['phone', 'Contact number'],
    ['occupation', 'Occupation'], ['problem', 'Problem'], ['location', 'Pain location'],
    ['pain', 'Pain intensity (1–5; 5 is worst)'], ['onset', 'Pain first experienced'],
    ['triggers', 'What makes it better or worse'], ['history', 'Related injury / surgery / treatment'],
    ['time', 'Preferred day & time (India time)']
  ];
  let message = '';
  let step = 0;
  const steps = [...form.querySelectorAll('.booking-step')];
  const progress = [...form.querySelectorAll('.booking-progress li')];
  const next = document.getElementById('booking-next');
  const back = document.getElementById('booking-back');
  const titles = ['About you', 'Pain details', 'Preferences'];
  // Validate only the current panel; hidden fields remain enabled so answers
  // are preserved and included in the final FormData.
  form.noValidate = true;
  next.disabled = false;
  const showStep = (index, focus = true) => {
    step = index;
    steps.forEach((panel, i) => { panel.hidden = i !== step; });
    progress.forEach((item, i) => {
      if (i === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('is-complete', i < step);
    });
    back.hidden = step === 0;
    next.textContent = ['Next: Pain details →', 'Next: Preferences →', 'Review appointment request →'][step];
    document.getElementById('booking-step-status').textContent = `Step ${step + 1} of 3 · ${titles[step]}`;
    if (focus) steps[step].querySelector('legend').focus();
  };
  const validateStep = (index) => {
    const inputs = [...steps[index].querySelectorAll('input, textarea')];
    for (const input of inputs) {
      input.setCustomValidity('');
      if (input.required && input.type !== 'radio' && input.type !== 'checkbox' && !input.value.trim()) {
        input.setCustomValidity('Please enter this detail.');
      }
      if (input.name === 'phone') {
        const digits = input.value.replace(/\D/g, '');
        input.setCustomValidity(digits.length >= 10 && digits.length <= 15 ? '' : 'Please enter a valid contact number with 10–15 digits.');
      }
    }
    const invalid = inputs.find(input => !input.checkValidity());
    if (invalid) {
      showStep(index, false);
      invalid.reportValidity();
      return false;
    }
    return true;
  };
  back.addEventListener('click', () => { if (step > 0) showStep(step - 1); });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep(step)) return;
    if (step < steps.length - 1) { showStep(step + 1); return; }
    for (let i = 0; i < steps.length; i++) {
      if (!validateStep(i)) return;
    }
    const data = new FormData(form);
    summary.replaceChildren();
    const lines = ['Hello Physioplus, I would like to request an online physiotherapy appointment.', ''];
    fields.forEach(([key, label]) => {
      const value = String(data.get(key) || '').trim();
      if (!value) return;
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      summary.append(term, detail);
      lines.push(`${label}: ${value}`);
    });
    lines.push('', 'I consent to share these details with Physioplus for this appointment request. Please confirm availability.');
    message = lines.join('\n');
    form.hidden = true;
    review.hidden = false;
    document.getElementById('booking-review-title').focus();
  });
  form.addEventListener('input', event => event.target.setCustomValidity?.(''));
  document.getElementById('booking-edit').addEventListener('click', () => {
    review.hidden = true;
    form.hidden = false;
    showStep(0);
  });
  document.getElementById('booking-whatsapp').addEventListener('click', () => {
    if (!message || !document.getElementById('booking-consent').checked) return;
    window.open(`https://wa.me/917447554567?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    document.getElementById('booking-status').textContent = 'Complete your request by tapping Send in WhatsApp. If nothing opened, allow the new tab or call the clinic below. This page cannot verify delivery; please wait for the clinic to confirm your appointment.';
  });
})();
