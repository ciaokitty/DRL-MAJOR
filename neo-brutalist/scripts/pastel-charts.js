// Enhanced Chart Configurations with Animations
import { projectData } from '../components/data.js';

// Pastel color palette
const pastelColors = {
    pink: 'rgb(255, 179, 186)',
    peach: 'rgb(255, 223, 186)',
    yellow: 'rgb(255, 255, 186)',
    green: 'rgb(186, 255, 201)',
    blue: 'rgb(186, 225, 255)',
    purple: 'rgb(224, 187, 228)',
    mint: 'rgb(199, 255, 237)',
    coral: 'rgb(255, 200, 200)'
};

// Common animation config
const animationConfig = {
    duration: 2000,
    easing: 'easeInOutQuart',
    delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default') {
            delay = context.dataIndex * 50 + context.datasetIndex * 100;
        }
        return delay;
    }
};

// Common tooltip config
const tooltipConfig = {
    backgroundColor: 'white',
    titleColor: '#2D2D2D',
    bodyColor: '#555',
    borderColor: '#000',
    borderWidth: 3,
    padding: 16,
    titleFont: {
        size: 14,
        family: 'Inter',
        weight: '700'
    },
    bodyFont: {
        size: 13,
        family: 'JetBrains Mono'
    },
    boxShadow: '5px 5px 0px rgba(0, 0, 0, 0.3)',
    cornerRadius: 8,
    displayColors: true
};

