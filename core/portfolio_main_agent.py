import os
from agents.portfolio_agent import portfolio_agent
from agents.portfolio_report_agent import generate_portfolio_report

def analyze_portfolio(tickers):

    portfolio_result = portfolio_agent(tickers)

    report = generate_portfolio_report(
        portfolio_result
    )

    report_is_fallback = "AI Report Generation Temporarily Unavailable" in report

    if not os.getenv("GROQ_API_KEY"):
        ai_status = "unavailable"
    elif report_is_fallback:
        ai_status = "unavailable"
    else:
        ai_status = "online"

    return {
        "portfolio": portfolio_result,
        "report": report,
        "ai_status": ai_status
    }
