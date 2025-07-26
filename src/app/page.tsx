import { getAgent } from "~/lib/api"

export default async function Homepage() {
  const agent = await getAgent();
  const feeds = await agent.app.bsky.unspecced.getPopularFeedGenerators({
    limit: 10,
  });
  const profile = await agent.app.bsky.actor.getProfile({
    actor: agent.session?.did || "",
  });
  if (!profile.data) {
    return <div>Profile not found</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">ようこそ、{profile.data.displayName}さん！</h1>

      {/* PopularFeedGeneratorsの内容 */}
      <h1 className="text-2xl font-bold mb-4">Top Feeds（10個取得中）</h1>
      <ul className="mb-6">
        {feeds.data.feeds.map((feed, i) => (
          <li key={feed.displayName} className="mb-2">フィード{i+1}: {feed.displayName}</li>
        ))}
      </ul>

      {/* ProfileViewDetailedコンポーネントの内容 */}
      <h1 className="text-2xl font-bold mb-4">ProfileViewDetailed</h1>
      <div className="space-y-2">
        <img src={profile.data.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
        <img src={profile.data.banner} alt="Banner" className="w-32 h-20 rounded" />
        <p className="text-sm"><span className="font-semibold">Handle:</span> {profile.data.handle}</p>
        <p className="text-sm"><span className="font-semibold">Display Name:</span> {profile.data.displayName}</p>
        <p className="text-sm"><span className="font-semibold">Description:</span> {profile.data.description}</p>
        <p className="text-sm"><span className="font-semibold">Followers Count:</span> {profile.data.followersCount}</p>
        <p className="text-sm"><span className="font-semibold">Follows Count:</span> {profile.data.followsCount}</p>
        <p className="text-sm"><span className="font-semibold">Posts Count:</span> {profile.data.postsCount}</p>
        <p className="text-sm"><span className="font-semibold">Joined Via Starter Pack:</span> {profile.data.joinedViaStarterPack ? "Yes" : "No"}</p>
        <p className="text-sm"><span className="font-semibold">Created At:</span> {profile.data.createdAt ? new Date(profile.data.createdAt).toLocaleDateString() : "N/A"}</p>
        <p className="text-sm"><span className="font-semibold">Indexed At:</span> {profile.data.indexedAt ? new Date(profile.data.indexedAt).toLocaleDateString() : "N/A"}</p>
        <p className="text-sm"><span className="font-semibold">Viewer State:</span> {profile.data.viewer ? "Available" : "Not Available"}</p>
        <p className="text-sm"><span className="font-semibold">Labels:</span> {profile.data.labels ? profile.data.labels.map(label => label.uri).join(", ") : "No Labels"}</p>
        <p className="text-sm"><span className="font-semibold">Pinned Post:</span> {profile.data.pinnedPost ? profile.data.pinnedPost.uri : "No Pinned Post"}</p>
        <p className="text-sm"><span className="font-semibold">Verification:</span> {profile.data.verification ? "Verified" : "Not Verified"}</p>
        <p className="text-sm"><span className="font-semibold">Status:</span> {profile.data.status ? JSON.stringify(profile.data.status) : "No Status"}</p>
      </div>

    </div>
  );
}
