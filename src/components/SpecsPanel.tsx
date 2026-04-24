import {
  SUPERPOD_SPECS,
  ASCEND_950_SPECS,
  DEEPSEEK_V4_DEPLOYMENT,
} from "@/lib/supply-chain-data";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-white/5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-mono font-semibold text-gray-200 text-right">
        {value}
      </span>
    </div>
  );
}

export function SpecsPanel() {
  const sp = SUPERPOD_SPECS;
  const pr = ASCEND_950_SPECS.pr;
  const dt = ASCEND_950_SPECS.dt;
  const ds = DEEPSEEK_V4_DEPLOYMENT;

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* SuperPod */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-red-500" style={{ animation: "pulse-glow 2s infinite" }} />
          <h2 className="text-sm font-bold text-white">Atlas 950 SuperPoD</h2>
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

      {/* Chip Specs */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="text-sm font-bold text-white mb-3">昇腾 950 芯片参数</h2>
        <div className="space-y-3">
          {[pr, dt].map((chip) => (
            <div key={chip.name} className="rounded-lg bg-white/[0.03] p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-white">{chip.name}</span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-gray-400">
                  {chip.scenario}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
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

      {/* DeepSeek V4 Deployment */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
        <h2 className="text-sm font-bold text-white mb-1">DeepSeek-V4-Pro 部署方案</h2>
        <p className="text-[10px] text-gray-500 mb-3">基于昇腾 950PR</p>
        <SpecRow label="总参数" value={ds.totalParams} />
        <SpecRow label="激活参数" value={ds.activeParams} />
        <SpecRow label="专家数" value={`${ds.experts} 个（激活 ${ds.activeExperts} 个）`} />
        <SpecRow label="上下文" value={ds.contextLength} />
        <div className="mt-3 rounded-lg bg-red-500/5 border border-red-500/10 p-3">
          <p className="text-[11px] font-semibold text-red-400 mb-1.5">昇腾 950 部署配置</p>
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
