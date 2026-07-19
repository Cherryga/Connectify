let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;
};

export const emitToUser = (userId, eventName, payload) => {
  if (!ioInstance || !userId) return;
  ioInstance.to(`user:${userId}`).emit(eventName, payload);
};
