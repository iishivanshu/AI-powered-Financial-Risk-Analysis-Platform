from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_portfolio_report(portfolio_data):
    prompt = f"""
    You are a senior financial advisor.

    Portfolio Data:
    {portfolio_data}

    Generate:

    1. Portfolio Summary
    2. Risk Analysis
    3. Strengths
    4. Weaknesses
    5. Investment Recommendation

    Keep the report professional and concise.
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
        sys.stderr.write(f"Error in generate_portfolio_report: {str(e)}\n")
        stocks_str = ", ".join(portfolio_data.get("stocks", []))
        portfolio_return = portfolio_data.get("portfolio_return", 0.0)
        portfolio_volatility = portfolio_data.get("portfolio_volatility", 0.0)
        portfolio_sharpe = portfolio_data.get("portfolio_sharpe", 0.0)
        risk_level = portfolio_data.get("risk_level", "Medium Risk")
        
        fallback_markdown = f"""**Portfolio Analysis Report**

### 1. Portfolio Summary
### AI Report Generation Temporarily Unavailable
The AI intelligence engine is currently unavailable. Core market analytics, technical indicators, portfolio analysis, and risk calculations remain fully operational. Please try generating the report again in a few minutes.

The portfolio consists of the following assets: {stocks_str}. The portfolio has an average annualized return of {portfolio_return*100:.2f}% and a volatility of {portfolio_volatility*100:.2f}%, yielding an average Sharpe ratio of {portfolio_sharpe:.2f}. The portfolio risk level is currently evaluated as {risk_level}.

### 2. Risk Analysis
The portfolio exhibits an annualized volatility of {portfolio_volatility*100:.2f}% and is categorized as {risk_level}.

### 3. Strengths
- **Diversification**: Allocation across multiple assets ({stocks_str}) helps distribute idiosyncratic risk.
- **Efficiency**: Sharpe ratio of {portfolio_sharpe:.2f} reflects risk-adjusted returns performance.

### 4. Weaknesses
- **Volatilities**: Individual stock swings contribute to a combined portfolio volatility of {portfolio_volatility*100:.2f}%.

### 5. Investment Recommendation
Consider rebalancing portfolio allocations and monitoring correlation indexes regularly to align with risk targets."""
        return fallback_markdown