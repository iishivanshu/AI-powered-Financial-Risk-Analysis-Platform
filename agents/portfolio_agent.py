from agents.market_agent import market_agent


def portfolio_agent(tickers):

    returns = []
    volatilities = []
    stock_details = []
    resolved_tickers = []

    for ticker in tickers:

        result = market_agent(ticker)
        resolved_ticker = result["ticker"]
        resolved_tickers.append(resolved_ticker)

        returns.append(result["annual_return"])
        volatilities.append(result["annual_volatility"])
        stock_details.append({
            "ticker": resolved_ticker,
            "annual_return": result["annual_return"],
            "annual_volatility": result["annual_volatility"],
            "sharpe_ratio": result["sharpe_ratio"],
            "current_price": result["current_price"],
            "currency": result.get("currency", "USD"),
            "currency_symbol": result.get("currency_symbol", "$")
        })

    portfolio_return = sum(returns) / len(returns) if returns else 0
    portfolio_volatility = sum(volatilities) / len(volatilities) if volatilities else 0
    sharpe_ratio = portfolio_return / portfolio_volatility if portfolio_volatility != 0 else 0
    if portfolio_volatility < 0.20:
        risk_level = "Low Risk"
    elif portfolio_volatility < 0.35:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    return {
        "stocks": resolved_tickers,
        "portfolio_return": portfolio_return,
        "portfolio_volatility": portfolio_volatility,
        "portfolio_sharpe": sharpe_ratio,
        "risk_level": risk_level,
        "stock_details": stock_details
    }