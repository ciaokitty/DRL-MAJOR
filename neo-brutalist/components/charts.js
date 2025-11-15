// Chart Rendering Module
import { projectData } from './data.js';

export function createPortfolioChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate mock time series data based on final values
    const generateTimeSeries = (finalValue, months, volatility = 0.15) => {
        const data = [20000000]; // Start with ₹20L
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
    
    const datasets = [
        {
            label: 'PPO (Best)',
            data: generateTimeSeries(41100000, months, 0.12),
            borderColor: 'hsl(24 95% 53%)',
            backgroundColor: 'hsla(24, 95%, 53%, 0.1)',
            borderWidth: 4,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        },
        {
            label: 'A2C',
            data: generateTimeSeries(39700000, months, 0.14),
            borderColor: 'hsl(217 91% 60%)',
            backgroundColor: 'hsla(217, 91%, 60%, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        },
        {
            label: 'DDPG',
            data: generateTimeSeries(37800000, months, 0.16),
            borderColor: 'hsl(142 71% 45%)',
            backgroundColor: 'hsla(142, 71%, 45%, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        },
        {
            label: 'MVO (Baseline)',
            data: generateTimeSeries(28400000, months, 0.1),
            borderColor: 'hsl(240 4% 46%)',
            backgroundColor: 'hsla(240, 4%, 46%, 0.05)',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
        }
    ];
    
    return new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 14, family: 'Inter', weight: '700' },
                        color: '#0a0a0a',
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'line'
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#fafafa',
                    bodyColor: '#fafafa',
                    titleFont: { size: 14, family: 'Inter', weight: '700' },
                    bodyFont: { size: 13, family: 'JetBrains Mono' },
                    padding: 12,
                    borderColor: '#f97316',
                    borderWidth: 3,
                    displayColors: true,
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
                        color: '#e4e4e7', 
                        lineWidth: 2,
                        drawBorder: true,
                        borderWidth: 3,
                        borderColor: '#0a0a0a'
                    },
                    ticks: {
                        font: { size: 11, family: 'Inter', weight: '700' },
                        color: '#0a0a0a',
                        padding: 8
                    }
                },
                y: {
                    grid: { 
                        color: '#e4e4e7', 
                        lineWidth: 2,
                        drawBorder: true,
                        borderWidth: 3,
                        borderColor: '#0a0a0a'
                    },
                    ticks: {
                        font: { size: 11, family: 'JetBrains Mono', weight: '700' },
                        color: '#0a0a0a',
                        padding: 8,
                        callback: (value) => `₹${(value / 10000000).toFixed(1)}Cr`
                    }
                }
            }
        }
    });
}

