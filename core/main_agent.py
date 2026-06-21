import os
from agents.market_agent import market_agent
from agents.technical_agent import technical_agent
from agents.risk_agent import risk_agent
from agents.news_agent import news_agent
from agents.report_agent import generate_report

def analyze_stock(ticker):

    market_result = market_agent(ticker)
    resolved_ticker = market_result["ticker"]

    technical_result = technical_agent(
        market_result["data"]
    )

    risk_result = risk_agent(
        market_result["annual_return"],
        market_result["annual_volatility"],
        market_result["sharpe_ratio"]
    )
    news_result = news_agent(resolved_ticker)

    report = generate_report(
        market_result,
        technical_result,
        risk_result,
        news_result
    )

    news_is_fallback = "Live AI sentiment analytics are temporarily limited" in news_result or "Error:" in news_result
    report_is_fallback = "AI Report Generation Temporarily Unavailable" in report

    if not os.getenv("GROQ_API_KEY"):
        ai_status = "unavailable"
    elif news_is_fallback and report_is_fallback:
        ai_status = "unavailable"
    elif news_is_fallback or report_is_fallback:
        ai_status = "limited"
    else:
        ai_status = "online"

    return {
        "ticker": market_result["ticker"],
        "market": {
            "annual_return": market_result["annual_return"],
            "annual_volatility": market_result["annual_volatility"],
            "sharpe_ratio": market_result["sharpe_ratio"],
            "current_price": market_result["current_price"],
            "currency": market_result.get("currency", "USD"),
            "currency_symbol": market_result.get("currency_symbol", "$")
        },
        "technical": technical_result,
        "risk": risk_result,
        "news": news_result,
        "report": report,
        "ai_status": ai_status
    }
