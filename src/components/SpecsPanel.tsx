import {
  SUPERPOD_SPECS,
  ASCEND_950_SPECS,
  DEEPSEEK_V4_DEPLOYMENT,
} from "@/lib/supply-chain-data";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5 border-b border-white/5 last:border-0">
      <span className="text-[10px] text-gray-500">{label}</span>
      <span className="text-[10px] font-mono font-semibold text-gray-200 text-right">{value}</span>
    </div>
  );
}

export function SpecsPanel() {
  const sp = SUPERPOD_SPECS;
  const pr = ASCEND_950_SPECS.pr;
  const dt = ASCEND_950_SPECS.dt;
  const ds = DEEPSEEK_V4_DEPLOYMENT;

  return (
    <div className="grid gap-2 lg:grid-cols-3">
      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500" style={{ animation: "pulse-glow 2s infinite" }} />
          <h2 className="text-xs font-bold text-white">Atlas 950 SuperPoD</h2>
        </div>
        <SpecRow label="芯片数" value={sp.chips} />
        <SpecRow label="计算柜" value={`${sp.computeCabinets} 个`} />
        <SpecRow label="互联柜" value={`${sp.interconnectCabinets} 个`} />
        <SpecRow label="总内存" value={sp.totalMemory} />
        <SpecRow label="FP8 算力" value={sp.fp8Compute} />
        <SpecRow label="FP4 算力" value={sp.fp4Compute} />
        <SpecRow label="互联带宽" value={sp.interconnectBandwidth} />
        <SpecRow label="跨柜时延" value={sp.crossRackLatency} />
        <SpecRow label="跨柜带宽" value={sp.crossRackBandwidth} />
        <SpecRow label="互联协议" value={sp.interconnectProtocol} />
        <SpecRow label="拓扑" value={sp.topology} />
        <SpecRow label="最大扩展" value={sp.maxScale} />
      </div>

      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
        <h2 className="text-xs font-bold text-white mb-1.5">昇腾 950 芯片参数</h2>
        <div className="space-y-1.5">
          {[pr, dt].map((chip) => (
            <div key={chip.name} className="rounded bg-white/[0.03] px-2 py-1.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-white">{chip.name}</span>
                <span className="rounded bg-white/10 px-1 py-px text-[9px] text-gray-400">{chip.scenario}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3">
                <SpecRow label="FP8" value={chip.fp8} />
                <SpecRow label="FP4" value={chip.fp4} />
                <SpecRow label="HBM" value={chip.hbm} />
                <SpecRow label="容量" value={chip.memory} />
                <SpecRow label="带宽" value={chip.bandwidth} />
                <SpecRow label="互联" value={chip.interconnect} />
                <SpecRow label="功耗" value={chip.power} />
                <SpecRow label="上市" value={chip.availability} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
        <h2 className="text-xs font-bold text-white mb-0.5">DeepSeek-V4-Pro 部署方案</h2>
        <p className="text-[9px] text-gray-500 mb-1.5">基于昇腾 950PR</p>
        <SpecRow label="总参数" value={ds.totalParams} />
        <SpecRow label="激活参数" value={ds.activeParams} />
        <SpecRow label="专家数" value={`${ds.experts} 个（激活 ${ds.activeExperts} 个）`} />
        <SpecRow label="上下文" value={ds.contextLength} />
        <div className="mt-1.5 rounded bg-red-500/5 border border-red-500/10 px-2 py-1.5">
          <p className="text-[10px] font-semibold text-red-400 mb-1">昇腾 950 部署配置</p>
          <SpecRow label="每卡专家(FP8)" value={ds.ascend950Config.perCardExperts_fp8} />
          <SpecRow label="最少卡数(FP8)" value={ds.ascend950Config.minCards_fp8} />
          <SpecRow label="集群显存(FP8)" value={ds.ascend950Config.totalVram_fp8} />
          <SpecRow label="每卡占用" value={ds.ascend950Config.perCardUsage} />
          <SpecRow label="推荐配置" value={ds.ascend950Config.recommendedConfig} />
        </div>
      </div>
    </div>
  );
}
