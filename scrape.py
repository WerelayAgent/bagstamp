import os, requests, re, urllib.parse
from concurrent.futures import ThreadPoolExecutor

BASE_URL = "https://www.bagwork.cool"
OUT_DIR = r"c:\Tools\project crypto\bagstamp"
PUBLIC_DIR = os.path.join(OUT_DIR, "public")

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
})

def download_file(url, local_path):
    try:
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        if os.path.exists(local_path):
            return # Skip if already downloaded
        res = session.get(url, timeout=10)
        if res.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(res.content)
            print(f"Downloaded: {url}")
        else:
            print(f"Failed {res.status_code}: {url}")
    except Exception as e:
        print(f"Error {url}: {e}")

def main():
    os.makedirs(PUBLIC_DIR, exist_ok=True)
    
    print("Fetching index.html...")
    r = session.get(BASE_URL + "/")
    html = r.text

    # 1. Extract assets FIRST (CSS, JS, Images, Fonts)
    assets = set()
    assets.update(re.findall(r'/(?:_next/static|static|assets|brand|images)/[a-zA-Z0-9_/\.-]+\.(?:css|js|png|jpg|jpeg|svg|webp|gif|woff2|woff|ttf)', html))
    assets.update(re.findall(r'href="(/[^"]+\.(?:png|jpg|ico))"', html))
    assets.update(re.findall(r'src="(/[^"]+\.(?:png|jpg|svg))"', html))
    print(f"Found {len(assets)} assets.")
    
    urls_to_download = []
    for asset in assets:
        url = urllib.parse.urljoin(BASE_URL, asset)
        path = urllib.parse.urlparse(asset).path
        local_path = os.path.join(PUBLIC_DIR, path.lstrip("/"))
        urls_to_download.append((url, local_path))
        
    with ThreadPoolExecutor(max_workers=20) as executor:
        for url, local in urls_to_download:
            executor.submit(download_file, url, local)

    # 2. Rebranding Replacements
    html = html.replace("BAGWORK", "BAGSTAMP")
    html = html.replace("Bagwork", "Bagstamp")
    html = html.replace("bagwork", "bagstamp")
    html = html.replace("bagstamp.cool", "bagstamp.com")
    
    html = re.sub(r'x\.com/[a-zA-Z0-9_]+', 'x.com/bagstamp', html)
    html = re.sub(r'twitter\.com/[a-zA-Z0-9_]+', 'twitter.com/bagstamp', html)
    html = html.replace("Ey7h7iJ95AYttb5P2MzBPxwYVj4XogCKdmXqaM2Apump", "coming soon on pump.fun")

    # Clean up ?dpl= parameters
    html = re.sub(r'\?dpl=[a-zA-Z0-9_-]+', '', html)

    index_path = os.path.join(PUBLIC_DIR, "index.html")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("Saved rebranded index.html")

if __name__ == "__main__":
    main()
