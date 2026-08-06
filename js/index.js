/**
 * index.html page script — featured project grid + filter tabs + calculator.
 * Relies on js/projects-data.js, js/storage.js and js/animations.js already
 * being loaded (see index.html's script order).
 */
(function () {
  const FEATURED_IDS = [
    "mirabad-avenue-tower",
    "samarqand-it-hub",
    "bukhara-smart-city",
    "yunusabad-residence",
    "tashkent-city-offices",
    "khiva-boutique-hotel",
  ];

  const grid = document.getElementById("project-grid");
  if (grid) {
    const featured = FEATURED_IDS.map((id) => window.ZarProjects.getProjectById(id)).filter(Boolean);
    window.ZarProjects.renderGrid(grid, featured, { assetsBase: "./", linkBase: "./pages/" });

    window.ZarProjects.initFilterTabs({
      tabsSelector: "#filter-tabs .filter-tab",
      cardsContainer: grid,
      emptyStateSelector: "#empty-state",
      urlSync: true,
    });
  }
})();

/**
 * Zar Invest — Kalkulyator logic.
 * Reads the two range sliders (amount, term) and recomputes the
 * projected profit / total payout on every input event. The headline
 * rate is derived from the live ZAR_PROJECTS dataset rather than a
 * hardcoded number, so it stays truthful if project data changes.
 *
 * Formula used (annual rate applied pro-rata to the chosen term):
 *   foyda = miqdor * (yillikDaromad / 100) * (muddat / 12)
 *   jamiQaytim = miqdor + foyda - platformaXizmati
 */
(function () {
  const rates = (window.ZAR_PROJECTS || [])
    .map((p) => p.annualReturnPct)
    .filter((r) => typeof r === "number");
  const YILLIK_DAROMAD = rates.length ? Math.round((rates.reduce((a, b) => a + b, 0) / rates.length) * 10) / 10 : 16.5;
  const PLATFORMA_XIZMATI = 0; // UZS, flat for now

  const amountSlider = document.getElementById("amount-slider");
  const termSlider = document.getElementById("term-slider");

  const amountValueEl = document.getElementById("amount-value");
  const termValueEl = document.getElementById("term-value");
  const rateValueEl = document.getElementById("rate-value");
  const profitValueEl = document.getElementById("profit-value");
  const feeValueEl = document.getElementById("fee-value");
  const totalValueEl = document.getElementById("total-value");
  const ctaBtn = document.getElementById("calc-cta-btn");

  if (!amountSlider || !termSlider) return;

  function formatNumber(n) {
    return Math.round(n).toLocaleString("en-US");
  }

  function recalculate() {
    const amount = Number(amountSlider.value);
    const termMonths = Number(termSlider.value);

    const profit = amount * (YILLIK_DAROMAD / 100) * (termMonths / 12);
    const total = amount + profit - PLATFORMA_XIZMATI;

    amountValueEl.textContent = formatNumber(amount);
    termValueEl.textContent = termMonths;
    rateValueEl.textContent = `${YILLIK_DAROMAD}%`;
    profitValueEl.textContent = `${formatNumber(profit)} UZS`;
    feeValueEl.textContent = `${formatNumber(PLATFORMA_XIZMATI)} UZS`;
    totalValueEl.textContent = formatNumber(total);
  }

  amountSlider.addEventListener("input", recalculate);
  termSlider.addEventListener("input", recalculate);
  recalculate();

  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      window.ZarAnim.setLoading(ctaBtn, true, "Yo'naltirilmoqda...");
      const nextUrl = window.ZarStorage.hasAccount() ? "./pages/katalog.html" : "./pages/hisob-pages/hisob1.html";
      setTimeout(() => {
        window.location.href = nextUrl;
      }, 550);
    });
  }
})();
