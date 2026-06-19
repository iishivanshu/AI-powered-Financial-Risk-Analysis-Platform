from agents.portfolio_agent import portfolio_agent
from portfolio_report_agent import generate_portfolio_report

portfolio_result = portfolio_agent(
    ["AAPL", "MSFT", "NVDA"]
)

report = generate_portfolio_report(
    portfolio_result
)

print(report)