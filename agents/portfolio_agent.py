from agents.market_agent import market_agent


def portfolio_agent(tickers):

    returns = []
    volatilities = []

    for ticker in tickers:

        result = market_agent(ticker)

        returns.append(result["annual_return"])
        volatilities.append(result["annual_volatility"])

    portfolio_return = sum(returns) / len(returns)
    portfolio_volatility = sum(volatilities) / len(volatilities)
    sharpe_ratio = portfolio_return / portfolio_volatility if portfolio_volatility != 0 else 0
    if portfolio_volatility < 0.20:
        risk_level = "Low Risk"
    elif portfolio_volatility < 0.35:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    return {
        "stocks": tickers,
        "portfolio_return": portfolio_return,
        "portfolio_volatility": portfolio_volatility,
        "portfolio_sharpe": sharpe_ratio,
        "risk_level": risk_level
    }