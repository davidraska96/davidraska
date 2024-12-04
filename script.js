document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let query = document.getElementById('query').value.trim();

    if (!query) {
        alert("Prosím, zadejte klíčové slovo pro vyhledávání.");
        return;
    }

    let loader = document.getElementById('loader');
    loader.style.display = 'block';
    let errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none'; // Skrýt předchozí chybové zprávy

    // API klíč a URL pro ZenSerp
    const apiKey = "337910b0-b27c-11ef-8ae0-fb69bb703eea";  // Váš API klíč
    const url = `https://app.zenserp.com/api/v2/search?apikey=${apiKey}&q=${encodeURIComponent(query)}&location=auto&hl=cs`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Odpověď API:", data); // Vytiskněte odpověď pro ladění
            loader.style.display = 'none';
            if (data && data.organic_results && data.organic_results.length > 0) {
                displayResults(data.organic_results);
            } else {
                showError("Nebyly nalezeny žádné výsledky.");
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            showError("Došlo k chybě při vyhledávání výsledku. Zkuste to znovu.");
            console.error("Chyba při volání API:", error);  // Pro ladění
        });
});

function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Vyčistit předchozí výsledky

    results.forEach(result => {
        let resultCard = document.createElement('div');
        resultCard.classList.add('result-card');

        let resultTitle = document.createElement('h3');
        resultTitle.textContent = result.title;
        resultTitle.onclick = () => window.open(result.url, '_blank');
        resultTitle.style.cursor = 'pointer';

        let resultSnippet = document.createElement('p');
        resultSnippet.textContent = result.snippet;

        let resultLink = document.createElement('a');
        resultLink.textContent = "Otevřít";
        resultLink.href = result.url;
        resultLink.target = "_blank";
        resultLink.classList.add('result-link');

        resultCard.appendChild(resultTitle);
        resultCard.appendChild(resultSnippet);
        resultCard.appendChild(resultLink);
        resultsContainer.appendChild(resultCard);
    });

    document.getElementById('download-button').style.display = 'block';
}

function showError(message) {
    let errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
}