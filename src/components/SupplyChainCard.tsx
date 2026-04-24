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
      className="card-hover animate-slide-in rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 flex flex-col"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-[11px] font-bold text-white truncate">{node.name}</h3>
            <span
              className="tier-badge shrink-0"
              style={{ color: tierCfg.color, backgroundColor: tierCfg.bgColor }}
            >
              {node.tierLabel}
            </span>
          </div>
          <p className="text-[9px] text-gray-500">{node.nameEn}</p>
        </div>
        {node.marketShare && (
          <div className="shrink-0 rounded bg-blue-500/10 px-1.5 py-px text-[10px] font-semibold text-blue-400">
            {node.marketShare}
          </div>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[9px] text-gray-500">本层占比</span>
        <span className="text-[10px] font-bold font-mono" style={{ color: tierCfg.color }}>
          {node.supplyShare}%
        </span>
      </div>
      <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden mt-0.5">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${node.supplyShare}%`,
            background: `linear-gradient(90deg, ${tierCfg.color}, ${tierCfg.color}88)`,
          }}
        />
      </div>

      <p className="mt-1 text-[10px] leading-snug text-gray-400">{node.role}</p>

      {node.highlight && (
        <p className="mt-0.5 text-[9px] leading-snug text-amber-400/80">{node.highlight}</p>
      )}

      <div className="mt-1 flex flex-wrap gap-0.5">
        {node.keyProducts.map((p) => (
          <span key={p} className="rounded bg-white/5 px-1 py-px text-[9px] text-gray-400">{p}</span>
        ))}
      </div>

      <div className="mt-auto pt-1">
        {node.stockCode && node.stockExchange && (
          <StockBadge stock={stock} stockCode={node.stockCode} exchange={node.stockExchange} />
        )}
        {!node.stockCode && (
          <div className="mt-1 text-[9px] text-gray-600">
            {node.id === "cxmt" ? "冲刺科创板 IPO 中" : "未上市"}
          </div>
        )}
      </div>
    </div>
  );
}
