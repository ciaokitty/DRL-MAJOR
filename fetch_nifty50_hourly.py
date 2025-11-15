"""
Fetch daily NIFTY-50 data from Yahoo Finance
Aligned with paper: 2010-2022 (training: 2010-2020, testing: 2021-2022)
"""

import yfinance as yf
import pandas as pd
from datetime import datetime
import os

# NIFTY-50 stock tickers (as of 2024, with .NS suffix for NSE)
NIFTY50_TICKERS = [
    'ADANIENT.NS', 'ADANIPORTS.NS', 'APOLLOHOSP.NS', 'ASIANPAINT.NS', 'AXISBANK.NS',
    'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BPCL.NS', 'BHARTIARTL.NS',
    'BRITANNIA.NS', 'CIPLA.NS', 'COALINDIA.NS', 'DIVISLAB.NS', 'DRREDDY.NS',
    'EICHERMOT.NS', 'GRASIM.NS', 'HCLTECH.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS',
    'HEROMOTOCO.NS', 'HINDALCO.NS', 'HINDUNILVR.NS', 'ICICIBANK.NS', 'ITC.NS',
    'INDUSINDBK.NS', 'INFY.NS', 'JSWSTEEL.NS', 'KOTAKBANK.NS', 'LT.NS',
    'M&M.NS', 'MARUTI.NS', 'NTPC.NS', 'NESTLEIND.NS', 'ONGC.NS',
    'POWERGRID.NS', 'RELIANCE.NS', 'SBILIFE.NS', 'SBIN.NS', 'SUNPHARMA.NS',
    'TCS.NS', 'TATACONSUM.NS', 'TATAMOTORS.NS', 'TATASTEEL.NS', 'TECHM.NS',
    'TITAN.NS', 'UPL.NS', 'ULTRACEMCO.NS', 'WIPRO.NS'
]

# Date range aligned with paper methodology:
# Training: 2010-2020
# Testing: 2021-2022
START_DATE = "2010-01-01"
END_DATE = "2022-12-31"

def fetch_daily_data(ticker, start_date, end_date):
    """Fetch daily data for a single ticker"""
    try:
        print(f"Fetching {ticker}...")
        stock = yf.Ticker(ticker)

        # Fetch daily data
        df = stock.history(start=start_date, end=end_date, interval='1d')

        if df.empty:
            print(f"  WARNING: No data for {ticker}")
            return None

        # Reset index to get datetime as column
        df = df.reset_index()

        # Add ticker column
        df['tic'] = ticker.replace('.NS', '')

        # Rename columns to match paper format
        # For daily data, the column is 'Date' not 'Datetime'
        df = df.rename(columns={
            'Date': 'date',
            'Datetime': 'date',  # fallback for hourly
            'Open': 'open',
            'High': 'high',
            'Low': 'low',
            'Close': 'close',
            'Volume': 'volume'
        })

        # Select relevant columns
        df = df[['date', 'tic', 'open', 'high', 'low', 'close', 'volume']]

        print(f"  Success: {len(df)} daily records")
        return df

    except Exception as e:
        print(f"  ERROR fetching {ticker}: {str(e)}")
        return None

def main():
    """Main function to fetch all NIFTY-50 data"""
    print("="*60)
    print(f"NIFTY-50 Daily Data Collection")
    print(f"Period: {START_DATE} to {END_DATE}")
    print("="*60)

    all_data = []
    successful = 0
    failed = 0

    for ticker in NIFTY50_TICKERS:
        df = fetch_daily_data(ticker, START_DATE, END_DATE)
        if df is not None:
            all_data.append(df)
            successful += 1
        else:
            failed += 1

    if not all_data:
        print("\nERROR: No data collected!")
        return

    # Combine all data
    print("\n" + "="*60)
    print("Combining data...")
    combined_df = pd.concat(all_data, ignore_index=True)

    # Sort by date and ticker
    combined_df = combined_df.sort_values(['date', 'tic']).reset_index(drop=True)

    # Remove duplicates
    before_dedup = len(combined_df)
    combined_df = combined_df.drop_duplicates(subset=['date', 'tic'], keep='first')
    after_dedup = len(combined_df)

    print(f"Total records: {after_dedup:,}")
    print(f"Duplicates removed: {before_dedup - after_dedup}")
    print(f"Date range: {combined_df['date'].min()} to {combined_df['date'].max()}")
    print(f"Unique tickers: {combined_df['tic'].nunique()}")
    print(f"Successful: {successful}/{len(NIFTY50_TICKERS)}")
    if failed > 0:
        print(f"Failed: {failed}")

    # Save to CSV
    output_file = f"nifty50_daily_{START_DATE}_to_{END_DATE}.csv"
    combined_df.to_csv(output_file, index=False)
    print(f"\nData saved to: {output_file}")

    # Display sample
    print("\n" + "="*60)
    print("Sample data (first 10 rows):")
    print(combined_df.head(10))

    print("\n" + "="*60)
    print("Data statistics:")
    print(combined_df.describe())

    return combined_df

if __name__ == "__main__":
    df = main()
