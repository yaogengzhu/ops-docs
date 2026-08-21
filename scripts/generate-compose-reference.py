"""Generate a per-Compose configuration reference from the upstream repository.

Usage:
    python scripts/generate-compose-reference.py ../docker-compose

The generated page is committed so the documentation site does not need the
upstream repository at build time.
"""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from typing import Any

import yaml


ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "docs" / ".vitepress" / "catalog.json"
OUTPUT = ROOT / "docs" / "guide" / "compose-config-reference.md"
COMPOSE_NAME = re.compile(r"(?i)(?:docker-)?compose.*\.ya?ml$")
SECRET_NAME = re.compile(r"(?i)(password|passwd|secret|token|credential|access.?key|private.?key)")


def inline(value: Any) -> str:
    if value is None:
        return "（空）"
    if isinstance(value, bool):
        return str(value).lower()
    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return str(value).replace("`", "\\`").replace("\n", " ")


def env_items(value: Any) -> list[tuple[str, str]]:
    if isinstance(value, dict):
        return [(str(k), inline(v)) for k, v in value.items()]
    result: list[tuple[str, str]] = []
    for item in value or []:
        text = inline(item)
        key, sep, val = text.partition("=")
        result.append((key, val if sep else "继承宿主机环境变量"))
    return result


def variable_note(value: str) -> str:
    required = re.findall(r"\$\{([A-Za-z_][A-Za-z0-9_]*)(?::?\?[^}]*)?\}", value)
    defaults = re.findall(r"\$\{([A-Za-z_][A-Za-z0-9_]*):-([^}]*)\}", value)
    if defaults:
        return "；可由 .env 覆盖：" + "、".join(f"{k}（默认 {v}）" for k, v in defaults)
    if required:
        return "；启动前需提供：" + "、".join(required)
    return ""


def list_line(label: str, values: Any) -> str | None:
    if not values:
        return None
    if isinstance(values, dict):
        rendered = [f"{k}={inline(v)}" for k, v in values.items()]
    elif isinstance(values, list):
        rendered = [inline(v) for v in values]
    else:
        rendered = [inline(values)]
    return f"- {label}：" + "；".join(f"`{v}`" for v in rendered)


def service_lines(name: str, service: dict[str, Any]) -> list[str]:
    lines = [f"**{name}**"]
    image = inline(service.get("image", "由 build 构建" if service.get("build") else "未声明"))
    lines.append(f"- 镜像：`{image}`{variable_note(image)}")
    for label, key in (
        ("端口", "ports"),
        ("数据与配置挂载", "volumes"),
        ("依赖服务", "depends_on"),
        ("配置文件", "configs"),
        ("密钥文件", "secrets"),
        ("额外主机映射", "extra_hosts"),
        ("暴露但不映射到宿主机", "expose"),
    ):
        line = list_line(label, service.get(key))
        if line:
            lines.append(line)

    env = env_items(service.get("environment"))
    if env:
        rendered = []
        for key, value in env:
            display = value
            if SECRET_NAME.search(key) and not value.startswith("${"):
                display += "（示例凭据，部署前修改）"
            rendered.append(f"`{key}={display}`{variable_note(value)}")
        lines.append("- 环境变量：" + "；".join(rendered))

    env_files = service.get("env_file")
    line = list_line("环境变量文件（需存在）", env_files)
    if line:
        lines.append(line)

    command = service.get("command")
    if command:
        lines.append(f"- 启动参数：`{inline(command)}`")

    risks = []
    if service.get("privileged"):
        risks.append("启用了 privileged")
    if service.get("network_mode") == "host":
        risks.append("使用宿主机网络，端口不再隔离")
    if service.get("pid") == "host":
        risks.append("共享宿主机 PID")
    if service.get("user") in ("0", 0, "root"):
        risks.append("以 root 运行")
    if service.get("cap_add"):
        risks.append("增加 Linux capabilities：" + inline(service["cap_add"]))
    if risks:
        lines.append("- 权限与网络：" + "；".join(risks))
    return lines


def compose_files(base: Path) -> list[Path]:
    return sorted(
        (p for p in base.rglob("*") if p.is_file() and COMPOSE_NAME.match(p.name)),
        key=lambda p: p.as_posix().lower(),
    )


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python scripts/generate-compose-reference.py <upstream-compose-dir>")
    upstream = Path(sys.argv[1]).resolve()
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    lines = [
        "---",
        "title: 每份 Compose 的配置清单",
        "description: 逐文件整理配套仓库中每份 Docker Compose 的镜像、端口、环境变量、挂载、服务依赖和高权限设置，便于启动前逐项核对。",
        "keywords: Docker Compose, 配置清单, 环境变量, 端口, 数据卷",
        "---",
        "",
        "# 每份 Compose 的配置清单",
        "",
        "本页从上游 Compose YAML 静态生成。它回答“启动这份编排要核对什么”，不把示例密码当成生产建议。相对路径均以该 Compose 文件所在目录为基准。",
        "",
        "## 怎么判断必填",
        "",
        "- `${VAR}` 或 `${VAR?提示}`：必须通过 shell 或 `.env` 提供。`${VAR:-default}` 有默认值，可按环境覆盖。",
        "- `./宿主机路径:/容器路径`：确认宿主机路径存在、文件类型正确且容器用户可读写。首次启动会自动创建目录，但把缺失的配置文件误建成目录会导致启动失败。",
        "- 明文密码是上游示例值；对外开放或长期运行前必须修改。已有数据卷初始化后，单纯修改环境变量通常不会重置数据库密码。",
        "- `depends_on` 只控制启动次序；未配健康检查时，不代表依赖服务已经可用。",
        "",
    ]

    total = 0
    for category in catalog["categories"]:
        services = [s for s in catalog["services"] if s["category"] == category["id"]]
        lines.extend([f"## {category['name']}", ""])
        for entry in services:
            base = upstream / Path(entry["giteePath"])
            files = compose_files(base) if base.exists() else []
            lines.extend([f"### {entry['name']}", ""])
            if not files:
                lines.extend([f"> 未在 `{entry['giteePath']}` 找到 Compose YAML。", ""])
                continue
            for file in files:
                total += 1
                relative = file.relative_to(upstream).as_posix()
                lines.extend([f"#### `{relative}`", ""])
                try:
                    data = yaml.safe_load(file.read_text(encoding="utf-8-sig")) or {}
                except Exception as exc:  # keep the rest of the reference useful
                    lines.extend([f"> YAML 解析失败：{inline(exc)}", ""])
                    continue
                services_data = data.get("services", {})
                if not isinstance(services_data, dict) or not services_data:
                    lines.extend(["> 文件没有可识别的 `services`。", ""])
                    continue
                for service_name, service in services_data.items():
                    if not isinstance(service, dict):
                        continue
                    lines.extend(service_lines(str(service_name), service))
                    lines.append("")
                networks = data.get("networks")
                volumes = data.get("volumes")
                if networks:
                    lines.extend([list_line("顶层网络", networks) or "", ""])
                if volumes:
                    lines.extend([list_line("顶层命名卷", volumes) or "", ""])

    lines.extend(["---", "", f"共分析 **{total}** 份 Compose 文件。生成命令：`python scripts/generate-compose-reference.py <上游仓库目录>`。", ""])
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"generated {OUTPUT} ({total} compose files)")


if __name__ == "__main__":
    main()
