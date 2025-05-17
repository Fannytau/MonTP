async function postJSON(url, payload) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return resp;
}

// --- Login ---
if (document.getElementById('login-form')) {
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pwd   = document.getElementById('password').value.trim();
    const fb    = document.getElementById('feedback');
    const resp  = await postJSON('/api/auth/login',{email,password:pwd});
    const data  = await resp.json();
    if (!resp.ok) {
      fb.style.color = 'red';
      fb.textContent = data.error || 'Erreur';
      return;
    }
    fb.style.color = 'green';
    fb.textContent = 'Connexion réussie !';
  });
}

// --- Register ---
if (document.getElementById('register-form')) {
  document.getElementById('register-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const pwd   = document.getElementById('password').value.trim();
    const fb    = document.getElementById('feedback');
    const resp  = await postJSON('/api/auth/register',{email,password:pwd});
    const data  = await resp.json();
    if (!resp.ok) {
      fb.style.color = 'red';
      fb.textContent = data.error || 'Erreur';
      return;
    }
    fb.style.color = 'green';
    fb.textContent = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
  });
}

// --- Forgot Password ---
if (document.getElementById('forgot-form')) {
  document.getElementById('forgot-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const fb    = document.getElementById('feedback');
    const resp  = await postJSON('/api/auth/forgot-password',{email});
    const data  = await resp.json();
    if (!resp.ok) {
      fb.style.color = 'red';
      fb.textContent = data.error || 'Erreur';
      return;
    }
    fb.style.color = 'green';
    fb.textContent = data.message;
  });
}
