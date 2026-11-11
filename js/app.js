/* ============================================
   MCP OS — Core Application Logic
   ============================================ */

/* ==========================================================================
   INTEGRITY GUARD & ANTI-INSPECTION SHIELD
   ========================================================================== */
(function initIntegrityShield() {
  // 1. Bloqueio de atalhos de ferramentas de desenvolvedor e visualização de código-fonte
  window.addEventListener('keydown', (e) => {
    if (e.keyCode === 123) { // F12
      e.preventDefault();
      return false;
    }
    const isCmdOrCtrl = e.ctrlKey || e.metaKey;
    if (isCmdOrCtrl) {
      // 'u' / 'U' -> Exibir Código Fonte
      if (e.keyCode === 85 || e.key === 'u' || e.key === 'U') {
        e.preventDefault();
        return false;
      }
      // 's' / 'S' -> Salvar Página
      if (e.keyCode === 83 || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        return false;
      }
      // Shift + (I, J, C) -> DevTools
      if (e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67 || ['i','j','c','I','J','C'].includes(e.key))) {
        e.preventDefault();
        return false;
      }
      // Mac Alt/Option + (I, J, C, U)
      if (e.altKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67 || e.keyCode === 85)) {
        e.preventDefault();
        return false;
      }
    }
  }, true);

  // 2. Desativação do Menu de Contexto (Bloqueio de Inspecionar Elemento)
  document.addEventListener('contextmenu', (e) => {
    if (!['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      e.preventDefault();
      return false;
    }
  }, true);

  // 3. Silenciamento preventivo do console
  if (typeof window.console !== 'undefined') {
    const _noop = () => {};
    window.console.log = _noop;
    window.console.info = _noop;
    window.console.debug = _noop;
  }
})();

/* Custom Apple Glass Dialog Modals */
window.showCustomConfirm = function(title, message, icon = '⚠️') {
  return new Promise((resolve) => {
    const modal = document.getElementById("custom-dialog-modal");
    const titleEl = document.getElementById("dialog-title");
    const msgEl = document.getElementById("dialog-message");
    const iconEl = document.getElementById("dialog-icon");
    const cancelBtn = document.getElementById("dialog-cancel-btn");
    const confirmBtn = document.getElementById("dialog-confirm-btn");

    if (!modal) {
      resolve(window.confirm(`${title}\n\n${message}`));
      return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    iconEl.textContent = icon;
    cancelBtn.style.display = "inline-flex";
    confirmBtn.textContent = "Confirmar";
    confirmBtn.className = "glass-dialog-btn glass-btn-danger";

    modal.classList.add("open");

    const cleanup = () => {
      modal.classList.remove("open");
      cancelBtn.removeEventListener("click", onCancel);
      confirmBtn.removeEventListener("click", onConfirm);
    };

    const onCancel = () => { cleanup(); resolve(false); };
    const onConfirm = () => { cleanup(); resolve(true); };

    cancelBtn.addEventListener("click", onCancel);
    confirmBtn.addEventListener("click", onConfirm);
  });
};

window.showCustomAlert = function(title, message, icon = '✨') {
  return new Promise((resolve) => {
    const modal = document.getElementById("custom-dialog-modal");
    const titleEl = document.getElementById("dialog-title");
    const msgEl = document.getElementById("dialog-message");
    const iconEl = document.getElementById("dialog-icon");
    const cancelBtn = document.getElementById("dialog-cancel-btn");
    const confirmBtn = document.getElementById("dialog-confirm-btn");

    if (!modal) {
      alert(`${title}\n\n${message}`);
      resolve(true);
      return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    iconEl.textContent = icon;
    cancelBtn.style.display = "none";
    confirmBtn.textContent = "OK";
    confirmBtn.className = "glass-dialog-btn glass-btn-primary";

    modal.classList.add("open");

    const cleanup = () => {
      modal.classList.remove("open");
      confirmBtn.removeEventListener("click", onConfirm);
    };

    const onConfirm = () => { cleanup(); resolve(true); };

    confirmBtn.addEventListener("click", onConfirm);
  });
};

// Curated list of all folders and bookmarks for MCP OS [DEMO]
const FOLDERS = {
  tools: {
    name: "Developer Tools",
    icon: "🛠️",
    items: [
      { name: "GitHub", url: "https://github.com" },
      { name: "Vercel", url: "https://vercel.com" },
      { name: "Supabase", url: "https://supabase.com" },
      { name: "Figma", url: "https://figma.com" },
      { name: "Linear", url: "https://linear.app" },
      { name: "Stripe", url: "https://stripe.com" },
      { name: "Raycast", url: "https://raycast.com" },
      { name: "Postman", url: "https://postman.com" },
      { name: "ChatGPT", url: "https://chatgpt.com" },
      { name: "Claude AI", url: "https://claude.ai" },
      { name: "Tailwind CSS", url: "https://tailwindcss.com" },
      { name: "Next.js", url: "https://nextjs.org" },
      { name: "Docker Hub", url: "https://hub.docker.com" },
      { name: "Airtable", url: "https://airtable.com" },
      { name: "Unsplash", url: "https://unsplash.com" },
      { name: "MDN Web Docs", url: "https://developer.mozilla.org" }
    ]
  },
  server: {
    name: "Cloud & Infrastructure",
    icon: "🖥️",
    items: [
      { name: "AWS Console", url: "https://aws.amazon.com/console/" },
      { name: "Cloudflare", url: "https://dash.cloudflare.com/" },
      { name: "Portainer CE", url: "https://www.portainer.io/" },
      { name: "Docker Desktop", url: "https://www.docker.com/" },
      { name: "Grafana Cloud", url: "https://grafana.com/" },
      { name: "n8n Workflow", url: "https://n8n.io/" },
      { name: "PostgreSQL Studio", url: "https://www.postgresql.org/" },
      { name: "Redis Insight", url: "https://redis.io/" }
    ]
  },
  discord: {
    name: "Discord Space",
    icon: "💬",
    items: [
      { name: "Discord App", url: "https://discord.com/app", mobile: "discord://" },
      { name: "Developer Portal", url: "https://discord.com/developers/applications" },
      { name: "Discord API Docs", url: "https://discord.com/developers/docs/intro" },
      { name: "Discord Bots Studio", url: "https://top.gg/" },
      { name: "Discord Community", url: "https://discord.com/community" }
    ]
  },
  proton: {
    name: "Privacy & Security",
    icon: "⚛️",
    items: [
      { name: "Proton Mail", url: "https://mail.proton.me" },
      { name: "Proton Drive", url: "https://drive.proton.me" },
      { name: "Proton Pass", url: "https://pass.proton.me" },
      { name: "Proton VPN", url: "https://protonvpn.com" },
      { name: "1Password", url: "https://1password.com" },
      { name: "Bitwarden", url: "https://bitwarden.com" }
    ]
  },
  social: {
    name: "Social & Growth",
    icon: "👥",
    items: [
      { name: "YouTube", url: "https://www.youtube.com/" },
      { name: "YouTube Music", url: "https://music.youtube.com/" },
      { name: "X / Twitter", url: "https://x.com/" },
      { name: "LinkedIn", url: "https://www.linkedin.com/" },
      { name: "GitHub Trending", url: "https://github.com/trending" },
      { name: "Reddit", url: "https://www.reddit.com/" },
      { name: "Product Hunt", url: "https://www.producthunt.com/" },
      { name: "Dev.to", url: "https://dev.to/" }
    ]
  }
};

// Image Galleries (Added Gen X Soft Club and Motivacional)
const GALLERIES = {
  gym: [
    "images/gym images/012f4996731b766a5f6fce9ae5fa16a0.jpg",
    "images/gym images/04747ba8c86d370f14b19aff88c73f77.jpg",
    "images/gym images/1-20260505_170907.jpg",
    "images/gym images/2-20260327_135337.jpg",
    "images/gym images/3-20260313_123924.jpg",
    "images/gym images/416bb19b1eefa7c850b4db3cb09bac12 - cópia.jpg",
    "images/gym images/4567a6460e49dca509404aa4031c11d2.jpg",
    "images/gym images/9811449c83f06fc824d7a95f235d376e - cópia.jpg",
    "images/gym images/b3668afb13ab00288ff06c9d72453d19.jpg",
    "images/gym images/c6081876648f7ce1a6e4734daa79e7d4.jpg",
    "images/gym images/e5ef0ddde9b00540cdf18e4b226e0bee.jpg",
    "images/gym images/eca2c6f16007ec99ca3c5058876b2af6.jpg",
    "images/gym images/f4fcf6bb7808351828fbd6ed76cba496.jpg",
    "images/gym images/onboarding.jpg"
  ],
  flowers: [
    "images/flowers/59da96db902a205e9f90e651a4bcaa72.jpg",
    "images/flowers/797d233401eae1b36818abc988af10d4.jpg",
    "images/flowers/7f15501be01e3225966e2ab7fe1b735a.jpg",
    "images/flowers/8e7943acb3073ec2e112542af9fcc2c6.jpg",
    "images/flowers/a7a3a081d906882bcf9068afc3894eee.jpg",
    "images/flowers/b268e4783280047be44e09f1fca7dec6.jpg",
    "images/flowers/beb4c6ac11f067d61799142fe1a6e27d.jpg",
    "images/flowers/e55174e6ec437489913f134318952c1e.jpg"
  ],
  red: [
    "images/red/08c3aa3a5c3631b23cec57233f5c365c.jpg",
    "images/red/465148a473500d0bf6c3b9c83b98ec92.jpg",
    "images/red/6c5d14bcb2f0390ee694119aa6704655.jpg",
    "images/red/7361af8ac2d01d02c9752f89b3365d47.jpg",
    "images/red/963a4bd9af77842586e2b4cdd53eb931.jpg",
    "images/red/f8247f7bffb7269d9e3b2310844b330d.jpg",
    "images/red/fb71f9cd02c7e3f7e41589d90f6fdaa8.jpg"
  ],
  soft: [
    "images/gen x soft club/05f22143098023a6978520a73a77637e.jpg",
    "images/gen x soft club/142622f0d35efbffebc9b8a7995168dd.jpg",
    "images/gen x soft club/37c572ab0404204cb6f367c2a9f78a54.jpg",
    "images/gen x soft club/3e3b1728d96b733b8f3bbf418021dd42.jpg",
    "images/gen x soft club/69b55c9be40f117fd5f076d27334d2cf.jpg",
    "images/gen x soft club/6e86f5937cb8ef54593b94952a59d5a1.jpg",
    "images/gen x soft club/71acf6cb2cad2c986df87d817a06c33b.jpg",
    "images/gen x soft club/72859fb9ef398cd2a69777dc26d7d1d2.jpg",
    "images/gen x soft club/73ba35d0e4557dacaeb9ffaab42cd635.jpg",
    "images/gen x soft club/747c0ca848cc44632e4c94436348fe07.jpg",
    "images/gen x soft club/7b78f45b8a8f62b1cb9c7477d0b83f63.jpg",
    "images/gen x soft club/800c456fafbe63fae067663194fe47e9.jpg",
    "images/gen x soft club/8f432d4e77f909f3abccb186f47ffff3.jpg",
    "images/gen x soft club/b1cd9d06a79b40e08ff9b945cd051aab.jpg",
    "images/gen x soft club/b26f28a14964906204ec288ddf524432.jpg",
    "images/gen x soft club/bbf00645951aa952366c3a446a07c990.jpg",
    "images/gen x soft club/c4058aae27b4310eb2c979cf9f6a817d.jpg",
    "images/gen x soft club/e82d7e3487abb787a3398210d02801c8.jpg",
    "images/gen x soft club/f24ac251210bc82b90f9c33ce2438194.jpg",
    "images/gen x soft club/f9f930471adfb299ae9ad2f9b319421b.jpg"
  ],
  motivation: [
    "images/motivacional/1000427297.jpg",
    "images/motivacional/1000427303.jpg",
    "images/motivacional/1000427312.jpg",
    "images/motivacional/img_8287.jpeg",
    "images/motivacional/img_9915.jpeg",
    "images/motivacional/projetounohome_20260613_155750_319.jpg",
    "images/motivacional/projetounohome_20260613_155802_757.jpg",
    "images/motivacional/projetounohome_20260613_155833_559.jpg",
    "images/motivacional/projetounohome_20260613_155903_814.jpg",
    "images/motivacional/projetounohome_20260613_171838_541.jpg",
    "images/motivacional/vaideuno_20260613_155457_985.jpg",
    "images/motivacional/vaideuno_20260613_155513_639.jpg",
    "images/motivacional/vaideuno_20260613_170029_918.jpg",
    "images/motivacional/vaideuno_20260613_171916_766.jpg",
    "images/motivacional/welitonofc001-20260222-0004.jpg",
    "images/motivacional/welitonofc001-20260222-0049.jpg",
    "images/motivacional/welitonofc001-20260222-0097.jpg"
  ]
};

// Pool de galerias para escolha aleatória (incluindo todos os novos shaders WebGL)
const GALLERIES_POOL = ["gym", "flowers", "red", "soft", "motivation", "api", "video", "galaxybits", "strands", "siderays", "plasmawave", "ferrofluid", "softaurora", "dither", "darkveil", "ancidsquares", "webthreads", "balatro", "moltenmetal", "topography", "lighttunnel"];
function getRandomGalleryFromPool() {
  return GALLERIES_POOL[Math.floor(Math.random() * GALLERIES_POOL.length)];
}

const savedGallerySetting = localStorage.getItem("mcp_gallery");
const initialGallery = (savedGallerySetting && savedGallerySetting !== "random") ? savedGallerySetting : getRandomGalleryFromPool();

// State
const state = {
  currentGallery: initialGallery,
  speed: parseInt(localStorage.getItem("mcp_speed")) || 10000,
  currentIndex: 0,
  isMobile: false,
  timerId: null,
  activeFolder: "tools",
  selectedSuggestionIndex: -1
};

// Cinematic looped video wallpapers (CDN direct mp4 / m3u8 playlist with smooth cross-fade)
const CINEMATIC_VIDEOS = [
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_031045_0e1165dd-ab48-46e3-ad3d-5fe77f217647.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_115139_0fc6bd3d-3631-4d26-ab9b-28293887dcc9.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260411_104032_69319010-2458-492b-b04d-b40a5dfa4482.mp4",
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4",
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_055001_8e16d972-3b2b-441c-86ad-2901a54682f9.mp4",
  "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8"
];

// 4. Initialization
document.addEventListener("DOMContentLoaded", () => {
  detectDevice();
  initClock();
  initCalendar();
  initMoonPhase();
  initSeasonWidget();
  initSearch();
  initBackground();
  initSettings();
  initWeather();
  initMusicPlayer();
  initDockNavigation();
  initMotivationPopups();
  initLiquidMenus();
  initBackgroundPreloader();
  initKeyboardShortcuts();
  initDemoExperience();
  
  // Supabase Backend & Admin Engine Initializer
  initSystemLock();
  loadShortcutsFromSupabase();
  loadSubShortcutsFromSupabase();
  initAdminPanel();
  
  // Motor de Foco Ultra Rápido e Instantâneo na Barra de Pesquisa
  const focusSearchInput = () => {
    const searchInput = document.getElementById("search-input");
    const activeModal = document.querySelector(".modal-panel.open, #mandatory-popup.active");
    if (searchInput && document.activeElement !== searchInput && !activeModal) {
      searchInput.focus();
    }
  };

  // Foco imediato em múltiplos estágios do carregamento
  focusSearchInput();
  requestAnimationFrame(focusSearchInput);
  setTimeout(focusSearchInput, 50);
  setTimeout(focusSearchInput, 150);
  setTimeout(focusSearchInput, 300);

  // Re-foca imediatamente quando a aba ganha o foco do sistema/navegador (Cmd + T)
  window.addEventListener("focus", focusSearchInput);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      focusSearchInput();
    }
  });

  // Captura qualquer digitação direta ou atalhos (Cmd+K / Ctrl+K / '/') na página
  document.addEventListener("keydown", (e) => {
    const searchInput = document.getElementById("search-input");
    const activeEl = document.activeElement;
    const isInputActive = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);

    if (!isInputActive && searchInput) {
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && e.key !== " ") {
        searchInput.focus();
      }
    }
  });
});

