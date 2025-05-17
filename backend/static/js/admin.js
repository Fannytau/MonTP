// 1) Charger la liste des films
function loadFilms() {
  fetch('/api/admin/films')
    .then(r => r.json())
    .then(films => {
      const container = document.getElementById('films-list');
      container.innerHTML = films.map(f => `
        <div data-id="${f.id}">
          <strong>${f.title}</strong> (${f.genre}, ${f.date})
          <button class="edit">✏️</button>
          <button class="delete">🗑️</button>
        </div>
      `).join('');
      attachFilmActions();
    });
}

// 2) Créer un film
document.getElementById('create-film-form').addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('film-title').value;
  const genre = document.getElementById('film-genre').value;
  const date  = document.getElementById('film-date').value;
  fetch('/api/admin/films', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({title,genre,date})
  }).then(() => { loadFilms(); });
});

// 3) Actions éditer / supprimer
function attachFilmActions() {
  document.querySelectorAll('#films-list .delete').forEach(btn => {
    btn.onclick = () => {
      const id = btn.parentNode.dataset.id;
      fetch(`/api/admin/films/${id}`, {method:'DELETE'})
        .then(() => loadFilms());
    };
  });
  document.querySelectorAll('#films-list .edit').forEach(btn => {
    btn.onclick = () => {
      const parent = btn.parentNode;
      const id = parent.dataset.id;
      const title = prompt('Nouveau titre', parent.querySelector('strong').textContent);
      const genre = prompt('Nouveau genre', parent.textContent.match(/\(([^,]+)/)[1]);
      const date  = prompt('Nouvelle date', parent.textContent.match(/, ([^\)]+)/)[1]);
      fetch(`/api/admin/films/${id}`, {
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({title,genre,date})
      }).then(() => loadFilms());
    };
  });
}

// 4) Initialisation
document.addEventListener('DOMContentLoaded', loadFilms);
