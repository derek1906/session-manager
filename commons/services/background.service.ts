import { Injectable } from '@angular/core';

export interface BackgroundPage {
  _require: Function;
  _export: Function;
}

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  getBackgroundPage(): Promise<BackgroundPage> {
    return new Promise(res => {
      chrome.runtime.getBackgroundPage((page: unknown) => res(page as BackgroundPage));
    });
  }
}
