import { TIER_CONFIG, SupplyTier } from "@/lib/supply-chain-data";

const FLOW_TIERS: { tier: SupplyTier; items: { name: string; share: number }[] }[] = [
  { tier: "chip_design", items: [{ name: "华为海思", share: 100 }] },
  { tier: "wafer_fab", items: [{ name: "中芯国际", share: 100 }] },
  { tier: "hbm", items: [{ name: "自研 HBM", share: 100 }] },
  {
    tier: "cxmt_ecosystem",
    items: [
      { name: "长鑫存储", share: 35 },
      { name: "深科技", share: 25 },
      { name: "雅克科技", share: 20 },
      { name: "江波龙", share: 10 },
      { name: "兆易创新", share: 10 },
    ],
  },
  {
    tier: "packaging",
    items: [
      { name: "兴森科技", share: 40 },
      { name: "长电科技", share: 40 },
      { name: "通富微电", share: 20 },
    ],
  },
  {
    tier: "optical_switch",
    items: [
      { name: "赛微电子", share: 50 },
      { name: "光库科技", share: 30 },
      { name: "腾景科技", share: 20 },
    ],
  },
  {
    tier: "optical_module",
    items: [
      { name: "华工科技", share: 40 },
      { name: "中际旭创", share: 25 },
      { name: "光迅科技", share: 15 },
      { name: "兆驰股份", share: 12 },
      { name: "德科立", share: 8 },
    ],
  },
  {
    tier: "connector",
    items: [
      { name: "华丰科技", share: 60 },
      { name: "意华股份", share: 40 },
    ],
  },
  {
    tier: "thermal",
    items: [
      { name: "国机精工", share: 65 },
      { name: "赛腾股份", share: 35 },
    ],
  },
  {
    tier: "storage",
    items: [{ name: "兆易创新", share: 100 }],
  },
  {
    tier: "server_integration",
    items: [
      { name: "华鲲振宇", share: 40 },
      { name: "拓维信息", share: 30 },
      { name: "神州数码", share: 30 },
    ],
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2 overflow-x-auto">
      <h2 className="text-xs font-bold text-white mb-2">
        供应链全景流程 · 从芯片设计到整机集成
      </h2>
      <div className="flex items-start gap-0 min-w-[1000px]">
        {FLOW_TIERS.map((ft, i) => {
          const cfg = TIER_CONFIG[ft.tier];
          return (
            <div key={ft.tier} className="flex items-start">
              <div className="flex flex-col items-center" style={{ minWidth: 88 }}>
                <div
                  className="rounded px-1.5 py-0.5 text-[9px] font-bold text-center whitespace-nowrap"
                  style={{ color: cfg.color, backgroundColor: cfg.bgColor }}
                >
                  {cfg.label}
                </div>
                <div className="mt-1 space-y-0.5 w-full px-0.5">
                  {ft.items.map((item) => (
                    <div
                      key={item.name}
                      className="rounded bg-white/[0.04] px-1 py-0.5 text-center"
                    >
                      <div className="text-[9px] text-gray-300 whitespace-nowrap leading-tight">
                        {item.name}
                      </div>
                      <div className="flex items-center gap-0.5">
                        <div className="flex-1 h-0.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.share}%`, backgroundColor: cfg.color, opacity: 0.7 }}
                          />
                        </div>
                        <span className="text-[7px] font-mono font-bold shrink-0" style={{ color: cfg.color }}>
                          {item.share}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {i < FLOW_TIERS.length - 1 && (
                <div className="flex items-center pt-2 px-0 text-gray-600">
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center gap-3 text-[9px] text-gray-500 border-t border-white/5 pt-1.5">
        <span>128 计算柜 + 32 互联柜 = 8,192 卡</span>
        <span>|</span>
        <span>柜内铜 FullMesh → 柜间 MEMS-OCS 全光</span>
        <span>|</span>
        <span>16.3 PB/s · &lt;2.1μs</span>
        <span>|</span>
        <span className="text-gray-400">同层合计 100%</span>
      </div>
    </div>
  );
}
