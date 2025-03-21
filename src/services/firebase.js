import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, serverTimestamp } from "firebase/database";

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
console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: '[HIDDEN]'
});

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

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
  REQUESTER: '依頼主',
  SHOPPER: '購入者'
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
        { name: '玉ねぎ', defaultQuantity: 9 },
        { name: 'レモン', defaultQuantity: 4 }
      ]
    },
    food: {
      title: '食材',
      items: [
        { name: 'きぬ豆腐', defaultQuantity: 2 },
        { name: 'キャノーラ油', defaultQuantity: 1 },
        { name: '卵パック', defaultQuantity: 1 },
        { name: 'オリーブオイル', defaultQuantity: 1 },
        { name: 'お麩', defaultQuantity: 1 }
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
    food: {
      title: '食材',
      items: [
        { name: 'パン粉', defaultQuantity: 1 },
        { name: 'リードペーパー', defaultQuantity: 1 },
        { name: '味噌', defaultQuantity: 2 },
        { name: 'ソリッドX', defaultQuantity: 1 },
        { name: '乾燥わかめ', defaultQuantity: 1 },
        { name: 'かつおだし', defaultQuantity: 1 },
        { name: '小麦粉', defaultQuantity: 1 },
        { name: 'チャッカマン', defaultQuantity: 1 }
      ]
    }
  }
};

// リストIDを生成
export const generateListId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export { database, ref, set, onValue, serverTimestamp, push };
