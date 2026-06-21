from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_report(
    market_data,
    technical_data,
    risk_data,
    news_data
):
    prompt = f"""
    You are a professional financial analyst.

    Market Data:
    {market_data}

    Technical Data:
    {technical_data}

    Risk Data:
    {risk_data}
    
    News Data:
    {news_data}

    Generate:

   1. Market Analysis
   2. Technical Analysis
   3. Risk Assessment
   4. News Assessment
   5. Executive Summary

    Keep the report concise and professional.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt 
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        import sys
        ticker = market_data.get("ticker", "Stock")
        sys.stderr.write(f"Error in generate_report for {ticker}: {str(e)}\n")
        current_price = market_data.get("current_price", 0.0)
        annual_return = market_data.get("annual_return", 0.0)
        annual_volatility = market_data.get("annual_volatility", 0.0)
        sharpe_ratio = market_data.get("sharpe_ratio", 0.0)
        currency_symbol = market_data.get("currency_symbol", "$")
        
        sma50 = technical_data.get("sma50", 0.0)
        sma200 = technical_data.get("sma200", 0.0)
        trend = technical_data.get("trend", "Neutral")
        
        risk_score = risk_data.get("risk_score", 0)
        risk_level = risk_data.get("risk_level", "Medium Risk")
        
        fallback_markdown = f"""**Market Analysis**
The current market data for {ticker} indicates a return of {annual_return*100:.2f}% with an annual volatility of {annual_volatility*100:.2f}%. The Sharpe ratio is {sharpe_ratio:.2f}. The current price is {currency_symbol}{current_price:.2f}.

**Technical Analysis**
The technical data indicates a {trend.lower()} trend, with the 50-day moving average (SMA50) at {currency_symbol}{sma50:.2f} and the 200-day moving average (SMA200) at {currency_symbol}{sma200:.2f}.

**Risk Assessment**
The risk score is {risk_score}/10, indicating a {risk_level.lower()} level.

**News Assessment**
{news_data}

**Executive Summary**
### AI Report Generation Temporarily Unavailable
The AI intelligence engine is currently unavailable. Core market analytics, technical indicators, portfolio analysis, and risk calculations remain fully operational. Please try generating the report again in a few minutes.

Our fallback analysis suggests {ticker} is trading with an annual return of {annual_return*100:.2f}% and is currently evaluated as {risk_level.lower()}. The general trend is {trend.lower()} with SMA50 ({currency_symbol}{sma50:.2f}) relative to SMA200 ({currency_symbol}{sma200:.2f})."""
        return fallback_markdown