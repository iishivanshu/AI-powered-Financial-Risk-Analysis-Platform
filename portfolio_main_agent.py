from agents.portfolio_agent import portfolio_agent
from agents.portfolio_report_agent import generate_portfolio_report
def analyze_portfolio(tickers):

    portfolio_result = portfolio_agent(tickers)

    report = generate_portfolio_report(
        portfolio_result
    )

    return {
        "portfolio": portfolio_result,
        "report": report
    }