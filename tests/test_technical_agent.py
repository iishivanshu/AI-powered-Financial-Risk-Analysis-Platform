import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.market_agent import market_agent
from agents.technical_agent import technical_agent

market_result = market_agent("AAPL")

technical_result = technical_agent(
    market_result["data"]
)

print(technical_result)
