# 🚀 Canva MCP Pro (v3.2 Enterprise Production)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Spec%20v2%20Annotations-purple.svg)](https://modelcontextprotocol.io/)
[![A2A Protocol](https://img.shields.io/badge/A2A-Agent%20Card%20v0.2-blueviolet.svg)](.well-known/agent.json)
[![skills.sh](https://img.shields.io/badge/skills.sh-Compatible-black.svg)](skills.json)
[![Security](https://img.shields.io/badge/Security-Zero--RCE%20%7C%20VN%20PII%20%7C%20Prompt%20Guard-green.svg)](#-enterprise-production-guardrails-v32)
[![Evaluations](https://img.shields.io/badge/Evals-63%2F63%20(100%25)-success.svg)](scripts/run_evals.js)
[![Docker](https://img.shields.io/badge/Docker-Hardened%20Non--Root-blue.svg)](Dockerfile)

**Canva MCP Pro** is an open-source, enterprise-grade [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for autonomous AI presentation generation. It bridges **high-fidelity local vector rendering (offline Python-pptx & PIL)** with **two-way cloud synchronization (Canva Connect REST API)**, enforced by the **Taste-Skill Anti-Slop aesthetic system** and hardened for enterprise production environments.

---

## 🌟 Key Innovations

- **Dual-Engine Hybrid Architecture:**
  - **Local Vector Engine (100% Offline & Air-gapped):** Generates standalone, pixel-perfect 16:9 widescreen PowerPoint decks (`.pptx`) with zero dependency on third-party templates.
  - **Canva Cloud Connect Engine:** Full two-way synchronization with Canva Cloud REST API (`api.canva.com/rest/v1`), managing assets, brand kits, and real-time comment feedback loops.
- **Zero-RCE Declarative Layout Engine (`canva_execute_layout_script`):**
  - Production-default `CANVA_MCP_EXECUTION_MODE=declarative_json_only` eliminates arbitrary code execution entirely.
  - Development sandboxing backed by strict AST/Token blocking (denies dunder `__`, reflection, globals, compilation, network tokens, and hex/unicode escapes).
- **Multi-Layer Prompt Injection & Tag Breakout Neutralization:**
  - Strict NFKC Unicode normalization and Zero-Width character stripping.
  - Neutralizes closing tag breakout patterns (`</untrusted_user_comment>`) and bilingual jailbreak prompts in both English and Vietnamese.
- **Enterprise Vietnam & Global PII Redactor:**
  - Masks Vietnamese Citizen IDs (CCCD 12 digits), Enterprise Tax Codes (MST 10/13 digits), Vietnamese mobile phone carriers (03x–09x), JWT Bearer tokens, API keys, internal RFC 1918 IPs, and database URIs.
- **Workspace Lifecycle & Anti-DoS:**
  - Automatic TTL expiration (`CANVA_MCP_TMP_TTL_SECONDS=900`) and disk quota cap (`CANVA_MCP_MAX_WORKSPACE_MB=50`).
  - Isolated multi-tenant directory scoping with POSIX `0700` permission lockdown.
- **Taste-Skill Anti-Slop System:**
  - Automated copy audit against generic AI buzzwords (*revolutionary, game-changing, delve, tapestry*).
  - Enforced typography floor: All body text strictly $\ge 24\text{ pt}$ (and $\ge 14\text{ pt}$ for dense numerical matrices) to prevent text overflow and maximize room visibility.
  - Integrated 57 curated design palettes (`corporate-navy`, `cool-white-slate`, `minimal-dark`, etc.).
- **Production Containerization:**
  - Multi-stage hardened Docker image running as unprivileged user `appuser` (UID 10001), read-only root filesystem, tmpfs `/tmp`, and pre-installed LibreOffice vector preview engine with Vietnamese fonts.

---

## 📐 Architecture Overview

```
               ┌─────────────────────────────────────────────────────┐
               │         Antigravity IDE / Claude Desktop / Cursor   │
               │         4 Agentic Skills (canva-deck-builder, etc.) │
               └──────────────────────────┬──────────────────────────┘
                                          │ stdio / JSON-RPC 2.0
               ┌──────────────────────────▼──────────────────────────┐
               │             Canva MCP Pro Server v3.0               │
               │   ┌───────────────┬─────────────────────────────┐   │
               │   │ Visual Tools  │ Connect Tools & Cloud Loop  │   │
               │   │ (5 Tools)     │ (8 Tools)                   │   │
               │   ├───────────────┼─────────────────────────────┤   │
               │   │ Taste Tools   │ Local Code Sandbox          │   │
               │   │ (8 Tools)     │ (Python / JavaScript)       │   │
               │   └───────────────┴─────────────────────────────┘   │
               └──────────────┬───────────────────────┬──────────────┘
                              │                       │
               ┌──────────────▼──────┐ ┌──────────────▼──────────────┐
               │ Local Python Engine │ │ Canva Connect REST API      │
               │ (100% Offline PPTX) │ │ (api.canva.com/rest/v1)     │
               └──────────────┬──────┘ └──────────────┬──────────────┘
                              │                       │
               ┌──────────────▼──────┐ ┌──────────────▼──────────────┐
               │ .pptx Presentations │ │ Canva Cloud Designs,        │
               │ High-Res PNG Previews│ │ Comments & Cloud Present    │
               └─────────────────────┘ └─────────────────────────────┘
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** $\ge 18.0.0$
- **Python** $\ge 3.10$ with `python-pptx` and `Pillow`:
  ```bash
  pip install python-pptx Pillow
  ```

### Installation

```bash
# Clone the repository
git clone https://github.com/leanhduyp/canva-mcp-pro.git
cd canva-mcp-pro

# Install dependencies and build
npm install
npm run build

# Run environment diagnostics
npm run diagnose
```

---

## 🔧 Client Configuration

### 1. Antigravity IDE (`mcp_config.json`)
```json
{
  "mcpServers": {
    "canva-mcp-pro": {
      "command": "node",
      "args": ["<PATH_TO_CANVA_MCP_PRO>/dist/index.js"],
      "env": {
        "CANVA_ACCESS_TOKEN": "YOUR_OPTIONAL_CANVA_TOKEN"
      }
    }
  }
}
```

### 2. Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "canva-mcp-pro": {
      "command": "node",
      "args": ["/absolute/path/to/canva-mcp-pro/dist/index.js"]
    }
  }
}
```
*Or simply drag and drop the `release/canva-mcp-pro.mcpb` bundle directly into Claude Desktop Settings!*

---

## 🧰 MCP Tool Catalog (21 Tools)

| # | Tool Name | Group | Functionality |
| :---: | :--- | :---: | :--- |
| **1** | `canva_add_kpi_dashboard` | Visual | Hero Metrics $56\text{ pt}$, state tags, diagnostic insight boxes $\ge 24\text{ pt}$. |
| **2** | `canva_add_card_comparison` | Visual | 4–5 scenario comparison columns with highlighted hero border. |
| **3** | `canva_add_split_architecture` | Visual | Dual-panel parallel architecture stream + bottom takeaway banner. |
| **4** | `canva_generate_deck_from_data` | Visual | Ingests raw CSV/JSON, auto-selects best layout, and outputs a complete deck. |
| **5** | `canva_execute_layout_script` | Visual | Local code sandbox (Python/JS) for batch vector math and coordinate calculation. |
| **6** | `canva_get_design_info` | Connect | Fetches Canva Cloud design metadata (id, title, page count, URLs). |
| **7** | `canva_list_workspace_designs` | Connect | Searches and lists presentations in the user's Canva Workspace. |
| **8** | `canva_export_presentation_deck` | Connect | Exports Canva presentation to PPTX, PDF, PNG, or JPG. |
| **9** | `canva_sync_to_cloud` | Connect | Synchronizes local deck state with Canva Cloud, generating present mode URL. |
| **10** | `canva_upload_asset` | Connect | Uploads images to Canva Enterprise Asset library (`POST /v1/asset-uploads`). |
| **11** | `canva_sync_brand_kit` | Connect | Fetches brand colors and fonts from Canva Brand Kit directly into palettes. |
| **12** | `canva_read_design_comments` | Connect | Reads comments and reviewer feedback directly from Canva Cloud. |
| **13** | `canva_auto_fix_from_comment` | Connect | Parses review comments and updates slide engine layouts automatically. |
| **14** | `canva_list_taste_palettes` | Taste | Queries 57 curated design palettes (`corporate-navy`, `cool-white-slate`, etc.). |
| **15** | `canva_validate_slide_copy` | Taste | Anti-slop copy validator detecting vague marketing buzzwords. |
| **16** | `canva_export_slide_thumbnail` | Taste | Exports crisp $1280 \times 720$ PNG previews of any slide. |
| **17** | `canva_audit_entire_deck` | Taste | Comprehensive presentation quality inspector checking typography, badges, and facts. |
| **18** | `canva_add_tasteful_slide` | Taste | Unified dispatcher supporting 9 specialized AI/ML slide layouts. |
| **19** | `canva_add_process_timeline` | Taste | Horizontal sequential roadmap (3–5 steps) with rounded number badges. |
| **20** | `canva_add_swot_matrix` | Taste | $2 \times 2$ SWOT grid with brand-aligned quadrant colors. |
| **21** | `canva_add_team_grid` | Taste | Professional team card grid ($2 \times 2$ or $3 \times 2$) with initials avatar circles. |

---

## 🧠 Integrated Agentic Skills (`skills/`)

1. **`canva-deck-builder`:** 5-step operational workflow to convert raw outlines into polished presentation decks.
2. **`canva-brand-auditor`:** Rigorous quality assurance scoring decks against font size floor ($\ge 24\text{ pt}$), presenter badges, and anti-slop copy.
3. **`canva-swot-analyst`:** Strategic SWOT matrix designer with balanced quadrant typography.
4. **`canva-kpi-dashboard`:** High-impact metric dashboard designer featuring $56\text{ pt}$ hero values.

---

---

## 🛡️ Enterprise Production Guardrails (v3.2)

Canva MCP Pro v3.2 introduces hardened security and operational guardrails designed for zero-trust enterprise environments:

### 1. Zero-RCE Sandbox Policy (`CANVA_MCP_EXECUTION_MODE`)
- **`declarative_json_only` (Default in Production):** Completely disables arbitrary script execution. Requires layout requests to pass through the deterministic Declarative JSON Layout Engine.
- **`sandboxed_script` (Strict Dev Mode):** Enforces an AST/Token blocklist preventing string concatenation and dynamic property reflection:
  - Blocked tokens: `__`, `getattr`, `setattr`, `delattr`, `globals`, `locals`, `vars`, `compile`, `open`, `importlib`, `Reflect`, `Function`, `constructor`, `prototype`, `process`, `globalThis`, `Buffer`, `atob`, `btoa`, and hex/unicode escape sequences (`\x`, `\u`).
  - Strict 500ms execution timeout.

### 2. Bilingual Prompt Injection & Delimiter Neutralization
- Automatic Unicode NFKC normalization and Zero-Width character stripping (`\u200B-\u200D`, `\uFEFF`).
- Neutralizes delimiter breakout attempts by escaping `</untrusted_user_comment>` into `[SANITIZED_TAG]`.
- Multi-lingual heuristic scanner filtering English and Vietnamese prompt injection patterns (with and without diacritics).
- `CANVA_MCP_FORCE_COMMENT_PREVIEW=true` enforces safe dry-run preview mode for all third-party Canva Cloud comment fixes.

### 3. Vietnam & Global PII Redactor (Decree 13/2023/ND-CP & GDPR)
- Masks **Vietnam Mobile Numbers** across all carriers (`032-039`, `05x`, `07x`, `08x`, `09x`, `+84`, punctuated).
- Masks **Vietnam Citizen Identity Cards (CCCD - 12 digits)** and **Enterprise Tax IDs (MST - 10/13 digits)**.
- Masks **JWT Tokens**, Cloud API Keys (`sk-`, `ghp_`, `AIza`), **Internal IPv4 addresses (RFC 1918)**, and **Database connection URIs** (`postgres://`, `mongodb://`, `redis://`).

### 4. Workspace Lifecycle & Anti-DoS
- **Session Isolation:** Dynamic multi-tenant folder scoping (`/tmp/canva-mcp-pro/session_<sessionId>`) with POSIX `0700` permission lockdown.
- **Disk Quota:** Hard cap enforced at `CANVA_MCP_MAX_WORKSPACE_MB` (default: 50MB per session).
- **TTL Auto-Purge:** Automatic background expiration and reclamation of temp workspaces older than `CANVA_MCP_TMP_TTL_SECONDS` (default: 900s / 15 minutes).

### 5. High-Availability Cloud Sync
- **Exponential Backoff & Jitter:** Automatic retries for Canva Cloud REST API transient failures (HTTP 429 rate limit, 502/503/504 gateways).
- **Optimistic Locking:** Tracks design `updated_at` timestamps to prevent silent race-condition overwrites.

---

## 🐳 Production Docker Deployment

Deploy a zero-privilege, fully isolated container with headless LibreOffice and Vietnamese typography pre-configured:

```bash
# 1. Start with Docker Compose (Hardened read-only container + 512MB tmpfs)
docker compose -f docker-compose.prod.yml up -d

# 2. View container health & logs
docker compose -f docker-compose.prod.yml logs -f canva-mcp-pro

# 3. Stop container
docker compose -f docker-compose.prod.yml down
```

### Docker Hardening Specs
- Base: `python:3.11-slim-bookworm` + Node.js 20 LTS.
- Non-root user: `appuser` (UID 10001, GID 10001).
- Filesystem: `read_only: true` with dedicated 512MB `tmpfs` mounted at `/tmp`.
- Security Opts: `no-new-privileges:true`, dropped `ALL` Linux capabilities.

---

## 🤖 A2A Protocol & Agent Card

Canva MCP Pro is an autonomous presentation agent adhering to the **Agent-to-Agent (A2A) Protocol**:

- **Agent Card URL:** [`/.well-known/agent.json`](.well-known/agent.json)
- **Inspect via CLI:**
  ```bash
  npm run agent-card
  ```

---

## 📦 Install via `skills.sh`

Add all 4 presentation skills to your AI agent with a single command:

```bash
npx skills add leanhduyp/canva-mcp-pro
```

---
## 🧪 Testing & Evaluation

Canva MCP Pro includes a comprehensive automated evaluation suite containing **30 XML QA test cases** and **33 Phase 7 Enterprise Hardening test cases** (63 total):

```bash
npm test
```

Expected output:
```text
=================================================
🚀 KHỞI CHẠY BỘ ĐÁNH GIÁ CANVA MCP PRO v3.2 ENTERPRISE (10/10 HARDENED)
=================================================
📦 MCP Tool Registry       : 21/21 Tools Ready (MCP Spec v2 Annotations Verified)
🧠 Agentic Skills           : 4/4 Skills Verified
❓ XML Evaluation QA Pairs : 30/30 PASSED (100.0%)
🎨 Design Palettes         : 57 Curated Palettes
📦 1-Click Bundle (.mcpb)  : release/canva-mcp-pro.mcpb (100.1 KB)
🛡️ AppSec & Safe Sandboxing: PASSED (AST/Token Block, Font Floor, Delimiter Escape)
🔐 Phase 7 Enterprise Hardening: 33/33 PASSED (100.0%)
   ├── Obfuscated RCE Filter   : 10/10 PASSED
   ├── Prompt Injection & Escape: 10/10 PASSED
   ├── Vietnam Enterprise PII   : 8/8 PASSED
   └── Multi-tenant Lifecycle  : 5/5 PASSED
=================================================
🏆 CANVA MCP PRO v3.2 ENTERPRISE ĐÃ HOÀN TẤT VÀ VƯỢT QUA 100% CÁC BÀI KIỂM ĐỊNH (ĐẠT CHUẨN ENTERPRISE PRODUCTION 10/10)!
```

---

## 📄 License & Disclaimer

- **License:** Released under the [MIT License](LICENSE).
- **Disclaimer:** This open-source project is an independent community development using public APIs and the Model Context Protocol (MCP). It is not affiliated with, endorsed by, or sponsored by Canva Pty Ltd or Microsoft Corp. Canva is a registered trademark of Canva Pty Ltd.
