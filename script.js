document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let query = document.getElementById('query').value.trim();

    if (!query) {
        alert("Prosím, zadejte klíčové slovo pro vyhledávání.");
        return;
    }

    let loader = document.getElementById('loader');
    loader.style.display = 'block';
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';  // Vyčistit předchozí výsledky
    let errorContainer = document.getElementById('error-message');
    errorContainer.style.display = 'none';  // Skrytí chybové zprávy, pokud existuje

    // Použijeme Zenserp API pro získání výsledků
    const apiKey = '337910b0-b27c-11ef-8ae0-fb69bb703eea';
    fetch(`https://api.zenserp.com/v2/search?q=${encodeURIComponent(query)}&apikey=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Chyba při získávání dat');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.results) {
                displayResults(data.results);
                document.getElementById('download-button').style.display = 'block';  // Ukázat tlačítko pro stažení
            } else {
                displayError("Nebyly nalezeny žádné výsledky.");
            }
            loader.style.display = 'none';
        })
        .catch(error => {
            loader.style.display = 'none';
            displayError('Došlo k chybě při vyhledávání: ' + error.message);
        });
});

function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';  // Vyčistit předchozí výsledky

    results.forEach(result => {
        let resultCard = document.createElement('div');
        resultCard.classList.add('result-card');

        let resultTitle = document.createElement('h3');
        resultTitle.textContent = result.title;
        resultTitle.onclick = () => window.open(result.link, '_blank');
        resultTitle.style.cursor = 'pointer';

        let resultSnippet = document.createElement('p');
        resultSnippet.textContent = result.snippet;

        let resultLink = document.createElement('a');
        resultLink.textContent = "Otevřít";
        resultLink.href = result.link;
        resultLink.target = "_blank";
        resultLink.classList.add('result-link');

        resultCard.appendChild(resultTitle);
        resultCard.appendChild(resultSnippet);
        resultCard.appendChild(resultLink);
        resultsContainer.appendChild(resultCard);
    });
}

// Funkce pro zobrazení chybové zprávy
function displayError(message) {
    let errorContainer = document.getElementById('error-message');
    errorContainer.style.display = 'block';
    errorContainer.textContent = message;
}

// Funkce pro stažení výsledků jako JSON soubor
document.getElementById('download-button').addEventListener('click', function() {
    let results = [];
    document.querySelectorAll('.result-card').forEach(card => {
        let title = card.querySelector('h3').textContent;
        let link = card.querySelector('.result-link').href;
        let snippet = card.querySelector('p').textContent;
        results.push({ title, link, snippet });
    });

    let resultsJSON = JSON.stringify(results, null, 2);
    let blob = new Blob([resultsJSON], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vyhledavani.json';
    link.click();
});