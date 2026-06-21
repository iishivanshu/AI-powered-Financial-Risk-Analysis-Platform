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

// Update Time
function updateTime() {
    const timeEl = document.getElementById('footer-time');
    if (timeEl) {
        const now = new Date();
        timeEl.innerText = now.toUTCString().replace("GMT", "UTC");
    }
}
setInterval(updateTime, 1000);
updateTime();

// Tabs Logic
const tabBtnMap = document.getElementById('tab-btn-map');
const tabBtnReport = document.getElementById('tab-btn-report');
const tabContentMap = document.getElementById('tab-content-map');
const tabContentReport = document.getElementById('tab-content-report');

tabBtnMap.addEventListener('click', () => {
    tabBtnMap.className = "font-label-caps text-label-caps text-primary border-b-2 border-primary pb-xs transition-all outline-none";
    tabBtnReport.className = "font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface pb-xs transition-all outline-none";
    tabContentMap.classList.remove('hidden');
    tabContentReport.classList.add('hidden');
});

tabBtnReport.addEventListener('click', () => {
    tabBtnReport.className = "font-label-caps text-label-caps text-primary border-b-2 border-primary pb-xs transition-all outline-none";
    tabBtnMap.className = "font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface pb-xs transition-all outline-none";
    tabContentReport.classList.remove('hidden');
    tabContentMap.classList.add('hidden');
});

// Volatility Projection Map Dynamic Animation & Simulation
let mapAnimationId = null;
let particles = [];

