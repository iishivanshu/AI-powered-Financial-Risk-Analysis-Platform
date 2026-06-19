from agents.market_agent import market_agent
from agents.risk_agent import risk_agent

market_result = market_agent("AAPL")

risk_result = risk_agent(
    market_result["annual_return"],
    market_result["annual_volatility"],
    market_result["sharpe_ratio"]
)

print(risk_result)