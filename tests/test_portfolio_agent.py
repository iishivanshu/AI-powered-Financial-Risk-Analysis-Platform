import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.portfolio_agent import portfolio_agent

result = portfolio_agent(
    ["AAPL", "MSFT", "NVDA"]
)

print(result)
