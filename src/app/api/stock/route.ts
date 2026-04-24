import { NextRequest, NextResponse } from "next/server";

interface StockQuote {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: string;
  timestamp: string;
}

const EXCHANGE_PREFIX: Record<string, string> = {
  SZ: "sz",
  SH: "sh",
};

async function fetchSinaQuote(
  stockCode: string,
  exchange: string
): Promise<StockQuote | null> {
  const prefix = EXCHANGE_PREFIX[exchange];
  if (!prefix) return null;

  const symbol = `${prefix}${stockCode}`;
  const url = `https://hq.sinajs.cn/list=${symbol}`;

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://finance.sina.com.cn",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 30 },
    });

    const text = await res.text();
    const match = text.match(/="(.+)"/);
    if (!match || !match[1]) return null;

    const parts = match[1].split(",");
    if (parts.length < 32) return null;

    const name = parts[0];
    const open = parseFloat(parts[1]);
    const prevClose = parseFloat(parts[2]);
    const price = parseFloat(parts[3]);
    const high = parseFloat(parts[4]);
    const low = parseFloat(parts[5]);
    const volume = parts[8];
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

    return {
      code: stockCode,
      name,
      price,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      open,
      high,
      low,
      volume: formatVolume(parseFloat(volume)),
      timestamp: `${parts[30]} ${parts[31]}`,
    };
  } catch {
    return null;
  }
}

function formatVolume(v: number): string {
  if (v >= 1e8) return `${(v / 1e8).toFixed(2)}亿`;
  if (v >= 1e4) return `${(v / 1e4).toFixed(0)}万`;
  return v.toFixed(0);
}

export async function GET(request: NextRequest) {
  const codes = request.nextUrl.searchParams.get("codes");
  if (!codes) {
    return NextResponse.json(
      { error: "Missing codes parameter" },
      { status: 400 }
    );
  }

  const pairs = codes.split(",").map((c) => {
    const [code, exchange] = c.split(":");
    return { code, exchange };
  });

  const results = await Promise.allSettled(
    pairs.map(({ code, exchange }) => fetchSinaQuote(code, exchange))
  );

  const quotes: Record<string, StockQuote | null> = {};
  results.forEach((r, i) => {
    const code = pairs[i].code;
    quotes[code] = r.status === "fulfilled" ? r.value : null;
  });

  return NextResponse.json({
    quotes,
    fetchedAt: new Date().toISOString(),
  });
}
