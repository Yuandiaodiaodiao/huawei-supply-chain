import { TIER_CONFIG, SupplyTier } from "@/lib/supply-chain-data";

const FLOW_TIERS: { tier: SupplyTier; items: string[] }[] = [
  { tier: "chip_design", items: ["华为海思 (设计)"] },
  { tier: "wafer_fab", items: ["中芯国际 (N+2/N+3)"] },
  { tier: "hbm", items: ["自研 HBM (HiBL/HiZQ)"] },
  {
    tier: "packaging",
    items: ["兴森科技 (ABF)", "长电科技 (Chiplet)", "通富微电"],
  },
  {
    tier: "optical_switch",
    items: ["赛微电子 (MEMS)", "光库科技 (光开关)", "腾景科技 (WSS)"],
  },
  {
    tier: "optical_module",
    items: [
      "中际旭创 (1.6T)",
      "华工科技 (800G/CPO)",
      "光迅科技",
      "兆驰 (800G)",
      "德科立 (硅光)",
    ],
  },
  {
    tier: "connector",
    items: ["华丰科技 (>70%)", "意华股份 (~50%)"],
  },
  { tier: "thermal", items: ["国机精工 (散热)", "赛腾股份 (检测)"] },
  { tier: "storage", items: ["兆易创新", "长鑫存储 (IPO中)"] },
  {
    tier: "server_integration",
    items: ["华鲲振宇", "拓维信息", "神州数码"],
  },
];

export function ArchitectureDiagram() {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 overflow-x-auto">
      <h2 className="text-sm font-bold text-white mb-4">
        供应链全景流程 · 从芯片设计到整机集成
      </h2>
      <div className="flex items-start gap-0 min-w-[900px]">
        {FLOW_TIERS.map((ft, i) => {
          const cfg = TIER_CONFIG[ft.tier];
          return (
            <div key={ft.tier} className="flex items-start">
              <div className="flex flex-col items-center" style={{ minWidth: 90 }}>
                <div
                  className="rounded-md px-2 py-1 text-[10px] font-bold text-center whitespace-nowrap"
                  style={{ color: cfg.color, backgroundColor: cfg.bgColor }}
                >
                  {cfg.label}
                </div>
                <div className="mt-2 space-y-1">
                  {ft.items.map((item) => (
                    <div
                      key={item}
                      className="rounded bg-white/[0.04] px-2 py-1 text-[10px] text-gray-300 text-center whitespace-nowrap"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              {i < FLOW_TIERS.length - 1 && (
                <div className="flex items-center pt-3 px-0.5 text-gray-600">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[10px] text-gray-500 border-t border-white/5 pt-3">
        <span>Atlas 950 SuperPoD：128 计算柜 + 32 互联柜 = 8,192 卡</span>
        <span>|</span>
        <span>互联：柜内铜 FullMesh → 柜间 MEMS-OCS 全光交换</span>
        <span>|</span>
        <span>16.3 PB/s 总带宽 · &lt;2.1μs 跨柜时延</span>
      </div>
    </div>
  );
}
