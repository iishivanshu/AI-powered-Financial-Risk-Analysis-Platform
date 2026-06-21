import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.market_agent import market_agent

result = market_agent("AAPL")

print("Ticker:", result["ticker"])
print("Annual Return:", result["annual_return"])
print("Annual Volatility:", result["annual_volatility"])
print("Sharpe Ratio:", result["sharpe_ratio"])
print("Current Price:", result["current_price"])