// Digital Clock
function initClock() {
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date-display");

  function update() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
    
    dateEl.textContent = now.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  }

  update();
  setInterval(update, 1000);
}

// Calendar Widget
function initCalendar() {
  const monthYearEl = document.getElementById("calendar-month-year");
  const daysContainer = document.getElementById("calendar-days");
  const widget = document.getElementById("calendar-widget");

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  monthYearEl.textContent = `${months[month]} ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotalDays = new Date(year, month, 0).getDate();

  daysContainer.innerHTML = "";

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const span = document.createElement("span");
    span.className = "other-month";
    span.textContent = prevTotalDays - i;
    daysContainer.appendChild(span);
  }

  for (let d = 1; d <= totalDays; d++) {
    const span = document.createElement("span");
    if (d === today) {
      span.className = "today";
    }
    span.textContent = d;
    daysContainer.appendChild(span);
  }

  widget.addEventListener("click", () => {
    window.open("https://calendar.google.com/", "_blank");
  });
}

// Moon Phase Calculation
function initMoonPhase() {
  const iconEl = document.getElementById("moon-icon");
  const descEl = document.getElementById("moon-desc");

  const now = new Date();
  const lp = 2551443;
  const newMoon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  const age = phase / (24 * 3600);

  let icon = "🌑";
  let desc = "Lua Nova";

  if (age < 1.84566) {
    icon = "🌑"; desc = "Lua Nova";
  } else if (age < 5.53699) {
    icon = "🌒"; desc = "Lua Crescente Côncava";
  } else if (age < 9.22831) {
    icon = "🌓"; desc = "Quarto Crescente";
  } else if (age < 12.91964) {
    icon = "🌔"; desc = "Lua Gibosa Crescente";
  } else if (age < 16.61096) {
    icon = "🌕"; desc = "Lua Cheia";
  } else if (age < 20.30228) {
    icon = "🌖"; desc = "Lua Gibosa Minguante";
  } else if (age < 23.99361) {
    icon = "🌗"; desc = "Quarto Minguante";
  } else if (age < 27.68493) {
    icon = "🌘"; desc = "Lua Minguante Côncava";
  } else {
    icon = "🌑"; desc = "Lua Nova";
  }

  iconEl.textContent = icon;
  descEl.textContent = desc;
}

// Smart Search with Autocomplete / Command Mode / Keyboard Navigation
function initSearch() {
  const input = document.getElementById("search-input");
  const suggestions = document.getElementById("search-suggestions");
  const btnImages = document.getElementById("btn-images");

  btnImages.addEventListener("click", () => {
    const query = input.value.trim();
    if (query) {
      window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`, "_self");
    } else {
      window.open("https://images.google.com", "_self");
    }
  });

  input.addEventListener("input", () => {
    const val = input.value.trim();
    if (!val) {
      closeSuggestions();
      return;
    }

    if (val.startsWith("/")) {
      const searchCmd = val.slice(1).toLowerCase();
      const matchedFolders = Object.keys(FOLDERS).filter(k => 
        FOLDERS[k].name.toLowerCase().includes(searchCmd)
      );

      renderFolderSuggestions(matchedFolders);
      return;
    }

    const searchVal = val.toLowerCase();
    const matches = [];

    Object.keys(FOLDERS).forEach(folderKey => {
      const folder = FOLDERS[folderKey];
      folder.items.forEach(item => {
        if (item.name.toLowerCase().includes(searchVal)) {
          matches.push({
            name: item.name,
            url: item.url,
            folderName: folder.name
          });
        }
      });
    });

    renderLinkSuggestions(matches);
  });

  input.addEventListener("keydown", (e) => {
    const items = suggestions.querySelectorAll(".suggestion-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      state.selectedSuggestionIndex = (state.selectedSuggestionIndex + 1) % items.length;
      highlightSuggestion(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      state.selectedSuggestionIndex = (state.selectedSuggestionIndex - 1 + items.length) % items.length;
      highlightSuggestion(items);
    } else if (e.key === "Enter") {
      if (state.selectedSuggestionIndex >= 0) {
        e.preventDefault();
        items[state.selectedSuggestionIndex].click();
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !suggestions.contains(e.target)) {
      closeSuggestions();
    }
  });
}

function highlightSuggestion(items) {
  items.forEach((item, idx) => {
    if (idx === state.selectedSuggestionIndex) {
      item.classList.add("highlighted");
      item.scrollIntoView({ block: "nearest" });
    } else {
      item.classList.remove("highlighted");
    }
  });
}

function closeSuggestions() {
  const suggestions = document.getElementById("search-suggestions");
  suggestions.classList.remove("open");
  state.selectedSuggestionIndex = -1;
}

function renderFolderSuggestions(keys) {
  const suggestions = document.getElementById("search-suggestions");
  suggestions.innerHTML = "";

  if (keys.length === 0) {
    closeSuggestions();
    return;
  }

  keys.forEach(k => {
    const f = FOLDERS[k];
    const itemEl = document.createElement("div");
    itemEl.className = "suggestion-item";
    itemEl.innerHTML = `
      <span>📂</span>
      <strong>Abrir pasta: ${f.name}</strong>
    `;

    itemEl.addEventListener("click", () => {
      const btn = document.querySelector(`.dock-folder-btn[data-folder="${k}"]`);
      if (btn) btn.click();
      document.getElementById("search-input").value = "";
      closeSuggestions();
    });

    suggestions.appendChild(itemEl);
  });

  suggestions.classList.add("open");
}

function renderLinkSuggestions(matches) {
  const suggestions = document.getElementById("search-suggestions");
  suggestions.innerHTML = "";

  if (matches.length === 0) {
    closeSuggestions();
    return;
  }

  matches.slice(0, 8).forEach(match => {
    const itemEl = document.createElement("div");
    itemEl.className = "suggestion-item";
    
    const domain = new URL(match.url).hostname;
    const faviconUrl = getCleanFavicon(match.url);

    itemEl.innerHTML = `
      <img src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌐</text></svg>'">
      <span>${match.name}</span>
      <span class="suggestion-folder">${match.folderName}</span>
    `;

    itemEl.addEventListener("click", () => {
      window.open(match.url, "_self");
      document.getElementById("search-input").value = "";
      closeSuggestions();
    });

    suggestions.appendChild(itemEl);
  });

  suggestions.classList.add("open");
}

// 8. Background Slideshow & Video Wallpaper Engine (Playlist com dupla camada e cross-fade)
let currentVidIdx = 0;
let vid1Hls = null;
let vid2Hls = null;

function loadVideoSource(videoEl, url, isLayer1) {
  const hlsRef = isLayer1 ? vid1Hls : vid2Hls;
  if (hlsRef) {
    hlsRef.destroy();
    if (isLayer1) vid1Hls = null; else vid2Hls = null;
  }

  if (url.includes('.m3u8')) {
    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
      const hls = new Hls({ autoStartLoad: true });
      hls.loadSource(url);
      hls.attachMedia(videoEl);
      if (isLayer1) vid1Hls = hls; else vid2Hls = hls;
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.src = url;
    } else {
      videoEl.src = url;
    }
  } else {
    videoEl.src = url;
  }
}

function initBackground() {
  const slide1 = document.getElementById("bg-slide-1");
  const slide2 = document.getElementById("bg-slide-2");
  const video1 = document.getElementById("bg-video-1");
  const video2 = document.getElementById("bg-video-2");
  let activeSlide = slide1;
  let activeVidEl = video1;
  let nextVidEl = video2;
  let isVideoLoopRunning = false;

  function playNextVideoTrack() {
    if (state.currentGallery !== "video") return;

    video1.style.display = "block";
    video2.style.display = "block";
    slide1.style.display = "none";
    slide2.style.display = "none";

    const currentUrl = CINEMATIC_VIDEOS[currentVidIdx];
    const nextIdx = (currentVidIdx + 1) % CINEMATIC_VIDEOS.length;
    const nextUrl = CINEMATIC_VIDEOS[nextIdx];

    loadVideoSource(activeVidEl, currentUrl, activeVidEl === video1);
    activeVidEl.classList.add("active");
    nextVidEl.classList.remove("active");

    activeVidEl.play().catch(e => console.log("Erro no autoplay do vídeo:", e));

    // Pré-carrega o próximo vídeo na camada secundária
    loadVideoSource(nextVidEl, nextUrl, nextVidEl === video1);

    const onEnded = () => {
      activeVidEl.removeEventListener("ended", onEnded);
      nextVidEl.play().catch(e => console.log("Erro no próximo vídeo:", e));
      nextVidEl.classList.add("active");
      activeVidEl.classList.remove("active");

      setTimeout(() => {
        try { activeVidEl.pause(); } catch(e){}
        currentVidIdx = nextIdx;
        const temp = activeVidEl;
        activeVidEl = nextVidEl;
        nextVidEl = temp;
        playNextVideoTrack();
      }, 1500); // Duração do cross-fade
    };

    activeVidEl.addEventListener("ended", onEnded, { once: true });
  }

  function getNextImage() {
    if (state.currentGallery === "api") {
      const randomId = Math.floor(Math.random() * 1000);
      return `https://picsum.photos/1920/1080?random=${randomId}`;
    } else {
      const list = GALLERIES[state.currentGallery] || GALLERIES.gym;
      const img = list[state.currentIndex];
      state.currentIndex = (state.currentIndex + 1) % list.length;
      return img;
    }
  }

  const webglTypes = [
    "softaurora", "particles", "ghostfibers", "plasmawave", "strands",
    "siderays", "beams", "floatinglines", "silk", "radar",
    "ripplegrid", "pixelblast", "magicrings", "gridscan", "liquidchrome",
    "linewaves", "ferrofluid", "dither", "darkveil", "webthreads",
    "topography", "balatro", "faultyterminal", "morphslider", "antigravity",
    "aurora", "letterglitch", "plasma", "liquidether", "orb",
    "prism", "prismaticburst", "lightning", "evileye",
    "lighttunnel", "ancidsquares", "acidsquares", "moltenmetal"
  ];
  const reactBitsList = [
    "softaurora", "particles", "ghostfibers", "plasmawave", "strands",
    "siderays", "beams", "floatinglines", "silk", "radar",
    "ripplegrid", "pixelblast", "magicrings", "gridscan", "liquidchrome",
    "linewaves", "ferrofluid", "dither", "darkveil", "webthreads",
    "topography", "balatro", "faultyterminal", "morphslider", "antigravity",
    "aurora", "letterglitch", "plasma", "liquidether", "orb",
    "prism", "prismaticburst", "lightning", "evileye",
    "lighttunnel", "ancidsquares", "acidsquares", "moltenmetal"
  ];
  let galaxyBitsIndex = 0;
  let galaxyBitsTimer = null;

  const GALLERY_DISPLAY_NAMES = {
    softaurora: "Soft Aurora (WebGL)",
    particles: "3D Particles (WebGL)",
    ghostfibers: "Ghost Fibers (WebGL)",
    plasmawave: "Plasma Wave (WebGL)",
    strands: "Strands (WebGL)",
    siderays: "Side Rays (WebGL)",
    beams: "Volumetric Beams (WebGL)",
    floatinglines: "Floating Lines (WebGL)",
    silk: "Liquid Silk (WebGL)",
    radar: "Tactical Radar (WebGL)",
    ripplegrid: "Ripple Grid (WebGL)",
    pixelblast: "Pixel Blast (WebGL)",
    magicrings: "Magic Rings (WebGL)",
    gridscan: "Grid Scan (WebGL)",
    liquidchrome: "Liquid Chrome (WebGL)",
    linewaves: "Line Waves (WebGL)",
    ferrofluid: "Ferrofluid (WebGL)",
    dither: "Dither Matrix (WebGL)",
    darkveil: "Dark Veil (WebGL)",
    webthreads: "Web Threads (WebGL)",
    topography: "Topography (WebGL)",
    balatro: "Balatro (WebGL)",
    faultyterminal: "Faulty Terminal (WebGL)",
    morphslider: "Morph Slider (WebGL)",
    antigravity: "Antigravity (WebGL)",
    aurora: "Northern Aurora (WebGL)",
    letterglitch: "Letter Glitch (WebGL)",
    plasma: "Electric Plasma (WebGL)",
    liquidether: "Liquid Ether (WebGL)",
    orb: "Energy Orb (WebGL)",
    prism: "Prismatic Beam (WebGL)",
    prismaticburst: "Prismatic Burst (WebGL)",
    lightning: "Thunder Lightning (WebGL)",
    evileye: "Evil Eye (WebGL)",
    lighttunnel: "Light Tunnel (WebGL)",
    ancidsquares: "Acid Squares (WebGL)",
    acidsquares: "Acid Squares (WebGL)",
    moltenmetal: "Molten Metal (WebGL)",
    galaxybits: "Todos Shaders (Rotativo)",
    gym: "Gym Images (Galeria)",
    motivation: "Motivacional (Galeria)",
    soft: "Gen X Soft Club (Galeria)",
    red: "Red Aesthetic (Galeria)",
    flowers: "Flowers & Nature (Galeria)",
    api: "Unsplash Web API",
    video: "Cinematic Video 4K Loop",
    custom: "Personalizado"
  };

  function updateLockscreenBgDisplay(galleryKey) {
    const nameEl = document.getElementById("lockscreen-active-bg-name");
    const selectEl = document.getElementById("lockscreen-gallery-select");
    if (nameEl) {
      nameEl.textContent = GALLERY_DISPLAY_NAMES[galleryKey] || (galleryKey ? galleryKey.toUpperCase() : "Ativo");
    }
    if (selectEl) {
      const saved = localStorage.getItem("mcp_gallery");
      selectEl.value = (saved === "random" || !saved) ? "random" : galleryKey;
    }
  }

  function changeBg() {
    const webglContainer = document.getElementById("bg-webgl-container");
    const savedSetting = localStorage.getItem("mcp_gallery");
    const isRandomMode = !savedSetting || savedSetting === "random";

    if (isRandomMode) {
      state.currentGallery = getRandomGalleryFromPool();
    }

    updateLockscreenBgDisplay(state.currentGallery);

    if (galaxyBitsTimer) {
      clearInterval(galaxyBitsTimer);
      galaxyBitsTimer = null;
    }

    if (state.currentGallery === "custom") {
      isVideoLoopRunning = false;
      if (typeof window.stopWebGLBackground === "function") window.stopWebGLBackground();
      if (webglContainer) webglContainer.style.display = "none";
      const savedCustom = localStorage.getItem("mcp_custom_active_bg");
      let customLoaded = false;
      if (savedCustom) {
        try {
          const item = JSON.parse(savedCustom);
          if (item && (item.url || item.id)) {
            applyCustomBackground(item, false);
            customLoaded = true;
          }
        } catch (e) {}
      }
      if (!customLoaded) {
        state.currentGallery = "dither";
        localStorage.setItem("mcp_gallery", "dither");
        localStorage.removeItem("mcp_custom_active_bg");
        const gallerySelect = document.getElementById("gallery-select");
        if (gallerySelect) gallerySelect.value = "dither";
      } else {
        return;
      }
    }

    if (state.currentGallery === "galaxybits") {
      isVideoLoopRunning = false;
      video1.style.display = "none";
      video2.style.display = "none";
      slide1.style.display = "none";
      slide2.style.display = "none";
      if (webglContainer) webglContainer.style.display = "block";

      if (typeof window.renderWebGLBackground === "function") {
        window.renderWebGLBackground(reactBitsList[galaxyBitsIndex]);
        galaxyBitsIndex = (galaxyBitsIndex + 1) % reactBitsList.length;
      }
      return;
    }

    if (webglTypes.includes(state.currentGallery)) {
      isVideoLoopRunning = false;
      video1.style.display = "none";
      video2.style.display = "none";
      slide1.style.display = "none";
      slide2.style.display = "none";
      if (webglContainer) webglContainer.style.display = "block";
      if (typeof window.renderWebGLBackground === "function") {
        window.renderWebGLBackground(state.currentGallery);
      }
      return;
    } else {
      if (typeof window.stopWebGLBackground === "function") {
        window.stopWebGLBackground();
      }
      if (webglContainer) webglContainer.style.display = "none";
    }

    if (state.currentGallery === "video") {
      slide1.style.display = "none";
      slide2.style.display = "none";
      if (!isVideoLoopRunning) {
        isVideoLoopRunning = true;
        playNextVideoTrack();
      }
      return;
    }

    isVideoLoopRunning = false;
    video1.style.display = "none";
    video2.style.display = "none";
    slide1.style.display = "block";
    slide2.style.display = "block";

    const nextImgUrl = getNextImage();
    const nextSlide = activeSlide === slide1 ? slide2 : slide1;

    const tempImg = new Image();
    tempImg.src = nextImgUrl;
    tempImg.onload = () => {
      nextSlide.style.backgroundImage = `url("${nextImgUrl}")`;
      nextSlide.classList.add("active");
      activeSlide.classList.remove("active");
      activeSlide = nextSlide;
    };
  }

  changeBg();

  function startInterval() {
    if (state.timerId) clearInterval(state.timerId);
    state.timerId = setInterval(changeBg, state.speed);
  }

  startInterval();

  window.updateBackgroundEngine = () => {
    state.currentIndex = 0;
    changeBg();
    startInterval();
  };
}

