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