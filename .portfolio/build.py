"""Render the static GitHub Pages site with Python 3.11+ and Pandoc."""
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
DOWNLOAD = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/></svg>'

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

def figure(key, caption=None):
    m = MEDIA[key]
    label = escape(caption or m["caption"])
    return (f'<figure class="gallery-figure"><a class="zoom-photo" href="{m["file"]}" '
            f'aria-label="Enlarge image. {escape(m["alt"])}">{img(key)}'
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
    return (f'<article class="project-card">{photo}<div class="card-copy"><div class="project-meta">'
            f'<span class="meta">{escape(project["category"])}</span>{status(project)}</div>'
            f'<h3><a href="{slug}.html">{escape(project["title"])}</a></h3>'
            f'<p>{escape(project["problem"])}</p><p>{escape(project["summary"])}</p>'
            f'<a class="text-link" href="{slug}.html">Read case study</a></div></article>')

def layout(filename, title, description, body, active="", media="car", lightbox=False):
    nav_items = [("Projects", "projects.html"), ("Baja SAE", "baja.html"), ("Contact", "#contact")]
    nav = "".join(f'<a href="{href}"' + (' aria-current="page"' if name == active else '') + f'>{name}</a>'
                  for name,href in nav_items)
    contact = []
    if PROFILE.get("email"):
        email = escape(PROFILE["email"])
        contact.append(f'<a href="mailto:{email}">{email}</a>')
    if PROFILE.get("linkedin"):
        contact.append(f'<a href="{escape(PROFILE["linkedin"])}">LinkedIn</a>')
    if PROFILE.get("resume"):
        pdf = escape(PROFILE["resume"])
        nav += f'<a class="nav-resume" href="{pdf}">Résumé {DOWNLOAD}</a>'
        contact.append(f'<a href="{pdf}">Résumé (PDF)</a>')
    dialog = ""
    if lightbox:
        dialog = ('<dialog id="viewer" aria-labelledby="viewer-caption"><div class="viewer-tools">'
                  '<button type="button" id="viewer-close" autofocus>Close image</button></div>'
                  '<img id="viewer-image" alt=""><p id="viewer-caption"></p></dialog>')
    route = "" if filename == "index.html" else filename
    page = tpl("base", name=escape(PROFILE["name"]), title=escape(title), description=escape(description),
               canonical=escape(urljoin(SITE,route)), socialImage=urljoin(SITE,MEDIA[media]["file"]),
               socialAlt=escape(MEDIA[media]["alt"]), graduation=escape(PROFILE["graduation"]),
               pageClass=filename.split(".")[0], navigation=nav, body=body, dialog=dialog,
               contactLinks="".join(contact))
    (ROOT / filename).write_text(page)
    PAGES.append(route)

def home(featured):
    p = PROFILE
    skills = "".join(f"<li>{escape(skill)}</li>" for skill in p["skills"])
    pdf = f'<a class="button outline" href="{escape(p["resume"])}">View Résumé</a>' if p.get("resume") else '<a class="button outline" href="#contact">Contact</a>'
    body = tpl("home", **{k:escape(p[k]) for k in ("name","role","team","education","intro","discipline","internshipTerm","internshipScope")},
               resumeButton=pdf, skills=skills, featured=card(featured), insetPhoto=img("car","(max-width: 700px) 38vw, 16vw"),
               bajaPhoto=img("side"))
    layout("index.html", f'{p["name"]} | {p["role"]} · Mechanical Engineering',
           f'{p["name"]}, {p["role"]} at {p["team"]}. Explore my Baja SAE powertrain design and testing at UT Austin.', body)

def project_index(projects):
    studies = "".join(card(p) for p in projects if not p["draft"])
    in_progress = "".join(f'<li id="{p["slug"]}"><span>{escape(p["title"])}</span><small>{escape(p["category"])}</small></li>'
                          for p in projects if p["draft"])
    drafts = (f'<section class="forthcoming"><p class="eyebrow">More projects</p><h2>Case studies in preparation</h2>'
              f'<ul class="project-rows">{in_progress}</ul></section>') if in_progress else ""
    body = ('<section class="page-intro"><div class="wrap"><p class="eyebrow line">Engineering portfolio</p>'
            '<h1>Engineering projects</h1><p>Design decisions, shop work, and results from the vehicles I’ve worked on.</p></div></section>'
            f'<div class="paper"><div class="wrap index-list">{studies}{drafts}</div></div>')
    layout("projects.html", "Engineering Projects | " + PROFILE["name"],
           "Case studies in Baja SAE powertrain design, drivetrain packaging, assembly, and endurance testing.",body,"Projects")
    for p in projects:
        if p["draft"] and (p["slug"] in LEGACY or (ROOT / (p["slug"] + ".html")).exists()):
            url = f'projects.html#{p["slug"]}'
            (ROOT / (p["slug"] + ".html")).write_text(
                '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
                f'<meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url={url}">'
                f'<title>{escape(p["title"])} | Projects</title></head><body><p><a href="{url}">View project listing</a></p></body></html>')

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
            f'<div class="paper"><div class="wrap case-hero-img">{photo}</div><div class="wrap case-body">'
            f'<nav aria-label="Case study sections" class="contents"><p class="eyebrow">In this study</p>{"".join(menu)}</nav>'
            f'<article>{"".join(sections)}<a class="text-link" href="projects.html">Back to projects</a></article></div></div>')
    layout(p["slug"]+".html", p["title"]+" | "+PROFILE["name"], p["summary"], body, media=p["hero"] or "car", lightbox=True)

def baja():
    body = tpl("baja", bajaHeroPhoto=img("car","100vw",True),
               shopPhotos="".join(figure(k) for k in ("column","rack-side","rack-front")),
               fieldPhotos="".join(figure(k) for k in ("hill","firewall","side","rear")))
    layout("baja.html","Longhorn Baja Racing | "+PROFILE["name"],
           "I co-founded Longhorn Baja Racing at UT Austin and led powertrain for car 185. See the team’s shop photos, competition car, and engineering case studies.",
           body,"Baja SAE",media="car",lightbox=True)

def main():
    projects = load_projects()
    home(next(p for p in projects if p["featured"] and not p["draft"]))
    project_index(projects)
    baja()
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
