# Bluesky Client 開発ガイド

## 📚 AT Protocol & @atproto/api 理解

### 🏗️ アーキテクチャ概要

```text
@atproto/api ← 【メインライブラリ - これだけでクライアント作成可能】
    ↓ (内部依存)
┌── @atproto/xrpc        ← HTTP通信レイヤー
├── @atproto/lexicon     ← スキーマ定義・バリデーション
├── @atproto/syntax      ← 識別子・フォーマット検証（DID、Handle、NSID、AT URI）
└── @atproto/common-web  ← 共通ユーティリティ
```

### 💡 開発者が知るべきこと

- **開発者は `@atproto/api` のみインポートすればOK**
- 他の4つのパッケージは内部で自動的に動作
- 全てのBluesky機能がこの1つのライブラリに集約されている

---

## 🎯 @atproto/api の機能分類

### 1. **AT Protocol コア機能** (`com.atproto.*`)

#### 🔐 **認証・セッション管理**

```typescript
agent.com.atproto.server.createSession()     // ログイン
agent.com.atproto.server.deleteSession()     // ログアウト
agent.com.atproto.server.refreshSession()    // セッション更新
agent.com.atproto.server.createAccount()     // アカウント作成
```

#### 💾 **データ操作（低レベル）**

```typescript
agent.com.atproto.repo.createRecord()        // レコード作成
agent.com.atproto.repo.getRecord()           // レコード取得
agent.com.atproto.repo.deleteRecord()        // レコード削除
agent.com.atproto.repo.uploadBlob()          // ファイルアップロード
```

#### 🆔 **アイデンティティ管理**

```typescript
agent.com.atproto.identity.resolveHandle()   // ハンドル→DID変換
agent.com.atproto.identity.updateHandle()    // ハンドル更新
```

### 2. **Bluesky アプリケーション機能** (`app.bsky.*`) ⭐️ **メイン**

#### 👤 **ユーザー・プロフィール** (`app.bsky.actor.*`)

```typescript
// プロフィール取得・管理
agent.app.bsky.actor.getProfile()               // プロフィール取得
agent.app.bsky.actor.getProfiles()              // 複数プロフィール取得
agent.app.bsky.actor.getPreferences()           // ユーザー設定取得
agent.app.bsky.actor.putPreferences()           // ユーザー設定更新

// ユーザー検索・発見
agent.app.bsky.actor.searchActors()             // ユーザー検索
agent.app.bsky.actor.searchActorsTypeahead()    // 先行入力検索
agent.app.bsky.actor.getSuggestions()           // おすすめユーザー

// プロフィール管理（レコード操作）
agent.app.bsky.actor.profile.create()           // プロフィール作成
agent.app.bsky.actor.profile.update()           // プロフィール更新
agent.app.bsky.actor.status.create()            // ステータス設定
```

#### 📝 **投稿・フィード** (`app.bsky.feed.*`)

```typescript
// タイムライン・フィード取得
agent.app.bsky.feed.getTimeline()               // タイムライン取得
agent.app.bsky.feed.getAuthorFeed()             // ユーザーの投稿一覧
agent.app.bsky.feed.getActorFeeds()             // ユーザーのフィード一覧
agent.app.bsky.feed.getActorLikes()             // ユーザーのいいね一覧
agent.app.bsky.feed.getListFeed()               // リストのフィード

// 投稿取得・詳細
agent.app.bsky.feed.getPosts()                  // 複数投稿取得
agent.app.bsky.feed.getPostThread()             // スレッド取得
agent.app.bsky.feed.getQuotes()                 // 引用投稿取得

// フィードジェネレーター
agent.app.bsky.feed.getFeedGenerator()          // フィードジェネレーター取得
agent.app.bsky.feed.getFeedGenerators()         // 複数フィードジェネレーター
agent.app.bsky.feed.getFeed()                   // カスタムフィード取得
agent.app.bsky.feed.getSuggestedFeeds()         // おすすめフィード
agent.app.bsky.feed.describeFeedGenerator()     // フィード説明
agent.app.bsky.feed.generator.create()          // フィードジェネレーター作成

// 投稿作成・管理
agent.app.bsky.feed.post.create()               // 投稿作成
agent.app.bsky.feed.post.delete()               // 投稿削除
agent.app.bsky.feed.searchPosts()               // 投稿検索
agent.app.bsky.feed.sendInteractions()          // インタラクション送信

// 投稿制御
agent.app.bsky.feed.postgate.create()           // 投稿ゲート作成
agent.app.bsky.feed.threadgate.create()         // スレッドゲート作成
```

