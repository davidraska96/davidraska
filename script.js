document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let query = document.getElementById('query').value;

    // Představme si, že zde je nějaká funkce pro získání výsledků z vyhledávače.
    // Zde použijeme fiktivní data pro ilustraci.
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

    // Vytvoření JSON objektu pro výsledky
    let resultsJSON = JSON.stringify(results, null, 2);

    // Zobrazíme výsledky na stránce
    document.getElementById('results').innerHTML = '<pre>' + resultsJSON + '</pre>';

    // Zobrazíme tlačítko pro stažení výsledků
    document.getElementById('download-button').style.display = 'block';

    // Přidání funkce pro stažení výsledků jako JSON
    document.getElementById('download-button').addEventListener('click', function() {
        downloadResults(resultsJSON);
    });
});

// Funkce pro stažení souboru JSON
function downloadResults(resultsJSON) {
    let blob = new Blob([resultsJSON], { type: 'application/json' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'vyhledavani.json';
    link.click();
}