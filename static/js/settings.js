const configTickers = document.getElementById("config-tickers");
const configPeriod = document.getElementById("config-period");
const configPages = document.getElementById("config-pages");
const saveBtn = document.getElementById("save-preferences-btn");
const discardBtn = document.getElementById("discard-changes-btn");
const generateKeyBtn = document.getElementById("generate-key-btn");
const apiKeysBody = document.getElementById("api-keys-body");

// Simple switch toggler micro-interaction
document.querySelectorAll('[role="switch"]').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const isChecked = toggle.getAttribute('aria-checked') === 'true';
        toggle.setAttribute('aria-checked', !isChecked);

        const circle = toggle.querySelector('span');
        if (!isChecked) {
            toggle.classList.remove('bg-surface-container-highest');
            toggle.classList.add('bg-secondary');
            circle.classList.remove('translate-x-0');
            circle.classList.add('translate-x-5');
        } else {
            toggle.classList.remove('bg-secondary');
            toggle.classList.add('bg-surface-container-highest');
            circle.classList.remove('translate-x-5');
            circle.classList.add('translate-x-0');
        }
    });
});

// Theme preference visual selector
function initThemeBtns() {
    const btns = [
        { el: document.getElementById('theme-dark-btn'), icon: document.getElementById('theme-dark-icon') },
        { el: document.getElementById('theme-light-btn'), icon: document.getElementById('theme-light-icon') },
        { el: document.getElementById('theme-bloomberg-btn'), icon: document.getElementById('theme-bloomberg-icon') }
    ];

    btns.forEach(btnConfig => {
        btnConfig.el.addEventListener('click', () => {
            btns.forEach(b => {
                b.el.classList.remove('border-2', 'border-primary');
                const badge = b.el.querySelector('.badge-active');
                if (badge) badge.remove();
                b.icon.className = 'material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors';
            });

            btnConfig.el.classList.add('border-2', 'border-primary');
            btnConfig.icon.className = 'material-symbols-outlined text-primary';

            const badge = document.createElement('div');
            badge.className = 'badge-active mt-base px-sm py-xs bg-primary-container text-on-primary-container text-[10px] font-bold rounded';
            badge.textContent = 'ACTIVE';
            btnConfig.el.appendChild(badge);
        });
    });
}
initThemeBtns();

// Load settings configuration
async function fetchConfig() {
    try {
        const response = await fetch('/settings');
        if (!response.ok) throw new Error("Load failed");
        const data = await response.json();
        console.log("Settings parameters loaded:", data);

        configTickers.value = data.default_tickers.join(", ");
        configPeriod.value = data.analysis_period;

        // Render page chips
        configPages.innerHTML = "";
        data.available_pages.forEach(p => {
            const tag = document.createElement("span");
            tag.className = "bg-primary-container/20 text-primary border border-primary-container/30 px-sm py-xs text-[10px] font-data-mono rounded uppercase tracking-wider";
            tag.innerText = p.replace("_", " ");
            configPages.appendChild(tag);
        });

    } catch (err) {
        console.error("Failed to load configs:", err);
    }
}

// Save preferences to endpoint
saveBtn.addEventListener('click', async () => {
    const list = configTickers.value.split(",").map(s => s.trim().toUpperCase()).filter(s => s);
    const period = configPeriod.value;

    saveBtn.disabled = true;
    saveBtn.innerText = "SAVING...";

    try {
        const response = await fetch('/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                default_tickers: list,
                analysis_period: period
            })
        });

        if (!response.ok) throw new Error("Save settings failed");

        const res = await response.json();
        console.log("Settings saved successfully:", res);
        alert("Preferences saved successfully!");
        await fetchConfig();

    } catch (err) {
        alert("Failed to save: " + err.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "SAVE PREFERENCES";
    }
});

// Discard Changes
discardBtn.addEventListener('click', () => {
    fetchConfig();
    alert("Settings changes discarded.");
});

// Generate dynamic key row
generateKeyBtn.addEventListener('click', () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const keyName = `institution-key-${randomId}`;
    const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });

    const tr = document.createElement("tr");
    tr.className = "hover:bg-surface-variant transition-colors group";
    tr.innerHTML = `
        <td class="px-md py-sm">
            <p class="font-data-mono text-data-mono text-on-surface">${keyName}</p>
            <p class="text-[10px] text-on-surface-variant">Created ${dateStr}</p>
        </td>
        <td class="px-md py-sm">
            <span class="inline-flex items-center gap-xs px-sm py-[2px] rounded-full bg-secondary-container/20 text-secondary text-[11px] font-semibold uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                Active
            </span>
        </td>
        <td class="px-md py-sm font-data-mono text-data-mono text-on-surface-variant">Never</td>
        <td class="px-md py-sm text-right">
            <button class="text-on-surface-variant hover:text-error transition-colors p-sm" onclick="this.closest('tr').remove();">
                <span class="material-symbols-outlined text-[20px]">delete</span>
            </button>
        </td>
    `;
    apiKeysBody.appendChild(tr);
    alert(`Key generated successfully: ${keyName}`);
});

// Load config on page startup
window.addEventListener('DOMContentLoaded', fetchConfig);
