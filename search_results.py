import requests
from bs4 import BeautifulSoup
import csv
import sys

def fetch_google_results(query):
    # URL pro vyhledávání na Google
    url = f"https://www.google.com/search?q={query}"

    # Nastavení hlavičky pro simulaci reálného prohlížeče
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36"
    }

    # Požadavek na Google a získání HTML
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print("Chyba při získávání výsledků!")
        sys.exit()

    # Parsování HTML s BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')

    # Hledání odkazů na výsledky
    results = []
    for g in soup.find_all('div', class_='tF2Cxc'):
        title = g.find('h3')
        link = g.find('a', href=True)

        if title and link:
            title_text = title.get_text()
            url_link = link['href']
            results.append([title_text, url_link])

    return results

def save_to_csv(results, filename="results.csv"):
    # Uložení výsledků do CSV souboru
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Title', 'URL'])
        for row in results:
            writer.writerow(row)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
        print("Prosím zadejte klíčové slovo jako argument.")
        sys.exit()

    query = sys.argv[1]
    results = fetch_google_results(query)
    save_to_csv(results)
    print(f"Výsledky byly uloženy do souboru 'results.csv'")
