# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Deep Reinforcement Learning (DRL) research project for automated stock trading strategy comparison. The project implements and evaluates five DRL algorithms (A2C, DDPG, PPO, TD3, SAC) against a Mean-Variance Optimization (MVO) benchmark across three markets: Dhaka Stock Exchange (DSE), NIFTY-50 (India), and S&P 500 (US).

## Running the Code

### Prerequisites
- Python 3.x with virtual environment in `.venv/`
- Jupyter Notebook/Lab
- FinRL library (path should be configured in notebooks)
- Install dependencies as needed when running notebooks

### Main Notebooks
Execute one of the three market-specific notebooks:
- **DSE (Bangladesh)**: `jupyter notebook dse.ipynb`
- **NIFTY-50 (India)**: `jupyter notebook nifty.ipynb`
- **S&P 500 (US)**: `jupyter notebook snp500.ipynb`

### Dataset Configuration
Before running notebooks, update dataset paths in the initial cells:
- **Windows**: Set `dir = r"D:\path\to\datasets"`
- **macOS/Linux**: Set `dir = r"/Users/path/to/datasets"`

Datasets are expected in the `datasets/` directory (gitignored):
- **DSE**: JSON files from Kaggle DSEBD dataset
- **NIFTY**: CSV files (one per stock)
- **SNP500**: CSV files (one per stock)

### Training Configuration
Key global variables (typically in cell 2-3):
- `run_timesteps = 20000`: Training duration per model
- Enable/disable specific models using flags:
  ```python
  if_using_a2c = True
  if_using_ddpg = True
  if_using_ppo = True
  if_using_td3 = True
  if_using_sac = True
  ```

## Architecture

### Notebook Structure
All three notebooks follow an identical workflow with ~120 cells organized as:

1. **Setup & Data Loading** (cells 0-10)
   - Import libraries (pandas, numpy, matplotlib, finrl, stable_baselines3)
   - Configure FinRL paths and constants
   - Load market-specific data files
   - Concatenate and deduplicate data

2. **Data Preprocessing** (cells 27-43)
   - Standardize column names: `trading_code`→`tic`, `opening_price`→`open`, etc.
   - Engineer custom features: day of week, resistance/support levels (10-day and 50-day rolling)
   - Calculate turbulence index using 208-day rolling covariance and Mahalanobis distance
   - Add technical indicators via FinRL's `FeatureEngineer` (list defined in `finrl.config.INDICATORS`)
   - Fill missing date-ticker combinations with zeros to create complete grid
   - Split data: training (2010-2020), testing (2021-2022)

3. **Environment Setup** (cells 44-46)
   - **State space**: `1 + 2*stock_dimension + len(INDICATORS)*stock_dimension`
     - Components: cash (1) + holdings (n_stocks) + prices (n_stocks) + indicators (n_indicators × n_stocks)
   - **Action space**: Continuous allocation weights
   - Trading parameters:
     - Initial capital: 2,000,000
     - Max shares per trade (`hmax`): 100
     - Transaction costs: 0.05% for buy and sell
     - Reward scaling: 1e-4

4. **Model Training** (cells 47-60)
   - Five DRL agents trained sequentially using `DRLAgent` wrapper
   - Each model logs to `results/{DATASET}/{algorithm}/`
   - Training progress saved to CSV and TensorBoard logs
   - Hyperparameters vary by algorithm (see PPO, TD3, SAC configs in notebooks)

5. **Prediction/Trading** (cells 66-71)
   - Each trained model executes trades on test data (2021-2022)
   - Outputs saved to `{DATASET}/account_values_actions_{DATASET}/`:
     - `df_account_value_{algo}.pkl`: Portfolio value time series
     - `df_actions_{algo}.pkl`: Trading action history

6. **Benchmark (MVO)** (cells 78-83)
   - Mean-Variance Optimization using historical returns and covariance
   - Applied to same test period for comparison

7. **Results Aggregation** (cells 84-88)
   - Combines all model outputs into single DataFrame
   - Saves to `{DATASET}/result_{dataset}.csv`

8. **Performance Metrics** (cells 86-104)
   - Calculates 10+ metrics per model:
     - Financial: Annual return, Sharpe ratio, Sortino ratio
     - Risk: Max drawdown, volatility
     - Operational: Profitability, aggressiveness, recovery time
   - Saves to `{DATASET}/metrics_{dataset}.csv`

