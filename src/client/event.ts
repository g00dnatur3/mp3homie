import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

export const events = {
  openModal: 'OPEN_MODAL',
  closeModal: 'CLOSE_MODAL',
};

export const emitEvent = EventEmitter.prototype.emit.bind(eventEmitter)

export const onEvent = EventEmitter.prototype.addListener.bind(eventEmitter)

export const onceEvent = EventEmitter.prototype.once.bind(eventEmitter)

export const offEvent = EventEmitter.prototype.removeListener.bind(eventEmitter)

export const openModal = (id) => emitEvent(events.openModal, id);

export const closeModal = (id) => emitEvent(events.closeModal, id);
