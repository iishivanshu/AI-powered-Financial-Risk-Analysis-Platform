import os
import sys

# Ensure root directory is in the path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from core.main_agent import analyze_stock

print("Starting Analysis")

result = analyze_stock("AAPL")

print("Analysis Complete")

print(result)

print(result["report"])
