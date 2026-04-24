"use client";

export interface KLineBar {
  day: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isToday?: boolean;
}

const UP_COLOR = "#e53935";
const DOWN_COLOR = "#26a69a";
const FLAT_COLOR = "#666";

export function MiniKLine({
  bars,
  width = 220,
  height = 120,
}: {
  bars: KLineBar[];
  width?: number;
  height?: number;
}) {
  if (!bars || bars.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[10px] text-gray-600"
        style={{ width, height }}
      >
        暂无数据
      </div>
    );
  }

  const padTop = 2;
  const padBot = 14;
  const padLeft = 1;
  const padRight = 1;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBot;

  const allHigh = Math.max(...bars.map((b) => b.high));
  const allLow = Math.min(...bars.map((b) => b.low));
  const range = allHigh - allLow || 1;

  const barCount = bars.length;
  const gap = 1;
  const candleW = Math.max(1, (chartW - gap * (barCount - 1)) / barCount);
  const bodyW = Math.max(1, candleW * 0.7);
  const wickW = Math.max(0.5, candleW * 0.12);

  const priceToY = (p: number) =>
    padTop + chartH - ((p - allLow) / range) * chartH;

  const lastBar = bars[bars.length - 1];
  const prevBar = bars.length > 1 ? bars[bars.length - 2] : lastBar;
  const totalChange = lastBar.close - bars[0].open;
  const totalPct =
    bars[0].open > 0 ? ((totalChange / bars[0].open) * 100).toFixed(1) : "0";
  const periodColor = totalChange >= 0 ? UP_COLOR : DOWN_COLOR;

  const labelInterval = Math.max(1, Math.floor(barCount / 4));

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
    >
      {/* grid lines */}
      {[0.25, 0.5, 0.75].map((frac) => {
        const y = padTop + chartH * frac;
        return (
          <line
            key={frac}
            x1={padLeft}
            y1={y}
            x2={width - padRight}
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth={0.5}
          />
        );
      })}

      {/* candles */}
      {bars.map((bar, i) => {
        const x = padLeft + i * (candleW + gap);
        const cx = x + candleW / 2;
        const isUp = bar.close >= bar.open;
        const color =
          bar.close === bar.open ? FLAT_COLOR : isUp ? UP_COLOR : DOWN_COLOR;

        const bodyTop = priceToY(Math.max(bar.open, bar.close));
        const bodyBot = priceToY(Math.min(bar.open, bar.close));
        const bodyH = Math.max(0.5, bodyBot - bodyTop);

        const wickTop = priceToY(bar.high);
        const wickBot = priceToY(bar.low);

        const today = bar.isToday;

        return (
          <g key={i}>
            {/* today highlight bg */}
            {today && (
              <rect
                x={x - 1}
                y={padTop}
                width={candleW + 2}
                height={chartH}
                fill={color}
                opacity={0.06}
                rx={1}
              />
            )}
            {/* wick */}
            <line
              x1={cx}
              y1={wickTop}
              x2={cx}
              y2={wickBot}
              stroke={color}
              strokeWidth={today ? wickW * 1.5 : wickW}
            />
            {/* body */}
            <rect
              x={cx - bodyW / 2}
              y={bodyTop}
              width={bodyW}
              height={bodyH}
              fill={isUp ? (today ? `${color}33` : "transparent") : color}
              stroke={color}
              strokeWidth={isUp ? (today ? 1 : 0.6) : 0}
              rx={0.3}
            />
            {/* today dot marker */}
            {today && (
              <circle
                cx={cx}
                cy={padTop + chartH + 4}
                r={1.5}
                fill={color}
              />
            )}
          </g>
        );
      })}

      {/* date labels */}
      {bars.map((bar, i) => {
        if (i % labelInterval !== 0 && i !== barCount - 1) return null;
        const x = padLeft + i * (candleW + gap) + candleW / 2;
        const label = bar.day.slice(5);
        return (
          <text
            key={`d${i}`}
            x={x}
            y={height - 2}
            textAnchor="middle"
            fill="rgba(255,255,255,0.25)"
            fontSize={7}
            fontFamily="monospace"
          >
            {label}
          </text>
        );
      })}

      {/* last close price line */}
      <line
        x1={padLeft}
        y1={priceToY(lastBar.close)}
        x2={width - padRight}
        y2={priceToY(lastBar.close)}
        stroke={lastBar.close >= prevBar.close ? UP_COLOR : DOWN_COLOR}
        strokeWidth={0.5}
        strokeDasharray="2,2"
        opacity={0.5}
      />

      {/* period return badge */}
      <text
        x={width - padRight - 1}
        y={padTop + 8}
        textAnchor="end"
        fill={periodColor}
        fontSize={8}
        fontWeight="bold"
        fontFamily="monospace"
      >
        {totalChange >= 0 ? "+" : ""}
        {totalPct}%
      </text>
    </svg>
  );
}
