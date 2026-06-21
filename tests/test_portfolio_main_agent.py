import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.portfolio_main_agent import analyze_portfolio

result = analyze_portfolio(
    ["AAPL", "MSFT", "NVDA"]
)

print(result["report"])
