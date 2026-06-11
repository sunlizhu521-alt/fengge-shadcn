# shadcn 风格选择器

这是一个可直接运行的 shadcn/ui 风格选择器，用来固定以下做法：

- 首页提供多风格切换
- 主题通过 CSS 变量和 `data-theme` 切换
- 主题选择保存到 `localStorage`
- 预览按钮、表单、卡片、侧边栏、图表和表格
- 上传截图并解析视觉风格
- 提醒为解析风格命名后再导出
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

## 导出风格文件

页面中选择风格后，点击：

```txt
导出当前风格
```

会下载一个类似这样的文件：

```txt
codex-shadcn-visual-style-dark-focus.json
```

这个文件是给 Codex 使用的视觉风格说明，只包含：

```txt
风格名称
基础色方向
适用场景
CSS 视觉变量
允许修改的主题文件范围
禁止修改的项目逻辑清单
```

这个文件不包含，也不允许用于修改：

```txt
业务页面逻辑
hooks 中的数据判断
utils 中的业务计算
services / api 请求封装
API 请求参数
字段映射文件
权限判断函数
关联判断函数
筛选逻辑
排序、分组、统计逻辑
表单校验规则
状态流转逻辑
数据库结构
接口返回数据处理规则
```

以后要让 Codex 应用某个风格时，把导出的 JSON 文件交给 Codex，并说明：

```txt
只应用这个文件里的视觉风格，不修改任何项目逻辑。
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

## 截图解析风格

如果看到喜欢的页面风格，可以在页面的：

```txt
截图解析风格
```

区域上传截图。浏览器会在本地用 `canvas` 抽样解析图片颜色，并生成：

```txt
明暗倾向
主色
背景色
卡片色
色板
```

解析后必须填写：

```txt
风格命名
```

命名后才能点击：

```txt
导出解析风格
```

导出的文件仍然是 `codex-shadcn-visual-style` 格式，并且仍然只允许 Codex 应用视觉风格，不能修改任何项目逻辑。

截图解析结果只作为视觉参考，不代表精确复刻原页面设计。
