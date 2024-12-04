document.getElementById('search-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    let query = document.getElementById('query').value.trim();

    if (!query) {
        alert("Prosím, zadejte klíčové slovo pro vyhledávání.");
        return;
    }

    let loader = document.getElementById('loader');
    loader.style.display = 'block';

    try {
        const apiKey = 'fa2a485992054148005ebd2822733cead14d52247aa2cc205d491589bb048848';
        const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&hl=cs&gl=cz&api_key=${apiKey}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }

        const data = await response.json();
        const results = data.organic_results.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
        }));

        displayResults(results);
        document.getElementById('download-button').style.display = 'block';
    } catch (error) {
        console.error('Chyba při načítání výsledků:', error);
        alert('Došlo k chybě při načítání výsledků.');
    } finally {
        loader.style.display = 'none';
    }
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

document.getElementById('download-button').addEventListener('click', function () {
    let resultsContainer = document.getElementById('results');
    let resultsText = resultsContainer.textContent.trim();
    let blob = new Blob([resultsText], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vyhledavani.json';
    link.click();
});