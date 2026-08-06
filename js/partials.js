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
    return `<div class="w-full h-full flex items-center justify-center bg-[#221E14] text-[#ECC246] text-[13px] font-semibold">${initials(personal.firstname, personal.lastname)}</div>`;
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
      const links = navItems(base)
        .map(
          (item) => `
        <a href="${item.href}" data-page="${item.page || ""}"
           class="nav-link relative py-[6px] hover:text-white transition-colors ${item.page && item.page === currentPage ? "text-[#ECC246]" : ""}">
          ${item.label}
          ${item.page && item.page === currentPage ? '<span class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-[#ECC246] rounded-full"></span>' : ""}
        </a>`
        )
        .join("");

      const mobileLinks = navItems(base)
        .map((item) => `<a href="${item.href}" class="text-[15px] text-[#D1C5AF] hover:text-[#ECC246] transition-colors">${item.label}</a>`)
        .join("");

      this.innerHTML = `
        <input type="checkbox" id="nav-toggle" class="peer hidden" />
        <header class="sticky top-0 z-40 border-b border-[#2A2F3A] bg-[#0D0E12]/85 backdrop-blur-md">
          <div class="max-w-[1450px] mx-auto px-[24px] max-[500px]:px-[16px] py-[15px] flex justify-between items-center">
            <a href="${base}index.html" class="shrink-0" aria-label="ZAR Invest">
              <img src="${base}images/logo.svg" alt="Zar Invest" class="h-[26px] max-[400px]:h-[22px]" />
            </a>

            <nav class="hidden lg:flex items-center gap-[30px] text-[14px] text-[#99A0AC]">
              ${links}
            </nav>

            <div class="hidden lg:flex items-center gap-4" id="auth-container"></div>

            <label for="nav-toggle" class="lg:hidden cursor-pointer p-[6px] -mr-[6px]" aria-label="Menyu">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <rect width="22" height="2" rx="1" fill="#D1C5AF" />
                <rect y="7" width="22" height="2" rx="1" fill="#D1C5AF" />
                <rect y="14" width="22" height="2" rx="1" fill="#D1C5AF" />
              </svg>
            </label>
          </div>

          <div class="hidden peer-checked:flex lg:hidden flex-col px-[24px] pb-[24px] gap-[20px] border-t border-[#2A2F3A]">
            <nav class="flex flex-col gap-[16px] pt-[16px]">${mobileLinks}</nav>
            <div class="flex flex-col gap-[12px]" id="auth-container-mobile"></div>
          </div>
        </header>`;

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
        <a href="${base}pages/hisob-pages/hisob1.html" class="text-[#99A0AC] hover:text-[#ECC246] transition-colors text-[14px]">Kirish</a>
        <a href="${base}pages/hisob-pages/hisob1.html" class="bg-[#ECC246] text-[#0D0E12] px-4 py-2 rounded-lg font-medium text-[14px] hover:bg-[#d8ae3a] transition-colors">Hisob ochish</a>`;

      const loggedInDesktop = `
        <a href="${base}profile.html" class="flex items-center gap-3 group">
          <span class="text-white text-sm font-medium group-hover:text-[#ECC246] transition-colors">${fullName}</span>
          <span class="w-9 h-9 rounded-full border-2 border-[#ECC246] overflow-hidden group-hover:border-white transition-colors shrink-0">${avatarMarkup(state)}</span>
        </a>`;

      desktop.innerHTML = hasAccount ? loggedInDesktop : loggedOutDesktop;
      if (mobile) {
        mobile.innerHTML = hasAccount
          ? `<a href="${base}profile.html" class="flex items-center gap-3 px-[4px] py-[8px]">
               <span class="w-9 h-9 rounded-full border-2 border-[#ECC246] overflow-hidden shrink-0">${avatarMarkup(state)}</span>
               <span class="text-white text-sm font-medium">${fullName}</span>
             </a>`
          : `<a href="${base}pages/hisob-pages/hisob1.html" class="px-[16px] py-[10px] border border-[#2A2F3A] rounded-lg text-center text-[#D1C5AF]">Kirish</a>
             <a href="${base}pages/hisob-pages/hisob1.html" class="px-[16px] py-[10px] bg-[#ECC246] text-[#0D0E12] rounded-lg text-center font-medium">Hisob ochish</a>`;
      }
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      const base = this.getAttribute("base") || "./";
      this.innerHTML = `
        <footer class="bg-[#0B0C0F] w-full pt-[70px] pb-[40px] max-[500px]:pt-[48px] border-t border-[#2A2F3A]">
          <div class="max-w-[1450px] mx-auto px-[24px] max-[500px]:px-[16px] pb-[56px] grid grid-cols-2 md:grid-cols-4 gap-[36px]">
            <div class="col-span-2 md:col-span-1">
              <img src="${base}images/logo.svg" alt="Zar Invest" class="h-[24px] mb-[20px]" />
              <p class="text-[13px] text-[#99A0AC] leading-[1.7] max-w-[240px]">
                O'zbekistondagi ilk islom moliya tamoyillariga asoslangan kraudfanding platformasi.
              </p>
              <div class="flex gap-[14px] mt-[24px]">
                <a href="#" aria-label="Telegram" class="w-[34px] h-[34px] rounded-full border border-[#2A2F3A] flex items-center justify-center text-[#99A0AC] hover:text-[#ECC246] hover:border-[#ECC246]/40 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 2.7 11.9c-1.2.5-1.2 1.2-.2 1.5l4.9 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.7 3.4c.9.5 1.5.2 1.7-.8L23.9 5.6c.3-1.3-.5-1.9-1.9-1.3zM8.7 14.3l9.5-6c.5-.3.9-.1.5.2l-7.9 7.2-.3 3.2-1.5-3.3z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" class="w-[34px] h-[34px] rounded-full border border-[#2A2F3A] flex items-center justify-center text-[#99A0AC] hover:text-[#ECC246] hover:border-[#ECC246]/40 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>
                </a>
                <a href="mailto:info@zarinvest.uz" aria-label="Email" class="w-[34px] h-[34px] rounded-full border border-[#2A2F3A] flex items-center justify-center text-[#99A0AC] hover:text-[#ECC246] hover:border-[#ECC246]/40 transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h4 class="text-[10px] tracking-[0.15em] text-[#E2E2E8] mb-[20px]">PLATFORMA</h4>
              <ul class="text-[#99A0AC] text-[13px] flex flex-col gap-[14px]">
                <li><a href="${base}pages/katalog.html" class="hover:text-[#ECC246] transition-colors">Loyihalar</a></li>
                <li><a href="${base}index.html#jarayon" class="hover:text-[#ECC246] transition-colors">Qanday ishlaydi</a></li>
                <li><a href="${base}index.html#kalkulyator" class="hover:text-[#ECC246] transition-colors">Kalkulyator</a></li>
                <li><a href="${base}index.html#hisobotlar" class="hover:text-[#ECC246] transition-colors">Hisobotlar</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-[10px] tracking-[0.15em] text-[#E2E2E8] mb-[20px]">HUQUQIY</h4>
              <ul class="text-[#99A0AC] text-[13px] flex flex-col gap-[14px]">
                <li><a href="#" class="hover:text-[#ECC246] transition-colors">Foydalanish shartlari</a></li>
                <li><a href="#" class="hover:text-[#ECC246] transition-colors">Maxfiylik siyosati</a></li>
                <li><a href="#" class="hover:text-[#ECC246] transition-colors">Ommaviy oferta</a></li>
                <li><a href="${base}index.html#shariat-kengashi" class="hover:text-[#ECC246] transition-colors">Shariat sertifikati</a></li>
              </ul>
            </div>

            <div>
              <h4 class="text-[10px] tracking-[0.15em] text-[#E2E2E8] mb-[20px]">BOG'LANISH</h4>
              <ul class="text-[#99A0AC] text-[13px] flex flex-col gap-[16px]">
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

          <div class="border-t border-[#1F2229] max-w-[1450px] mx-auto text-[10px] text-[#5C6470] flex flex-wrap gap-[8px] justify-between px-[24px] max-[500px]:px-[16px] pt-[28px]">
            <p>© 2024–2026 ZAR INVEST. BARCHA HUQUQLAR HIMOYALANGAN.</p>
            <p>O'ZBEKISTON RESPUBLIKASI MARKAZIY BANKI LITSENZIYASI №0045-89</p>
          </div>
        </footer>`;
    }
  }

  class SiteLoader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div id="site-loader" class="fixed inset-0 z-[999] bg-[#0D0E12] flex flex-col items-center justify-center gap-[18px] transition-opacity duration-500">
          <span class="font-cinzel text-[#ECC246] text-[20px] tracking-[0.15em]">ZAR INVEST</span>
          <span class="w-[26px] h-[26px] rounded-full border-2 border-[#2A2F3A] border-t-[#ECC246] animate-spin"></span>
        </div>`;
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
  customElements.define("site-loader", SiteLoader);
})();