// 9. Dock Navigation & Dynamic Folder Rendering
function initDockNavigation() {
  const buttons = document.querySelectorAll(".dock-folder-btn");
  
  renderActiveFolder();

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      
      const folderKey = btn.getAttribute("data-folder");
      btn.classList.add("active");
      state.activeFolder = folderKey;
      
      renderActiveFolder();

      // Rola automaticamente para o grid de apps no mobile para dar feedback visual imediato
      if (window.innerWidth <= 1024) {
        const rightContent = document.getElementById("desktop-right-content");
        if (rightContent) {
          rightContent.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });
}

// Clean Favicon Grabber with robust error support
function getCleanFavicon(urlStr) {
  try {
    const url = new URL(urlStr);
    const domain = url.hostname;
    
    const overrides = {
      "notion.so": "https://www.notion.so/images/favicon.ico",
      "notion.com": "https://www.notion.so/images/favicon.ico",
      "chatgpt.com": "https://cdn.oaistatic.com/_next/static/media/favicon-32x32.be48395e.png",
      "vercel.com": "https://assets.vercel.com/image/upload/q_auto/front/favicon/vercel/180x180.png",
      "github.com": "https://github.githubassets.com/favicons/favicon.png",
      "discord.com": "https://discord.com/assets/847541504914fd33810e70a0ea73177e.ico",
      "gemini.google.com": "https://www.gstatic.com/lamda/images/favicon_v1_150160cddff7f294ce30.svg",
      "aistudio.google.com": "https://www.gstatic.com/devrel-devsite/prod/vc89eb3b235ed186f685f81e3a758dd9ee1f39f37c4149dc82f7d6a5068cfcc94/developers/images/favicon.png"
    };

    for (const [key, val] of Object.entries(overrides)) {
      if (domain.includes(key)) return val;
    }
    
    // Using DuckDuckGo icon API as it is generally more reliable and high-res than Google's
    return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  } catch (e) {
    return "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌐</text></svg>";
  }
}

function renderActiveFolder() {
  const folder = FOLDERS[state.activeFolder];
  if (!folder) return;

  const headerIcon = document.getElementById("active-folder-icon");
  const headerName = document.getElementById("active-folder-name");
  const gridContainer = document.getElementById("active-folder-grid");

  if (headerIcon) headerIcon.textContent = folder.icon;
  if (headerName) headerName.textContent = folder.name;
  if (gridContainer) {
    gridContainer.innerHTML = "";
    folder.items.forEach((item, index) => {
      const card = createCardElement(item, index);
      gridContainer.appendChild(card);
    });
  }

  setupDeepLinks();
}

function createCardElement(item, index = 0) {
  const card = document.createElement("a");
  card.className = "active-folder-card";
  card.href = item.url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("tabindex", "0");
  card.style.setProperty("--card-idx", index);

  if (item.mobile) {
    card.setAttribute("data-mobile", item.mobile);
  }

  const faviconUrl = getCleanFavicon(item.url);

  card.innerHTML = `
    <img src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2280%22>🌐</text></svg>'">
    <span>${item.name}</span>
  `;

  return card;
}

// 10. Settings Modal Management
function initSettings() {
  const btn = document.getElementById("settings-btn");
  const modal = document.getElementById("settings-modal");
  const close = document.querySelector("#settings-modal .modal-close");
  const backdrop = document.getElementById("settings-backdrop");

  const selectGallery = document.getElementById("gallery-select");
  const speedSlider = document.getElementById("custom-speed-slider");
  const speedValDisplay = document.getElementById("speed-val-display");
  const randomizeBtn = document.getElementById("randomize-bg-btn");

  const currentSaved = localStorage.getItem("mcp_gallery");
  selectGallery.value = currentSaved || "random";

  const savedSpeedMs = parseInt(localStorage.getItem("mcp_speed")) || 10000;
  const savedSpeedSec = Math.min(Math.max(Math.round(savedSpeedMs / 1000), 5), 200);
  state.speed = savedSpeedSec * 1000;

  if (speedSlider) {
    speedSlider.value = savedSpeedSec;
    if (speedValDisplay) speedValDisplay.textContent = savedSpeedSec;

    speedSlider.addEventListener("input", (e) => {
      const sec = parseInt(e.target.value);
      if (speedValDisplay) speedValDisplay.textContent = sec;
      state.speed = sec * 1000;
      localStorage.setItem("mcp_speed", state.speed);
      window.updateBackgroundEngine();
    });
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    modal.classList.add("open");
  });

  close.addEventListener("click", () => modal.classList.remove("open"));
  backdrop.addEventListener("click", () => modal.classList.remove("open"));

  selectGallery.addEventListener("change", async (e) => {
    const val = e.target.value;
    localStorage.setItem("mcp_gallery", val);
    localStorage.removeItem("mcp_custom_active_bg");
    if (val === "random") {
      state.currentGallery = getRandomGalleryFromPool();
    } else {
      state.currentGallery = val;
    }
    window.updateBackgroundEngine();

    if (supabaseClient) {
      try {
        await supabaseClient.from('app_config').upsert([
          { key: 'active_background', value: val, updated_at: new Date().toISOString() },
          { key: 'active_custom_bg', value: '', updated_at: new Date().toISOString() }
        ], { onConflict: 'key' });

        const bc = supabaseClient.channel('mcp_active_bg_broadcast');
        await bc.send({
          type: 'broadcast',
          event: 'active_bg_changed',
          payload: { active_background: val, active_custom_bg: '' }
        });
      } catch (err) {
        console.warn("[MCP] Erro ao sincronizar wallpaper no Supabase:", err);
      }
    }
  });

  if (randomizeBtn) {
    randomizeBtn.addEventListener("click", async () => {
      const val = getRandomGalleryFromPool();
      state.currentGallery = val;
      localStorage.setItem("mcp_gallery", val);
      localStorage.removeItem("mcp_custom_active_bg");
      if (selectGallery) selectGallery.value = val;
      window.updateBackgroundEngine();

      if (supabaseClient) {
        try {
          await supabaseClient.from('app_config').upsert([
            { key: 'active_background', value: val, updated_at: new Date().toISOString() },
            { key: 'active_custom_bg', value: '', updated_at: new Date().toISOString() }
          ], { onConflict: 'key' });

          const bc = supabaseClient.channel('mcp_active_bg_broadcast');
          await bc.send({
            type: 'broadcast',
            event: 'active_bg_changed',
            payload: { active_background: val, active_custom_bg: '' }
          });
        } catch (err) {
          console.warn("[MCP] Erro ao sincronizar randomize no Supabase:", err);
        }
      }
    });
  }
}

// 11. Sete Lagoas Weather API
async function initWeather() {
  const tempEl = document.getElementById("weather-temp");
  const descEl = document.getElementById("weather-desc");
  const humidityEl = document.getElementById("weather-humidity");
  const aqiEl = document.getElementById("weather-aqi");

  const weatherCodes = {
    0: "Céu Limpo",
    1: "Limpo", 2: "Parcialmente Nublado", 3: "Nublado",
    45: "Neblina", 48: "Nevoeiro",
    51: "Chuvisco Leve", 53: "Chuvisco", 55: "Chuvisco Forte",
    61: "Chuva Leve", 63: "Chuva", 65: "Chuva Forte",
    80: "Pancadas Leves", 81: "Pancadas", 82: "Pancadas Fortes",
    95: "Trovoada", 96: "Trovoada c/ Granizo"
  };

  try {
    const weatherRes = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-19.4658&longitude=-44.2467&current=temperature_2m,relative_humidity_2m,weather_code");
    if (!weatherRes.ok) throw new Error();
    const weatherData = await weatherRes.json();

    const temp = Math.round(weatherData.current.temperature_2m);
    const humidity = weatherData.current.relative_humidity_2m;
    const code = weatherData.current.weather_code;
    const desc = weatherCodes[code] || "Nublado";

    tempEl.textContent = `${temp}°C`;
    descEl.textContent = desc;
    humidityEl.textContent = `${humidity}%`;

    const aqiRes = await fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=-19.4658&longitude=-44.2467&current=pm2_5");
    if (aqiRes.ok) {
      const aqiData = await aqiRes.json();
      const pm25 = aqiData.current.pm2_5;
      
      let rating = "Excelente";
      if (pm25 > 12 && pm25 <= 35) rating = "Regular";
      else if (pm25 > 35 && pm25 <= 55) rating = "Moderada";
      else if (pm25 > 55) rating = "Ruim";

      aqiEl.textContent = rating;
    }
  } catch (error) {
    tempEl.textContent = "24°C";
    descEl.textContent = "Céu Limpo";
    humidityEl.textContent = "62%";
    aqiEl.textContent = "Excelente";
  }
}

// 12. Music Central Options (No open both button)
function initMusicPlayer() {
  const widget = document.getElementById("music-player-widget");
  const modal = document.getElementById("music-modal");
  const close = document.querySelector("#music-modal .modal-close");
  const backdrop = document.getElementById("music-backdrop");

  const openIbroadcast = document.getElementById("open-ibroadcast");
  const openBinaural = document.getElementById("open-binaural");

  const iBroadcastUrl = "https://media.ibroadcast.com/?view=library&groupby=listview";
  const binauralUrl = "https://m-c-p-os-binaural-pro.vercel.app/";

  widget.addEventListener("click", () => {
    modal.classList.add("open");
    widget.classList.add("playing");
  });

  const closeModal = () => {
    modal.classList.remove("open");
    widget.classList.remove("playing");
  };
  close.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  openIbroadcast.addEventListener("click", () => {
    window.open(iBroadcastUrl, "_self");
    closeModal();
  });

  openBinaural.addEventListener("click", () => {
    window.open(binauralUrl, "_self");
    closeModal();
  });
}

// 13. Season Widget (Época do Ano % Restante)
function initSeasonWidget() {
  const iconEl = document.getElementById("season-icon");
  const titleEl = document.getElementById("season-title");
  const percentageEl = document.getElementById("season-percentage");
  const descEl = document.getElementById("season-desc");
  const progressFill = document.getElementById("season-progress-fill");

  if (!iconEl || !titleEl || !percentageEl || !descEl || !progressFill) return;

  const now = new Date();
  const year = now.getFullYear();

  const seasons = [
    {
      name: "Verão",
      icon: "☀️",
      start: new Date(year, 11, 21),
      end: new Date(year + 1, 2, 20, 23, 59, 59),
      nextSeason: "Outono"
    },
    {
      name: "Outono",
      icon: "🍂",
      start: new Date(year, 2, 21),
      end: new Date(year, 5, 20, 23, 59, 59),
      nextSeason: "Inverno"
    },
    {
      name: "Inverno",
      icon: "❄️",
      start: new Date(year, 5, 21),
      end: new Date(year, 8, 22, 23, 59, 59),
      nextSeason: "Primavera"
    },
    {
      name: "Primavera",
      icon: "🌸",
      start: new Date(year, 8, 23),
      end: new Date(year, 11, 20, 23, 59, 59),
      nextSeason: "Verão"
    }
  ];

  let currentSeason = seasons.find(s => {
    if (s.name === "Verão") {
      const janMarEnd = new Date(year, 2, 20, 23, 59, 59);
      const janMarStart = new Date(year - 1, 11, 21);
      if (now >= janMarStart && now <= janMarEnd) {
        s.start = janMarStart;
        s.end = janMarEnd;
        return true;
      }
    }
    return now >= s.start && now <= s.end;
  });

  if (!currentSeason) currentSeason = seasons[2]; // Fallback para Inverno

  const totalMs = currentSeason.end.getTime() - currentSeason.start.getTime();
  const elapsedMs = now.getTime() - currentSeason.start.getTime();
  const remainingMs = currentSeason.end.getTime() - now.getTime();

  const remainingPct = Math.max(0, Math.min(100, Math.round((remainingMs / totalMs) * 100)));
  const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

  iconEl.textContent = currentSeason.icon;
  titleEl.textContent = `${currentSeason.name} ${year}`;
  percentageEl.textContent = `${remainingPct}% Restante`;
  descEl.textContent = `${remainingDays} dias para o ${currentSeason.nextSeason}`;
  progressFill.style.width = `${100 - remainingPct}%`;
}

