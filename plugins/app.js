const state = {
  tabs: [],
  activeUrl: ""
};

const menuTree = document.getElementById("menuTree");
const workTabs = document.getElementById("workTabs");
const frame = document.getElementById("pageFrame");
const pageTitle = document.getElementById("pageTitle");

const DEFAULT_MENU = [
  {
    title: "后台端-会员中心",
    icon: "▤",
    children: [
      { title: "会员信息管理", url: "files/member-info.html" },
      { title: "会员实名审核", url: "files/member-audit.html" },
      { title: "会员等级管理", url: "files/member-level.html" },
      { title: "会员注销管理", url: "files/member-cancel.html" },
      { title: "会员变更日志管理", url: "files/member-change-log.html" }
    ]
  },
  {
    title: "后台端-积分中心",
    icon: "▧",
    children: [
      { title: "积分账户管理", url: "files/points-account.html" },
      { title: "积分账户审核管理", url: "files/points-account-audit.html" },
      { title: "积分明细查询", url: "files/points-detail.html" },
      { title: "积分互换查询", url: "files/points-exchange-query.html" }
    ]
  },
  {
    title: "后台端-权益中心",
    icon: "▨",
    children: [
      { title: "权益管理", url: "files/benefits-manage.html" },
      { title: "商品管理", url: "files/product-manage.html" },
      { title: "优惠券管理", url: "files/coupon-manage.html" },
      { title: "优惠券核销管理", url: "files/coupon-writeoff.html" }
    ]
  },
  {
    title: "后台端-清结算管理",
    icon: "▩",
    children: [
      { title: "积分日清报表", url: "files/settlement-points-daily-report.html" },
      { title: "过期积分统计报表", url: "files/settlement-points-expire-report.html" },
      { title: "积分兑分月结报表", url: "files/settlement-points-monthly-report.html" },
      { title: "优惠券结算报表", url: "files/settlement-coupon-report.html" }
    ]
  },
  {
    title: "后台端-风控管理",
    icon: "▣",
    children: [
      { title: "风控规则管理", url: "files/risk-rule.html" },
      { title: "发分主体风控", url: "files/risk-issuer.html" },
      { title: "风控预警中心", url: "files/risk-warning-center.html" },
      { title: "风控预警报表", url: "files/risk-warning-report.html" }
    ]
  },
  {
    title: "后台端-营销管理",
    icon: "▤",
    children: [
      { title: "营销管理", url: "files/marketing-manage.html" }
    ]
  },
  {
    title: "会员报表",
    icon: "▥",
    children: [
      { title: "会员新增/注销报表", url: "files/member-report-growth.html" },
      { title: "会员增长分析报表", url: "files/member-report-analysis.html" },
      { title: "积分发分统计表", url: "files/points-issue-stat-report.html" },
      { title: "积分兑存报表", url: "files/points-balance-flow-report.html" },
      { title: "积分本场兑分报表", url: "files/points-local-exchange-report.html" },
      { title: "优惠券发放报表", url: "files/coupon-issue-report.html" },
      { title: "优惠券效果分析报表", url: "files/coupon-effect-report.html" }
    ]
  },
  {
    title: "C端-小程序端",
    icon: "▦",
    children: [
      { title: "手机授权登录", url: "files/mini-login.html" },
      { title: "会员中心", url: "files/mini-member.html" },
      { title: "积分中心", url: "files/mini-points.html" },
      { title: "权益中心", url: "files/mini-benefits.html" },
      { title: "优惠券管理", url: "files/mini-coupons.html" },
      { title: "通知中心", url: "files/mini-notifications.html" }
    ]
  },
  {
    title: "后台端-客户数据管理",
    icon: "▥",
    children: [
      { title: "客户标签管理", url: "files/cdp-tags.html" },
      { title: "标签使用报表", url: "files/cdp-tag-usage-report.html" },
      { title: "人群管理", url: "files/cdp-profile.html" },
      { title: "客户画像", url: "files/cdp-customer-insight.html" },
      { title: "数据API管理", url: "files/cdp-api-management.html" },
      { title: "客户行为分析", url: "files/cdp-behavior.html" },
      { title: "客户满意度管理", url: "files/cdp-satisfaction.html" }
    ]
  },
  {
    title: "后台端-系统管理",
    icon: "▫",
    children: [
      { title: "用户管理", url: "files/system-user.html" },
      { title: "角色管理", url: "files/system-role.html" },
      { title: "操作日志", url: "files/system-log.html" },
      { title: "参数配置", url: "files/system-parameter.html" },
      { title: "脱敏管理", url: "files/system-desensitize.html" }
    ]
  }
];

