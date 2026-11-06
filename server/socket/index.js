import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  addToQueue,
  removeFromQueue,
  handleAccept,
  handleDecline,
  cleanupSocketMatches,
} from "../services/matchmakingService.js";
import { registerRoomHandlers, handleUserLeaveRoom } from "./roomSignaling.js";

// Helper to parse cookie string from handshake headers
const parseCookie = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const name = parts[0]?.trim();
    const value = parts.slice(1).join("=").trim();
    if (name) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
};

export const setupSocket = (io) => {
  // Socket.IO Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      const cookies = parseCookie(cookieHeader);
      const token = cookies.auth_token;

      if (!token) {
        return next(new Error("Authentication error: No auth token provided"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "peerforge_development_secret_key_123456789"
      );

      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.error("[Socket Auth Error]", err.message);
      return next(new Error("Authentication error: Invalid session"));
    }
  });

  // Socket Connection Handling
  io.on("connection", (socket) => {
    console.log(`[Socket Connected] User: ${socket.user.name} (${socket.id})`);

    // Join Matchmaking Queue
    socket.on("queue:join", ({ track, difficulty }) => {
      const pendingMatch = addToQueue({
        socketId: socket.id,
        userId: socket.user._id,
        userDetails: socket.user,
        track: track || "Data Structures & Algorithms (DSA)",
        difficulty: difficulty || "Mid-Level",
      });

      if (pendingMatch) {
        // Emit match:found to both peers
        io.to(pendingMatch.userA.socketId).emit("match:found", {
          matchId: pendingMatch.matchId,
          track: pendingMatch.track,
          difficulty: pendingMatch.difficulty,
          peerDetails: pendingMatch.userB.userDetails,
          expiresAt: pendingMatch.expiresAt,
        });

        io.to(pendingMatch.userB.socketId).emit("match:found", {
          matchId: pendingMatch.matchId,
          track: pendingMatch.track,
          difficulty: pendingMatch.difficulty,
          peerDetails: pendingMatch.userA.userDetails,
          expiresAt: pendingMatch.expiresAt,
        });
      }
    });

    // Leave Matchmaking Queue
    socket.on("queue:leave", () => {
      removeFromQueue(socket.id);
      socket.emit("queue:left");
    });

    // Accept Match Handshake
    socket.on("match:accept", ({ matchId }) => {
      const result = handleAccept({ matchId, userId: socket.user._id });
      if (!result) return;

      if (result.confirmed) {
        const { roomId, match } = result;

        io.to(match.userA.socketId).emit("match:confirmed", {
          roomId,
          track: match.track,
          difficulty: match.difficulty,
          peer: match.userB.userDetails,
        });

        io.to(match.userB.socketId).emit("match:confirmed", {
          roomId,
          track: match.track,
          difficulty: match.difficulty,
          peer: match.userA.userDetails,
        });
      } else {
        // Notify socket that their acceptance was registered
        socket.emit("match:accepted_waiting");
      }
    });

    // Decline Match Handshake
    socket.on("match:decline", ({ matchId }) => {
      const result = handleDecline({ matchId, userId: socket.user._id });
      if (!result) return;

      socket.emit("match:cancelled", { reason: "declined_by_you" });

      if (result.reQueuedUser) {
        io.to(result.reQueuedUser.socketId).emit("match:cancelled", {
          reason: "partner_declined",
          reQueued: true,
        });
      }
    });

    // Generate Direct Shareable Invite Link
    socket.on("invite:create", ({ track, difficulty }, callback) => {
      const inviteCode = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const roomId = `room_${inviteCode}`;

      const response = {
        success: true,
        inviteCode,
        roomId,
        track,
        difficulty,
      };

      if (typeof callback === "function") {
        callback(response);
      } else {
        socket.emit("invite:created", response);
      }
    });

    // Register Live Room & WebRTC Signaling Handlers
    registerRoomHandlers(io, socket);

    // Handle Disconnect
    socket.on("disconnect", () => {
      console.log(`[Socket Disconnected] User: ${socket.user.name} (${socket.id})`);
      removeFromQueue(socket.id);
      cleanupSocketMatches(socket.id);
      handleUserLeaveRoom(io, socket);
    });
  });
};

export default setupSocket;

