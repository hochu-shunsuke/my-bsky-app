import { getAgent } from "~/lib/api"

export default async function Homepage() {
  const agent = await getAgent();
  const feeds = await agent.app.bsky.unspecced.getPopularFeedGenerators({
    limit: 10,
  });

  return (
    <div className="container mx-auto">
      <h1 className="font-bold text-xl my-4">Top Feeds（10個取得中）</h1>
      <ul>
        {feeds.data.feeds.map((feed, i) => (
          <li key={feed.displayName}>フィード{i+1}: {feed.displayName}</li>
        ))}
      </ul>
    </div>
  );
}
