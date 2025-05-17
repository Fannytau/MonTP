document.getElementById('contact-form').addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    message: document.getElementById('message').value.trim()
  };
  const resp = await fetch('/api/contact', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  const data = await resp.json();
  const fb = document.getElementById('feedback');
  if (!resp.ok) {
    fb.style.color = 'red';
    fb.textContent = data.error;
  } else {
    fb.style.color = 'green';
    fb.textContent = data.message;
    document.getElementById('contact-form').reset();
  }
});
