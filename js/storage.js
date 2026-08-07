/**
 * ZarStorage — single source of truth for all user/session state.
 * Wraps one localStorage key ("zar_user") holding a JSON object, and
 * broadcasts a "zar:user-changed" window event on every update so any
 * page (header, profile, certificates, etc.) can react live.
 */
(function () {
  const KEY = "zar_user";

  function defaults() {
    return {
      auth: { isVerified: false, phone: "", createdAt: "" },
      kyc: { documentName: "", documentImage: "", status: "pending" },
      investor: { goal: "", term: "", risk: "" },
      payment: { method: "" },
      personal: { firstname: "", lastname: "", age: "", gender: "", avatar: "" },
      saved: [],
      orders: [],
      notifications: [],
    };
  }

  function deepMerge(base, patch) {
    if (typeof patch !== "object" || patch === null || Array.isArray(patch)) {
      return patch;
    }
    const out = { ...base };
    Object.keys(patch).forEach((key) => {
      out[key] = deepMerge(base ? base[key] : undefined, patch[key]);
    });
    return out;
  }

  function get() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      return deepMerge(defaults(), JSON.parse(raw));
    } catch (err) {
      return defaults();
    }
  }

  function set(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("zar:user-changed", { detail: state }));
    return state;
  }

  function update(patch) {
    const next = deepMerge(get(), patch);
    return set(next);
  }

  function reset() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new CustomEvent("zar:user-changed", { detail: defaults() }));
    return defaults();
  }

  function hasAccount() {
    const state = get();
    return Boolean(state.personal.firstname || state.personal.lastname || state.auth.phone);
  }

  function toggleSaved(projectId) {
    const state = get();
    const saved = state.saved.includes(projectId)
      ? state.saved.filter((id) => id !== projectId)
      : [...state.saved, projectId];
    return update({ saved });
  }

  function addOrder(order) {
    const state = get();
    const newOrder = {
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: "faol",
      ...order,
    };
    return update({ orders: [newOrder, ...state.orders] });
  }

  window.ZarStorage = { get, set, update, reset, hasAccount, toggleSaved, addOrder, defaults };
})();
