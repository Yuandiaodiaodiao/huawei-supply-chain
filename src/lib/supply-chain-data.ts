export type SupplyTier =
  | "chip_design"
  | "wafer_fab"
  | "packaging"
  | "hbm"
  | "optical_module"
  | "optical_switch"
  | "connector"
  | "server_integration"
  | "thermal"
  | "storage";

export interface SupplyChainNode {
  id: string;
  name: string;
  nameEn: string;
  tier: SupplyTier;
  tierLabel: string;
  role: string;
  stockCode: string | null; // null = unlisted
  stockExchange: "SZ" | "SH" | "HK" | null;
  supplyShare: number; // 0–100, same tier sums to 100
  marketShare?: string;
  keyProducts: string[];
  highlight?: string;
}

export interface SupplyChainLink {
  from: string;
  to: string;
  label: string;
}

export const TIER_CONFIG: Record<
  SupplyTier,
  { label: string; color: string; bgColor: string; order: number }
> = {
  chip_design: {
    label: "芯片设计",
    color: "#E53935",
    bgColor: "rgba(229,57,53,0.08)",
    order: 0,
  },
  wafer_fab: {
    label: "晶圆代工",
    color: "#F4511E",
    bgColor: "rgba(244,81,30,0.08)",
    order: 1,
  },
  hbm: {
    label: "HBM 存储",
    color: "#7B1FA2",
    bgColor: "rgba(123,31,162,0.08)",
    order: 2,
  },
  packaging: {
    label: "先进封装",
    color: "#1E88E5",
    bgColor: "rgba(30,136,229,0.08)",
    order: 3,
  },
  optical_switch: {
    label: "OCS 光交换",
    color: "#00897B",
    bgColor: "rgba(0,137,123,0.08)",
    order: 4,
  },
  optical_module: {
    label: "光模块",
    color: "#43A047",
    bgColor: "rgba(67,160,71,0.08)",
    order: 5,
  },
  connector: {
    label: "高速连接器",
    color: "#FFB300",
    bgColor: "rgba(255,179,0,0.08)",
    order: 6,
  },
  thermal: {
    label: "散热/基板",
    color: "#6D4C41",
    bgColor: "rgba(109,76,65,0.08)",
    order: 7,
  },
  storage: {
    label: "存储",
    color: "#546E7A",
    bgColor: "rgba(84,110,122,0.08)",
    order: 8,
  },
  server_integration: {
    label: "整机集成",
    color: "#5C6BC0",
    bgColor: "rgba(92,107,192,0.08)",
    order: 9,
  },
};

