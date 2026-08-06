/**
 * pages/loyiha.html — data-driven project detail page.
 * Reads ?id= from the URL, looks the project up in ZAR_PROJECTS, and
 * wires the wishlist toggle + investment form against ZarStorage.
 */
(function () {
  const RISK_LABELS = { Past: "Past", "O'rta": "O'rta", Yuqori: "Yuqori" };
  const STATUS_BADGE = {
    ochiq: { text: "OCHIQ", cls: "bg-[#ECC246] text-[#0D0E12]" },
    yakunlangan: { text: "YAKUNLANDI", cls: "bg-[#1A2E22] text-[#26D07C] border border-[#26D07C]/30" },
    yaqinda: { text: "TEZ ORADA", cls: "bg-[#1A1C20] text-[#ECC246] border border-[#ECC246]/30" },
  };

  const id = new URLSearchParams(window.location.search).get("id");
  const project = id ? window.ZarProjects.getProjectById(id) : null;

  if (!project) {
    document.getElementById("not-found").classList.remove("hidden");
    return;
  }

  document.getElementById("detail-content").classList.remove("hidden");
  document.title = `${project.name} — ZAR Invest`;

  const money = window.ZarFormat.money;
  const compact = window.ZarFormat.compact;
  const pct = window.ZarProjects.fundingPct(project);
  const badge = STATUS_BADGE[project.status] || STATUS_BADGE.ochiq;

  document.getElementById("breadcrumb-name").textContent = project.name;
  document.getElementById("hero-cover").style.backgroundImage = `url('../${project.coverImage}')`;
  const badgeEl = document.getElementById("status-badge-detail");
  badgeEl.textContent = badge.text;
  badgeEl.className = `absolute top-4 left-4 text-[10px] font-semibold tracking-[0.05em] px-[10px] py-[5px] rounded-[4px] ${badge.cls}`;

  document.getElementById("category-label").textContent = project.location;
  document.getElementById("project-name").textContent = project.name;
  document.getElementById("project-location").innerHTML =
    `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4.5 8-11.8A8 8 0 004 10.2C4 17.5 12 22 12 22z"/><circle cx="12" cy="10" r="3"/></svg> ${project.location}`;
  document.getElementById("project-description").textContent = project.description;

  document.getElementById("highlights-list").innerHTML = project.highlights
    .map(
      (h) => `<li class="flex items-start gap-2 text-[13px] text-[#99A0AC]">
        <svg width="14" height="14" class="mt-[2px] shrink-0 text-[#ECC246]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
        ${h}
      </li>`
    )
    .join("");

  document.getElementById("funding-raised").textContent = compact(project.fundingRaised);
  document.getElementById("funding-goal").textContent = compact(project.fundingGoal);
  document.getElementById("funding-pct-bar").style.width = pct + "%";
  document.getElementById("funding-investors").textContent = money(project.investorsCount);

  document.getElementById("fact-return").textContent = project.annualReturnPct ? project.annualReturnPct + "% yillik" : "E'lon qilinmagan";
  document.getElementById("fact-term").textContent = project.termMonths + " oy";
  document.getElementById("fact-risk").textContent = RISK_LABELS[project.riskLevel] || project.riskLevel;
  document.getElementById("fact-contract").textContent = project.contractType;
  document.getElementById("fact-min").textContent = money(project.minInvestment) + " UZS";

  /* wishlist */
  const wishlistBtn = document.getElementById("wishlist-btn-detail");
  function paintWishlist() {
    const saved = window.ZarStorage.get().saved.includes(project.id);
    wishlistBtn.classList.toggle("text-[#ECC246]", saved);
    wishlistBtn.querySelector("svg").setAttribute("fill", saved ? "currentColor" : "none");
  }
  paintWishlist();
  wishlistBtn.addEventListener("click", () => {
    window.ZarStorage.toggleSaved(project.id);
    paintWishlist();
  });

  /* investment form */
  const investForm = document.getElementById("invest-form");
  const investAmount = document.getElementById("invest-amount");
  const paymentNote = document.getElementById("invest-payment-note");
  const submitBtn = document.getElementById("invest-submit-btn");
  investAmount.min = project.minInvestment;
  investAmount.value = project.minInvestment;
  investAmount.setAttribute("aria-label", "Sarmoya miqdori");

  function refreshPaymentNote() {
    const state = window.ZarStorage.get();
    if (!state.payment.method) {
      paymentNote.innerHTML = `To'lov usuli bog'lanmagan — <a href="./hisob-pages/hisob4.html" class="text-[#ECC246] hover:underline">hozir bog'lang</a>.`;
    } else {
      paymentNote.textContent = state.payment.method === "bank" ? "To'lov usuli: Bank o'tkazmasi" : "To'lov usuli: Uzcard / Humo";
    }
  }
  refreshPaymentNote();
  window.addEventListener("zar:user-changed", refreshPaymentNote);

  investForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const amount = Number(investAmount.value);

    if (amount < project.minInvestment) {
      alert(`Minimal sarmoya miqdori ${money(project.minInvestment)} UZS.`);
      return;
    }

    if (!window.ZarStorage.hasAccount()) {
      window.ZarAnim.setLoading(submitBtn, true, "Hisobga yo'naltirilmoqda...");
      setTimeout(() => (window.location.href = "./hisob-pages/hisob1.html"), 600);
      return;
    }
    if (!window.ZarStorage.get().payment.method) {
      window.ZarAnim.setLoading(submitBtn, true, "To'lov usuliga yo'naltirilmoqda...");
      setTimeout(() => (window.location.href = "./hisob-pages/hisob4.html"), 600);
      return;
    }

    window.ZarAnim.setLoading(submitBtn, true, "Sertifikat rasmiylashtirilmoqda...");
    window.ZarStorage.addOrder({ projectId: project.id, amount });
    setTimeout(() => {
      window.location.href = "../profile.html#buyurtmalar";
    }, 900);
  });

  /* related projects */
  const related = window.ZAR_PROJECTS.filter((p) => p.category === project.category && p.id !== project.id).slice(0, 3);
  if (related.length) {
    window.ZarProjects.renderGrid(document.getElementById("related-grid"), related, { assetsBase: "../", linkBase: "./" });
  }

  if (window.ZarAnim) window.ZarAnim.refresh();
})();
