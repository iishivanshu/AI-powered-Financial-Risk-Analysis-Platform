from agents.market_agent import market_agent
from agents.technical_agent import technical_agent

market_result = market_agent("AAPL")

technical_result = technical_agent(
    market_result["data"]
)

print(technical_result)