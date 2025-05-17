// 1) Charger la liste des cinémas
fetch('/api/cinemas')
  .then(r => r.json())
  .then(data => {
    const sel = document.getElementById('cinema');
    data.forEach(c => {
      let o = new Option(c.name, c.id);
      sel.add(o);
    });
  })
  .catch(console.error);

// 2) Quand on choisit un cinéma, charger les films
document.getElementById('cinema').addEventListener('change', e => {
  const cid = e.target.value;
  if (!cid) return;
  fetch(`/api/films_by_cinema?cinemaId=${cid}`)
    .then(r => r.json())
    .then(films => {
      const sel = document.getElementById('film');
      sel.innerHTML = '<option value="">--Choisir un film--</option>';
      films.forEach(f => sel.add(new Option(f.title, f.id)));
    })
    .catch(console.error);
});

// 3) Quand on choisit un film, charger les séances
document.getElementById('film').addEventListener('change', e => {
  const fid = e.target.value;
  if (!fid) return;
  fetch(`/api/seances?filmId=${fid}`)
    .then(r => r.json())
    .then(scs => {
      const div = document.getElementById('seances');
      div.innerHTML = scs.map(s =>
        `<label>
           <input type="radio" name="seance" value="${s.price}">
           ${s.time} – ${s.price}€
         </label><br>`
      ).join('');
    })
    .catch(console.error);
});

// 4) Au submit, calculer et afficher le total
document.getElementById('reservation-form').addEventListener('submit', e => {
  e.preventDefault();
  const checked = document.querySelector('input[name=seance]:checked');
  if (!checked) {
    alert('Veuillez sélectionner une séance.');
    return;
  }
  const price = Number(checked.value);
  const qty = Number(prompt('Nombre de places ?', '1'));
  if (isNaN(qty) || qty < 1) {
    alert('Veuillez entrer un nombre valide de places.');
    return;
  }
  alert(`Total à payer : ${price * qty}€`);
});
