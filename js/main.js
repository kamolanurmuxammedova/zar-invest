/**
 * main.js — the "Hisob ochish" (KYC) wizard (hisob1–5.html) and the
 * profile.html dashboard. Every read/write goes through ZarStorage; every
 * block below is gated on the relevant element existing, so this single
 * file can be safely included on any of those pages.
 */
document.addEventListener("DOMContentLoaded", () => {
  const Zar = window.ZarStorage;
  const Anim = window.ZarAnim;

  function submitButtonOf(form) {
    return form.querySelector('button[type="submit"]');
  }

  function goTo(url, btn, label) {
    if (btn && Anim) Anim.setLoading(btn, true, label || "Yuklanmoqda...");
    setTimeout(() => {
      window.location.href = url;
    }, 550);
  }

  /* ---------- STEP 1 — phone verification ---------- */
  const phoneInput = document.getElementById("phone");
  const phoneForm = document.getElementById("phone-form");

  if (phoneInput) {
    const saved = Zar.get().auth.phone;
    if (saved) phoneInput.value = saved;

    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (!value.startsWith("998")) value = "998" + value;
      value = value.substring(0, 12);

      let formatted = "+";
      if (value.length > 0) formatted += value.substring(0, 3);
      if (value.length > 3) formatted += " " + value.substring(3, 5);
      if (value.length > 5) formatted += " " + value.substring(5, 8);
      if (value.length > 8) formatted += " " + value.substring(8, 10);
      if (value.length > 10) formatted += " " + value.substring(10, 12);
      e.target.value = formatted;
    });
  }

  if (phoneForm) {
    phoneForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const rawPhone = phoneInput ? phoneInput.value.replace(/\s+/g, "") : "";
      if (rawPhone.length < 13) {
        alert("Iltimos, telefon raqamingizni to'liq kiriting!");
        return;
      }
      Zar.update({ auth: { phone: phoneInput.value } });
      goTo("./hisob2.html", submitButtonOf(phoneForm));
    });
  }

  /* ---------- STEP 2 — document upload ---------- */
  const uploadBox = document.getElementById("upload-box");
  const fileInput = document.getElementById("file-input");
  const uploadText = document.getElementById("upload-text");
  const nextBtnStep2 = document.getElementById("next-btn");
  const reselectBtn = document.getElementById("reselect-btn");
  const statusBadge = document.getElementById("status-badge");

  function paintUploaded(name) {
    if (uploadText) uploadText.textContent = `Yuklandi: ${name}`;
    if (statusBadge) {
      statusBadge.textContent = "YUKLANDI";
      statusBadge.className = "inline-block bg-[#1a2e22] text-[#26d07c] text-xs font-mono px-3 py-1 rounded-full border border-[#26d07c]/30 tracking-widest transition-colors";
    }
  }

  if (uploadText && statusBadge) {
    const kyc = Zar.get().kyc;
    if (kyc.documentName) paintUploaded(kyc.documentName);
  }

  if (uploadBox && fileInput) {
    uploadBox.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      paintUploaded(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        Zar.update({
          kyc: { documentName: file.name, documentImage: evt.target.result, status: "yuklandi" },
          personal: { avatar: evt.target.result },
        });
      };
      reader.readAsDataURL(file);
    });
  }

  if (reselectBtn) {
    reselectBtn.addEventListener("click", () => {
      if (fileInput) fileInput.value = "";
      Zar.update({ kyc: { documentName: "", documentImage: "", status: "pending" }, personal: { avatar: "" } });
      if (uploadText) uploadText.textContent = "Hujjatning old tomonini ramka ichiga joylashtiring";
      if (statusBadge) {
        statusBadge.textContent = "KUTILMOQDA...";
        statusBadge.className = "inline-block bg-[#242118] text-[#ECC246] text-xs font-mono px-3 py-1 rounded-full border border-[#ECC246]/30 tracking-widest transition-colors";
      }
    });
  }

  if (nextBtnStep2) {
    nextBtnStep2.addEventListener("click", () => {
      if (!Zar.get().kyc.documentName) {
        alert("Iltimos, avval hujjat rasmini yuklang!");
        return;
      }
      goTo("./hisob3.html", nextBtnStep2);
    });
  }

  /* ---------- STEP 3 — investor profile (goal / term / risk) ---------- */
  const ACTIVE = ["border-[#ECC246]", "bg-[#ECC246]/10"];
  const INACTIVE = ["border-[#2A2F3A]", "bg-[#12141A]"];

  function initOptionGroup(name, currentValue, defaultValue, onChange) {
    const inputs = document.querySelectorAll(`input[name="${name}"]`);
    if (!inputs.length) return;

    function setActive(card, active) {
      ACTIVE.forEach((c) => card.classList.toggle(c, active));
      INACTIVE.forEach((c) => card.classList.toggle(c, !active));
    }

    const valueToUse = currentValue || defaultValue;
    inputs.forEach((input) => {
      const card = input.closest("[data-option-card]");
      if (!card) return;
      if (valueToUse && input.value === valueToUse) {
        input.checked = true;
        setActive(card, true);
      }
      input.addEventListener("change", () => {
        inputs.forEach((i) => {
          const c = i.closest("[data-option-card]");
          if (c) setActive(c, false);
        });
        setActive(card, true);
        onChange(input.value);
      });
    });
    if (valueToUse) onChange(valueToUse);
  }

  function previewUpdater(storageKey, previewId) {
    return (v) => {
      Zar.update({ investor: { [storageKey]: v } });
      const el = document.getElementById(previewId);
      if (el) el.textContent = v;
    };
  }

  const profileForm = document.getElementById("investor-profile-form");
  if (profileForm) {
    const investor = Zar.get().investor;
    initOptionGroup("goal", investor.goal, "Kapitalni saqlash", previewUpdater("goal", "preview-goal"));
    initOptionGroup("term", investor.term, "O'rta muddat (12-24 oy)", previewUpdater("term", "preview-term"));
    initOptionGroup("risk", investor.risk, "O'rta", previewUpdater("risk", "preview-risk"));

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      goTo("./hisob4.html", submitButtonOf(profileForm));
    });
  }

  /* ---------- STEP 4 — payment method ---------- */
  const paymentForm = document.getElementById("payment-form");
  if (paymentForm) {
    const payment = Zar.get().payment;
    initOptionGroup("payment_method", payment.method, "uzcard_humo", (v) => Zar.update({ payment: { method: v } }));

    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      goTo("./hisob5.html", submitButtonOf(paymentForm));
    });
  }

  /* ---------- STEP 5 — personal details ---------- */
  const step5Form = document.getElementById("step5-form");
  if (step5Form) {
    const personal = Zar.get().personal;
    const firstnameInput = document.getElementById("firstname");
    const lastnameInput = document.getElementById("lastname");
    const ageInput = document.getElementById("age");

    if (firstnameInput) firstnameInput.value = personal.firstname || "";
    if (lastnameInput) lastnameInput.value = personal.lastname || "";
    if (ageInput) ageInput.value = personal.age || "";
    if (personal.gender) {
      const genderRadio = document.querySelector(`input[name="gender"][value="${personal.gender}"]`);
      if (genderRadio) genderRadio.checked = true;
    }

    step5Form.addEventListener("submit", (e) => {
      e.preventDefault();
      Zar.update({
        personal: {
          firstname: firstnameInput ? firstnameInput.value : "",
          lastname: lastnameInput ? lastnameInput.value : "",
          age: ageInput ? ageInput.value : "",
          gender: document.querySelector('input[name="gender"]:checked')?.value || "",
        },
        auth: { isVerified: true, createdAt: new Date().toISOString() },
      });
      goTo("../../profile.html", submitButtonOf(step5Form), "Hisob faollashtirilmoqda...");
    });
  }

  /* ---------- profile.html dashboard ---------- */
  const profileAvatar = document.getElementById("profile-page-avatar");
  if (profileAvatar || document.getElementById("tab-asosiy")) {
    const state = Zar.get();
    const fullName = state.personal.firstname || state.personal.lastname
      ? `${state.personal.firstname} ${state.personal.lastname}`.trim()
      : "Foydalanuvchi";

    const avatarWrap = document.getElementById("profile-page-avatar-wrap");
    if (avatarWrap) avatarWrap.innerHTML = window.ZarAvatar.markup(state);
    const sidebarAvatarWrap = document.getElementById("sidebar-avatar-wrap");
    if (sidebarAvatarWrap) sidebarAvatarWrap.innerHTML = window.ZarAvatar.markup(state);

    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };

    setText("profile-page-name", fullName);
    setText("sidebar-user-name", fullName);
    setText("mobile-user-name", fullName);
    setText("profile-phone", state.auth.phone || "+998 -- --- -- --");
    setText("profile-age", state.personal.age ? `${state.personal.age} yosh` : "Kiritilmagan");
    setText("profile-gender", state.personal.gender ? (state.personal.gender === "male" ? "Erkak" : "Ayol") : "Kiritilmagan");
    setText("profile-goal", state.investor.goal || "Kiritilmagan");
    setText("profile-term", state.investor.term || "Kiritilmagan");
    setText("profile-risk", state.investor.risk || "Kiritilmagan");
    setText("profile-payment", state.payment.method === "bank" ? "Bank o'tkazmasi" : state.payment.method === "uzcard_humo" ? "Uzcard / Humo" : "Kiritilmagan");
    setText("profile-doc", state.kyc.documentName ? `Yuklangan (${state.kyc.documentName})` : "Yuklanmagan");

    renderOrders(state);
    renderSaved(state);
  }

  function renderOrders(state) {
    const list = document.getElementById("orders-list");
    const empty = document.getElementById("orders-empty");
    if (!list) return;
    if (!state.orders.length) {
      list.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");
    list.innerHTML = state.orders
      .map((order) => {
        const project = window.ZarProjects.getProjectById(order.projectId);
        return `
        <div data-animate-item class="glass hover-glow rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap transition-all duration-300">
          <div>
            <p class="text-white font-medium font-display">${project ? project.name : "Loyiha"}</p>
            <p class="text-[12px] text-white/30 mt-1">${order.id} • ${new Date(order.createdAt).toLocaleDateString("uz-UZ")}</p>
          </div>
          <div class="text-right">
            <p class="text-gradient font-semibold">${window.ZarFormat.money(order.amount)} UZS</p>
            <span class="inline-flex items-center gap-1.5 mt-1 text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full glass-strong text-[#5EEAD4] border-[#2DD4BF]/30">
              <span class="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_6px_#2DD4BF]"></span>${order.status}
            </span>
          </div>
        </div>`;
      })
      .join("");
    if (window.ZarAnim) window.ZarAnim.refresh();
  }

  function renderSaved(state) {
    const grid = document.getElementById("saved-list");
    const empty = document.getElementById("saved-empty");
    if (!grid) return;
    const projects = state.saved.map((id) => window.ZarProjects.getProjectById(id)).filter(Boolean);
    if (!projects.length) {
      grid.innerHTML = "";
      if (empty) empty.classList.remove("hidden");
      return;
    }
    if (empty) empty.classList.add("hidden");
    window.ZarProjects.renderGrid(grid, projects, { assetsBase: "./", linkBase: "./pages/" });
  }

  window.addEventListener("zar:user-changed", () => {
    if (document.getElementById("tab-asosiy")) {
      const state = Zar.get();
      renderOrders(state);
      renderSaved(state);
    }
  });

  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "./index.html";
    });
  }

  function handleLogout() {
    Zar.reset();
    window.location.href = "./index.html";
  }
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
  const deleteAccountBtn = document.getElementById("delete-account-btn");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      if (confirm("Hisobingizni o'chirmoqchimisiz? Barcha ma'lumotlar o'chib ketadi.")) handleLogout();
    });
  }

  const navButtons = document.querySelectorAll(".nav-btn");
  const tabContents = document.querySelectorAll(".tab-content");
  if (navButtons.length && tabContents.length) {
    navButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute("data-target");

        navButtons.forEach((b) => {
          b.classList.remove("bg-[#221E14]", "text-[#ECC246]", "border-[#ECC246]/20");
          b.classList.add("text-[#99A0AC]", "border-transparent");
        });
        btn.classList.remove("text-[#99A0AC]", "border-transparent");
        btn.classList.add("bg-[#221E14]", "text-[#ECC246]", "border-[#ECC246]/20");

        tabContents.forEach((tab) => tab.classList.add("hidden"));
        const targetTab = document.getElementById(`tab-${targetId}`);
        if (targetTab) targetTab.classList.remove("hidden");

        const sidebar = document.getElementById("sidebar");
        if (sidebar && window.innerWidth < 1024) {
          sidebar.classList.add("hidden");
          sidebar.classList.remove("flex");
        }
      });
    });

    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const match = document.querySelector(`.nav-btn[data-target="${hash}"]`);
      if (match) match.click();
    }
  }

  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", () => {
      const willShow = sidebar.classList.contains("hidden");
      sidebar.classList.toggle("hidden", !willShow);
      sidebar.classList.toggle("flex", willShow);
    });
  }
});
