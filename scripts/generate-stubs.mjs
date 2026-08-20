import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, 'docs/.vitepress/catalog.json'), 'utf8'),
)

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents, 'utf8')
}

for (const cat of catalog.categories) {
  const list = catalog.services.filter((s) => s.category === cat.id)
  const items = list
    .map(
      (s) =>
        `- [${s.name}](/${cat.id}/${s.slug}/)${s.featured ? '（详解）' : ''}：${s.description}`,
    )
    .join('\n')
  writeFile(
    path.join(root, 'docs', cat.id, 'index.md'),
    `---
title: ${cat.name} Docker Compose 清单
description: ${cat.summary}。按服务查看用途和编排目录。
keywords: Docker Compose, ${cat.name}, 一键部署
---

# ${cat.name}

${cat.summary}。标了「详解」的页面有完整讲解，其余先给用途和本地目录。

${items}
`,
  )
}

for (const s of catalog.services) {
  if (s.featured) continue
  const versions =
    s.versions && s.versions.length
      ? s.versions.map((v) => `- \`${v}\``).join('\n')
      : '- 见源码目录中的版本子文件夹'
  writeFile(
    path.join(root, 'docs', s.category, `${s.slug}.md`),
    `---
title: ${s.title}
description: ${s.description}
keywords: ${s.keywords || `${s.name}, Docker Compose`}
---

# ${s.name}

${s.description}

## 什么时候用

本地或测试环境需要快速拉起 **${s.name}** 时，直接用仓库对应目录，避免在本机手工安装。生产环境请另做高可用、备份和安全加固，不要原样照搬默认密码。

## 仓库里有哪些版本

${versions}

## 启动

进入编排仓库的 \`${s.giteePath}\` 目录，阅读其中的 \`run.md\`，一般是：

\`\`\`shell
docker compose -f docker-compose.yml -p ${s.slug} up -d
\`\`\`

部分目录的编排文件名不是 \`docker-compose.yml\`，以该目录实际文件为准。

## 目录

编排文件在 \`${s.giteePath}\`。

> 完整章节（配置拆解、端口账号、常见坑）将按 MySQL / Redis 等同模板补齐。
`,
  )
}

console.log(
  `generated ${catalog.categories.length} category indexes, ${catalog.services.filter((s) => !s.featured).length} stub pages`,
)
