from main_agent import analyze_stock

print("Starting Analysis")

result = analyze_stock("AAPL")

print("Analysis Complete")

print(result)

print(result["report"])