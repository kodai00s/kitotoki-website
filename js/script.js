(function () {
  "use strict";

  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var form = document.getElementById("contactForm");
  if (!form) return;
  var endpoint = (window.KITOTOKI_CONFIG || {}).contactEndpoint || "";
  var ready = /^https:\/\/script\.google\.com\/macros\/s\/[a-zA-Z0-9_-]+\/exec$/.test(endpoint);
  var button = document.getElementById("submitBtn");
  var note = document.getElementById("formNote");
  if (ready) {
    form.action = endpoint;
    button.disabled = false;
    button.textContent = "相談内容を送信する";
  }
  form.addEventListener("submit", function (event) {
    if (!ready) {
      event.preventDefault();
      note.textContent = "送信できませんでした。時間をおいて、もう一度お試しください。";
      note.className = "form-note is-error";
      return;
    }
    if (form.elements.website.value) { event.preventDefault(); return; }
    note.textContent = "別画面の受付結果をご確認ください。送信できなかった場合に備えて、入力内容は残しています。";
  });
})();
