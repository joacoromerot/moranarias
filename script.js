// Dra. Moran Arias — interacciones del sitio (sin dependencias)
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "5493512372338";

  // ---------- Header: fondo al hacer scroll ----------
  var header = document.querySelector("header");
  function onScroll() {
    if (!header) return;
    var scrolled = window.scrollY > 40;
    header.classList.toggle("border-ink-line", scrolled || menuOpen);
    header.classList.toggle("bg-ink/95", scrolled || menuOpen);
    header.classList.toggle("backdrop-blur-md", scrolled || menuOpen);
    header.classList.toggle("border-transparent", !(scrolled || menuOpen));
    header.classList.toggle("bg-transparent", !(scrolled || menuOpen));
    var inner = header.querySelector(":scope > div");
    if (inner) {
      inner.classList.toggle("h-20", scrolled);
      inner.classList.toggle("h-24", !scrolled);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // ---------- Menú móvil ----------
  var menuOpen = false;
  var menuBtn = document.querySelector('button[aria-label="Abrir menú"]');
  var mobileNav = null;

  function buildMobileNav() {
    var desktopLinks = document.querySelectorAll('nav[aria-label="Navegación principal"] a');
    var nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Menú móvil");
    nav.className = "border-t border-ink-line px-6 pb-8 pt-4 lg:hidden";
    var ul = document.createElement("ul");
    ul.className = "flex flex-col";
    desktopLinks.forEach(function (a) {
      var li = document.createElement("li");
      var link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent;
      link.className = "block border-b border-ink-line py-4 font-serif text-2xl text-paper";
      link.addEventListener("click", closeMenu);
      li.appendChild(link);
      ul.appendChild(li);
    });
    nav.appendChild(ul);
    var cta = document.createElement("a");
    cta.href = "contacto.html";
    cta.className =
      "mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-gold px-8 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink";
    cta.textContent = "Solicitar una consulta";
    nav.appendChild(cta);
    return nav;
  }

  function closeMenu() {
    menuOpen = false;
    if (mobileNav) mobileNav.remove();
    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Abrir menú");
    }
    onScroll();
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      if (menuOpen) {
        closeMenu();
        return;
      }
      menuOpen = true;
      mobileNav = buildMobileNav();
      header.appendChild(mobileNav);
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Cerrar menú");
      onScroll();
    });
  }

  // ---------- Preguntas frecuentes (acordeón) ----------
  document.querySelectorAll('button[data-radix-collection-item]').forEach(function (btn) {
    btn.addEventListener("click", function () {
      var region = document.getElementById(btn.getAttribute("aria-controls")) ||
        document.querySelector('[aria-labelledby="' + btn.id + '"]');
      if (!region) return;
      var open = btn.getAttribute("data-state") === "open";
      // cerrar los demás
      document.querySelectorAll('button[data-radix-collection-item]').forEach(function (other) {
        var otherRegion = document.querySelector('[aria-labelledby="' + other.id + '"]');
        other.setAttribute("data-state", "closed");
        other.setAttribute("aria-expanded", "false");
        if (otherRegion) {
          otherRegion.setAttribute("data-state", "closed");
          otherRegion.setAttribute("hidden", "");
          otherRegion.style.height = "";
        }
      });
      if (!open) {
        btn.setAttribute("data-state", "open");
        btn.setAttribute("aria-expanded", "true");
        region.removeAttribute("hidden");
        region.setAttribute("data-state", "open");
        region.style.animation = "none";
        region.style.height = "auto";
      }
    });
  });

  // ---------- Formulario de contacto → WhatsApp ----------
  var form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var topic = (form.querySelector('[name="topic"]') || {}).value || "";
      var message = (form.querySelector('[name="message"]') || {}).value || "";
      var lines = [
        "Hola Dra. Moran Arias, mi nombre es " + name.trim() + ".",
        topic + ".",
      ];
      if (message.trim()) lines.push("", message.trim());
      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  // ---------- "Consultar por este servicio" → WhatsApp ----------
  document.querySelectorAll("[data-servicio]").forEach(function (btn) {
    var texto = "Hola Dra. Moran Arias, quisiera consultar por el servicio de " +
      btn.getAttribute("data-servicio") + ".";
    btn.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(texto);
    btn.target = "_blank";
    btn.rel = "noreferrer";
  });

  onScroll();
})();