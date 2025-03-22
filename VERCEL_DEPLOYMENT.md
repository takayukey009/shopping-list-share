# Vercelデプロイガイド

このアプリケーションをVercelにデプロイするには、以下の手順に従ってください。

## 環境変数の設定

Firebaseの環境変数を正しく設定することが重要です。Vercelのプロジェクト設定で以下の環境変数を設定してください：

```
REACT_APP_FIREBASE_API_KEY=<あなたのFirebase API Key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<あなたのFirebase Auth Domain>
REACT_APP_FIREBASE_DATABASE_URL=<あなたのFirebase Database URL>
REACT_APP_FIREBASE_PROJECT_ID=<あなたのFirebase Project ID>
REACT_APP_FIREBASE_STORAGE_BUCKET=<あなたのFirebase Storage Bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<あなたのFirebase Messaging Sender ID>
REACT_APP_FIREBASE_APP_ID=<あなたのFirebase App ID>
```

## Vercelでの環境変数設定方法

1. [Vercelダッシュボード](https://vercel.com/dashboard)にログインします
2. 該当するプロジェクトを選択します
3. 「Settings」タブをクリックします
4. 左側のメニューから「Environment Variables」を選択します
5. 上記の環境変数を一つずつ追加します
6. 「Save」ボタンをクリックして保存します
7. プロジェクトを再デプロイします

## ローカル開発環境での設定

ローカルで開発する場合は、プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、同じ環境変数を設定してください。

```
REACT_APP_FIREBASE_API_KEY=<あなたのFirebase API Key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<あなたのFirebase Auth Domain>
REACT_APP_FIREBASE_DATABASE_URL=<あなたのFirebase Database URL>
REACT_APP_FIREBASE_PROJECT_ID=<あなたのFirebase Project ID>
REACT_APP_FIREBASE_STORAGE_BUCKET=<あなたのFirebase Storage Bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<あなたのFirebase Messaging Sender ID>
REACT_APP_FIREBASE_APP_ID=<あなたのFirebase App ID>
```

## 注意事項

- 環境変数は機密情報なので、公開リポジトリに`.env`ファイルをコミットしないでください
- Vercelでの環境変数は、デプロイ時にビルドプロセスに組み込まれます
- 環境変数を変更した場合は、再デプロイが必要です
