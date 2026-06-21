import os
import numpy as np
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from core.main_agent import analyze_stock
from core.portfolio_main_agent import analyze_portfolio
from core.data_loader import get_stock_data_and_ticker
from core.risk_analysis import calculate_metrics

app = Flask(__name__, template_folder="templates")
CORS(app)

# Settings storage (in-memory persistent configuration)
current_settings = {
    "available_pages": [
        "stock_analysis",
        "portfolio_analysis",
        "risk_dashboard",
        "reports",
        "settings"
    ],
    "default_tickers": ["AAPL", "MSFT", "NVDA"],
    "analysis_period": "5y"
}

def make_json_safe(obj):
    """Recursively convert NumPy datatypes to native Python types for JSON serialization."""
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_safe(x) for x in obj]
    elif isinstance(obj, tuple):
        return tuple(make_json_safe(x) for x in obj)
    elif isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    else:
        return obj

# Page Template Routes
@app.route("/")
@app.route("/stock-analysis")
def stock_analysis_page():
    return render_template("stock_analysis.html")

@app.route("/portfolio-analysis")
def portfolio_analysis_page():
    return render_template("portfolio_analysis.html")

@app.route("/risk-dashboard")
def risk_dashboard_page():
    return render_template("risk_dashboard.html")

@app.route("/reports")
def reports_page():
    return render_template("reports.html")

@app.route("/settings-page")
def settings_page():
    return render_template("settings.html")

# API Routes
@app.route("/api/status")
def status():
    return jsonify({"status": "Financial Risk Platform API Running"})

@app.route("/stock/<ticker>")
def stock_analysis(ticker):
    result = analyze_stock(ticker)
    return jsonify(make_json_safe(result))

@app.route("/analyze/<ticker>")
def analyze(ticker):
    return stock_analysis(ticker)

@app.route("/portfolio")
def portfolio():
    ticker_query = request.args.get("tickers")
    if not ticker_query:
        # Use default tickers from active settings
        tickers = current_settings["default_tickers"]
    else:
        tickers = [ticker.strip().upper() for ticker in ticker_query.split(",") if ticker.strip()]
        if not tickers:
            tickers = current_settings["default_tickers"]

    result = analyze_portfolio(tickers)
    return jsonify(make_json_safe(result))

@app.route("/risk/<ticker>")
def risk(ticker):
    result = analyze_stock(ticker)
    return jsonify(make_json_safe({"ticker": result["ticker"], "risk": result.get("risk")}))

@app.route("/report/<ticker>")
def report(ticker):
    result = analyze_stock(ticker)
    return jsonify(make_json_safe({"ticker": result["ticker"], "report": result.get("report")}))

@app.route("/dashboard/<ticker>")
def dashboard_metrics(ticker):
    data, resolved_ticker = get_stock_data_and_ticker(ticker)
    if data.empty:
        return jsonify({"error": f"No data available for ticker {ticker}"}), 404

    annual_return, annual_volatility, sharpe_ratio = calculate_metrics(data)
    price_history = data[["Close", "SMA_50", "SMA_200"]].tail(365).reset_index()
    price_history["Date"] = price_history["Date"].dt.strftime("%Y-%m-%d")

    return jsonify(make_json_safe({
        "ticker": resolved_ticker,
        "metrics": {
            "annual_return": annual_return,
            "annual_volatility": annual_volatility,
            "sharpe_ratio": sharpe_ratio
        },
        "price_history": price_history.to_dict(orient="records")
    }))

@app.route("/settings", methods=["GET", "POST"])
def settings():
    global current_settings
    if request.method == "POST":
        data = request.json or {}
        if "default_tickers" in data:
            tickers = [t.strip().upper() for t in data["default_tickers"] if t.strip()]
            if tickers:
                current_settings["default_tickers"] = tickers
        if "analysis_period" in data:
            current_settings["analysis_period"] = data["analysis_period"]
        return jsonify({"status": "Settings updated", "settings": current_settings})
    return jsonify(current_settings)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(debug=True, host="0.0.0.0", port=port, use_reloader=False)