export const supplyChainNodes: SupplyChainNode[] = [
  // ── Chip Design ──
  {
    id: "huawei_hisilicon",
    name: "华为海思",
    nameEn: "HiSilicon",
    tier: "chip_design",
    tierLabel: "芯片设计",
    role: "昇腾 950 芯片架构设计、光互联控制器设计",
    stockCode: null,
    stockExchange: null,
    supplyShare: 100,
    keyProducts: [
      "Ascend 950PR (FP8 1PFLOPS)",
      "Ascend 950DT (FP8 2PFLOPS)",
      "光互联控制器",
    ],
    highlight: "第三代达芬奇架构，双DIE UMA，一芯双构策略",
  },

  // ── Wafer Fab ──
  {
    id: "smic",
    name: "中芯国际",
    nameEn: "SMIC",
    tier: "wafer_fab",
    tierLabel: "晶圆代工",
    role: "昇腾 950 晶圆独家代工（N+2/N+3 工艺）",
    stockCode: "688981",
    stockExchange: "SH",
    supplyShare: 100,
    marketShare: "100%（独家）",
    keyProducts: ["N+2 等效7nm", "N+3 等效5nm", "DUV多重曝光"],
    highlight: "月产能 3.8 万片 12 英寸，良率 N+2 达 92%",
  },

  // ── HBM ──
  {
    id: "huawei_hbm",
    name: "华为自研 HBM",
    nameEn: "Huawei HBM",
    tier: "hbm",
    tierLabel: "HBM 存储",
    role: "自研 HBM 突破三星/SK海力士/美光禁供",
    stockCode: null,
    stockExchange: null,
    supplyShare: 100,
    keyProducts: ["HiBL 1.0（低成本高容量）", "HiZQ 2.0（高带宽）"],
    highlight: "950PR: 112GB HBM | 950DT: 144GB / 4TB/s 带宽",
  },

  // ── Packaging ──
  {
    id: "xingsen",
    name: "兴森科技",
    nameEn: "Shennan Circuits",
    tier: "packaging",
    tierLabel: "封装基板",
    role: "昇腾封装基板（ABF载板）核心供应商",
    stockCode: "002436",
    stockExchange: "SZ",
    supplyShare: 40,
    marketShare: "~70%",
    keyProducts: ["ABF 载板", "FCBGA 封装基板"],
    highlight: "ABF 载板产能国内第一",
  },
  {
    id: "jcet",
    name: "长电科技",
    nameEn: "JCET",
    tier: "packaging",
    tierLabel: "先进封装",
    role: "Chiplet/HBM 集成先进封装",
    stockCode: "600584",
    stockExchange: "SH",
    supplyShare: 40,
    keyProducts: ["XDFOI Chiplet", "HBM3E 集成封装"],
    highlight: "HBM3E 良率 98.5%",
  },
  {
    id: "tfme",
    name: "通富微电",
    nameEn: "TFME",
    tier: "packaging",
    tierLabel: "先进封装",
    role: "多层堆叠封装，适配 950 芯片",
    stockCode: "002156",
    stockExchange: "SZ",
    supplyShare: 20,
    keyProducts: ["多层堆叠封装", "2.5D/3D 封装"],
  },

  // ── OCS Optical Switch ──
  {
    id: "silex",
    name: "赛微电子",
    nameEn: "Silex / Sai MicroElectronics",
    tier: "optical_switch",
    tierLabel: "MEMS 芯片代工",
    role: "MEMS-OCS 微镜芯片独家代工",
    stockCode: "300456",
    stockExchange: "SZ",
    supplyShare: 50,
    marketShare: "独家 ~60% 产能",
    keyProducts: ["MEMS 微镜芯片", "1024 路光交换适配"],
    highlight: "华为 OCS 芯片独家代工方",
  },
  {
    id: "o-net",
    name: "光库科技",
    nameEn: "O-Net Technologies",
    tier: "optical_switch",
    tierLabel: "MEMS 光开关",
    role: "MEMS 光开关已用于 Atlas 950 SuperPoD",
    stockCode: "300620",
    stockExchange: "SZ",
    supplyShare: 30,
    keyProducts: ["MEMS 光开关"],
  },
  {
    id: "tengjing",
    name: "腾景科技",
    nameEn: "Tengjing Tech",
    tier: "optical_switch",
    tierLabel: "无源光器件",
    role: "WSS、光环形器等核心光学组件",
    stockCode: "688195",
    stockExchange: "SH",
    supplyShare: 20,
    keyProducts: ["WSS", "光环形器", "无源光器件"],
  },

  // ── Optical Modules ──
  {
    id: "innolight",
    name: "中际旭创",
    nameEn: "Innolight",
    tier: "optical_module",
    tierLabel: "光模块",
    role: "1.6T 光模块独家供应",
    stockCode: "300308",
    stockExchange: "SZ",
    supplyShare: 25,
    marketShare: "1.6T 独家",
    keyProducts: ["1.6T 光模块"],
    highlight: "单集群需求超 6900 个，华为订单占营收约 15%",
  },
  {
    id: "hgtech",
    name: "华工科技",
    nameEn: "HUST Tech",
    tier: "optical_module",
    tierLabel: "光模块 / CPO",
    role: "800G 光模块 + 3.2T CPO 光引擎独家供应商",
    stockCode: "000988",
    stockExchange: "SZ",
    supplyShare: 40,
    marketShare: ">30%（光模块）/ CPO独家",
    keyProducts: ["800G 光模块", "3.2T CPO 光引擎"],
    highlight: "昇腾 AI 芯片约 90% 光模块由华工供应",
  },
  {
    id: "accelink",
    name: "光迅科技",
    nameEn: "Accelink",
    tier: "optical_module",
    tierLabel: "光模块",
    role: "全光交换机光模块 & 超节点光模块核心供应商",
    stockCode: "002281",
    stockExchange: "SZ",
    supplyShare: 15,
    keyProducts: ["全光交换机光模块", "2×4 超节点光模块"],
  },
  {
    id: "mega",
    name: "兆驰股份",
    nameEn: "MegaElectronics",
    tier: "optical_module",
    tierLabel: "光模块",
    role: "10G–800G 光模块直接供货华为",
    stockCode: "002429",
    stockExchange: "SZ",
    supplyShare: 12,
    keyProducts: ["800G 光模块", "BOSA 光器件"],
    highlight: "800G 于 2026 Q2 小批量出货华为",
  },
  {
    id: "dekeli",
    name: "德科立",
    nameEn: "DK Photonics",
    tier: "optical_module",
    tierLabel: "硅光模块",
    role: "硅光模块支撑跨集群数据传输",
    stockCode: "688205",
    stockExchange: "SH",
    supplyShare: 8,
    keyProducts: ["硅光模块"],
  },

  // ── Connectors ──
  {
    id: "huafeng",
    name: "华丰科技",
    nameEn: "Huafeng Tech",
    tier: "connector",
    tierLabel: "高速连接器",
    role: "昇腾高速背板连接器绝对龙头",
    stockCode: "688629",
    stockExchange: "SH",
    supplyShare: 60,
    marketShare: ">70%",
    keyProducts: ["224G 高速背板连接器", "线模组"],
    highlight: "获华为哈勃战略投资",
  },
  {
    id: "yihua",
    name: "意华股份",
    nameEn: "Yihua",
    tier: "connector",
    tierLabel: "高速连接器",
    role: "高速 I/O 连接器与光模块组件核心供应商",
    stockCode: "002897",
    stockExchange: "SZ",
    supplyShare: 40,
    marketShare: "~50%",
    keyProducts: ["800G 高速连接器"],
    highlight: "800G 高速连接器已批量供货华为",
  },

  // ── Thermal ──
  {
    id: "guoji",
    name: "国机精工",
    nameEn: "GMCC Precision",
    tier: "thermal",
    tierLabel: "散热基板",
    role: "金刚石散热基板供应商",
    stockCode: "002046",
    stockExchange: "SZ",
    supplyShare: 65,
    keyProducts: ["金刚石散热基板"],
    highlight: "导热性能提升 40%，已批量供货",
  },
  {
    id: "saiteng",
    name: "赛腾股份",
    nameEn: "Saiteng",
    tier: "thermal",
    tierLabel: "HBM 检测",
    role: "HBM 检测设备供应商",
    stockCode: "603283",
    stockExchange: "SH",
    supplyShare: 35,
    keyProducts: ["HBM 检测设备"],
  },

  // ── Storage ──
  {
    id: "gigadevice",
    name: "兆易创新",
    nameEn: "GigaDevice",
    tier: "storage",
    tierLabel: "服务器存储",
    role: "通过华坤凯德切入昇腾服务器存储",
    stockCode: "603986",
    stockExchange: "SH",
    supplyShare: 55,
    keyProducts: ["服务器 SSD", "自研主控芯片"],
    highlight: "同时是长鑫科技最大A股持股方（~1.88%）",
  },
  {
    id: "cxmt",
    name: "长鑫存储",
    nameEn: "CXMT",
    tier: "storage",
    tierLabel: "DRAM 原厂",
    role: "国产 DRAM 原厂（冲刺科创板 IPO）",
    stockCode: null,
    stockExchange: null,
    supplyShare: 45,
    keyProducts: ["DDR5", "LPDDR5"],
    highlight: "拟募资 295 亿元，Pre-IPO 估值约 1500 亿",
  },

  // ── Server Integration ──
  {
    id: "huakun",
    name: "华鲲振宇",
    nameEn: "Huakun Zhenyu",
    tier: "server_integration",
    tierLabel: "整机集成",
    role: "Atlas 服务器整机集成商",
    stockCode: null,
    stockExchange: null,
    supplyShare: 40,
    keyProducts: ["Atlas 服务器"],
  },
  {
    id: "talkweb",
    name: "拓维信息",
    nameEn: "Talkweb",
    tier: "server_integration",
    tierLabel: "整机集成",
    role: "昇腾 AI 服务器集成",
    stockCode: "002261",
    stockExchange: "SZ",
    supplyShare: 30,
    keyProducts: ["昇腾 AI 服务器"],
  },
  {
    id: "dcits",
    name: "神州数码",
    nameEn: "Digital China",
    tier: "server_integration",
    tierLabel: "整机集成",
    role: "昇腾服务器分销与集成",
    stockCode: "000034",
    stockExchange: "SZ",
    supplyShare: 30,
    keyProducts: ["昇腾服务器分销"],
  },
];

