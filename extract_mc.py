
import sys

def extract():
    print("Opening index.html...")
    with open(r'c:\mc-web\public\game\1.12.2\index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the big engine script
    marker = 'if(typeof window !== "undefined") window.eaglercraftXClientScriptElement = document.currentScript;'
    start_idx = content.find(marker)
    if start_idx == -1:
        print("Engine marker not found")
        return

    # End is at </script>
    end_idx = content.find('</script>', start_idx)
    
    engine_code = content[start_idx:end_idx]
    print(f"Extracted engine code ({len(engine_code)} bytes)")
    with open(r'c:\mc-web\public\game\1.12.2\game-engine.js', 'w', encoding='utf-8') as f:
        f.write(engine_code)

    # Find assets script
    assets_marker = 'window.eaglercraftXOpts.assetsURI ='
    assets_start = content.find(assets_marker, end_idx)
    if assets_start == -1:
        # Try finding the self-executing function
        assets_marker = '(function(){'
        assets_start = content.find(assets_marker, end_idx)
        if assets_start == -1:
            print("Assets marker not found")
            return
    
    assets_end = content.find('</script>', assets_start)
    assets_code = content[assets_start:assets_end]
    print(f"Extracted assets code ({len(assets_code)} bytes)")
    
    with open(r'c:\mc-web\public\game\1.12.2\assets-data.js', 'w', encoding='utf-8') as f:
        f.write(assets_code)

    print("Extraction complete.")

if __name__ == "__main__":
    extract()
