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

## 部署到 Cloudflare Workers

账号 `4565be562a022ff9b31775df002f1169`，域名挂在 `zhizili.com` 下，站点用子域 **ops.zhizili.com**。

### 控制台（推荐，连 Git 后自动发）

1. 打开 [Cloudflare Dashboard · zhizili.com](https://dash.cloudflare.com/4565be562a022ff9b31775df002f1169/zhizili.com)
2. 左侧 **Workers 和 Pages** → **创建** → 导入现有 Git 仓库
3. 构建设置：
   - 构建命令：`pnpm run build`
   - 部署命令：`npx wrangler deploy`
   - 非生产分支部署命令：`npx wrangler versions upload`
   - 根目录：`/`
4. 项目名填 `ops-docs`
5. `wrangler.toml` 已声明自定义域 `ops.zhizili.com`，部署时 Cloudflare 会自动创建 DNS 记录和证书

不要打开 Cloudflare 的 HTML Auto Minify，否则 Vue 注释被去掉会水合失败。

### 本机直接上传

先登录 Wrangler：

```shell
npx wrangler login
pnpm deploy
```

控制台连接 Git 后，推送 `master` 会自动构建并部署，无需另配 GitHub Actions。

若要挂到根域 `zhizili.com`，在 Worker 的域和路由中添加自定义域，并把 `docs/.vitepress/site.ts` 的 `hostname`、`docs/public/robots.txt` 改成对应地址。

## 版权

编排 YAML 与原 `run.md` 来自上游 MIT 仓库。本站讲解文案为原创；引用的配置片段均标明本地目录路径。
