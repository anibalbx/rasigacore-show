import { openDB } from 'idb';

const dbPromise = openDB('my-database', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('keyval')) {
      db.createObjectStore('keyval');
    }
  },
});

export const setItem = async (key, val) => {
  const db = await dbPromise;
  return db.put('keyval', val, key);
};

export const getItem = async (key) => {
  const db = await dbPromise;
  return db.get('keyval', key);
};

export const deleteItem = async (key) => {
  const db = await dbPromise;
  return db.delete('keyval', key);
};