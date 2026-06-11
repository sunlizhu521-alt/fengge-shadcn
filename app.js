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
const styleImageInput = document.querySelector("#styleImageInput");
const analysisResult = document.querySelector("#analysisResult");
const analysisImage = document.querySelector("#analysisImage");
const analysisName = document.querySelector("#analysisName");
const analysisHint = document.querySelector("#analysisHint");
const analysisPalette = document.querySelector("#analysisPalette");
const analysisMode = document.querySelector("#analysisMode");
const analysisPrimary = document.querySelector("#analysisPrimary");
const analysisBackground = document.querySelector("#analysisBackground");
const analysisCard = document.querySelector("#analysisCard");
const exportAnalyzedStyleButton = document.querySelector("#exportAnalyzedStyleButton");
const linkedCount = document.querySelector("#linkedCount");
const averageScore = document.querySelector("#averageScore");
const pendingCount = document.querySelector("#pendingCount");
const logicRows = document.querySelector("#logicRows");

let analyzedStyle = null;

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

function buildAnalyzedStyleExport(style) {
  return {
    format: "codex-shadcn-visual-style",
    version: 1,
    source: "screenshot-analysis",
    exportedAt: new Date().toISOString(),
    selectedStyle: {
      id: style.id,
      label: style.label,
      baseColor: "Screenshot",
      category: "截图解析风格",
      tone: style.tone,
      radius: "待项目确认",
      density: "待项目确认"
    },
    applicationPolicy: {
      visualOnly: true,
      mustNotChangeProjectLogic: true,
      allowedChangeScope: visualOnlyRules.allowedChangeScope,
      preferredFiles: visualOnlyRules.preferredFiles,
      forbiddenChanges: visualOnlyRules.forbiddenChanges
    },
    screenshotAnalysis: {
      mode: style.mode,
      palette: style.palette,
      note: "该结果来自浏览器端 canvas 抽样解析，应用到项目时只能作为视觉变量参考。"
    },
    cssVariables: {
      selector: `html[data-theme="${style.id}"]`,
      tokens: style.tokens
    },
    codexInstructions:
      "只应用本文件中的视觉 CSS 变量和风格元数据。不得修改业务逻辑、字段映射、筛选、接口请求、权限判断、关联判断、表单校验、状态流转、统计计算或数据结果。该文件来自截图解析，只能作为视觉风格参考。"
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

function getLuminance(color) {
  return (0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b) / 255;
}

function toHex(color) {
  return `#${[color.r, color.g, color.b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function toHsl(color) {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    if (max === g) h = (b - r) / d + 2;
    if (max === b) h = (r - g) / d + 4;

    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function quantizeColor(color) {
  const step = 24;
  return {
    r: Math.round(color.r / step) * step,
    g: Math.round(color.g / step) * step,
    b: Math.round(color.b / step) * step
  };
}

function extractPalette(image) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const maxSize = 180;
  const scale = Math.min(maxSize / image.naturalWidth, maxSize / image.naturalHeight, 1);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const colorMap = new Map();

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const pixels = context.getImageData(0, 0, width, height).data;

  for (let index = 0; index < pixels.length; index += 16) {
    if (pixels[index + 3] < 220) continue;

    const color = quantizeColor({
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2]
    });
    const key = `${color.r},${color.g},${color.b}`;
    const existing = colorMap.get(key) || { ...color, count: 0 };

    existing.count += 1;
    colorMap.set(key, existing);
  }

  return [...colorMap.values()]
    .filter((color) => color.count > 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

function pickByLuminance(palette, fallback) {
  const sorted = [...palette].sort((a, b) => getLuminance(a) - getLuminance(b));
  return {
    darkest: sorted[0] || fallback,
    lightest: sorted[sorted.length - 1] || fallback,
    middle: sorted[Math.floor(sorted.length / 2)] || fallback
  };
}

function buildAnalyzedTokens(palette) {
  const fallback = { r: 32, g: 38, b: 48 };
  const safePalette =
    palette.length > 0
      ? palette
      : [
          { r: 32, g: 38, b: 48, count: 1 },
          { r: 226, g: 232, b: 240, count: 1 },
          { r: 37, g: 99, b: 235, count: 1 }
        ];
  const { darkest, lightest, middle } = pickByLuminance(safePalette, fallback);
  const averageLuminance =
    safePalette.reduce((sum, color) => sum + getLuminance(color) * color.count, 0) /
    safePalette.reduce((sum, color) => sum + color.count, 0);
  const mode = averageLuminance < 0.48 ? "深色倾向" : "浅色倾向";
  const primary =
    palette.find((color) => {
      const lum = getLuminance(color);
      return lum > 0.24 && lum < 0.78;
    }) || middle;
  const background = mode === "深色倾向" ? darkest : lightest;
  const foreground = mode === "深色倾向" ? lightest : darkest;
  const card = mode === "深色倾向" ? middle : lightest;

  return {
    mode,
    palette: safePalette.map((color) => toHex(color)),
    tokens: {
      "--background": toHsl(background),
      "--foreground": toHsl(foreground),
      "--muted": toHsl(card),
      "--muted-foreground": toHsl(middle),
      "--card": toHsl(card),
      "--card-foreground": toHsl(foreground),
      "--primary": toHsl(primary),
      "--primary-foreground": toHsl(mode === "深色倾向" ? darkest : lightest),
      "--secondary": toHsl(middle),
      "--secondary-foreground": toHsl(foreground),
      "--accent": toHsl(primary),
      "--accent-foreground": toHsl(foreground),
      "--border": toHsl(middle),
      "--input": toHsl(middle),
      "--ring": toHsl(primary),
      "--sidebar": toHsl(mode === "深色倾向" ? darkest : middle),
      "--sidebar-foreground": toHsl(foreground),
      "--sidebar-accent": toHsl(primary),
      "--chart-1": toHsl(safePalette[0] || primary),
      "--chart-2": toHsl(safePalette[1] || middle),
      "--chart-3": toHsl(safePalette[2] || primary),
      "--chart-4": toHsl(safePalette[3] || middle),
      "--chart-5": toHsl(safePalette[4] || primary),
      "--radius": "8px",
      "--density": "1",
      "--shadow": mode === "深色倾向" ? "0 14px 34px hsl(0 0% 0% / 0.34)" : "0 14px 36px hsl(222 47% 11% / 0.08)"
    },
    primary: toHex(primary),
    background: toHex(background),
    card: toHex(card)
  };
}

function slugifyName(name) {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "analyzed-style";
}

function renderAnalysis(style) {
  analysisPalette.innerHTML = style.palette
    .map((color) => `<span title="${color}" style="--swatch:${color}"></span>`)
    .join("");
  analysisMode.textContent = style.mode;
  analysisPrimary.textContent = style.primary;
  analysisBackground.textContent = style.background;
  analysisCard.textContent = style.card;
  analysisResult.hidden = false;
  analysisHint.textContent = "请为这个解析出来的风格命名。命名后才可以导出。";
  exportAnalyzedStyleButton.disabled = true;
}

function updateAnalyzedName() {
  if (!analyzedStyle) return;

  const label = analysisName.value.trim();
  exportAnalyzedStyleButton.disabled = !label;
  analysisHint.textContent = label
    ? "命名完成，可以导出。导出文件只包含视觉风格。"
    : "请为这个解析出来的风格命名。命名后才可以导出。";
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = reject;
    image.src = url;
  });
}

async function analyzeScreenshot(file) {
  if (!file) return;

  const image = await loadImageFromFile(file);
  const previewUrl = URL.createObjectURL(file);
  const palette = extractPalette(image);
  const analysis = buildAnalyzedTokens(palette);

  analysisImage.src = previewUrl;
  analysisImage.hidden = false;
  analysisName.value = "";
  analyzedStyle = {
    id: "analyzed-style",
    label: "",
    tone: `${analysis.mode}，来自截图解析`,
    ...analysis
  };
  renderAnalysis(analyzedStyle);
}

function exportAnalyzedStyle() {
  if (!analyzedStyle || !analysisName.value.trim()) return;

  const label = analysisName.value.trim();
  const style = {
    ...analyzedStyle,
    id: slugifyName(label),
    label
  };

  downloadJson(`codex-shadcn-visual-style-${style.id}.json`, buildAnalyzedStyleExport(style));
  analysisHint.textContent = `已导出 ${label}`;
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
  styleImageInput.addEventListener("change", (event) => {
    analyzeScreenshot(event.target.files[0]);
  });
  analysisName.addEventListener("input", updateAnalyzedName);
  exportAnalyzedStyleButton.addEventListener("click", exportAnalyzedStyle);
}

init();
