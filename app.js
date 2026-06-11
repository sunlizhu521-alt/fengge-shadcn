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
const linkedCount = document.querySelector("#linkedCount");
const averageScore = document.querySelector("#averageScore");
const pendingCount = document.querySelector("#pendingCount");
const logicRows = document.querySelector("#logicRows");

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
}

init();