// 14. Mandatory Purpose Popup (Randomized, Max 3 times/day, Dismiss on anywhere click)
function initMotivationPopups() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("mcp_mot_date");
  let count = parseInt(localStorage.getItem("mcp_mot_count") || "0");

  if (savedDate !== today) {
    localStorage.setItem("mcp_mot_date", today);
    count = 0;
    localStorage.setItem("mcp_mot_count", "0");
  }

  if (count >= 3) {
    return; // Limite diário atingido
  }

  // 40% de chance de disparar ao abrir/recarregar a página
  const shouldTrigger = Math.random() < 0.4;
  if (!shouldTrigger) {
    return;
  }

  // Delay aleatório entre 6 e 25 segundos para parecer inesperado ao longo do dia
  const randomDelay = Math.floor(Math.random() * (25000 - 6000 + 1)) + 6000;

  const mandatoryPopup = document.getElementById("mandatory-popup");
  const bgSlider = document.getElementById("mandatory-bg-slider");

  const isHomePageOnly = () => {
    // 1. Não exibir na tela de login / lock screen
    if (document.body.classList.contains("locked")) return false;
    const lockOverlay = document.getElementById("system-lock-overlay");
    if (lockOverlay && !lockOverlay.classList.contains("unlocked")) return false;

    // 2. Não exibir no Painel Admin
    const adminModal = document.getElementById("admin-modal");
    if (adminModal && (adminModal.style.display === "block" || adminModal.style.display === "flex" || adminModal.classList.contains("open"))) return false;

    // 3. Não exibir nas Configurações
    const settingsModal = document.getElementById("settings-modal");
    if (settingsModal && (settingsModal.style.display === "block" || settingsModal.style.display === "flex" || settingsModal.classList.contains("open"))) return false;

    // 4. Não exibir em diálogos customizados
    const dialogModal = document.getElementById("custom-dialog-modal");
    if (dialogModal && (dialogModal.style.display === "block" || dialogModal.style.display === "flex" || dialogModal.classList.contains("open"))) return false;

    return true;
  };

  setTimeout(() => {
    // Checagem rigorosa: só exibe se o usuário estiver estritamente na HOME PAGE limpa
    if (!isHomePageOnly() || !mandatoryPopup) {
      return;
    }

    // Incrementa o contador do dia
    count++;
    localStorage.setItem("mcp_mot_count", count.toString());

    mandatoryPopup.classList.add("open");
    
    let bgIndex = 0;
    const mList = GALLERIES["motivation"] || [];
    let fastBgInterval = null;

    if (mList.length > 0 && bgSlider) {
      bgSlider.style.backgroundImage = `url("${mList[0]}")`;
      fastBgInterval = setInterval(() => {
        bgIndex = (bgIndex + 1) % mList.length;
        bgSlider.style.backgroundImage = `url("${mList[bgIndex]}")`;
      }, 150); // Alta velocidade (150ms)
    }

    const closePopup = () => {
      mandatoryPopup.classList.remove("open");
      if (fastBgInterval) clearInterval(fastBgInterval);
    };

    // Dispensa clicando em absolutamente qualquer lugar da tela
    mandatoryPopup.addEventListener("click", closePopup, { once: true });

  }, randomDelay);
}

// 15. Liquid Glass Menus
//     Abertura no MOBILE é feita por CSS puro (.dock-item-wrapper:focus-within),
//     então funciona MESMO com JavaScript limitado/desativado (ex.: Tor Browser).
//     O JS abaixo é só aprimoramento: hover no desktop + "tocar de novo/fora p/ fechar".
//     Tudo é dirigido pelo evento `click` (bem definido) — sem corridas de touch-timing.
function initLiquidMenus() {
  const menus = [
    { trigger: document.getElementById("youtube-dock-trigger"), menu: document.getElementById("youtube-liquid-menu") },
    { trigger: document.getElementById("sphere-dock-trigger"),  menu: document.getElementById("sphere-liquid-menu")  },
    { trigger: document.getElementById("google-dock-trigger"),  menu: document.getElementById("google-liquid-menu")  }
  ].filter(m => m.trigger && m.menu);

  let openTrigger = null;

  const closeAll = () => {
    menus.forEach(m => m.menu.classList.remove("open"));
    if (openTrigger) { openTrigger.blur(); openTrigger = null; }
  };

  menus.forEach(({ trigger, menu }) => {
    // Clique/toque: abre; um segundo toque no mesmo ícone fecha.
    // (No mobile o :focus-within do CSS já revela o menu; aqui mantemos o estado
    //  em sincronia e damos o "toggle" ao re-tocar — daí o blur ao fechar.)
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isReTap = (openTrigger === trigger);
      menus.forEach(m => { if (m.trigger !== trigger) m.menu.classList.remove("open"); });
      if (isReTap) {
        menu.classList.remove("open");
        trigger.blur();          // solta o foco → :focus-within deixa de valer → fecha
        openTrigger = null;
      } else {
        menu.classList.add("open");
        openTrigger = trigger;
      }
    });

    // ─── Desktop: hover suave (exclusivo para cursor de mouse) ───
    const wrapper = trigger.closest(".dock-item-wrapper") || trigger;
    let hoverTimer = null;

    wrapper.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        menus.forEach(m => { if (m.trigger !== trigger) m.menu.classList.remove("open"); });
        menu.classList.add("open");
      }, 120);
    });

    wrapper.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (openTrigger !== trigger) menu.classList.remove("open"); // não fecha o que foi "travado" por clique
      }, 250);
    });
  });

  // ─── Fecha menus abertos ao tocar/clicar fora ───
  const closeIfOutside = (e) => {
    const inside = menus.some(({ trigger, menu }) => trigger.contains(e.target) || menu.contains(e.target));
    if (!inside) closeAll();
  };

  document.addEventListener("click", closeIfOutside);
  document.addEventListener("touchstart", closeIfOutside, { passive: true });
}

// 16. Background Preloader & Offline Caching System (Zero Netlify Bandwidth)
function initBackgroundPreloader() {
  if ('serviceWorker' in navigator) {
    // Force unregister old SW to bust cache completely
    navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(r => r.unregister());
    }).finally(() => {
      navigator.serviceWorker.register('./sw.js').then(reg => {
        console.log('Service Worker registrado:', reg.scope);
      }).catch(err => {
        console.log('Erro ao registrar Service Worker:', err);
      });
    });
  }

  window.addEventListener('load', () => {
    const prefetchAssets = () => {
      Object.values(GALLERIES).forEach(list => {
        if (Array.isArray(list)) {
          list.forEach(src => fetch(src, { mode: 'no-cors' }).catch(() => {}));
        }
      });
      CINEMATIC_VIDEOS.forEach(src => fetch(src, { mode: 'no-cors' }).catch(() => {}));
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetchAssets);
    } else {
      setTimeout(prefetchAssets, 2500);
    }
  });
}

// 16. Mobile Device Detection & Deep Links Fallback
function detectDevice() {
  state.isMobile = /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent) || window.innerWidth <= 768;
}

function setupDeepLinks() {
  if (!state.isMobile) return;

  const links = document.querySelectorAll("a[data-mobile]");
  links.forEach(a => {
    const webUrl = a.href;
    const mobileScheme = a.getAttribute("data-mobile");

    a.addEventListener("click", (e) => {
      e.preventDefault();
      
      const start = Date.now();
      window.location.href = mobileScheme;

      setTimeout(() => {
        if (Date.now() - start < 2000) {
          window.open(webUrl, "_self");
        }
      }, 1500);
    });
  });
}

// 17. System Keyboard Shortcuts & Spatial Arrow Navigation
function initKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    const isShift = e.shiftKey;
    const key = e.key ? e.key.toLowerCase() : "";

    // Shortcut: Shift + M ou Shift + K (ou Shift + M + K) => Abrir/Focar barra de busca geral
    if (isShift && (key === "m" || key === "k")) {
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      const isInputActive = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);
      if (!isInputActive) {
        e.preventDefault();
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
          searchInput.focus();
          searchInput.select();
        }
        return;
      }
    }

    // Setinhas do teclado (ArrowUp, ArrowDown, ArrowLeft, ArrowRight) => Mover foco entre os cards do app
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      const isInputActive = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);

      // Não interceptar se o usuário estiver digitando em um campo de texto ou caixa de pesquisa
      if (isInputActive) {
        return;
      }

      const cards = Array.from(document.querySelectorAll("#active-folder-grid .active-folder-card"))
        .filter(el => el.offsetWidth > 0 && el.offsetHeight > 0);

      if (cards.length === 0) return;

      const focusedIndex = cards.indexOf(document.activeElement);

      if (focusedIndex === -1) {
        e.preventDefault();
        cards[0].focus();
        cards[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }

      e.preventDefault();

      const currentCard = cards[focusedIndex];
      const rect = currentCard.getBoundingClientRect();
      let targetCard = null;

      if (e.key === "ArrowRight") {
        const candidates = cards.filter(c => c !== currentCard && c.getBoundingClientRect().left >= rect.right - 10 && Math.abs(c.getBoundingClientRect().top - rect.top) < rect.height * 0.8);
        if (candidates.length > 0) {
          candidates.sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
          targetCard = candidates[0];
        } else if (focusedIndex < cards.length - 1) {
          targetCard = cards[focusedIndex + 1];
        }
      } else if (e.key === "ArrowLeft") {
        const candidates = cards.filter(c => c !== currentCard && c.getBoundingClientRect().right <= rect.left + 10 && Math.abs(c.getBoundingClientRect().top - rect.top) < rect.height * 0.8);
        if (candidates.length > 0) {
          candidates.sort((a, b) => b.getBoundingClientRect().right - a.getBoundingClientRect().right);
          targetCard = candidates[0];
        } else if (focusedIndex > 0) {
          targetCard = cards[focusedIndex - 1];
        }
      } else if (e.key === "ArrowDown") {
        const candidates = cards.filter(c => c.getBoundingClientRect().top >= rect.bottom - 10);
        if (candidates.length > 0) {
          candidates.sort((a, b) => {
            const rA = a.getBoundingClientRect();
            const rB = b.getBoundingClientRect();
            const distA = Math.hypot(rA.left - rect.left, rA.top - rect.bottom);
            const distB = Math.hypot(rB.left - rect.left, rB.top - rect.bottom);
            return distA - distB;
          });
          targetCard = candidates[0];
        }
      } else if (e.key === "ArrowUp") {
        const candidates = cards.filter(c => c.getBoundingClientRect().bottom <= rect.top + 10);
        if (candidates.length > 0) {
          candidates.sort((a, b) => {
            const rA = a.getBoundingClientRect();
            const rB = b.getBoundingClientRect();
            const distA = Math.hypot(rA.left - rect.left, rect.top - rA.bottom);
            const distB = Math.hypot(rB.left - rect.left, rect.top - rB.bottom);
            return distA - distB;
          });
          targetCard = candidates[0];
        }
      }

      if (targetCard) {
        targetCard.focus();
        targetCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  });
}

/* =========================================================
   SUPABASE BACKEND & ADMIN PANEL SAAS ENGINE
   ========================================================= */

const SUPABASE_URL = "https://jfxxmhthwoggffrvkflv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeHhtaHRod29nZ2ZmcnZrZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDUyOTEsImV4cCI6MjEwMzI4MTI5MX0.yBYGdnsV2i-QOXytEtNhRsTBez1AfA67q9ct-4-ZrEw";
let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage: window.localStorage
    }
  });
  // Sincroniza mídias no cache offline para zerar consumo de banda
  setTimeout(() => {
    if (window.McpMediaCacheManager) {
      window.McpMediaCacheManager.syncAllFromSupabase(supabaseClient);
    }
  }, 1000);
}

// Gerenciamento de Cookie de Sessão do Navegador (Session Cookie)
// O cookie dura continuamente enquanto o navegador estiver aberto e é removido automaticamente quando o browser fecha.
function setAdminCookie(sessionToken, userEmail = "demo@mcpos.dev") {
  document.documentElement.classList.add('is-authenticated');
  const secure = location.protocol === 'https:' ? ';Secure' : '';
  // Sem max-age e sem expires => Cookie de Sessão Puro (removido pelo browser ao fechar)
  document.cookie = `mcp_admin_session=${encodeURIComponent(sessionToken)};path=/;SameSite=Lax${secure}`;
  document.cookie = `mcp_admin_email=${encodeURIComponent(userEmail)};path=/;SameSite=Lax${secure}`;
  
  try {
    sessionStorage.setItem('mcp_admin_session', sessionToken);
    sessionStorage.setItem('mcp_admin_email', userEmail);
    // Limpeza de chaves legadas de persistência permanente para evitar bypass ao fechar o browser
    localStorage.removeItem('mcp_admin_session');
    localStorage.removeItem('mcp_admin_email');
    localStorage.removeItem('mcp_admin_auth_timestamp');
  } catch (e) {
    console.warn("Storage indisponível para sessão admin:", e);
  }
}

function getAdminCookie() {
  const name = "mcp_admin_session=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) return decodeURIComponent(c.substring(name.length, c.length));
  }
  try {
    return sessionStorage.getItem('mcp_admin_session');
  } catch (e) {
    return null;
  }
}

function getAdminEmail() {
  const name = "mcp_admin_email=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) return decodeURIComponent(c.substring(name.length, c.length));
  }
  try {
    return sessionStorage.getItem('mcp_admin_email') || 'demo@mcpos.dev';
  } catch (e) {
    return 'demo@mcpos.dev';
  }
}

function clearAdminCookie() {
  document.documentElement.classList.remove('is-authenticated');
  const secure = location.protocol === 'https:' ? ';Secure' : '';
  document.cookie = `mcp_admin_session=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${secure}`;
  document.cookie = `mcp_admin_email=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${secure}`;
  try {
    sessionStorage.removeItem('mcp_admin_session');
    sessionStorage.removeItem('mcp_admin_email');
    localStorage.removeItem('mcp_admin_session');
    localStorage.removeItem('mcp_admin_email');
    localStorage.removeItem('mcp_admin_auth_timestamp');
  } catch (e) {}
}

async function isUserAuthenticatedAdmin() {
  // 1. O cookie de sessão do navegador é a fonte de verdade obrigatória:
  // Se o navegador foi fechado, o cookie de sessão deixou de existir no browser.
  const token = getAdminCookie();
  if (!token) {
    return false;
  }

  // 2. Se o cookie de sessão está ativo, valida se há sessão no Supabase Auth
  if (supabaseClient) {
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (data && data.session && data.session.user) {
        return true;
      }
    } catch (e) {}
  }
  
  // 3. Enquanto o cookie de sessão do navegador existir, a sessão permanece ativa e válida
  // sem interrupção arbitrária por timer enquanto o usuário mantiver o navegador aberto.
  return true;
}

// Supabase Data Loaders
// ------------------------------------------------------------------
// Realtime cross-device: assinaturas do último estado aplicado. Servem
// para reaplicar SÓ quando algo mudou de fato, deixando o refresh/poll
// do mobile silencioso (sem re-render nem "piscar" a tela à toa).
// ------------------------------------------------------------------
let __mcpSigShortcuts = null;
let __mcpSigSubShortcuts = null;
let __mcpSigActiveBg = null;
let __mcpSigGallery = null;
let __mcpInitialLoadComplete = false;
// Snapshot of each super-icon menu's default (index.html) links, captured once
// before any Supabase render so custom sub-shortcuts APPEND to the curated
// defaults instead of wiping them — and so deleting all custom entries restores
// the defaults. Keyed by parent_key (google/youtube/sphere).
const __mcpDefaultMenuHTML = {};

async function loadShortcutsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('shortcuts').select('*').order('order_index', { ascending: true });
    if (error) {
      console.warn("Supabase load shortcuts warning:", error);
      return;
    }
    const sig = JSON.stringify(data || []);
    if (sig === __mcpSigShortcuts) return; // nada mudou → evita re-render
    __mcpSigShortcuts = sig;
    __mcpInitialLoadComplete = true;
    if (data && data.length > 0) {
      const dbFolders = {};
      data.forEach(item => {
        if (!dbFolders[item.folder]) {
          dbFolders[item.folder] = [];
        }
        dbFolders[item.folder].push({
          id: item.id,
          name: item.name,
          url: item.url,
          icon: item.icon || "",
          description: item.description || "",
          mobile: item.mobile || ""
        });
      });

      Object.keys(dbFolders).forEach(folderKey => {
        if (FOLDERS[folderKey]) {
          FOLDERS[folderKey].items = dbFolders[folderKey];
        }
      });

      if (typeof renderActiveFolder === 'function') {
        renderActiveFolder();
      }
    }
  } catch (err) {
    console.error("Erro ao carregar atalhos do Supabase:", err);
  }
}

