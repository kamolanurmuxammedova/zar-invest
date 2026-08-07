/**
 * pages/katalog.html — full project catalog: category tabs + search + sort,
 * all combined via one re-render pass (needed because sorting reorders the
 * DOM, which a simple show/hide filter can't do).
 */
(function () {
  const skeleton = document.getElementById("skeleton-grid");
  const grid = document.getElementById("project-grid");
  const emptyState = document.getElementById("empty-state");
  const resultsCount = document.getElementById("results-count");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");
  const tabs = document.querySelectorAll("#filter-tabs .filter-tab");

  if (!grid) return;

  let activeFilter = "all";

  const SORTERS = {
    popular: (a, b) => b.investorsCount - a.investorsCount,
    return: (a, b) => (b.annualReturnPct || -1) - (a.annualReturnPct || -1),
    term: (a, b) => a.termMonths - b.termMonths,
  };

  function setActiveTab(tab) {
    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle("text-[#ECC246]", isActive);
      t.classList.toggle("border-[#ECC246]", isActive);
      t.classList.toggle("text-[#99A0AC]", !isActive);
      t.classList.toggle("border-transparent", !isActive);
    });
  }

  function render() {
    const query = (searchInput.value || "").trim().toLowerCase();
    const sortKey = sortSelect.value;

    let list = window.ZAR_PROJECTS.filter((p) => activeFilter === "all" || p.category === activeFilter);
    if (query) {
      list = list.filter((p) => p.name.toLowerCase().includes(query) || p.location.toLowerCase().includes(query));
    }
    list = [...list].sort(SORTERS[sortKey] || SORTERS.popular);

    window.ZarProjects.renderGrid(grid, list, { assetsBase: "../", linkBase: "./" });
    emptyState.classList.toggle("hidden", list.length > 0);
    grid.classList.toggle("hidden", list.length === 0);
    resultsCount.textContent = `${list.length} ta loyiha topildi`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activeFilter = tab.dataset.filter;
      setActiveTab(tab);
      render();
    });
  });
  searchInput.addEventListener("input", render);
  sortSelect.addEventListener("change", render);

  // Reveal the real grid once the (near-instant, local) data is ready —
  // keeps the skeleton as an honest "content is being prepared" beat
  // instead of a fake network delay.
  requestAnimationFrame(() => {
    render();
    skeleton.classList.add("hidden");
  });
})();
