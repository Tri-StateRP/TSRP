(function(){
  // ================================
  // ONE-PLACE CONFIG (EDIT THIS)
  // ================================

  const SITE = {
    name: "Project California RP",
    emoji: "🌴🌊🏖️",
    tagline: "California Based • Semi-serious RP",
    discordUrl: "",   // Add your Discord URL here
    connectUrl: "",   // Add your FiveM connect URL here
    tebexUrl: ""      // Add your Tebex URL here
  };

  // ==============================
  // GLOBAL HEADER (auto-injected)
  // ==============================
  function injectHeader(){
    if (document.querySelector(".globalHeader")) return;

    const header = document.createElement("header");
    header.className = "globalHeader";
    header.innerHTML = `
      <div class="headerInner">
        <div class="headerLeft">
          <div class="headerTitle">${SITE.emoji} ${SITE.name}</div>
          <div class="headerSub">${SITE.tagline}</div>
        </div>
        <div class="headerRight">
          ${SITE.discordUrl ? `<a class="headerBtn" href="${SITE.discordUrl}" target="_blank" rel="noopener">Discord</a>` : ``}
          ${SITE.connectUrl ? `<a class="headerBtn" href="${SITE.connectUrl}" target="_blank" rel="noopener">Connect</a>` : ``}
          ${SITE.tebexUrl ? `<a class="headerBtn" href="${SITE.tebexUrl}" target="_blank" rel="noopener">Tebex</a>` : ``}
        </div>
      </div>
    `;
    document.body.prepend(header);
  }

  // ==============================
  // BRAND SYNC
  // ==============================
  function syncBrand(){
    const brandEl = document.querySelector(".brand");
    if(brandEl) brandEl.textContent = SITE.name;
  }

  // ==============================
  // TABLE OF CONTENTS (if present)
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
      if(!q || el.textContent.toLowerCase().includes(q)){
        el.style.opacity = "";
      } else {
        el.style.opacity = "0.3";
      }
    });
  }

  // ==============================
  // SEARCH FUNCTIONALITY
  // ==============================
  const SITE_PAGES = [
    { title: "Home", path: "/" },
    { title: "Server Bible", path: "/server-bible/" },
    { title: "Faction ROE", path: "/faction-roe/" },
    { title: "Families ROE", path: "/families-roe/" },
    { title: "LEO", path: "/leo/" },
    { title: "EMS", path: "/ems/" }
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
    } catch(e) {
      return { path, text: "" };
    }
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
    const results = [];
    for(const p of SITE_PAGES){
      const rec = siteCache.get(p.path);
      if(rec && rec.text.toLowerCase().includes(q)){
        results.push(p);
      }
    }
    return results;
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
        if(results.length){
          window.location.href = `${results[0].path}?q=${encodeURIComponent(searchInput.value)}`;
        }
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
        const sidebar = document.querySelector(".sidebar");
        if(sidebar) sidebar.classList.remove("open");
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
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // ==============================
  // INIT
  // ==============================
  injectHeader();
  syncBrand();
  enableTocIfPresent();
})();
