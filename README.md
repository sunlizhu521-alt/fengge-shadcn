# shadcn 风格选择器

这是一个可直接运行的 shadcn/ui 风格选择器，用来固定以下做法：

- 首页提供多风格切换
- 主题通过 CSS 变量和 `data-theme` 切换
- 主题选择保存到 `localStorage`
- 预览按钮、表单、卡片、侧边栏、图表和表格
- 业务判断逻辑与主题逻辑分离
- 换主题不改变任何数据结果、关联判断或计算逻辑

## 当前风格

```txt
Neutral 专业
Zinc SaaS
Stone 管理
Mauve Studio
Olive 流程
Mist 看板
Taupe Desk
蓝色指挥台
紧凑表格
深色专注
```

其中 `Neutral`、`Zinc`、`Stone`、`Mauve`、`Olive`、`Mist`、`Taupe` 对应 shadcn/ui 官方基础色方向。

## 文件说明

```txt
index.html         // 首页结构和组件预览区域
styles.css         // 全局设计变量、主题预设和组件样式
theme-presets.js   // 风格清单和风格元数据
app.js             // 主题切换、渲染和示例业务逻辑
server.mjs         // 本地静态服务
```

## 使用方式

启动本地静态服务：

```bash
npm.cmd run dev
```

然后在浏览器打开：

```txt
http://127.0.0.1:4179
```

检查脚本语法：

```bash
npm.cmd run check
```

## 迁移到 shadcn / Next.js

可以对应拆成：

```txt
lib/theme-presets.ts
components/theme-provider.tsx
components/theme-switcher.tsx
components/style-preview.tsx
app/globals.css
```

## 关键边界

主题切换函数只允许做类似操作：

```txt
设置 data-theme
保存 localStorage
更新主题控件选中状态
更新风格说明文本
```

业务逻辑应保留在独立函数中，不允许放进主题切换函数。

例如：

```txt
关联判断
字段映射
筛选条件
统计计算
接口参数
权限规则
表单校验
```

以上逻辑都不能因为主题改变而改变。
