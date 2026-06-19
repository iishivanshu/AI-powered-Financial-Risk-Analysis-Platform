import yfinance as yf
import pandas as pd

def get_stock_data(ticker):

    stock = yf.Ticker(ticker)

    df = stock.history(period="5y")

    # Daily Return
    df["Daily Return"] = df["Close"].pct_change()

    # 50-Day Moving Average
    df["SMA_50"] = df["Close"].rolling(window=50).mean()

    # 200-Day Moving Average
    df["SMA_200"] = df["Close"].rolling(window=200).mean()

    return df

