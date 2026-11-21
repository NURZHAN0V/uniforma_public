(() => {
  "use strict";

  const SIDEBAR_STORAGE_KEY = "uo:ops-sidebar";
  const FLYOUT_GAP = 8;

  const NAV_ICONS = {
    orders:
      '<svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    registrations:
      '<svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>',
    clubs:
      '<svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>',
    catalog:
      '<svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    settings:
      '<svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',
    staff:
      '<svg class="nav-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    chevron:
      '<svg class="nav-group-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M6 9l6 6 6-6"/></svg>',
  };

  const ACTION_ICONS = {
    approve:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
    reject:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    mail:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>',
    catalog:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>',
    deactivate:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>',
    activate:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    edit:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
  };

  function iconAction({ attrs, tooltip, icon, variant = "ghost" }) {
    return `<button type="button" class="btn-icon btn-icon--${variant}" ${attrs} data-tooltip="${escapeAttr(tooltip)}" data-tooltip-placement="top" aria-label="${escapeAttr(tooltip)}">${ACTION_ICONS[icon] || ""}</button>`;
  }

  function bindActionTooltips(root = el.content) {
    root?.querySelectorAll(".btn-icon[data-tooltip]").forEach((btn) => {
      bindTooltip(btn, () => btn.getAttribute("data-tooltip") || "", "top");
    });
  }

  const NAV_GROUPS = [
    {
      id: "work",
      label: "Работа",
      icon: "orders",
      items: [
        { view: "orders", label: "Заявки", icon: "orders", badge: "orders" },
        {
          view: "registrations",
          label: "Регистрации",
          icon: "registrations",
          badge: "regs",
        },
      ],
    },
    {
      id: "refs",
      label: "Справочники",
      icon: "catalog",
      items: [
        { view: "clubs", label: "Клубы", icon: "clubs" },
        { view: "catalog", label: "Каталог", icon: "catalog", perm: "catalog" },
      ],
    },
    {
      id: "system",
      label: "Система",
      icon: "settings",
      items: [
        {
          view: "settings",
          label: "Настройки",
          icon: "settings",
          perm: "settings",
        },
        { view: "staff", label: "Сотрудники", icon: "staff", perm: "staff" },
      ],
    },
  ];

  function readSidebarState() {
    const defaults = { collapsed: false, expandedGroups: ["work", "refs", "system"] };
    try {
      const raw = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (!raw) return { ...defaults, expandedGroups: [...defaults.expandedGroups] };
      const parsed = JSON.parse(raw);
      const groups = Array.isArray(parsed.expandedGroups)
        ? parsed.expandedGroups.filter(Boolean)
        : defaults.expandedGroups;
      return {
        collapsed: parsed.collapsed === true,
        expandedGroups: groups.length ? groups : [...defaults.expandedGroups],
      };
    } catch {
      return { ...defaults, expandedGroups: [...defaults.expandedGroups] };
    }
  }

  function saveSidebarState() {
    try {
      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        JSON.stringify({
          collapsed: sidebarUi.collapsed,
          expandedGroups: [...sidebarUi.expandedGroups],
        })
      );
    } catch {
      /* ignore */
    }
  }

  const storedSidebar = readSidebarState();

  const ACTIVITY_ACTIONS = {
    "registration.approve": "Одобрение регистрации",
    "registration.reject": "Отклонение регистрации",
    "registration.resend": "Повторная отправка пароля",
    "order.payment": "Оплата заявки",
    "order.status": "Смена статуса заявки",
    "order.deliver": "Отметка сдачи",
    "order.view": "Просмотр заявки",
    "club.create": "Создание клуба",
    "club.update": "Изменение клуба",
    "club.toggle": "Статус клуба",
    "product.create": "Добавление изделия",
    "product.update": "Изменение изделия",
    "product.toggle": "Статус изделия",
    "catalog.upload": "Загрузка каталога",
    "settings.update": "Изменение настроек",
    "staff.create": "Создание сотрудника",
    "staff.update": "Изменение сотрудника",
  };

  const state = {
    role: null,
    view: "orders",
    data: cloneSeed(),
    selectedOrderId: null,
    orderFilters: {
      q: "",
      status: "",
      clubId: "",
      sortKey: "submittedAt",
      sortDir: "desc",
    },
    regFilters: {
      q: "",
      status: "",
      clubId: "",
      sortKey: "createdAt",
      sortDir: "desc",
    },
    clubFilters: { q: "", active: "", sortKey: "name", sortDir: "asc" },
    staffFilters: { q: "", role: "", sortKey: "name", sortDir: "asc" },
    activityFilters: {
      q: "",
      action: "",
      sortKey: "at",
      sortDir: "desc",
    },
    productFilters: {
      q: "",
      clubId: "",
      active: "",
      sortKey: "name",
      sortDir: "asc",
    },
    catalogClubId: "cska",
    editingId: null,
    uploadReport: null,
  };

  const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

  function compareValues(a, b, dir) {
    const mul = dir === "asc" ? 1 : -1;
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return (a - b) * mul;
    const as = String(a).toLowerCase();
    const bs = String(b).toLowerCase();
    if (as < bs) return -1 * mul;
    if (as > bs) return 1 * mul;
    return 0;
  }

  function sortTh(label, key, filters) {
    const active = filters.sortKey === key;
    const arrow = active ? (filters.sortDir === "asc" ? "↑" : "↓") : "↕";
    return `<th class="th-sort" data-sort-key="${key}" aria-sort="${
      active ? (filters.sortDir === "asc" ? "ascending" : "descending") : "none"
    }">${label}<span class="sort-ind">${arrow}</span></th>`;
  }

  function bindSortHeaders(filters, redraw) {
    el.content.querySelectorAll("[data-sort-key]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sortKey;
        if (filters.sortKey === key) {
          filters.sortDir = filters.sortDir === "asc" ? "desc" : "asc";
        } else {
          filters.sortKey = key;
          filters.sortDir = "asc";
        }
        redraw();
      });
    });
  }

  function logActivity({ action, entityType, entityLabel, details }) {
    if (!state.role) return;
    if (!state.data.activity) state.data.activity = [];
    state.data.activity.unshift({
      id: uid("act"),
      at: new Date().toISOString(),
      staffId: state.role.staffId,
      action,
      entityType,
      entityLabel,
      details: details || "",
    });
  }

  function activityLabel(action) {
    return ACTIVITY_ACTIONS[action] || action;
  }

  const sidebarUi = {
    collapsed: storedSidebar.collapsed,
    expandedGroups: new Set(storedSidebar.expandedGroups),
    flyoutId: null,
    hideFlyoutTimer: null,
  };

  const el = {
    loginScreen: document.getElementById("login-screen"),
    loginForm: document.getElementById("login-form"),
    app: document.getElementById("app"),
    sidebar: document.getElementById("sidebar"),
    content: document.getElementById("content"),
    viewTitle: document.getElementById("view-title"),
    viewSubtitle: document.getElementById("view-subtitle"),
    topbarActions: document.getElementById("topbar-actions"),
    userName: document.getElementById("user-name"),
    userRole: document.getElementById("user-role"),
    userAvatar: document.getElementById("user-avatar"),
    btnLogout: document.getElementById("btn-logout"),
    sidebarNav: document.getElementById("sidebar-nav"),
    sidebarFlyout: document.getElementById("sidebar-flyout"),
    uiTooltip: document.getElementById("ui-tooltip"),
    btnSidebarCollapse: document.getElementById("btn-sidebar-collapse"),
    btnSidebarExpand: document.getElementById("btn-sidebar-expand"),
    btnSidebarEdge: document.getElementById("btn-sidebar-edge"),
    drawer: document.getElementById("order-drawer"),
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    drawerTitle: document.getElementById("drawer-title"),
    drawerKicker: document.getElementById("drawer-kicker"),
    drawerBody: document.getElementById("drawer-body"),
    drawerFoot: document.getElementById("drawer-foot"),
    drawerClose: document.getElementById("drawer-close"),
    modalBackdrop: document.getElementById("modal-backdrop"),
    modalTitle: document.getElementById("modal-title"),
    modalBody: document.getElementById("modal-body"),
    modalFoot: document.getElementById("modal-foot"),
    modalClose: document.getElementById("modal-close"),
    toastHost: document.getElementById("toast-host"),
  };

  /* —— helpers —— */
  const rub = (n) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(n || 0);

  const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      const [y, m, day] = String(iso).split("-");
      if (y && m && day) return `${day}.${m}.${y}`;
      return iso;
    }
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fmtDateTime = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const clubName = (id) =>
    state.data.clubs.find((c) => c.id === id)?.name || id;

  const statusMeta = (id) =>
    ORDER_STATUSES.find((s) => s.id === id) || {
      id,
      label: id,
      badge: "badge-new",
    };

  const can = (key) => Boolean(state.role?.can?.[key]);

  const todayIso = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  /** Demo: +21 calendar days standing in for 21 working days */
  const plannedAfterPayment = (paymentDate) => {
    const d = new Date(paymentDate + "T12:00:00");
    d.setDate(d.getDate() + 1 + state.data.settings.productionDays);
    return d.toISOString().slice(0, 10);
  };

  function toast(message, type = "ok") {
    const node = document.createElement("div");
    node.className = `toast ${type}`;
    node.textContent = message;
    el.toastHost.appendChild(node);
    setTimeout(() => {
      node.remove();
    }, 3200);
  }

  function badgeCounts() {
    return {
      orders: state.data.orders.filter((o) =>
        ["new", "awaiting_payment", "partially_paid"].includes(o.status)
      ).length,
      regs: state.data.registrations.filter((r) => r.status === "pending")
        .length,
    };
  }

  function setBadges() {
    const counts = badgeCounts();
    document.querySelectorAll("[data-badge]").forEach((node) => {
      const key = node.dataset.badge;
      const count = counts[key] || 0;
      node.textContent = String(count);
      node.classList.toggle("show", count > 0);
    });
    visibleGroups().forEach((group) => {
      const count = groupBadgeCount(group);
      document.querySelectorAll(`[data-group-badge="${group.id}"]`).forEach((node) => {
        node.textContent = count > 9 ? "9+" : String(count);
        node.classList.toggle("show", count > 0);
      });
    });
  }

  function itemAllowed(item) {
    if (!item.perm) return true;
    return can(item.perm);
  }

  function visibleGroups() {
    return NAV_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(itemAllowed),
    })).filter((group) => group.items.length > 0);
  }

  function groupBadgeCount(group) {
    const counts = badgeCounts();
    return group.items.reduce((sum, item) => sum + (counts[item.badge] || 0), 0);
  }

  function isGroupActive(group) {
    if (group.items.some((item) => item.view === state.view)) return true;
    if (
      group.id === "refs" &&
      ["club-form", "product-form", "product-detail", "catalog-upload"].includes(
        state.view
      )
    ) {
      return true;
    }
    if (
      group.id === "system" &&
      ["staff-form", "staff-detail"].includes(state.view)
    ) {
      return true;
    }
    return false;
  }

  function navigateTo(view) {
    const item = NAV_GROUPS.flatMap((g) => g.items).find((i) => i.view === view);
    if (!item || !itemAllowed(item)) {
      if (view === "catalog") toast("Каталог доступен владельцу и администратору", "warn");
      else if (view === "settings") toast("Настройки недоступны модератору", "warn");
      else if (view === "staff") toast("Сотрудниками управляет только владелец", "warn");
      return;
    }
    state.view = view;
    closeDrawer();
    closeFlyout();
    renderSidebar();
    render();
  }

  function applyCollapsedUi() {
    el.app.classList.toggle("sidebar-collapsed", sidebarUi.collapsed);
    el.sidebar.classList.toggle("is-collapsed", sidebarUi.collapsed);
    el.sidebar.setAttribute("aria-expanded", String(!sidebarUi.collapsed));
    const label = sidebarUi.collapsed ? "Развернуть меню" : "Свернуть меню";
    el.btnSidebarCollapse?.setAttribute("aria-label", label);
    el.btnSidebarCollapse?.setAttribute("data-tooltip", label);
    el.btnSidebarExpand?.setAttribute("aria-label", label);
    el.btnSidebarExpand?.setAttribute("data-tooltip", label);
    el.btnSidebarEdge?.setAttribute("aria-label", label);
    el.btnSidebarEdge?.setAttribute(
      "data-tooltip",
      sidebarUi.collapsed ? "Развернуть меню" : "Свернуть меню"
    );
  }

  function setCollapsed(value) {
    sidebarUi.collapsed = value;
    closeFlyout();
    hideTooltip();
    saveSidebarState();
    applyCollapsedUi();
    renderSidebar();
  }

  function toggleCollapsed() {
    setCollapsed(!sidebarUi.collapsed);
  }

  function clearHideFlyoutTimer() {
    if (sidebarUi.hideFlyoutTimer) {
      clearTimeout(sidebarUi.hideFlyoutTimer);
      sidebarUi.hideFlyoutTimer = null;
    }
  }

  function closeFlyout() {
    clearHideFlyoutTimer();
    sidebarUi.flyoutId = null;
    el.sidebarFlyout.classList.add("hidden");
    el.sidebarFlyout.innerHTML = "";
    el.sidebarNav
      ?.querySelectorAll(".nav-section.is-flyout-open")
      .forEach((btn) => btn.classList.remove("is-flyout-open"));
  }

  function scheduleHideFlyout() {
    clearHideFlyoutTimer();
    sidebarUi.hideFlyoutTimer = setTimeout(() => {
      closeFlyout();
    }, 180);
  }

  function positionFlyout(anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const pad = 8;
    el.sidebarFlyout.style.left = `${Math.round(rect.right + FLYOUT_GAP)}px`;
    el.sidebarFlyout.style.top = `${Math.round(rect.top)}px`;
    el.sidebarFlyout.classList.remove("hidden");
    const tipRect = el.sidebarFlyout.getBoundingClientRect();
    let top = tipRect.top;
    let left = tipRect.left;
    if (tipRect.bottom > window.innerHeight - pad) {
      top = Math.max(pad, window.innerHeight - tipRect.height - pad);
    }
    if (tipRect.right > window.innerWidth - pad) {
      left = Math.max(pad, rect.left - tipRect.width - FLYOUT_GAP);
    }
    el.sidebarFlyout.style.top = `${Math.round(top)}px`;
    el.sidebarFlyout.style.left = `${Math.round(left)}px`;
  }

  function showFlyout(groupId, anchorEl) {
    const group = visibleGroups().find((g) => g.id === groupId);
    if (!group || !group.items.length || !anchorEl) return;
    clearHideFlyoutTimer();
    hideTooltip();
    sidebarUi.flyoutId = groupId;

    el.sidebarNav
      ?.querySelectorAll(".nav-section")
      .forEach((btn) =>
        btn.classList.toggle("is-flyout-open", btn.dataset.flyoutGroup === groupId)
      );

    el.sidebarFlyout.innerHTML = `
      <p class="sidebar-flyout-title">${group.label}</p>
      ${group.items
        .map(
          (item) => `
        <button type="button" class="nav-item ${item.view === state.view ? "active" : ""}" data-view="${item.view}" role="menuitem">
          <span class="nav-item-icon-wrap">${NAV_ICONS[item.icon] || ""}</span>
          <span class="nav-item-label">${item.label}</span>
          ${item.badge ? `<span class="nav-badge" data-badge="${item.badge}"></span>` : ""}
        </button>`
        )
        .join("")}
    `;
    positionFlyout(anchorEl);
    setBadges();
    el.sidebarFlyout.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => navigateTo(btn.dataset.view));
    });
  }

  function showTooltip(text, anchorEl, placement = "right") {
    if (!text || !anchorEl || !el.uiTooltip) return;
    const tip = el.uiTooltip;
    const rect = anchorEl.getBoundingClientRect();
    const gap = FLYOUT_GAP;
    const pad = 8;

    tip.textContent = text;
    tip.classList.remove("hidden", "is-visible");
    tip.style.transform = "none";
    tip.style.maxWidth = `${Math.min(320, window.innerWidth - pad * 2)}px`;

    // Measure after content is set
    const tw = tip.offsetWidth;
    const th = tip.offsetHeight;

    let top = 0;
    let left = 0;
    let place = placement;

    const fitsTop = rect.top - gap - th >= pad;
    const fitsBottom = rect.bottom + gap + th <= window.innerHeight - pad;
    const fitsRight = rect.right + gap + tw <= window.innerWidth - pad;
    const fitsLeft = rect.left - gap - tw >= pad;

    if (place === "top" && !fitsTop && fitsBottom) place = "bottom";
    else if (place === "bottom" && !fitsBottom && fitsTop) place = "top";
    else if (place === "right" && !fitsRight && fitsLeft) place = "left";
    else if (place === "left" && !fitsLeft && fitsRight) place = "right";
    else if ((place === "right" || place === "left") && !fitsRight && !fitsLeft) {
      place = fitsTop ? "top" : "bottom";
    }

    switch (place) {
      case "top":
        top = rect.top - gap - th;
        left = rect.left + rect.width / 2 - tw / 2;
        break;
      case "bottom":
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tw / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - th / 2;
        left = rect.left - gap - tw;
        break;
      default:
        top = rect.top + rect.height / 2 - th / 2;
        left = rect.right + gap;
    }

    left = Math.min(Math.max(pad, left), window.innerWidth - tw - pad);
    top = Math.min(Math.max(pad, top), window.innerHeight - th - pad);

    tip.style.top = `${Math.round(top)}px`;
    tip.style.left = `${Math.round(left)}px`;
    tip.style.transform = "none";
    requestAnimationFrame(() => tip.classList.add("is-visible"));
  }

  function hideTooltip() {
    if (!el.uiTooltip) return;
    el.uiTooltip.classList.remove("is-visible");
    el.uiTooltip.classList.add("hidden");
  }

  function bindTooltip(node, getText, placement) {
    if (!node || node.dataset.tooltipBound === "1") return;
    node.dataset.tooltipBound = "1";
    const resolveText = () =>
      typeof getText === "function"
        ? getText()
        : getText ||
          node.getAttribute("data-tooltip") ||
          node.getAttribute("aria-label") ||
          "";
    const resolvePlacement = () =>
      placement || node.getAttribute("data-tooltip-placement") || "top";

    node.addEventListener("mouseenter", () => {
      showTooltip(resolveText(), node, resolvePlacement());
    });
    node.addEventListener("mouseleave", hideTooltip);
    node.addEventListener("focus", () => {
      showTooltip(resolveText(), node, resolvePlacement());
    });
    node.addEventListener("blur", hideTooltip);
    node.addEventListener("click", hideTooltip);
  }

  function bindStaticIconTooltips() {
    document.querySelectorAll("[data-tooltip]").forEach((node) => {
      bindTooltip(node);
    });
  }

  function renderSidebar() {
    const groups = visibleGroups();
    el.sidebarNav.innerHTML = groups
      .map((group) => {
        const active = isGroupActive(group);
        const groupCount = groupBadgeCount(group);
        const groupBadge = `<span class="nav-badge${groupCount > 0 ? " show" : ""}" data-group-badge="${group.id}">${
          groupCount > 9 ? "9+" : groupCount || ""
        }</span>`;
        const collapsed = sidebarUi.collapsed;

        return `
          <div class="nav-group ${active ? "is-active" : ""}" data-group="${group.id}">
            <button
              type="button"
              class="nav-section ${collapsed ? "nav-section--icon" : ""} ${active ? "active" : ""}"
              data-flyout-group="${group.id}"
              aria-label="${group.label}"
              aria-expanded="${sidebarUi.flyoutId === group.id}"
              ${collapsed ? `data-tooltip="${group.label}" data-tooltip-placement="right"` : ""}
            >
              <span class="nav-item-icon-wrap">
                ${NAV_ICONS[group.icon] || NAV_ICONS[group.items[0]?.icon] || ""}
                ${collapsed ? groupBadge : ""}
              </span>
              ${
                collapsed
                  ? ""
                  : `<span class="nav-section-label">${group.label}</span>${groupBadge}`
              }
            </button>
          </div>`;
      })
      .join("");

    setBadges();
    bindSidebarNavEvents();
  }

  function bindSidebarNavEvents() {
    el.sidebarNav.querySelectorAll("[data-flyout-group]").forEach((btn) => {
      const groupId = btn.dataset.flyoutGroup;
      const groupEl = btn.closest(".nav-group");
      const group = visibleGroups().find((g) => g.id === groupId);

      btn.addEventListener("click", () => {
        if (group?.items.length === 1) {
          navigateTo(group.items[0].view);
          return;
        }
        showFlyout(groupId, groupEl);
      });

      groupEl?.addEventListener("mouseenter", () => {
        hideTooltip();
        showFlyout(groupId, groupEl);
      });
      groupEl?.addEventListener("mouseleave", scheduleHideFlyout);
    });
  }

  el.sidebarFlyout.addEventListener("mouseenter", clearHideFlyoutTimer);
  el.sidebarFlyout.addEventListener("mouseleave", scheduleHideFlyout);

  el.btnSidebarCollapse?.addEventListener("click", toggleCollapsed);
  el.btnSidebarExpand?.addEventListener("click", toggleCollapsed);
  el.btnSidebarEdge?.addEventListener("click", toggleCollapsed);

  el.userAvatar?.addEventListener("click", () => {
    if (!sidebarUi.collapsed || !state.role) return;
    const rect = el.userAvatar.getBoundingClientRect();
    el.sidebarFlyout.innerHTML = `
      <p class="sidebar-flyout-title">${state.role.name}</p>
      <button type="button" class="nav-item" id="flyout-logout" role="menuitem">
        <span class="nav-item-label">Выйти</span>
      </button>
    `;
    el.sidebarFlyout.style.top = `${Math.round(rect.top)}px`;
    el.sidebarFlyout.style.left = `${Math.round(rect.right + FLYOUT_GAP)}px`;
    el.sidebarFlyout.classList.remove("hidden");
    sidebarUi.flyoutId = "user";
    document.getElementById("flyout-logout")?.addEventListener("click", () => {
      closeFlyout();
      el.btnLogout.click();
    });
  });

  /* —— login / logout —— */
  el.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const roleId = new FormData(el.loginForm).get("role") || "owner";
    enterApp(roleId);
  });

  el.btnLogout.addEventListener("click", () => {
    closeDrawer();
    closeModal();
    closeFlyout();
    state.role = null;
    state.view = "orders";
    state.selectedOrderId = null;
    el.app.classList.add("hidden");
    el.app.setAttribute("aria-hidden", "true");
    el.loginScreen.classList.remove("hidden");
  });

  function enterApp(roleId) {
    state.role = ROLES[roleId] || ROLES.owner;
    state.data = cloneSeed();
    state.view = "orders";
    state.selectedOrderId = null;
    state.orderFilters = {
      q: "",
      status: "",
      clubId: "",
      sortKey: "submittedAt",
      sortDir: "desc",
    };
    state.regFilters = {
      q: "",
      status: "",
      clubId: "",
      sortKey: "createdAt",
      sortDir: "desc",
    };
    state.clubFilters = { q: "", active: "", sortKey: "name", sortDir: "asc" };
    state.staffFilters = { q: "", role: "", sortKey: "name", sortDir: "asc" };
    state.activityFilters = {
      q: "",
      action: "",
      sortKey: "at",
      sortDir: "desc",
    };
    state.editingId = null;
    state.uploadReport = null;
    // Always show full menu on login so navigation is obvious
    sidebarUi.collapsed = false;
    saveSidebarState();

    el.userName.textContent = state.role.name;
    el.userRole.textContent = state.role.title;
    el.userAvatar.textContent = state.role.initial;
    el.userAvatar.title = `${state.role.name} — ${state.role.title}`;

    el.loginScreen.classList.add("hidden");
    el.app.classList.remove("hidden");
    el.app.setAttribute("aria-hidden", "false");

    applyCollapsedUi();
    bindStaticIconTooltips();
    renderSidebar();
    render();
    toast(`Вход: ${state.role.title}. Различия прав сразу отражены в меню и действиях.`);
  }

  bindStaticIconTooltips();

  const VIEW_META = {
    orders: {
      title: "Заявки",
      subtitle: "Единый реестр оптовых заказов клубов",
    },
    registrations: {
      title: "Регистрации",
      subtitle: "Очередь представителей клубов до Approve",
    },
    clubs: {
      title: "Клубы",
      subtitle: "Список клубов и привязка ассортимента",
    },
    "club-form": {
      title: "Клуб",
      subtitle: "Создание или редактирование клуба",
    },
    catalog: {
      title: "Каталог",
      subtitle: "Изделия по клубам — загрузка, просмотр и правки",
    },
    "product-form": {
      title: "Изделие",
      subtitle: "Создание или редактирование изделия",
    },
    "product-detail": {
      title: "Карточка изделия",
      subtitle: "Просмотр позиции каталога",
    },
    "catalog-upload": {
      title: "Загрузка каталога",
      subtitle: "Результат разбора файла",
    },
    settings: {
      title: "Настройки",
      subtitle: "Параметры заказа, доставки и производства",
    },
    staff: {
      title: "Сотрудники",
      subtitle: "Учётные записи ops и роли",
    },
    "staff-form": {
      title: "Сотрудник",
      subtitle: "Учётная запись и роль в кабинете",
    },
    "staff-detail": {
      title: "Карточка сотрудника",
      subtitle: "Профиль и журнал действий",
    },
  };

  function render() {
    const meta = VIEW_META[state.view] || VIEW_META.orders;
    el.viewTitle.textContent =
      typeof meta.title === "function" ? meta.title() : meta.title;
    el.viewSubtitle.textContent =
      typeof meta.subtitle === "function" ? meta.subtitle() : meta.subtitle;

    el.sidebarNav.querySelectorAll(".nav-group").forEach((groupEl) => {
      const group = visibleGroups().find((g) => g.id === groupEl.dataset.group);
      if (!group) return;
      const active = isGroupActive(group);
      groupEl.classList.toggle("is-active", active);
      groupEl.querySelector(".nav-section")?.classList.toggle("active", active);
    });

    el.topbarActions.innerHTML = "";
    setBadges();

    switch (state.view) {
      case "registrations":
        renderRegistrations();
        break;
      case "clubs":
        renderClubs();
        break;
      case "club-form":
        renderClubForm();
        break;
      case "catalog":
        renderCatalog();
        break;
      case "product-detail":
        renderProductDetail();
        break;
      case "product-form":
        renderProductForm();
        break;
      case "catalog-upload":
        renderCatalogUpload();
        break;
      case "settings":
        renderSettings();
        break;
      case "staff":
        renderStaff();
        break;
      case "staff-form":
        renderStaffForm();
        break;
      case "staff-detail":
        renderStaffDetail();
        break;
      default:
        renderOrders();
    }
  }

  function backButton(label, view) {
    return `<button type="button" class="btn btn-secondary btn-sm" id="btn-back">${label}</button>`;
  }

  function bindBack(view) {
    document.getElementById("btn-back")?.addEventListener("click", () => {
      state.editingId = null;
      state.uploadReport = null;
      state.view = view;
      render();
    });
  }

  function formShell(fieldsHtml, { submitLabel = "Сохранить", cancelView } = {}) {
    return `
      <div class="panel panel-pad form-page">
        <div class="form-grid">${fieldsHtml}</div>
        <div class="form-actions">
          <button type="button" class="btn btn-primary" id="btn-form-save">${submitLabel}</button>
          <button type="button" class="btn btn-secondary" id="btn-form-cancel">Отмена</button>
        </div>
      </div>
    `;
  }

  function roleBannerHtml() {
    const mod = state.role.id === "moderator";
    return `
      <div class="role-banner ${mod ? "mod" : ""}">
        <div>
          <strong>Роль: ${state.role.title}</strong>
          ${state.role.banner}
        </div>
      </div>
    `;
  }

  /* —— Orders —— */
  function orderSortValue(o, key) {
    switch (key) {
      case "number":
        return o.number;
      case "club":
        return clubName(o.clubId);
      case "teamYear":
        return o.teamYear;
      case "qty":
        return o.qty;
      case "totalSum":
        return o.totalSum;
      case "paidSum":
        return o.paidSum;
      case "plannedDelivery":
        return o.plannedDelivery || "";
      case "actualDelivery":
        return o.actualDelivery || "";
      case "status":
        return statusMeta(o.status).label;
      default:
        return o.submittedAt;
    }
  }

  function filteredOrders() {
    const { q, status, clubId, sortKey, sortDir } = state.orderFilters;
    const query = q.trim().toLowerCase();
    return [...state.data.orders]
      .filter((o) => {
        if (status && o.status !== status) return false;
        if (clubId && o.clubId !== clubId) return false;
        if (!query) return true;
        const hay = [
          o.number,
          clubName(o.clubId),
          o.customerName,
          o.customerPhone,
          String(o.teamYear),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) =>
        compareValues(
          orderSortValue(a, sortKey),
          orderSortValue(b, sortKey),
          sortDir
        )
      );
  }

  function renderOrders() {
    const list = filteredOrders();
    const awaiting = state.data.orders.filter((o) =>
      ["new", "awaiting_payment", "partially_paid"].includes(o.status)
    ).length;
    const inProd = state.data.orders.filter((o) => o.status === "in_production")
      .length;
    const delivered = state.data.orders.filter((o) => o.status === "delivered")
      .length;

    el.topbarActions.innerHTML = can("mutateOrders")
      ? `<button type="button" class="btn btn-secondary btn-sm" id="btn-refresh-demo">Сбросить демо-данные</button>`
      : "";

    el.content.innerHTML = `
      ${roleBannerHtml()}
      <div class="stats-row">
        <div class="stat"><div class="label">Всего в реестре</div><div class="value">${state.data.orders.length}</div></div>
        <div class="stat"><div class="label">Требуют внимания</div><div class="value">${awaiting}</div></div>
        <div class="stat"><div class="label">В производстве</div><div class="value">${inProd}</div></div>
        <div class="stat"><div class="label">Сданы</div><div class="value">${delivered}</div></div>
      </div>
      <div class="filter-bar">
        <input type="search" id="filter-q" placeholder="Поиск: номер, клуб, ФИО, телефон" value="${escapeAttr(state.orderFilters.q)}" />
        <select id="filter-status">
          <option value="">Все статусы</option>
          ${ORDER_STATUSES.map(
            (s) =>
              `<option value="${s.id}" ${state.orderFilters.status === s.id ? "selected" : ""}>${s.label}</option>`
          ).join("")}
        </select>
        <select id="filter-club">
          <option value="">Все клубы</option>
          ${state.data.clubs
            .map(
              (c) =>
                `<option value="${c.id}" ${state.orderFilters.clubId === c.id ? "selected" : ""}>${c.name}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data interactive">
            <thead>
              <tr>
                ${sortTh("Заявка", "submittedAt", state.orderFilters)}
                ${sortTh("Клуб / год", "club", state.orderFilters)}
                ${sortTh("Кол-во", "qty", state.orderFilters)}
                ${sortTh("Сумма", "totalSum", state.orderFilters)}
                ${sortTh("Оплата", "paidSum", state.orderFilters)}
                ${sortTh("Плановая сдача", "plannedDelivery", state.orderFilters)}
                ${sortTh("Факт. сдача", "actualDelivery", state.orderFilters)}
                ${sortTh("Статус", "status", state.orderFilters)}
              </tr>
            </thead>
            <tbody>
              ${
                list.length
                  ? list.map((o) => orderRow(o)).join("")
                  : `<tr><td colspan="8"><div class="empty">Ничего не найдено</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    const bindOrderRows = () => {
      el.content.querySelectorAll("tr[data-order-id]").forEach((row) => {
        row.addEventListener("click", () => openOrder(row.dataset.orderId));
        row.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openOrder(row.dataset.orderId);
          }
        });
      });
    };

    document.getElementById("filter-q")?.addEventListener("input", (e) => {
      state.orderFilters.q = e.target.value;
      renderOrders();
    });
    document.getElementById("filter-status")?.addEventListener("change", (e) => {
      state.orderFilters.status = e.target.value;
      renderOrders();
    });
    document.getElementById("filter-club")?.addEventListener("change", (e) => {
      state.orderFilters.clubId = e.target.value;
      renderOrders();
    });
    document.getElementById("btn-refresh-demo")?.addEventListener("click", () => {
      state.data = cloneSeed();
      state.selectedOrderId = null;
      closeDrawer();
      toast("Демо-данные сброшены");
      render();
    });

    bindSortHeaders(state.orderFilters, renderOrders);
    bindOrderRows();
  }

  function orderRow(o) {
    const st = statusMeta(o.status);
    const overdue =
      o.plannedDelivery &&
      !o.actualDelivery &&
      o.plannedDelivery < todayIso() &&
      o.status !== "delivered" &&
      o.status !== "cancelled";
    const payLabel =
      o.paidSum <= 0
        ? "Ожидает оплаты"
        : o.paidSum < o.totalSum
          ? `${rub(o.paidSum)} / остаток ${rub(o.totalSum - o.paidSum)}`
          : `${rub(o.paidSum)}${o.paymentDate ? ` · ${fmtDate(o.paymentDate)}` : ""}`;

    return `
      <tr data-order-id="${o.id}" class="${state.selectedOrderId === o.id ? "selected" : ""}" tabindex="0" role="button" aria-label="Открыть заявку ${o.number}">
        <td>
          <div class="cell-stack">
            <span class="num">${o.number}</span>
            <small>${fmtDateTime(o.submittedAt)}</small>
          </div>
        </td>
        <td>
          <div class="cell-stack">
            <span>${clubName(o.clubId)}</span>
            <small>Год команды ${o.teamYear}</small>
          </div>
        </td>
        <td class="num">${o.qty}</td>
        <td class="num">${rub(o.totalSum)}</td>
        <td>
          <div class="cell-stack">
            <span>${payLabel}</span>
          </div>
        </td>
        <td class="${overdue ? "overdue" : ""}">${o.plannedDelivery ? fmtDate(o.plannedDelivery) : "—"}</td>
        <td>${o.actualDelivery ? fmtDate(o.actualDelivery) : "—"}</td>
        <td><span class="badge ${st.badge}">${st.label}</span></td>
      </tr>
    `;
  }

  function openOrder(id) {
    const order = state.data.orders.find((o) => o.id === id);
    if (!order) return;
    state.selectedOrderId = id;

    el.content.querySelectorAll("tr[data-order-id]").forEach((row) => {
      row.classList.toggle("selected", row.dataset.orderId === id);
    });

    const st = statusMeta(order.status);
    const expectedCashback = Math.round(
      (order.itemsSum * state.data.settings.cashbackPercent) / 100
    );

    el.drawerKicker.textContent = `Заявка · ${fmtDateTime(order.submittedAt)}`;
    el.drawerTitle.textContent = order.number;
    el.drawerBody.innerHTML = `
      <div class="detail-section">
        <h4>Заказчик</h4>
        <dl class="kv">
          <dt>Клуб</dt><dd>${clubName(order.clubId)}</dd>
          <dt>Год команды</dt><dd>${order.teamYear}</dd>
          <dt>ФИО</dt><dd>${order.customerName}</dd>
          <dt>Телефон</dt><dd>${order.customerPhone}</dd>
          <dt>Почта</dt><dd>${order.customerEmail}</dd>
          <dt>Статус</dt><dd><span class="badge ${st.badge}">${st.label}</span></dd>
        </dl>
      </div>
      <div class="detail-section">
        <h4>Состав</h4>
        <table class="line-items">
          <thead>
            <tr><th>Изделие</th><th>Рост</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (it) => `
              <tr>
                <td>
                  <div class="cell-stack">
                    <span>${it.name}</span>
                    <small>${it.article}</small>
                  </div>
                </td>
                <td>${it.size}</td>
                <td>${it.qty}</td>
                <td>${rub(it.price)}</td>
                <td>${rub(it.sum)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <div class="totals">
          <div class="row"><span>Изделия</span><span>${rub(order.itemsSum)}</span></div>
          <div class="row"><span>Доставка ${state.data.settings.deliveryPercent}%</span><span>${rub(order.deliverySum)}</span></div>
          <div class="row"><span>Ожидаемый кешбэк ${state.data.settings.cashbackPercent}%</span><span>${rub(expectedCashback)}</span></div>
          <div class="row grand"><span>Итого</span><span>${rub(order.totalSum)}</span></div>
        </div>
      </div>
      <div class="detail-section">
        <h4>Доставка</h4>
        <dl class="kv">
          <dt>Способ</dt><dd>${order.delivery.method}</dd>
          <dt>Адрес</dt><dd>${order.delivery.address || "—"}</dd>
          <dt>Комментарий</dt><dd>${order.delivery.comment || "—"}</dd>
        </dl>
      </div>
      <div class="detail-section">
        <h4>Оплата и сдача</h4>
        <dl class="kv">
          <dt>Получено</dt><dd>${rub(order.paidSum)}${order.paidSum < order.totalSum ? ` · остаток ${rub(order.totalSum - order.paidSum)}` : ""}</dd>
          <dt>Дата полной оплаты</dt><dd>${order.paymentDate ? fmtDate(order.paymentDate) : "Ожидает оплаты"}</dd>
          <dt>Плановая сдача</dt><dd>${order.plannedDelivery ? fmtDate(order.plannedDelivery) : "Считается после 100% оплаты"}</dd>
          <dt>Фактическая сдача</dt><dd>${order.actualDelivery ? fmtDate(order.actualDelivery) : "—"}</dd>
        </dl>
        <p class="callout" style="margin-top:12px">Плановая сдача = ${state.data.settings.productionDays}-й рабочий день после полной оплаты (в превью — упрощённый расчёт).</p>
      </div>
      <div class="detail-section">
        <h4>История</h4>
        <div class="staff-list">
          ${[...order.history]
            .reverse()
            .map(
              (h) => `
            <div class="staff-row">
              <div class="meta">
                <strong>${h.text}</strong>
                <small>${fmtDateTime(h.at)} · ${h.by}</small>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </div>
    `;

    if (can("mutateOrders")) {
      el.drawerFoot.innerHTML = `
        <button type="button" class="btn btn-primary" id="act-pay">Внести оплату</button>
        <button type="button" class="btn btn-secondary" id="act-status">Сменить статус</button>
        <button type="button" class="btn btn-secondary" id="act-deliver">Отметить сдачу</button>
        <button type="button" class="btn btn-ghost" id="act-pdf">PDF (имитация)</button>
      `;
      document.getElementById("act-pay")?.addEventListener("click", () => openPayModal(order));
      document
        .getElementById("act-status")
        ?.addEventListener("click", () => openStatusModal(order));
      document
        .getElementById("act-deliver")
        ?.addEventListener("click", () => openDeliverModal(order));
      document.getElementById("act-pdf")?.addEventListener("click", () => {
        toast(`PDF заявки ${order.number} будет формироваться на сервере`);
      });
    } else {
      el.drawerFoot.innerHTML = `
        <p class="muted" style="margin:0;font-size:13px;flex:1">Модератор может просматривать заявку. Оплата, статус и сдача — у владельца и администратора.</p>
        <button type="button" class="btn btn-ghost" id="act-pdf">PDF (имитация)</button>
      `;
      document.getElementById("act-pdf")?.addEventListener("click", () => {
        toast(`PDF заявки ${order.number} будет формироваться на сервере`);
      });
    }

    el.drawer.classList.remove("hidden");
    el.drawer.setAttribute("aria-hidden", "false");
    el.drawerBackdrop.classList.remove("hidden");
  }

  function closeDrawer() {
    el.drawer.classList.add("hidden");
    el.drawer.setAttribute("aria-hidden", "true");
    el.drawerBackdrop.classList.add("hidden");
    state.selectedOrderId = null;
  }

  el.drawerClose.addEventListener("click", closeDrawer);
  el.drawerBackdrop.addEventListener("click", closeDrawer);

  function openPayModal(order) {
    const remain = Math.max(0, order.totalSum - order.paidSum);
    openModal(
      "Внести оплату",
      `
        <p class="muted" style="margin:0 0 12px;font-size:13px">Заявка ${order.number}. Остаток к оплате: <strong>${rub(remain)}</strong></p>
        <label class="field"><span>Сумма, ₽</span><input type="number" id="pay-amount" min="1" value="${remain || order.totalSum}" /></label>
        <label class="field"><span>Способ</span>
          <select id="pay-method">
            <option value="invoice">По счёту</option>
            <option value="cash">Наличные</option>
            <option value="sbp">СБП</option>
          </select>
        </label>
        <label class="field"><span>Комментарий</span><textarea id="pay-note" rows="2" placeholder="Необязательно"></textarea></label>
      `,
      [
        { label: "Отмена", className: "btn-secondary", action: closeModal },
        {
          label: "Зафиксировать",
          className: "btn-primary",
          action: () => {
            const amount = Number(document.getElementById("pay-amount").value);
            if (!amount || amount <= 0) {
              toast("Укажите сумму оплаты", "warn");
              return;
            }
            const method = document.getElementById("pay-method").value;
            const methodLabel =
              { invoice: "по счёту", cash: "наличными", sbp: "СБП" }[method] ||
              method;
            order.paidSum = Math.min(order.totalSum, order.paidSum + amount);
            const now = new Date().toISOString();
            if (order.paidSum >= order.totalSum) {
              order.paymentDate = todayIso();
              order.plannedDelivery = plannedAfterPayment(order.paymentDate);
              order.status = "paid";
              order.history.push({
                at: now,
                by: state.role.name,
                text: `Полная оплата ${rub(amount)} (${methodLabel}). Плановая сдача ${fmtDate(order.plannedDelivery)}`,
              });
              logActivity({
                action: "order.payment",
                entityType: "order",
                entityLabel: order.number,
                details: `Полная оплата ${rub(amount)} (${methodLabel})`,
              });
              toast(`Оплата внесена. Плановая сдача: ${fmtDate(order.plannedDelivery)}`);
            } else {
              order.status = "partially_paid";
              order.plannedDelivery = null;
              order.history.push({
                at: now,
                by: state.role.name,
                text: `Частичная оплата ${rub(amount)} (${methodLabel}). Срок сдачи не считается`,
              });
              logActivity({
                action: "order.payment",
                entityType: "order",
                entityLabel: order.number,
                details: `Частичная оплата ${rub(amount)} (${methodLabel})`,
              });
              toast("Частичная оплата зафиксирована. Плановая сдача появится после 100%");
            }
            closeModal();
            setBadges();
            openOrder(order.id);
            renderOrders();
          },
        },
      ]
    );
  }

  function openStatusModal(order) {
    openModal(
      "Сменить статус",
      `
        <label class="field"><span>Новый статус</span>
          <select id="status-select">
            ${ORDER_STATUSES.map(
              (s) =>
                `<option value="${s.id}" ${s.id === order.status ? "selected" : ""}>${s.label}</option>`
            ).join("")}
          </select>
        </label>
      `,
      [
        { label: "Отмена", className: "btn-secondary", action: closeModal },
        {
          label: "Сохранить",
          className: "btn-primary",
          action: () => {
            const next = document.getElementById("status-select").value;
            const prev = statusMeta(order.status).label;
            order.status = next;
            order.history.push({
              at: new Date().toISOString(),
              by: state.role.name,
              text: `Статус: ${prev} → ${statusMeta(next).label}`,
            });
            logActivity({
              action: "order.status",
              entityType: "order",
              entityLabel: order.number,
              details: `${prev} → ${statusMeta(next).label}`,
            });
            toast(`Статус изменён: ${statusMeta(next).label}`);
            closeModal();
            setBadges();
            openOrder(order.id);
            renderOrders();
          },
        },
      ]
    );
  }

  function openDeliverModal(order) {
    openModal(
      "Отметить сдачу",
      `
        <label class="field"><span>Фактическая дата сдачи</span>
          <input type="date" id="deliver-date" value="${order.actualDelivery || todayIso()}" />
        </label>
        <p class="callout">После отметки статус станет «Сдана».</p>
      `,
      [
        { label: "Отмена", className: "btn-secondary", action: closeModal },
        {
          label: "Отметить",
          className: "btn-primary",
          action: () => {
            const date = document.getElementById("deliver-date").value;
            if (!date) {
              toast("Укажите дату", "warn");
              return;
            }
            order.actualDelivery = date;
            order.status = "delivered";
            order.history.push({
              at: new Date().toISOString(),
              by: state.role.name,
              text: `Фактическая сдача ${fmtDate(date)}`,
            });
            logActivity({
              action: "order.deliver",
              entityType: "order",
              entityLabel: order.number,
              details: `Фактическая сдача ${fmtDate(date)}`,
            });
            toast(`Сдача отмечена: ${fmtDate(date)}`);
            closeModal();
            setBadges();
            openOrder(order.id);
            renderOrders();
          },
        },
      ]
    );
  }

  /* —— Registrations —— */
  function regSortValue(r, key) {
    switch (key) {
      case "fullName":
        return r.fullName;
      case "club":
        return clubName(r.clubId);
      case "position":
        return r.position;
      case "email":
        return r.email;
      case "status":
        return r.status;
      default:
        return r.createdAt;
    }
  }

  function filteredRegistrations() {
    const { q, status, clubId, sortKey, sortDir } = state.regFilters;
    const query = q.trim().toLowerCase();
    return [...state.data.registrations]
      .filter((r) => {
        if (status && r.status !== status) return false;
        if (clubId && r.clubId !== clubId) return false;
        if (!query) return true;
        return [r.fullName, r.email, r.phone, r.position, clubName(r.clubId)]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) =>
        compareValues(regSortValue(a, sortKey), regSortValue(b, sortKey), sortDir)
      );
  }

  function renderRegistrations() {
    const all = state.data.registrations;
    const pending = all.filter((r) => r.status === "pending");
    const list = filteredRegistrations();

    el.content.innerHTML = `
      ${roleBannerHtml()}
      <div class="callout" style="margin-bottom:14px">
        До одобрения представитель клуба <strong>не допускается</strong> в приложение с оптовыми ценами и заказом.
        После Approve доступ открывается, пароль уходит на почту.
      </div>
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><div class="label">На модерации</div><div class="value">${pending.length}</div></div>
        <div class="stat"><div class="label">Одобрено</div><div class="value">${all.filter((r) => r.status === "approved").length}</div></div>
        <div class="stat"><div class="label">Отклонено</div><div class="value">${all.filter((r) => r.status === "rejected").length}</div></div>
      </div>
      <div class="filter-bar">
        <input type="search" id="reg-filter-q" placeholder="Поиск: ФИО, почта, телефон" value="${escapeAttr(state.regFilters.q)}" />
        <select id="reg-filter-status">
          <option value="" ${!state.regFilters.status ? "selected" : ""}>Все статусы</option>
          <option value="pending" ${state.regFilters.status === "pending" ? "selected" : ""}>На модерации</option>
          <option value="approved" ${state.regFilters.status === "approved" ? "selected" : ""}>Одобрена</option>
          <option value="rejected" ${state.regFilters.status === "rejected" ? "selected" : ""}>Отклонена</option>
        </select>
        <select id="reg-filter-club">
          <option value="">Все клубы</option>
          ${state.data.clubs
            .map(
              (c) =>
                `<option value="${c.id}" ${state.regFilters.clubId === c.id ? "selected" : ""}>${c.name}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                ${sortTh("Дата", "createdAt", state.regFilters)}
                ${sortTh("ФИО", "fullName", state.regFilters)}
                ${sortTh("Клуб", "club", state.regFilters)}
                ${sortTh("Должность", "position", state.regFilters)}
                ${sortTh("Контакты", "email", state.regFilters)}
                ${sortTh("Статус", "status", state.regFilters)}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              ${
                list.length
                  ? list.map((r) => regRow(r)).join("")
                  : `<tr><td colspan="7"><div class="empty">Ничего не найдено</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("reg-filter-q")?.addEventListener("input", (e) => {
      state.regFilters.q = e.target.value;
      renderRegistrations();
    });
    document.getElementById("reg-filter-status")?.addEventListener("change", (e) => {
      state.regFilters.status = e.target.value;
      renderRegistrations();
    });
    document.getElementById("reg-filter-club")?.addEventListener("change", (e) => {
      state.regFilters.clubId = e.target.value;
      renderRegistrations();
    });
    bindSortHeaders(state.regFilters, renderRegistrations);

    el.content.querySelectorAll("[data-approve]").forEach((btn) => {
      btn.addEventListener("click", () => approveReg(btn.dataset.approve));
    });
    el.content.querySelectorAll("[data-reject]").forEach((btn) => {
      btn.addEventListener("click", () => rejectReg(btn.dataset.reject));
    });
    el.content.querySelectorAll("[data-resend]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!can("customersReset")) {
          toast("Повторная отправка пароля — у владельца и администратора", "warn");
          return;
        }
        const reg = state.data.registrations.find((r) => r.id === btn.dataset.resend);
        logActivity({
          action: "registration.resend",
          entityType: "registration",
          entityLabel: reg?.fullName || "",
          details: `Пароль повторно отправлен на ${reg?.email || ""}`,
        });
        toast(`Пароль повторно отправлен на ${reg?.email}`);
      });
    });
    bindActionTooltips();
  }

  function regRow(r) {
    const badge =
      r.status === "pending"
        ? "badge-pending"
        : r.status === "approved"
          ? "badge-approved"
          : "badge-rejected";
    const label =
      r.status === "pending"
        ? "на модерации"
        : r.status === "approved"
          ? "одобрена"
          : "отклонена";

    const statusExtra =
      r.status === "rejected" && r.note
        ? `<small>${r.note}</small>`
        : "";

    const actions =
      r.status === "pending"
        ? `<div class="row-actions">
            ${iconAction({ attrs: `data-approve="${r.id}"`, tooltip: "Одобрить", icon: "approve", variant: "ok" })}
            ${iconAction({ attrs: `data-reject="${r.id}"`, tooltip: "Отклонить", icon: "reject", variant: "danger" })}
          </div>`
        : r.status === "approved"
          ? iconAction({
              attrs: `data-resend="${r.id}"`,
              tooltip: r.note || "Доступ открыт, пароль отправлен на почту",
              icon: "mail",
              variant: "ghost",
            })
          : `<span class="muted">—</span>`;

    return `
      <tr>
        <td><span class="num">${fmtDateTime(r.createdAt)}</span></td>
        <td>
          <div class="cell-stack">
            <span>${r.fullName}</span>
          </div>
        </td>
        <td>${clubName(r.clubId)}</td>
        <td>${r.position}</td>
        <td>
          <div class="cell-stack">
            <span>${r.email}</span>
            <small>${r.phone}</small>
          </div>
        </td>
        <td>
          <div class="cell-stack">
            <span class="badge ${badge}">${label}</span>
            ${statusExtra}
          </div>
        </td>
        <td>${actions}</td>
      </tr>
    `;
  }

  function approveReg(id) {
    if (!can("moderate")) return;
    const reg = state.data.registrations.find((r) => r.id === id);
    if (!reg) return;
    reg.status = "approved";
    reg.approvedAt = new Date().toISOString();
    reg.approvedBy = state.role.name;
    reg.note = "Доступ открыт, пароль отправлен на почту";
    logActivity({
      action: "registration.approve",
      entityType: "registration",
      entityLabel: reg.fullName,
      details: reg.note,
    });
    toast(`Одобрено: ${reg.fullName}. Пароль уходит на ${reg.email}`);
    setBadges();
    renderRegistrations();
  }

  function rejectReg(id) {
    if (!can("moderate")) return;
    const reg = state.data.registrations.find((r) => r.id === id);
    if (!reg) return;
    openModal(
      "Отклонить регистрацию",
      `
        <p style="margin:0 0 12px;font-size:14px">${reg.fullName} · ${clubName(reg.clubId)}</p>
        <label class="field"><span>Причина (опционально, уйдёт в письмо)</span>
          <textarea id="reject-reason" rows="3" placeholder="Например: не подтверждён представитель клуба"></textarea>
        </label>
      `,
      [
        { label: "Отмена", className: "btn-secondary", action: closeModal },
        {
          label: "Отклонить",
          className: "btn-danger",
          action: () => {
            const reason = document.getElementById("reject-reason").value.trim();
            reg.status = "rejected";
            reg.note = reason || "Регистрация отклонена";
            logActivity({
              action: "registration.reject",
              entityType: "registration",
              entityLabel: reg.fullName,
              details: reg.note,
            });
            toast(`Отклонено: ${reg.fullName}`);
            closeModal();
            setBadges();
            renderRegistrations();
          },
        },
      ]
    );
  }

  /* —— Clubs —— */
  function filteredClubs() {
    const { q, active, sortKey, sortDir } = state.clubFilters;
    const query = q.trim().toLowerCase();
    return [...state.data.clubs]
      .filter((c) => {
        if (active === "1" && !c.active) return false;
        if (active === "0" && c.active) return false;
        if (!query) return true;
        return `${c.name} ${c.city}`.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        const map = {
          name: a.name,
          city: a.city,
          products: a.products,
          customers: a.customers,
          active: a.active ? 1 : 0,
        };
        const mapB = {
          name: b.name,
          city: b.city,
          products: b.products,
          customers: b.customers,
          active: b.active ? 1 : 0,
        };
        return compareValues(map[sortKey] ?? a.name, mapB[sortKey] ?? b.name, sortDir);
      });
  }

  function renderClubs() {
    el.topbarActions.innerHTML = can("clubs")
      ? `<button type="button" class="btn btn-primary btn-sm" id="btn-add-club">Добавить клуб</button>`
      : "";

    const list = filteredClubs();

    el.content.innerHTML = `
      ${roleBannerHtml()}
      ${
        !can("clubs")
          ? `<div class="callout" style="margin-bottom:14px">Модератор видит список клубов без редактирования.</div>`
          : ""
      }
      <div class="filter-bar">
        <input type="search" id="club-filter-q" placeholder="Поиск: клуб, город" value="${escapeAttr(state.clubFilters.q)}" />
        <select id="club-filter-active">
          <option value="">Все статусы</option>
          <option value="1" ${state.clubFilters.active === "1" ? "selected" : ""}>Активные</option>
          <option value="0" ${state.clubFilters.active === "0" ? "selected" : ""}>Скрытые</option>
        </select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                ${sortTh("Клуб", "name", state.clubFilters)}
                ${sortTh("Город", "city", state.clubFilters)}
                ${sortTh("Изделий", "products", state.clubFilters)}
                ${sortTh("Представителей", "customers", state.clubFilters)}
                ${sortTh("Статус", "active", state.clubFilters)}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              ${
                list.length
                  ? list
                      .map((c) => {
                        const parts = [];
                        if (can("catalog")) {
                          parts.push(
                            iconAction({
                              attrs: `data-open-catalog="${c.id}"`,
                              tooltip: "Каталог клуба",
                              icon: "catalog",
                              variant: "ghost",
                            })
                          );
                        }
                        if (can("clubs")) {
                          parts.push(
                            iconAction({
                              attrs: `data-edit-club="${c.id}"`,
                              tooltip: "Редактировать",
                              icon: "edit",
                              variant: "ghost",
                            })
                          );
                          parts.push(
                            iconAction({
                              attrs: `data-toggle-club="${c.id}"`,
                              tooltip: c.active ? "Деактивировать" : "Активировать",
                              icon: c.active ? "deactivate" : "activate",
                              variant: "ghost",
                            })
                          );
                        }
                        const actions = parts.length
                          ? `<div class="row-actions">${parts.join("")}</div>`
                          : `<span class="muted">—</span>`;
                        return `
                    <tr>
                      <td><span class="num">${c.name}</span></td>
                      <td>${c.city}</td>
                      <td class="num">${c.products}</td>
                      <td class="num">${c.customers}</td>
                      <td><span class="badge ${c.active ? "badge-active" : "badge-inactive"}">${c.active ? "активен" : "скрыт"}</span></td>
                      <td>${actions}</td>
                    </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="6"><div class="empty">Ничего не найдено</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("club-filter-q")?.addEventListener("input", (e) => {
      state.clubFilters.q = e.target.value;
      renderClubs();
    });
    document.getElementById("club-filter-active")?.addEventListener("change", (e) => {
      state.clubFilters.active = e.target.value;
      renderClubs();
    });
    bindSortHeaders(state.clubFilters, renderClubs);

    document.getElementById("btn-add-club")?.addEventListener("click", () => {
      state.editingId = null;
      state.view = "club-form";
      render();
    });

    el.content.querySelectorAll("[data-edit-club]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.editingId = btn.dataset.editClub;
        state.view = "club-form";
        render();
      });
    });

    el.content.querySelectorAll("[data-open-catalog]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!can("catalog")) {
          toast("Каталог доступен владельцу и администратору", "warn");
          return;
        }
        state.catalogClubId = btn.dataset.openCatalog;
        state.productFilters.clubId = btn.dataset.openCatalog;
        state.view = "catalog";
        render();
      });
    });

    el.content.querySelectorAll("[data-toggle-club]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const club = state.data.clubs.find((c) => c.id === btn.dataset.toggleClub);
        if (!club || !can("clubs")) return;
        club.active = !club.active;
        logActivity({
          action: "club.toggle",
          entityType: "club",
          entityLabel: club.name,
          details: club.active ? "Активирован" : "Скрыт из регистрации",
        });
        toast(
          club.active
            ? `${club.name} снова в списке регистрации`
            : `${club.name} скрыт из регистрации в приложении`
        );
        renderClubs();
      });
    });
    bindActionTooltips();
  }

  function renderClubForm() {
    if (!can("clubs")) {
      state.view = "clubs";
      render();
      return;
    }
    const club = state.editingId
      ? state.data.clubs.find((c) => c.id === state.editingId)
      : null;
    const isEdit = Boolean(club);
    el.viewTitle.textContent = isEdit ? "Редактирование клуба" : "Новый клуб";
    el.viewSubtitle.textContent = isEdit
      ? club.name
      : "Появится в списке регистрации приложения, если активен";
    el.topbarActions.innerHTML = backButton("К списку", "clubs");
    bindBack("clubs");

    el.content.innerHTML = formShell(
      `
      <label class="field"><span>Название</span>
        <input type="text" id="club-name" value="${escapeAttr(club?.name || "")}" placeholder="Например, ХК ЦСКА" />
      </label>
      <label class="field"><span>Город</span>
        <input type="text" id="club-city" value="${escapeAttr(club?.city || "")}" placeholder="Москва" />
      </label>
      <label class="field"><span>Статус</span>
        <select id="club-active">
          <option value="1" ${!club || club.active ? "selected" : ""}>Активен — в регистрации</option>
          <option value="0" ${club && !club.active ? "selected" : ""}>Скрыт — не показывать в приложении</option>
        </select>
      </label>
      <p class="callout">Активные клубы доступны при регистрации представителей. Ассортимент привязывается в каталоге.</p>
    `,
      { submitLabel: isEdit ? "Сохранить" : "Создать клуб", cancelView: "clubs" }
    );

    document.getElementById("btn-form-cancel")?.addEventListener("click", () => {
      state.editingId = null;
      state.view = "clubs";
      render();
    });
    document.getElementById("btn-form-save")?.addEventListener("click", () => {
      const name = document.getElementById("club-name").value.trim();
      const city = document.getElementById("club-city").value.trim();
      const active = document.getElementById("club-active").value === "1";
      if (!name) {
        toast("Укажите название клуба", "warn");
        return;
      }
      if (isEdit) {
        club.name = name;
        club.city = city || club.city;
        club.active = active;
        logActivity({
          action: "club.update",
          entityType: "club",
          entityLabel: name,
          details: active ? "Активен" : "Скрыт",
        });
        toast(`Клуб «${name}» сохранён`);
      } else {
        state.data.clubs.push({
          id: uid("club"),
          name,
          city: city || "—",
          active,
          products: 0,
          customers: 0,
        });
        logActivity({
          action: "club.create",
          entityType: "club",
          entityLabel: name,
          details: city || "",
        });
        toast(`Клуб «${name}» создан`);
      }
      state.editingId = null;
      state.view = "clubs";
      render();
    });
  }

  /* —— Catalog —— */
  function filteredProducts() {
    const { q, clubId, active, sortKey, sortDir } = state.productFilters;
    const query = q.trim().toLowerCase();
    return state.data.products
      .filter((p) => {
        if (clubId && p.clubId !== clubId) return false;
        if (active === "1" && !p.active) return false;
        if (active === "0" && p.active) return false;
        if (!query) return true;
        return `${p.name} ${p.article} ${p.description} ${clubName(p.clubId)}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const mapA = {
          name: a.name,
          article: a.article,
          club: clubName(a.clubId),
          priceSmall: a.priceSmall,
          priceLarge: a.priceLarge,
          sizes: a.sizes,
          active: a.active ? 1 : 0,
        };
        const mapB = {
          name: b.name,
          article: b.article,
          club: clubName(b.clubId),
          priceSmall: b.priceSmall,
          priceLarge: b.priceLarge,
          sizes: b.sizes,
          active: b.active ? 1 : 0,
        };
        return compareValues(
          mapA[sortKey] ?? a.name,
          mapB[sortKey] ?? b.name,
          sortDir
        );
      });
  }

  function openProductDetail(id) {
    state.editingId = id;
    state.view = "product-detail";
    render();
  }

  function toggleProductActive(id, redraw) {
    const p = state.data.products.find((x) => x.id === id);
    if (!p) return;
    p.active = !p.active;
    logActivity({
      action: "product.toggle",
      entityType: "product",
      entityLabel: p.name,
      details: p.active ? "Снова в каталоге" : "Скрыто из приложения",
    });
    toast(p.active ? `${p.name} снова в приложении` : `${p.name} скрыто из приложения`);
    redraw();
  }

  function renderCatalog() {
    if (!can("catalog")) {
      state.view = "orders";
      render();
      return;
    }

    const uploadClubId =
      state.productFilters.clubId || state.catalogClubId || state.data.clubs[0]?.id;
    const list = filteredProducts();

    el.topbarActions.innerHTML = `
      <button type="button" class="btn btn-secondary btn-sm" id="btn-upload-top">Загрузить файл</button>
      <button type="button" class="btn btn-primary btn-sm" id="btn-add-product">Добавить изделие</button>
    `;

    document.getElementById("btn-add-product")?.addEventListener("click", () => {
      state.editingId = null;
      state.catalogClubId =
        state.productFilters.clubId || state.catalogClubId || state.data.clubs[0]?.id;
      state.view = "product-form";
      render();
    });
    document.getElementById("btn-upload-top")?.addEventListener("click", () => {
      document.getElementById("file-input")?.click();
    });

    el.content.innerHTML = `
      ${roleBannerHtml()}
      <div class="upload-zone" id="upload-zone">
        <strong>Загрузить файл каталога</strong>
        <p>Excel / CSV с привязкой к клубу «${clubName(uploadClubId)}». Шаблон: артикул, название, цены ≤158 и 164–192, размеры.</p>
        <button type="button" class="btn btn-primary" id="btn-upload">Выбрать файл</button>
        <input type="file" id="file-input" accept=".csv,.xlsx,.xls" class="hidden" />
      </div>
      <div class="filter-bar">
        <input type="search" id="prod-filter-q" placeholder="Поиск: название, артикул, клуб" value="${escapeAttr(state.productFilters.q)}" />
        <select id="prod-filter-club">
          <option value="">Все клубы</option>
          ${state.data.clubs
            .map(
              (c) =>
                `<option value="${c.id}" ${state.productFilters.clubId === c.id ? "selected" : ""}>${c.name}</option>`
            )
            .join("")}
        </select>
        <select id="prod-filter-active">
          <option value="">Все статусы</option>
          <option value="1" ${state.productFilters.active === "1" ? "selected" : ""}>В каталоге</option>
          <option value="0" ${state.productFilters.active === "0" ? "selected" : ""}>Скрытые</option>
        </select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                ${sortTh("Изделие", "name", state.productFilters)}
                ${sortTh("Артикул", "article", state.productFilters)}
                ${sortTh("Клуб", "club", state.productFilters)}
                ${sortTh("≤158", "priceSmall", state.productFilters)}
                ${sortTh("164–192", "priceLarge", state.productFilters)}
                ${sortTh("Росты", "sizes", state.productFilters)}
                ${sortTh("Статус", "active", state.productFilters)}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              ${
                list.length
                  ? list
                      .map((p) => {
                        return `
                    <tr>
                      <td>
                        <button type="button" class="linkish" data-open-product="${p.id}">${p.name}</button>
                      </td>
                      <td class="num">${p.article}</td>
                      <td>${clubName(p.clubId)}</td>
                      <td class="num">${rub(p.priceSmall)}</td>
                      <td class="num">${rub(p.priceLarge)}</td>
                      <td>${p.sizes}</td>
                      <td><span class="badge ${p.active ? "badge-active" : "badge-inactive"}">${p.active ? "в каталоге" : "скрыто"}</span></td>
                      <td>
                        <div class="row-actions">
                          ${iconAction({
                            attrs: `data-open-product="${p.id}"`,
                            tooltip: "Открыть карточку",
                            icon: "catalog",
                            variant: "ghost",
                          })}
                          ${iconAction({
                            attrs: `data-edit-product="${p.id}"`,
                            tooltip: "Редактировать",
                            icon: "edit",
                            variant: "ghost",
                          })}
                          ${iconAction({
                            attrs: `data-deactivate="${p.id}"`,
                            tooltip: p.active ? "Деактивировать" : "Активировать",
                            icon: p.active ? "deactivate" : "activate",
                            variant: "ghost",
                          })}
                        </div>
                      </td>
                    </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="8"><div class="empty">Ничего не найдено. Загрузите файл или добавьте изделие.</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("prod-filter-q")?.addEventListener("input", (e) => {
      state.productFilters.q = e.target.value;
      renderCatalog();
    });
    document.getElementById("prod-filter-club")?.addEventListener("change", (e) => {
      state.productFilters.clubId = e.target.value;
      if (e.target.value) state.catalogClubId = e.target.value;
      renderCatalog();
    });
    document.getElementById("prod-filter-active")?.addEventListener("change", (e) => {
      state.productFilters.active = e.target.value;
      renderCatalog();
    });
    bindSortHeaders(state.productFilters, renderCatalog);

    const startUpload = () => document.getElementById("file-input")?.click();
    document.getElementById("btn-upload")?.addEventListener("click", startUpload);
    document.getElementById("file-input")?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const clubId = uploadClubId;
      state.uploadReport = {
        fileName: file.name,
        clubId,
        ok: 12,
        errors: [
          { row: 4, text: "Пустая цена для роста 164–192" },
          { row: 9, text: "Неизвестный артикул-дубль CSKA-FT" },
        ],
      };
      logActivity({
        action: "catalog.upload",
        entityType: "catalog",
        entityLabel: clubName(clubId),
        details: `Файл «${file.name}»: 12 принято, 2 ошибки`,
      });
      e.target.value = "";
      state.view = "catalog-upload";
      render();
    });

    el.content.querySelectorAll("[data-open-product]").forEach((btn) => {
      btn.addEventListener("click", () => openProductDetail(btn.dataset.openProduct));
    });
    el.content.querySelectorAll("[data-edit-product]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.editingId = btn.dataset.editProduct;
        state.view = "product-form";
        render();
      });
    });
    el.content.querySelectorAll("[data-deactivate]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleProductActive(btn.dataset.deactivate, renderCatalog);
      });
    });
    bindActionTooltips();
  }

  function renderProductDetail() {
    if (!can("catalog")) {
      state.view = "orders";
      render();
      return;
    }
    const product = state.data.products.find((p) => p.id === state.editingId);
    if (!product) {
      state.view = "catalog";
      render();
      return;
    }

    el.viewTitle.textContent = product.name;
    el.viewSubtitle.textContent = `${product.article} · ${clubName(product.clubId)}`;
    el.topbarActions.innerHTML = `
      ${backButton("К каталогу", "catalog")}
      <button type="button" class="btn btn-secondary btn-sm" id="btn-toggle-from-detail">${
        product.active ? "Деактивировать" : "Активировать"
      }</button>
      <button type="button" class="btn btn-primary btn-sm" id="btn-edit-from-detail">Редактировать</button>
    `;
    bindBack("catalog");
    document.getElementById("btn-edit-from-detail")?.addEventListener("click", () => {
      state.view = "product-form";
      render();
    });
    document.getElementById("btn-toggle-from-detail")?.addEventListener("click", () => {
      toggleProductActive(product.id, renderProductDetail);
    });

    el.content.innerHTML = `
      <div class="product-detail">
        <div class="product-visual ${product.visual === "alt" ? "alt" : ""} product-visual--lg">
          <span>${product.article}</span>
        </div>
        <div class="panel panel-pad">
          <div class="stats-row" style="grid-template-columns:repeat(3,1fr);margin-bottom:18px">
            <div class="stat"><div class="label">Статус</div><div class="value" style="font-size:16px">${
              product.active ? "в каталоге" : "скрыто"
            }</div></div>
            <div class="stat"><div class="label">Цена ≤158</div><div class="value" style="font-size:18px">${rub(
              product.priceSmall
            )}</div></div>
            <div class="stat"><div class="label">Цена 164–192</div><div class="value" style="font-size:18px">${rub(
              product.priceLarge
            )}</div></div>
          </div>
          <div class="detail-section">
            <h4>Основное</h4>
            <dl class="kv">
              <dt>Название</dt><dd>${product.name}</dd>
              <dt>Артикул</dt><dd class="num">${product.article}</dd>
              <dt>Клуб</dt><dd>${clubName(product.clubId)}</dd>
              <dt>Росты</dt><dd>${product.sizes}</dd>
              <dt>Нанесение</dt><dd>${product.application || "—"}</dd>
            </dl>
          </div>
          <div class="detail-section" style="margin-bottom:0">
            <h4>Описание</h4>
            <p style="margin:0;line-height:1.5;color:var(--ink-soft)">${
              product.description || "—"
            }</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderProductForm() {
    if (!can("catalog")) {
      state.view = "catalog";
      render();
      return;
    }
    const product = state.editingId
      ? state.data.products.find((p) => p.id === state.editingId)
      : null;
    const isEdit = Boolean(product);
    el.viewTitle.textContent = isEdit ? "Редактирование изделия" : "Новое изделие";
    el.viewSubtitle.textContent = `Клуб: ${clubName(product?.clubId || state.catalogClubId)}`;
    el.topbarActions.innerHTML = backButton("К каталогу", "catalog");
    bindBack("catalog");

    el.content.innerHTML = formShell(
      `
      <label class="field"><span>Клуб</span>
        <select id="prod-club">
          ${state.data.clubs
            .map(
              (c) =>
                `<option value="${c.id}" ${(product?.clubId || state.catalogClubId) === c.id ? "selected" : ""}>${c.name}</option>`
            )
            .join("")}
        </select>
      </label>
      <label class="field"><span>Название</span>
        <input type="text" id="prod-name" value="${escapeAttr(product?.name || "")}" placeholder="Классическая футболка" />
      </label>
      <label class="field"><span>Артикул</span>
        <input type="text" id="prod-article" value="${escapeAttr(product?.article || "")}" placeholder="CSKA-FT" />
      </label>
      <label class="field field--full"><span>Описание</span>
        <textarea id="prod-desc" rows="3" placeholder="Краткое описание для приложения">${escapeAttr(product?.description || "")}</textarea>
      </label>
      <label class="field"><span>Нанесение</span>
        <input type="text" id="prod-app" value="${escapeAttr(product?.application || "")}" placeholder="Термотрансфер / вышивка" />
      </label>
      <label class="field"><span>Росты</span>
        <input type="text" id="prod-sizes" value="${escapeAttr(product?.sizes || "140–192")}" placeholder="140–192" />
      </label>
      <label class="field"><span>Цена ≤158, ₽</span>
        <input type="number" id="prod-price-s" value="${product?.priceSmall ?? 1800}" />
      </label>
      <label class="field"><span>Цена 164–192, ₽</span>
        <input type="number" id="prod-price-l" value="${product?.priceLarge ?? 2100}" />
      </label>
      <label class="field"><span>Статус</span>
        <select id="prod-active">
          <option value="1" ${!product || product.active ? "selected" : ""}>В каталоге приложения</option>
          <option value="0" ${product && !product.active ? "selected" : ""}>Скрыто</option>
        </select>
      </label>
    `,
      {
        submitLabel: isEdit ? "Сохранить" : "Добавить изделие",
        cancelView: "catalog",
      }
    );

    document.getElementById("btn-form-cancel")?.addEventListener("click", () => {
      state.editingId = null;
      state.view = "catalog";
      render();
    });
    document.getElementById("btn-form-save")?.addEventListener("click", () => {
      const name = document.getElementById("prod-name").value.trim();
      const article = document.getElementById("prod-article").value.trim();
      const clubId = document.getElementById("prod-club").value;
      if (!name || !article) {
        toast("Укажите название и артикул", "warn");
        return;
      }
      const payload = {
        clubId,
        name,
        article,
        description: document.getElementById("prod-desc").value.trim(),
        application: document.getElementById("prod-app").value.trim(),
        sizes: document.getElementById("prod-sizes").value.trim() || "140–192",
        priceSmall: Number(document.getElementById("prod-price-s").value) || 0,
        priceLarge: Number(document.getElementById("prod-price-l").value) || 0,
        active: document.getElementById("prod-active").value === "1",
        visual: product?.visual || "default",
      };
      if (isEdit) {
        Object.assign(product, payload);
        logActivity({
          action: "product.update",
          entityType: "product",
          entityLabel: name,
          details: article,
        });
        toast(`Изделие «${name}» сохранено`);
        state.catalogClubId = clubId;
        state.view = "product-detail";
      } else {
        const id = uid("prod");
        state.data.products.push({ id, ...payload });
        const club = state.data.clubs.find((c) => c.id === clubId);
        if (club) club.products += 1;
        logActivity({
          action: "product.create",
          entityType: "product",
          entityLabel: name,
          details: article,
        });
        toast(`Изделие «${name}» добавлено`);
        state.catalogClubId = clubId;
        state.editingId = id;
        state.view = "product-detail";
      }
      render();
    });
  }

  function renderCatalogUpload() {
    if (!can("catalog") || !state.uploadReport) {
      state.view = "catalog";
      render();
      return;
    }
    const report = state.uploadReport;
    el.viewTitle.textContent = "Отчёт загрузки";
    el.viewSubtitle.textContent = `${report.fileName} · ${clubName(report.clubId)}`;
    el.topbarActions.innerHTML = backButton("К каталогу", "catalog");
    bindBack("catalog");

    el.content.innerHTML = `
      <div class="stats-row" style="grid-template-columns:repeat(2,1fr)">
        <div class="stat"><div class="label">Строк принято</div><div class="value">${report.ok}</div></div>
        <div class="stat"><div class="label">Ошибок</div><div class="value">${report.errors.length}</div></div>
      </div>
      <div class="panel">
        <div class="panel-pad">
          <p class="callout" style="margin:0 0 14px">В превью результат демонстрационный. В проде — разбор Excel/CSV построчно.</p>
        </div>
        <div class="table-wrap">
          <table class="data">
            <thead><tr><th>Строка</th><th>Ошибка</th></tr></thead>
            <tbody>
              ${report.errors
                .map(
                  (err) =>
                    `<tr><td class="num">${err.row}</td><td>${err.text}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
      <div class="form-actions" style="margin-top:14px">
        <button type="button" class="btn btn-primary" id="btn-upload-done">Вернуться в каталог</button>
      </div>
    `;

    document.getElementById("btn-upload-done")?.addEventListener("click", () => {
      state.uploadReport = null;
      state.view = "catalog";
      render();
    });
  }

  /* —— Settings —— */
  function renderSettings() {
    if (!can("settings")) {
      state.view = "orders";
      render();
      return;
    }

    const s = state.data.settings;
    el.topbarActions.innerHTML = `<button type="button" class="btn btn-primary btn-sm" id="btn-save-settings">Сохранить</button>`;

    el.content.innerHTML = `
      ${roleBannerHtml()}
      <div class="panel panel-pad">
        <div class="settings-grid">
          <div class="settings-item">
            <label for="set-min">Минимальная сумма заказа (без доставки), ₽</label>
            <input type="number" id="set-min" value="${s.minOrderAmount}" />
            <p class="muted" style="margin:8px 0 0;font-size:12px">По умолчанию 150 000 ₽. Проверяется при создании заявки в приложении.</p>
          </div>
          <div class="settings-item">
            <label for="set-email">Рабочая почта для новых заявок</label>
            <input type="email" id="set-email" value="${escapeAttr(s.workEmail)}" />
          </div>
          <div class="settings-item">
            <label for="set-delivery">Доставка, %</label>
            <input type="number" id="set-delivery" step="0.1" value="${s.deliveryPercent}" />
          </div>
          <div class="settings-item">
            <label for="set-cashback">Ожидаемый кешбэк, %</label>
            <input type="number" id="set-cashback" step="0.1" value="${s.cashbackPercent}" />
          </div>
          <div class="settings-item">
            <label for="set-days">Срок производства, раб. дней</label>
            <input type="number" id="set-days" value="${s.productionDays}" />
          </div>
          <div class="settings-item">
            <label>Текущий порог</label>
            <div class="value-lg">${rub(s.minOrderAmount)}</div>
            <p class="muted" style="margin:8px 0 0;font-size:12px">Смена порога влияет на новые заказы.</p>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btn-save-settings")?.addEventListener("click", () => {
      s.minOrderAmount = Number(document.getElementById("set-min").value) || 150000;
      s.workEmail = document.getElementById("set-email").value.trim() || s.workEmail;
      s.deliveryPercent = Number(document.getElementById("set-delivery").value) || 1;
      s.cashbackPercent = Number(document.getElementById("set-cashback").value) || 2;
      s.productionDays = Number(document.getElementById("set-days").value) || 21;
      logActivity({
        action: "settings.update",
        entityType: "settings",
        entityLabel: "Система",
        details: `Мин. заказ ${rub(s.minOrderAmount)}`,
      });
      toast(`Настройки сохранены. Мин. заказ: ${rub(s.minOrderAmount)}`);
      renderSettings();
    });
  }

  /* —— Staff —— */
  function filteredStaff() {
    const { q, role, sortKey, sortDir } = state.staffFilters;
    const query = q.trim().toLowerCase();
    return [...state.data.staff]
      .filter((s) => {
        if (role && s.role !== role) return false;
        if (!query) return true;
        return `${s.name} ${s.email}`.toLowerCase().includes(query);
      })
      .sort((a, b) => {
        const av =
          sortKey === "role"
            ? ROLES[a.role]?.title || a.role
            : sortKey === "email"
              ? a.email
              : a.name;
        const bv =
          sortKey === "role"
            ? ROLES[b.role]?.title || b.role
            : sortKey === "email"
              ? b.email
              : b.name;
        return compareValues(av, bv, sortDir);
      });
  }

  function filteredActivity(staffId) {
    const { q, action, sortKey, sortDir } = state.activityFilters;
    const query = q.trim().toLowerCase();
    return [...(state.data.activity || [])]
      .filter((a) => a.staffId === staffId)
      .filter((a) => {
        if (action && a.action !== action) return false;
        if (!query) return true;
        return [activityLabel(a.action), a.entityLabel, a.details]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const av =
          sortKey === "action"
            ? activityLabel(a.action)
            : sortKey === "entity"
              ? a.entityLabel
              : sortKey === "details"
                ? a.details
                : a.at;
        const bv =
          sortKey === "action"
            ? activityLabel(b.action)
            : sortKey === "entity"
              ? b.entityLabel
              : sortKey === "details"
                ? b.details
                : b.at;
        return compareValues(av, bv, sortDir);
      });
  }

  function renderStaff() {
    if (!can("staff")) {
      state.view = "orders";
      render();
      return;
    }

    el.topbarActions.innerHTML = `<button type="button" class="btn btn-primary btn-sm" id="btn-add-staff">Добавить сотрудника</button>`;
    const list = filteredStaff();

    el.content.innerHTML = `
      ${roleBannerHtml()}
      <div class="filter-bar">
        <input type="search" id="staff-filter-q" placeholder="Поиск: ФИО, почта" value="${escapeAttr(state.staffFilters.q)}" />
        <select id="staff-filter-role">
          <option value="">Все роли</option>
          <option value="owner" ${state.staffFilters.role === "owner" ? "selected" : ""}>Владелец</option>
          <option value="admin" ${state.staffFilters.role === "admin" ? "selected" : ""}>Администратор</option>
          <option value="moderator" ${state.staffFilters.role === "moderator" ? "selected" : ""}>Модератор</option>
        </select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                ${sortTh("Сотрудник", "name", state.staffFilters)}
                ${sortTh("Почта", "email", state.staffFilters)}
                ${sortTh("Роль", "role", state.staffFilters)}
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              ${
                list.length
                  ? list
                      .map((s) => {
                        const roleTitle = ROLES[s.role]?.title || s.role;
                        return `
                    <tr>
                      <td>
                        <button type="button" class="linkish" data-open-staff="${s.id}">${s.name}</button>
                      </td>
                      <td>${s.email}</td>
                      <td><span class="badge badge-active">${roleTitle.toLowerCase()}</span></td>
                      <td>
                        <div class="row-actions">
                          ${iconAction({
                            attrs: `data-open-staff="${s.id}"`,
                            tooltip: "Карточка и действия",
                            icon: "activate",
                            variant: "ghost",
                          })}
                          ${iconAction({
                            attrs: `data-edit-staff="${s.id}"`,
                            tooltip: "Изменить",
                            icon: "edit",
                            variant: "ghost",
                          })}
                        </div>
                      </td>
                    </tr>`;
                      })
                      .join("")
                  : `<tr><td colspan="4"><div class="empty">Ничего не найдено</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
      <p class="callout" style="margin-top:14px">Нельзя снять последнего владельца. Создаёт и меняет роли только владелец.</p>
    `;

    document.getElementById("staff-filter-q")?.addEventListener("input", (e) => {
      state.staffFilters.q = e.target.value;
      renderStaff();
    });
    document.getElementById("staff-filter-role")?.addEventListener("change", (e) => {
      state.staffFilters.role = e.target.value;
      renderStaff();
    });
    bindSortHeaders(state.staffFilters, renderStaff);

    document.getElementById("btn-add-staff")?.addEventListener("click", () => {
      state.editingId = null;
      state.view = "staff-form";
      render();
    });

    el.content.querySelectorAll("[data-open-staff]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.editingId = btn.dataset.openStaff;
        state.activityFilters = {
          q: "",
          action: "",
          sortKey: "at",
          sortDir: "desc",
        };
        state.view = "staff-detail";
        render();
      });
    });

    el.content.querySelectorAll("[data-edit-staff]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.editingId = btn.dataset.editStaff;
        state.view = "staff-form";
        render();
      });
    });
    bindActionTooltips();
  }

  function renderStaffDetail() {
    if (!can("staff")) {
      state.view = "orders";
      render();
      return;
    }
    const person = state.data.staff.find((s) => s.id === state.editingId);
    if (!person) {
      state.view = "staff";
      render();
      return;
    }
    const roleTitle = ROLES[person.role]?.title || person.role;
    const list = filteredActivity(person.id);
    const actionsUsed = [
      ...new Set(
        (state.data.activity || [])
          .filter((a) => a.staffId === person.id)
          .map((a) => a.action)
      ),
    ];

    el.viewTitle.textContent = person.name;
    el.viewSubtitle.textContent = `${roleTitle} · ${person.email}`;
    el.topbarActions.innerHTML = `
      ${backButton("К списку", "staff")}
      <button type="button" class="btn btn-primary btn-sm" id="btn-edit-from-detail">Изменить</button>
    `;
    bindBack("staff");
    document.getElementById("btn-edit-from-detail")?.addEventListener("click", () => {
      state.view = "staff-form";
      render();
    });

    el.content.innerHTML = `
      <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><div class="label">Роль</div><div class="value" style="font-size:18px">${roleTitle}</div></div>
        <div class="stat"><div class="label">Действий в журнале</div><div class="value">${(state.data.activity || []).filter((a) => a.staffId === person.id).length}</div></div>
        <div class="stat"><div class="label">Почта</div><div class="value" style="font-size:14px;font-weight:600">${person.email}</div></div>
      </div>
      <div class="filter-bar">
        <input type="search" id="act-filter-q" placeholder="Поиск по действиям" value="${escapeAttr(state.activityFilters.q)}" />
        <select id="act-filter-action">
          <option value="">Все типы действий</option>
          ${actionsUsed
            .map(
              (a) =>
                `<option value="${a}" ${state.activityFilters.action === a ? "selected" : ""}>${activityLabel(a)}</option>`
            )
            .join("")}
        </select>
      </div>
      <div class="panel">
        <div class="table-wrap">
          <table class="data">
            <thead>
              <tr>
                ${sortTh("Дата", "at", state.activityFilters)}
                ${sortTh("Действие", "action", state.activityFilters)}
                ${sortTh("Объект", "entity", state.activityFilters)}
                ${sortTh("Детали", "details", state.activityFilters)}
              </tr>
            </thead>
            <tbody>
              ${
                list.length
                  ? list
                      .map(
                        (a) => `
                <tr>
                  <td class="num">${fmtDateTime(a.at)}</td>
                  <td>${activityLabel(a.action)}</td>
                  <td>${a.entityLabel || "—"}</td>
                  <td>${a.details || "—"}</td>
                </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="4"><div class="empty">Пока нет записанных действий</div></td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("act-filter-q")?.addEventListener("input", (e) => {
      state.activityFilters.q = e.target.value;
      renderStaffDetail();
    });
    document.getElementById("act-filter-action")?.addEventListener("change", (e) => {
      state.activityFilters.action = e.target.value;
      renderStaffDetail();
    });
    bindSortHeaders(state.activityFilters, renderStaffDetail);
  }

  function renderStaffForm() {
    if (!can("staff")) {
      state.view = "staff";
      render();
      return;
    }
    const person = state.editingId
      ? state.data.staff.find((s) => s.id === state.editingId)
      : null;
    const isEdit = Boolean(person);
    el.viewTitle.textContent = isEdit ? "Редактирование сотрудника" : "Новый сотрудник";
    el.viewSubtitle.textContent = isEdit
      ? person.email
      : "Учётная запись для входа в кабинет";
    el.topbarActions.innerHTML = backButton("К списку", "staff");
    bindBack("staff");

    el.content.innerHTML = formShell(
      `
      <label class="field"><span>ФИО</span>
        <input type="text" id="staff-name" value="${escapeAttr(person?.name || "")}" placeholder="Имя Фамилия" />
      </label>
      <label class="field"><span>Почта</span>
        <input type="email" id="staff-email" value="${escapeAttr(person?.email || "")}" placeholder="name@uniforma.online" />
      </label>
      <label class="field"><span>Роль</span>
        <select id="staff-role">
          <option value="owner" ${person?.role === "owner" ? "selected" : ""}>Владелец</option>
          <option value="admin" ${!person || person.role === "admin" ? "selected" : ""}>Администратор</option>
          <option value="moderator" ${person?.role === "moderator" ? "selected" : ""}>Модератор</option>
        </select>
      </label>
      <p class="callout">Нельзя снять последнего владельца. Пароль для нового сотрудника уйдёт на почту (в превью — имитация).</p>
    `,
      {
        submitLabel: isEdit ? "Сохранить" : "Создать сотрудника",
        cancelView: "staff",
      }
    );

    document.getElementById("btn-form-cancel")?.addEventListener("click", () => {
      state.editingId = null;
      state.view = "staff";
      render();
    });
    document.getElementById("btn-form-save")?.addEventListener("click", () => {
      const name = document.getElementById("staff-name").value.trim();
      const email = document.getElementById("staff-email").value.trim();
      const role = document.getElementById("staff-role").value;
      if (!name || !email) {
        toast("Укажите ФИО и почту", "warn");
        return;
      }
      if (isEdit) {
        const owners = state.data.staff.filter((s) => s.role === "owner");
        if (
          person.role === "owner" &&
          role !== "owner" &&
          owners.length <= 1
        ) {
          toast("Нельзя снять последнего владельца", "warn");
          return;
        }
        person.name = name;
        person.email = email;
        person.role = role;
        logActivity({
          action: "staff.update",
          entityType: "staff",
          entityLabel: name,
          details: ROLES[role]?.title || role,
        });
        toast(`Сотрудник «${name}» сохранён`);
      } else {
        state.data.staff.push({ id: uid("s"), name, email, role });
        logActivity({
          action: "staff.create",
          entityType: "staff",
          entityLabel: name,
          details: ROLES[role]?.title || role,
        });
        toast(`Сотрудник «${name}» создан. Пароль уйдёт на ${email}`);
      }
      state.editingId = null;
      state.view = "staff";
      render();
    });
  }

  /* —— Modal —— */
  function openModal(title, bodyHtml, actions) {
    el.modalTitle.textContent = title;
    el.modalBody.innerHTML = bodyHtml;
    el.modalFoot.innerHTML = "";
    actions.forEach((a) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `btn ${a.className}`;
      btn.textContent = a.label;
      btn.addEventListener("click", a.action);
      el.modalFoot.appendChild(btn);
    });
    el.modalBackdrop.classList.remove("hidden");
  }

  function closeModal() {
    el.modalBackdrop.classList.add("hidden");
    el.modalBody.innerHTML = "";
    el.modalFoot.innerHTML = "";
  }

  el.modalClose.addEventListener("click", closeModal);
  el.modalBackdrop.addEventListener("click", (e) => {
    if (e.target === el.modalBackdrop) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!el.modalBackdrop.classList.contains("hidden")) closeModal();
      else if (!el.drawer.classList.contains("hidden")) closeDrawer();
    }
  });

  function escapeAttr(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }
})();
