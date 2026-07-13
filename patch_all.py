import os
import re

TARGET_DIR = r"c:\Tools\project crypto\bagstamp"

def replace_in_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        return
        
    original = content
    # Case sensitive replacements
    content = content.replace("BAGWORK", "BAGSTAMP")
    content = content.replace("Bagwork", "Bagstamp")
    content = content.replace("bagwork", "bagstamp")
    
    # Twitter replacement
    content = re.sub(r'x\.com/[a-zA-Z0-9_]+', 'x.com/bagstamp', content)
    content = re.sub(r'twitter\.com/[a-zA-Z0-9_]+', 'twitter.com/bagstamp', content)
    
    # Address replacement
    content = content.replace("Ey7h7iJ95AYttb5P2MzBPxwYVj4XogCKdmXqaM2Apump", "coming soon on pump.fun")
    
    if content != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched: {path}")

def rename_files():
    for root, dirs, files in os.walk(TARGET_DIR):
        for f in files:
            if "bagwork" in f.lower():
                old_path = os.path.join(root, f)
                # Keep case for renaming? Usually it's lowercase
                new_f = f.replace("bagwork", "bagstamp")
                new_path = os.path.join(root, new_f)
                os.rename(old_path, new_path)
                print(f"Renamed: {old_path} -> {new_path}")

def main():
    # First replace content
    for root, dirs, files in os.walk(TARGET_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for f in files:
            if f.endswith(('.js', '.html', '.css', '.json', '.md')):
                replace_in_file(os.path.join(root, f))
                
    # Then rename files
    rename_files()

if __name__ == "__main__":
    main()
