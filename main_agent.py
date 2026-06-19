from agents.market_agent import market_agent
from agents.technical_agent import technical_agent
from agents.risk_agent import risk_agent
from agents.news_agent import news_agent
from agents.report_agent import generate_report
def analyze_stock(ticker):

    market_result = market_agent(ticker)

    technical_result = technical_agent(
        market_result["data"]
    )

    risk_result = risk_agent(
        market_result["annual_return"],
        market_result["annual_volatility"],
        market_result["sharpe_ratio"]
    )
    news_result = news_agent(ticker)

    report = generate_report(
        market_result,
        technical_result,
        risk_result,
        news_result
    )

    return {
    "ticker": market_result["ticker"],
    "market": {
        "annual_return": market_result["annual_return"],
        "annual_volatility": market_result["annual_volatility"],
        "sharpe_ratio": market_result["sharpe_ratio"]
    },
    "technical": technical_result,
    "risk": risk_result,
    "news": news_result,
    "report": report
}