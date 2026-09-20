(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setMenuOpen = (open) => {
    if (!header || !toggle) return;
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle?.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-open"));
  });
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  const langs = [
    "Welcome to SG Global PTE Ltd (Singapore)",
    "ยินดีต้อนรับสู่ SG Global PTE Ltd (สิงคโปร์)",
    "欢迎来到 SG Global PTE Ltd (新加坡)",
    "へようこそ SG Global PTE Ltd (シンガポール)",
    "에 오신 것을 환영합니다 SG Global PTE Ltd (싱가포르)",
    "Добро пожаловать в A-One Global PTE Limited (Сингапор)",
  ];
  const langLine = document.getElementById("lang-line");
  let langIndex = 0;
  if (langLine) {
    setInterval(() => {
      langIndex = (langIndex + 1) % langs.length;
      langLine.textContent = langs[langIndex];
    }, 4000);
  }

  const inquiries = {
    buy: { title: "For Buying", hint: "" },
    sell: { title: "For Sale", hint: "" },
    factory: { title: "Want to sell your factory?", hint: "" },
  };

  const drawerHtml = `
    <div class="drawer-backdrop" data-close-drawer></div>
    <aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <button class="btn btn-line" type="button" data-close-drawer>Cancel</button>
      <h2 id="drawer-title" style="font-family:var(--font-display);font-size:2rem;font-weight:400;margin:1rem 0 0.35rem;"></h2>
      <p class="muted" id="drawer-hint"></p>
      <div class="tabs" role="tablist">
        <button type="button" data-tab="buy">For Buying</button>
        <button type="button" data-tab="sell">For Sale</button>
        <button type="button" data-tab="factory">Want to sell factory</button>
      </div>
      <form class="form" id="inquiry-form">
        <input type="hidden" name="intent" id="inquiry-intent" value="buy" />
        <label>Your Name <input name="name" required autocomplete="name" /></label>
        <label>Mobile No. <input name="phone" type="tel" autocomplete="tel" /></label>
        <label>Email Id <input name="email" type="email" required autocomplete="email" /></label>
        <label>Message <textarea name="message" required></textarea></label>
        <button class="btn btn-ink" type="submit">Submit</button>
      </form>
    </aside>
  `;

  document.body.insertAdjacentHTML("beforeend", drawerHtml);

  const titleEl = document.getElementById("drawer-title");
  const hintEl = document.getElementById("drawer-hint");
  const intentEl = document.getElementById("inquiry-intent");
  const tabs = document.querySelectorAll("[data-tab]");
  const messageEl = document.querySelector("#inquiry-form textarea");

  const setIntent = (key) => {
    const item = inquiries[key] || inquiries.buy;
    titleEl.textContent = item.title;
    hintEl.textContent = item.hint;
    intentEl.value = key;
    tabs.forEach((tab) => tab.classList.toggle("is-on", tab.dataset.tab === key));
  };

  const openDrawer = (key = "buy", preset = "") => {
    setIntent(key);
    if (messageEl && preset) messageEl.value = preset;
    document.body.classList.add("drawer-open");
  };

  const closeDrawer = () => document.body.classList.remove("drawer-open");

  document.querySelectorAll("[data-inquiry]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openDrawer(btn.dataset.inquiry, btn.dataset.preset || "");
    });
  });
  tabs.forEach((tab) => tab.addEventListener("click", () => setIntent(tab.dataset.tab)));
  document.querySelectorAll("[data-close-drawer]").forEach((el) => {
    el.addEventListener("click", closeDrawer);
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDrawer();
      setMenuOpen(false);
    }
  });

  document.getElementById("inquiry-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const intent = data.get("intent");
    const subject = encodeURIComponent(`SG Global — ${intent}`);
    const body = encodeURIComponent(
      [
        `Intent: ${intent}`,
        `Your Name: ${data.get("name")}`,
        `Mobile No.: ${data.get("phone")}`,
        `Email Id: ${data.get("email")}`,
        "",
        data.get("message"),
      ].join("\n")
    );
    window.location.href = `mailto:info@importexport.net.in?subject=${subject}&body=${body}`;
  });

  const mailForm = (formId, subject) => {
    document.getElementById(formId)?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const body = encodeURIComponent(
        `${data.get("name")} · ${data.get("email")} · ${data.get("phone")}\n\n${data.get("message")}`
      );
      window.location.href = `mailto:info@importexport.net.in?subject=${encodeURIComponent(subject)}&body=${body}`;
    });
  };
  mailForm("contact-form", "SG Global — Contact Us");
  mailForm("optin-form", "SG Global — Opt In");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealNodes.forEach((node) => observer.observe(node));
})();
