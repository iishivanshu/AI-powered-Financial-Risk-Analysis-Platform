def calculate_metrics(data):

    avg_daily_return = data["Daily Return"].mean()

    annual_return = avg_daily_return * 252

    daily_volatility = data["Daily Return"].std()

    annual_volatility = daily_volatility * (252 ** 0.5)

    risk_free_rate = 0.05

    sharpe_ratio = (
        annual_return - risk_free_rate
    ) / annual_volatility

    return annual_return, annual_volatility, sharpe_ratio
