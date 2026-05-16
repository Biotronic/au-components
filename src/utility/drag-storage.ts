class DragStorage {
  private channel = new BroadcastChannel('linx-drag-and-drop');
  private registry = new Map<string, any>();

  constructor() {
    this.channel.addEventListener('message', e => {
      const msg = e.data as { type: string, id: string, data: any };
      if (msg.type == 'send') {
        this.registry.set(msg.id, msg.data);
      } else {
        this.registry.delete(msg.id);
      }
    });
  }

  public send(data: any): string {
    let id = crypto.randomUUID();
    this.registry.set(id, data);
    this.channel.postMessage({
      type: 'send',
      id: id,
      data: data
    });
    return id;
  }

  public get(id: string): any {
    if (!this.registry.has(id)) {
      //console.error('No such key: ', id);
    }
    return this.registry.get(id);
  }

  public unsend(id: string) {
    this.registry.delete(id);
    this.channel.postMessage({
      type: 'unsend',
      id: id
    });
  }
}

export const dragStorage = new DragStorage();
export const dragIdMimeType = 'linx/drag-id:';
export const dragTypeMimeType = 'linx/drag-type:';
