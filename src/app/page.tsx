import { SpecsPanel } from "@/components/SpecsPanel";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <main className="min-h-screen grid-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-red-500"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">
                昇腾 950 SuperPoD · 全供应链看板
              </h1>
              <p className="text-[10px] text-gray-500">
                Atlas 950 SuperPoD Supply Chain Dashboard · 8,192 卡 · 8
                EFLOPS FP8 · 16.3 PB/s 全光互联
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-4 text-[10px] text-gray-600">
              <span>华为海思 → 中芯国际 → 先进封装 → 光互联 → 整机</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 space-y-6">
        {/* Architecture Flow */}
        <ArchitectureDiagram />

        {/* Specs Panels */}
        <SpecsPanel />

        {/* Supply Chain Dashboard */}
        <Dashboard />
      </div>

      {/* Footer */}
      <footer className="mt-8 border-t border-white/5 py-4 text-center text-[10px] text-gray-600">
        数据来源：公开财报、技术报告、券商研报 · 股票行情来自新浪财经 API · 仅供参考，不构成投资建议
      </footer>
    </main>
  );
}
