import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, serverTimestamp, push } from "firebase/database";

// Firebase設定
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDi7i2EhUpIQqwtvg0sOK6itUhojZX1TPc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "shopping-list-share-43e1f.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://shopping-list-share-43e1f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "shopping-list-share-43e1f",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "shopping-list-share-43e1f.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "582639473155",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:582639473155:web:735113953f479b7a397436"
};

// Firebase初期化
console.log('Initializing Firebase with config:', { ...firebaseConfig, apiKey: '[HIDDEN]' });
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// エクスポート
export { database, ref, set, onValue, serverTimestamp, push };

// デフォルトの店舗設定
export const defaultStores = {
  okstore: {
    name: 'オーケーストア',
    hours: {
      open: '08:30',
      close: '21:30'
    }
  },
  hanamasa: {
    name: 'ハナマサ',
    hours: {
      open: '00:00',
      close: '24:00'
    }
  }
};

// リストの役割タイプ
export const roleTypes = {
  REQUESTER: 'requester', // 依頼側
  SHOPPER: 'shopper'      // 購入側
};

// リストの初期状態
export const initialListState = {
  metadata: {
    createdAt: null,
    currentRole: roleTypes.REQUESTER,
    status: {
      okstore: { requested: false, shopping: false, completed: false },
      hanamasa: { requested: false, shopping: false, completed: false }
    }
  },
  items: {
    okstore: {},
    hanamasa: {}
  }
};

// リストの進行状況の初期値
export const initialListStatus = {
  okstore: { inProgress: false, completedAt: null },
  hanamasa: { inProgress: false, completedAt: null }
};

// テンプレートアイテム
export const templateItems = {
  okstore: {
    vegetable: {
      title: '野菜',
      items: [
        { name: 'トレビス', defaultQuantity: 1 },
        { name: 'トマト', defaultQuantity: 2 },
        { name: 'レタス', defaultQuantity: 1 },
        { name: 'えのき', defaultQuantity: 1 },
        { name: '菜の花', defaultQuantity: 1 },
        { name: 'ケール', defaultQuantity: 1 },
        { name: '玉ねぎ', defaultQuantity: 2 }
      ]
    },
    tofu: {
      title: '豆腐・油',
      items: [
        { name: 'きぬ豆腐', defaultQuantity: 2 },
        { name: 'キャノーラ油', defaultQuantity: 1 }
      ]
    },
    rice: {
      title: 'お米',
      items: [
        { name: 'つや姫', defaultQuantity: 1 },
        { name: '秋田こまち', defaultQuantity: 1 }
      ]
    }
  },
  hanamasa: {
    meat: {
      title: '精肉',
      items: [
        { name: '鶏もも肉', defaultQuantity: 1 },
        { name: '豚バラ肉', defaultQuantity: 1 }
      ]
    },
    vegetable: {
      title: '野菜',
      items: [
        { name: 'もやし', defaultQuantity: 2 },
        { name: '青梗菜', defaultQuantity: 1 }
      ]
    }
  }
};

// リストIDを生成
export const generateListId = () => {
  return Math.random().toString(36).substring(2, 10);
};
