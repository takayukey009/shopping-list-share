import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, serverTimestamp, push } from "firebase/database";

// Firebase設定
const firebaseConfig = {
  apiKey: "AIzaSyDi7i2EhUpIQqwtvg0sOK6itUhojZX1TPc",
  authDomain: "shopping-list-share-43e1f.firebaseapp.com",
  databaseURL: "https://shopping-list-share-43e1f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shopping-list-share-43e1f",
  storageBucket: "shopping-list-share-43e1f.appspot.com",
  messagingSenderId: "582639473155",
  appId: "1:582639473155:web:735113953f479b7a397436"
};

// Firebase初期化
console.log('Initializing Firebase with config:', { ...firebaseConfig, apiKey: '[HIDDEN]' });
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// エクスポート
export { database, ref, set, onValue, serverTimestamp, push };

// デフォルトの店舗設定
export const defaultStores = {
  okstore: 'オーケーストア',
  hanamasa: 'ハナマサ'
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

// 新しいリストを作成
export const createNewList = async (storeName) => {
  const listRef = ref(database, 'lists/' + generateListId());
  const newList = {
    createdAt: serverTimestamp(),
    store: storeName,
    items: {}
  };
  await set(listRef, newList);
  return listRef;
};

// リストIDを生成
export const generateListId = () => {
  return Math.random().toString(36).substring(2, 10);
};

// リストの進行状況の初期値
export const initialListStatus = {
  okstore: { inProgress: false, completedAt: null },
  hanamasa: { inProgress: false, completedAt: null }
};
