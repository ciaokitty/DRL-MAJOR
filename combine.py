# # date looks like -> 2023-11-01 03:45:00+00:00
# import csv
# with open('nifty50_daily_2010-01-01_to_2022-12-31.csv', 'r') as old:
#     with open('indian_stocks_copy.csv', 'r') as recent:
#         with open('combined', 'a') as combined:
#             old_csv_reader = csv.reader(old)
#             recent_csv_reader = csv.reader(recent)
#             csv_writer = csv.writer(combined)
#             for row in old_csv_reader:
#                 csv_writer.writerow(row)
            
#             date = row[0].split()[0]
#             for row in recent_csv_reader:
#                 date = row[0].split()[0]
                

import csv
from datetime import datetime
from typing import Dict, List, Optional, Tuple

OLD_FILE = "nifty50_daily_2010-01-01_to_2022-12-31.csv"
RECENT_FILE = "indian_stocks_copy.csv"
OUTPUT_FILE = "combined.csv"


def read_rows(path: str) -> Tuple[List[str], List[List[str]]]:
    with open(path, newline="", encoding="utf-8") as handle:
        reader = csv.reader(handle)
        header = next(reader)
        rows = [row for row in reader if row]
    return header, rows


def parse_timestamp(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("T", " "))


def detect_timezone(rows: List[List[str]]) -> Optional[datetime]:
    for row in rows:
        try:
            ts = parse_timestamp(row[0])
        except ValueError:
            continue
        if ts.tzinfo:
            return ts.tzinfo
    return None


def normalize_recent_rows(
    rows: List[List[str]],
    header: List[str],
    target_tz,
) -> Dict[Tuple[datetime.date, str], Tuple[datetime, List[str]]]:
    timestamp_idx = header.index("date")
    ticker_idx = header.index("tic") if "tic" in header else None
    daily: Dict[Tuple[datetime.date, str], Tuple[datetime, List[str]]] = {}
    for row in rows:
        try:
            ts = parse_timestamp(row[timestamp_idx])
        except ValueError:
            continue

        if ts.tzinfo and target_tz:
            ts = ts.astimezone(target_tz)
        elif target_tz:
            ts = ts.replace(tzinfo=target_tz)
        elif ts.tzinfo:
            ts = ts.replace(tzinfo=None)

        ticker = row[ticker_idx] if ticker_idx is not None else ""
        key = (ts.date(), ticker)
        if key not in daily or ts > daily[key][0]:
            normalized_row = row[:]
            normalized_row[timestamp_idx] = ts.isoformat(" ")
            daily[key] = (ts, normalized_row)
    return daily


def main() -> None:
    old_header, old_rows = read_rows(OLD_FILE)
    recent_header, recent_rows = read_rows(RECENT_FILE)

    if old_header != recent_header:
        raise ValueError("Header mismatch between daily and recent CSV files.")

    old_tz = detect_timezone(old_rows)
    daily_recent = normalize_recent_rows(recent_rows, recent_header, old_tz)

    timestamp_idx = old_header.index("date")
    ticker_idx = old_header.index("tic") if "tic" in old_header else None

    existing_dates = {
        (
            parse_timestamp(row[timestamp_idx]).date(),
            row[ticker_idx] if ticker_idx is not None else "",
        )
        for row in old_rows
        if row and row[timestamp_idx].strip()
    }

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as out:
        writer = csv.writer(out)
        writer.writerow(old_header)
        writer.writerows(old_rows)

        for key in sorted(daily_recent):
            if key in existing_dates:
                continue
            _, row = daily_recent[key]
            writer.writerow(row)


if __name__ == "__main__":
    main()