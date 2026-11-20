"""Exercise the built portfolio in Chrome at desktop and phone widths."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import shutil
from threading import Thread
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
ROUTES = ("index.html", "projects.html", "baja.html", "baja-powertrain.html", "camping-build.html", "material-hybrid.html", "combat-robot.html", "sidi-lab.html", "resume.html")

# Read actual rendered colors, including inherited colors and nested surfaces.
CHECK_COLORS = """() => {
  const issues = [];
  const rgb = color => color.match(/[\\d.]+/g)?.map(Number);
  const luminance = values => values.slice(0, 3).map(n => n / 255)
    .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
    .reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
  const visible = el => el.checkVisibility({visibilityProperty: true, opacityProperty: true});
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || el.closest('object,.sr-only,.skip,dialog,figure figcaption')) continue;
    const css = getComputedStyle(el);
    const fill = rgb(css.backgroundColor);
    if (fill && (fill[3] ?? 1) > .9 && luminance(fill) > .48) issues.push('Light surface on ' + el.tagName);
    if (![...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())) continue;
    const fg = rgb(css.color);
    if (!fg) continue;
    let bg;
    for (let p = el; p; p = p.parentElement) {
      bg = rgb(getComputedStyle(p).backgroundColor);
      if (bg && (bg[3] ?? 1) >= .9) break;
    }
    if (!bg) continue;
    const [dark, light] = [luminance(fg), luminance(bg)].sort((a,b) => a-b);
    if ((light+.05)/(dark+.05) < 4.5) issues.push('Low contrast: ' + el.textContent.trim().slice(0,55));
  }
  return issues;
}"""

class StaticFiles(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def check_home(page, base):
    for anchor in ("about", "gallery", "resume"):
        assert page.locator(f"section#{anchor}").count() == 1
    assert page.locator("#about").bounding_box()["y"] < page.locator("#gallery").bounding_box()["y"] < page.locator("#resume").bounding_box()["y"]
    photos = page.locator(".photo-wall .zoom-photo")
    assert photos.count() == 12
    photos.first.click()
    assert page.locator("dialog").is_visible()
    page.keyboard.press("ArrowRight")
    assert page.locator("#viewer-image").get_attribute("src") == urljoin(base, photos.nth(1).get_attribute("href"))
    page.keyboard.press("Escape")
    assert not page.locator("dialog").is_visible()
    assert photos.first.evaluate("(el) => el === document.activeElement")

def check_document(page, base):
    download = page.locator(".document-actions a[download]")
    file_url = urljoin(base, download.get_attribute("href"))
    response = page.request.get(file_url)
    assert response.ok and response.headers["content-type"].startswith("application/pdf")
    assert response.body().startswith(b"%PDF-")
    if page.evaluate("navigator.pdfViewerEnabled"):
        embed = page.locator('.document-frame > object[type="application/pdf"]')
        assert embed.is_visible() and embed.bounding_box()["height"] > 300
        assert urljoin(base, embed.get_attribute("data")).split("#")[0] == file_url
    else:
        assert page.locator(".document-fallback img").is_visible()

def main():
    server = ThreadingHTTPServer(("127.0.0.1", 0), partial(StaticFiles, directory=ROOT))
    Thread(target=server.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{server.server_port}/"
    try:
        with sync_playwright() as api:
            chrome = shutil.which("google-chrome") or shutil.which("chromium")
            browser = api.chromium.launch(executable_path=chrome)
            for width, height in ((1440, 900), (390, 844), (320, 700)):
                page = browser.new_page(viewport={"width":width,"height":height},reduced_motion="reduce")
                errors = []
                page.on("pageerror", lambda error: errors.append(str(error)))
                for route in ROUTES:
                    page.goto(urljoin(base,route),wait_until="domcontentloaded")
                    page.evaluate("document.fonts.ready")
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), (route,width,"overflow")
                    assert page.locator('link[rel="stylesheet"]').evaluate("el => el.sheet.cssRules.length > 0")
                    issues = page.evaluate(CHECK_COLORS)
                    assert not issues, (route,width,issues)
                    if route in ("camping-build.html", "material-hybrid.html", "combat-robot.html", "sidi-lab.html"):
                        photos = page.locator(".case-pair a.zoom-photo")
                        photos.first.click()
                        viewer = page.locator("#viewer-image")
                        assert viewer.get_attribute("src") == urljoin(base, photos.first.get_attribute("href"))
                        assert viewer.evaluate("async el => { await el.decode(); return el.naturalWidth > 0; }")
                        page.keyboard.press("Escape")
                    if route == "index.html":
                        check_home(page,base)
                    if route in ("index.html", "baja-powertrain.html", "resume.html"):
                        check_document(page,base)
                assert not errors, errors
                page.close()
                print(f"Passed at {width} × {height}: {len(ROUTES)} pages, text contrast, dark surfaces, gallery, PDF and overflow")
            page = browser.new_page(viewport={"width":390,"height":844})
            page.add_init_script("Object.defineProperty(navigator,'pdfViewerEnabled',{get:()=>false})")
            for route in ("index.html", "baja-powertrain.html#research-paper"):
                page.goto(urljoin(base, route))
                fallback = page.locator(".document-frame > .document-fallback img")
                fallback.scroll_into_view_if_needed()
                assert fallback.evaluate("async el => { await el.decode(); return el.naturalWidth > 0; }")
            browser.close()
    finally:
        server.shutdown()
        server.server_close()

if __name__ == "__main__":
    main()
