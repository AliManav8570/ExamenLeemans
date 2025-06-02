document.getElementById('zoekKnop').addEventListener('click', async () => {
  const query = document.getElementById('zoekInput').value.trim();
  const resultatenDiv = document.getElementById('resultaten');
  resultatenDiv.innerHTML = '';

  if (!query) {
    resultatenDiv.innerHTML = 'Typ eerst iets om te zoeken.';
    return;
  }

  try {
    const res = await fetch(`/games?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (data.length === 0) {
      resultatenDiv.innerHTML = 'Geen games gevonden.';
    } else {
      data.forEach(game => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${game.title}</h3><p>Genre: ${game.genre}</p><p>Rating: ${game.rating}</p>`;
        resultatenDiv.appendChild(div);
      });
    }
  } catch {
    resultatenDiv.innerHTML = 'Fout bij ophalen data.';
  }
});

document.getElementById('gameForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const genre = document.getElementById('genre').value.trim();
  const rating = parseFloat(document.getElementById('rating').value);

  if (!title || !genre || isNaN(rating)) {
    alert('Vul alle velden correct in.');
    return;
  }

  try {
    const res = await fetch('/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, genre, rating })
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('status').textContent = `Game "${data.game.title}" toegevoegd!`;
      e.target.reset();
    } else {
      document.getElementById('status').textContent = `Fout: ${data.error}`;
    }
  } catch {
    document.getElementById('status').textContent = 'Serverfout bij toevoegen.';
  }
});