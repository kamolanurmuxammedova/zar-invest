/**
 * Ochiq loyihalar — filter tabs logic.
 * Expects markup like:
 *   <button class="filter-tab" data-filter="all|turar-joy|tijorat|yaqinda">
 *   <article class="project-card" data-category="turar-joy|tijorat|yaqinda">
 */
(function () {
  const tabs = document.querySelectorAll(".filter-tab");
  const cards = document.querySelectorAll(".project-card");
  const emptyState = document.getElementById("empty-state");

  const ACTIVE_CLASSES = ["text-[#ECC246]", "border-[#ECC246]"];
  const INACTIVE_CLASSES = ["text-[#99A0AC]", "border-transparent"];

  function setActiveTab(activeTab) {
    tabs.forEach((tab) => {
      const isActive = tab === activeTab;
      tab.classList.toggle(ACTIVE_CLASSES[0], isActive);
      tab.classList.toggle(ACTIVE_CLASSES[1], isActive);
      tab.classList.toggle(INACTIVE_CLASSES[0], !isActive);
      tab.classList.toggle(INACTIVE_CLASSES[1], !isActive);
      tab.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function applyFilter(filterValue) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const matches = filterValue === "all" || card.dataset.category === filterValue;
      card.classList.toggle("hidden", !matches);
      if (matches) visibleCount++;
    });

    if (emptyState) {
      emptyState.classList.toggle("hidden", visibleCount > 0);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab);
      applyFilter(tab.dataset.filter);

      // keep the chosen filter shareable via URL, e.g. ?filter=tijorat
      const url = new URL(window.location.href);
      if (tab.dataset.filter === "all") {
        url.searchParams.delete("filter");
      } else {
        url.searchParams.set("filter", tab.dataset.filter);
      }
      history.replaceState(null, "", url);
    });
  });

  // Restore filter from URL on load, e.g. page opened with ?filter=turar-joy
  const initialFilter = new URLSearchParams(window.location.search).get("filter");
  if (initialFilter) {
    const matchingTab = Array.from(tabs).find((t) => t.dataset.filter === initialFilter);
    if (matchingTab) {
      setActiveTab(matchingTab);
      applyFilter(initialFilter);
    }
  }
})();

/**
 * Zar Invest — Kalkulyator logic.
 * Reads the two range sliders (amount, term) and recomputes the
 * projected profit / total payout on every input event.
 *
 * Formula used (annual rate applied pro-rata to the chosen term):
 *   foyda = miqdor * (yillikDaromad / 100) * (muddat / 12)
 *   jamiQaytim = miqdor + foyda - platformaXizmati
 */
(function () {
  const YILLIK_DAROMAD = 16.5; // %, fixed demo rate — wire this up to real project data later
  const PLATFORMA_XIZMATI = 0; // UZS, flat for now

  const amountSlider = document.getElementById("amount-slider");
  const termSlider = document.getElementById("term-slider");

  const amountValueEl = document.getElementById("amount-value");
  const termValueEl = document.getElementById("term-value");
  const rateValueEl = document.getElementById("rate-value");
  const profitValueEl = document.getElementById("profit-value");
  const feeValueEl = document.getElementById("fee-value");
  const totalValueEl = document.getElementById("total-value");

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

  // Initial paint on page load
  recalculate();
})();