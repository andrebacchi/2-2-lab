# Ajustes de caminho para rodar em andrebacchi.github.io/2-2-lab/
def sub(p, pairs):
    s = open(p).read()
    for a, b in pairs: s = s.replace(a, b)
    open(p, 'w').write(s)
sub('src/main.jsx', [("register('/sw.js')", "register('./sw.js')")])
sub('index.html', [('href="/icon.svg"', 'href="./icon.svg"'), ('href="/manifest.json"', 'href="./manifest.json"')])
sub('public/manifest.json', [('"start_url": "/"', '"start_url": "./"'), ('"scope": "/"', '"scope": "./"'), ('"src": "/icon.svg"', '"src": "icon.svg"')])
