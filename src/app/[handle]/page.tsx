import { getAgent } from "~/lib/api";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: { handle: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const agent = await getAgent();
  // handleの形式はまた公式の確認する
  const profile = await agent.app.bsky.actor.getProfile({ actor: params.handle });
  if (!profile.data) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{profile.data.displayName}さんのプロフィール</h1>
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
