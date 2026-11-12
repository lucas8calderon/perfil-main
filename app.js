(function () {
  var header = document.querySelector(".site-header");
  var details = document.querySelector(".nav-details");
  var themeBtn = document.querySelector(".theme-toggle");
  var links = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var desktopNav = window.matchMedia("(min-width: 981px)");

  function syncNav() {
    if (!details) return;
    if (desktopNav.matches) details.open = true;
  }

  syncNav();
  if (desktopNav.addEventListener) {
    desktopNav.addEventListener("change", function (event) {
      if (!details) return;
      details.open = event.matches;
    });
  }

  function closeMenu() {
    if (!details || desktopNav.matches) return;
    details.open = false;
  }

  if (details) {
    details.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape" || !details.open || desktopNav.matches) return;
      closeMenu();
      var summary = details.querySelector("summary");
      if (summary) summary.focus();
    });

    document.addEventListener("click", function (event) {
      if (!details.open || desktopNav.matches) return;
      if (details.contains(event.target)) return;
      closeMenu();
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      /* armazenamento indisponível: o tema vale só nesta visita */
    }
    if (themeBtn) {
      var isLight = theme === "light";
      themeBtn.setAttribute("aria-pressed", isLight ? "true" : "false");
      themeBtn.setAttribute("aria-label", isLight ? "Ativar tema escuro" : "Ativar tema claro");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#FAFAFA" : "#09090B");
  }

  if (themeBtn) {
    applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
    themeBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  if (!reduce && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    var revealItems = document.querySelectorAll(".reveal");
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  if ("IntersectionObserver" in window && sections.length && links.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          links.forEach(function (link) {
            var active = link.getAttribute("href") === "#" + id;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -48% 0px", threshold: 0.01 }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

})();
