// Netlify Function：伺服器端代理讀取 Firstory RSS，避免瀏覽器端 CORS 問題。
// 前端呼叫路徑： /.netlify/functions/podcast-feed
const FEED_URL = "https://feed.firstory.me/rss/user/ckyplz2q7353e08820qist32e";

exports.handler = async function () {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) {
      return {
        statusCode: 502,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: "Upstream RSS feed error",
      };
    }
    const xml = await res.text();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=600", // 快取10分鐘，減少對Firstory的請求頻率
      },
      body: xml,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "RSS fetch failed: " + err.message,
    };
  }
};
