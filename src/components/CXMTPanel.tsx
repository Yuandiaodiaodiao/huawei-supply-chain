import { CXMT_PROFILE } from "@/lib/supply-chain-data";

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between py-1 border-b border-white/5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`text-xs font-mono font-semibold text-right ${accent ? "text-purple-400" : "text-gray-200"}`}>
        {value}
      </span>
    </div>
  );
}

export function CXMTPanel() {
  const c = CXMT_PROFILE;
  const ipo = c.ipo;
  const fin = c.financials;

  return (
    <div className="rounded-xl border border-purple-500/20 bg-[var(--card-bg)] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            <h2 className="text-sm font-bold text-white">{c.name}</h2>
            <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-bold text-purple-400">
              HBM3 代工
            </span>
          </div>
          <p className="text-[11px] text-gray-500">{c.nameEn}</p>
        </div>
        <div className="shrink-0 rounded-md bg-amber-500/10 px-2 py-1 text-[10px] font-bold text-amber-400">
          IPO 进行中
        </div>
      </div>

      <p className="text-xs text-gray-400 leading-relaxed mb-4 border-l-2 border-purple-500/30 pl-3">
        {c.huaweiRelation}
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* IPO */}
        <div>
          <h3 className="text-[11px] font-bold text-purple-400 mb-2">科创板 IPO</h3>
          <Row label="状态" value={ipo.status} />
          <Row label="保荐" value={ipo.sponsor} />
          <Row label="受理日" value={ipo.filingDate} />
          <Row label="募资" value={ipo.fundraising} accent />
          <Row label="估值" value={ipo.preIpoValuation} accent />
          <Row label="中止原因" value={ipo.suspendReason} />
        </div>

        {/* Financials */}
        <div>
          <h3 className="text-[11px] font-bold text-purple-400 mb-2">财务数据</h3>
          <Row label="2024 营收" value={fin.revenue2024} />
          <Row label="2024 净利" value={fin.netIncome2024} />
          <Row label="2025 前三季" value={fin.revenue2025H1to9} />
          <Row label="2025E 营收" value={fin.revenue2025E} accent />
          <Row label="2025E 净利" value={fin.netIncome2025E} accent />
        </div>

        {/* Key Partners */}
        <div>
          <h3 className="text-[11px] font-bold text-purple-400 mb-2">核心供应链伙伴</h3>
          <div className="space-y-1.5">
            {c.keyPartners.map((p) => (
              <div
                key={p.code}
                className="flex items-center justify-between rounded bg-white/[0.03] px-2 py-1.5"
              >
                <div>
                  <span className="text-[11px] font-semibold text-white">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-gray-500 ml-1.5">
                    {p.role}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-gray-500">
                  {p.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
