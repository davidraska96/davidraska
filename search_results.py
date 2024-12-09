from flask import Flask, request, render_template, send_file
import requests
from bs4 import BeautifulSoup
import csv

app = Flask(__name__)

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
        return []

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
            results.append({"title": title_text, "url": url_link})

    return results

def save_to_csv(results, filename="results.csv"):
    # Uložení výsledků do CSV souboru
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Title', 'URL'])
        for row in results:
            writer.writerow([row['title'], row['url']])

@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        query = request.form.get('query')
        if not query:
            return render_template('index.html', error="Prosím zadejte klíčové slovo.")

        # Získání výsledků z Google
        results = fetch_google_results(query)

        # Uložení do CSV
        save_to_csv(results)

        return render_template('index.html', results=results)

    return render_template('index.html')

@app.route('/download')
def download():
    return send_file("results.csv", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)

