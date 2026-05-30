import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.NAVER_CLIENT_ID!;
const CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET!;

const cache = new Map<string, { thumbnail: string | null; roadAddress: string | null; title: string | null }>();

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });

  if (cache.has(query)) {
    return NextResponse.json(cache.get(query));
  }

  // Try image search for a real photo of the place
  const imgRes = await fetch(
    `https://openapi.naver.com/v1/search/image?query=${encodeURIComponent(query)}&display=1&filter=large`,
    {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    }
  );

  // Also fetch local search for address/title
  const localRes = await fetch(
    `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=1&sort=comment`,
    {
      headers: {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
      },
    }
  );

  let thumbnail: string | null = null;
  if (imgRes.ok) {
    const imgData = await imgRes.json();
    const link: string | undefined = imgData.items?.[0]?.link;
    thumbnail = link?.startsWith("https://") ? link : null;
  }

  let roadAddress: string | null = null;
  let title: string | null = null;
  if (localRes.ok) {
    const localData = await localRes.json();
    const item = localData.items?.[0];
    roadAddress = item?.roadAddress ?? null;
    title = item?.title?.replace(/<[^>]+>/g, "") ?? null;
  }

  const result = { thumbnail, roadAddress, title };
  cache.set(query, result);
  return NextResponse.json(result);
}
