# Walkthrough - Production-Grade Error Handling & Reorganization

The Financial Risk & Portfolio Analytics Platform has been updated with a professional structure and production-grade error boundaries. Raw API traces, token limits, and Groq exception strings are completely decoupled from user-facing views, replacing them with structured local markdown notifications. Additionally, color-coded badges display the live availability status of the generative AI service.

---

## 1. Production-Grade Error Boundaries

### A. Stripping Raw Provider Errors
* **Backend Logging:** Modified all generative agents (`agents/news_agent.py`, `agents/report_agent.py`, `agents/portfolio_report_agent.py`) to write the raw developer exceptions (`RateLimitError: 429`, token details, timeouts, or invalid keys) directly to the system console stderr stream (`sys.stderr.write`).
* **Hiding Model Specifics:** Hides all stack traces, raw network messages, and internal model identifiers from user displays.

### B. Standard Wording Implementation
* When rate limits or outages trigger agent `except` catch blocks, a structured fallback is returned, displaying:
  * **Title:** `AI Report Generation Temporarily Unavailable`
  * **Body:** *The AI intelligence engine is currently unavailable. Core market analytics, technical indicators, portfolio analysis, and risk calculations remain fully operational. Please try generating the report again in a few minutes.*

### C. Continued Core Calculations
* Restructured data flows so that if the generative AI model goes down, the platform continues rendering all price charts, technical indexes (SMA50/200, trends), risk coefficients, and Monte Carlo probability canvas animations successfully.

---

## 2. Dynamic AI Service Status Badges

### A. API Metadata Indicators
* Modified backend orchestrators (`core/main_agent.py` and `core/portfolio_main_agent.py`) to check if any of the processed report sections utilized fallbacks or if environment keys are missing.
* The API payload now contains a dynamic `ai_status` key:
  * `"online"` (all services active)
  * `"limited"` (partial fallback active)
  * `"unavailable"` (outages or missing credentials)

### B. Frontend Page Badges
Added status tags that render dynamically based on `ai_status` values or fetch timeouts:
* **Green (AI Service Online):** Succeeded response with no fallbacks.
* **Yellow (AI Service Limited):** Partial agent timeouts/fallbacks.
* **Red (AI Service Unavailable):** General model outages, missing keys, or server timeouts.

Status indicators have been integrated next to the headers across all primary report sections:
1. **Investment Reports Page:** next to the `AI Investment Report` header.
2. **Stock Analysis Page:** next to the `AI Analyst Research` tab title.
3. **Portfolio Analysis Page:** next to the `AI Insight Report` container.

---

## 3. Verification Results

### A. Python Agent Verification
* Run command `$env:GROQ_API_KEY=""; python -m tests.test_main_agent`
* **Console Logs:** Correctly printed rate limit warnings to standard error:
  `Error in generate_report for AAPL: Error code: 429 - rate_limit_exceeded`
* **JSON Payload:** Gracefully returned standard metrics with the fallback executive summary warning and `"ai_status": "unavailable"`.

### B. Browser Dashboard Verification
* Navigation through `/reports`, `/stock-analysis`, and `/portfolio-analysis` executes smoothly.
* Verified that status badges correctly transition color and text state (Green vs Red) when simulating connection states or rate-limit fallbacks.
