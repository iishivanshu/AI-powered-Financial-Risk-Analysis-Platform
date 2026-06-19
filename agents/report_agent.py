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