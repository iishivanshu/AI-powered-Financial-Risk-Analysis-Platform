import yfinance as yf
import pandas as pd

def get_stock_data_and_ticker(ticker):
    resolved_ticker = ticker
    stock = yf.Ticker(ticker)
    df = stock.history(period="5y")

    if df.empty and not (ticker.endswith(".NS") or ticker.endswith(".BO")):
        try_ticker = ticker + ".NS"
        stock = yf.Ticker(try_ticker)
        df = stock.history(period="5y")
        if not df.empty:
            resolved_ticker = try_ticker
        else:
            try_ticker = ticker + ".BO"
            stock = yf.Ticker(try_ticker)
            df = stock.history(period="5y")
            if not df.empty:
                resolved_ticker = try_ticker

    if not df.empty:
        # Daily Return
        df["Daily Return"] = df["Close"].pct_change()

        # 50-Day Moving Average
        df["SMA_50"] = df["Close"].rolling(window=50).mean()

        # 200-Day Moving Average
        df["SMA_200"] = df["Close"].rolling(window=200).mean()

    return df, resolved_ticker


def get_stock_data(ticker):
    df, _ = get_stock_data_and_ticker(ticker)
    return df
