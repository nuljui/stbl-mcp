import WebSocket from 'ws';
import { EventEmitter } from 'events';

export interface EventFilter {
  type?: string;
  [key: string]: any;
}

export interface ChainEvent {
  type: string;
  [key: string]: any;
}

export class EventConnection extends EventEmitter {
  private ws?: WebSocket;
  private queue: ChainEvent[] = [];

  constructor(private url: string) {
    super();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.on('message', data => {
      try {
        const evt = JSON.parse(data.toString()) as ChainEvent;
        this.queue.push(evt);
        this.emit('event', evt);
      } catch {}
    });
    this.ws.on('error', err => this.emit('error', err));
  }

  subscribe(filter: EventFilter, handler: (evt: ChainEvent) => void) {
    this.on('event', evt => {
      const match = Object.entries(filter).every(([k, v]) => evt[k] === v);
      if (match) handler(evt);
    });
  }

  disconnect() {
    this.ws?.close();
  }
}