9. **Visualization** (cells 90-116)
   - Multiple chart types: bar charts, heatmaps, radar plots
   - Color conventions: light green (best drawdown), light coral (best returns)

### Key Libraries & Dependencies

**Core Framework**: FinRL (Deep RL for finance)
- `finrl.meta.preprocessor`: Data downloading and feature engineering
- `finrl.meta.env_stock_trading.env_stocktrading.StockTradingEnv`: Trading gym environment
- `finrl.agents.stablebaselines3.models.DRLAgent`: Wrapper for SB3 algorithms
- `finrl.meta.data_processor.DataProcessor`: Utilities
- `finrl.plot`: Backtesting visualization

**DRL Implementation**: Stable Baselines3
- Provides A2C, DDPG, PPO, TD3, SAC implementations
- Integrated logging and TensorBoard support

**Data Processing**: pandas, numpy, itertools
**Visualization**: matplotlib, seaborn

### State Space Design Pattern

The state representation follows a specific structure:
```
[cash_balance,
 holdings_stock1, holdings_stock2, ..., holdings_stockN,
 price_stock1, price_stock2, ..., price_stockN,
 indicator1_stock1, indicator1_stock2, ..., indicator1_stockN,
 indicator2_stock1, ...,
 indicatorM_stockN]
```

This grows large with many stocks (e.g., ~1000+ dimensions for 30 stocks with 30 indicators).

### Data Completeness Pattern

A critical preprocessing step creates all possible (date, ticker) combinations using `itertools.product()`, then fills missing entries with zeros. This ensures:
- All stocks have data for all trading days
- Models receive consistent state dimensions
- No runtime errors from missing data

### Output File Patterns

Each notebook generates:
- `{DATASET}/metrics_{dataset}.csv`: Performance comparison table
- `{DATASET}/result_{dataset}.csv`: Daily portfolio values for all models
- `{DATASET}/account_values_actions_{DATASET}/`: Pickle files with detailed results
- `results/{DATASET}/{algorithm}/`: Training logs and TensorBoard data

## Important Conventions

### Training vs Trading
- **Training phase**: Models learn from 2010-2020 data
- **Trading phase**: Models execute on 2021-2022 (out-of-sample testing)
- No walk-forward validation or rolling windows

### Model Selection
The project compares 5 DRL algorithms selected for specific properties:
- **A2C**: Efficient exploration (on-policy)
- **DDPG**: Continuous actions (off-policy, deterministic)
- **PPO**: Training stability (on-policy, clipped objective)
- **TD3**: Reduced overestimation (twin critics, delayed updates)
- **SAC**: Maximum entropy for robustness (off-policy, stochastic)

### Technical Indicators Note
The `use_turbulence=False` setting in `FeatureEngineer` is intentional - notebooks have a comment "turbulence is giving error". Turbulence is still calculated separately and merged into the data, but not used as a feature by FinRL's automatic feature engineering.

### Path Configuration Pattern
All notebooks check OS and set paths accordingly:
```python
if os.name == 'nt':  # Windows
    dir = r"D:\path\to\data"
else:  # macOS/Linux
    dir = r"/path/to/data"
```

When modifying code, maintain this pattern for cross-platform compatibility.

### DSE-Specific Handling
The DSE notebook has manual stock selection (39 companies) due to data quality or availability constraints. NIFTY and SNP500 notebooks use all available stocks in their datasets.

## Performance Metrics Explained

- **Sharpe Ratio**: Risk-adjusted return using total volatility
- **Sortino Ratio**: Risk-adjusted return using only downside volatility
- **Max Drawdown**: Largest peak-to-trough decline
- **Aggressiveness**: Profitability divided by max drawdown
- **Recovery Time**: Days from lowest point to recovery to previous peak
- All returns and volatilities are annualized (252 trading days)

## Research Context

This is an academic comparison project, not a production trading system:
- No live trading integration or broker connectivity
- No walk-forward validation or model retraining
- Focus on algorithm comparison rather than deployment
- Benchmarked against traditional MVO portfolio optimization

The goal is to demonstrate DRL's potential for adaptive trading strategies across different market conditions (emerging vs developed markets).
