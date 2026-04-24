"use client";

import { useEffect, useState, useCallback } from "react";
import { supplyChainNodes, TIER_CONFIG } from "@/lib/supply-chain-data";
import { MiniKLine, KLineBar } from "./MiniKLine";

type KLineMap = Record<string, KLineBar[]>;

const listedNodes = supplyChainNodes.filter(
  (n) => n.stockCode && n.stockExchange
);
const stockParams = listedNodes
  .map((n) => `${n.stockCode}:${n.stockExchange}`)
  .join(",");

export function StockKLineGrid() {
  const [klines, setKlines] = useState<KLineMap>({});
  const [loading, setLoading] = useState(true);

  const fetchKlines = useCallback(async () => {
    try {
      const res = await fetch(`/api/kline?codes=${stockParams}&count=60`);
      const data = await res.json();
      setKlines(data.klines || {});
    } catch {
      /* retry on next load */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKlines();
    const timer = setInterval(fetchKlines, 5 * 60_000);
    return () => clearInterval(timer);
  }, [fetchKlines]);

  if (loading) {
    return (
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="h-3 w-3 rounded-full border-2 border-gray-600 border-t-gray-400 animate-spin" />
          加载日K线数据...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-xs font-bold text-white">
          供应链个股日K ·{" "}
          <span className="text-gray-500 font-normal">{listedNodes.length} 只</span>
        </h2>
        <span className="text-[9px] text-gray-600">近60交易日 · 5min刷新</span>
      </div>

      <div
        className="grid items-start gap-1.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))" }}
      >
        {listedNodes.map((node) => {
          const bars = klines[node.stockCode!] || [];
          const tierCfg = TIER_CONFIG[node.tier];
          const lastBar = bars[bars.length - 1];
          const prevBar = bars.length > 1 ? bars[bars.length - 2] : null;
          const isLive = lastBar?.isToday;
          const refClose = prevBar ? prevBar.close : lastBar?.open;
          const isUp = lastBar && refClose ? lastBar.close >= refClose : true;
          const dayChange =
            lastBar && refClose
              ? (((lastBar.close - refClose) / refClose) * 100).toFixed(2)
              : null;

          return (
            <div
              key={node.id}
              className="rounded border border-white/[0.06] bg-white/[0.02] px-1.5 py-1 card-hover"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <div
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: tierCfg.color }}
                />
                <span className="text-[10px] font-bold text-white truncate">{node.name}</span>
                <span className="text-[8px] font-mono text-gray-500 shrink-0">
                  {node.stockExchange === "SH" ? "SH" : "SZ"}:{node.stockCode}
                </span>
              </div>

              {lastBar && (
                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className={`text-[13px] font-bold font-mono ${isUp ? "stock-up" : "stock-down"}`}>
                    {lastBar.close.toFixed(2)}
                  </span>
                  {dayChange && (
                    <span className={`text-[9px] font-mono ${isUp ? "stock-up" : "stock-down"}`}>
                      {isUp ? "+" : ""}{dayChange}%
                    </span>
                  )}
                  {isLive && (
                    <span className="text-[7px] px-0.5 rounded bg-amber-500/15 text-amber-400 font-bold shrink-0">今</span>
                  )}
                  <span className="text-[8px] text-gray-600 ml-auto">{node.supplyShare}%</span>
                </div>
              )}

              <MiniKLine bars={bars} width={165} height={80} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
