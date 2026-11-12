(function () {
  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var bar = document.querySelector(".progress span");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header + barra de progresso */
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  /* Menu mobile */
  var nav = document.getElementById("nav-menu");
  var toggle = document.querySelector(".nav-toggle");
  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (nav.classList.contains("is-open") && !nav.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }

  /* Tema */
  var themeBtn = document.querySelector(".theme-toggle");
  function applyTheme(theme, save) {
    root.setAttribute("data-theme", theme);
    if (save) { try { localStorage.setItem("theme", theme); } catch (e) {} }
    var light = theme === "light";
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", light ? "true" : "false");
      themeBtn.setAttribute("aria-label", light ? "Ativar tema escuro" : "Ativar tema claro");
    }
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", light ? "#f6f7f5" : "#0a0b0d");
  }
  applyTheme(root.getAttribute("data-theme") || "dark", false);
  if (themeBtn) themeBtn.addEventListener("click", function () {
    applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
  });

  /* Palavra rotativa do título */
  var word = document.querySelector(".rotator-word");
  var words = ["bancos digitais", "pagamentos", "Smart POS", "produtos reais"];
  if (word && !reduce) {
    var i = 0;
    setInterval(function () {
      word.classList.add("is-out");
      setTimeout(function () {
        i = (i + 1) % words.length;
        word.textContent = words[i];
        word.classList.remove("is-out");
      }, 350);
    }, 2600);
  }

  /* Painel recrutador / dev */
  var panel = document.querySelector(".hero-panel");
  if (panel) {
    var tabs = panel.querySelectorAll(".panel-tab");
    function select(tab, focus) {
      var target = tab.getAttribute("data-target");
      panel.setAttribute("data-view", target);
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, idx) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        select(tabs[(idx + 1) % tabs.length], true);
      });
    });
  }

  /* Revelar ao rolar + contadores */
  var counters = document.querySelectorAll(".count");
  function runCount(el) {
    var to = parseInt(el.getAttribute("data-to"), 10) || 0;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1100, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = "0";
    requestAnimationFrame(step);
  }

  if (!reduce && "IntersectionObserver" in window) {
    root.classList.add("motion");
    var groups = new Map();
    document.querySelectorAll(".reveal").forEach(function (el) {
      var key = el.parentElement;
      var n = groups.get(key) || 0;
      el.style.setProperty("--d", Math.min(n * 0.08, 0.4) + "s");
      groups.set(key, n + 1);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        cio.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Destaque que segue o cursor */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".spot").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* Filtro de projetos */
  var filters = document.querySelectorAll(".filter");
  var projects = document.querySelectorAll(".project");
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
      });
      projects.forEach(function (p) {
        var tags = (p.getAttribute("data-tags") || "").split(" ");
        p.classList.toggle("is-hidden", f !== "all" && tags.indexOf(f) === -1);
      });
    });
  });

  /* Copiar e-mail */
  var toast = document.querySelector(".toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200);
  }
  var copyBtn = document.querySelector(".copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () {
          showToast("E-mail copiado ✓");
        }, function () { window.location.href = "mailto:" + email; });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  }

  /* Link ativo no menu */
  var links = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (link) {
          var on = link.getAttribute("href") === "#" + id;
          link.classList.toggle("is-active", on);
          if (on) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
