(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================
  const SITE = {
    name: "Project California RP",
    emoji: "🌴🌊🏖️",
    tagline: "California Based • Semi-serious RP",
    discordUrl: "https://discord.gg/vRTB8gq3WN",
    connectUrl: "fivem://connect/163.227.179.61",
    cfxUrl: "https://cfx.re/join/krbzd7",
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
      <span class="bannerText">🎉 Server now OPEN with FREE whitelist! Looking for dedicated staff!</span>
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
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
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
      const res = await fetch("https://servers-frontend.fivem.net/api/servers/single/krbzd7");
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
    btn.innerHTML = "🌊";
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
    "/PCRP/": ["Home"],
    "/PCRP/server-bible/": ["Core", "Server Bible"],
    "/PCRP/faction-roe/": ["Rules of Engagement", "Faction ROE"],
    "/PCRP/families-roe/": ["Rules of Engagement", "Families ROE"],
    "/PCRP/leo/": ["Departments", "LEO"],
    "/PCRP/ems/": ["Departments", "EMS"]
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
    const parts = ["<a href='/PCRP/'>🏠 Home</a>", ...crumbs.map((c, i) =>
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
    { title: "Home", path: "/PCRP/" },
    { title: "Server Bible", path: "/PCRP/server-bible/" },
    { title: "Faction ROE", path: "/PCRP/faction-roe/" },
    { title: "Families ROE", path: "/PCRP/families-roe/" },
    { title: "LEO", path: "/PCRP/leo/" },
    { title: "EMS", path: "/PCRP/ems/" }
  ];

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
  // OCEAN SCENE
  // ==============================
  function injectOceanScene(){
    if(document.getElementById("oceanScene")) return;
    const scene = document.createElement("div");
    scene.id = "oceanScene";
    scene.innerHTML = `
      <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0A7FA0" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#041228" stop-opacity="0.98"/>
          </linearGradient>
          <linearGradient id="sunsetWater" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#F5823C" stop-opacity="0.18"/>
            <stop offset="40%" stop-color="#1AB8D4" stop-opacity="0.10"/>
            <stop offset="100%" stop-color="#F5C842" stop-opacity="0.14"/>
          </linearGradient>
          <linearGradient id="coralGrad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F56A3C"/>
            <stop offset="100%" stop-color="#A03010"/>
          </linearGradient>
          <linearGradient id="coralGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#F5C842"/>
            <stop offset="100%" stop-color="#A07810"/>
          </linearGradient>
          <linearGradient id="coralGrad3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E040A0"/>
            <stop offset="100%" stop-color="#801050"/>
          </linearGradient>
          <linearGradient id="seaweedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2ECC71" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#145A32" stop-opacity="1"/>
          </linearGradient>
        </defs>

        <!-- Ocean floor -->
        <rect x="0" y="160" width="1440" height="40" fill="#04111E" opacity="0.95"/>

        <!-- Sand ripples -->
        <ellipse cx="200" cy="168" rx="120" ry="6" fill="#C8A050" opacity="0.18"/>
        <ellipse cx="600" cy="166" rx="180" ry="5" fill="#C8A050" opacity="0.14"/>
        <ellipse cx="1000" cy="169" rx="140" ry="5" fill="#C8A050" opacity="0.16"/>
        <ellipse cx="1300" cy="167" rx="100" ry="5" fill="#C8A050" opacity="0.13"/>

        <!-- Water fill -->
        <rect x="0" y="0" width="1440" height="200" fill="url(#waterGrad)"/>
        <rect x="0" y="0" width="1440" height="200" fill="url(#sunsetWater)"/>

        <!-- SEAWEED -->
        <g class="seaweed sw1">
          <path d="M80,160 C75,140 85,120 78,100 C71,80 82,65 80,50" stroke="url(#seaweedGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M80,130 C90,122 100,125 105,118" stroke="url(#seaweedGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M79,105 C68,97 60,100 55,93" stroke="url(#seaweedGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw2">
          <path d="M160,160 C155,138 165,115 158,92" stroke="url(#seaweedGrad)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M159,125 C170,117 178,120 182,112" stroke="url(#seaweedGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw3">
          <path d="M700,160 C695,135 708,110 700,85 C692,65 703,50 700,35" stroke="url(#seaweedGrad)" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M701,118 C714,108 724,112 730,104" stroke="url(#seaweedGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M700,90 C688,80 678,84 673,76" stroke="url(#seaweedGrad)" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw4">
          <path d="M1100,160 C1095,140 1108,118 1100,95" stroke="url(#seaweedGrad)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M1101,128 C1113,119 1122,122 1127,115" stroke="url(#seaweedGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>
        <g class="seaweed sw5">
          <path d="M1380,160 C1375,138 1386,115 1379,92" stroke="url(#seaweedGrad)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M1380,125 C1391,116 1400,119 1405,112" stroke="url(#seaweedGrad)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </g>

        <!-- CORAL -->
        <g class="coralGlow">
          <line x1="300" y1="160" x2="300" y2="125" stroke="url(#coralGrad1)" stroke-width="5" stroke-linecap="round"/>
          <line x1="300" y1="138" x2="285" y2="118" stroke="url(#coralGrad1)" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="300" y1="138" x2="315" y2="115" stroke="url(#coralGrad1)" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="285" y1="118" x2="278" y2="105" stroke="url(#coralGrad1)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="285" y1="118" x2="293" y2="104" stroke="url(#coralGrad1)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="315" y1="115" x2="308" y2="102" stroke="url(#coralGrad1)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="315" y1="115" x2="323" y2="103" stroke="url(#coralGrad1)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="278" cy="103" r="4" fill="#F56A3C"/>
          <circle cx="293" cy="102" r="3.5" fill="#F58050"/>
          <circle cx="308" cy="100" r="4" fill="#F56A3C"/>
          <circle cx="323" cy="101" r="3.5" fill="#F59060"/>
          <circle cx="300" cy="123" r="4.5" fill="#F56A3C"/>
        </g>
        <g class="coralGlow2">
          <line x1="480" y1="160" x2="480" y2="130" stroke="url(#coralGrad2)" stroke-width="4" stroke-linecap="round"/>
          <line x1="480" y1="145" x2="465" y2="128" stroke="url(#coralGrad2)" stroke-width="3" stroke-linecap="round"/>
          <line x1="480" y1="145" x2="495" y2="126" stroke="url(#coralGrad2)" stroke-width="3" stroke-linecap="round"/>
          <line x1="480" y1="145" x2="480" y2="120" stroke="url(#coralGrad2)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="465" y1="128" x2="458" y2="115" stroke="url(#coralGrad2)" stroke-width="2" stroke-linecap="round"/>
          <line x1="495" y1="126" x2="502" y2="113" stroke="url(#coralGrad2)" stroke-width="2" stroke-linecap="round"/>
          <circle cx="458" cy="113" r="3.5" fill="#F5C842"/>
          <circle cx="480" cy="118" r="4" fill="#F5D060"/>
          <circle cx="502" cy="111" r="3.5" fill="#F5C842"/>
          <circle cx="465" cy="126" r="3" fill="#F5D870"/>
          <circle cx="495" cy="124" r="3" fill="#F5C842"/>
        </g>
        <g class="coralGlow">
          <line x1="860" y1="160" x2="860" y2="128" stroke="url(#coralGrad3)" stroke-width="5" stroke-linecap="round"/>
          <line x1="860" y1="140" x2="845" y2="120" stroke="url(#coralGrad3)" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="860" y1="140" x2="875" y2="118" stroke="url(#coralGrad3)" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="845" y1="120" x2="838" y2="108" stroke="url(#coralGrad3)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="845" y1="120" x2="852" y2="107" stroke="url(#coralGrad3)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="875" y1="118" x2="868" y2="105" stroke="url(#coralGrad3)" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="875" y1="118" x2="883" y2="106" stroke="url(#coralGrad3)" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="838" cy="106" r="4" fill="#E040A0"/>
          <circle cx="852" cy="105" r="3.5" fill="#F060B0"/>
          <circle cx="868" cy="103" r="4" fill="#E040A0"/>
          <circle cx="883" cy="104" r="3.5" fill="#F070C0"/>
          <circle cx="860" cy="126" r="4.5" fill="#E040A0"/>
        </g>
        <g class="coralGlow2">
          <line x1="1200" y1="160" x2="1200" y2="132" stroke="url(#coralGrad1)" stroke-width="4" stroke-linecap="round"/>
          <line x1="1200" y1="144" x2="1188" y2="126" stroke="url(#coralGrad1)" stroke-width="3" stroke-linecap="round"/>
          <line x1="1200" y1="144" x2="1212" y2="124" stroke="url(#coralGrad1)" stroke-width="3" stroke-linecap="round"/>
          <line x1="1188" y1="126" x2="1182" y2="114" stroke="url(#coralGrad1)" stroke-width="2" stroke-linecap="round"/>
          <line x1="1212" y1="124" x2="1218" y2="112" stroke="url(#coralGrad1)" stroke-width="2" stroke-linecap="round"/>
          <circle cx="1182" cy="112" r="3.5" fill="#F56A3C"/>
          <circle cx="1200" cy="130" r="4" fill="#F57850"/>
          <circle cx="1218" cy="110" r="3.5" fill="#F56A3C"/>
        </g>

        <!-- Brain corals -->
        <ellipse cx="400" cy="158" rx="22" ry="14" fill="#C84010" opacity="0.80"/>
        <ellipse cx="400" cy="152" rx="18" ry="10" fill="#E05020" opacity="0.70"/>
        <ellipse cx="960" cy="159" rx="18" ry="12" fill="#B03080" opacity="0.75"/>
        <ellipse cx="960" cy="154" rx="14" ry="8" fill="#D040A0" opacity="0.65"/>
        <ellipse cx="1340" cy="158" rx="20" ry="12" fill="#C87010" opacity="0.70"/>
        <ellipse cx="1340" cy="153" rx="16" ry="8" fill="#E09020" opacity="0.60"/>

        <!-- Rocks -->
        <ellipse cx="50" cy="162" rx="30" ry="10" fill="#0A1A30" opacity="0.80"/>
        <ellipse cx="550" cy="163" rx="25" ry="9" fill="#0A1A30" opacity="0.75"/>
        <ellipse cx="1050" cy="162" rx="28" ry="9" fill="#0A1A30" opacity="0.78"/>

        <!-- FISH -->
        <g class="fish fish1" transform="translate(-60, 0)">
          <g transform="translate(0, 75)">
            <ellipse cx="0" cy="0" rx="14" ry="7" fill="#F5823C"/>
            <polygon points="-14,0 -22,-7 -22,7" fill="#F5A050"/>
            <ellipse cx="5" cy="-1" rx="3" ry="3" fill="white"/>
            <circle cx="6" cy="-1" r="1.5" fill="#1A1A1A"/>
            <line x1="-4" y1="-7" x2="-4" y2="7" stroke="#E06020" stroke-width="1.2" opacity="0.6"/>
            <line x1="2" y1="-7" x2="2" y2="7" stroke="#E06020" stroke-width="1.2" opacity="0.6"/>
          </g>
        </g>
        <g class="fish fish2" transform="translate(1500, 0)">
          <g transform="translate(0, 45)">
            <ellipse cx="0" cy="0" rx="12" ry="6" fill="#1AB8D4"/>
            <polygon points="-12,0 -20,-6 -20,6" fill="#0E90A8"/>
            <ellipse cx="4" cy="-1" rx="2.5" ry="2.5" fill="white"/>
            <circle cx="5" cy="-1" r="1.3" fill="#1A1A1A"/>
            <line x1="-2" y1="-6" x2="-2" y2="6" stroke="#0E90A8" stroke-width="1" opacity="0.6"/>
          </g>
        </g>
        <g class="fish fish3" transform="translate(-40, 0)">
          <g transform="translate(0, 120)">
            <ellipse cx="0" cy="0" rx="10" ry="5" fill="#F5C842"/>
            <polygon points="-10,0 -17,-5 -17,5" fill="#D4A020"/>
            <ellipse cx="3" cy="-1" rx="2" ry="2" fill="white"/>
            <circle cx="4" cy="-1" r="1.1" fill="#1A1A1A"/>
            <line x1="-1" y1="-5" x2="-1" y2="5" stroke="#D4A020" stroke-width="1" opacity="0.55"/>
          </g>
        </g>
        <g class="fish fish4" transform="translate(1500, 0)">
          <g transform="translate(0, 95)">
            <ellipse cx="0" cy="0" rx="11" ry="5.5" fill="#E040A0"/>
            <polygon points="-11,0 -18,-5 -18,5" fill="#B02070"/>
            <ellipse cx="4" cy="-1" rx="2.2" ry="2.2" fill="white"/>
            <circle cx="5" cy="-1" r="1.2" fill="#1A1A1A"/>
          </g>
        </g>
        <g class="fish fish5" transform="translate(-50, 0)">
          <g transform="translate(0, 140)">
            <ellipse cx="0" cy="0" rx="9" ry="4.5" fill="#2ECC71"/>
            <polygon points="-9,0 -15,-4 -15,4" fill="#1A8A4A"/>
            <ellipse cx="3" cy="-1" rx="1.8" ry="1.8" fill="white"/>
            <circle cx="3.8" cy="-1" r="1" fill="#1A1A1A"/>
          </g>
        </g>
        <g class="fish fish6" transform="translate(1500, 0)">
          <g transform="translate(0, 55)">
            <ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#E84020"/>
            <polygon points="-13,0 -21,-6 -21,6" fill="#C03010"/>
            <ellipse cx="4" cy="-1" rx="2.5" ry="2.5" fill="white"/>
            <circle cx="5" cy="-1" r="1.3" fill="#1A1A1A"/>
            <line x1="-3" y1="-6" x2="-3" y2="6" stroke="#C03010" stroke-width="1.1" opacity="0.55"/>
          </g>
        </g>

        <!-- BUBBLES -->
        <circle class="bubble b1" cx="120" cy="155" r="3" fill="none" stroke="rgba(200,240,255,0.55)" stroke-width="1.2"/>
        <circle class="bubble b2" cx="440" cy="158" r="2" fill="none" stroke="rgba(200,240,255,0.50)" stroke-width="1"/>
        <circle class="bubble b3" cx="780" cy="156" r="2.5" fill="none" stroke="rgba(200,240,255,0.55)" stroke-width="1.1"/>
        <circle class="bubble b4" cx="1100" cy="157" r="3" fill="none" stroke="rgba(200,240,255,0.50)" stroke-width="1.2"/>
        <circle class="bubble b5" cx="1350" cy="155" r="2" fill="none" stroke="rgba(200,240,255,0.45)" stroke-width="1"/>

        <!-- WATER SURFACE -->
        <g class="waterSurface">
          <path class="waveLayer1" d="M-100,18 C100,4 300,32 500,18 C700,4 900,32 1100,18 C1300,4 1440,18 1540,18 L1540,0 L-100,0 Z" fill="rgba(26,184,212,0.22)"/>
          <path class="waveLayer2" d="M-100,22 C150,8 350,36 600,22 C850,8 1050,36 1300,22 C1400,14 1540,22 1540,22 L1540,0 L-100,0 Z" fill="rgba(245,200,66,0.10)"/>
          <path class="waveLayer3" d="M-100,14 C200,28 400,6 700,14 C1000,22 1200,6 1440,14 C1480,16 1540,14 1540,14 L1540,0 L-100,0 Z" fill="rgba(26,184,212,0.14)"/>
        </g>
      </svg>
    `;
    document.body.appendChild(scene);
  }

  // ==============================
  // INIT
  // ==============================
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
  injectOceanScene();

})();
