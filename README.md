# Ops Docs

Docker Compose 中间件手册：说明每个编排做什么、何时用、怎么跑。

## 本地预览

需要 Node.js 20+ 和 pnpm。

```shell
cd ops-docs
pnpm install
pnpm gen:stubs
pnpm dev
```

浏览器打开 `http://localhost:5173/ops-docs/`。

```shell
pnpm build
pnpm preview
```

## 写文档

- 服务清单：[`docs/.vitepress/catalog.json`](docs/.vitepress/catalog.json)
- 站点域名与路径前缀：[`docs/.vitepress/site.ts`](docs/.vitepress/site.ts)
- 「详解」页手写 Markdown（如 `docs/database/mysql.md`），并在 catalog 里设 `"featured": true`
- 其余服务：`pnpm gen:stubs` 生成索引卡（会覆盖非 featured 的 `.md`，不要在 stub 里手写长期内容）

每页请填写 `title`、`description`（约 80–120 字），便于搜索引擎和分享卡片。

## 部署

推送 `main` / `master` 后由 CI 构建静态站点。自定义域名时把 `site.ts` 里的 `base` 改成 `'/'`，并同步改 `docs/public/robots.txt` 里的 Sitemap。

## 版权

编排 YAML 与原 `run.md` 来自上游 MIT 仓库。本站讲解文案为原创；引用的配置片段均标明本地目录路径。
