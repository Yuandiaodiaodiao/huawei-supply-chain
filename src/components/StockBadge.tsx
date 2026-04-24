"use client";

interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  timestamp: string;
}

export function StockBadge({
  stock,
  stockCode,
  exchange,
}: {
  stock: StockData | null | undefined;
  stockCode: string;
  exchange: string;
}) {
  if (!stockCode) return null;

  const exchangeLabel = exchange === "SH" ? "SH" : "SZ";
  const fullCode = `${exchangeLabel}:${stockCode}`;

  if (!stock) {
    return (
      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-500">
        <span className="font-mono">{fullCode}</span>
        <span className="animate-pulse">加载中...</span>
      </div>
    );
  }

  const isUp = stock.change >= 0;
  const colorClass = isUp ? "stock-up" : "stock-down";
  const arrow = isUp ? "▲" : "▼";

  return (
    <div className="mt-1 rounded bg-black/30 px-2 py-1">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] text-gray-400">{fullCode}</span>
        <span className="text-[8px] text-gray-500">{stock.volume}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-base font-bold font-mono ${colorClass}`}>
          ¥{stock.price.toFixed(2)}
        </span>
        <span className={`text-[10px] font-mono ${colorClass}`}>
          {arrow} {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
