// US2: Charger les derniers films ajoutés
fetch('http://localhost:5000/api/films')
  .then(res => res.json())
  .then(data => {
    document.getElementById('date').textContent = data.date;
    const ul = document.getElementById('films-list');
    data.films.forEach(f => {
      let li = document.createElement('li');
      li.textContent = f;
      ul.appendChild(li);
    });
  });
