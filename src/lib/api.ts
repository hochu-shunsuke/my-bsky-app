import { AtpAgent } from "@atproto/api";

// 認証済みエージェントを作成
const createAuthenticatedAgent = async () => {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });
  
  await agent.login({ 
    identifier: process.env.BLUESKY_USERNAME!, 
    password: process.env.BLUESKY_PASSWORD! 
  });
  
  return agent;
};

// 認証済みエージェントを取得する関数
export const getAgent = () => createAuthenticatedAgent();


