# Strategic-Stock-Trading-with-Deep-Reinforcement-Learning-Models

## Team Members
- 1905095 : Md Raihan Sobhan
- 1905115 : Tahsin Wahid

## Problem Definition

Traditional trading models rely heavily on historical data, making them rigid and slow to respond to real-time market fluctuations. This gap often leads to missed opportunities and increased risk for traders.

## Literature Review Highlights:
- Deep Reinforcement Learning (DRL) has shown potential in enabling real-time adaptability and improving decision-making in volatile
environments.
- Studies suggest DRL can integrate real-time data and sentiment analysis, providing more robust, dynamic trading strategies.

## Datasets for Model Training

### Datasets Used:

- [Bangladesh | Dhaka Stock Exchange Dataset (DSEBD)](https://www.kaggle.com/datasets/mahmudulhaque/dsebd): Daily stock price data from the Dhaka Stock Exchange, providing insights into a growing emerging market.
- [India | NIFTY-50 Stock Market Data (2000 - 2021)](https://www.kaggle.com/datasets/rohanrao/nifty50-stock-market-data?select=BHARTIARTL.csv)
- [US | USA 514 Stocks Prices NASDAQ NYSE](https://www.kaggle.com/datasets/olegshpagin/usa-stocks-prices-ohlcv/data)

### Additional International Datasets That Can Be Used in Future Iterations:
- [SP 500 Stock Data](https://www.kaggle.com/datasets/paultimothymooney/stock-market-data): Covers daily prices for SP 500 stocks, offering a view into a mature market.
- [US Stocks and ETFs Price and Volume Data](https://www.kaggle.com/datasets/borismarjanovic/price-volume-data-for-all-us-stocks-etfs): Includes comprehensive price and volume data across all US stocks and ETFs.
- [Brazilian Stock Market](https://www.kaggle.com/datasets/andrewmvd/brazilian-stock-market Daily Updated
- Indian Stock Market Index Intraday Data(2008-2020)


## Reference Papers :
- [FinRL](https://arxiv.org/pdf/2011.09607): A Deep Reinforcement Learning Library for Automated Stock
Trading in Quantitative Finance
- [Practical Deep Reinforcement Learning Approach for Stock Trading](https://arxiv.org/pdf/1811.07522v3)

## Proposed Solution :
### Solution Approach: 
- Develop a DRL-based trading model that dynamically adapts to real-time market conditions by employing an optimal reward function.
- This function not only maximizes profits but also carefully considers the level of risk taken, ensuring a balanced strategy that prioritizes sustainable growth while minimizing potential losses.

## Key Techniques:
- A2C (Advantage Actor-Critic) for efficient exploration. 
- DDPG (Deep Deterministic Policy Gradient) for continuous action spaces. 
- Proximal Policy Optimization (PPO) for stability in
decision-making.
- TD3 (Twin Delayed DDPG) to manage volatility and improve
accuracy.
- SAC (Soft Actor-Critic) for robustness and adaptability.
- MVO (Mean-Variance Optimization) for Bechmarking. 

## Performance Metrics
- Initial and Final Portfolio Value
- Annualized Return
- Annualized Standard Deviation
- Sharpe Ratio
- Max Drawdown
- Sortino Ratio
- Volatility
- Profitability
- Aggressiveness
- Recovery Time


## How to Run This Code
- Run the jupyter notebooks , install required libraries.
    - [DSE](/dse.ipynb)
    - [NIFTY](/nifty.ipynb)
    - [SNP_500](/snp500.ipynb)

- Update dataset paths, with your local path <br> 


### Report 
- Read the [Report](/Project_Report.pdf) to get a detailed overview of the project.

## Tasks to be done
- Write Ups
- Cleandata function
