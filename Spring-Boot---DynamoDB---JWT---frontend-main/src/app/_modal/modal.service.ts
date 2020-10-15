import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modals: any[] = [];

  public add(modal: any) {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  public remove(id: string) {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  public open(id: string) {
    // open modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    modal.open();
  }

  public close(id: string) {
    // close modal specified by id
    const modal = this.modals.find((x) => x.id === id);
    modal.close();
  }

  public getUserInfo(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal.get();
  }

  public updateUserInfo(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal.get();
  }

  public getUserPassword(id: string) {
    const modal = this.modals.find((x) => x.id === id);
    modal.get();
  }
}