export const supplyChainLinks: SupplyChainLink[] = [
  { from: "huawei_hisilicon", to: "smic", label: "芯片设计→代工" },
  { from: "smic", to: "xingsen", label: "晶圆→封装基板" },
  { from: "smic", to: "jcet", label: "晶圆→先进封装" },
  { from: "smic", to: "tfme", label: "晶圆→封装" },
  { from: "huawei_hbm", to: "jcet", label: "HBM→封装集成" },
  { from: "xingsen", to: "jcet", label: "ABF载板→封装" },
  { from: "silex", to: "o-net", label: "MEMS芯片→光开关" },
  { from: "tengjing", to: "o-net", label: "无源器件→光开关" },
  { from: "innolight", to: "huawei_hisilicon", label: "1.6T光模块→SuperPoD" },
  { from: "hgtech", to: "huawei_hisilicon", label: "800G/CPO→SuperPoD" },
  { from: "huafeng", to: "huawei_hisilicon", label: "背板连接器→SuperPoD" },
  { from: "yihua", to: "huawei_hisilicon", label: "I/O连接器→SuperPoD" },
];

export const SUPERPOD_SPECS = {
  name: "Atlas 950 SuperPoD",
  chips: "8,192 × Ascend 950DT",
  computeCabinets: 128,
  interconnectCabinets: 32,
  totalMemory: "1,152 TB",
  fp8Compute: "8 EFLOPS",
  fp4Compute: "16 EFLOPS",
  interconnectBandwidth: "16.3 PB/s",
  crossRackLatency: "<2.1 μs",
  crossRackBandwidth: ">1 TB/s",
  interconnectProtocol: "灵衢 UnifiedBus (UB-Mesh)",
  maxScale: "50 万卡（SuperCluster）",
  topology: "柜内铜 FullMesh + 柜间 OCS 全光交换",
};

