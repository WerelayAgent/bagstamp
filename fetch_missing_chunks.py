import os
import re
import requests
import json
from concurrent.futures import ThreadPoolExecutor

BASE_URL = "https://www.bagwork.cool"
CHUNKS_DIR = r"c:\Tools\project crypto\bagstamp\public\_next\static\chunks"

session = requests.Session()
session.headers.update({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
})

def download_chunk(filename):
    url = f"{BASE_URL}/_next/static/chunks/{filename}"
    local_path = os.path.join(CHUNKS_DIR, filename)
    if os.path.exists(local_path):
        return False
        
    try:
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        res = session.get(url, timeout=10)
        if res.status_code == 200:
            with open(local_path, "wb") as f:
                f.write(res.content)
            print(f"Downloaded: {filename}")
            return True
        else:
            return False
    except Exception as e:
        return False

def find_missing_chunks():
    if not os.path.exists(CHUNKS_DIR):
        return []
        
    potential_chunks = set()
    
    # 1. Match full filenames
    chunk_pattern = re.compile(r'([a-zA-Z0-9_-]+-[a-f0-9]{16,}\.js|[0-9]+\.[a-f0-9]{16,}\.js)')
    
    # 2. Extract mappings like {4960:"e5ec2edd9105de61"}
    for root, dirs, files in os.walk(CHUNKS_DIR):
        for f in files:
            if f.endswith('.js'):
                path = os.path.join(root, f)
                try:
                    with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                        content = file.read()
                        
                        # Direct filename matches
                        matches = chunk_pattern.findall(content)
                        potential_chunks.update(matches)
                        
                        # Maps
                        maps = re.findall(r'\{([0-9]+:"[a-f0-9]{16,}"(?:,[0-9]+:"[a-f0-9]{16,}")*)\}', content)
                        for m in maps:
                            pairs = m.split(',')
                            for p in pairs:
                                cid, chash = p.split(':')
                                cid = cid.strip('"')
                                chash = chash.strip('"')
                                potential_chunks.add(f"{cid}.{chash}.js")
                                potential_chunks.add(f"{cid}-{chash}.js")
                except:
                    pass
                    
    existing = set(os.listdir(CHUNKS_DIR))
    missing = potential_chunks - existing
    print(f"Found {len(missing)} potentially missing chunks.")
    return list(missing)

def main():
    missing = find_missing_chunks()
    with ThreadPoolExecutor(max_workers=20) as executor:
        results = list(executor.map(download_chunk, missing))
    print(f"Total downloaded in this pass: {sum(results)}")

if __name__ == "__main__":
    main()
