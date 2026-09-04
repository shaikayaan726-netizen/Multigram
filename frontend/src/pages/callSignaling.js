// Add this import to backend/index.js:
// import { createServer } from "http";
// import { Server } from "socket.io";
//
// Then replace app.listen(...) with the HTTP server section shown below.
// This file is a reference helper because your existing index.js already contains
// application routes and story cleanup that should remain unchanged.

export function setupCallSignaling(io) {
  const pending = new Map();

  io.on("connection", (socket) => {
    socket.on("user:register", ({ userId }) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on("call:initiate", (data) => {
      pending.set(data.callId, { ...data, callerSocket: socket.id });
      io.to(`user:${data.receiverId}`).emit("call:incoming", data);
    });

    socket.on("call:accept", (data) => {
      const call = pending.get(data.callId);
      if (!call) return;
      io.to(`user:${call.callerId}`).emit("call:accepted", data);
      io.to(`user:${data.to}`).emit("call:accepted", data);
    });

    socket.on("call:reject", (data) => {
      const call = pending.get(data.callId);
      if (!call) return;
      io.to(`user:${call.callerId}`).emit("call:rejected", data);
      io.to(`user:${data.to}`).emit("call:rejected", data);
      pending.delete(data.callId);
    });

    for (const event of ["webrtc:offer", "webrtc:answer", "webrtc:ice"]) {
      socket.on(event, (data) => {
        if (data?.to) io.to(`user:${data.to}`).emit(event, data);
      });
    }

    socket.on("call:end", (data) => {
      if (data?.to) io.to(`user:${data.to}`).emit("call:ended", data);
      pending.delete(data?.callId);
    });

    socket.on("disconnect", () => {
      for (const [id, call] of pending) {
        if (call.callerSocket === socket.id) {
          io.to(`user:${call.receiverId}`).emit("call:ended", { callId:id });
          pending.delete(id);
        }
      }
    });
  });
}
