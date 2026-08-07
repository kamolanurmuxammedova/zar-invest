/**
 * ZAR_PROJECTS — single source of truth for every investment project shown
 * across index.html, pages/katalog.html and pages/loyiha.html.
 * ZarProjects.* provides shared rendering + filtering so cards never have
 * to be hand-duplicated per page again.
 */
(function () {
  const ZAR_PROJECTS = [
    {
      id: "mirabad-avenue-tower",
      name: "Mirabad Avenue Tower",
      category: "turar-joy",
      status: "ochiq",
      location: "Toshkent, Mirobod tumani",
      shortDescription: "Toshkent markazidagi premium darajadagi turar-joy majmuasi. 18 oylik qurilish sikli.",
      description: "Mirabad Avenue Tower — Toshkent shahri markazida, elchixonalar hududiga yaqin joylashgan 22 qavatli premium turar-joy majmuasi. Loyiha zamonaviy arxitektura, yashil hovli va to'liq infratuzilma bilan ta'minlangan. Barcha mablag'lar Kapitalbank ATB eskrou hisobvarag'ida saqlanadi va faqat qurilish bosqichlariga muvofiq quruvchiga o'tkaziladi.",
      coverImage: "images/uy1.svg",
      fundingGoal: 6000000000,
      fundingRaised: 4200000000,
      investorsCount: 812,
      annualReturnPct: 16.5,
      termMonths: 18,
      riskLevel: "O'rta",
      minInvestment: 1000000,
      contractType: "Musharaka",
      highlights: ["Eskrou hisobvarag'i (Kapitalbank)", "Xalqaro audit — KPMG", "Shariat kengashi tasdiqlagan"],
    },
    {
      id: "samarqand-it-hub",
      name: "Samarqand IT-Hub",
      category: "tijorat",
      status: "ochiq",
      location: "Samarqand, tarixiy shahar markazi",
      shortDescription: "Tarixiy shahar markazidagi zamonaviy tijorat loyihasi. Ijara daromadiga yo'naltirilgan.",
      description: "Samarqand IT-Hub — texnologik kompaniyalar va startaplar uchun mo'ljallangan zamonaviy biznes markazi. Uzoq muddatli ijara shartnomalari asosida barqaror daromad shakllantiradi. Loyiha Samarqand shahar hokimiyati bilan hamkorlikda amalga oshirilmoqda.",
      coverImage: "images/uy2.svg",
      fundingGoal: 10000000000,
      fundingRaised: 1800000000,
      investorsCount: 214,
      annualReturnPct: 14.0,
      termMonths: 36,
      riskLevel: "Past",
      minInvestment: 2000000,
      contractType: "Ijara",
      highlights: ["Uzoq muddatli ijarachilar", "Shahar hokimiyati hamkorligi", "Barqaror oylik daromad"],
    },
    {
      id: "bukhara-smart-city",
      name: "Bukhara Smart City",
      category: "yaqinda",
      status: "yaqinda",
      location: "Buxoro",
      shortDescription: "Yashash va ishlash uchun integratsiyalashgan ekotizim. Loyiha arizalari kutilmoqda.",
      description: "Bukhara Smart City — Buxoro shahrida yashash, ishlash va dam olish maydonlarini birlashtiruvchi yirik ko'p funksiyali shahar loyihasi. Loyiha hujjatlari va Shariat kengashi tasdig'i yakunlanish arafasida, tez orada rasman e'lon qilinadi.",
      coverImage: "images/uy3.svg",
      fundingGoal: 15000000000,
      fundingRaised: 0,
      investorsCount: 1240,
      annualReturnPct: null,
      termMonths: 24,
      riskLevel: "O'rta",
      minInvestment: 1000000,
      contractType: "Musharaka",
      highlights: ["Aralash foydalanishdagi ekotizim", "Hujjatlar tasdiqlanish jarayonida", "Ro'yxatga oldindan yozilish ochiq"],
    },
    {
      id: "yunusabad-residence",
      name: "Yunusabad Residence",
      category: "turar-joy",
      status: "ochiq",
      location: "Toshkent, Yunusobod tumani",
      shortDescription: "Bolalar bog'chasi va yashil hudud bilan ta'minlangan oilaviy turar-joy majmuasi.",
      description: "Yunusabad Residence — yosh oilalar uchun mo'ljallangan, xavfsiz hudud, bolalar bog'chasi va keng yashil maydonlarga ega turar-joy majmuasi. Qurilish 4 bosqichda olib borilmoqda, hozirda 1-bosqich sarmoya to'plamoqda.",
      coverImage: "images/uy1.svg",
      fundingGoal: 5200000000,
      fundingRaised: 2340000000,
      investorsCount: 455,
      annualReturnPct: 15.0,
      termMonths: 20,
      riskLevel: "O'rta",
      minInvestment: 1000000,
      contractType: "Musharaka",
      highlights: ["Bolalar bog'chasi hududda", "4 bosqichli qurilish rejasi", "Xavfsiz, yopiq hudud"],
    },
    {
      id: "chorsu-heritage-quarter",
      name: "Chorsu Heritage Quarter",
      category: "turar-joy",
      status: "yakunlangan",
      location: "Toshkent, Chorsu",
      shortDescription: "Tarixiy Chorsu hududidagi turar-joy kvartali. Loyiha muvaffaqiyatli yakunlandi.",
      description: "Chorsu Heritage Quarter loyihasi 2025-yilda muvaffaqiyatli yakunlandi va barcha investorlarga 15.2% yillik daromad to'liq to'landi. Loyiha tarixiy me'moriy uslubni zamonaviy qulayliklar bilan uyg'unlashtirdi.",
      coverImage: "images/uy2.svg",
      fundingGoal: 4500000000,
      fundingRaised: 4500000000,
      investorsCount: 601,
      annualReturnPct: 15.2,
      termMonths: 14,
      riskLevel: "Past",
      minInvestment: 1000000,
      contractType: "Musharaka",
      highlights: ["Investorlarga 15.2% daromad to'landi", "Muddatidan oldin yakunlandi", "Tarixiy me'moriy uslub"],
    },
    {
      id: "tashkent-city-offices",
      name: "Tashkent City Offices",
      category: "tijorat",
      status: "ochiq",
      location: "Toshkent, Yunusobod tumani",
      shortDescription: "Zamonaviy ofis maydonlari, uzoq muddatli ijarachilar bilan shartnomalar.",
      description: "Tashkent City Offices — Toshkent biznes markazida joylashgan A-toifali ofis binosi. Xalqaro kompaniyalar bilan allaqachon ijara shartnomalari imzolangan, bu daromadning barqarorligini ta'minlaydi.",
      coverImage: "images/uy3.svg",
      fundingGoal: 8000000000,
      fundingRaised: 4800000000,
      investorsCount: 390,
      annualReturnPct: 15.8,
      termMonths: 24,
      riskLevel: "O'rta",
      minInvestment: 3000000,
      contractType: "Ijara",
      highlights: ["A-toifali ofis binosi", "Xalqaro ijarachilar", "Shartnomalar imzolangan"],
    },
    {
      id: "andijan-textile-hub",
      name: "Andijon Textile Hub",
      category: "tijorat",
      status: "yakunlangan",
      location: "Andijon viloyati",
      shortDescription: "Yengil sanoat va to'qimachilik uchun ombor-ishlab chiqarish majmuasi.",
      description: "Andijon Textile Hub loyihasi to'qimachilik sohasidagi ishlab chiqaruvchilarga ombor va ishlab chiqarish maydonlarini ijaraga berish orqali daromad keltirdi. Loyiha muddatidan oldin yakunlanib, investorlarga to'liq qaytim amalga oshirildi.",
      coverImage: "images/uy1.svg",
      fundingGoal: 3000000000,
      fundingRaised: 3000000000,
      investorsCount: 268,
      annualReturnPct: 13.5,
      termMonths: 30,
      riskLevel: "Past",
      minInvestment: 2000000,
      contractType: "Ijara",
      highlights: ["To'liq qaytim amalga oshirildi", "Yengil sanoat ijarachilari", "Past xavf darajasi"],
    },
    {
      id: "khiva-boutique-hotel",
      name: "Khiva Boutique Hotel",
      category: "yaqinda",
      status: "yaqinda",
      location: "Xiva",
      shortDescription: "Turistik hudud markazidagi butik mehmonxona loyihasi. Tez orada e'lon qilinadi.",
      description: "Khiva Boutique Hotel — Ichan-Qal'a yaqinida joylashgan, an'anaviy me'morchilik uslubida qurilishi rejalashtirilgan butik mehmonxona. Turizm faslidan oldin ishga tushirish maqsad qilingan.",
      coverImage: "images/uy2.svg",
      fundingGoal: 3500000000,
      fundingRaised: 0,
      investorsCount: 540,
      annualReturnPct: null,
      termMonths: 30,
      riskLevel: "O'rta",
      minInvestment: 1500000,
      contractType: "Ijara",
      highlights: ["Ichan-Qal'a yaqinida", "Turizm mavsumiga moslashtirilgan", "Ro'yxatga oldindan yozilish ochiq"],
    },
    {
      id: "nukus-logistics-park",
      name: "Nukus Logistics Park",
      category: "yaqinda",
      status: "yaqinda",
      location: "Nukus",
      shortDescription: "Mintaqaviy logistika va ombor markazi. Arizalar ro'yxati ochiq.",
      description: "Nukus Logistics Park — G'arbiy mintaqadagi savdo va logistika oqimlarini kuchaytirish maqsadida qurilishi rejalashtirilgan zamonaviy ombor-logistika markazi. Loyiha hujjatlari tasdiqlanish jarayonida.",
      coverImage: "images/uy3.svg",
      fundingGoal: 4200000000,
      fundingRaised: 0,
      investorsCount: 325,
      annualReturnPct: null,
      termMonths: 28,
      riskLevel: "O'rta",
      minInvestment: 2000000,
      contractType: "Ijara",
      highlights: ["Mintaqaviy logistika markazi", "Hujjatlar tasdiqlanish jarayonida", "Ro'yxatga oldindan yozilish ochiq"],
    },
  ];

  function money(n) {
    if (n === null || n === undefined) return "—";
    return Math.round(n).toLocaleString("en-US").replace(/,/g, " ");
  }

  function compact(n) {
    if (n === null || n === undefined) return "—";
    if (n >= 1e9) return (Math.round((n / 1e9) * 10) / 10).toString().replace(/\.0$/, "") + " mlrd";
    if (n >= 1e6) return (Math.round((n / 1e6) * 10) / 10).toString().replace(/\.0$/, "") + " mln";
    return money(n);
  }

  function getProjectById(id) {
    return ZAR_PROJECTS.find((p) => p.id === id) || null;
  }

  function fundingPct(p) {
    if (!p.fundingGoal) return 0;
    return Math.min(100, Math.round((p.fundingRaised / p.fundingGoal) * 100));
  }

  const STATUS_BADGE = {
    ochiq: { text: "OCHIQ", cls: "bg-[#ECC246] text-[#0D0E12]" },
    yakunlangan: { text: "YAKUNLANDI", cls: "bg-[#1A2E22] text-[#26D07C] border border-[#26D07C]/30" },
    yaqinda: { text: "TEZ ORADA", cls: "bg-[#1A1C20] text-[#ECC246] border border-[#ECC246]/30" },
  };

  function renderProjectCard(p, opts) {
    const assetsBase = (opts && opts.assetsBase) || "./";
    const linkBase = (opts && opts.linkBase) || "./pages/";
    const badge = STATUS_BADGE[p.status] || STATUS_BADGE.ochiq;
    const isWaiting = p.status === "yaqinda";
    const pct = fundingPct(p);
    const href = `${linkBase}loyiha.html?id=${p.id}`;

    const progressBlock = isWaiting
      ? `<div class="flex items-center justify-between mb-[8px]">
           <span class="text-[10px] tracking-[0.1em] text-[#5C6470]">NAVBATDA</span>
           <span class="text-[12px] text-[#E2E2E8]">${money(p.investorsCount)} kishi</span>
         </div>
         <div class="w-full h-[4px] rounded-full bg-[#2A2F3A] overflow-hidden mb-[20px]"></div>`
      : `<div class="flex items-center justify-between mb-[8px]">
           <span class="text-[10px] tracking-[0.1em] text-[#5C6470]">YIG'ILGAN</span>
           <span class="text-[12px] text-[#E2E2E8]"><span class="text-[#F4F1EA] font-medium">${compact(p.fundingRaised)}</span> / ${compact(p.fundingGoal)}</span>
         </div>
         <div class="w-full h-[4px] rounded-full bg-[#2A2F3A] overflow-hidden mb-[20px]">
           <div class="h-full rounded-full bg-[#ECC246] transition-all duration-700" style="width:${pct}%"></div>
         </div>`;

    const ctaLabel = isWaiting ? "XABARDOR BO'LISH" : p.status === "yakunlangan" ? "NATIJALARNI KO'RISH" : "BATAFSIL KO'RISH";

    return `
      <article class="project-card group" data-category="${p.category}" data-animate-item>
        <a href="${href}" class="block bg-[#15171C] border border-[#2A2F3A] rounded-[10px] overflow-hidden flex flex-col h-full transition-all duration-300 hover:border-[#ECC246]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
          <div class="relative h-[240px] overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105" style="background-image:url('${assetsBase}${p.coverImage}')"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#0D0E12]/80 via-transparent to-transparent"></div>
            <span class="absolute top-[14px] left-[14px] ${badge.cls} text-[10px] font-semibold tracking-[0.05em] px-[10px] py-[5px] rounded-[4px]">${badge.text}</span>
            <button type="button" data-wishlist-btn data-project-id="${p.id}" aria-label="Saqlash" class="absolute top-[12px] right-[12px] w-[32px] h-[32px] rounded-full bg-[#0D0E12]/70 backdrop-blur flex items-center justify-center text-[#D1C5AF] hover:text-[#ECC246] transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
            </button>
          </div>
          <div class="p-[22px] flex flex-col flex-1">
            <div class="flex items-center gap-[6px] text-[11px] text-[#5C6470] mb-[8px]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 004 10.2C4 17.5 12 22 12 22z"/><circle cx="12" cy="10" r="3"/></svg>
              ${p.location}
            </div>
            <h3 class="text-[17px] font-semibold text-[#F4F1EA] mb-[10px]">${p.name}</h3>
            <p class="text-[13px] text-[#99A0AC] leading-[1.6] mb-[20px]">${p.shortDescription}</p>

            ${progressBlock}

            <div class="flex justify-between border-t border-[#2A2F3A] pt-[16px] mb-[20px]">
              <div>
                <p class="text-[9px] tracking-[0.1em] text-[#5C6470] mb-[6px]">DAROMAD</p>
                <p class="text-[13px] ${p.annualReturnPct ? "text-[#ECC246]" : "text-[#5C6470]"}">${p.annualReturnPct ? p.annualReturnPct + "% yillik" : "--% yillik"}</p>
              </div>
              <div class="text-right">
                <p class="text-[9px] tracking-[0.1em] text-[#5C6470] mb-[6px]">MUDDAT</p>
                <p class="text-[13px] text-[#D1C5AF]">${p.termMonths} oy</p>
              </div>
            </div>

            <span class="mt-auto border border-[#2A2F3A] text-[#D1C5AF] text-[12px] tracking-[0.05em] py-[12px] rounded-[6px] text-center group-hover:border-[#ECC246] group-hover:text-[#ECC246] transition-colors">
              ${ctaLabel}
            </span>
          </div>
        </a>
      </article>`;
  }

  function mountCardInteractions(container) {
    const state = window.ZarStorage ? window.ZarStorage.get() : { saved: [] };
    container.querySelectorAll("[data-wishlist-btn]").forEach((btn) => {
      const id = btn.dataset.projectId;
      const setActive = (active) => {
        btn.classList.toggle("text-[#ECC246]", active);
        btn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
      };
      setActive(state.saved.includes(id));
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const updated = window.ZarStorage.toggleSaved(id);
        setActive(updated.saved.includes(id));
      });
    });
  }

  function renderGrid(container, projects, opts) {
    container.innerHTML = projects.map((p) => renderProjectCard(p, opts)).join("");
    mountCardInteractions(container);
    if (window.ZarAnim) window.ZarAnim.refresh();
  }

  function initFilterTabs({ tabsSelector, cardsContainer, emptyStateSelector, urlSync }) {
    const tabs = document.querySelectorAll(tabsSelector);
    const emptyState = emptyStateSelector ? document.querySelector(emptyStateSelector) : null;

    function setActiveTab(activeTab) {
      tabs.forEach((tab) => {
        const isActive = tab === activeTab;
        tab.classList.toggle("text-[#ECC246]", isActive);
        tab.classList.toggle("border-[#ECC246]", isActive);
        tab.classList.toggle("text-[#99A0AC]", !isActive);
        tab.classList.toggle("border-transparent", !isActive);
        tab.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function applyFilter(filterValue) {
      const cards = cardsContainer.querySelectorAll(".project-card");
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = filterValue === "all" || card.dataset.category === filterValue;
        card.classList.toggle("hidden", !matches);
        if (matches) visibleCount++;
      });
      if (emptyState) emptyState.classList.toggle("hidden", visibleCount > 0);
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActiveTab(tab);
        applyFilter(tab.dataset.filter);
        if (urlSync) {
          const url = new URL(window.location.href);
          if (tab.dataset.filter === "all") url.searchParams.delete("filter");
          else url.searchParams.set("filter", tab.dataset.filter);
          history.replaceState(null, "", url);
        }
      });
    });

    const initialFilter = urlSync ? new URLSearchParams(window.location.search).get("filter") : null;
    if (initialFilter) {
      const matchingTab = Array.from(tabs).find((t) => t.dataset.filter === initialFilter);
      if (matchingTab) {
        setActiveTab(matchingTab);
        applyFilter(initialFilter);
        return;
      }
    }
    applyFilter("all");
  }

  window.ZAR_PROJECTS = ZAR_PROJECTS;
  window.ZarFormat = { money, compact };
  window.ZarProjects = {
    all: ZAR_PROJECTS,
    getProjectById,
    fundingPct,
    renderProjectCard,
    renderGrid,
    mountCardInteractions,
    initFilterTabs,
  };
})();
