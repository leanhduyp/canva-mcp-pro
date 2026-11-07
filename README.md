# 🚀 Canva MCP Pro (v3.0 Enterprise Architecture)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Protocol%20v2.4-purple.svg)](https://modelcontextprotocol.io/)
[![Evaluations](https://img.shields.io/badge/Evals-30%2F30%20(100%25)-success.svg)](evals/canva_mcp_eval.xml)

**Canva MCP Pro** is an open-source, enterprise-grade [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for autonomous AI presentation generation. It bridges **high-fidelity local vector rendering (offline Python-pptx & PIL)** with **two-way cloud synchronization (Canva Connect REST API)**, enforced by the **Taste-Skill Anti-Slop aesthetic system**.

---

## 🌟 Key Innovations

- **Dual-Engine Hybrid Architecture:**
  - **Local Vector Engine (100% Offline & Air-gapped):** Generates standalone, pixel-perfect 16:9 widescreen PowerPoint decks (`.pptx`) with zero dependency on third-party templates.
  - **Canva Cloud Connect Engine:** Full two-way synchronization with Canva Cloud REST API (`api.canva.com/rest/v1`), managing assets, brand kits, and real-time comment feedback loops.
- **Local Code Sandbox (`canva_execute_layout_script`):**
  - Allows AI agents to execute local Python/JavaScript code in an isolated sandbox, performing complex vector coordinate math directly on the host machine to save up to 80% of LLM token bandwidth.
- **Taste-Skill Anti-Slop System:**
  - Automated copy audit against generic AI buzzwords (*revolutionary, game-changing, delve, tapestry*).
  - Enforced typography floor: All body text strictly $\ge 24\text{ pt}$ to prevent text overflow and maximize room visibility.
  - Integrated 57 curated design palettes (`corporate-navy`, `cool-white-slate`, `minimal-dark`, etc.).
- **Autonomous Deck-Auditor:**
  - Built-in scanner inspecting text sizes, presenter badges, hard facts, and margin balance, returning a quantified **Taste Score (/100)**.
- **1-Click Packaging (`.mcpb`):**
  - Ships with a pre-packaged single-file distribution bundle (`release/canva-mcp-pro.mcpb`) for instant drag-and-drop installation into Claude Desktop.

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
git clone https://github.com/mrduy/canva-mcp-pro.git
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

## 🧪 Testing & Evaluation

Canva MCP Pro includes a comprehensive automated evaluation suite containing **30 XML QA test cases** covering every tool, schema, and aesthetic rule:

```bash
npm test
```

Expected output:
```text
=================================================
🚀 KHỞI CHẠY BỘ ĐÁNH GIÁ CANVA MCP PRO v3.0
=================================================
📦 MCP Tool Registry       : 21/21 Tools Ready
🧠 Agentic Skills           : 4/4 Skills Verified
❓ XML Evaluation QA Pairs : 30/30 PASSED (100.0%)
🎨 Design Palettes         : 57 Curated Palettes
📦 1-Click Bundle (.mcpb)  : release/canva-mcp-pro.mcpb (84.7 KB)
=================================================
🏆 STATUS: 100% PRODUCTION READY!
```

---

## 📄 License & Disclaimer

- **License:** Released under the [MIT License](LICENSE).
- **Disclaimer:** This open-source project is an independent community development using public APIs and the Model Context Protocol (MCP). It is not affiliated with, endorsed by, or sponsored by Canva Pty Ltd or Microsoft Corp. Canva is a registered trademark of Canva Pty Ltd.