async function loadSubShortcutsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient.from('sub_shortcuts').select('*').order('order_index', { ascending: true });
    if (error) {
      console.warn("Supabase load subshortcuts warning:", error);
      return;
    }
    const sig = JSON.stringify(data || []);
    if (sig === __mcpSigSubShortcuts) return; // nada mudou → evita re-render
    __mcpSigSubShortcuts = sig;

    const parents = ['google', 'youtube', 'sphere'];

    // Capture each menu's default links exactly once, before we ever mutate it,
    // so custom sub-shortcuts append to the curated defaults instead of wiping them.
    parents.forEach(parentKey => {
      const menuEl = document.getElementById(`${parentKey}-liquid-menu`);
      if (menuEl && __mcpDefaultMenuHTML[parentKey] === undefined) {
        __mcpDefaultMenuHTML[parentKey] = menuEl.innerHTML;
      }
    });

    const groups = { google: [], youtube: [], sphere: [] };
    (data || []).forEach(item => {
      if (!groups[item.parent_key]) groups[item.parent_key] = [];
      groups[item.parent_key].push(item);
    });

    // Rebuild every menu. The Supabase table is the SINGLE SOURCE OF TRUTH:
    // when a parent has rows we render ONLY those rows (replace) — never the
    // hardcoded defaults on top of them, which is what caused every link to
    // appear twice. The captured defaults are used ONLY as a fallback when the
    // parent has zero rows (e.g. all custom entries were deleted), which also
    // makes deletions propagate cleanly across devices via realtime.
    parents.forEach(parentKey => {
      const menuEl = document.getElementById(`${parentKey}-liquid-menu`);
      if (!menuEl) return;
      const items = groups[parentKey] || [];
      if (items.length > 0) {
        menuEl.innerHTML = items.map(sub => {
          const iconHtml = sub.icon ? `${sub.icon} ` : '';
          return `<a href="${sub.url}" target="_self">${iconHtml}${sub.name}</a>`;
        }).join('');
      } else {
        menuEl.innerHTML = __mcpDefaultMenuHTML[parentKey] || '';
      }
    });
  } catch (err) {
    console.error("Erro ao carregar sub-atalhos do Supabase:", err);
  }
}

// Admin Modal Controller (Acesso Direto Unificado)
function initAdminPanel() {
  const adminBtn = document.getElementById("admin-panel-btn");
  const adminModal = document.getElementById("admin-modal");
  const adminClose = document.getElementById("admin-close");
  const adminBackdrop = document.getElementById("admin-backdrop");
  const dashboardView = document.getElementById("admin-dashboard-view");
  const logoutBtn = document.getElementById("btn-admin-logout");

  const tabShortcutsBtn = document.getElementById("tab-btn-shortcuts");
  const tabSubshortcutsBtn = document.getElementById("tab-btn-subshortcuts");
  const tabShortcuts = document.getElementById("tab-shortcuts");
  const tabSubshortcuts = document.getElementById("tab-subshortcuts");

  const formAddShortcut = document.getElementById("form-add-shortcut");
  const formAddSubshortcut = document.getElementById("form-add-subshortcut");

  if (!adminModal) return;

  const openAdminModal = () => {
    const settingsModal = document.getElementById("settings-modal");
    if (settingsModal) settingsModal.classList.remove("open");
    adminModal.classList.add("open");
    if (dashboardView) dashboardView.style.display = "block";
    renderAdminShortcutsList();
    renderAdminSubshortcutsList();
  };

  const closeAdminModal = () => {
    adminModal.classList.remove("open");
  };

  const directAdminBtn = document.getElementById("direct-admin-btn");
  if (adminBtn) adminBtn.addEventListener("click", openAdminModal);
  if (directAdminBtn) directAdminBtn.addEventListener("click", openAdminModal);
  if (adminClose) adminClose.addEventListener("click", closeAdminModal);
  if (adminBackdrop) adminBackdrop.addEventListener("click", closeAdminModal);

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      if (supabaseClient) await supabaseClient.auth.signOut();
      clearAdminCookie();
      closeAdminModal();
      if (typeof window.lockSystemNow === 'function') {
        window.lockSystemNow();
      }
    });
  }

  // Tabs navigation (3 abas)
  const tabBgGalleryBtn = document.getElementById("tab-btn-bg-gallery");
  const tabBgGallery = document.getElementById("tab-bg-gallery");

  const activateAdminTab = (btnToActivate, contentToActivate) => {
    [tabShortcutsBtn, tabSubshortcutsBtn, tabBgGalleryBtn].forEach(b => b && b.classList.remove("active"));
    [tabShortcuts, tabSubshortcuts, tabBgGallery].forEach(c => {
      if (c) {
        c.style.display = "none";
        c.classList.remove("active");
      }
    });
    if (btnToActivate) btnToActivate.classList.add("active");
    if (contentToActivate) {
      contentToActivate.style.display = "flex";
      contentToActivate.classList.add("active");
    }
  };

  if (tabShortcutsBtn) tabShortcutsBtn.addEventListener("click", () => activateAdminTab(tabShortcutsBtn, tabShortcuts));
  if (tabSubshortcutsBtn) tabSubshortcutsBtn.addEventListener("click", () => activateAdminTab(tabSubshortcutsBtn, tabSubshortcuts));
  if (tabBgGalleryBtn) tabBgGalleryBtn.addEventListener("click", () => {
    activateAdminTab(tabBgGalleryBtn, tabBgGallery);
    loadCustomBackgroundsFromSupabase();
  });

  function showLoginMsg(msg, type) {
    if (!loginMsg) return;
    loginMsg.textContent = msg;
    loginMsg.className = `admin-msg ${type}`;
    loginMsg.style.display = "block";
  }

  // Editing state (MUST be function-scoped so both submit handlers and the
  // setEditing* helpers share the same variables — declaring these inside the
  // formAddShortcut callback made sub-shortcut editing throw a ReferenceError
  // and made shortcut editing always duplicate instead of update).
  let editingShortcutId = null;
  let editingSubshortcutId = null;

  // Add Shortcut Form Submission
  if (formAddShortcut) {
    formAddShortcut.addEventListener("submit", async (e) => {
      e.preventDefault();
      const folder = document.getElementById("shortcut-folder-select").value;
      const name = document.getElementById("shortcut-name-input").value.trim();
      const url = document.getElementById("shortcut-url-input").value.trim();
      const desc = document.getElementById("shortcut-desc-input").value.trim();
      let iconUrl = document.getElementById("shortcut-icon-url").value.trim();
      const iconFileInput = document.getElementById("shortcut-icon-file");

      let iconFile = iconFileInput && iconFileInput.files[0] ? iconFileInput.files[0] : null;

      try {
        if (iconFile && supabaseClient) {
          const fileExt = iconFile.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { data: uploadData, error: uploadErr } = await supabaseClient.storage
            .from('shortcut-icons')
            .upload(fileName, iconFile);
          
          if (!uploadErr && uploadData) {
            const { data: publicUrlData } = supabaseClient.storage
              .from('shortcut-icons')
              .getPublicUrl(fileName);
            iconUrl = publicUrlData.publicUrl;
          }
        }

        if (editingShortcutId) {
          // UPDATE MODE
          if (supabaseClient) {
            const { error } = await supabaseClient.from('shortcuts').update({
              folder,
              name,
              url,
              icon: iconUrl,
              description: desc
            }).eq('id', editingShortcutId);
            if (error) throw error;
          }

          Object.keys(FOLDERS).forEach(fKey => {
            if (FOLDERS[fKey] && FOLDERS[fKey].items) {
              FOLDERS[fKey].items = FOLDERS[fKey].items.filter(item => item.id !== editingShortcutId && item.name !== name);
            }
          });

          if (!FOLDERS[folder]) FOLDERS[folder] = { name: folder, icon: "📁", items: [] };
          FOLDERS[folder].items.push({ id: editingShortcutId, folder, name, url, icon: iconUrl, description: desc });

          editingShortcutId = null;
          formAddShortcut.querySelector("button[type='submit'] span").textContent = "➕ Adicionar Atalho no Supabase";
          await showCustomAlert("Atalho Atualizado", `O atalho "${name}" foi atualizado com sucesso!`, "✨");
        } else {
          // INSERT MODE
          const newShortcut = {
            folder,
            name,
            url,
            icon: iconUrl,
            description: desc,
            order_index: Date.now()
          };

          if (supabaseClient) {
            const { data: insertedData, error } = await supabaseClient.from('shortcuts').insert([newShortcut]).select();
            if (error) throw error; // não renderizar localmente um atalho que o Supabase rejeitou
            if (insertedData && insertedData[0]) {
              newShortcut.id = insertedData[0].id;
            }
          }

          if (!FOLDERS[folder]) FOLDERS[folder] = { name: folder, icon: "📁", items: [] };
          FOLDERS[folder].items.push(newShortcut);
          await showCustomAlert("Atalho Adicionado", `O atalho "${name}" foi adicionado com sucesso!`, "➕");
        }

        formAddShortcut.reset();
        renderAdminShortcutsList();
        renderActiveFolder();
      } catch (err) {
        await showCustomAlert("Erro", `Erro ao salvar atalho: ${err.message || err}`, "⚠️");
      }
    });
  }

  // Add/Edit Subshortcut Form Submission
  if (formAddSubshortcut) {
    formAddSubshortcut.addEventListener("submit", async (e) => {
      e.preventDefault();
      const parent_key = document.getElementById("subshortcut-parent-select").value;
      const name = document.getElementById("subshortcut-name-input").value.trim();
      const url = document.getElementById("subshortcut-url-input").value.trim();
      const icon = document.getElementById("subshortcut-icon-input").value.trim();

      try {
        if (editingSubshortcutId) {
          // UPDATE MODE
          if (supabaseClient) {
            const { error } = await supabaseClient.from('sub_shortcuts').update({
              parent_key,
              name,
              url,
              icon
            }).eq('id', editingSubshortcutId);
            if (error) throw error; // não fingir sucesso quando o Supabase rejeita
          }

          editingSubshortcutId = null;
          formAddSubshortcut.querySelector("button[type='submit'] span").textContent = "⚡ Adicionar Sub-atalho no Supabase";
          await showCustomAlert("Sub-atalho Atualizado", `O sub-atalho "${name}" foi atualizado com sucesso!`, "⚡");
        } else {
          // INSERT MODE
          const newSub = {
            parent_key,
            name,
            url,
            icon,
            order_index: Date.now()
          };

          if (supabaseClient) {
            const { error } = await supabaseClient.from('sub_shortcuts').insert([newSub]);
            if (error) throw error; // surface o erro real (ex.: RLS/overflow) em vez de fingir sucesso
          }
          await showCustomAlert("Sub-atalho Adicionado", `O sub-atalho "${name}" foi adicionado com sucesso!`, "⚡");
        }

        await loadSubShortcutsFromSupabase();
        formAddSubshortcut.reset();
        renderAdminSubshortcutsList();
      } catch (err) {
        await showCustomAlert("Erro", `Erro ao salvar sub-atalho: ${err.message || err}`, "⚠️");
      }
    });
  }

  // Live Icon Preview & File Handler
  const iconUrlInput = document.getElementById("shortcut-icon-url");
  const iconFileInput = document.getElementById("shortcut-icon-file");
  const iconPreview = document.getElementById("shortcut-icon-preview");

  if (iconUrlInput && iconPreview) {
    iconUrlInput.addEventListener("input", () => {
      const val = iconUrlInput.value.trim();
      if (val) {
        iconPreview.innerHTML = `<img src="${val}" alt="Preview" onerror="this.parentElement.innerHTML='🔗'">`;
      } else {
        iconPreview.innerHTML = `🔗`;
      }
    });
  }

  if (iconFileInput && iconPreview) {
    iconFileInput.addEventListener("change", () => {
      const file = iconFileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          iconPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Cancel edit buttons
  const btnCancelEditShortcut = document.getElementById("btn-cancel-edit-shortcut");
  if (btnCancelEditShortcut && formAddShortcut) {
    btnCancelEditShortcut.addEventListener("click", () => {
      editingShortcutId = null;
      formAddShortcut.reset();
      if (iconPreview) iconPreview.innerHTML = "🔗";
      btnCancelEditShortcut.style.display = "none";
      const title = document.getElementById("shortcut-form-title");
      if (title) title.textContent = "Criar Novo Atalho";
      const submitBtn = document.getElementById("btn-submit-shortcut");
      if (submitBtn) submitBtn.querySelector("span").textContent = "➕ Adicionar Atalho no Supabase";
    });
  }

  const btnCancelEditSubshortcut = document.getElementById("btn-cancel-edit-subshortcut");
  if (btnCancelEditSubshortcut && formAddSubshortcut) {
    btnCancelEditSubshortcut.addEventListener("click", () => {
      editingSubshortcutId = null;
      formAddSubshortcut.reset();
      btnCancelEditSubshortcut.style.display = "none";
      const title = document.getElementById("subshortcut-form-title");
      if (title) title.textContent = "Criar Novo Sub-atalho";
      const submitBtn = document.getElementById("btn-submit-subshortcut");
      if (submitBtn) submitBtn.querySelector("span").textContent = "⚡ Adicionar Sub-atalho no Supabase";
    });
  }

  // Search filter inputs
  const searchShortcutsInput = document.getElementById("admin-search-shortcuts");
  if (searchShortcutsInput) {
    searchShortcutsInput.addEventListener("input", () => {
      renderAdminShortcutsList();
    });
  }

  const searchSubshortcutsInput = document.getElementById("admin-search-subshortcuts");
  if (searchSubshortcutsInput) {
    searchSubshortcutsInput.addEventListener("input", () => {
      renderAdminSubshortcutsList();
    });
  }

  // Initialize Apple Segmented Controls
  initAppleSegmentedControls();

  // Helper functions for Edit triggers
  window.setEditingShortcut = (item, folderKey) => {
    editingShortcutId = item.id || item.name;
    document.getElementById("shortcut-folder-select").value = folderKey;
    document.getElementById("shortcut-name-input").value = item.name || "";
    document.getElementById("shortcut-url-input").value = item.url || "";
    document.getElementById("shortcut-desc-input").value = item.description || item.desc || "";
    document.getElementById("shortcut-icon-url").value = item.icon || "";

    if (iconPreview) {
      iconPreview.innerHTML = item.icon ? `<img src="${item.icon}" alt="Preview" onerror="this.parentElement.innerHTML='🔗'">` : `🔗`;
    }

    const title = document.getElementById("shortcut-form-title");
    if (title) title.textContent = `Editando "${item.name}"`;

    if (btnCancelEditShortcut) btnCancelEditShortcut.style.display = "inline-block";

    const submitBtn = document.getElementById("btn-submit-shortcut");
    if (submitBtn) submitBtn.querySelector("span").textContent = `💾 Salvar Alterações`;

    document.getElementById("shortcut-name-input").focus();
  };

  window.setEditingSubshortcut = (item) => {
    editingSubshortcutId = item.id;
    document.getElementById("subshortcut-parent-select").value = item.parent_key || "google";
    document.getElementById("subshortcut-name-input").value = item.name || "";
    document.getElementById("subshortcut-url-input").value = item.url || "";
    document.getElementById("subshortcut-icon-input").value = item.icon || "";

    const title = document.getElementById("subshortcut-form-title");
    if (title) title.textContent = `Editando "${item.name}"`;

    if (btnCancelEditSubshortcut) btnCancelEditSubshortcut.style.display = "inline-block";

    const submitBtn = document.getElementById("btn-submit-subshortcut");
    if (submitBtn) submitBtn.querySelector("span").textContent = `💾 Salvar Alterações`;

    document.getElementById("subshortcut-name-input").focus();
  };
}

let currentShortcutFolder = "tools";
let currentSubshortcutParent = "google";

function initAppleSegmentedControls() {
  const shortcutBar = document.getElementById("shortcuts-segmented-bar");
  if (shortcutBar) {
    shortcutBar.querySelectorAll(".apple-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        shortcutBar.querySelectorAll(".apple-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentShortcutFolder = pill.getAttribute("data-folder");
        renderAdminShortcutsList();
      });
    });
  }

  const subshortcutBar = document.getElementById("subshortcuts-segmented-bar");
  if (subshortcutBar) {
    subshortcutBar.querySelectorAll(".apple-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        subshortcutBar.querySelectorAll(".apple-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentSubshortcutParent = pill.getAttribute("data-parent");
        renderAdminSubshortcutsList();
      });
    });
  }
}