function keyOf(item) {
  return item.url;
}

function renderTabs() {
  workTabs.innerHTML = state.tabs.map(tab => `
    <button class="work-tab ${tab.url === state.activeUrl ? "active" : ""}" data-tab="${tab.url}" type="button">
      <span>${tab.title}</span>
      ${tab.locked ? "" : `<span class="close" data-close="${tab.url}">×</span>`}
    </button>
  `).join("");
}

function setActiveMenu(url) {
  document.querySelectorAll(".menu-child").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.url === url);
  });
}

function openTab(item) {
  const url = keyOf(item);
  if (!state.tabs.some(tab => tab.url === url)) {
    state.tabs.push({ title: item.title, url, locked: false });
  }
  state.activeUrl = url;
  frame.src = url;
  pageTitle.textContent = item.title;
  setActiveMenu(url);
  renderTabs();
}

window.openTab = openTab;

function closeTab(url) {
  const index = state.tabs.findIndex(tab => tab.url === url);
  if (index < 0 || state.tabs[index].locked) return;
  state.tabs.splice(index, 1);
  if (state.activeUrl === url) {
    const next = state.tabs[index] || state.tabs[index - 1] || state.tabs[0];
    if (next) {
      state.activeUrl = next.url;
      frame.src = next.url;
      pageTitle.textContent = next.title;
      setActiveMenu(next.url);
    }
  }
  renderTabs();
}

function renderMenu(data) {
  menuTree.innerHTML = data.map(section => `
    <div class="menu-section">
      <button class="menu-parent" type="button">
        <span class="left">${section.icon} ${section.title}</span>
        <span class="arrow">⌃</span>
      </button>
      <div class="submenu">
        ${section.children.map(child => `
          <button class="menu-child" type="button" data-title="${child.title}" data-url="${child.url}">
            ${child.title}
          </button>
        `).join("")}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".menu-parent").forEach(btn => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".menu-section");
      section.classList.toggle("collapsed");
      btn.querySelector(".arrow").textContent = section.classList.contains("collapsed") ? "⌄" : "⌃";
    });
  });

  document.querySelectorAll(".menu-child").forEach(btn => {
    btn.addEventListener("click", () => openTab({ title: btn.dataset.title, url: btn.dataset.url }));
  });
}

workTabs.addEventListener("click", event => {
  const close = event.target.closest("[data-close]");
  if (close) {
    event.stopPropagation();
    closeTab(close.dataset.close);
    return;
  }
  const tab = event.target.closest("[data-tab]");
  if (!tab) return;
  const item = state.tabs.find(entry => entry.url === tab.dataset.tab);
  if (item) openTab(item);
});

function boot(data) {
  renderMenu(data);
  const first = data.flatMap(section => section.children).find(child => child.url === "files/member-audit.html") || data[0].children[0];
  state.tabs = [{ title: first.title, url: first.url, locked: true }];
  openTab(first);
}

fetch("data/menu.json")
  .then(response => {
    if (!response.ok) throw new Error("menu json unavailable");
    return response.json();
  })
  .then(boot)
  .catch(() => boot(DEFAULT_MENU));
