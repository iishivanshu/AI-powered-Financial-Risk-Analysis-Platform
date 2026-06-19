from agents.market_agent import market_agent

result = market_agent("AAPL")

print("Ticker:", result["ticker"])
print("Annual Return:", result["annual_return"])
print("Annual Volatility:", result["annual_volatility"])
print("Sharpe Ratio:", result["sharpe_ratio"])