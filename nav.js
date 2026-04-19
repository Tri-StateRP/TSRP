(function(){
const SCRIPT_SRC = (document.currentScript && document.currentScript.src)
  ? document.currentScript.src
  : new URL("nav.js", window.location.href).toString();
const SITE_ROOT = new URL(".", SCRIPT_SRC).pathname.replace(/\/$/, "");
const pagePath = (path) => `${SITE_ROOT}${path}`;

const links = [
  {
    group: "Core",
    items: [
      { href: pagePath("/"), label: "Home" },
      { href: pagePath("/server-bible/"), label: "Server Bible" }
    ]
  },

  {
    group: "Rules of Engagement",
    items: [
      { href: pagePath("/faction-roe/"), label: "Faction ROE" },
      { href: pagePath("/families-roe/"), label: "Families ROE" }
    ]
  },

  {
    group: "Departments",
    items: [
      { href: pagePath("/leo/"), label: "LEO" },
      { href: pagePath("/ems/"), label: "EMS" }
    ]
  },

  {
    group: "Shop",
    items: [
      { href: pagePath("/store/plugs/"), label: "Beale Street Stories Store" }
    ]
  }
];

const sidebar = document.getElementById("sidebarNav");
if(!sidebar) return;

let current = window.location.pathname;
if(!current.endsWith("/")) current += "/";

let html = "";

links.forEach(section => {

  html += `<p class="nav-group-title">
  ${section.group}
  </p>`;

  section.items.forEach(link => {

    const active =
      current === link.href ? "active" : "";

    html += `
      <a class="${active}" href="${link.href}">
        ${link.label}
      </a>
    `;
  });

});

sidebar.innerHTML = html;

})();