// Render Admin Shortcuts List for selected pill folder (with search filter)
function renderAdminShortcutsList() {
  const container = document.getElementById("admin-shortcuts-list");
  if (!container) return;

  Object.keys(FOLDERS).forEach(folderKey => {
    const countBadge = document.getElementById(`badge-count-${folderKey}`);
    if (countBadge && FOLDERS[folderKey] && FOLDERS[folderKey].items) {
      countBadge.textContent = FOLDERS[folderKey].items.length;
    }
  });

  container.innerHTML = "";

  const folderObj = FOLDERS[currentShortcutFolder];
  if (!folderObj || !folderObj.items || folderObj.items.length === 0) {
    container.innerHTML = `<div style="padding: 32px; text-align: center; font-size: 0.85rem; color: var(--text-tertiary);">Nenhum atalho cadastrado nesta pasta.</div>`;
    return;
  }

  const searchInput = document.getElementById("admin-search-shortcuts");
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  let itemsToRender = folderObj.items;
  if (searchTerm) {
    itemsToRender = itemsToRender.filter(i => 
      (i.name && i.name.toLowerCase().includes(searchTerm)) || 
      (i.url && i.url.toLowerCase().includes(searchTerm)) ||
      (i.description && i.description.toLowerCase().includes(searchTerm))
    );
  }

  if (itemsToRender.length === 0) {
    container.innerHTML = `<div style="padding: 32px; text-align: center; font-size: 0.85rem; color: var(--text-tertiary);">Nenhum resultado encontrado para "${searchTerm}".</div>`;
    return;
  }

  itemsToRender.forEach(item => {
    const card = document.createElement("div");
    card.className = "admin-item-card";

    const iconDisplay = item.icon ? `<img src="${item.icon}" class="admin-item-icon" alt="" onerror="this.outerHTML='<span class=\\'admin-item-icon\\'>${folderObj.icon || '🔗'}</span>'">` : `<span class="admin-item-icon">${folderObj.icon || '🔗'}</span>`;

    card.innerHTML = `
      <div class="admin-item-left">
        ${iconDisplay}
        <div>
          <div class="admin-item-name">${item.name}</div>
          <div class="admin-item-url">${item.url}</div>
        </div>
      </div>
      <div class="admin-item-actions">
        <button type="button" class="admin-btn-edit btn-edit-shortcut" data-id="${item.id || ''}" data-name="${item.name}">✏️ Editar</button>
        <button type="button" class="admin-btn-danger btn-delete-shortcut" data-id="${item.id || ''}" data-folder="${currentShortcutFolder}" data-name="${item.name}">🗑️ Apagar</button>
      </div>
    `;

    container.appendChild(card);
  });

  container.querySelectorAll(".btn-edit-shortcut").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const item = folderObj.items.find(i => (i.id && i.id == id) || i.name === name);
      if (item && window.setEditingShortcut) {
        window.setEditingShortcut(item, currentShortcutFolder);
      }
    });
  });

  container.querySelectorAll(".btn-delete-shortcut").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      const folderKey = btn.getAttribute("data-folder");
      const name = btn.getAttribute("data-name");

      const confirmed = await showCustomConfirm("Excluir Atalho", `Tem certeza que deseja apagar o atalho "${name}"?`, "🗑️");
      if (!confirmed) return;

      if (id && supabaseClient) {
        await supabaseClient.from('shortcuts').delete().eq('id', id);
      }

      if (FOLDERS[folderKey]) {
        FOLDERS[folderKey].items = FOLDERS[folderKey].items.filter(i => i.name !== name);
      }

      renderAdminShortcutsList();
      renderActiveFolder();
    });
  });
}

