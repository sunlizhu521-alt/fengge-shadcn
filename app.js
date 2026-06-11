import { THEME_STORAGE_KEY, themePresets } from "./theme-presets.js";

const projectItems = [
  { module: "客户资料", linked: true, score: 96, status: "正常" },
  { module: "订单审批", linked: true, score: 88, status: "待复核" },
  { module: "字段映射", linked: false, score: 72, status: "待处理" },
  { module: "权限规则", linked: true, score: 91, status: "正常" }
];

const themeSelect = document.querySelector("#themeSelect");
const themeList = document.querySelector("#themeList");
const activeThemeName = document.querySelector("#activeThemeName");
const activeThemeTone = document.querySelector("#activeThemeTone");
const activeBaseColor = document.querySelector("#activeBaseColor");
const activeCategory = document.querySelector("#activeCategory");
const activeDensity = document.querySelector("#activeDensity");
const activeRadius = document.querySelector("#activeRadius");
const exportStyleButton = document.querySelector("#exportStyleButton");
const exportStatus = document.querySelector("#exportStatus");
const linkedCount = document.querySelector("#linkedCount");
const averageScore = document.querySelector("#averageScore");
const pendingCount = document.querySelector("#pendingCount");
const logicRows = document.querySelector("#logicRows");

const visualTokenNames = [
  "background",
  "foreground",
  "muted",
  "muted-foreground",
  "card",
  "card-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "border",
  "input",
  "ring",
  "sidebar",
  "sidebar-foreground",
  "sidebar-accent",
  "success",
  "warning",
  "danger",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "radius",
  "density",
  "shadow"
];

const visualOnlyRules = {
  allowedChangeScope: [
    "颜色",
    "圆角",
    "字体观感",
    "间距密度",
    "边框",
    "阴影",
    "浅色 / 深色视觉表现",
    "按钮、卡片、表格、输入框、侧边栏、图表的视觉状态"
  ],
  preferredFiles: [
    "app/globals.css",
    "src/app/globals.css",
    "styles/globals.css",
    "tailwind.config.ts",
    "theme-presets.ts",
    "theme-provider.tsx",
    "theme-switcher.tsx"
  ],
  forbiddenChanges: [
    "业务页面逻辑",
    "hooks 中的数据判断",
    "utils 中的业务计算",
    "services / api 请求封装",
    "API 请求参数",
    "字段映射文件",
    "权限判断函数",
    "关联判断函数",
    "筛选逻辑",
    "排序、分组、统计逻辑",
    "表单校验规则",
    "状态流转逻辑",
    "数据库结构",
    "接口返回数据处理规则"
  ]
};

function getThemeById(themeId) {
  return themePresets.find((theme) => theme.id === themeId) || themePresets[0];
}

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return getThemeById(savedTheme).id;
}

function applyTheme(themeId) {
  const theme = getThemeById(themeId);

  document.documentElement.dataset.theme = theme.id;
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);
  themeSelect.value = theme.id;
  updateThemeDetails(theme);
  updateThemeListState(theme.id);
}

function getLinkedCount(items) {
  return items.filter((item) => item.linked).length;
}

function getAverageScore(items) {
  const total = items.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / items.length);
}

function getPendingCount(items) {
  return items.filter((item) => item.status !== "正常").length;
}

function getRelationLabel(item) {
  return item.linked ? "已关联" : "未关联";
}

function getRelationTone(item) {
  return item.linked ? "success" : "danger";
}

function renderThemeOptions() {
  themeSelect.innerHTML = themePresets
    .map((theme) => `<option value="${theme.id}">${theme.label}</option>`)
    .join("");
}

function renderThemeList() {
  themeList.innerHTML = themePresets
    .map(
      (theme) => `
        <button class="style-option" type="button" data-theme-id="${theme.id}">
          <span>
            <strong>${theme.label}</strong>
            <small>${theme.category}</small>
          </span>
          <i aria-hidden="true"></i>
        </button>
      `
    )
    .join("");

  themeList.querySelectorAll(".style-option").forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.themeId));
  });
}

function updateThemeDetails(theme) {
  activeThemeName.textContent = theme.label;
  activeThemeTone.textContent = theme.tone;
  activeBaseColor.textContent = theme.baseColor;
  activeCategory.textContent = theme.category;
  activeDensity.textContent = theme.density;
  activeRadius.textContent = theme.radius;
}

function updateThemeListState(themeId) {
  themeList.querySelectorAll(".style-option").forEach((button) => {
    button.dataset.active = String(button.dataset.themeId === themeId);
  });
}

function getCurrentVisualTokens() {
  const styles = getComputedStyle(document.documentElement);

  return visualTokenNames.reduce((tokens, tokenName) => {
    tokens[`--${tokenName}`] = styles.getPropertyValue(`--${tokenName}`).trim();
    return tokens;
  }, {});
}

function buildStyleExport(theme) {
  return {
    format: "codex-shadcn-visual-style",
    version: 1,
    exportedAt: new Date().toISOString(),
    selectedStyle: {
      id: theme.id,
      label: theme.label,
      baseColor: theme.baseColor,
      category: theme.category,
      tone: theme.tone,
      radius: theme.radius,
      density: theme.density
    },
    applicationPolicy: {
      visualOnly: true,
      mustNotChangeProjectLogic: true,
      allowedChangeScope: visualOnlyRules.allowedChangeScope,
      preferredFiles: visualOnlyRules.preferredFiles,
      forbiddenChanges: visualOnlyRules.forbiddenChanges
    },
    cssVariables: {
      selector: `html[data-theme="${theme.id}"]`,
      tokens: getCurrentVisualTokens()
    },
    codexInstructions:
      "只应用本文件中的视觉 CSS 变量和风格元数据。不得修改业务逻辑、字段映射、筛选、接口请求、权限判断、关联判断、表单校验、状态流转、统计计算或数据结果。优先只修改全局样式、主题预设、主题 provider/switcher 和 Tailwind 主题配置。"
  };
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportCurrentStyle() {
  const theme = getThemeById(document.documentElement.dataset.theme);
  const payload = buildStyleExport(theme);
  const filename = `codex-shadcn-visual-style-${theme.id}.json`;

  downloadJson(filename, payload);
  exportStatus.textContent = `已导出 ${theme.label}`;
}

function renderSummary() {
  linkedCount.textContent = getLinkedCount(projectItems);
  averageScore.textContent = getAverageScore(projectItems);
  pendingCount.textContent = getPendingCount(projectItems);
}

function renderRows() {
  logicRows.innerHTML = projectItems
    .map((item) => {
      const tone = getRelationTone(item);

      return `
        <tr>
          <td>${item.module}</td>
          <td><span class="badge ${tone}">${getRelationLabel(item)}</span></td>
          <td>${item.score}</td>
          <td>${item.status}</td>
        </tr>
      `;
    })
    .join("");
}

function init() {
  renderThemeOptions();
  renderThemeList();
  renderSummary();
  renderRows();
  applyTheme(getSavedTheme());

  themeSelect.addEventListener("change", (event) => {
    applyTheme(event.target.value);
  });

  exportStyleButton.addEventListener("click", exportCurrentStyle);
}

init();
