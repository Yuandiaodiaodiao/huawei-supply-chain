import { NextRequest, NextResponse } from "next/server";

export interface KLineBar {
  day: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isToday?: boolean;
}

const EXCHANGE_PREFIX: Record<string, string> = { SZ: "sz", SH: "sh" };

async function fetchDailyKLine(
  stockCode: string,
  exchange: string,
  count: number
): Promise<KLineBar[]> {
  const prefix = EXCHANGE_PREFIX[exchange];
  if (!prefix) return [];

  const symbol = `${prefix}${stockCode}`;
  const url = `https://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=${symbol}&scale=240&ma=no&datalen=${count}`;

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://finance.sina.com.cn",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      next: { revalidate: 300 },
    });

    const data = await res.json();
    if (!Array.isArray(data)) return [];

    return data.map(
      (d: {
        day: string;
        open: string;
        high: string;
        low: string;
        close: string;
        volume: string;
      }) => ({
        day: d.day,
        open: parseFloat(d.open),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
        close: parseFloat(d.close),
        volume: parseFloat(d.volume),
      })
    );
  } catch {
    return [];
  }
}

async function fetchRealtimeQuote(
  stockCode: string,
  exchange: string
): Promise<KLineBar | null> {
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
      cache: "no-store",
    });

    const text = await res.text();
    const match = text.match(/="(.+)"/);
    if (!match || !match[1]) return null;

    const p = match[1].split(",");
    if (p.length < 32) return null;

    const open = parseFloat(p[1]);
    const price = parseFloat(p[3]);
    const high = parseFloat(p[4]);
    const low = parseFloat(p[5]);
    const volume = parseFloat(p[8]);
    const date = p[30]; // YYYY-MM-DD

    if (!open || !price || !date) return null;

    return {
      day: date,
      open,
      high,
      low,
      close: price,
      volume,
      isToday: true,
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const codes = request.nextUrl.searchParams.get("codes");
  const count = Math.min(
    parseInt(request.nextUrl.searchParams.get("count") || "60"),
    120
  );

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

  const [histResults, rtResults] = await Promise.all([
    Promise.allSettled(
      pairs.map(({ code, exchange }) => fetchDailyKLine(code, exchange, count))
    ),
    Promise.allSettled(
      pairs.map(({ code, exchange }) => fetchRealtimeQuote(code, exchange))
    ),
  ]);

  const klines: Record<string, KLineBar[]> = {};
  histResults.forEach((r, i) => {
    const code = pairs[i].code;
    const bars = r.status === "fulfilled" ? r.value : [];
    const rt =
      rtResults[i].status === "fulfilled" ? rtResults[i].value : null;

    if (rt && rt.open > 0) {
      const lastHistDay = bars.length > 0 ? bars[bars.length - 1].day : "";
      if (rt.day > lastHistDay) {
        bars.push(rt);
      } else if (rt.day === lastHistDay) {
        bars[bars.length - 1] = rt;
      }
    }

    klines[code] = bars;
  });

  return NextResponse.json({ klines, fetchedAt: new Date().toISOString() });
}
