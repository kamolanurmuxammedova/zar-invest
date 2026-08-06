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