export function createReturnsChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const models = projectData.models.map(m => ({
        name: m.name,
        return: parseFloat(m.metrics.annualReturn.replace('%', ''))
    })).sort((a, b) => b.return - a.return);
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: models.map(m => m.name),
            datasets: [{
                label: 'Annual Return %',
                data: models.map(m => m.return),
                backgroundColor: models.map((m, i) => 
                    i === 0 ? '#f97316' : 
                    i === 1 ? '#3b82f6' : 
                    i === 2 ? '#22c55e' : 
                    '#a1a1aa'
                ),
                borderColor: '#0a0a0a',
                borderWidth: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#fafafa',
                    bodyColor: '#fafafa',
                    titleFont: { size: 14, family: 'Inter', weight: '700' },
                    bodyFont: { size: 13, family: 'JetBrains Mono' },
                    padding: 12,
                    borderColor: '#f97316',
                    borderWidth: 3,
                    callbacks: {
                        label: (context) => `Return: ${context.parsed.y.toFixed(2)}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 12, family: 'Inter', weight: '900' },
                        color: '#0a0a0a'
                    },
                    border: {
                        width: 3,
                        color: '#0a0a0a'
                    }
                },
                y: {
                    grid: { 
                        color: '#e4e4e7', 
                        lineWidth: 2 
                    },
                    ticks: {
                        font: { size: 11, family: 'JetBrains Mono', weight: '700' },
                        color: '#0a0a0a',
                        callback: (value) => `${value}%`
                    },
                    border: {
                        width: 3,
                        color: '#0a0a0a'
                    }
                }
            }
        }
    });
}

export function createRiskReturnChart(canvasId) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const models = projectData.models
        .filter(m => m.metrics.annualVolatility) // Filter out models without volatility data
        .map(m => ({
            name: m.name,
            return: parseFloat(m.metrics.annualReturn.replace('%', '')),
            volatility: parseFloat(m.metrics.annualVolatility.replace('%', ''))
        }));
    
    return new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: models.map((m, i) => ({
                label: m.name,
                data: [{ x: m.volatility, y: m.return }],
                backgroundColor: i === 0 ? '#f97316' : 
                                i === 1 ? '#3b82f6' : 
                                i === 2 ? '#22c55e' : 
                                i === 3 ? '#eab308' : '#a855f7',
                borderColor: '#0a0a0a',
                borderWidth: 3,
                pointRadius: 10,
                pointHoverRadius: 14,
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
                        color: '#0a0a0a',
                        padding: 12,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#fafafa',
                    bodyColor: '#fafafa',
                    titleFont: { size: 14, family: 'Inter', weight: '700' },
                    bodyFont: { size: 13, family: 'JetBrains Mono' },
                    padding: 12,
                    borderColor: '#f97316',
                    borderWidth: 3,
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
                        text: 'Annual Volatility (%)',
                        font: { size: 13, family: 'Inter', weight: '900' },
                        color: '#0a0a0a',
                        padding: { top: 10 }
                    },
                    grid: { 
                        color: '#e4e4e7', 
                        lineWidth: 2 
                    },
                    ticks: {
                        font: { size: 11, family: 'JetBrains Mono', weight: '700' },
                        color: '#0a0a0a',
                        callback: (value) => `${value}%`
                    },
                    border: {
                        width: 3,
                        color: '#0a0a0a'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Annual Return (%)',
                        font: { size: 13, family: 'Inter', weight: '900' },
                        color: '#0a0a0a',
                        padding: { bottom: 10 }
                    },
                    grid: { 
                        color: '#e4e4e7', 
                        lineWidth: 2 
                    },
                    ticks: {
                        font: { size: 11, family: 'JetBrains Mono', weight: '700' },
                        color: '#0a0a0a',
                        callback: (value) => `${value}%`
                    },
                    border: {
                        width: 3,
                        color: '#0a0a0a'
                    }
                }
            }
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
                    backgroundColor: '#a1a1aa',
                    borderColor: '#0a0a0a',
                    borderWidth: 4,
                },
                {
                    label: 'Our Implementation',
                    data: benchmarks.map(b => parseFloat(b.ours.replace('%', ''))),
                    backgroundColor: '#f97316',
                    borderColor: '#0a0a0a',
                    borderWidth: 4,
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
                        color: '#0a0a0a',
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: '#0a0a0a',
                    titleColor: '#fafafa',
                    bodyColor: '#fafafa',
                    titleFont: { size: 14, family: 'Inter', weight: '700' },
                    bodyFont: { size: 13, family: 'JetBrains Mono' },
                    padding: 12,
                    borderColor: '#f97316',
                    borderWidth: 3,
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { size: 12, family: 'Inter', weight: '900' },
                        color: '#0a0a0a'
                    },
                    border: {
                        width: 3,
                        color: '#0a0a0a'
                    }
                },
                y: {
                    grid: { 
                        color: '#e4e4e7', 
                        lineWidth: 2 
                    },
                    ticks: {
                        font: { size: 11, family: 'JetBrains Mono', weight: '700' },
                        color: '#0a0a0a',
                        callback: (value) => `${value}%`
                    },
                    border: {
                        width: 3,
                        color: '#0a0a0a'
                    }
                }
            }
        }
    });
}
