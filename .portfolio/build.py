"""Render the static GitHub Pages site with Python 3.11+ and Pandoc."""
from hashlib import sha256
import json
import os
import re
import subprocess
import tomllib
from html import escape
from pathlib import Path
from string import Template
from urllib.parse import urljoin
from xml.etree import ElementTree as ET

SOURCE = Path(__file__).resolve().parent
ROOT = SOURCE.parent
PROFILE = json.loads((SOURCE / "profile.json").read_text())
MEDIA = json.loads((SOURCE / "media.json").read_text())
SITE = os.environ.get("SITE_URL", PROFILE["productionUrl"]).rstrip("/") + "/"
PAGES = []
LEGACY = {"material-hybrid", "camping-build", "sidi-lab", "combat-robot"}

def versioned_asset(filename):
    digest = sha256((ROOT / filename).read_bytes()).hexdigest()[:12]
    return f"{filename}?v={digest}"

def tpl(template_name, **fields):
    return Template((SOURCE / "templates" / (template_name + ".html")).read_text()).substitute(fields)

def img(key, sizes="(max-width: 700px) 94vw, 48vw", eager=False):
    m = MEDIA[key]
    responsive = ""
    if "small" in m:
        responsive = f' srcset="{m["small"]} 720w, {m["file"]} {m["width"]}w" sizes="{sizes}"'
    loading = 'fetchpriority="high"' if eager else 'loading="lazy"'
    return (f'<img src="{m["file"]}"{responsive} width="{m["width"]}" height="{m["height"]}" '
            f'alt="{escape(m["alt"])}" {loading} decoding="async">')

def figure(key, caption=None, sizes="(max-width: 700px) 94vw, 48vw"):
    m = MEDIA[key]
    label = escape(caption or m["caption"])
    return (f'<figure class="gallery-figure"><a class="zoom-photo" href="{m["file"]}" '
            f'aria-label="Enlarge image. {escape(m["alt"])}">{img(key, sizes)}'
            f'<span class="zoom-icon" aria-hidden="true">+</span></a><figcaption>{label}</figcaption></figure>')

def load_projects():
    projects = []
    for path in sorted((SOURCE / "projects").glob("*.md")):
        if path.stem.startswith("_"):
            continue
        _, header, text = path.read_text().split("+++", 2)
        project = tomllib.loads(header)
        project.update(slug=path.stem, body=text.strip())
        if not project["draft"] and not all(project[k] for k in ("title","role","summary","status","problem","body")):
            raise ValueError(f"Incomplete published case study: {path.name}")
        projects.append(project)
    return sorted(projects, key=lambda p: (not p["featured"], p["draft"], p["title"]))

def status(project):
    return f'<span class="state">{escape(project["status"])}</span>'

def card(project):
    slug = project["slug"]
    photo = ""
    if project["hero"]:
        photo = f'<a class="project-photo" href="{slug}.html" aria-label="Read {escape(project["title"])}">{img(project["hero"])}</a>'
    return (f'<article class="project-card" id="{slug}">{photo}<div class="card-copy"><div class="project-meta">'
            f'<span class="meta">{escape(project["category"])}</span>{status(project)}</div>'
            f'<h3><a href="{slug}.html">{escape(project["title"])}</a></h3>'
            f'<p>{escape(project["problem"])}</p><p>{escape(project["summary"])}</p>'
            f'<a class="text-link" href="{slug}.html">Read case study</a></div></article>')

