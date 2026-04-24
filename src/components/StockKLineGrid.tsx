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
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="h-3 w-3 rounded-full border-2 border-gray-600 border-t-gray-400 animate-spin" />
          加载日K线数据...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-white">
          供应链个股日K ·{" "}
          <span className="text-gray-500 font-normal">
            {listedNodes.length} 只
          </span>
        </h2>
        <span className="text-[10px] text-gray-600">
          近60个交易日 · 每5分钟刷新
        </span>
      </div>

      <div className="grid items-start gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))" }}
      >
        {listedNodes.map((node) => {
          const bars = klines[node.stockCode!] || [];
          const tierCfg = TIER_CONFIG[node.tier];
          const lastBar = bars[bars.length - 1];
          const prevBar = bars.length > 1 ? bars[bars.length - 2] : lastBar;
          const isUp = lastBar && prevBar ? lastBar.close >= prevBar.close : true;
          const dayChange =
            lastBar && prevBar
              ? ((lastBar.close - prevBar.close) / prevBar.close * 100).toFixed(2)
              : null;

          return (
            <div
              key={node.id}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 card-hover"
            >
              {/* header row */}
              <div className="flex items-center gap-1.5 mb-1">
                <div
                  className="h-1.5 w-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: tierCfg.color }}
                />
                <span className="text-[11px] font-bold text-white truncate">
                  {node.name}
                </span>
                <span className="text-[9px] font-mono text-gray-500 shrink-0">
                  {node.stockExchange === "SH" ? "SH" : "SZ"}:{node.stockCode}
                </span>
              </div>

              {/* price + change */}
              {lastBar && (
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span
                    className={`text-sm font-bold font-mono ${
                      isUp ? "stock-up" : "stock-down"
                    }`}
                  >
                    {lastBar.close.toFixed(2)}
                  </span>
                  {dayChange && (
                    <span
                      className={`text-[10px] font-mono ${
                        isUp ? "stock-up" : "stock-down"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {dayChange}%
                    </span>
                  )}
                  <span className="text-[9px] text-gray-600 ml-auto">
                    {node.supplyShare}%
                  </span>
                </div>
              )}

              {/* K-line chart */}
              <MiniKLine bars={bars} width={170} height={90} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
