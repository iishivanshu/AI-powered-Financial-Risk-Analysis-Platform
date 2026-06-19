from data_loader import get_stock_data
from risk_analysis import calculate_metrics


def market_agent(ticker):

    data = get_stock_data(ticker)

    annual_return, annual_volatility, sharpe_ratio = calculate_metrics(data)

    return {
        "ticker": ticker,
        "annual_return": annual_return,
        "annual_volatility": annual_volatility,
        "sharpe_ratio": sharpe_ratio,
        "data": data
    }