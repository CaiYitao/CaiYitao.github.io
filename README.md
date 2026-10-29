# Cai Yitao — RNA Intelligence

可切换中英文的双语学术主页，使用 React、TypeScript、Vite 与 Three.js 构建。网站包含二维／三维动态 RNA 背景、研究与论文页面，以及三篇站内互动文章。主页、二级页面和三级文章分别使用“蔡”“祎”“涛”三级行书标识。

## 本地开发

```bash
npm ci
npm run dev
```

## 构建与检查

```bash
npm run lint
npm run build
npm run preview
```

`npm run build` 会先由 Vite 生成 `dist`，再自动生成：

- `dist/404.html`：GitHub Pages 的单页应用回退页，支持直接打开或刷新分页面。
- `dist/.nojekyll`：禁止 GitHub Pages 对发布文件进行 Jekyll 处理。

## 通过 Quarto 发布到 GitHub Pages

项目使用 Quarto 的 `gh-pages` 发布器，但不让 Quarto 重新渲染网站。GitHub Actions 会先构建 Vite 项目，再把现有 `dist` 发布到 `CaiYitao/CaiYitao.github.io` 的 `gh-pages` 分支。

### 首次推送

在项目根目录执行（若已经配置 `origin`，跳过添加 remote 的命令）：

```bash
git remote add origin https://github.com/CaiYitao/CaiYitao.github.io.git
git add .
git commit -m "Configure Quarto GitHub Pages publishing"
git push -u origin main
```

推送后，**Publish Quarto site** 工作流会自动运行；也可在 GitHub 的 **Actions** 页面手动运行。若远端尚无 `gh-pages` 分支，工作流会先自动初始化，再交给 Quarto 发布。

### GitHub 仓库设置

1. 在 **Settings → Actions → General → Workflow permissions** 中选择 **Read and write permissions**。
2. 第一次工作流成功创建 `gh-pages` 分支后，在 **Settings → Pages** 中选择：
   - **Source**：Deploy from a branch
   - **Branch**：`gh-pages`，目录为 `/(root)`
3. 保存后等待 GitHub Pages 部署完成。此后推送 `main` 会自动更新网站。

`_quarto.yml` 将发布目录设为 `dist`；工作流中的 `render: false` 确保 Quarto 只发布构建产物，不覆盖现有 React 页面。
