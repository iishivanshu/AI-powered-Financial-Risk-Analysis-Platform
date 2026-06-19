from portfolio_main_agent import analyze_portfolio
from flask_cors import CORS
from flask import Flask, jsonify
from main_agent import analyze_stock

app = Flask(__name__)
CORS(app)
@app.route("/")
def home():
    return "Financial Risk Platform API Running"

@app.route("/analyze/<ticker>")
def analyze(ticker):
    result = analyze_stock(ticker)

    return jsonify({
        "ticker": result.get("ticker"),
        "market": result.get("market"),
        "technical": result.get("technical"),
        "risk": result.get("risk"),
        "news": result.get("news"),
        "report": result.get("report")
    })


@app.route("/portfolio")
def portfolio():
    result = analyze_portfolio(["AAPL", "MSFT", "NVDA"])
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)