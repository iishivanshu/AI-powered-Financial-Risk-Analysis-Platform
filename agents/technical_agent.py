def technical_agent(data):

    latest_sma50 = data["SMA_50"].iloc[-1]
    latest_sma200 = data["SMA_200"].iloc[-1]

    if latest_sma50 > latest_sma200:
        trend = "Bullish"
    else:
        trend = "Bearish"

    return {
        "sma50": latest_sma50,
        "sma200": latest_sma200,
        "trend": trend
    }