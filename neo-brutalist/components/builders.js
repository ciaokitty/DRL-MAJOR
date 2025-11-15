// Component Builders Module
import { projectData } from './data.js';

export function buildHeader() {
    const { title, subtitle, description } = projectData.header;
    return `
        <header class="neo-header">
            <div class="neo-header__content text-center">
                <h1 class="neo-header__title">${title}</h1>
                <p class="neo-header__subtitle">${subtitle}</p>
                <p class="neo-header__description">${description}</p>
            </div>
        </header>
    `;
}

export function buildStatCard(stat) {
    const changeClass = `stat-card__change--${stat.type}`;
    return `
        <div class="stat-card">
            <div class="stat-card__label">${stat.label}</div>
            <div class="stat-card__value">${stat.value}</div>
            <div class="stat-card__change ${changeClass}">${stat.change}</div>
        </div>
    `;
}

export function buildStatsGrid() {
    const statsHTML = projectData.stats.map(stat => buildStatCard(stat)).join('');
    return `
        <div class="section">
            <div class="section__header">
                <h2 class="section__title">Investment Overview</h2>
                <p class="section__description">Starting with ₹20,00,000 initial capital, testing across multiple DRL algorithms</p>
            </div>
            <div class="grid grid-cols-4">
                ${statsHTML}
            </div>
        </div>
    `;
}

export function buildModelCard(model) {
    const metricsHTML = Object.entries(model.metrics).map(([key, value]) => {
        const isHighlight = model.highlight.includes(key);
        const valueClass = isHighlight ? 'model-card__metric-value--highlight' : '';
        const label = key.replace(/([A-Z])/g, ' $1').trim();
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
        
        return `
            <div class="model-card__metric">
                <span class="model-card__metric-label">${formattedLabel}</span>
                <span class="model-card__metric-value ${valueClass}">${value}</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="model-card">
            <div class="model-card__header">
                <h3 class="model-card__title">${model.name}</h3>
                <div class="model-card__badge model-card__badge--${model.badge.variant}">
                    ${model.badge.text}
                </div>
            </div>
            <div class="model-card__metrics">
                ${metricsHTML}
            </div>
        </div>
    `;
}

export function buildModelsGrid() {
    const modelsHTML = projectData.models.map(model => buildModelCard(model)).join('');
    return `
        <div class="section">
            <div class="section__header">
                <h2 class="section__title">Algorithm Performance</h2>
                <p class="section__description">Comparing 5 Deep Reinforcement Learning models + Mean-Variance Optimization baseline</p>
            </div>
            <div class="grid grid-cols-3">
                ${modelsHTML}
            </div>
        </div>
    `;
}

export function buildInfoCard(info) {
    const itemsHTML = info.items.map(item => `
        <li class="info-card__list-item">
            <span class="info-card__list-label">${item.label}</span>
            <span class="info-card__list-value">${item.value}</span>
        </li>
    `).join('');
    
    return `
        <div class="info-card">
            <h4 class="info-card__title">${info.title}</h4>
            <ul class="info-card__list">
                ${itemsHTML}
            </ul>
        </div>
    `;
}

export function buildEnvironmentSection() {
    const cardsHTML = projectData.environment.map(info => buildInfoCard(info)).join('');
    return `
        <div class="section">
            <div class="section__header">
                <h2 class="section__title">FinRL Environment</h2>
                <p class="section__description">Trading environment parameters and constraints</p>
            </div>
            <div class="grid grid-cols-4">
                ${cardsHTML}
            </div>
        </div>
    `;
}

export function buildInsightCard(insight) {
    return `
        <div class="info-card info-card--highlight">
            <h4 class="info-card__title">${insight.title}</h4>
            <div class="info-card__content">
                <p>${insight.content}</p>
            </div>
        </div>
    `;
}

export function buildInsightsSection() {
    const insightsHTML = projectData.insights.map(insight => buildInsightCard(insight)).join('');
    return `
        <div class="section">
            <div class="section__header">
                <h2 class="section__title">Key Insights</h2>
                <p class="section__description">Understanding our results and their implications</p>
            </div>
            <div class="section__content">
                ${insightsHTML}
            </div>
        </div>
    `;
}

export function buildFooter() {
    return `
        <footer class="neo-footer">
            <h3 class="neo-footer__title">DRL-Stonks Project</h3>
            <p class="neo-footer__subtitle">Deep Reinforcement Learning for Strategic Stock Trading</p>
            <div class="neo-footer__divider"></div>
            <p class="neo-footer__credits">Built with FinRL • Stable-Baselines3 • Chart.js</p>
        </footer>
    `;
}
