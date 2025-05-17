// 1) Charger et afficher les films
function loadEmployeeFilms() {
  fetch('/api/employee/films')
    .then(r => r.json())
    .then(films => {
      const div = document.getElementById('films-list');
      div.innerHTML = films.map(f => `
        <div data-id="${f.id}">
          <input class="title" value="${f.title}">
          <input class="genre" value="${f.genre}">
          <input type="date" class="date" value="${f.date}">
          <button class="save-film">💾</button>
        </div>
      `).join('');
      attachFilmSavers();
    });
}

// Sauvegarder les modifications d’un film
function attachFilmSavers() {
  document.querySelectorAll('.save-film').forEach(btn => {
    btn.onclick = () => {
      const parent = btn.parentNode;
      const id = parent.dataset.id;
      const title = parent.querySelector('.title').value;
      const genre = parent.querySelector('.genre').value;
      const date = parent.querySelector('.date').value;
      fetch(`/api/employee/films/${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({title,genre,date})
      }).then(() => loadEmployeeFilms());
    };
  });
}

// 2) Charger et afficher les avis
function loadReviews() {
  fetch('/api/employee/reviews')
    .then(r => r.json())
    .then(reviews => {
      const div = document.getElementById('reviews-list');
      div.innerHTML = reviews.map(rv => `
        <div data-id="${rv.id}">
          <p><strong>Film #${rv.filmId}</strong> – User #${rv.userId}</p>
          <p>${rv.content}</p>
          <label>
            Validé: <input type="checkbox" class="validate" ${rv.is_validated ? 'checked' : ''}>
          </label>
        </div>
      `).join('');
      attachReviewValidators();
    });
}

// Valider/dévalider un avis
function attachReviewValidators() {
  document.querySelectorAll('.validate').forEach(cb => {
    cb.onchange = () => {
      const parent = cb.parentNode.parentNode;
      const id = parent.dataset.id;
      const is_validated = cb.checked;
      fetch(`/api/employee/reviews/${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({is_validated})
      }).then(() => loadReviews());
    };
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadEmployeeFilms();
  loadReviews();
});
