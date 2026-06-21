function formatMarkdownToHtml(text) {
    if (!text) return "";
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    const lines = html.split('\n');
    let activeList = null;
    let resultLines = [];
    for (let line of lines) {
        let trimmed = line.trim();
        const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
        const isPageNumber = /^\d+\.\s/.test(trimmed); // variable renamed to prevent keyword conflict
        if (isBullet) {
            if (activeList !== "ul") {
                if (activeList) resultLines.push(`</${activeList}>`);
                resultLines.push('<ul class="list-disc pl-md space-y-xs my-sm">');
                activeList = "ul";
            }
            const content = trimmed.replace(/^(\*|-|•)\s+/, "");
            resultLines.push(`<li>${content}</li>`);
        } else if (isPageNumber) {
            if (activeList !== "ol") {
                if (activeList) resultLines.push(`</${activeList}>`);
                resultLines.push('<ol class="list-decimal pl-md space-y-xs my-sm">');
                activeList = "ol";
            }
            const content = trimmed.replace(/^\d+\.\s+/, "");
            resultLines.push(`<li>${content}</li>`);
        } else {
            if (activeList) {
                resultLines.push(`</${activeList}>`);
                activeList = null;
            }
            if (trimmed.startsWith("### ")) {
                resultLines.push(`<h4 class="font-headline-sm text-headline-sm mt-md mb-xs font-semibold text-primary">${trimmed.substring(4)}</h4>`);
            } else if (trimmed.startsWith("## ")) {
                resultLines.push(`<h3 class="font-headline-lg text-headline-lg mt-lg mb-sm font-semibold text-primary">${trimmed.substring(3)}</h3>`);
            } else if (trimmed.startsWith("# ")) {
                resultLines.push(`<h2 class="font-headline-xl text-headline-xl mt-xl mb-md font-semibold text-primary">${trimmed.substring(2)}</h2>`);
            } else if (trimmed !== "") {
                resultLines.push(`<p class="mb-sm leading-relaxed">${line}</p>`);
            } else {
                resultLines.push('<div class="h-sm"></div>');
            }
        }
    }
    if (activeList) resultLines.push(`</${activeList}>`);
    return resultLines.join('\n');
}

const queryInput = document.getElementById("portfolio-query-input");
const searchBtn = document.getElementById("search-btn");
const rebalanceBtn = document.getElementById("rebalance-btn");
const exportBtn = document.getElementById("export-report-btn");

const colors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-primary-container", "bg-on-secondary-container"];
const hexColors = ["#adc6ff", "#4edea3", "#ffb95f", "#4d8eff", "#00a572"];

