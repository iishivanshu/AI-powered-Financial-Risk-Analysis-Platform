from portfolio_main_agent import analyze_portfolio

result = analyze_portfolio(
    ["AAPL", "MSFT", "NVDA"]
)

print(result["report"])