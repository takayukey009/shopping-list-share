import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, serverTimestamp, push } from "firebase/database";

const firebaseConfig = {
  // Firebase設定は環境変数から読み込む
  apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const defaultStores = {
  okstore: 'オーケーストア',
  hanamasa: 'ハナマサ'
};

export const defaultTemplates = {
  okstore: {
    vegetable: {
      name: '野菜',
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
      name: '豆腐・油',
      items: [
        { name: 'きぬ豆腐', defaultQuantity: 2 },
        { name: 'キャノーラ油', defaultQuantity: 1 }
      ]
    },
    rice: {
      name: 'お米',
      items: [
        { name: 'つや姫', defaultQuantity: 1 },
        { name: '秋田こまち', defaultQuantity: 1 }
      ]
    }
  },
  hanamasa: {
    meat: {
      name: '精肉',
      items: [
        { name: '鶏もも肉', defaultQuantity: 1 },
        { name: '豚肩ロース', defaultQuantity: 1 },
        { name: '牛バラ肉', defaultQuantity: 1 }
      ]
    },
    frozen: {
      name: '冷凍食品',
      items: [
        { name: '冷凍餃子', defaultQuantity: 1 },
        { name: '冷凍唐揚げ', defaultQuantity: 1 }
      ]
    },
    seasoning: {
      name: '調味料',
      items: [
        { name: 'しょうゆ', defaultQuantity: 1 },
        { name: 'みりん', defaultQuantity: 1 },
        { name: '料理酒', defaultQuantity: 1 }
      ]
    }
  }
};

export const defaultListData = {
  items: {
    okstore: {},
    hanamasa: {}
  },
  status: {
    okstore: { inProgress: false, completedAt: null },
    hanamasa: { inProgress: false, completedAt: null }
  }
};

export const generateListId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export { database, ref, set, onValue, serverTimestamp, push };
