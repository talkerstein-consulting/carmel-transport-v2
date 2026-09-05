import os, re, sys, time, json, html
import urllib.request, urllib.error
from urllib.parse import urljoin, urlparse, unquote

START = "https://www.carmel-usa.com/en"
HOST  = "www.carmel-usa.com"
OUT   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "carmel-usa-scrape")
PAGES, TEXT, ASSETS = (os.path.join(OUT, d) for d in ("pages", "text", "assets"))
for d in (PAGES, TEXT, ASSETS): os.makedirs(d, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36"
SKIP_EXT = re.compile(r"\.(pdf|zip|docx?|xlsx?|mp4|mp3|css|js|ico|svg|png|jpe?g|gif|webp|woff2?|ttf|eot)$", re.I)
IMG_EXT  = re.compile(r"\.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$", re.I)

def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = r.read()
        ct = r.headers.get("Content-Type", "")
    return data if binary else data.decode("utf-8", "replace"), ct

def slug(url):
    p = urlparse(url)
    s = (p.path.strip("/") or "index")
    if p.query: s += "__" + p.query
    s = re.sub(r"[^A-Za-z0-9._-]+", "_", unquote(s))
    return s[:150]

TAG = re.compile(r"<[^>]+>")
def to_text(h):
    h = re.sub(r"(?is)<(script|style|noscript|svg)\b.*?</\1>", " ", h)
    h = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h[1-6]|tr|section)>", "\n", h)
    t = html.unescape(TAG.sub(" ", h))
    t = re.sub(r"[ \t\r\f\v]+", " ", t)
    t = re.sub(r"\n\s*\n\s*\n+", "\n\n", t)
    return "\n".join(l.strip() for l in t.splitlines()).strip()

def title_of(h):
    m = re.search(r"(?is)<title>(.*?)</title>", h)
    return html.unescape(m.group(1)).strip() if m else ""

seen, queue, manifest = set(), [START], []
imgs, img_fail = set(), []

while queue:
    url = queue.pop(0)
    key = url.split("#")[0].rstrip("/") or url
    if key in seen: continue
    seen.add(key)
    try:
        body, ct = get(url)
    except Exception as e:
        print("PAGE FAIL", url, e); continue
    if "text/html" not in ct: continue
    name = slug(url)
    open(os.path.join(PAGES, name + ".html"), "w", encoding="utf-8").write(body)
    txt = to_text(body)
    open(os.path.join(TEXT, name + ".txt"), "w", encoding="utf-8").write(
        "URL: %s\nTITLE: %s\n%s\n\n%s\n" % (url, title_of(body), "-"*60, txt))
    manifest.append({"url": url, "title": title_of(body), "html": "pages/%s.html" % name,
                     "text": "text/%s.txt" % name, "chars": len(txt)})
    print("[%d/%d] %s" % (len(manifest), len(seen)+len(queue), url))

    for m in re.finditer(r'(?i)<(?:img|source)[^>]+(?:src|data-src|data-lazy-src|srcset)\s*=\s*["\']([^"\']+)', body):
        imgs.add(urljoin(url, m.group(1).split()[0]))
    for m in re.finditer(r'''(?i)background-image\s*:\s*url\((['"]?)([^'")]+)''', body):
        imgs.add(urljoin(url, m.group(2)))
    for m in re.finditer(r'''(?i)<a[^>]+href\s*=\s*["']([^"'#]+)''', body):
        h = urljoin(url, m.group(1)).split("#")[0]
        p = urlparse(h)
        if p.scheme in ("http", "https") and p.netloc == HOST and not SKIP_EXT.search(p.path):
            if h.rstrip("/") not in seen: queue.append(h)
    time.sleep(0.3)

for u in sorted(imgs):
    if not IMG_EXT.search(u): continue
    p = urlparse(u)
    if p.netloc and p.netloc != HOST: continue
    dest = os.path.join(ASSETS, *[x for x in unquote(p.path).strip("/").split("/") if x not in ("", "..")])
    if os.path.exists(dest): continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        d, _ = get(u, binary=True)
        open(dest, "wb").write(d)
        print("IMG", os.path.relpath(dest, OUT), len(d))
    except Exception as e:
        img_fail.append([u, str(e)]); print("IMG FAIL", u, e)

json.dump({"start": START, "scraped_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
           "pages": manifest, "images": sorted(imgs), "image_failures": img_fail},
          open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8"), indent=2)
print("\nDONE pages=%d images=%d failures=%d" % (len(manifest), len(imgs), len(img_fail)))