// Render Admin Sub-shortcuts List for selected pill parent (with search filter)
async function renderAdminSubshortcutsList() {
  const container = document.getElementById("admin-subshortcuts-list");
  if (!container || !supabaseClient) return;

  container.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-tertiary); padding: 16px;">Carregando sub-atalhos do Supabase...</div>`;

  try {
    const { data, error } = await supabaseClient.from('sub_shortcuts').select('*').order('order_index', { ascending: true });
    if (error || !data) {
      container.innerHTML = `<div style="font-size: 0.8rem; color: #ef4444; padding: 16px;">Erro ao carregar sub-atalhos.</div>`;
      return;
    }

    const counts = { google: 0, youtube: 0, sphere: 0 };
    data.forEach(item => {
      if (counts[item.parent_key] !== undefined) counts[item.parent_key]++;
    });

    Object.keys(counts).forEach(key => {
      const badge = document.getElementById(`badge-count-${key}`);
      if (badge) badge.textContent = counts[key];
    });

    container.innerHTML = "";

    let items = data.filter(item => item.parent_key === currentSubshortcutParent);

    const searchInput = document.getElementById("admin-search-subshortcuts");
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
    if (searchTerm) {
      items = items.filter(i => 
        (i.name && i.name.toLowerCase().includes(searchTerm)) || 
        (i.url && i.url.toLowerCase().includes(searchTerm))
      );
    }

    if (items.length === 0) {
      container.innerHTML = `<div style="padding: 32px; text-align: center; font-size: 0.85rem; color: var(--text-tertiary);">Nenhum sub-atalho encontrado.</div>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "admin-item-card";

      const iconDisplay = item.icon ? `<span class="admin-item-icon">${item.icon}</span>` : `<span class="admin-item-icon">⚡</span>`;

      card.innerHTML = `
        <div class="admin-item-left">
          ${iconDisplay}
          <div>
            <div class="admin-item-name">${item.name}</div>
            <div class="admin-item-url">${item.url}</div>
          </div>
        </div>
        <div class="admin-item-actions">
          <button type="button" class="admin-btn-edit btn-edit-subshortcut" data-id="${item.id}">✏️ Editar</button>
          <button type="button" class="admin-btn-danger btn-delete-subshortcut" data-id="${item.id}" data-name="${item.name}">🗑️ Apagar</button>
        </div>
      `;

      container.appendChild(card);
    });

    container.querySelectorAll(".btn-edit-subshortcut").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const item = data.find(i => i.id == id);
        if (item && window.setEditingSubshortcut) {
          window.setEditingSubshortcut(item);
        }
      });
    });

    container.querySelectorAll(".btn-delete-subshortcut").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");

        const confirmed = await showCustomConfirm("Excluir Sub-atalho", `Tem certeza que deseja apagar o sub-atalho "${name}"?`, "🗑️");
        if (!confirmed) return;

        await supabaseClient.from('sub_shortcuts').delete().eq('id', id);
        await loadSubShortcutsFromSupabase();
        renderAdminSubshortcutsList();
      });
    });
  } catch (err) {
    console.error("Erro ao renderizar sub-atalhos admin:", err);
  }
}

// System Lock Mandatory Verification
async function initSystemLock() {
  const lockOverlay = document.getElementById("system-lock-overlay");
  const lockForm = document.getElementById("system-lock-form");
  const lockMsg = document.getElementById("lock-msg");

  if (!lockOverlay) return;

  const checkLockStatus = async () => {
    const isAuth = await isUserAuthenticatedAdmin();
    if (isAuth) {
      document.documentElement.classList.add("is-authenticated");
      lockOverlay.classList.add("unlocked");
      lockOverlay.style.display = "none";
      lockOverlay.style.pointerEvents = "none";
      document.body.classList.remove("locked");
    } else {
      document.documentElement.classList.remove("is-authenticated");
      lockOverlay.classList.remove("unlocked");
      lockOverlay.style.display = "flex";
      lockOverlay.style.pointerEvents = "auto";
      document.body.classList.add("locked");
    }
  };

  await checkLockStatus();

  const demoQuickBtn = document.getElementById("btn-lock-demo-quick");
  if (demoQuickBtn) {
    demoQuickBtn.addEventListener("click", () => {
      setAdminCookie("mcp_demo_token_" + Date.now(), "demo@mcpos.dev");
      showLockMsg("Acesso Demo concedido! Desbloqueando...", "success");
      setTimeout(() => {
        lockOverlay.classList.add("unlocked");
        lockOverlay.style.display = "none";
        lockOverlay.style.pointerEvents = "none";
        document.body.classList.remove("locked");
        document.documentElement.classList.add("is-authenticated");
      }, 200);
    });
  }

  if (lockForm) {
    lockForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("lock-email-input").value.trim();
      const password = document.getElementById("lock-password-input").value.trim();

      if (!email || !password) return;
      showLockMsg("Verificando autenticação...", "success");

      try {
        // 1. Autenticação via Gateway Serverless Isolado (Zero Credenciais no Cliente)
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email, password: password })
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data && data.success) {
          setAdminCookie(data.token || ('mcp_root_' + Date.now()), email);
          showLockMsg("Autenticado com sucesso! Desbloqueando...", "success");

          setTimeout(() => {
            lockOverlay.classList.add("unlocked");
            lockOverlay.style.display = "none";
            lockOverlay.style.pointerEvents = "none";
            document.body.classList.remove("locked");
            showLockMsg("", "");
            if (lockMsg) lockMsg.style.display = "none";
          }, 300);
          return;
        }

        // 2. Fallback Supabase Remoto
        if (supabaseClient) {
          try {
            const { data: supaData, error: supaErr } = await supabaseClient.auth.signInWithPassword({ email, password });
            if (!supaErr && supaData && supaData.session) {
              setAdminCookie(supaData.session.access_token, email);
              showLockMsg("Autenticado com sucesso! Desbloqueando...", "success");

              setTimeout(() => {
                lockOverlay.classList.add("unlocked");
                lockOverlay.style.display = "none";
                lockOverlay.style.pointerEvents = "none";
                document.body.classList.remove("locked");
                showLockMsg("", "");
                if (lockMsg) lockMsg.style.display = "none";
              }, 300);
              return;
            }
          } catch(e) {}
        }

        // 3. Fallback Criptográfico de Segurança Máxima (Zero Plaintext no Frontend)
        const adminEmails = ['demo@mcpos.dev', 'admin@mcpos.dev', 'demo', 'admin'];
        const ROOT_AUTH_HASH = "c19f9239c3fda66e8a19d5ec2d832751b3dd14bc2a21cd278c2e12c212fe8375";

        if (adminEmails.includes(email.toLowerCase()) && window.crypto && window.crypto.subtle) {
          try {
            const encoder = new TextEncoder();
            const dataBuf = encoder.encode(password);
            const hashBuf = await window.crypto.subtle.digest('SHA-256', dataBuf);
            const hashHex = Array.from(new Uint8Array(hashBuf))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');

            if (hashHex === ROOT_AUTH_HASH) {
              setAdminCookie("mcp_admin_token_" + Date.now(), email);
              showLockMsg("Autenticado com sucesso! Desbloqueando...", "success");

              setTimeout(() => {
                lockOverlay.classList.add("unlocked");
                lockOverlay.style.display = "none";
                lockOverlay.style.pointerEvents = "none";
                document.body.classList.remove("locked");
                showLockMsg("", "");
                if (lockMsg) lockMsg.style.display = "none";
              }, 300);
              return;
            }
          } catch (hashErr) {
            console.warn("Falha no cálculo criptográfico local:", hashErr);
          }
        }

        showLockMsg(data?.message || "Acesso recusado: Identificador ou senha incorretos.", "error");
      } catch (err) {
        showLockMsg("Falha na comunicação com o servidor de autenticação.", "error");
      }
    });
  }

  // Lockscreen Dynamic Wallpaper Controller Listeners
  const lockscreenSelect = document.getElementById("lockscreen-gallery-select");
  const lockscreenRandomBtn = document.getElementById("lockscreen-random-btn");

  if (lockscreenRandomBtn) {
    lockRandomBtnClickHandler = () => {
      const val = getRandomGalleryFromPool();
      state.currentGallery = val;
      localStorage.setItem("mcp_gallery", "random");
      if (typeof window.updateBackgroundEngine === "function") {
        window.updateBackgroundEngine();
      }
      if (typeof updateLockscreenBgDisplay === "function") {
        updateLockscreenBgDisplay(val);
      }
    };
    lockscreenRandomBtn.addEventListener("click", lockRandomBtnClickHandler);
  }

  if (lockscreenSelect) {
    const savedBg = localStorage.getItem("mcp_gallery") || "random";
    lockscreenSelect.value = savedBg;

    lockscreenSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      localStorage.setItem("mcp_gallery", val);
      localStorage.removeItem("mcp_custom_active_bg");
      if (val === "random") {
        state.currentGallery = getRandomGalleryFromPool();
      } else {
        state.currentGallery = val;
      }
      if (typeof window.updateBackgroundEngine === "function") {
        window.updateBackgroundEngine();
      }
      if (typeof updateLockscreenBgDisplay === "function") {
        updateLockscreenBgDisplay(state.currentGallery);
      }
    });
  }

  if (typeof updateLockscreenBgDisplay === "function") {
    updateLockscreenBgDisplay(state.currentGallery);
  }

  function showLockMsg(msg, type) {
    if (!lockMsg) return;
    lockMsg.textContent = msg;
    lockMsg.className = `admin-msg ${type}`;
    lockMsg.style.display = "block";
  }

  window.lockSystemNow = () => {
    clearAdminCookie();
    lockOverlay.classList.remove("unlocked");
    document.body.classList.add("locked");
    if (typeof updateLockscreenBgDisplay === "function") {
      updateLockscreenBgDisplay(state.currentGallery);
    }
  };
}

/* =========================================================
   CUSTOM BACKGROUNDS MANAGER (Supabase + Storage + Fallback)
   ========================================================= */

const idbMediaDBName = "MCP_MediaDB";
const idbMediaStoreName = "bg_media";

function openMediaDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(idbMediaDBName, 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(idbMediaStoreName)) {
        db.createObjectStore(idbMediaStoreName);
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveMediaToIDB(id, file) {
  try {
    const db = await openMediaDB();
    const tx = db.transaction(idbMediaStoreName, "readwrite");
    const store = tx.objectStore(idbMediaStoreName);
    store.put(file, id);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("IDB save error:", err);
  }
}

async function getMediaFromIDB(id) {
  try {
    const db = await openMediaDB();
    const tx = db.transaction(idbMediaStoreName, "readonly");
    const store = tx.objectStore(idbMediaStoreName);
    const request = store.get(id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.error("IDB get error:", err);
    return null;
  }
}

async function resolveBgUrl(item) {
  if (!item.url) return "";
  if (item.url.startsWith("idb://")) {
    const id = item.url.replace("idb://", "");
    const file = await getMediaFromIDB(id);
    if (file) {
      return URL.createObjectURL(file);
    }
  }
  return item.url;
}

let customBackgrounds = [];
let isCustomBgRealtimeSetup = false;

function setupCustomBgRealtime() {
  if (!supabaseClient || isCustomBgRealtimeSetup) return;
  isCustomBgRealtimeSetup = true;

  console.log("[MCP Realtime] Initializing Realtime channels for custom_backgrounds, app_config, shortcuts & sub_shortcuts...");

  // Channel 1: Listen for custom_backgrounds changes (Realtime gallery sync)
  supabaseClient
    .channel('custom_bg_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'custom_backgrounds' }, (payload) => {
      if (!__mcpInitialLoadComplete) return;
      console.log('[MCP Realtime] Custom background database change detected:', payload);
      loadCustomBackgroundsFromSupabase();
    })
    .subscribe((status) => {
      console.log('[MCP Realtime] Custom background subscription status:', status);
    });

  // Channel 2: Listen for active wallpaper changes in app_config
  supabaseClient
    .channel('app_config_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'app_config' }, (payload) => {
      if (!__mcpInitialLoadComplete) return;
      console.log('[MCP Realtime] App config change detected:', payload);
      syncActiveBackgroundFromSupabase();
    })
    .subscribe((status) => {
      console.log('[MCP Realtime] App config subscription status:', status);
    });

  // Channel 2B: Instant Broadcast Channel for ultra-low latency (< 1s sync across mobile, tablet, desktop)
  supabaseClient
    .channel('mcp_active_bg_broadcast')
    .on('broadcast', { event: 'active_bg_changed' }, (payload) => {
      console.log('[MCP Realtime Broadcast] Instant background switch received:', payload);
      syncActiveBackgroundFromSupabase();
    })
    .subscribe();

  // Channel 3: atalhos (ícones/pastas) — sincroniza criação, EDIÇÃO e EXCLUSÃO
  supabaseClient
    .channel('shortcuts_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'shortcuts' }, (payload) => {
      if (!__mcpInitialLoadComplete) return;
      console.log('[MCP Realtime] Shortcut change detected:', payload);
      loadShortcutsFromSupabase();
    })
    .subscribe((status) => {
      console.log('[MCP Realtime] Shortcuts subscription status:', status);
    });

  // Channel 4: super ícones / sub-menus — mesma sincronização total
  supabaseClient
    .channel('sub_shortcuts_sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'sub_shortcuts' }, (payload) => {
      if (!__mcpInitialLoadComplete) return;
      console.log('[MCP Realtime] Sub-shortcut change detected:', payload);
      loadSubShortcutsFromSupabase();
    })
    .subscribe((status) => {
      console.log('[MCP Realtime] Sub-shortcuts subscription status:', status);
    });
}

// Cross-device: on load, fetch the admin-selected active wallpaper from Supabase
// (app_config) so a freshly-opened device shows the SAME background as the others,
// without needing a manual refresh or a prior local selection.
async function syncActiveBackgroundFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('app_config')
      .select('key,value')
      .in('key', ['active_background', 'active_custom_bg']);
    if (error || !data) return;

    const cfg = {};
    data.forEach((r) => { cfg[r.key] = r.value; });

    // Só reaplica quando o wallpaper ativo mudou de fato desde a última vez.
    const sig = JSON.stringify({ b: cfg.active_background || '', c: cfg.active_custom_bg || '' });
    if (sig === __mcpSigActiveBg) return;
    __mcpSigActiveBg = sig;

    if (cfg.active_background === 'custom') {
      let applied = false;
      if (cfg.active_custom_bg) {
        try {
          const item = JSON.parse(cfg.active_custom_bg);
          if (item && item.url && !String(item.url).startsWith('idb://')) {
            state.currentGallery = 'custom';
            localStorage.setItem('mcp_gallery', 'custom');
            localStorage.setItem('mcp_custom_active_bg', JSON.stringify(item));
            await applyCustomBackground(item, false); // aplica local; NÃO re-transmite
            applied = true;
          }
        } catch (e) { /* payload inválido */ }
      }
      if (!applied) {
        // Se o custom não existe mais ou foi deletado, reverter para dither
        state.currentGallery = 'dither';
        localStorage.setItem('mcp_gallery', 'dither');
        localStorage.removeItem('mcp_custom_active_bg');
        const gallerySelect = document.getElementById('gallery-select');
        if (gallerySelect) gallerySelect.value = 'dither';
        if (typeof window.updateBackgroundEngine === 'function') window.updateBackgroundEngine();
      }
    } else if (cfg.active_background && cfg.active_background !== 'custom') {
      // Galeria embutida / Shaders (dither, strands, ferrofluid, gym, video, etc.)
      state.currentGallery = cfg.active_background;
      localStorage.setItem('mcp_gallery', cfg.active_background);
      localStorage.removeItem('mcp_custom_active_bg');
      const gallerySelect = document.getElementById('gallery-select');
      if (gallerySelect) gallerySelect.value = cfg.active_background;
      if (typeof window.updateBackgroundEngine === 'function') {
        window.updateBackgroundEngine();
      } else if (typeof changeBg === 'function') {
        changeBg();
      }
    }
  } catch (e) {
    console.warn('[MCP] active background sync failed:', e);
  }
}

// ------------------------------------------------------------------
// Sincronização cross-device robusta (essencial no MOBILE):
// WebSockets de realtime são suspensos quando a aba/app vai para segundo
// plano ou a tela apaga — então o celular PERDE eventos enquanto você
// altera algo no desktop (background, atalhos, sub-menus...). Garantimos
// consistência re-puxando o estado do Supabase (1) sempre que a página
// volta a ficar visível/focada e (2) num intervalo curto enquanto o
// mobile está visível. Tudo passa por funções idempotentes (assinaturas),
// então re-puxar sem mudanças não re-renderiza nem "pisca" a tela.
// ------------------------------------------------------------------
async function resyncAllFromSupabase() {
  if (!supabaseClient) return;
  try {
    await Promise.all([
      loadShortcutsFromSupabase(),        // ícones / pastas
      loadSubShortcutsFromSupabase(),     // super ícones / sub-menus
      syncActiveBackgroundFromSupabase(), // wallpaper ativo
      loadCustomBackgroundsFromSupabase() // galeria (painel admin)
    ]);
  } catch (e) {
    console.warn('[MCP] resync cross-device falhou:', e);
  }
}

let __mcpResyncSetup = false;
let __mcpMobilePollTimer = null;
function setupCrossDeviceResync() {
  if (__mcpResyncSetup) return;
  __mcpResyncSetup = true;

  // (1) Reconciliação orientada a eventos: ao voltar o foco/visibilidade,
  // reconectar rede, ou restaurar da bfcache (voltar/avançar do navegador).
  const resumeSync = () => {
    if (document.visibilityState === 'visible' && __mcpInitialLoadComplete) resyncAllFromSupabase();
  };
  document.addEventListener('visibilitychange', resumeSync);
  window.addEventListener('focus', () => { if (__mcpInitialLoadComplete) resyncAllFromSupabase(); });
  window.addEventListener('online', () => { if (__mcpInitialLoadComplete) resyncAllFromSupabase(); });
  window.addEventListener('pageshow', (e) => { if (e.persisted && __mcpInitialLoadComplete) resyncAllFromSupabase(); });

  // (2) Rede de segurança no MOBILE: poll curto enquanto a tela está visível,
  // cobrindo o caso do socket cair (ou nunca reconectar) com o celular em uso.
  const startMobilePoll = () => {
    if (__mcpMobilePollTimer || !state.isMobile) return;
    __mcpMobilePollTimer = setInterval(() => {
      if (document.visibilityState === 'visible') resyncAllFromSupabase();
    }, 12000);
  };
  const stopMobilePoll = () => {
    if (__mcpMobilePollTimer) { clearInterval(__mcpMobilePollTimer); __mcpMobilePollTimer = null; }
  };
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') startMobilePoll(); else stopMobilePoll();
  });
  startMobilePoll();

  // (3) Botão "Forçar Sincronização Agora" (modal de Ajustes). Puxa o estado
  // mais recente do servidor, apaga caches antigos (Service Worker) deste
  // aparelho e recarrega buscando código/arquivos novos da rede. Serve para o
  // caso do socket mobile ter dormido ou de um cache velho ter "congelado".
  const forceSyncBtn = document.getElementById('force-sync-btn');
  if (forceSyncBtn && !forceSyncBtn.dataset.mcpBound) {
    forceSyncBtn.dataset.mcpBound = '1';
    forceSyncBtn.addEventListener('click', async () => {
      forceSyncBtn.disabled = true;
      forceSyncBtn.style.opacity = '0.7';
      forceSyncBtn.innerHTML = '⏳ Sincronizando…';
      try {
        // 1) Zera as assinaturas para forçar re-render mesmo se os dados
        //    "parecerem" iguais ao último estado aplicado neste aparelho.
        __mcpSigShortcuts = null;
        __mcpSigSubShortcuts = null;
        __mcpSigActiveBg = null;
        __mcpSigGallery = null;
        // 2) Puxa TUDO do Supabase agora (atalhos, sub-atalhos, wallpaper, galeria).
        await resyncAllFromSupabase();
        // 3) Apaga caches antigos do Service Worker (mantendo o cache de mídias offline seguro).
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.filter(k => k !== 'mcp-offline-media-v1').map((k) => caches.delete(k)));
        }
        // 4) Pede ao Service Worker que se atualize para a versão mais recente.
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.update().catch(() => null)));
        }
        forceSyncBtn.innerHTML = '✅ Sincronizado! Recarregando…';
        setTimeout(() => location.reload(), 700);
      } catch (e) {
        console.error('[MCP] Forçar sincronização falhou:', e);
        forceSyncBtn.innerHTML = '⚠️ Erro — recarregando…';
        setTimeout(() => location.reload(), 900);
      }
    });
  }
}

function initCustomBgManager() {
  const typeSelect = document.getElementById("custom-bg-type-select");
  const localGroup = document.getElementById("group-file-upload");
  const urlGroup = document.getElementById("group-url-upload");
  const formUploadBg = document.getElementById("form-upload-bg");
  const toggleBtn = document.getElementById("btn-toggle-bg-upload");
  const toggleHeader = document.getElementById("bg-upload-header-toggle");
  const studioBox = document.getElementById("admin-bg-studio-box");

  if (toggleHeader && studioBox) {
    const handleToggle = (e) => {
      if (window.innerWidth <= 960) {
        studioBox.classList.toggle("is-collapsed");
        const isCollapsed = studioBox.classList.contains("is-collapsed");
        if (toggleBtn) {
          const toggleText = toggleBtn.querySelector(".toggle-text") || toggleBtn;
          toggleText.textContent = isCollapsed ? "➕ Adicionar" : "✕ Fechar";
        }
      }
    };
    if (toggleBtn) toggleBtn.addEventListener("click", handleToggle);
    toggleHeader.addEventListener("click", (e) => {
      if (e.target !== toggleBtn && !toggleBtn?.contains(e.target)) {
        handleToggle(e);
      }
    });
  }

  if (typeSelect) {
    typeSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "youtube") {
        if (localGroup) localGroup.style.display = "none";
        if (urlGroup) urlGroup.style.display = "block";
      } else {
        if (localGroup) localGroup.style.display = "block";
        if (urlGroup) urlGroup.style.display = "none";
      }
    });
  }

  loadCustomBackgroundsFromSupabase();
  syncActiveBackgroundFromSupabase();
  // Delay Realtime & cross-device resync until after initial data load is complete
  // to prevent Supabase channel replay from triggering duplicate renders on startup
  setTimeout(() => {
    setupCustomBgRealtime();
    setupCrossDeviceResync();
  }, 3000);

  if (formUploadBg) {
    formUploadBg.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("custom-bg-name-input");
      const name = nameInput ? nameInput.value.trim() : "";
      const type = typeSelect ? typeSelect.value : "image";
      const fileInput = document.getElementById("custom-bg-file-input");
      const urlInput = document.getElementById("custom-bg-url-input");

      try {
        let finalUrl = "";
        let storagePath = "";
        const bgId = crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });

        if (type === "youtube") {
          finalUrl = urlInput ? urlInput.value.trim() : "";
          if (!finalUrl) {
            await showCustomAlert("Aviso", "Por favor, digite o link do vídeo do YouTube ou URL Web.", "⚠️");
            return;
          }
        } else {
          const file = fileInput && fileInput.files ? fileInput.files[0] : null;
          if (!file) {
            await showCustomAlert("Aviso", "Por favor, selecione um arquivo de mídia local.", "⚠️");
            return;
          }

          if (!supabaseClient) {
            await showCustomAlert("Sem conexão", "Não foi possível conectar ao servidor. A mídia não pode ser sincronizada entre dispositivos.", "⚠️");
            return;
          }

          // Upload em qualidade máxima original (sem compressão) para custom backgrounds no MCP OS
          const fileExt = (file.name.split('.').pop() || 'bin').toLowerCase();
          const fileName = `custom-bg-${Date.now()}.${fileExt}`;
          const { data: upData, error: upErr } = await supabaseClient
            .storage.from('background-media')
            .upload(fileName, file, { upsert: true, contentType: file.type || undefined });

          if (upErr || !upData) {
            console.error("Supabase Storage upload error:", upErr);
            const raw = (upErr && upErr.message) ? upErr.message : "";
            let msg;
            if (/exceeded|too large|maximum size|payload/i.test(raw)) {
              msg = "Arquivo muito grande para o limite do bucket. Reduza o arquivo ou aumente o limite do bucket 'background-media' no Supabase.";
            } else if (/mime|content type|not allowed|invalid_mime/i.test(raw)) {
              msg = "Tipo de arquivo não permitido pelo bucket. Ajuste os 'allowed MIME types' do bucket no Supabase.";
            } else if (/row-level security|unauthorized|401|403|jwt|permission/i.test(raw)) {
              msg = "Permissão negada pelo Storage. Faça login como administrador (sessão Supabase real) antes de enviar mídia.";
            } else {
              msg = "Falha ao enviar o arquivo para o Storage" + (raw ? `: ${raw}` : ".");
            }
            await showCustomAlert("Upload falhou", msg + "\n\nNada foi salvo — assim evitamos criar mídia que aparece só neste aparelho.", "⚠️");
            return;
          }

          storagePath = upData.path;
          const { data: publicUrlData } = supabaseClient.storage.from('background-media').getPublicUrl(fileName);
          finalUrl = publicUrlData ? publicUrlData.publicUrl : "";

          if (!finalUrl) {
            await showCustomAlert("Erro", "Upload concluído, mas não foi possível gerar a URL pública. Confirme que o bucket 'background-media' está marcado como público.", "⚠️");
            return;
          }

          // Anexa instantaneamente ao cache offline permanente
          if (window.MediaCompressor && finalUrl) {
            await window.MediaCompressor.attachToOfflineCache(finalUrl, file);
          }
        }

        const newBg = {
          id: bgId,
          name: name || "Background Personalizado",
          type,
          url: finalUrl,
          storage_path: storagePath,
          created_at: new Date().toISOString()
        };

        if (supabaseClient) {
          const { data, error } = await supabaseClient.from('custom_backgrounds').insert([newBg]).select();
          if (error) {
            console.error("Supabase insert error:", error);
            throw new Error(error.message || "Falha ao inserir no banco de dados.");
          }
          if (data && data[0]) {
            newBg.id = data[0].id;
          }
        }

        customBackgrounds.unshift(newBg);
        localStorage.setItem("mcp_custom_bgs", JSON.stringify(customBackgrounds));

        formUploadBg.reset();
        await renderCustomBgGallery();
        await showCustomAlert("Sucesso", `O background "${name}" foi salvo e sincronizado em todos os dispositivos!`, "🚀");
      } catch (err) {
        console.error("Erro ao salvar background:", err);
        await showCustomAlert("Erro", `Não foi possível salvar o background: ${err.message || err}`, "⚠️");
      }
    });
  }
}

async function loadCustomBackgroundsFromSupabase() {
  const container = document.getElementById("custom-bg-gallery-grid");
  if (!container) return;

  try {
    if (supabaseClient) {
      const { data, error } = await supabaseClient.from('custom_backgrounds').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        customBackgrounds = data;
      } else {
        const local = localStorage.getItem("mcp_custom_bgs");
        customBackgrounds = local ? JSON.parse(local) : [];
      }
    } else {
      const local = localStorage.getItem("mcp_custom_bgs");
      customBackgrounds = local ? JSON.parse(local) : [];
    }

    const sig = JSON.stringify(customBackgrounds.map(b => [b.id, b.name, b.type, b.url, b.storage_path || null]));
    if (sig === __mcpSigGallery) return; // galeria inalterada → não reconstrói o grid
    __mcpSigGallery = sig;

    await renderCustomBgGallery();
  } catch (err) {
    console.error("Erro ao carregar custom backgrounds:", err);
    const local = localStorage.getItem("mcp_custom_bgs");
    customBackgrounds = local ? JSON.parse(local) : [];
    await renderCustomBgGallery();
  }
}

async function renderCustomBgGallery() {
  const container = document.getElementById("custom-bg-gallery-grid");
  if (!container) return;

  if (customBackgrounds.length === 0) {
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 32px; font-size: 0.85rem; color: var(--text-tertiary);">Nenhum background personalizado salvo ainda.</div>`;
    const studioBox = document.getElementById("admin-bg-studio-box");
    if (studioBox && studioBox.classList.contains("is-collapsed")) {
      studioBox.classList.remove("is-collapsed");
      const toggleBtn = document.getElementById("btn-toggle-bg-upload");
      if (toggleBtn) {
        const toggleText = toggleBtn.querySelector(".toggle-text") || toggleBtn;
        toggleText.textContent = "✕ Fechar";
      }
    }
    return;
  }

  // Identifica o background ativo atual para feedback visual instantâneo
  const currentSavedGallery = localStorage.getItem("mcp_gallery");
  const currentActiveCustomJson = localStorage.getItem("mcp_custom_active_bg");
  let activeObj = null;
  if (currentSavedGallery === "custom" && currentActiveCustomJson) {
    try {
      activeObj = JSON.parse(currentActiveCustomJson);
    } catch (e) {}
  }

  container.innerHTML = "";

  for (let idx = 0; idx < customBackgrounds.length; idx++) {
    const item = customBackgrounds[idx];
    const card = document.createElement("div");

    const isActive = activeObj && (
      (activeObj.id && item.id && activeObj.id === item.id) ||
      (activeObj.name && item.name && activeObj.name === item.name) ||
      (activeObj.url && item.url && activeObj.url === item.url)
    );

    card.className = `bg-gallery-card${isActive ? " is-active-bg" : ""}`;

    let mediaPreview = '';
    if (item.type === 'video' || item.type === 'youtube') {
      mediaPreview = `<div class="bg-card-preview-wrapper"><div class="bg-card-preview" style="display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.5); color:#a78bfa; font-size:2.2rem;">🎬</div></div>`;
    } else {
      const previewUrl = await resolveBgUrl(item);
      mediaPreview = `<div class="bg-card-preview-wrapper"><img src="${previewUrl}" class="bg-card-preview" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';" loading="lazy"></div>`;
    }

    const typeIcons = {
      image: '🖼️ Imagem',
      video: '🎬 Vídeo',
      youtube: '▶️ YouTube'
    };
    const typeLabel = typeIcons[item.type] || item.type.toUpperCase();

    card.innerHTML = `
      ${mediaPreview}
      <div class="bg-card-body">
        <div class="bg-card-info-row">
          <div class="bg-card-title" title="${item.name}">${item.name}</div>
        </div>
        <div class="bg-card-badges">
          <span class="bg-card-type-badge">${typeLabel}</span>
          ${isActive ? '<span class="bg-card-active-badge">✨ Em Uso</span>' : ''}
        </div>
        <div class="bg-card-actions">
          <button type="button" class="bg-btn-activate btn-apply-custom-bg ${isActive ? 'is-current' : ''}" data-index="${idx}">
            ${isActive ? '✅ Em Uso' : '✨ Usar Agora'}
          </button>
          <button type="button" class="bg-btn-delete btn-delete-custom-bg" data-id="${item.id || ''}" data-index="${idx}" title="Excluir background">
            🗑️
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  }

  container.querySelectorAll(".btn-apply-custom-bg").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const idx = btn.getAttribute("data-index");
      const bgItem = customBackgrounds[idx];
      if (bgItem) {
        await applyCustomBackground(bgItem, true);
        await renderCustomBgGallery();
        showCustomAlert("Background Ativo", `O background "${bgItem.name}" foi aplicado em todos os seus dispositivos!`, "✨");
      }
    });
  });

  container.querySelectorAll(".btn-delete-custom-bg").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      const idx = parseInt(btn.getAttribute("data-index"), 10);
      const bgItem = customBackgrounds[idx];

      const confirmed = await showCustomConfirm("Excluir Background", `Tem certeza que deseja destruir permanentemente "${bgItem ? bgItem.name : 'este background'}" do backend e do sistema?`, "🗑️");
      if (!confirmed) return;

      // 1. Apagar registro do Banco de Dados
      if (id && supabaseClient) {
        try {
          await supabaseClient.from('custom_backgrounds').delete().eq('id', id);
        } catch (e) {
          console.warn("Erro ao deletar linha de custom_backgrounds:", e);
        }
      }

      // 2. Destruição Verdadeira no Supabase Storage (background-media)
      const storagePathsToRemove = [];
      if (bgItem) {
        if (bgItem.storage_path) storagePathsToRemove.push(bgItem.storage_path);
        if (bgItem.url && bgItem.url.includes('/background-media/')) {
          const extracted = bgItem.url.split('/background-media/')[1]?.split('?')[0];
          if (extracted && !storagePathsToRemove.includes(extracted)) storagePathsToRemove.push(extracted);
        }
      }

      if (storagePathsToRemove.length > 0 && supabaseClient) {
        try {
          await supabaseClient.storage.from('background-media').remove(storagePathsToRemove);
          console.log("[MCP Storage] Arquivos destruídos permanentemente do bucket background-media:", storagePathsToRemove);
        } catch (e) {
          console.warn("Falha ao remover arquivo do Storage:", e);
        }
      }

      // 3. Limpeza de Caches Locais (CacheStorage e IndexedDB)
      if (window.caches && bgItem && bgItem.url) {
        try {
          const cache = await caches.open('mcp-offline-media-v1');
          await cache.delete(bgItem.url);
        } catch (e) {}
      }

      // 4. Se o background deletado era o ativo, reverter imediatamente para o shader Dither
      const currentSavedGallery = localStorage.getItem("mcp_gallery");
      const currentActiveCustomJson = localStorage.getItem("mcp_custom_active_bg");
      let isCurrentActive = false;
      if (currentSavedGallery === "custom") {
        if (currentActiveCustomJson && bgItem) {
          try {
            const activeObj = JSON.parse(currentActiveCustomJson);
            if (activeObj.id === bgItem.id || activeObj.name === bgItem.name || activeObj.url === bgItem.url) {
              isCurrentActive = true;
            }
          } catch (e) { isCurrentActive = true; }
        } else {
          isCurrentActive = true;
        }
      }

      if (isCurrentActive) {
        console.log("[MCP] Background ativo deletado. Revertendo para Dither no backend e sincronizando...");
        state.currentGallery = "dither";
        localStorage.setItem("mcp_gallery", "dither");
        localStorage.removeItem("mcp_custom_active_bg");
        const gallerySelect = document.getElementById("gallery-select");
        if (gallerySelect) gallerySelect.value = "dither";

        if (supabaseClient) {
          try {
            await supabaseClient.from('app_config').upsert([
              { key: 'active_background', value: 'dither', updated_at: new Date().toISOString() },
              { key: 'active_custom_bg', value: '', updated_at: new Date().toISOString() }
            ], { onConflict: 'key' });

            const bc = supabaseClient.channel('mcp_active_bg_broadcast');
            await bc.send({
              type: 'broadcast',
              event: 'active_bg_changed',
              payload: { active_background: 'dither', active_custom_bg: '' }
            });
          } catch (e) {
            console.warn("Falha ao atualizar app_config após deleção:", e);
          }
        }

        if (typeof window.updateBackgroundEngine === 'function') {
          window.updateBackgroundEngine();
        }
      }

      customBackgrounds.splice(idx, 1);
      localStorage.setItem("mcp_custom_bgs", JSON.stringify(customBackgrounds));
      __mcpSigGallery = "";
      await renderCustomBgGallery();
    });
  });
}

async function applyCustomBackground(item, broadcast = true) {
  if (!item) return;

  state.currentGallery = "custom";
  localStorage.setItem("mcp_gallery", "custom");
  const saveItem = { ...item };
  if (saveItem.url && saveItem.url.length > 50000) saveItem.url = "idb://" + item.id;
  localStorage.setItem("mcp_custom_active_bg", JSON.stringify(saveItem));

  // Only broadcast wallpapers that every device can actually resolve (public URLs).
  const canSync = saveItem.url && !String(saveItem.url).startsWith('idb://');
  if (broadcast && supabaseClient && canSync) {
    try {
      await supabaseClient.from('app_config').upsert([
        { key: 'active_custom_bg', value: JSON.stringify(saveItem), updated_at: new Date().toISOString() },
        { key: 'active_background', value: 'custom', updated_at: new Date().toISOString() }
      ], { onConflict: 'key' });

      const bc = supabaseClient.channel('mcp_active_bg_broadcast');
      await bc.send({
        type: 'broadcast',
        event: 'active_bg_changed',
        payload: { active_background: 'custom', active_custom_bg: JSON.stringify(saveItem) }
      });
    } catch (e) {
      console.warn("Failed to broadcast active custom bg:", e);
    }
  }

  const resolvedUrl = await resolveBgUrl(item);

  if (typeof window.stopWebGLBackground === 'function') {
    window.stopWebGLBackground();
  }

  const webglContainer = document.getElementById("bg-webgl-container");
  if (webglContainer) webglContainer.style.display = "none";

  const gallerySelect = document.getElementById("gallery-select");
  if (gallerySelect) gallerySelect.value = "custom";

  const slide1 = document.getElementById("bg-slide-1");
  const slide2 = document.getElementById("bg-slide-2");
  const vid1 = document.getElementById("bg-video-1");
  const vid2 = document.getElementById("bg-video-2");
  let youtubeIframe = document.getElementById("youtube-bg-iframe");

  if (youtubeIframe) youtubeIframe.style.display = "none";
  if (vid1) { vid1.style.display = "none"; vid1.pause(); }
  if (vid2) { vid2.style.display = "none"; vid2.pause(); }

  if (item.type === 'video') {
    if (slide1) slide1.style.display = "none";
    if (slide2) slide2.style.display = "none";
    if (vid1) {
      vid1.muted = true;
      vid1.playsInline = true;
      vid1.setAttribute('playsinline', '');
      vid1.setAttribute('muted', '');
      vid1.src = resolvedUrl;
      vid1.style.display = "block";
      vid1.style.opacity = "1";
      vid1.classList.add("active");
      vid1.play().catch(e => console.log('Autoplay handled:', e));
    }
  } else if (item.type === 'youtube') {
    if (slide1) slide1.style.display = "none";
    if (slide2) slide2.style.display = "none";
    let embedUrl = resolvedUrl;
    if (embedUrl.includes("youtube.com/watch?v=")) {
      const vidId = embedUrl.split("v=")[1].split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1&mute=1&loop=1&playlist=${vidId}&controls=0`;
    } else if (embedUrl.includes("youtu.be/")) {
      const vidId = embedUrl.split("youtu.be/")[1].split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${vidId}?autoplay=1&mute=1&loop=1&playlist=${vidId}&controls=0`;
    }

    const ctn = document.getElementById("bg-container");
    if (ctn) {
      if (!youtubeIframe) {
        youtubeIframe = document.createElement("iframe");
        youtubeIframe.id = "youtube-bg-iframe";
        youtubeIframe.style.cssText = "position:absolute; top:0; left:0; width:100%; height:100%; border:none; pointer-events:none; z-index:1;";
        ctn.appendChild(youtubeIframe);
      }
      youtubeIframe.src = embedUrl;
      youtubeIframe.style.display = "block";
    }
  } else {
    // Image
    if (slide1 && slide2) {
      slide1.style.display = "block";
      slide1.style.opacity = "1";
      slide1.style.zIndex = "2";
      slide1.style.backgroundImage = 'url(' + JSON.stringify(resolvedUrl) + ')';
      slide1.classList.add("active");
      slide2.classList.remove("active");
    }
  }
}

// Call initCustomBgManager on Load
document.addEventListener("DOMContentLoaded", () => {
  initCustomBgManager();
});




// Demo Opening Experience Controller (Abertura Suave e Cascata Animada)
function initDemoExperience() {
  const bootScreen = document.getElementById("demo-boot-screen");
  const barFill = document.querySelector(".demo-boot-bar-fill");
  const statusText = document.querySelector(".demo-boot-status-text");
  const skipBtn = document.getElementById("demo-skip-btn");

  if (!bootScreen) {
    document.body.classList.add("assembled");
    return;
  }

  let entered = false;
  const enterDemo = () => {
    if (entered) return;
    entered = true;

    if (barFill) barFill.style.width = "100%";
    if (statusText) statusText.textContent = "Interface pronta • Carregando...";

    setTimeout(() => {
      bootScreen.classList.add("fade-out");
      document.body.classList.add("assembled", "demo-entering");

      setTimeout(() => {
        bootScreen.style.display = "none";
      }, 900);
    }, 200);
  };

  requestAnimationFrame(() => {
    setTimeout(() => {
      if (barFill) barFill.style.width = "65%";
      if (statusText) statusText.textContent = "Carregando marcadores e shaders WebGL...";
    }, 200);

    setTimeout(() => {
      if (barFill) barFill.style.width = "100%";
      if (statusText) statusText.textContent = "Ambiente pronto • Iniciando interface...";
    }, 800);

    setTimeout(enterDemo, 1200);
  });

  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enterDemo();
    });
  }

  bootScreen.addEventListener("click", (e) => {
    if (e.target !== skipBtn) enterDemo();
  });
}
