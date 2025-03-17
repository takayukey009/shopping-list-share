# 買い物リスト共有アプリ

シンプルな買い物リスト共有Webアプリケーションです。URLベースで簡単に買い物リストを共有できます。

## 機能

- リアルタイムな買い物リストの共有
- 店舗ごとのテンプレートアイテム
- 買い物の進捗状況の表示
- モバイルフレンドリーなUI
- ユーザー認証不要のシンプルな共有機能

## 技術スタック

- React.js
- TailwindCSS
- Firebase Realtime Database
- Vite

## セットアップ

1. リポジトリをクローン
```bash
git clone <repository-url>
cd shopping-list-share
```

2. 依存関係のインストール
```bash
npm install
```

3. Firebase設定
- Firebaseコンソールで新しいプロジェクトを作成
- Realtime Databaseを有効化
- `.env`ファイルを作成し、以下の環境変数を設定:

```plaintext
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. 開発サーバーの起動
```bash
npm run dev
```

## データベース構造

```javascript
{
  "lists": {
    "[list_id]": {
      "store": "スーパー",
      "status": "準備中",
      "items": {
        "[item_id]": {
          "name": "商品名",
          "quantity": 1,
          "completed": false,
          "timestamp": serverTimestamp()
        }
      },
      "createdAt": serverTimestamp()
    }
  }
}
```

## 使い方

1. トップページで「新しいリストを作成」をクリック
2. 生成されたURLを共有
3. アイテムの追加、完了状態の更新、数量の変更が可能
4. 買い物の進捗状況をリアルタイムに確認

## 主要コンポーネント

- `Header.js`: ヘッダーとモード切替UI
- `StoreSelector.js`: 店舗選択タブ
- `ShoppingList.js`: 買い物リスト表示
- `ListItem.js`: 個別商品コンポーネント
- `QuickInput.js`: クイック入力フォーム
- `TemplateItems.js`: よく購入する商品テンプレート
- `ShoppingStatus.js`: 買い物進行状況表示

## デプロイ

Vercelを使用してデプロイする場合：

1. Vercel CLIをインストール
```bash
npm i -g vercel
```

2. デプロイを実行
```bash
vercel
```

## ライセンス

MIT
