from core.data_loader import get_stock_data_and_ticker
from core.risk_analysis import calculate_metrics


def market_agent(ticker):

    data, resolved_ticker = get_stock_data_and_ticker(ticker)
    if data.empty:
        raise ValueError(f"No stock data found for ticker: {ticker}")

    current_price = float(data["Close"].iloc[-1])

    annual_return, annual_volatility, sharpe_ratio = calculate_metrics(data)

    currency = "INR" if resolved_ticker.upper().endswith((".NS", ".BO")) else "USD"
    currency_symbol = "₹" if currency == "INR" else "$"

    return {
        "ticker": resolved_ticker,
        "annual_return": annual_return,
        "annual_volatility": annual_volatility,
        "sharpe_ratio": sharpe_ratio,
        "current_price": current_price,
        "currency": currency,
        "currency_symbol": currency_symbol,
        "data": data
    }