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

  // form: UI only, no backend wired up yet — validates and shows a mocked result.
  var form = document.getElementById("contactForm");
  if (form) {
    var startedAt = Date.now();
    var submitBtn = document.getElementById("submitBtn");
    var note = document.getElementById("formNote");

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var honeypot = form.querySelector("#website");
      if (honeypot && honeypot.value) return;

      if (Date.now() - startedAt < 1500) {
        note.textContent = "内容をご確認のうえ、もう一度お試しください。";
        note.className = "form-note is-error";
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "送信中…";
      note.textContent = "";
      note.className = "form-note";

      window.setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "送信する";
        note.textContent = "※ これはデモ表示です。実際の送信機能は準備中のため、まだメールは届きません。";
        note.className = "form-note is-success";
        form.reset();
        startedAt = Date.now();
      }, 700);
    });
  }
})();
