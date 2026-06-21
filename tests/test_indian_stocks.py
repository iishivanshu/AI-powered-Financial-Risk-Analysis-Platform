import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

sys.stdout.reconfigure(encoding='utf-8')
from agents.market_agent import market_agent

result = market_agent("RELIANCE")

print("--- Indian Stock Test Result ---")
print("Requested Ticker: RELIANCE")
print("Resolved Ticker :", result["ticker"])
print("Currency        :", result["currency"])
print("Currency Symbol :", result["currency_symbol"])
print("Current Price   :", result["current_price"])
print("Annual Return   :", result["annual_return"])
print("Annual Volatility:", result["annual_volatility"])
print("Sharpe Ratio    :", result["sharpe_ratio"])
