// Scroll Animation Handler
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
}

// Tooltip Data
const tooltipData = {
    // Trading Parameters
    'initial_capital': {
        title: 'Initial Capital',
        description: 'The starting amount of money invested in the portfolio. Set at ₹20,00,000 for our trading experiments.'
    },
    'max_stock': {
        title: 'Maximum Stock',
        description: 'The maximum number of shares that can be held for any single stock at one time, set to prevent over-concentration.'
    },
    'buy_cost_pct': {
        title: 'Buy Cost Percentage',
        description: 'Transaction cost percentage charged when buying stocks. Typically includes brokerage and exchange fees.'
    },
    'sell_cost_pct': {
        title: 'Sell Cost Percentage',
        description: 'Transaction cost percentage charged when selling stocks. Accounts for market impact and slippage.'
    },
    'reward_scaling': {
        title: 'Reward Scaling',
        description: 'A multiplier applied to normalize rewards during training, helping the agent learn more effectively.'
    },
    
    // Technical Indicators
    'macd': {
        title: 'MACD',
        description: 'Moving Average Convergence Divergence - A trend-following momentum indicator showing the relationship between two moving averages.'
    },
    'rsi': {
        title: 'RSI',
        description: 'Relative Strength Index - Measures the speed and magnitude of price changes to identify overbought or oversold conditions (0-100 scale).'
    },
    'cci': {
        title: 'CCI',
        description: 'Commodity Channel Index - Identifies cyclical trends and measures current price level relative to average price level over time.'
    },
    'adx': {
        title: 'ADX',
        description: 'Average Directional Index - Quantifies trend strength regardless of direction. Values above 25 indicate strong trends.'
    },
    'bollinger_bands': {
        title: 'Bollinger Bands',
        description: 'Volatility bands placed above and below a moving average. Narrow bands suggest low volatility; wide bands suggest high volatility.'
    },
    
    // Performance Metrics
    'sharpe_ratio': {
        title: 'Sharpe Ratio',
        description: 'Risk-adjusted return metric. Higher values indicate better return per unit of risk taken. Above 1 is good, above 2 is very good.'
    },
    'sortino_ratio': {
        title: 'Sortino Ratio',
        description: 'Similar to Sharpe ratio but only considers downside volatility, providing a better measure of risk-adjusted returns.'
    },
    'max_drawdown': {
        title: 'Maximum Drawdown',
        description: 'The largest peak-to-trough decline in portfolio value. Indicates the worst-case loss during the investment period.'
    },
    'annual_volatility': {
        title: 'Annual Volatility',
        description: 'Standard deviation of returns annualized. Measures how much returns fluctuate - higher volatility means higher risk.'
    },
    'win_rate': {
        title: 'Win Rate',
        description: 'Percentage of trading days that resulted in positive returns. Higher win rates indicate more consistent profitability.'
    },
    
    // Algorithms
    'ppo': {
        title: 'PPO (Proximal Policy Optimization)',
        description: 'A policy gradient method that maintains a balance between exploration and exploitation through clipped objective functions.'
    },
    'a2c': {
        title: 'A2C (Advantage Actor-Critic)',
        description: 'Combines value-based and policy-based methods using an actor (policy) and critic (value function) to improve learning stability.'
    },
    'ddpg': {
        title: 'DDPG (Deep Deterministic Policy Gradient)',
        description: 'An off-policy algorithm designed for continuous action spaces, using replay buffers and target networks for stable learning.'
    },
    'td3': {
        title: 'TD3 (Twin Delayed DDPG)',
        description: 'An improvement over DDPG that reduces overestimation bias using twin Q-functions and delayed policy updates.'
    },
    'sac': {
        title: 'SAC (Soft Actor-Critic)',
        description: 'An off-policy algorithm that maximizes expected reward while also maximizing entropy to encourage exploration.'
    },
    'mvo': {
        title: 'MVO (Mean-Variance Optimization)',
        description: 'Traditional portfolio optimization method that balances expected returns against risk (variance). Our baseline comparison.'
    }
};

// Initialize tooltips
function initTooltips() {
    Object.keys(tooltipData).forEach(key => {
        const elements = document.querySelectorAll(`[data-tooltip="${key}"]`);
        elements.forEach(el => {
            if (!el.querySelector('.tooltip')) {
                const data = tooltipData[key];
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerHTML = `
                    <div class="tooltip-title">${data.title}</div>
                    <div class="tooltip-description">${data.description}</div>
                `;
                el.appendChild(tooltip);
            }
        });
    });
}

// Add stagger delay to grid items
function addStaggerAnimation() {
    document.querySelectorAll('.grid').forEach(grid => {
        const items = grid.querySelectorAll('.pastel-card, .stat-card, .chart-container');
        items.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initTooltips();
    addStaggerAnimation();
    initSmoothScroll();
    console.log('Pastel theme initialized with animations and tooltips');
});

// Export for use in other scripts
window.PastelTheme = {
    initScrollAnimations,
    initTooltips,
    tooltipData
};
