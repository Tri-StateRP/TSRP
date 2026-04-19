(function(){
  const SCRIPT_SRC = (document.currentScript && document.currentScript.src)
    ? document.currentScript.src
    : new URL("app.js", window.location.href).toString();
  const SITE_ROOT = new URL(".", SCRIPT_SRC).pathname.replace(/\/$/, "");
  const pagePath = (path) => `${SITE_ROOT}${path}`;
  const assetUrl = (assetPath) => new URL(assetPath, SCRIPT_SRC).toString();

  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================
  const SITE = {
    name: "Beale Street Stories",
    emoji: "🏙️",
    tagline: "Memphis • Dark Neon RP",
    discordUrl: "https://discord.gg/vRTB8gq3WN",
    connectUrl: "",
    cfxUrl: "https://cfx.re/join/3ygj9qo",
    cfxCode: "3ygj9qo",
    logoAssetPath: "assets/server-logo.png",
    bannerAssetPath: "assets/server-banner.png",
    tebexUrl: ""
  };

  // ==============================
  // ANNOUNCEMENT BANNER
  // ==============================
  function injectBanner(){
    if(document.getElementById("siteBanner")) return;
    const banner = document.createElement("div");
    banner.id = "siteBanner";
    banner.innerHTML = `
      <span class="bannerText">🌃 Welcome to Beale Street Stories — Memphis nights, neon lights, and high-quality RP.</span>
      <button class="bannerClose" id="bannerClose" aria-label="Close">✕</button>
    `;
    document.body.prepend(banner);
    document.getElementById("bannerClose").addEventListener("click", () => {
      banner.style.maxHeight = "0";
      banner.style.padding = "0";
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 400);
      sessionStorage.setItem("bannerClosed", "1");
    });
  }

  // ==============================
  // GLOBAL HEADER
  // ==============================
  function injectHeader(){
    if(document.querySelector(".globalHeader")) return;
    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="waveBar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 28" preserveAspectRatio="none">
          <path class="wave wave1" d="M0,14 C180,28 360,0 540,14 C720,28 900,0 1080,14 C1260,28 1440,14 1440,14 L1440,28 L0,28 Z"/>
          <path class="wave wave2" d="M0,18 C200,4 400,28 600,18 C800,8 1000,28 1200,18 C1320,12 1440,18 1440,18 L1440,28 L0,28 Z"/>
        </svg>
      </div>
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">
            <img class="brandLogo" src="${assetUrl(SITE.logoAssetPath)}" alt="${SITE.name} logo"/>
            <span>${SITE.emoji} ${SITE.name}</span>
          </div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          <div id="serverStatus" class="serverStatus">
            <span class="statusDot"></span>
            <span class="statusText">Checking...</span>
          </div>
          ${SITE.cfxUrl ? `<a class="headerBtn joinBtn" href="${SITE.cfxUrl}" target="_blank" rel="noopener">🎮 Join Now</a>` : ``}
          ${SITE.discordUrl ? `<a class="headerBtn" href="${SITE.discordUrl}" target="_blank" rel="noopener">Discord</a>` : ``}
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // ==============================
  // SERVER STATUS (CFX API)
  // ==============================
  async function fetchServerStatus(){
    const statusEl = document.getElementById("serverStatus");
    if(!statusEl) return;
    try {
      const res = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${SITE.cfxCode}`);
      if(!res.ok) throw new Error();
      const data = await res.json();
      const players = data?.Data?.clients ?? 0;
      const maxPlayers = data?.Data?.sv_maxclients ?? 64;
      statusEl.innerHTML = `
        <span class="statusDot online"></span>
        <span class="statusText">🟢 Online • ${players}/${maxPlayers} players</span>
      `;
    } catch(e){
      statusEl.innerHTML = `
        <span class="statusDot offline"></span>
        <span class="statusText">🔴 Offline</span>
      `;
    }
  }

  // ==============================
  // SCROLL PROGRESS BAR
  // ==============================
  function injectProgressBar(){
    if(document.getElementById("scrollProgress")) return;
    const bar = document.createElement("div");
    bar.id = "scrollProgress";
    document.body.prepend(bar);
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + "%";
    }, { passive: true });
  }

  // ==============================
  // BACK TO TOP BUTTON
  // ==============================
  function injectBackToTop(){
    if(document.getElementById("backToTop")) return;
    const btn = document.createElement("button");
    btn.id = "backToTop";
    btn.innerHTML = "⬆️";
    btn.title = "Back to top";
    document.body.appendChild(btn);
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 300);
    }, { passive: true });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ==============================
  // BREADCRUMBS
  // ==============================
  const NAV_MAP = {
    [pagePath("/")]: ["Home"],
    [pagePath("/server-bible/")]: ["Core", "Server Bible"],
    [pagePath("/faction-roe/")]: ["Rules of Engagement", "Faction ROE"],
    [pagePath("/families-roe/")]: ["Rules of Engagement", "Families ROE"],
    [pagePath("/leo/")]: ["Departments", "LEO"],
    [pagePath("/ems/")]: ["Departments", "EMS"],
    [pagePath("/store/plugs/")]: ["Shop", "Store"]
  };

  function injectBreadcrumb(){
    const main = document.querySelector(".main");
    if(!main || document.getElementById("breadcrumb")) return;
    let path = window.location.pathname;
    if(!path.endsWith("/")) path += "/";
    const crumbs = NAV_MAP[path];
    if(!crumbs || crumbs.length <= 1) return;
    const nav = document.createElement("nav");
    nav.id = "breadcrumb";
    nav.setAttribute("aria-label", "Breadcrumb");
    const parts = [`<a href='${pagePath("/")}'>🏠 Home</a>`, ...crumbs.map((c, i) =>
      i === crumbs.length - 1 ? `<span>${c}</span>` : `<span>${c}</span>`
    )];
    nav.innerHTML = parts.join("<span class='breadSep'>›</span>");
    main.prepend(nav);
  }

  // ==============================
  // SMOOTH PAGE TRANSITIONS
  // ==============================
  function initPageTransitions(){
    document.body.classList.add("pageReady");
    document.querySelectorAll("a[href]").forEach(link => {
      const href = link.getAttribute("href");
      if(!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto") || href.startsWith("fivem")) return;
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.body.classList.remove("pageReady");
        document.body.classList.add("pageLeave");
        setTimeout(() => { window.location.href = href; }, 250);
      });
    });
  }

  // ==============================
  // PARALLAX BACKGROUND
  // ==============================
  function initParallax(){
    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.3;
      document.body.style.backgroundPositionY = `calc(center + ${offset}px)`;
    }, { passive: true });
  }

  // ==============================
  // BRAND SYNC
  // ==============================
  function syncBrand(){
    const brandEl = document.querySelector(".brand");
    if(brandEl) brandEl.textContent = SITE.name;
  }

  // ==============================
  // TABLE OF CONTENTS
  // ==============================
  function enableTocIfPresent(){
    const toc = document.getElementById("toc");
    if(!toc) return;
    const headings = document.querySelectorAll(".main h2, .main h3");
    if(!headings.length) return;
    let html = "<ul>";
    headings.forEach(h => {
      if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
      const indent = h.tagName === "H3" ? " style='margin-left:14px'" : "";
      html += `<li${indent}><a href="#${h.id}">${h.textContent}</a></li>`;
    });
    html += "</ul>";
    toc.innerHTML = html;
  }

  // ==============================
  // PAGE FILTER (search highlight)
  // ==============================
  function filterPage(query){
    const q = query.toLowerCase().trim();
    document.querySelectorAll("[data-search-item]").forEach(el => {
      el.style.opacity = (!q || el.textContent.toLowerCase().includes(q)) ? "" : "0.3";
    });
  }

  // ==============================
  // SEARCH FUNCTIONALITY
  // ==============================
  const SITE_PAGES = [
    { title: "Home", path: pagePath("/") },
    { title: "Server Bible", path: pagePath("/server-bible/") },
    { title: "Faction ROE", path: pagePath("/faction-roe/") },
    { title: "Families ROE", path: pagePath("/families-roe/") },
    { title: "LEO", path: pagePath("/leo/") },
    { title: "EMS", path: pagePath("/ems/") },
    { title: "Store", path: pagePath("/store/plugs/") }
  ];

  function applyBrandAssets(){
    document.documentElement.style.setProperty("--site-banner-image", `url("${assetUrl(SITE.bannerAssetPath)}")`);
  }

  const siteCache = new Map();
  let siteLoading = false;
  const searchInput = document.getElementById("searchInput");

  function ensureSearchBox(){
    let box = document.getElementById("searchResults");
    if(box) return box;
    box = document.createElement("div");
    box.id = "searchResults";
    box.className = "searchResults";
    box.style.display = "none";
    const wrap = document.querySelector(".search");
    if(wrap) wrap.appendChild(box);
    document.addEventListener("click", (e) => {
      if(!searchInput || e.target === searchInput || box.contains(e.target)) return;
      box.style.display = "none";
    });
    return box;
  }

  async function fetchPage(path){
    if(siteCache.has(path)) return siteCache.get(path);
    try {
      const res = await fetch(path);
      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const nodes = doc.querySelectorAll("[data-search-item]");
      const text = Array.from(nodes).map(n => n.textContent.trim()).join(" ");
      const record = { path, text };
      siteCache.set(path, record);
      return record;
    } catch(e) { return { path, text: "" }; }
  }

  async function buildCache(){
    if(siteLoading) return;
    siteLoading = true;
    await Promise.all(SITE_PAGES.map(p => fetchPage(p.path)));
    siteLoading = false;
  }

  async function searchSite(query){
    const q = query.toLowerCase().trim();
    if(q.length < 2) return [];
    await buildCache();
    return SITE_PAGES.filter(p => {
      const rec = siteCache.get(p.path);
      return rec && rec.text.toLowerCase().includes(q);
    });
  }

  function renderResults(results, query){
    const box = ensureSearchBox();
    if(!results.length){
      box.innerHTML = `<div class="searchResultMeta">No results found</div>`;
      box.style.display = "block";
      return;
    }
    box.innerHTML = results.map(r => `
      <a class="searchResultItem" href="${r.path}?q=${encodeURIComponent(query)}">
        <div class="searchResultTitle">${r.title}</div>
      </a>
    `).join("");
    box.style.display = "block";
  }

  if(searchInput){
    ensureSearchBox();
    searchInput.addEventListener("input", async (e) => {
      const val = e.target.value;
      if(!val.trim()){ ensureSearchBox().style.display = "none"; filterPage(""); return; }
      const results = await searchSite(val);
      renderResults(results, val);
      filterPage(val);
    });
    document.addEventListener("keydown", async (e) => {
      if(e.key === "Enter"){
        const results = await searchSite(searchInput.value);
        if(results.length) window.location.href = `${results[0].path}?q=${encodeURIComponent(searchInput.value)}`;
      }
    });
    document.addEventListener("keydown", (e) => {
      if((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
        e.preventDefault();
        searchInput.focus();
      }
      if(e.key === "Escape"){
        searchInput.value = "";
        filterPage("");
        const sb = document.querySelector(".sidebar");
        if(sb) sb.classList.remove("open");
        const box = document.getElementById("searchResults");
        if(box) box.style.display = "none";
      }
    });
  }

  // ==============================
  // MOBILE MENU BUTTON
  // ==============================
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.querySelector(".sidebar");
  if(menuBtn && sidebar){
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("open");
      menuBtn.innerHTML = sidebar.classList.contains("open") ? "✕ Close" : "☰ Menu";
    });
    document.addEventListener("click", (e) => {
      if(sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== menuBtn){
        sidebar.classList.remove("open");
        menuBtn.innerHTML = "☰ Menu";
      }
    });
  }

  // ==============================
  // INIT
  // ==============================
  applyBrandAssets();
  if(!sessionStorage.getItem("bannerClosed")) injectBanner();
  injectHeader();
  syncBrand();
  enableTocIfPresent();
  injectProgressBar();
  injectBackToTop();
  injectBreadcrumb();
  initPageTransitions();
  initParallax();
  fetchServerStatus();

})();
