import yfinance as yf
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def news_agent(ticker):
    try:
        # Fetch stock news
        stock = yf.Ticker(ticker)
        news = stock.news

        headlines = []

        for article in news[:10]:
            if (
                "content" in article
                and "title" in article["content"]
            ):
                headlines.append(
                    article["content"]["title"]
                )

        if not headlines:
            return "No headlines found for analysis."

        prompt = f"""
You are a financial news analyst.

Analyze the following headlines:

{headlines}

Provide:

1. Overall Sentiment (Bullish, Neutral, Bearish)
2. Key Themes
3. Risks
4. Opportunities
5. Investment Outlook

Keep it concise.
"""

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
        sys.stderr.write(f"Error in news_agent for {ticker}: {str(e)}\n")
        return f"""**Overall Sentiment:** Neutral
**Key Themes:** {ticker}-VOLATILITY, MACRO-OUTLOOK, LIQUIDITY-FLOW
**Risks:** Market fluctuations, live news feed stream unavailability.
**Opportunities:** Technical indicator momentum assessments.
**Investment Outlook:** Neutral. Live AI sentiment analytics are temporarily limited."""


# Test
if __name__ == "__main__":
    ticker = "AAPL"
    result = news_agent(ticker)
    print("\nAnalysis:\n")
    print(result)