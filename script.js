document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let query = document.getElementById('query').value.trim();

    if (!query) {
        alert("Prosím, zadejte klíčové slovo pro vyhledávání.");
        return;
    }

    let loader = document.getElementById('loader');
    loader.style.display = 'block';

    setTimeout(() => {
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
        loader.style.display = 'none';
        document.getElementById('download-button').style.display = 'block';
    }, 1500);
});

function displayResults(results) {
    let resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

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

document.getElementById('download-button').addEventListener('click', function() {
    let resultsJSON = document.getElementById('results').textContent;
    let blob = new Blob([resultsJSON], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vyhledavani.json';
    link.click();
});