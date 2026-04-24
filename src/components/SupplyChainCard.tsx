"use client";

import { SupplyChainNode, TIER_CONFIG } from "@/lib/supply-chain-data";
import { StockBadge } from "./StockBadge";

interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  timestamp: string;
}

export function SupplyChainCard({
  node,
  stock,
  index,
}: {
  node: SupplyChainNode;
  stock?: StockData | null;
  index: number;
}) {
  const tierCfg = TIER_CONFIG[node.tier];

  return (
    <div
      className="card-hover animate-slide-in rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white truncate">
              {node.name}
            </h3>
            <span
              className="tier-badge shrink-0"
              style={{
                color: tierCfg.color,
                backgroundColor: tierCfg.bgColor,
              }}
            >
              {node.tierLabel}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">{node.nameEn}</p>
        </div>
        {node.marketShare && (
          <div className="shrink-0 rounded-md bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-400">
            {node.marketShare}
          </div>
        )}
      </div>

      <p className="mt-2 text-xs leading-relaxed text-gray-400">{node.role}</p>

      {node.highlight && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-amber-400/80">
          {node.highlight}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        {node.keyProducts.map((p) => (
          <span
            key={p}
            className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400"
          >
            {p}
          </span>
        ))}
      </div>

      {node.stockCode && node.stockExchange && (
        <StockBadge
          stock={stock}
          stockCode={node.stockCode}
          exchange={node.stockExchange}
        />
      )}

      {!node.stockCode && (
        <div className="mt-2 text-[10px] text-gray-600">
          {node.id === "cxmt" ? "冲刺科创板 IPO 中" : "未上市"}
        </div>
      )}
    </div>
  );
}
