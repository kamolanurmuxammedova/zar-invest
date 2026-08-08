/**
 * <site-header base="./"> / <site-footer base="./"> / <site-loader>
 * Build-free shared markup via Custom Elements — works under file:// and
 * http:// alike (no fetch()/ES-module CORS restrictions). `base` is the
 * relative path prefix back to the project root for the page it's used on
 * ("./" at root, "../" under pages/, "../../" under pages/hisob-pages/).
 */
(function () {
  function initials(firstname, lastname) {
    const a = (firstname || "").trim()[0] || "";
    const b = (lastname || "").trim()[0] || "";
    return (a + b || "Z").toUpperCase();
  }

  function avatarMarkup(state) {
    const { personal } = state;
    if (personal.avatar) {
      return `<img src="${personal.avatar}" alt="" class="w-full h-full object-cover" />`;
    }
    return `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2312] to-[#171207] text-[#ECC246] text-[13px] font-semibold font-display">${initials(personal.firstname, personal.lastname)}</div>`;
  }

  window.ZarAvatar = { markup: avatarMarkup, initials };

  function navItems(base) {
    return [
      { label: "Loyihalar", href: `${base}pages/katalog.html`, page: "katalog" },
      { label: "Qanday ishlaydi", href: `${base}index.html#jarayon`, page: null },
      { label: "San'at kengashi", href: `${base}index.html#shariat-kengashi`, page: null },
      { label: "Hisobotlar", href: `${base}index.html#hisobotlar`, page: null },
      { label: "Kalkulyator", href: `${base}index.html#kalkulyator`, page: null },
    ];
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      this.base = this.getAttribute("base") || "./";
      this.render();
      this._onChange = () => this.renderAuth();
      window.addEventListener("zar:user-changed", this._onChange);
    }

    disconnectedCallback() {
      window.removeEventListener("zar:user-changed", this._onChange);
    }

    render() {
      const base = this.base;
      const currentPage = document.body.dataset.page || "";
      const items = navItems(base);

      const links = items
        .map(
          (item) => `
        <a href="${item.href}" data-page="${item.page || ""}"
           class="nav-link relative px-4 py-2 rounded-full text-[13px] transition-all duration-300 ${
             item.page && item.page === currentPage
               ? "text-[#14110A] bg-gradient-to-r from-[#F8DD94] to-[#ECC246] font-medium shadow-[0_4px_20px_-6px_rgba(236,194,70,.6)]"
               : "text-white/60 hover:text-white hover:bg-white/6"
           }">
          ${item.label}
        </a>`
        )
        .join("");

      const mobileLinks = items
        .map(
          (item, i) => `
        <a href="${item.href}" data-animate-item class="group flex items-center justify-between border-b border-white/8 py-5 text-[22px] font-display text-white/85 hover:text-[#ECC246] hover:pl-2 transition-all duration-300">
          <span>${item.label}</span>
          <span class="text-[11px] font-mono text-white/25 group-hover:text-[#ECC246] transition-colors">0${i + 1}</span>
        </a>`
        )
        .join("");

      this.innerHTML = `
        <input type="checkbox" id="nav-toggle" class="peer hidden" />

        <div class="sticky top-3 sm:top-4 z-50 px-3 sm:px-6">
          <header class="relative max-w-[1240px] mx-auto flex items-center justify-between gap-3 pl-3.5 pr-2.5 sm:pl-5 sm:pr-3 py-2.5 rounded-full glass-strong border border-white/10 shadow-[0_10px_50px_-15px_rgba(0,0,0,.7)] transition-shadow duration-300">
            <a href="${base}index.html" class="shrink-0 flex items-center gap-2.5" aria-label="ZAR Invest">
              <span class="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#F8DD94] via-[#ECC246] to-[#C88A2E] flex items-center justify-center shadow-[0_0_22px_rgba(236,194,70,.55)] shrink-0">
                <span class="font-display text-[13px] font-bold text-[#14110A]">Z</span>
              </span>
              <img src="${base}images/logo.svg" alt="Zar Invest" class="h-[16px] max-[420px]:hidden" />
            </a>

            <nav class="hidden lg:flex items-center gap-1 text-[#99A0AC]">
              ${links}
            </nav>

            <div class="hidden lg:flex items-center gap-3" id="auth-container"></div>

            <label for="nav-toggle" class="lg:hidden cursor-pointer w-10 h-10 rounded-full flex items-center justify-center border border-white/10 bg-white/5 hover:border-[#ECC246]/40 hover:bg-[#ECC246]/10 transition-colors shrink-0" aria-label="Menyu">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect width="16" height="1.6" rx="0.8" fill="#D1C5AF" />
                <rect y="5.2" width="16" height="1.6" rx="0.8" fill="#D1C5AF" />
                <rect y="10.4" width="16" height="1.6" rx="0.8" fill="#D1C5AF" />
              </svg>
            </label>
          </header>
        </div>

        <div class="nav-drawer fixed inset-0 z-[60] lg:hidden bg-[#06070A] opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto">
          <label for="nav-toggle" class="absolute inset-0 cursor-pointer" aria-label="Menyuni yopish"></label>
          <div class="absolute inset-0 grain" aria-hidden="true"></div>
          <div class="aurora-field is-fixed opacity-50" aria-hidden="true">
            <span class="aurora-blob gold w-[380px] h-[380px] -top-24 -left-24"></span>
            <span class="aurora-blob violet w-[320px] h-[320px] bottom-0 -right-20"></span>
          </div>
          <div class="nav-drawer-panel relative h-full flex flex-col px-6 sm:px-10 pt-8 pb-10 overflow-y-auto">
            <div class="flex items-center justify-between mb-10">
              <img src="${base}images/logo.svg" alt="Zar Invest" class="h-[18px]" />
              <label for="nav-toggle" class="cursor-pointer w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-[#ECC246] hover:border-[#ECC246]/40 transition-colors" aria-label="Yopish">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/></svg>
              </label>
            </div>
            <nav data-stagger="0.05" class="flex flex-col">${mobileLinks}</nav>
            <div class="mt-auto flex flex-col gap-3 pt-10" id="auth-container-mobile"></div>
          </div>
        </div>`;

      this.renderAuth();
    }

    renderAuth() {
      const base = this.base;
      const state = window.ZarStorage.get();
      const hasAccount = window.ZarStorage.hasAccount();
      const desktop = this.querySelector("#auth-container");
      const mobile = this.querySelector("#auth-container-mobile");
      if (!desktop) return;

      const fullName = `${state.personal.firstname} ${state.personal.lastname}`.trim() || "Foydalanuvchi";

      const loggedOutDesktop = `
        <a href="${base}pages/hisob-pages/hisob1.html" class="text-white/60 hover:text-white transition-colors text-[13px] px-3">Kirish</a>
        <a href="${base}pages/hisob-pages/hisob1.html" class="btn-primary text-[13px] px-5 py-2.5">Hisob ochish</a>`;

      const loggedInDesktop = `
        <a href="${base}profile.html" class="flex items-center gap-2.5 group pr-1">
          <span class="text-white text-[13px] font-medium group-hover:text-[#ECC246] transition-colors max-w-[110px] truncate">${fullName}</span>
          <span class="w-9 h-9 rounded-full border-2 border-[#ECC246]/70 overflow-hidden group-hover:border-[#ECC246] group-hover:shadow-[0_0_16px_rgba(236,194,70,.5)] transition-all shrink-0">${avatarMarkup(state)}</span>
        </a>`;

      desktop.innerHTML = hasAccount ? loggedInDesktop : loggedOutDesktop;
      if (mobile) {
        mobile.innerHTML = hasAccount
          ? `<a href="${base}profile.html" class="flex items-center gap-3 px-1 py-2">
               <span class="w-11 h-11 rounded-full border-2 border-[#ECC246] overflow-hidden shrink-0">${avatarMarkup(state)}</span>
               <span class="text-white text-[15px] font-medium">${fullName}</span>
             </a>`
          : `<a href="${base}pages/hisob-pages/hisob1.html" class="btn-ghost px-5 py-3.5 text-center text-[14px]">Kirish</a>
             <a href="${base}pages/hisob-pages/hisob1.html" class="btn-primary px-5 py-3.5 text-center text-[14px]">Hisob ochish</a>`;
      }
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const base = this.getAttribute("base") || "./";
      this.innerHTML = `
        <footer class="relative overflow-hidden bg-[#08090B] border-t border-white/5 pt-20 max-[500px]:pt-14 pb-10">
          <div class="aurora-field opacity-30" aria-hidden="true">
            <span class="aurora-blob gold w-[440px] h-[440px] -top-48 left-1/4"></span>
            <span class="aurora-blob teal w-[320px] h-[320px] -bottom-20 right-0"></span>
          </div>

          <div class="relative max-w-[1240px] mx-auto px-6 max-[500px]:px-4">
            <div data-animate="fade-up" class="glass-panel card-radius p-7 sm:p-12 mb-16 max-[500px]:mb-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 hover-glow">
              <div>
                <p class="text-[11px] tracking-[0.25em] text-[#ECC246] mb-3 uppercase">Boshlash vaqti keldi</p>
                <h3 class="font-display font-medium text-[24px] sm:text-[32px] text-white leading-[1.2] max-w-lg">
                  Birinchi ulushingizni <span class="text-gradient">bugun</span> sotib oling.
                </h3>
              </div>
              <a href="${base}pages/katalog.html" class="btn-primary px-7 py-4 text-[13px] tracking-[0.03em] shrink-0 w-full lg:w-auto">
                LOYIHALARNI KO'RISH <span aria-hidden="true">→</span>
              </a>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 pb-14 border-b border-white/8">
              <div class="col-span-2 md:col-span-1">
                <img src="${base}images/logo.svg" alt="Zar Invest" class="h-[22px] mb-5" />
                <p class="text-[13px] text-white/40 leading-[1.7] max-w-[240px]">
                  O'zbekistondagi ilk islom moliya tamoyillariga asoslangan kraudfanding platformasi.
                </p>
                <div class="flex gap-3 mt-6">
                  <a href="#" aria-label="Telegram" class="w-[36px] h-[36px] rounded-full glass flex items-center justify-center text-white/50 hover:text-[#ECC246] hover:border-[#ECC246]/40 hover:shadow-[0_0_16px_rgba(236,194,70,.35)] transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 2.7 11.9c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.7 3.4c.9.5 1.5.2 1.7-.8L23.9 5.6c.3-1.3-.5-1.9-1.9-1.3zM8.7 14.3l9.5-6c.5-.3.9-.1.5.2l-7.9 7.2-.3 3.2-1.5-3.3z"/></svg>
                  </a>
                  <a href="#" aria-label="Instagram" class="w-[36px] h-[36px] rounded-full glass flex items-center justify-center text-white/50 hover:text-[#ECC246] hover:border-[#ECC246]/40 hover:shadow-[0_0_16px_rgba(236,194,70,.35)] transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>
                  </a>
                  <a href="mailto:info@zarinvest.uz" aria-label="Email" class="w-[36px] h-[36px] rounded-full glass flex items-center justify-center text-white/50 hover:text-[#ECC246] hover:border-[#ECC246]/40 hover:shadow-[0_0_16px_rgba(236,194,70,.35)] transition-all">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 class="text-[10px] tracking-[0.15em] text-white/85 mb-5 font-display">PLATFORMA</h4>
                <ul class="text-white/40 text-[13px] flex flex-col gap-[14px]">
                  <li><a href="${base}pages/katalog.html" class="hover:text-[#ECC246] transition-colors">Loyihalar</a></li>
                  <li><a href="${base}index.html#jarayon" class="hover:text-[#ECC246] transition-colors">Qanday ishlaydi</a></li>
                  <li><a href="${base}index.html#kalkulyator" class="hover:text-[#ECC246] transition-colors">Kalkulyator</a></li>
                  <li><a href="${base}index.html#hisobotlar" class="hover:text-[#ECC246] transition-colors">Hisobotlar</a></li>
                </ul>
              </div>

              <div>
                <h4 class="text-[10px] tracking-[0.15em] text-white/85 mb-5 font-display">HUQUQIY</h4>
                <ul class="text-white/40 text-[13px] flex flex-col gap-[14px]">
                  <li><a href="#" class="hover:text-[#ECC246] transition-colors">Foydalanish shartlari</a></li>
                  <li><a href="#" class="hover:text-[#ECC246] transition-colors">Maxfiylik siyosati</a></li>
                  <li><a href="#" class="hover:text-[#ECC246] transition-colors">Ommaviy oferta</a></li>
                  <li><a href="${base}index.html#shariat-kengashi" class="hover:text-[#ECC246] transition-colors">Shariat sertifikati</a></li>
                </ul>
              </div>

              <div>
                <h4 class="text-[10px] tracking-[0.15em] text-white/85 mb-5 font-display">BOG'LANISH</h4>
                <ul class="text-white/40 text-[13px] flex flex-col gap-[16px]">
                  <li class="flex gap-[12px] items-start">
                    <svg width="14" height="14" class="mt-[2px] shrink-0 text-[#ECC246]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"/></svg>
                    +998 (71) 200-00-00
                  </li>
                  <li class="flex gap-[12px] items-start">
                    <svg width="14" height="14" class="mt-[2px] shrink-0 text-[#ECC246]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 004 10.2C4 17.5 12 22 12 22z"/><circle cx="12" cy="10" r="3"/></svg>
                    Toshkent sh., Mirobod tumani, 45
                  </li>
                  <li class="flex gap-[12px] items-start">
                    <svg width="14" height="14" class="mt-[2px] shrink-0 text-[#ECC246]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                    info@zarinvest.uz
                  </li>
                </ul>
              </div>
            </div>

            <div class="text-[10px] text-white/30 flex flex-wrap gap-[8px] justify-between pt-8">
              <p>© 2024–2026 ZAR INVEST. BARCHA HUQUQLAR HIMOYALANGAN.</p>
              <p>O'ZBEKISTON RESPUBLIKASI MARKAZIY BANKI LITSENZIYASI №0045-89</p>
            </div>
          </div>
        </footer>`;
    }
  }

  class SiteLoader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div id="site-loader" class="fixed inset-0 z-[999] bg-[#06070A] flex flex-col items-center justify-center gap-6 transition-opacity duration-500">
          <div class="relative flex items-center justify-center">
            <span class="absolute w-24 h-24 rounded-full bg-[#ECC246]/25 blur-3xl animate-pulse"></span>
            <span class="relative font-display text-[24px] font-semibold tracking-[0.25em] text-gradient">ZAR</span>
          </div>
          <span class="w-7 h-7 rounded-full border-2 border-white/10 border-t-[#ECC246] animate-spin"></span>
        </div>`;
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
  customElements.define("site-loader", SiteLoader);
})();