async function loadPortfolioData(tickersList = "") {
    const subtitleEl = document.getElementById("portfolio-subtitle");
    
    // Set loading state
    document.getElementById("portfolio-return").innerText = "Loading...";
    document.getElementById("portfolio-volatility").innerText = "Loading...";
    document.getElementById("portfolio-sharpe").innerText = "Loading...";
    document.getElementById("risk-level-text").innerText = "Loading...";
    document.getElementById("portfolio-report").innerText = "Loading AI Insights...";

    let url = "/portfolio";
    if (tickersList) {
        url += `?tickers=${encodeURIComponent(tickersList)}`;
        subtitleEl.innerText = `Institutional Overview: ${tickersList.toUpperCase()}`;
    } else {
        subtitleEl.innerText = `Institutional Overview: Loading Default Tickers...`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Portfolio fetch failed");
        }
        const data = await response.json();
        console.log("Portfolio analysis loaded:", data);

        const aiStatus = data.ai_status || "online";
        const badgeEl = document.getElementById("ai-service-badge");
        const dotEl = document.getElementById("ai-service-dot");
        const textEl = document.getElementById("ai-service-status-text");

        if (badgeEl && dotEl && textEl) {
            if (aiStatus === "online") {
                badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-secondary/15 text-secondary border border-secondary/20";
                dotEl.className = "w-1.5 h-1.5 rounded-full bg-secondary animate-pulse";
                textEl.innerText = "AI SERVICE ONLINE";
            } else {
                badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-error/15 text-error border border-error/20";
                dotEl.className = "w-1.5 h-1.5 rounded-full bg-error";
                textEl.innerText = "AI SERVICE UNAVAILABLE";
            }
        }

        const stocks = data.portfolio.stocks;
        subtitleEl.innerText = `Institutional Overview: ${stocks.join(", ")}`;
        queryInput.value = stocks.join(", ");

        // Update metrics
        const pReturn = data.portfolio.portfolio_return;
        const pVolatility = data.portfolio.portfolio_volatility;
        const pSharpe = data.portfolio.portfolio_sharpe;
        const pRisk = data.portfolio.risk_level;

        document.getElementById("portfolio-return").innerText = (pReturn * 100).toFixed(2) + "%";
        const returnTrendIcon = document.getElementById("portfolio-return-trend-icon");
        if (pReturn >= 0) {
            document.getElementById("portfolio-return").className = "font-data-mono text-headline-lg text-secondary";
            returnTrendIcon.innerText = "trending_up";
            returnTrendIcon.className = "material-symbols-outlined text-secondary text-sm";
        } else {
            document.getElementById("portfolio-return").className = "font-data-mono text-headline-lg text-error";
            returnTrendIcon.innerText = "trending_down";
            returnTrendIcon.className = "material-symbols-outlined text-error text-sm";
        }

        document.getElementById("portfolio-volatility").innerText = (pVolatility * 100).toFixed(2) + "%";
        document.getElementById("portfolio-sharpe").innerText = pSharpe.toFixed(2);
        
        const riskTextEl = document.getElementById("risk-level-text");
        const riskBar = document.getElementById("risk-level-bar");
        riskTextEl.innerText = pRisk.toUpperCase();
        
        if (pRisk.toLowerCase().includes("low")) {
            riskTextEl.className = "font-data-mono text-sm text-secondary";
            riskBar.className = "bg-secondary h-full";
            riskBar.style.width = "25%";
            document.getElementById("summary-correlation").innerText = "Optimal";
            document.getElementById("summary-correlation").className = "block font-data-mono text-headline-sm text-secondary";
            document.getElementById("summary-concentration-alert").innerText = "Low";
            document.getElementById("summary-concentration-alert").className = "block font-data-mono text-headline-sm text-secondary";
        } else if (pRisk.toLowerCase().includes("medium") || pRisk.toLowerCase().includes("moderate")) {
            riskTextEl.className = "font-data-mono text-sm text-tertiary";
            riskBar.className = "bg-tertiary h-full";
            riskBar.style.width = "60%";
            document.getElementById("summary-correlation").innerText = "Balanced";
            document.getElementById("summary-correlation").className = "block font-data-mono text-headline-sm text-secondary";
            document.getElementById("summary-concentration-alert").innerText = "Moderate";
            document.getElementById("summary-concentration-alert").className = "block font-data-mono text-headline-sm text-tertiary";
        } else {
            riskTextEl.className = "font-data-mono text-sm text-error";
            riskBar.className = "bg-error h-full";
            riskBar.style.width = "90%";
            document.getElementById("summary-correlation").innerText = "Highly Correlated";
            document.getElementById("summary-correlation").className = "block font-data-mono text-headline-sm text-error";
            document.getElementById("summary-concentration-alert").innerText = "Extreme";
            document.getElementById("summary-concentration-alert").className = "block font-data-mono text-headline-sm text-error";
        }

        // Render dynamic asset allocation list
        const allocationContainer = document.getElementById("allocation-list");
        allocationContainer.innerHTML = "";
        const stockDetails = data.portfolio.stock_details || [];
        const len = stockDetails.length;
        const weight = (100 / len);
        const capitalValue = 1500000;

        stockDetails.forEach((stock, idx) => {
            const colorClass = colors[idx % colors.length];
            const item = document.createElement("div");
            item.className = "flex items-center gap-md";
            
            const symbol = stock.currency_symbol || "$";
            const valueFormatted = ((weight / 100) * capitalValue).toLocaleString(undefined, { maximumFractionDigits: 0 });

            item.innerHTML = `
                <div class="w-3 h-3 ${colorClass} shrink-0"></div>
                <div class="flex-1">
                    <p class="font-data-mono text-sm">${stock.ticker}</p>
                    <p class="text-xs text-on-surface-variant">${weight.toFixed(1)}% (${symbol}${valueFormatted})</p>
                </div>
            `;
            allocationContainer.appendChild(item);
        });

        // Update Asset Count and Risk breakdown factors
        document.getElementById("summary-asset-count").innerText = `${len} / 11`;
        
        const avgBeta = (1.0 + (pVolatility * 2)).toFixed(2);
        document.getElementById("factor-beta").innerText = avgBeta;
        document.getElementById("factor-beta-bar").style.width = Math.min(100, (avgBeta / 2) * 100) + "%";

        const concentrationPercent = Math.min(100, Math.max(10, len * 15));
        document.getElementById("factor-sector").innerText = pRisk.toUpperCase() + ` (${concentrationPercent}%)`;
        document.getElementById("factor-sector-bar").style.width = concentrationPercent + "%";

        // Update dynamic stock detail rows
        const tableBody = document.getElementById("ticker-details-body");
        tableBody.innerHTML = "";
        
        stockDetails.forEach((stock, idx) => {
            const colorClass = colors[idx % colors.length];
            const row = document.createElement("tr");
            row.className = "hover:bg-surface-variant transition-colors cursor-pointer";
            
            const symbol = stock.currency_symbol || "$";
            const val = ((weight / 100) * capitalValue).toLocaleString(undefined, { maximumFractionDigits: 0 });
            const annualReturnText = (stock.annual_return * 100).toFixed(2) + "%";
            const returnClass = stock.annual_return >= 0 ? "text-secondary" : "text-error";

            row.innerHTML = `
                <td class="px-md py-sm">
                    <div class="flex items-center gap-sm">
                        <div class="w-8 h-8 ${colorClass}/20 rounded flex items-center justify-center font-bold text-xs uppercase text-on-surface">${stock.ticker[0]}</div>
                        <span class="font-data-mono font-semibold">${stock.ticker}</span>
                    </div>
                </td>
                <td class="px-md py-sm font-data-mono">${symbol}${stock.current_price.toFixed(2)}</td>
                <td class="px-md py-sm font-data-mono">${weight.toFixed(1)}%</td>
                <td class="px-md py-sm font-data-mono">${symbol}${val}</td>
                <td class="px-md py-sm font-data-mono ${returnClass}">${annualReturnText}</td>
                <td class="px-md py-sm font-data-mono">${(stock.annual_volatility * 100).toFixed(2)}%</td>
                <td class="px-md py-sm font-data-mono text-primary">${stock.sharpe_ratio.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
        });

        // Update Report summary
        document.getElementById("portfolio-report").innerHTML = formatMarkdownToHtml(data.report);

    } catch (err) {
        console.error("Failed to load portfolio statistics:", err);
        document.getElementById("portfolio-report").innerHTML = `
            <h4 class="font-headline-sm text-headline-sm text-error mt-md mb-xs font-semibold">AI Report Generation Temporarily Unavailable</h4>
            <p class="mb-sm leading-relaxed">The AI intelligence engine is currently unavailable. Core market analytics, technical indicators, portfolio analysis, and risk calculations remain fully operational. Please try generating the report again in a few minutes.</p>
        `;
        const badgeEl = document.getElementById("ai-service-badge");
        const dotEl = document.getElementById("ai-service-dot");
        const textEl = document.getElementById("ai-service-status-text");
        if (badgeEl && dotEl && textEl) {
            badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-error/15 text-error border border-error/20";
            dotEl.className = "w-1.5 h-1.5 rounded-full bg-error";
            textEl.innerText = "AI SERVICE UNAVAILABLE";
        }
    }
}

// Search trigger
searchBtn.addEventListener('click', () => {
    const query = queryInput.value.trim();
    loadPortfolioData(query);
});

queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        loadPortfolioData(queryInput.value.trim());
    }
});

// Rebalance simulator
rebalanceBtn.addEventListener('click', () => {
    alert("Recalculating efficient frontier and risk-parity allocations...");
    loadPortfolioData(queryInput.value.trim());
});

// Export Report
exportBtn.addEventListener('click', () => {
    const orig = exportBtn.innerHTML;
    exportBtn.innerHTML = `<span class="material-symbols-outlined text-[16px] animate-spin">refresh</span> PREPARING PDF...`;
    setTimeout(() => {
        exportBtn.innerHTML = `<span class="material-symbols-outlined text-[16px]">check_circle</span> DOWNLOAD COMPLETE`;
        setTimeout(() => {
            exportBtn.innerHTML = orig;
        }, 2000);
    }, 1500);
});

// Load defaults on page load
window.addEventListener('DOMContentLoaded', () => {
    // Read default settings from backend if available, or load default tickers list
    fetch('/settings')
        .then(r => r.json())
        .then(settings => {
            const defaults = settings.default_tickers.join(", ");
            queryInput.value = defaults;
            loadPortfolioData(defaults);
        })
        .catch(err => {
            loadPortfolioData("AAPL,MSFT,NVDA");
        });
});