def layout(filename, title, description, body, active="", media="car", lightbox=False):
    nav_items = [("About", "#about" if filename == "index.html" else "index.html#about"), ("Projects", "projects.html"), ("Baja SAE", "baja.html"), ("Contact", "#contact")]
    nav = "".join(f'<a href="{href}"' + (' aria-current="page"' if name == active else '') + f'>{name}</a>'
                  for name,href in nav_items)
    contact = []
    if PROFILE.get("email"):
        email = escape(PROFILE["email"])
        contact.append(f'<a href="mailto:{email}">{email}</a>')
    if PROFILE.get("linkedin"):
        contact.append(f'<a href="{escape(PROFILE["linkedin"])}">LinkedIn</a>')
    if PROFILE.get("resume"):
        current = ' aria-current="page"' if filename == "resume.html" else ""
        resume_url = "#resume" if filename == "index.html" else "resume.html"
        nav += f'<a class="nav-resume" href="{resume_url}"{current}>Résumé</a>'
        contact.append('<a href="resume.html">Résumé</a>')
    dialog = ""
    if lightbox:
        dialog = ('<dialog id="viewer" aria-labelledby="viewer-caption"><div class="viewer-tools">'
                   '<div class="viewer-nav"><button type="button" id="viewer-prev">Previous</button>'
                  '<button type="button" id="viewer-next">Next</button></div>'
                  '<button type="button" id="viewer-close" autofocus>Close image</button></div>' 
                  '<img id="viewer-image" alt=""><p id="viewer-caption" aria-live="polite"></p></dialog>')
    route = "" if filename == "index.html" else filename
    page = tpl("base", cssUrl=versioned_asset("styles.css"), jsUrl=versioned_asset("script.js"), name=escape(PROFILE["name"]), title=escape(title), description=escape(description),
               canonical=escape(urljoin(SITE,route)), socialImage=urljoin(SITE,MEDIA[media]["file"]),
               socialAlt=escape(MEDIA[media]["alt"]), graduation=escape(PROFILE["graduation"]),
               pageClass=filename.split(".")[0], navigation=nav, body=body, dialog=dialog,
               contactLinks="".join(contact))
    (ROOT / filename).write_text(page)
    PAGES.append(route)

def home(featured):
    p = PROFILE
    skills = "".join(f"<li>{escape(skill)}</li>" for skill in p["skills"])
    has_resume = bool(p.get("resume"))
    pdf = '<a class="button outline" href="#resume">View Résumé</a>' if has_resume else '<a class="button outline" href="#contact">Contact</a>'
    section = ('<section id="resume" class="home-resume" aria-labelledby="resume-label">'
               '<h2 id="resume-label" class="section-rule">Résumé</h2>' + resume_embed() + '</section>') if has_resume else ""
    links = []
    if p.get("email"):
        email = escape(p["email"])
        links.append(f'<a href="mailto:{email}">{email}</a>')
    if p.get("linkedin"):
        links.append(f'<a href="{escape(p["linkedin"])}">LinkedIn</a>')
    photos = ("car","hill","column","firewall","marshals","rack-front","rear","side","rack-side",
              "mhm-electrode-batch","mhm-pouch-cell","civic-deck-layout")
    gallery = "".join(figure(key, sizes="(max-width: 640px) 50vw, (max-width: 1200px) 38vw, 460px") for key in photos)
    body = tpl("home", **{k:escape(p[k]) for k in ("name","role","team","education","intro","discipline","graduation")},
               resumeButton=pdf, skills=skills, insetPhoto=img("car","(max-width: 700px) 38vw, 16vw"),
               profileLinks="".join(links), galleryPhotos=gallery, caseUrl=escape(featured["slug"] + ".html"), resumeSection=section)
    layout("index.html", f'{p["name"]} | {p["role"]} · Mechanical Engineering',
           f'{p["name"]}, {p["role"]} at {p["team"]}. Explore my Baja SAE powertrain design and testing at UT Austin.', body, lightbox=True)

def redirect(filename, target, title):
    url = escape(target)
    markup = (
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta name="color-scheme" content="dark"><meta name="theme-color" content="#191a1b">'
        '<style>html,body{background:#202123;color:#f1f0ec}a{color:#f39053}</style>'
        f'<link rel="stylesheet" href="{versioned_asset("styles.css")}"><link rel="canonical" href="{escape(urljoin(SITE, target.split("#")[0]))}">'
        f'<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url={url}"><title>{escape(title)}</title></head>'
        f'<body class="redirect-page"><p><a href="{url}">{escape(title)}</a></p></body></html>')
    (ROOT / filename).write_text(markup)

def project_index(projects):
    studies = "".join(card(p) for p in projects if not p["draft"])
    in_progress = "".join(f'<li id="{p["slug"]}"><span>{escape(p["title"])}</span><small>{escape(p["category"])}</small></li>'
                          for p in projects if p["draft"])
    drafts = (f'<section class="forthcoming"><p class="eyebrow">More projects</p><h2>Case studies in preparation</h2>'
              f'<ul class="project-rows">{in_progress}</ul></section>') if in_progress else ""
    body = ('<section class="page-intro"><div class="wrap"><p class="eyebrow line">Engineering portfolio</p>'
            '<h1>Engineering projects</h1><p>How I packaged an off-road drivetrain, designed a sleeping platform for my Civic, and helped manufacture conformal batteries.</p></div></section>'
            f'<div class="surface"><div class="wrap index-list">{studies}{drafts}</div></div>')
    layout("projects.html", "Engineering Projects | " + PROFILE["name"],
           "Engineering case studies in Baja SAE powertrain design, conformal battery manufacturing, and a removable Honda Civic sleeping platform.",body,"Projects")
    for p in projects:
        if p["draft"] and (p["slug"] in LEGACY or (ROOT / (p["slug"] + ".html")).exists()):
            redirect(p["slug"] + ".html", f'projects.html#{p["slug"]}', p["title"] + " | Projects")

