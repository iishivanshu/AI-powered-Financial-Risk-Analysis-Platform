import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.market_agent import market_agent
from agents.technical_agent import technical_agent
from agents.report_agent import generate_report
from agents.risk_agent import risk_agent

market_result = market_agent("AAPL")

technical_result = technical_agent(
    market_result["data"]
)

risk_result = risk_agent(
    market_result["annual_return"],
    market_result["annual_volatility"],
    market_result["sharpe_ratio"]
)

report = generate_report(
    market_result,
    technical_result,
    risk_result
)

print(report)
