// Liste statique des cinémas et genres pour peupler les selects
const cinemas = [
  { id: 1, name: 'Cinéphoria République' },
  { id: 2, name: 'Cinéphoria Champs-Élysées' }
];
const genres = ['Action', 'Comédie', 'Drame', 'Animation'];

// 1) Initialiser les filtres
function initFilters() {
  const selCinema = document.getElementById('filter-cinema');
  cinemas.forEach(c => selCinema.add(new Option(c.name, c.id)));

  const selGenre = document.getElementById('filter-genre');
  genres.forEach(g => selGenre.add(new Option(g, g)));

  document.getElementById('apply-filters')
    .addEventListener('click', applyFilters);
}

// 2) Appliquer les filtres
function applyFilters() {
  const cid   = document.getElementById('filter-cinema').value;
  const genre = document.getElementById('filter-genre').value;
  const date  = document.getElementById('filter-date').value;

  // Construire la query
  const params = new URLSearchParams();
  if (cid)   params.append('cinema', cid);
  if (genre) params.append('genre', genre);
  if (date)  params.append('date', date);

  fetch(`/api/films_filtered?${params.toString()}`)
    .then(r => r.json())
    .then(displayFilms)
    .catch(err => {
      console.error(err);
      document.getElementById('films-container')
        .innerHTML = '<p>Erreur de chargement des films.</p>';
    });
}

// 3) Afficher la liste des films
function displayFilms(films) {
  const container = document.getElementById('films-container');
  if (films.length === 0) {
    container.innerHTML = '<p>Aucun film ne correspond aux filtres.</p>';
    return;
  }
  container.innerHTML = films.map(f => `
    <div class="film-card">
      <h2>${f.title}</h2>
      <p>Genre : ${f.genre}</p>
      <p>Date : ${f.date}</p>
      <a href="film-detail.html?id=${f.id}">Voir les séances</a>
    </div>
  `).join('');
}

// 4) Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  applyFilters();  // pour afficher tous les films au démarrage
});
