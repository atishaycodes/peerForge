import { useState, useEffect, useRef, useCallback } from "react";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

/**
 * Custom Hook: useWebRTC
 * Manages WebRTC peer connection, local/remote media streams, and device controls.
 */
export const useWebRTC = (socket, roomId, user) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // disconnected | connecting | connected | failed
  const [peerMediaStatus, setPeerMediaStatus] = useState({ audio: true, video: true });
  const [permissionError, setPermissionError] = useState(null);

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const originalVideoTrackRef = useRef(null);
  const iceCandidatesQueueRef = useRef([]);

  // Create or retrieve PeerConnection
  const getOrCreatePeerConnection = useCallback(
    (targetSocketId) => {
      if (peerConnectionRef.current) {
        return peerConnectionRef.current;
      }

      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionRef.current = pc;

      // Add local media tracks to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current);
        });
      }

      // Handle remote incoming tracks
      pc.ontrack = (event) => {
        console.log("[WebRTC] Received remote track:", event.track.kind);
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        }
      };

      // Handle ICE candidates generated locally
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("webrtc:ice-candidate", {
            roomId,
            candidate: event.candidate,
            targetSocketId,
          });
        }
      };

      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        console.log("[WebRTC] Connection state:", state);
        if (state === "connected") {
          setConnectionStatus("connected");
        } else if (state === "connecting") {
          setConnectionStatus("connecting");
        } else if (state === "failed" || state === "closed") {
          setConnectionStatus("failed");
        } else if (state === "disconnected") {
          setConnectionStatus("disconnected");
        }
      };

      return pc;
    },
    [roomId, socket]
  );

  // Initialize Local Media Stream
  useEffect(() => {
    let isMounted = true;

    const initMedia = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Media devices not supported in this environment");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 360 } },
          audio: true,
        });

        if (isMounted) {
          localStreamRef.current = stream;
          setLocalStream(stream);
          setPermissionError(null);
        }
      } catch (err) {
        console.warn("[WebRTC] Media stream access notice:", err.message);
        if (isMounted) {
          setPermissionError(
            err.name === "NotAllowedError"
              ? "Camera/Microphone permission denied"
              : "No media input devices found"
          );
          setIsMuted(true);
          setIsVideoOff(true);
        }
      }
    };

    initMedia();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Socket WebRTC Signaling Handlers
  useEffect(() => {
    if (!socket || !roomId) return;

    // A remote peer joined the room: As the existing participant, create an SDP offer
    const handlePeerJoined = async ({ peer }) => {
      console.log("[WebRTC] Remote peer joined room, initiating offer to:", peer.name);
      setConnectionStatus("connecting");

      try {
        const pc = getOrCreatePeerConnection(peer.socketId);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("webrtc:offer", {
          roomId,
          offer,
          targetSocketId: peer.socketId,
        });
      } catch (err) {
        console.error("[WebRTC] Error creating offer:", err);
      }
    };

    // Received SDP Offer from remote peer
    const handleOffer = async ({ offer, senderSocketId }) => {
      console.log("[WebRTC] Received offer from socket:", senderSocketId);
      setConnectionStatus("connecting");

      try {
        const pc = getOrCreatePeerConnection(senderSocketId);

        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        // Process queued ICE candidates now that remote description is set
        while (iceCandidatesQueueRef.current.length > 0) {
          const candidate = iceCandidatesQueueRef.current.shift();
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("webrtc:answer", {
          roomId,
          answer,
          targetSocketId: senderSocketId,
        });
      } catch (err) {
        console.error("[WebRTC] Error handling offer:", err);
      }
    };

    // Received SDP Answer from remote peer
    const handleAnswer = async ({ answer }) => {
      console.log("[WebRTC] Received answer from partner");
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );

          // Process queued ICE candidates
          while (iceCandidatesQueueRef.current.length > 0) {
            const candidate = iceCandidatesQueueRef.current.shift();
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          }
        }
      } catch (err) {
        console.error("[WebRTC] Error handling answer:", err);
      }
    };

    // Received remote ICE candidate
    const handleIceCandidate = async ({ candidate }) => {
      try {
        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.remoteDescription &&
          peerConnectionRef.current.remoteDescription.type
        ) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          iceCandidatesQueueRef.current.push(candidate);
        }
      } catch (err) {
        console.error("[WebRTC] Error adding ICE candidate:", err);
      }
    };

    // Peer media toggle update
    const handlePeerMediaStatus = ({ media }) => {
      if (media) {
        setPeerMediaStatus((prev) => ({ ...prev, ...media }));
      }
    };

    // Peer disconnected or left
    const handlePeerLeft = () => {
      console.log("[WebRTC] Partner left the session");
      setRemoteStream(null);
      setConnectionStatus("disconnected");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };

    socket.on("room:peer-joined", handlePeerJoined);
    socket.on("webrtc:offer", handleOffer);
    socket.on("webrtc:answer", handleAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("room:peer-media-status", handlePeerMediaStatus);
    socket.on("room:peer-left", handlePeerLeft);

    return () => {
      socket.off("room:peer-joined", handlePeerJoined);
      socket.off("webrtc:offer", handleOffer);
      socket.off("webrtc:answer", handleAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
      socket.off("room:peer-media-status", handlePeerMediaStatus);
      socket.off("room:peer-left", handlePeerLeft);
    };
  }, [socket, roomId, getOrCreatePeerConnection]);

  // Media Controls: Toggle Microphone
  const toggleAudio = useCallback(() => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      const nextMuted = !audioTrack.enabled;
      setIsMuted(nextMuted);

      if (socket && roomId) {
        socket.emit("room:media-status", {
          roomId,
          audio: !nextMuted,
        });
      }
    }
  }, [socket, roomId]);

  // Media Controls: Toggle Camera
  const toggleVideo = useCallback(() => {
    if (!localStreamRef.current) return;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      const nextVideoOff = !videoTrack.enabled;
      setIsVideoOff(nextVideoOff);

      if (socket && roomId) {
        socket.emit("room:media-status", {
          roomId,
          video: !nextVideoOff,
        });
      }
    }
  }, [socket, roomId]);

  // Media Controls: Screen Share
  const toggleScreenShare = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) return;

    if (isScreenSharing) {
      // Revert back to original webcam video track
      if (originalVideoTrackRef.current && peerConnectionRef.current) {
        const sender = peerConnectionRef.current
          .getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (sender) {
          sender.replaceTrack(originalVideoTrackRef.current);
        }
      }
      setIsScreenSharing(false);
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current
            .getSenders()
            .find((s) => s.track && s.track.kind === "video");

          if (sender) {
            originalVideoTrackRef.current = sender.track;
            sender.replaceTrack(screenTrack);
          }
        }

        screenTrack.onended = () => {
          if (originalVideoTrackRef.current && peerConnectionRef.current) {
            const sender = peerConnectionRef.current
              .getSenders()
              .find((s) => s.track && s.track.kind === "video");
            if (sender) {
              sender.replaceTrack(originalVideoTrackRef.current);
            }
          }
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.warn("[WebRTC] Screen share cancelled or rejected:", err.message);
      }
    }
  }, [isScreenSharing]);

  // Cleanup on leave
  const leaveCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionStatus("disconnected");
  }, []);

  return {
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    connectionStatus,
    peerMediaStatus,
    permissionError,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    leaveCall,
  };
};

export default useWebRTC;

