// Main Application Entry Point for Pastel Theme
import { projectData } from './components/data.js';
import { 
    createPortfolioChart, 
    createReturnsChart, 
    createRiskReturnChart, 
    createBenchmarkChart,
    createTradingActionsChart,
    createCumulativeReturnsChart,
    createDailyReturnsDistribution,
    createVolatilityChart
} from './scripts/pastel-charts.js';

// Build stats grid
function buildStatsGrid() {
    const grid = document.getElementById('statsGrid');
    const html = projectData.stats.map(stat => `
        <div class="stat-card">
            <div class="stat-value">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
    grid.innerHTML = html;
}

// Build models grid
function buildModelsGrid() {
    const grid = document.getElementById('modelsGrid');
    const colors = ['pink', 'blue', 'green', 'peach', 'purple', 'coral'];
    const html = projectData.models.map((model, i) => `
        <div class="model-card card-${colors[i % colors.length]}">
            <div class="model-header">
                <h3>${model.name}</h3>
                <span class="badge badge-${model.badge.variant}">${model.badge.text}</span>
            </div>
            <div class="model-metrics">
                <div class="metric">
                    <span class="metric-label">Final Value</span>
                    <span class="metric-value">${model.metrics.finalValue}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Annual Return</span>
                    <span class="metric-value">${model.metrics.annualReturn}</span>
                </div>
                <div class="metric">
                    <span class="metric-label"><span class="tooltip-wrapper" data-tooltip="sharpe_ratio">Sharpe Ratio</span></span>
                    <span class="metric-value">${model.metrics.sharpeRatio}</span>
                </div>
                <div class="metric">
                    <span class="metric-label"><span class="tooltip-wrapper" data-tooltip="max_drawdown">Max Drawdown</span></span>
                    <span class="metric-value">${model.metrics.maxDrawdown}</span>
                </div>
            </div>
        </div>
    `).join('');
    grid.innerHTML = html;
}

// Build environment grid
function buildEnvironmentGrid() {
    const grid = document.getElementById('environmentGrid');
    const colors = ['pink', 'peach', 'yellow', 'green'];
    const html = projectData.environment.map((item, i) => `
        <div class="env-card card-${colors[i % colors.length]}">
            <h3>${item.title}</h3>
            <ul class="env-list">
                ${item.items.map(envItem => `
                    <li><span class="env-label">${envItem.label}:</span> <span class="env-value">${envItem.value}</span></li>
                `).join('')}
            </ul>
        </div>
    `).join('');
    grid.innerHTML = html;
}

// Build insights grid
function buildInsightsGrid() {
    const grid = document.getElementById('insightsGrid');
    const colors = ['blue', 'purple', 'mint', 'coral'];
    const html = projectData.insights.map((item, i) => `
        <div class="insight-card card-${colors[i % colors.length]}">
            <h3>${item.title}</h3>
            <p>${item.content}</p>
        </div>
    `).join('');
    grid.innerHTML = html;
}

// Build metrics table
function buildMetricsTable() {
    const table = document.getElementById('metricsTable');
    const headers = [
        'Algorithm',
        'Final Value',
        'Annual Return',
        '<span class="tooltip-wrapper" data-tooltip="sharpe_ratio">Sharpe Ratio</span>',
        '<span class="tooltip-wrapper" data-tooltip="sortino_ratio">Sortino Ratio</span>',
        '<span class="tooltip-wrapper" data-tooltip="max_drawdown">Max Drawdown</span>',
        '<span class="tooltip-wrapper" data-tooltip="win_rate">Win Rate</span>',
        'Volatility'
    ];
    
    const headerRow = `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
    
    const rows = projectData.models.map(model => `
        <tr>
            <td><strong>${model.name}</strong></td>
            <td>${model.metrics.finalValue}</td>
            <td><strong>${model.metrics.annualReturn}</strong></td>
            <td>${model.metrics.sharpeRatio}</td>
            <td>${model.metrics.sortinoRatio}</td>
            <td>${model.metrics.maxDrawdown}</td>
            <td>${model.metrics.winRate}</td>
            <td>${model.metrics.annualVolatility}</td>
        </tr>
    `).join('');
    
    table.innerHTML = headerRow + `<tbody>${rows}</tbody>`;
}

// Build benchmark details
function buildBenchmarkDetails() {
    const container = document.getElementById('benchmarkDetails');
    const { benchmarks } = projectData.benchmarkComparison;
    
    const html = `
        <div class="benchmark-grid">
            ${benchmarks.map(benchmark => `
                <div class="benchmark-item">
                    <h4>${benchmark.name}</h4>
                    <div class="benchmark-values">
                        <div class="benchmark-value">
                            <span class="label">FinRL Literature:</span>
                            <span class="value">${benchmark.finrl}</span>
                        </div>
                        <div class="benchmark-value">
                            <span class="label">Our Implementation:</span>
                            <span class="value value-highlight">${benchmark.ours}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// Initialize charts with stagger delay
function initializeCharts() {
    const charts = [
        { id: 'portfolioChart', fn: createPortfolioChart, delay: 0 },
        { id: 'returnsChart', fn: createReturnsChart, delay: 200 },
        { id: 'riskReturnChart', fn: createRiskReturnChart, delay: 400 },
        { id: 'benchmarkChart', fn: createBenchmarkChart, delay: 600 },
        { id: 'cumulativeReturnsChart', fn: createCumulativeReturnsChart, delay: 800 },
        { id: 'tradingActionsChart', fn: createTradingActionsChart, delay: 1000 },
        { id: 'dailyReturnsChart', fn: createDailyReturnsDistribution, delay: 1200 },
        { id: 'volatilityChart', fn: createVolatilityChart, delay: 1400 }
    ];
    
    charts.forEach(({ id, fn, delay }) => {
        setTimeout(() => {
            try {
                fn(id);
                console.log(`Chart ${id} initialized`);
            } catch (error) {
                console.error(`Error initializing ${id}:`, error);
            }
        }, delay);
    });
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DRL-Stonks Application Initializing...');
    console.log('Project Data:', projectData);
    
    try {
        // Build all content sections
        buildStatsGrid();
        buildModelsGrid();
        buildEnvironmentGrid();
        buildInsightsGrid();
        buildMetricsTable();
        buildBenchmarkDetails();
        
        console.log('Content sections built');
        
        // Initialize charts with delay for smooth animation
        setTimeout(() => {
            initializeCharts();
        }, 500);
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Error loading application. Check console for details.');
    }
});

// Export for debugging
window.DRLStonks = {
    projectData,
    rebuild: () => {
        buildStatsGrid();
        buildModelsGrid();
        buildEnvironmentGrid();
        buildInsightsGrid();
        buildMetricsTable();
        buildBenchmarkDetails();
    }
};
