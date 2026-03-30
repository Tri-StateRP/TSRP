(function(){

const links = [
  {
    group: "Core",
    items: [
      { href: "/TSRP/", label: "Home" },
      { href: "/TSRP/server-bible/", label: "Server Bible" }
    ]
  },

  {
    group: "Rules of Engagement",
    items: [
      { href: "/TSRP/faction-roe/", label: "Faction ROE" },
      { href: "/TSRP/families-roe/", label: "Families ROE" }
    ]
  },

  {
    group: "Departments",
    items: [
      { href: "/TSRP/leo/", label: "LEO" },
      { href: "/TSRP/ems/", label: "EMS" }
    ]
  },

  {
    group: "Shop",
    items: [
      { href: "/TSRP/store/", label: "TS:RP Coin Store" },
      { href: "/TSRP/store/plugs/", label: "TS:RP Plugs" }
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
