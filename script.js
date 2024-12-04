document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let query = document.getElementById('query').value;

    // Simulované výsledky
    let results = [
        {
            title: "První výsledek pro '" + query + "'",
            link: "https://www.example.com",
            snippet: "Toto je první výsledek hledání pro zadané klíčové slovo."
        },
        {
            title: "Druhý výsledek pro '" + query + "'",
            link: "https://www.example2.com",
            snippet: "Toto je druhý výsledek hledání pro zadané klíčové slovo."
        }
    ];

    displayResults(results);

    // Zobrazíme tlačítko pro stažení
    document.getElementById('download-button').style.display = 'block';

    // Přidání funkce pro stažení výsledků
    document.getElementById('download-button').onclick = function() {
        downloadResults(results);
    };
});

function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Vymazání předchozích výsledků

    results.forEach(result => {
        let resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        
        let resultTitle = document.createElement('h3');
        resultTitle.textContent = result.title;
        resultTitle.onclick = () => window.open(result.link, '_blank');
        resultTitle.style.cursor = 'pointer';

        let resultSnippet = document.createElement('p');
        resultSnippet.textContent = result.snippet;

        resultItem.appendChild(resultTitle);
        resultItem.appendChild(resultSnippet);
        resultsContainer.appendChild(resultItem);
    });
}

function downloadResults(results) {
    let resultsJSON = JSON.stringify(results, null, 2);
    let blob = new Blob([resultsJSON], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vyhledavani.json';
    link.click();
}