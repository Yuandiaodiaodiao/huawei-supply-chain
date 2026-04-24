import { SpecsPanel } from "@/components/SpecsPanel";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { StockKLineGrid } from "@/components/StockKLineGrid";
import { CXMTPanel } from "@/components/CXMTPanel";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-1.5 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-red-500/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="text-sm font-bold text-white">昇腾 950 SuperPoD · 全供应链看板</h1>
            <span className="text-[9px] text-gray-600 hidden sm:inline">
              8,192 卡 · 8 EFLOPS FP8 · 16.3 PB/s 全光互联
            </span>
            <span className="text-[9px] text-gray-600 ml-auto hidden sm:inline">
              华为海思 → 中芯国际 → 先进封装 → 光互联 → 整机
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 space-y-3">
        <ArchitectureDiagram />
        <StockKLineGrid />
        <CXMTPanel />
        <SpecsPanel />
        <Dashboard />
      </div>

      <footer className="mt-4 border-t border-white/5 py-2 text-center text-[9px] text-gray-600">
        数据来源：公开财报、技术报告、券商研报 · 股票行情来自新浪财经 API · 仅供参考，不构成投资建议
      </footer>
    </main>
  );
}