#### ❤️ **いいね・リポスト** (`app.bsky.feed.*`)

```typescript
// いいね
agent.app.bsky.feed.like.create()               // いいね作成
agent.app.bsky.feed.like.delete()               // いいね削除
agent.app.bsky.feed.getLikes()                  // いいね一覧取得

// リポスト
agent.app.bsky.feed.repost.create()             // リポスト作成
agent.app.bsky.feed.repost.delete()             // リポスト削除
agent.app.bsky.feed.getRepostedBy()             // リポストユーザー一覧
```

#### 👥 **フォロー・ソーシャルグラフ** (`app.bsky.graph.*`)

```typescript
// フォロー関係
agent.app.bsky.graph.follow.create()            // フォロー
agent.app.bsky.graph.follow.delete()            // フォロー解除
agent.app.bsky.graph.getFollows()               // フォロー一覧
agent.app.bsky.graph.getFollowers()             // フォロワー一覧
agent.app.bsky.graph.getKnownFollowers()        // 共通フォロワー
agent.app.bsky.graph.getRelationships()         // 関係性取得
agent.app.bsky.graph.getSuggestedFollowsByActor() // おすすめフォロー

// ブロック・ミュート
agent.app.bsky.graph.block.create()             // ブロック作成
agent.app.bsky.graph.block.delete()             // ブロック解除
agent.app.bsky.graph.getBlocks()                // ブロック一覧
agent.app.bsky.graph.muteActor()                // ユーザーミュート
agent.app.bsky.graph.unmuteActor()              // ユーザーミュート解除
agent.app.bsky.graph.getMutes()                 // ミュート一覧
agent.app.bsky.graph.muteThread()               // スレッドミュート
agent.app.bsky.graph.unmuteThread()             // スレッドミュート解除

// リスト管理
agent.app.bsky.graph.list.create()              // リスト作成
agent.app.bsky.graph.list.update()              // リスト更新
agent.app.bsky.graph.list.delete()              // リスト削除
agent.app.bsky.graph.getList()                  // リスト取得
agent.app.bsky.graph.getLists()                 // リスト一覧
agent.app.bsky.graph.listitem.create()          // リストアイテム追加
agent.app.bsky.graph.listitem.delete()          // リストアイテム削除
agent.app.bsky.graph.listblock.create()         // リストブロック
agent.app.bsky.graph.getListBlocks()            // ブロックリスト取得
agent.app.bsky.graph.getListMutes()             // ミュートリスト取得
agent.app.bsky.graph.muteActorList()            // リストミュート
agent.app.bsky.graph.unmuteActorList()          // リストミュート解除

// スターターパック
agent.app.bsky.graph.starterpack.create()       // スターターパック作成
agent.app.bsky.graph.getStarterPack()           // スターターパック取得
agent.app.bsky.graph.getStarterPacks()          // スターターパック一覧
agent.app.bsky.graph.getActorStarterPacks()     // ユーザーのスターターパック
agent.app.bsky.graph.searchStarterPacks()       // スターターパック検索

// 認証・検証
agent.app.bsky.graph.verification.create()      // 認証作成
```

#### 🔔 **通知** (`app.bsky.notification.*`)

```typescript
// 通知管理
agent.app.bsky.notification.listNotifications()        // 通知一覧
agent.app.bsky.notification.getUnreadCount()           // 未読数取得
agent.app.bsky.notification.updateSeen()               // 既読マーク
agent.app.bsky.notification.getPreferences()           // 通知設定取得
agent.app.bsky.notification.putPreferences()           // 通知設定更新
agent.app.bsky.notification.putPreferencesV2()         // 通知設定更新V2

// プッシュ通知
agent.app.bsky.notification.registerPush()             // プッシュ通知登録
agent.app.bsky.notification.unregisterPush()           // プッシュ通知解除

// アクティビティ購読
agent.app.bsky.notification.listActivitySubscriptions() // アクティビティ購読一覧
agent.app.bsky.notification.putActivitySubscription()   // アクティビティ購読設定

// 通知宣言
agent.app.bsky.notification.declaration.create()       // 通知宣言作成
```