function animateVolatilityMap(annualReturn, annualVolatility) {
    const canvas = document.getElementById("volatility-map-canvas");
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    const mu = annualReturn;
    const sigma = Math.max(0.03, annualVolatility);
    const minX = mu - 3.5 * sigma;
    const maxX = mu + 3.5 * sigma;
    
    function getCanvasX(val) {
        return ((val - minX) / (maxX - minX)) * width;
    }
    
    function getProbabilityDensity(val) {
        const exponent = -0.5 * Math.pow((val - mu) / sigma, 2);
        return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
    }
    
    const maxDensity = getProbabilityDensity(mu);
    const graphHeight = height - 55;
    
    function getCanvasY(density) {
        return (height - 25) - (density / maxDensity) * graphHeight;
    }
    
    particles = [];
    if (mapAnimationId) {
        cancelAnimationFrame(mapAnimationId);
    }
    
    function step() {
        if (!canvas.getContext) return;
        ctx.clearRect(0, 0, width, height);
        
        // Draw background grid lines
        ctx.strokeStyle = "rgba(140, 144, 159, 0.04)";
        ctx.lineWidth = 1;
        const gridCols = 8;
        for (let i = 1; i < gridCols; i++) {
            const x = (width / gridCols) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height - 25);
            ctx.stroke();
        }
        
        // Draw Shaded Bands (standard deviation zones)
        // 3-sigma
        ctx.fillStyle = "rgba(255, 185, 95, 0.02)";
        drawBand(mu - 3*sigma, mu + 3*sigma);
        
        // 2-sigma
        ctx.fillStyle = "rgba(173, 198, 255, 0.05)";
        drawBand(mu - 2*sigma, mu + 2*sigma);
        
        // 1-sigma
        ctx.fillStyle = "rgba(78, 222, 163, 0.10)";
        drawBand(mu - 1*sigma, mu + 1*sigma);
        
        // Draw Curve
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
            const val = minX + ((maxX - minX) / 100) * i;
            ctx.lineTo(getCanvasX(val), getCanvasY(getProbabilityDensity(val)));
        }
        ctx.strokeStyle = "rgba(78, 222, 163, 0.85)";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Spawn particles for real-time Monte Carlo drops
        if (particles.length < 120) {
            for (let i = 0; i < 2; i++) {
                const sample = randomNormal(mu, sigma);
                const targetX = getCanvasX(sample);
                const targetY = getCanvasY(getProbabilityDensity(sample));
                
                particles.push({
                    x: targetX,
                    y: 0,
                    targetY: targetY,
                    alpha: 1.0,
                    speed: 1.5 + Math.random() * 2,
                    radius: 1 + Math.random() * 1.5
                });
            }
        }
        
        // Update and draw particles
        particles.forEach((p) => {
            p.y += p.speed;
            if (p.y >= p.targetY) {
                p.y = p.targetY;
                p.alpha -= 0.025; // fade out on bell curve contact
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(78, 222, 163, ${p.alpha})`;
            ctx.fill();
        });
        
        particles = particles.filter(p => p.alpha > 0);
        
        // Draw mean vertical line
        const meanX = getCanvasX(mu);
        ctx.strokeStyle = "rgba(173, 198, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(meanX, 0);
        ctx.lineTo(meanX, height - 25);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Mean text label
        ctx.fillStyle = "#adc6ff";
        ctx.font = "9px JetBrains Mono";
        ctx.textAlign = "center";
        ctx.fillText("MEAN (" + (mu * 100).toFixed(1) + "%)", meanX, 12);
        
        // Standard Deviation Labels
        const labels = [
            { val: mu - 2 * sigma, text: "-2σ" },
            { val: mu - 1 * sigma, text: "-1σ" },
            { val: mu + 1 * sigma, text: "+1σ" },
            { val: mu + 2 * sigma, text: "+2σ" }
        ];
        
        ctx.fillStyle = "rgba(229, 226, 225, 0.5)";
        labels.forEach(lbl => {
            const lx = getCanvasX(lbl.val);
            ctx.fillText(lbl.text + " (" + (lbl.val * 100).toFixed(0) + "%)", lx, height - 10);
        });
        
        // Baseline
        ctx.strokeStyle = "rgba(140, 144, 159, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height - 25);
        ctx.lineTo(width, height - 25);
        ctx.stroke();
        
        mapAnimationId = requestAnimationFrame(step);
    }
    
    function drawBand(startVal, endVal) {
        ctx.beginPath();
        ctx.moveTo(getCanvasX(startVal), height - 25);
        const steps = 30;
        for (let i = 0; i <= steps; i++) {
            const val = startVal + ((endVal - startVal) / steps) * i;
            ctx.lineTo(getCanvasX(val), getCanvasY(getProbabilityDensity(val)));
        }
        ctx.lineTo(getCanvasX(endVal), height - 25);
        ctx.closePath();
        ctx.fill();
    }
    
    function randomNormal(mean, stdDev) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return num * stdDev + mean;
    }
    
    step();
}

// Run Analysis Logic
const runBtn = document.getElementById('run-analysis-btn');
const tickerInput = document.getElementById('ticker-input');

async function triggerAnalysis(ticker) {
    if (!ticker) {
        alert("Please enter a valid stock ticker symbol");
        return;
    }
    
    runBtn.disabled = true;
    runBtn.innerHTML = `<span class="material-symbols-outlined animate-spin">refresh</span> ANALYZING...`;
    document.getElementById("active-ticker-title").innerText = ticker;
    document.getElementById("active-ticker-price").innerText = "Analyzing...";
    
    // Add pulse animations to visualization nodes
    const nodes = ['node-market', 'node-technical', 'node-risk', 'node-news', 'node-report'];
    nodes.forEach((node, i) => {
        setTimeout(() => {
            document.getElementById(node).classList.add('node-pulse');
        }, i * 200);
    });

    try {
        const response = await fetch(`/analyze/${ticker}`);
        if (!response.ok) {
            throw new Error(`Server returned error status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Analysis Data Received:", data);

        const aiStatus = data.ai_status || "online";
        const badgeEl = document.getElementById("ai-service-badge");
        const dotEl = document.getElementById("ai-service-dot");
        const textEl = document.getElementById("ai-service-status-text");

        if (badgeEl && dotEl && textEl) {
            if (aiStatus === "online") {
                badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-secondary/15 text-secondary border border-secondary/20";
                dotEl.className = "w-1.5 h-1.5 rounded-full bg-secondary animate-pulse";
                textEl.innerText = "AI SERVICE ONLINE";
            } else if (aiStatus === "limited") {
                badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-tertiary/15 text-tertiary border border-tertiary/20";
                dotEl.className = "w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse";
                textEl.innerText = "AI SERVICE LIMITED";
            } else {
                badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-error/15 text-error border border-error/20";
                dotEl.className = "w-1.5 h-1.5 rounded-full bg-error";
                textEl.innerText = "AI SERVICE UNAVAILABLE";
            }
        }

        // Update Active Ticker Title and Price
        const symbol = data.market.currency_symbol || "$";
        document.getElementById("active-ticker-title").innerText = data.ticker;
        document.getElementById("active-ticker-price").innerText = symbol + data.market.current_price.toFixed(2);

        // Update Market
        document.getElementById("market-price").innerText = symbol + data.market.current_price.toFixed(2);
        document.getElementById("market-return").innerText = (data.market.annual_return * 100).toFixed(2) + "%";
        document.getElementById("market-volatility").innerText = (data.market.annual_volatility * 100).toFixed(2) + "%";
        document.getElementById("market-sharpe").innerText = data.market.sharpe_ratio.toFixed(2);

        // Update Volatility Projection Map
        if (data.market) {
            animateVolatilityMap(data.market.annual_return, data.market.annual_volatility);
        }

        // Update Technical
        document.getElementById("sma-50").innerText = symbol + data.technical.sma50.toFixed(2);
        document.getElementById("sma-200").innerText = symbol + data.technical.sma200.toFixed(2);
        
        const trendText = data.technical.trend.toUpperCase();
        document.getElementById("trend-text").innerText = trendText;
        const trendBadge = document.getElementById("trend-badge");
        const trendIcon = document.getElementById("trend-icon");
        if (trendText === "BULLISH") {
            trendBadge.className = "inline-flex items-center gap-sm bg-secondary/10 text-secondary px-md py-xs rounded border border-secondary/20";
            trendIcon.innerText = "trending_up";
        } else {
            trendBadge.className = "inline-flex items-center gap-sm bg-error/10 text-error px-md py-xs rounded border border-error/20";
            trendIcon.innerText = "trending_down";
        }

        // Update Risk
        document.getElementById("risk-score").innerText = data.risk.risk_score;
        document.getElementById("risk-level").innerText = data.risk.risk_level;
        
        // Colorize risk level based on risk_level
        const riskLevelEl = document.getElementById("risk-level");
        const riskScoreEl = document.getElementById("risk-score");
        const scoreBar = document.getElementById("risk-score-bar");
        const riskScorePercent = (data.risk.risk_score / 10) * 100;
        scoreBar.style.width = riskScorePercent + "%";
        
        if (data.risk.risk_level.toLowerCase().includes("low")) {
            riskLevelEl.className = "font-body-lg text-secondary";
            riskScoreEl.className = "font-data-mono text-secondary";
            scoreBar.className = "h-full bg-secondary rounded-full";
        } else if (data.risk.risk_level.toLowerCase().includes("medium") || data.risk.risk_level.toLowerCase().includes("moderate")) {
            riskLevelEl.className = "font-body-lg text-secondary"; // corrected color match from page script details
            riskLevelEl.className = "font-body-lg text-tertiary";
            riskScoreEl.className = "font-data-mono text-tertiary";
            scoreBar.className = "h-full bg-tertiary rounded-full";
        } else {
            riskLevelEl.className = "font-body-lg text-error";
            riskScoreEl.className = "font-data-mono text-error";
            scoreBar.className = "h-full bg-error rounded-full";
        }

        // Update News Intelligence
        document.getElementById("news-outlook").innerHTML = formatMarkdownToHtml(data.news);
        
        // Set default sentiment indicator
        const sentimentLabel = document.getElementById("sentiment-label");
        const sentimentIndicator = document.getElementById("sentiment-indicator");
        
        let detectedSentiment = "NEUTRAL";
        if (data.news.toUpperCase().includes("BULLISH")) detectedSentiment = "BULLISH";
        if (data.news.toUpperCase().includes("BEARISH")) detectedSentiment = "BEARISH";
        
        sentimentLabel.innerText = detectedSentiment + " SENTIMENT";
        if (detectedSentiment === "BULLISH") {
            sentimentIndicator.className = "w-2 h-2 rounded-full bg-secondary";
        } else if (detectedSentiment === "BEARISH") {
            sentimentIndicator.className = "w-2 h-2 rounded-full bg-error";
        } else {
            sentimentIndicator.className = "w-2 h-2 rounded-full bg-tertiary";
        }

        // Try to parse themes dynamically from the news agent response
        const themeContainer = document.getElementById("news-themes-container");
        themeContainer.innerHTML = "";
        
        // Simple regex to parse capitalized words or themes
        const themes = [];
        const regex = /(?:Key Themes|Themes):\s*(.*?)(?=\n|$)/i;
        const match = data.news.match(regex);
        if (match && match[1]) {
            match[1].split(',').forEach(theme => {
                const clean = theme.replace(/[*-]/g, '').trim().toUpperCase();
                if (clean.length > 2 && clean.length < 25) themes.push(clean);
            });
        }
        
        // Fallback themes if parser yields empty results
        if (themes.length === 0) {
            themes.push(ticker + "-VOLATILITY", "MACRO-OUTLOOK", "LIQUIDITY-FLOW");
        }
        
        themes.forEach(t => {
            const span = document.createElement("span");
            span.className = "bg-surface-variant px-sm py-xs text-[11px] font-data-mono rounded uppercase tracking-wider";
            span.innerText = t;
            themeContainer.appendChild(span);
        });

        // Update AI Analyst Report
        document.getElementById("ai-report-box").innerHTML = formatMarkdownToHtml(data.report);

    } catch (err) {
        console.error("Analysis Failed:", err);
        alert("Failed to fetch analysis data: " + err.message);
        
        const badgeEl = document.getElementById("ai-service-badge");
        const dotEl = document.getElementById("ai-service-dot");
        const textEl = document.getElementById("ai-service-status-text");
        if (badgeEl && dotEl && textEl) {
            badgeEl.className = "inline-flex items-center gap-xs px-sm py-[2px] rounded text-[10px] font-semibold bg-error/15 text-error border border-error/20";
            dotEl.className = "w-1.5 h-1.5 rounded-full bg-error";
            textEl.innerText = "AI SERVICE UNAVAILABLE";
        }
    } finally {
        // Clear pulses
        nodes.forEach(node => {
            document.getElementById(node).classList.remove('node-pulse');
        });
        runBtn.disabled = false;
        runBtn.innerHTML = `<span class="material-symbols-outlined">bolt</span> RUN AI ANALYSIS`;
    }
}

runBtn.addEventListener('click', () => {
    const ticker = tickerInput.value.trim().toUpperCase();
    triggerAnalysis(ticker);
});

// Search inputs on Enter
tickerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const ticker = tickerInput.value.trim().toUpperCase();
        triggerAnalysis(ticker);
    }
});

// Live feeds interaction
document.getElementById('live-feeds-nav').addEventListener('click', () => {
    alert("Live Feed Streams active. Monitoring yfinance sockets...");
});

// Initialize with default ticker NVDA on load
window.addEventListener('DOMContentLoaded', () => {
    triggerAnalysis("NVDA");
});
