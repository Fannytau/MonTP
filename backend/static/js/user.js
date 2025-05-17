// 1) Afficher les commandes
function loadOrders() {
  fetch('/api/orders')
    .then(r=>r.json())
    .then(orders=>{
      const div = document.getElementById('orders-list');
      div.innerHTML = orders.map(o=>`
        <p>Commande #${o.id}: ${o.film} (${o.date} à ${o.seance}) × ${o.qty}</p>
      `).join('');
    });
}

// 2) Charger et afficher les notes existantes
function loadRatings() {
  fetch('/api/ratings')
    .then(r=>r.json())
    .then(ratings=>{
      const div = document.getElementById('ratings-list');
      div.innerHTML = ratings.map(r=>`
        <div>
          <p>Film #${r.filmId} – User #${r.userId}: ${r.score}/5</p>
          <p>${r.comment}</p>
        </div>
      `).join('');
    });
}

// 3) Soumettre une nouvelle note
document.getElementById('rating-form').addEventListener('submit', e=>{
  e.preventDefault();
  const payload = {
    filmId: Number(document.getElementById('filmId').value),
    userId: 1, // stub userId
    score: Number(document.getElementById('score').value),
    comment: document.getElementById('comment').value
  };
  fetch('/api/ratings',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  }).then(()=>{ loadRatings(); });
});

// 4) Initialisation
document.addEventListener('DOMContentLoaded', ()=>{
  loadOrders();
  loadRatings();
});