#### 🎨 **埋め込みコンテンツ型定義** (`app.bsky.embed.*`)

```typescript
// 注意: これらは型定義であり、実行可能なメソッドではありません
// 投稿作成時のembedプロパティで使用する型定義です

// 画像埋め込み型
AppBskyEmbedImages.Main                          // 画像埋め込み型
AppBskyEmbedImages.Image                         // 個別画像型

// 外部リンク埋め込み型
AppBskyEmbedExternal.Main                        // 外部リンク埋め込み型
AppBskyEmbedExternal.External                    // 外部リンク詳細型

// レコード埋め込み型（引用など）
AppBskyEmbedRecord.Main                          // レコード埋め込み型
AppBskyEmbedRecordWithMedia.Main                 // メディア付きレコード埋め込み型

// 動画埋め込み型
AppBskyEmbedVideo.Main                           // 動画埋め込み型
```

#### 📝 **リッチテキスト型定義** (`app.bsky.richtext.*`)

```typescript
// 注意: これらは型定義であり、実行可能なメソッドではありません
// 投稿のtextプロパティと併用するfacetsで使用する型定義です

AppBskyRichtextFacet.Main                        // リッチテキストファセット型
AppBskyRichtextFacet.ByteSlice                   // バイトスライス型
AppBskyRichtextFacet.Link                        // リンクファセット型
AppBskyRichtextFacet.Mention                     // メンションファセット型
AppBskyRichtextFacet.Tag                         // ハッシュタグファセット型
```

#### 🏷️ **ラベラー・モデレーション** (`app.bsky.labeler.*`)

```typescript
// ラベラーサービス
agent.app.bsky.labeler.getServices()            // ラベラーサービス取得
agent.app.bsky.labeler.service.create()         // ラベラーサービス作成
```

#### 🎥 **動画機能** (`app.bsky.video.*`)

```typescript
// 動画アップロード・管理
agent.app.bsky.video.uploadVideo()              // 動画アップロード
agent.app.bsky.video.getJobStatus()             // ジョブステータス取得
agent.app.bsky.video.getUploadLimits()          // アップロード制限取得
```

### 3. **チャット機能** (`chat.bsky.*`)

```typescript
agent.chat.bsky.convo.sendMessage()          // メッセージ送信
agent.chat.bsky.convo.listConvos()           // 会話一覧
agent.chat.bsky.convo.getMessages()          // メッセージ取得
```

### 4. **実験的機能** (`app.bsky.unspecced.*`) 🧪

```typescript
// フィード・発見
agent.app.bsky.unspecced.getPopularFeedGenerators()     // 人気フィードジェネレーター
agent.app.bsky.unspecced.getSuggestedFeeds()            // おすすめフィード
agent.app.bsky.unspecced.getSuggestedFeedsSkeleton()    // おすすめフィードスケルトン
agent.app.bsky.unspecced.getTaggedSuggestions()         // タグ付きサジェスト
agent.app.bsky.unspecced.getSuggestionsSkeleton()       // サジェストスケルトン

// ユーザー発見
agent.app.bsky.unspecced.getSuggestedUsers()            // おすすめユーザー
agent.app.bsky.unspecced.getSuggestedUsersSkeleton()    // おすすめユーザースケルトン

// スターターパック
agent.app.bsky.unspecced.getSuggestedStarterPacks()     // おすすめスターターパック
agent.app.bsky.unspecced.getSuggestedStarterPacksSkeleton() // スターターパックスケルトン

// トレンド・話題
agent.app.bsky.unspecced.getTrendingTopics()            // トレンドトピック
agent.app.bsky.unspecced.getTrends()                    // トレンド取得
agent.app.bsky.unspecced.getTrendsSkeleton()            // トレンドスケルトン

// 検索
agent.app.bsky.unspecced.searchActorsSkeleton()         // ユーザー検索スケルトン
agent.app.bsky.unspecced.searchPostsSkeleton()          // 投稿検索スケルトン
agent.app.bsky.unspecced.searchStarterPacksSkeleton()   // スターターパック検索スケルトン

// スレッド機能
agent.app.bsky.unspecced.getPostThreadV2()              // 投稿スレッドV2
agent.app.bsky.unspecced.getPostThreadOtherV2()         // その他スレッドV2

// 設定・状態
agent.app.bsky.unspecced.getConfig()                    // 設定取得
agent.app.bsky.unspecced.getAgeAssuranceState()         // 年齢確認状態
agent.app.bsky.unspecced.initAgeAssurance()             // 年齢確認初期化

// ハンドル関連
agent.app.bsky.unspecced.checkHandleAvailability()      // ハンドル利用可能性チェック
```

