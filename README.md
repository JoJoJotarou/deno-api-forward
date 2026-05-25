# deno-api-forward

API forward proxy running on Deno Deploy.

## URL Format

```
https://YOUR-DOMAIN/{target_host}/{path}
```

Example:

```
curl https://api-forward.deno.dev/api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Deploy

1. Go to [console.deno.com](https://console.deno.com) → Create App → 选择 GitHub
   仓库
2. Build 设置：entrypoint = `main.ts`
3. 在 Settings → Environment Variables 添加：

```
ALLOWED_DOMAINS=api.openai.com,api.anthropic.com,generativelanguage.googleapis.com,api.mistral.ai,api.groq.com,api.x.ai,api.github.com,github.com,registry-1.docker.io,auth.docker.io
```

4. Push 到 master 自动部署，也可在 Dashboard 手动触发 Build

## Environment Variables

| Variable          | Description                                                                         |
| ----------------- | ----------------------------------------------------------------------------------- |
| `ALLOWED_DOMAINS` | Comma-separated list of allowed target domains. Empty or unset = allow all domains. |

## Local Dev

```bash
cp .env.example .env    # edit as needed
deno task dev
```