export const ASCEND_950_SPECS = {
  pr: {
    name: "Ascend 950PR",
    scenario: "Prefill & 推荐（推理）",
    fp8: "1 PFLOPS",
    fp4: "2 PFLOPS",
    hbm: "HiBL 1.0",
    memory: "112 GB",
    bandwidth: "1.4 TB/s",
    interconnect: "2 TB/s",
    power: "600W",
    availability: "2026 Q1",
    card: "Atlas 350",
  },
  dt: {
    name: "Ascend 950DT",
    scenario: "Decode & 训练",
    fp8: "2 PFLOPS",
    fp4: "4 PFLOPS",
    hbm: "HiZQ 2.0",
    memory: "144 GB",
    bandwidth: "4 TB/s",
    interconnect: "2 TB/s",
    power: "—",
    availability: "2026 Q4",
    card: "Atlas 950 SuperPoD",
  },
};

export const DEEPSEEK_V4_DEPLOYMENT = {
  model: "DeepSeek-V4-Pro",
  totalParams: "1.6T",
  activeParams: "49B",
  experts: 384,
  activeExperts: 6,
  contextLength: "1M tokens",
  ascend950Config: {
    perCardExperts_fp8: "8–14 个",
    minCards_fp8: "48–64 卡",
    totalVram_fp8: "~1.7 TB",
    perCardUsage: "~77–102 GB",
    recommendedConfig: "64 卡 EP（每卡 6 专家）",
  },
};
