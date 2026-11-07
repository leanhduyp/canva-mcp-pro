# ========================================================
# Canva MCP Pro (v3.2.0 Enterprise Production Dockerfile)
# Multi-stage, Hardened, Non-root (UID 10001), Minimal Surface
# ========================================================

# Stage 1: Build & Compile TypeScript
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Stage 2: Hardened Production Runtime
FROM python:3.11-slim-bookworm AS runner

# Install Node.js 20 & Enterprise Rendering Tools (LibreOffice, Poppler, Fonts)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg \
    libreoffice-impress \
    poppler-utils \
    fonts-roboto \
    fonts-noto-core \
    fonts-dejavu-core \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python PPTX & PIL dependencies
RUN python -m pip install --no-cache-dir --upgrade pip && \
    python -m pip install --no-cache-dir python-pptx Pillow

WORKDIR /app

# Create unprivileged application user & group
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -m -s /bin/bash appuser

# Copy production dependencies & built assets
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY manifest.json skills.json LICENSE README.md ./
COPY skills/ ./skills/
COPY .well-known/ ./.well-known/

# Create safe temporary directory structure
RUN mkdir -p /tmp/canva-mcp-pro && \
    chown -R appuser:appgroup /app /tmp/canva-mcp-pro

USER appuser

# Environment Guardrails Defaults
ENV NODE_ENV=production
ENV CANVA_MCP_EXECUTION_MODE=declarative_json_only
ENV CANVA_MCP_FORCE_COMMENT_PREVIEW=true
ENV CANVA_MCP_TMP_TTL_SECONDS=900
ENV CANVA_MCP_MAX_WORKSPACE_MB=50

ENTRYPOINT ["node", "dist/index.js"]
