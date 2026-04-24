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
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
        <span className="font-mono">{fullCode}</span>
        <span className="animate-pulse">加载中...</span>
      </div>
    );
  }

  const isUp = stock.change >= 0;
  const colorClass = isUp ? "stock-up" : "stock-down";
  const arrow = isUp ? "▲" : "▼";

  return (
    <div className="mt-2 rounded-md bg-black/30 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-400">{fullCode}</span>
        <span className="text-[10px] text-gray-500">{stock.volume}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={`text-lg font-bold font-mono ${colorClass}`}>
          ¥{stock.price.toFixed(2)}
        </span>
        <span className={`text-xs font-mono ${colorClass}`}>
          {arrow} {Math.abs(stock.change).toFixed(2)} (
          {Math.abs(stock.changePercent).toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
