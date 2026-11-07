# Contributing to Canva MCP Pro

Thank you for your interest in contributing to **Canva MCP Pro**! We welcome contributions from developers, designers, and AI engineers.

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/leanhduyp/canva-mcp-pro.git
   cd canva-mcp-pro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify Python environment:**
   Ensure Python 3.10+ is installed with `python-pptx` and `Pillow`:
   ```bash
   pip install python-pptx Pillow
   ```

4. **Build and diagnose:**
   ```bash
   npm run build
   npm run diagnose
   ```

5. **Run the evaluation suite:**
   Ensure all 30 evaluation test cases pass (100% pass rate):
   ```bash
   npm test
   ```

## Design Standards (Taste-Skill Anti-Slop Guidelines)

When contributing new slide layouts or features:
- **Typography Floor:** All body text runs must be strictly $\ge 24\text{ pt}$ for optimal readability.
- **Presenter Badge:** Preserve the presenter badge format (44pt bold, Cyan `#00B0F0`) on the top-right corner.
- **Anti-Slop Copy:** Do not use vague or generic AI buzzwords (*revolutionary, game-changing, delve, tapestry*). Use concrete data, architectural layers, and hard facts.
- **Pure Vector Output:** Render native geometric vector cards without relying on static bitmap templates.

## Submitting Pull Requests

1. Create a feature branch: `git checkout -b feature/new-layout-name`
2. Commit your changes: `git commit -m "feat: add process matrix layout"`
3. Push to your fork: `git push origin feature/new-layout-name`
4. Open a Pull Request detailing your changes and verification screenshots.
