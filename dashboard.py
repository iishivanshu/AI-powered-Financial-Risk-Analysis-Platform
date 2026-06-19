import plotly.graph_objects as go
import streamlit as st

from data_loader import get_stock_data
from risk_analysis import calculate_metrics

st.title("Financial Risk & Portfolio Analytics Platform")

ticker = st.text_input(
    "Enter Stock Ticker",
    value="AAPL"
)

data = get_stock_data(ticker)

annual_return, annual_volatility, sharpe_ratio = calculate_metrics(data)

st.subheader(f"{ticker} Financial Metrics")

col1, col2, col3 = st.columns(3)
with col1:
    st.metric(
        "Annual Return",
        f"{annual_return:.2%}"
    )

with col2:
    st.metric(
        "Annual Volatility",
        f"{annual_volatility:.2%}"
    )

with col3:
    st.metric(
        "Sharpe Ratio",
        f"{sharpe_ratio:.2f}"
    )
st.subheader("Price Trend Analysis")

fig = go.Figure()

fig.add_trace(
    go.Scatter(
        x=data.index,
        y=data["Close"],
        name="Close Price"
    )
)

fig.add_trace(
    go.Scatter(
        x=data.index,
        y=data["SMA_50"],
        name="SMA 50"
    )
)

fig.add_trace(
    go.Scatter(
        x=data.index,
        y=data["SMA_200"],
        name="SMA 200"
    )
)

st.plotly_chart(fig)        