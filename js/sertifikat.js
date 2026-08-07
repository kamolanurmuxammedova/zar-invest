/**
 * pages/sertifikat.html — one certificate card per order in ZarStorage.
 * Certificates are a *view* over orders (not separate storage) so they can
 * never drift out of sync with what's shown in profile.html's Buyurtmalar tab.
 */
(function () {
  const grid = document.getElementById("cert-grid");
  const empty = document.getElementById("cert-empty");
  const printBtn = document.getElementById("print-btn");

  function certNumber(order) {
    return `UZ-${order.id.replace("ORD-", "")}`;
  }

  function render() {
    const state = window.ZarStorage.get();
    const orders = state.orders;
    const fullName = `${state.personal.firstname} ${state.personal.lastname}`.trim() || "Foydalanuvchi";

    if (!orders.length) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      printBtn.classList.add("hidden");
      return;
    }

    empty.classList.add("hidden");
    printBtn.classList.remove("hidden");
    printBtn.classList.add("flex");

    grid.innerHTML = orders
      .map((order) => {
        const project = window.ZarProjects.getProjectById(order.projectId);
        return `
        <div data-animate-item class="relative bg-gradient-to-br from-[#17171a] to-[#0f0f11] border border-[#ECC246]/25 rounded-2xl p-7 overflow-hidden">
          <div class="absolute -right-8 -bottom-8 w-40 h-40 border border-[#ECC246]/5 rounded-full pointer-events-none"></div>

          <div class="flex items-start justify-between mb-6">
            <div>
              <div class="text-[9px] tracking-[0.2em] text-white/40 uppercase mb-2">O'ZBEKISTON RESPUBLIKASI</div>
              <div class="font-cinzel text-white text-lg">Ulush Sertifikati</div>
            </div>
            <div class="w-10 h-10 rounded-full bg-[#ECC246] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 1l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V4l7-3zm-1 12l5-5-1.4-1.4L9 10.2 7.4 8.6 6 10l3 3z" clip-rule="evenodd" /></svg>
            </div>
          </div>

          <div class="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">SERTIFIKAT RAQAMI</div>
          <div class="text-white text-sm font-mono tracking-wider mb-5">${certNumber(order)}</div>

          <div class="border-t border-white/10 my-4"></div>

          <div class="mb-5">
            <div class="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">Obyekt</div>
            <div class="text-white text-base font-medium">${project ? project.name : "Loyiha"}</div>
          </div>

          <div class="border-t border-white/10 my-4"></div>

          <div class="flex items-end justify-between mb-5">
            <div>
              <div class="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">Sarmoyador</div>
              <div class="text-white text-sm font-medium">${fullName.toUpperCase()}</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">Tasdiqlangan</div>
              <div class="text-[#ECC246] text-sm font-semibold">${window.ZarFormat.money(order.amount)} UZS</div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-[10px] text-white/40 font-mono">${new Date(order.createdAt).toLocaleDateString("uz-UZ")}</span>
            <span class="inline-flex items-center gap-1.5 text-[10px] tracking-wider uppercase px-2.5 py-1 rounded bg-[#1A2E22] text-[#26D07C] border border-[#26D07C]/30">
              <span class="w-1.5 h-1.5 rounded-full bg-[#26D07C]"></span>${order.status}
            </span>
          </div>
        </div>`;
      })
      .join("");

    if (window.ZarAnim) window.ZarAnim.refresh();
  }

  printBtn.addEventListener("click", () => window.print());
  window.addEventListener("zar:user-changed", render);
  render();
})();
