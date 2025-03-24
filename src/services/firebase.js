import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push, get, serverTimestamp } from "firebase/database";

// Firebase設定
// 環境変数が設定されていない場合はデモ用の設定を使用
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDi7i2EhUpIQqwtvg0sOK6itUhojZX1TPc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "shopping-list-share-43e1f.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://shopping-list-share-43e1f-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "shopping-list-share-43e1f",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "shopping-list-share-43e1f.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:1234567890abcdef"
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
  },
  seijoishin: {
    name: '成城石井',
    hours: {
      open: '08:00',
      close: '22:00'
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
      hanamasa: { requested: false, shopping: false, completed: false },
      seijoishin: { requested: false, shopping: false, completed: false }
    }
  },
  items: {
    okstore: {},
    hanamasa: {},
    seijoishin: {}
  }
};

// テンプレートアイテム
export const templateItems = {
  okstore: {
    vegetable: {
      title: '野菜',
      items: [
        { name: 'トレビス', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'トマト', defaultQuantity: 2, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday'] } },
        { name: 'レタス', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday'] } },
        { name: 'えのき', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday', 'saturday'] } },
        { name: '菜の花', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'ケール', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: '玉ねぎ', defaultQuantity: 9, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday', 'saturday'] } },
        { name: 'レモン', defaultQuantity: 4, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'パプリカ 赤', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'パプリカ 金', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'ライム', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: '糠漬けきゅうり', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } }
      ]
    },
    food: {
      title: '食材',
      items: [
        { name: 'きぬ豆腐', defaultQuantity: 2, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday'] } },
        { name: 'キャノーラ油', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: '卵パック', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday', 'saturday'] } },
        { name: 'オリーブオイル', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'お麩', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'バター', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: 'ミックスチーズ', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday'] } },
        { name: '田舎味噌', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'こうじ味噌', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: '卵', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday', 'saturday'] } },
        { name: '小麦粉', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } }
      ]
    },
    rice: {
      title: 'お米',
      items: [
        { name: 'つや姫', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday', 'saturday'] } },
        { name: '秋田こまち', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday', 'saturday'] } }
      ]
    },
    household: {
      title: '日用品',
      items: [
        { name: 'キッチンポリ袋', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: '冷凍冷蔵保存バッグ M', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: '冷凍冷蔵保存バッグ L', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'アルミホイル', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'クッキングシート', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'CR着火ライターショートタイプ', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'ソリッドX (楽天の方が安い？)', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'ビズーレペーパー(長方形)', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } },
        { name: 'リードペーパー(ロール)', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } }
      ]
    }
  },
  hanamasa: {
    food: {
      title: '食材',
      items: [
        { name: '⚠️パン粉 (ハナマサオンリー)⚠️', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: '⚠️冷凍長ポテト(ハナマサオンリー)⚠️', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday'] } },
        { name: '⚠️中々25度宮崎県黒木本店⚠️', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } }
      ]
    }
  },
  seijoishin: {
    food: {
      title: '食材',
      items: [
        { name: 'パン', defaultQuantity: 1, checkSchedule: { frequency: 'weekly', days: ['monday', 'thursday'] } },
        { name: 'コルニッション', defaultQuantity: 1, checkSchedule: { frequency: 'biweekly', days: ['10', '20'] } }
      ]
    }
  }
};

// 曜日の定数
export const weekdays = {
  sunday: '日曜日',
  monday: '月曜日',
  tuesday: '火曜日',
  wednesday: '水曜日',
  thursday: '木曜日',
  friday: '金曜日',
  saturday: '土曜日'
};

// チェック頻度の定数
export const checkFrequencies = {
  daily: '毎日',
  weekly: '週1回',
  biweekly: '月2回',
  monthly: '月1回'
};

// 今日チェックすべきアイテムを取得する関数
export const getTodayCheckItems = () => {
  const today = new Date();
  // 曜日を取得する方法を修正
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = dayNames[today.getDay()];
  const dayOfMonth = today.getDate().toString();
  
  const allItems = [];
  
  // すべてのカテゴリとストアからアイテムを収集
  Object.keys(templateItems).forEach(storeKey => {
    const store = templateItems[storeKey];
    Object.keys(store).forEach(categoryKey => {
      const category = store[categoryKey];
      category.items.forEach(item => {
        if (item.checkSchedule) {
          const { frequency, days } = item.checkSchedule;
          
          // 曜日または日付に基づいてチェック
          if (
            (frequency === 'daily') ||
            (frequency === 'weekly' && days.includes(dayOfWeek)) ||
            ((frequency === 'biweekly' || frequency === 'monthly') && days.includes(dayOfMonth))
          ) {
            allItems.push({
              ...item,
              store: storeKey,
              category: categoryKey
            });
          }
        }
      });
    });
  });
  
  return allItems;
};

// リストIDを生成
export const generateListId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export { database, ref, set, onValue, push, get, serverTimestamp };
