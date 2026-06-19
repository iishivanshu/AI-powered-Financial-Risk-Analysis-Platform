def risk_agent(annual_return, annual_volatility, sharpe_ratio):

    risk_score = 0

    # Volatility Analysis
    if annual_volatility < 0.15:
        risk_score += 2
    elif annual_volatility < 0.30:
        risk_score += 5
    else:
        risk_score += 8

    # Sharpe Ratio Analysis
    if sharpe_ratio > 1:
        risk_score -= 2
    elif sharpe_ratio > 0.5:
        risk_score -= 1

    # Risk Classification
    if risk_score <= 3:
        risk_level = "Low Risk"
    elif risk_score <= 6:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    return {
        "risk_score": risk_score,
        "risk_level": risk_level
    }