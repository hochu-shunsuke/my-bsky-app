import { AtpAgent } from "@atproto/api";

// シングルトンインスタンス
let agentInstance: AtpAgent | null = null;

// 認証済みエージェントを作成
const createAuthenticatedAgent = async () => {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });

  // 環境変数から認証情報を取得
  if (!process.env.BLUESKY_USERNAME || !process.env.BLUESKY_PASSWORD) {
    throw new Error("missing BLUESKY_USERNAME or BLUESKY_PASSWORD in environment variables");
  }

  // ログインしてセッションを取得
  await agent.login({
    identifier: process.env.BLUESKY_USERNAME!,
    password: process.env.BLUESKY_PASSWORD!
  });
  
  return agent;
};

// 認証済みエージェントを取得する関数（シングルトン）
export const getAgent = async () => {
  if (!agentInstance) {
    agentInstance = await createAuthenticatedAgent();
  }
  return agentInstance;
};