def case_study(p):
    parts = re.split(r"^## (.+)$", p["body"], flags=re.MULTILINE)
    if parts[0].strip() or len(parts) < 3:
        raise ValueError(f'Start the Markdown body of {p["slug"]} with a level-two heading.')
    menu, sections = [], []
    for heading, body in zip(parts[1::2],parts[2::2]):
        anchor = re.sub(r"[^a-z0-9]+", "-", heading.lower()).strip("-")
        menu.append(f'<a href="#{anchor}">{escape(heading)}</a>')
        body = re.sub(r"\{\{figure:([a-z0-9-]+)\}\}", lambda m: figure(m[1]), body)
        html = subprocess.run(["pandoc","--from=markdown-raw_tex","--to=html5","--wrap=none"],
                              input=body,text=True,capture_output=True,check=True).stdout
        sections.append(f'<section id="{anchor}"><h2>{escape(heading)}</h2>{html}</section>')
    photo = figure(p["hero"],p["heroCaption"]) if p["hero"] else ""
    body = (f'<section class="page-intro case-intro"><div class="wrap"><a class="crumb" href="projects.html">All engineering projects</a>'
            f'<p class="eyebrow line">{escape(p["category"])}</p><h1>{escape(p["title"])}</h1><p>{escape(p["summary"])}</p>'
            f'<div class="case-meta">{status(p)}<span>{escape(p["role"])}</span></div></div></section>'
            f'<div class="surface"><div class="wrap case-hero-img">{photo}</div><div class="wrap case-body">'
            f'<nav aria-label="Case study sections" class="contents"><p class="eyebrow">In this study</p>{"".join(menu)}</nav>'
            f'<article>{"".join(sections)}<a class="text-link" href="projects.html">Back to projects</a></article></div></div>')
    layout(p["slug"]+".html", p["title"]+" | "+PROFILE["name"], p["summary"], body, media=p["hero"] or "car", lightbox=True)

def baja():
    body = tpl("baja", bajaHeroPhoto=img("car","100vw",True),
               shopPhotos="".join(figure(k) for k in ("column","rack-side","rack-front")),
               fieldPhotos="".join(figure(k) for k in ("hill","firewall","side","rear")))
    layout("baja.html","Longhorn Baja Racing | "+PROFILE["name"],
           "I co-founded Longhorn Baja Racing at UT Austin and led powertrain for car 185. See the team’s shop photos, competition car, and the combined powertrain and gearbox case study.",
           body,"Baja SAE",media="car",lightbox=True)

def resume_embed():
    return tpl("resume-embed", resume=escape(PROFILE["resume"]), name=escape(PROFILE["name"]), preview="assets/resume-page.webp")

def resume():
    p = PROFILE
    body = tpl("resume", name=escape(p["name"]), graduation=escape(p["graduation"]), embed=resume_embed())
    layout("resume.html", f'{p["name"]} | Mechanical Engineering Résumé',
           f'View or download my résumé. {p["role"]} at {p["team"]}.', body)

def main():
    projects = load_projects()
    home(next(p for p in projects if p["featured"] and not p["draft"]))
    project_index(projects)
    baja()
    if PROFILE.get("resume"):
        resume()
    redirect("gearbox-packaging.html", "baja-powertrain.html#gearbox-mount-in-design", "Gearbox mount in design | Baja SAE powertrain")
    for project in projects:
        if not project["draft"]:
            case_study(project)
    root = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    for route in PAGES:
        ET.SubElement(ET.SubElement(root,"url"),"loc").text = urljoin(SITE,route)
    ET.ElementTree(root).write(ROOT / "sitemap.xml",encoding="utf-8",xml_declaration=True)
    print(f"Built {len(PAGES)} portfolio pages and sitemap for {SITE}")

if __name__ == "__main__":
    main()
