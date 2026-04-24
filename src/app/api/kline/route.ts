import { NextRequest, NextResponse } from "next/server";

export interface KLineBar {
  day: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
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

  const results = await Promise.allSettled(
    pairs.map(({ code, exchange }) => fetchDailyKLine(code, exchange, count))
  );

  const klines: Record<string, KLineBar[]> = {};
  results.forEach((r, i) => {
    klines[pairs[i].code] = r.status === "fulfilled" ? r.value : [];
  });

  return NextResponse.json({ klines, fetchedAt: new Date().toISOString() });
}
