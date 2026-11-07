# Contributing to AI-Powered Financial Risk Analysis Platform

Thank you for your interest in contributing to the AI-Powered Financial Risk Analysis Platform! We welcome contributions, bug reports, and suggestions to make this platform better.

---

## How to Contribute

You can contribute in several ways:
- **Reporting bugs**: Help us identify defects or unexpected behavior.
- **Suggesting features**: Propose improvements, new financial metrics, or UI enhancements.
- **Submitting pull requests**: Contribute code improvements, bug fixes, or documentation updates.
- **Improving documentation**: Enhance existing guides, docstrings, or examples.

---

## Development Setup

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/AI-powered-Financial-Risk-Analysis-Platform.git
   cd AI-powered-Financial-Risk-Analysis-Platform
   ```
3. **Create a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
4. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Configure environment variables**:
   Create a `.env` file based on `.env.example` (or set `GROQ_API_KEY` and `PORT`).
6. **Run the application**:
   ```bash
   python app.py
   ```

---

## Code Style

- **Python**: Follow [PEP 8](https://peps.python.org/pep-0008/) conventions for Python code formatting.
- **Clarity & Readability**: Write clean, self-explanatory code with clear variable and function names.
- **Documentation**: Add meaningful docstrings and comments for non-trivial logic (especially financial formulas or agent interactions).
- **Error Handling**: Ensure graceful fallbacks when external services or API keys are unavailable.

---

## Submitting Changes

1. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. **Make your changes** with focused, logical commits.
3. **Write descriptive commit messages** following conventional commits (e.g., `feat: ...`, `fix: ...`, `docs: ...`).
4. **Test your changes** to verify that all endpoints and calculations behave as expected:
   ```bash
   python -m pytest tests/
   ```
5. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Open a Pull Request** against the `main` branch with a clear description of the problem solved and the changes introduced.

---

## Reporting Issues

If you find a bug or have a suggestion:
1. Check the [existing issues](https://github.com/iishivanshu/AI-powered-Financial-Risk-Analysis-Platform/issues) first to avoid duplicates.
2. If opening a new issue, please include:
   - A clear and descriptive title.
   - Steps to reproduce the problem.
   - Expected vs. actual behavior.
   - Relevant error logs or screenshots.
   - Details about your environment (OS, Python version, browser).
