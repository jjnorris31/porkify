import { Injectable } from '@angular/core';
import {User} from "../interfaces/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: User | undefined;

  constructor() {

  }

  get user() {
    return {...this._user};
  }

  public openDatabase() {
    return new Promise<IDBDatabase>(function (resolve, reject) {
      let request = window.indexedDB.open("db", 2);

      request.onupgradeneeded = () => {
        let indexedDB = request.result;
        if (!indexedDB.objectStoreNames.contains("users")) {
          indexedDB.createObjectStore("users", {keyPath: 'id'});
        }
      }

      request.onsuccess = () => {
        resolve(request.result);
      }

      request.onerror = () => {
        reject(request.error);
      }
    });
  }

  public getUser(id: number) {
    return new Promise<User>(async (resolve, reject) => {
      let indexedDB = await this.openDatabase();
      let transaction = indexedDB.transaction("users", "readwrite");
      let users = transaction.objectStore("users");

      let getRequest = users.get(id);

      getRequest.onsuccess = () => {
        this._user = getRequest.result;
        resolve(getRequest.result);
      }

      getRequest.onerror = () => {
        reject(getRequest.error);
      }
    });
  }

  public addUser(user: User) {
    return new Promise<void>(async (resolve, reject) => {
      let database = await this.openDatabase();
      let transaction = database.transaction("users", "readwrite");
      let usersStore = transaction.objectStore("users");

      let addRequest = usersStore.add(user);

      addRequest.onsuccess = () => {
        resolve();
      }

      addRequest.onerror = () => {
        reject(addRequest.error);
      }
    });
  }
}