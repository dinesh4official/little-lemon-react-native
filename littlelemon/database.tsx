import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'create table if not exists menu (id integer primary key not null, name text, price real, description text, image text, category text);',
            [],
            () => resolve(undefined),
            (_, error) => { reject(error); return false; }
          );
        }
      );
    });
  }

export async function getMenuItems() {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql('select * from menu', [], (_, { rows }) => {
          resolve(rows._array);
        }, (_, error) => {
          reject(error);
          return false;
        });
      });
    });
  }
  
export async function saveMenuItems(menuItems: { name: string; price: number; description: string; image: string; category: string; }[]) {
    return new Promise((resolve, reject) => {
        db.transaction(
            (tx) => {
                menuItems.forEach((item) => {
                    tx.executeSql(
                        'insert into menu (name, price, description, image, category) values (?, ?, ?, ?, ?)',
                        [item.name, item.price, item.description, item.image, item.category],
                        () => {},
                        (_, error) => { reject(error); return false; }
                    );
                });
            },
            (error) => reject(error),
            () => resolve(undefined)
        );
    });
}

export async function filterByQueryAndCategories(query: string, categories: string[]) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const categoryPlaceholders = categories.map(() => '?').join(' OR category = ');
      const sql = `select * from menu where name like ? and (category = ${categoryPlaceholders})`;
      const args = [`%${query}%`, ...categories];
      tx.executeSql(sql, args, (_, { rows }) => {
        resolve(rows._array);
      }, (_, error) => {
        reject(error);
        return false;
      });
    });
  });
}