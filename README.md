# Ops Docs

Docker Compose 中间件手册：说明每个编排做什么、何时用、怎么跑。

线上地址：https://ops.zhizili.com

## 本地预览

需要 Node.js 20+ 和 pnpm。

```shell
cd ops-docs
pnpm install
pnpm gen:stubs
pnpm dev
```

浏览器打开 `http://localhost:5173/`。

```shell
pnpm build
pnpm preview
```

## 写文档

- 服务清单：[`docs/.vitepress/catalog.json`](docs/.vitepress/catalog.json)
- 站点域名：[`docs/.vitepress/site.ts`](docs/.vitepress/site.ts)
- 「详解」页手写 Markdown（如 `docs/database/mysql.md`），并在 catalog 里设 `"featured": true`
- 其余服务：`pnpm gen:stubs` 生成索引卡（会覆盖非 featured 的 `.md`，不要在 stub 里手写长期内容）

每页请填写 `title`、`description`（约 80–120 字），便于搜索引擎和分享卡片。

## 部署到 Cloudflare Pages

账号 `4565be562a022ff9b31775df002f1169`，域名挂在 `zhizili.com` 下，站点用子域 **ops.zhizili.com**。

### 控制台（推荐，连 Git 后自动发）

1. 打开 [Cloudflare Dashboard · zhizili.com](https://dash.cloudflare.com/4565be562a022ff9b31775df002f1169/zhizili.com)
2. 左侧 **Workers 和 Pages** → **创建** → **Pages** → 连接本仓库
3. 构建设置：
   - 框架预设：无 / Vite
   - 构建命令：`pnpm install && pnpm gen:stubs && pnpm build`
   - 构建输出目录：`docs/.vitepress/dist`
   - Node 版本：`20`
4. 项目名填 `ops-docs`
5. 部署完成后：**自定义域** → 添加 `ops.zhizili.com`（会在 `zhizili.com` 区自动加 CNAME）

不要打开 Cloudflare 的 HTML Auto Minify，否则 Vue 注释被去掉会水合失败。

### 本机直接上传

在 Cloudflare 创建 API Token（权限：`Account` → `Cloudflare Pages` → `Edit`），然后：

```shell
npx wrangler pages project create ops-docs
npx wrangler pages deploy docs/.vitepress/dist --project-name=ops-docs
```

或 `pnpm deploy`（需已登录 wrangler）。

CI 推送 `main` / `master` 也会发版，需在仓库 Secrets 里配置 `CLOUDFLARE_API_TOKEN`。若已用控制台「连接 Git」，可关掉 GitHub Actions，避免发两遍。

若要挂到根域 `zhizili.com`，在 Pages 自定义域再加一条，并把 `docs/.vitepress/site.ts` 的 `hostname`、`docs/public/robots.txt` 改成对应地址。

## 版权

编排 YAML 与原 `run.md` 来自上游 MIT 仓库。本站讲解文案为原创；引用的配置片段均标明本地目录路径。
