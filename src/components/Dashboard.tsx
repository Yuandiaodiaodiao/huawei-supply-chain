"use client";

import { useEffect, useState, useCallback } from "react";
import {
  supplyChainNodes,
  TIER_CONFIG,
  SupplyTier,
} from "@/lib/supply-chain-data";
import { SupplyChainCard } from "./SupplyChainCard";

interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  timestamp: string;
}

type StockMap = Record<string, StockData | null>;

const REFRESH_INTERVAL = 30_000;

const ALL_TIERS = Object.entries(TIER_CONFIG)
  .sort(([, a], [, b]) => a.order - b.order)
  .map(([key, val]) => ({ key: key as SupplyTier, ...val }));

export function Dashboard() {
  const [stocks, setStocks] = useState<StockMap>({});
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [activeTier, setActiveTier] = useState<SupplyTier | "all">("all");
  const [loading, setLoading] = useState(true);

  const listedNodes = supplyChainNodes.filter(
    (n) => n.stockCode && n.stockExchange
  );
  const stockParams = listedNodes
    .map((n) => `${n.stockCode}:${n.stockExchange}`)
    .join(",");

  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch(`/api/stock?codes=${stockParams}`);
      const data = await res.json();
      setStocks(data.quotes || {});
      setFetchedAt(data.fetchedAt || "");
    } catch {
      /* silently retry on next interval */
    } finally {
      setLoading(false);
    }
  }, [stockParams]);

  useEffect(() => {
    fetchStocks();
    const timer = setInterval(fetchStocks, REFRESH_INTERVAL);
    return () => clearInterval(timer);
  }, [fetchStocks]);

  const filteredNodes =
    activeTier === "all"
      ? supplyChainNodes
      : supplyChainNodes.filter((n) => n.tier === activeTier);

  const tierGroups = new Map<SupplyTier, typeof supplyChainNodes>();
  filteredNodes.forEach((n) => {
    const arr = tierGroups.get(n.tier) || [];
    arr.push(n);
    tierGroups.set(n.tier, arr);
  });

  const sortedGroups = [...tierGroups.entries()].sort(
    ([a], [b]) => TIER_CONFIG[a].order - TIER_CONFIG[b].order
  );

  const totalListed = listedNodes.length;
  const totalUnlisted = supplyChainNodes.length - totalListed;

  const upCount = Object.values(stocks).filter(
    (s) => s && s.change > 0
  ).length;
  const downCount = Object.values(stocks).filter(
    (s) => s && s.change < 0
  ).length;
  const flatCount = Object.values(stocks).filter(
    (s) => s && s.change === 0
  ).length;

  return (
    <div className="space-y-5">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
          <span className="text-gray-500">供应链企业</span>{" "}
          <span className="font-bold text-white">{supplyChainNodes.length}</span>
          <span className="text-gray-600 mx-1">|</span>
          <span className="text-gray-500">已上市</span>{" "}
          <span className="font-bold text-blue-400">{totalListed}</span>
          <span className="text-gray-600 mx-1">|</span>
          <span className="text-gray-500">未上市</span>{" "}
          <span className="text-gray-400">{totalUnlisted}</span>
        </div>
        {!loading && Object.keys(stocks).length > 0 && (
          <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
            <span className="stock-up font-bold">▲{upCount}</span>
            <span className="text-gray-600 mx-1.5">|</span>
            <span className="stock-down font-bold">▼{downCount}</span>
            <span className="text-gray-600 mx-1.5">|</span>
            <span className="text-gray-400">—{flatCount}</span>
          </div>
        )}
        {fetchedAt && (
          <div className="text-[10px] text-gray-600 ml-auto">
            数据更新: {new Date(fetchedAt).toLocaleTimeString("zh-CN")} · 每30秒刷新
          </div>
        )}
      </div>

      {/* Tier Filter */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTier("all")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            activeTier === "all"
              ? "bg-white/10 text-white"
              : "bg-white/[0.03] text-gray-500 hover:bg-white/[0.06] hover:text-gray-300"
          }`}
        >
          全部
        </button>
        {ALL_TIERS.map((t) => {
          const count = supplyChainNodes.filter(
            (n) => n.tier === t.key
          ).length;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTier(t.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTier === t.key
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
              style={
                activeTier === t.key
                  ? { backgroundColor: t.bgColor, color: t.color }
                  : { backgroundColor: "rgba(255,255,255,0.02)" }
              }
            >
              {t.label}
              <span className="ml-1 text-[10px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Supply Chain Cards */}
      {sortedGroups.map(([tier, nodes]) => {
        const cfg = TIER_CONFIG[tier];
        const tierTotal = nodes.reduce((s, n) => s + n.supplyShare, 0);
        return (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="h-3 w-1 rounded-full"
                style={{ backgroundColor: cfg.color }}
              />
              <h2 className="text-xs font-bold" style={{ color: cfg.color }}>
                {cfg.label}
              </h2>
              <span className="text-[10px] text-gray-500 font-mono">
                {nodes.length} 家 · 合计 {tierTotal}%
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            {/* Tier stacked share bar */}
            <div className="mb-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
              <div className="flex h-5 w-full rounded overflow-hidden bg-white/5">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className="relative flex items-center justify-center transition-all duration-500 first:rounded-l last:rounded-r"
                    style={{
                      width: `${(node.supplyShare / tierTotal) * 100}%`,
                      background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}88)`,
                      borderRight:
                        nodes.indexOf(node) < nodes.length - 1
                          ? "1px solid rgba(0,0,0,0.3)"
                          : "none",
                    }}
                    title={`${node.name}: ${node.supplyShare}%`}
                  >
                    {node.supplyShare >= 15 && (
                      <span className="text-[9px] font-bold text-white/90 truncate px-1">
                        {node.supplyShare}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5">
                {nodes.map((node) => (
                  <div key={node.id} className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-sm"
                      style={{ backgroundColor: cfg.color, opacity: 0.6 + (node.supplyShare / tierTotal) * 0.4 }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {node.name}
                    </span>
                    <span className="text-[10px] font-mono font-semibold" style={{ color: cfg.color }}>
                      {node.supplyShare}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {nodes.map((node, i) => (
                <SupplyChainCard
                  key={node.id}
                  node={node}
                  stock={node.stockCode ? stocks[node.stockCode] : undefined}
                  index={i}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