---

## 🛠️ 実装パターン

### 1. **シングルトンエージェント** ✅ 現在の実装

```typescript
// src/lib/api.ts
let agentInstance: AtpAgent | null = null;

export const getAgent = async () => {
  if (!agentInstance) {
    agentInstance = await createAuthenticatedAgent();
  }
  return agentInstance;
};
```

### 2. **基本的な投稿作成**

```typescript
await agent.app.bsky.feed.post.create(
  { repo: agent.session?.did },
  {
    text: "Hello Bluesky!",
    createdAt: new Date().toISOString(),
  }
)
```

### 3. **画像付き投稿**

```typescript
// 1. 画像をアップロード
const uploadResult = await agent.com.atproto.repo.uploadBlob(imageData)

// 2. 投稿に埋め込み（app.bsky.embed.images型を使用）
await agent.app.bsky.feed.post.create(
  { repo: agent.session?.did },
  {
    text: "画像付き投稿！",
    embed: {
      $type: 'app.bsky.embed.images',
      images: [{ image: uploadResult.data.blob, alt: "説明" }]
    },
    createdAt: new Date().toISOString(),
  }
)
```

### 4. **リッチテキスト投稿（メンション・リンク・ハッシュタグ）**

```typescript
// RichTextライブラリを使用
import { RichText } from '@atproto/api'

const richText = new RichText({
  text: 'Hello @alice.bsky.social! Check out https://bsky.app #bluesky'
})
await richText.detectFacets(agent) // メンション・リンクを自動検出

await agent.app.bsky.feed.post.create(
  { repo: agent.session?.did },
  {
    text: richText.text,
    facets: richText.facets, // app.bsky.richtext.facet型が使用される
    createdAt: new Date().toISOString(),
  }
)

```

---

## 🎯 クライアント開発で使う主要機能

### ✅ **必須機能**

- ✅ 認証・ログイン
- ✅ プロフィール表示
- ✅ タイムライン表示
- ✅ 投稿作成・表示
- ✅ いいね・リポスト
- ✅ フォロー・フォロワー管理

### 🔥 **追加したい機能**

- 🔔 通知システム
- 💬 DM・チャット
- 🔍 検索機能
- 📋 リスト管理
- 🚫 ブロック・ミュート
- 🖼️ 画像・動画投稿

---

## 📂 プロジェクト構成

```shell
my-bsky-app/
├── src/
│   ├── lib/
│   │   └── api.ts          ← シングルトンエージェント
│   ├── app/
│   │   └── page.tsx        ← メインページ
│   └── components/         ← UIコンポーネント
├── .env.local              ← 認証情報
└── bskyClient-index.md     ← このドキュメント
```

---

## 🚀 開発ロードマップ

### Phase 1: 基本機能 🎯 **現在ここ**

- [x] 認証・エージェント設定
- [x] プロフィール表示
- [x] フィード一覧表示
- [ ] 投稿作成
- [ ] いいね・リポスト

### Phase 2: ソーシャル機能

- [ ] フォロー・フォロワー管理
- [ ] ユーザー検索
- [ ] 通知システム

### Phase 3: 高度な機能

- [ ] 画像・動画投稿
- [ ] DM・チャット
- [ ] リスト管理
- [ ] カスタムフィード

---

## 💡 開発のコツ

1. **`app.bsky.*` を中心に使う** - 一般的なクライアント機能
2. **`com.atproto.*` は低レベル操作** - 特殊な処理のみ
3. **便利メソッドを優先** - READMEの便利メソッドから始める
4. **型安全性を活用** - TypeScriptの型定義が完備されている
5. **エラーハンドリング** - 各APIは適切なエラーレスポンスを返す

---

## 🔗 参考リンク

- [AT Protocol Documentation](https://atproto.com)
- [@atproto/api GitHub](https://github.com/bluesky-social/atproto/tree/main/packages/api)
- [Bluesky API Documentation](https://docs.bsky.app)

---

## Last updated: 2025年7月27日