export function createPortfolioChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const generateTimeSeries = (finalValue, months, volatility = 0.15) => {
        const data = [20000000];
        const monthlyReturn = Math.pow(finalValue / 20000000, 1 / months) - 1;
        
        for (let i = 1; i <= months; i++) {
            const trend = data[i - 1] * (1 + monthlyReturn);
            const noise = trend * (Math.random() - 0.5) * volatility;
            data.push(trend + noise);
        }
        return data;
    };
    
    const months = 21;
    const labels = Array.from({ length: months + 1 }, (_, i) => `Month ${i}`);
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'PPO (Best Performer)',
                    data: generateTimeSeries(41100000, months, 0.12),
                    borderColor: pastelColors.pink,
                    backgroundColor: 'transparent',
                    borderWidth: 4,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: pastelColors.pink,
                    pointHoverBorderColor: pastelColors.pink,
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'A2C',
                    data: generateTimeSeries(39700000, months, 0.14),
                    borderColor: pastelColors.blue,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: pastelColors.blue,
                    pointHoverBorderColor: pastelColors.blue,
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'DDPG',
                    data: generateTimeSeries(37800000, months, 0.16),
                    borderColor: pastelColors.green,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: pastelColors.green,
                    pointHoverBorderColor: pastelColors.green,
                    pointHoverBorderWidth: 3
                },
                {
                    label: 'MVO (Baseline)',
                    data: generateTimeSeries(28400000, months, 0.1),
                    borderColor: pastelColors.purple,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [8, 4],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: pastelColors.purple,
                    pointHoverBorderColor: pastelColors.purple,
                    pointHoverBorderWidth: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    bottom: 20,
                    left: 10,
                    right: 10
                }
            },
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                        label: (context) => {
                            return `${context.dataset.label}: ₹${(context.parsed.y / 10000000).toFixed(2)}Cr`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: { size: 13, family: 'Inter', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        maxRotation: 45,
                        minRotation: 0,
                        autoSkip: true,
                        autoSkipPadding: 10
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `₹${(value / 10000000).toFixed(1)}Cr`
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createReturnsChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const models = projectData.models.map(m => ({
        name: m.name,
        return: parseFloat(m.metrics.annualReturn.replace('%', ''))
    })).sort((a, b) => b.return - a.return);
    
    const colors = [pastelColors.pink, pastelColors.blue, pastelColors.green, pastelColors.peach, pastelColors.purple, pastelColors.coral];
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: models.map(m => m.name),
            datasets: [{
                label: 'Annual Return %',
                data: models.map(m => m.return),
                backgroundColor: models.map((_, i) => colors[i]),
                borderColor: '#000',
                borderWidth: 3,
                borderRadius: 8,
                hoverBackgroundColor: models.map((_, i) => colors[i]),
                hoverBorderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                        label: (context) => `Return: ${context.parsed.y.toFixed(2)}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 13, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createRiskReturnChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const models = projectData.models
        .filter(m => m.metrics.annualVolatility)
        .map(m => ({
            name: m.name,
            return: parseFloat(m.metrics.annualReturn.replace('%', '')),
            volatility: parseFloat(m.metrics.annualVolatility.replace('%', ''))
        }));
    
    const colors = [pastelColors.pink, pastelColors.blue, pastelColors.green, pastelColors.peach, pastelColors.purple];
    
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: models.map((m, i) => ({
                label: m.name,
                data: [{ x: m.volatility, y: m.return }],
                backgroundColor: colors[i],
                borderColor: '#000',
                borderWidth: 3,
                pointRadius: 14,
                pointHoverRadius: 18,
                pointStyle: 'circle'
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 13, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                        label: (context) => [
                            `Return: ${context.parsed.y.toFixed(2)}%`,
                            `Volatility: ${context.parsed.x.toFixed(2)}%`
                        ]
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Annual Volatility (Risk) %',
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 10
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Annual Return %',
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 10
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createBenchmarkChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const { benchmarks } = projectData.benchmarkComparison;
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: benchmarks.map(b => b.name),
            datasets: [
                {
                    label: 'FinRL Literature',
                    data: benchmarks.map(b => parseFloat(b.finrl.replace('%', ''))),
                    backgroundColor: pastelColors.purple,
                    borderColor: '#000',
                    borderWidth: 3,
                    borderRadius: 8
                },
                {
                    label: 'Our Implementation',
                    data: benchmarks.map(b => parseFloat(b.ours.replace('%', ''))),
                    backgroundColor: pastelColors.pink,
                    borderColor: '#000',
                    borderWidth: 3,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 15,
                        usePointStyle: true,
                        boxWidth: 12,
                        boxHeight: 12
                    }
                },
                tooltip: tooltipConfig
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 13, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                },
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createTradingActionsChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Simulate trading actions (buy/sell/hold counts over time)
    const months = 21;
    const labels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);
    
    const generateActions = () => {
        const buy = [];
        const sell = [];
        const hold = [];
        for (let i = 0; i < months; i++) {
            const total = 100;
            const b = Math.floor(Math.random() * 40 + 20);
            const s = Math.floor(Math.random() * 40 + 20);
            const h = total - b - s;
            buy.push(b);
            sell.push(s);
            hold.push(h);
        }
        return { buy, sell, hold };
    };
    
    const actions = generateActions();
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Buy Actions',
                    data: actions.buy,
                    backgroundColor: pastelColors.green,
                    borderColor: '#000',
                    borderWidth: 2
                },
                {
                    label: 'Sell Actions',
                    data: actions.sell,
                    backgroundColor: pastelColors.coral,
                    borderColor: '#000',
                    borderWidth: 2
                },
                {
                    label: 'Hold Actions',
                    data: actions.hold,
                    backgroundColor: pastelColors.yellow,
                    borderColor: '#000',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 12
                    }
                },
                tooltip: tooltipConfig
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: {
                        font: { size: 12, family: 'Inter', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                },
                y: {
                    stacked: true,
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createCumulativeReturnsChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const months = 21;
    const labels = Array.from({ length: months + 1 }, (_, i) => `Month ${i}`);
    
    const generateCumulativeReturns = (annualReturn) => {
        const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
        const returns = [0];
        for (let i = 1; i <= months; i++) {
            const volatility = (Math.random() - 0.5) * 0.05;
            returns.push((1 + returns[i - 1]) * (1 + monthlyReturn + volatility) - 1);
        }
        return returns.map(r => r * 100);
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'PPO',
                    data: generateCumulativeReturns(27.14),
                    borderColor: pastelColors.pink,
                    backgroundColor: pastelColors.pink + '33',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'A2C',
                    data: generateCumulativeReturns(24.21),
                    borderColor: pastelColors.blue,
                    backgroundColor: pastelColors.blue + '33',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'DDPG',
                    data: generateCumulativeReturns(18.52),
                    borderColor: pastelColors.green,
                    backgroundColor: pastelColors.green + '33',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'MVO',
                    data: generateCumulativeReturns(9.33),
                    borderColor: pastelColors.purple,
                    borderDash: [5, 5],
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 12
                    }
                },
                tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 12, family: 'Inter', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                },
                y: {
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createDailyReturnsDistribution(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Create histogram bins for daily returns distribution
    const binLabels = [];
    for (let i = -4; i <= 4; i += 0.5) {
        binLabels.push(`${i.toFixed(1)}%`);
    }
    
    // Generate normal distribution data
    const generateDistribution = (mean, std) => {
        const data = [];
        for (let i = -4; i <= 4; i += 0.5) {
            const x = i;
            const exp = Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
            const y = (1 / (std * Math.sqrt(2 * Math.PI))) * exp * 100;
            data.push(y);
        }
        return data;
    };
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: binLabels,
            datasets: [
                {
                    label: 'PPO',
                    data: generateDistribution(0.15, 1.2),
                    borderColor: pastelColors.pink,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'A2C',
                    data: generateDistribution(0.12, 1.4),
                    borderColor: pastelColors.blue,
                    backgroundColor: 'transparent',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'MVO',
                    data: generateDistribution(0.05, 0.9),
                    borderColor: pastelColors.purple,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 12
                    }
                },
                tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                        label: (context) => `Frequency: ${context.parsed.y.toFixed(2)}`
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Daily Return %',
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 10
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 12, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Frequency',
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 10
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                }
            },
            animation: animationConfig
        }
    });
}

export function createVolatilityChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const models = projectData.models
        .filter(m => m.metrics.annualVolatility)
        .map(m => ({
            name: m.name,
            volatility: parseFloat(m.metrics.annualVolatility.replace('%', ''))
        }))
        .sort((a, b) => a.volatility - b.volatility);
    
    const colors = models.map((_, i) => [pastelColors.green, pastelColors.blue, pastelColors.peach, pastelColors.pink, pastelColors.purple][i % 5]);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: models.map(m => m.name),
            datasets: [{
                label: 'Volatility %',
                data: models.map(m => m.volatility),
                backgroundColor: colors,
                borderColor: '#000',
                borderWidth: 3,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { display: false },
                tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                        label: (context) => `Volatility: ${context.parsed.x.toFixed(2)}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(0, 0, 0, 0.1)', lineWidth: 1 },
                    ticks: {
                        font: { size: 13, family: 'JetBrains Mono', weight: '600' },
                        color: '#2D2D2D',
                        padding: 8,
                        callback: (value) => `${value}%`
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 13, family: 'Inter', weight: '700' },
                        color: '#2D2D2D',
                        padding: 8
                    }
                }
            },
            animation: animationConfig
        }
    });
}
