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
          try {
            pc.addTrack(track, localStreamRef.current);
          } catch (e) {
            console.warn("[WebRTC] Initial addTrack notice:", e.message);
          }
        });
      }

      // Handle remote incoming tracks with stream fallback
      pc.ontrack = (event) => {
        console.log("[WebRTC] Received remote track:", event.track.kind);
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
        } else {
          setRemoteStream((prev) => {
            const stream = prev || new MediaStream();
            if (!stream.getTracks().some((t) => t.id === event.track.id)) {
              stream.addTrack(event.track);
            }
            return new MediaStream(stream.getTracks());
          });
        }
      };

      // Handle ICE candidates generated locally
      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          const candidateData = event.candidate.toJSON ? event.candidate.toJSON() : event.candidate;
          socket.emit("webrtc:ice-candidate", {
            roomId,
            candidate: candidateData,
            targetSocketId,
          });
        }
      };

      // Handle connection and ICE state changes comprehensively
      const handleStateChange = () => {
        const connState = pc.connectionState;
        const iceState = pc.iceConnectionState;
        console.log(`[WebRTC State] Connection: ${connState}, ICE: ${iceState}`);

        if (connState === "connected" || iceState === "connected" || iceState === "completed") {
          setConnectionStatus("connected");
        } else if (connState === "connecting" || iceState === "checking") {
          setConnectionStatus("connecting");
        } else if (connState === "failed" || iceState === "failed") {
          setConnectionStatus("failed");
        } else if (connState === "disconnected" || iceState === "disconnected") {
          setConnectionStatus("disconnected");
        }
      };

      pc.onconnectionstatechange = handleStateChange;
      pc.oniceconnectionstatechange = handleStateChange;

      return pc;
    },
    [roomId, socket]
  );

  // Initialize Local Media Stream (with graceful canvas fallback if camera in use)
  useEffect(() => {
    let isMounted = true;

    const initMedia = async () => {
      let stream = null;
      let hasRealVideo = false;

      // 1. Try real camera + microphone
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 360 } },
            audio: true,
          });
          hasRealVideo = true;
        }
      } catch (err) {
        console.warn("[WebRTC] Real webcam notice (may be in use by another tab):", err.message);

        // 2. Try microphone only
        try {
          if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          }
        } catch (audioErr) {
          console.warn("[WebRTC] Microphone notice:", audioErr.message);
        }

        // 3. Generate interactive canvas video fallback so WebRTC video pipeline works flawlessly
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext("2d");
          const displayName = user?.name || "Developer";
          const initials = displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          let frame = 0;
          const renderPlaceholder = () => {
            frame++;
            ctx.fillStyle = "#09090b";
            ctx.fillRect(0, 0, 640, 360);

            // Subtle pulsing circle
            const pulse = Math.sin(frame * 0.05) * 4;
            ctx.fillStyle = "#18181b";
            ctx.beginPath();
            ctx.arc(320, 160, 64 + pulse, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#27272a";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Initials
            ctx.fillStyle = "#f4f4f5";
            ctx.font = "bold 38px monospace";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(initials, 320, 160);

            // Display Name
            ctx.fillStyle = "#a1a1aa";
            ctx.font = "14px sans-serif";
            ctx.fillText(displayName, 320, 250);

            ctx.fillStyle = "#71717a";
            ctx.font = "11px sans-serif";
            ctx.fillText("(Virtual Camera • Standby)", 320, 272);
          };

          renderPlaceholder();
          const timerId = setInterval(renderPlaceholder, 1000);

          const canvasStream = canvas.captureStream(15);
          const canvasVideoTrack = canvasStream.getVideoTracks()[0];

          if (stream) {
            stream.addTrack(canvasVideoTrack);
          } else {
            stream = canvasStream;
          }

          // Clean up canvas interval on unmount
          if (!isMounted) clearInterval(timerId);
        } catch (canvasErr) {
          console.warn("[WebRTC] Canvas fallback error:", canvasErr);
        }
      }

      if (isMounted && stream) {
        localStreamRef.current = stream;
        setLocalStream(stream);
        setPermissionError(null);
        if (!hasRealVideo) {
          setIsVideoOff(false);
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
  }, [user?.name]);

  // Synchronize localStream tracks into RTCPeerConnection whenever localStream changes
  useEffect(() => {
    const pc = peerConnectionRef.current;
    if (!pc || !localStream) return;

    const currentSenders = pc.getSenders();
    localStream.getTracks().forEach((track) => {
      const sender = currentSenders.find(
        (s) => s.track && s.track.kind === track.kind
      );
      if (sender) {
        sender.replaceTrack(track).catch((err) => {
          console.warn("[WebRTC] replaceTrack warning:", err.message);
        });
      } else {
        try {
          pc.addTrack(track, localStream);
        } catch (err) {
          console.warn("[WebRTC] addTrack warning:", err.message);
        }
      }
    });
  }, [localStream]);

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
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (candErr) {
            console.warn("[WebRTC] Queued ICE candidate notice:", candErr.message);
          }
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
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (candErr) {
              console.warn("[WebRTC] Queued ICE candidate notice on answer:", candErr.message);
            }
          }
        }
      } catch (err) {
        console.error("[WebRTC] Error handling answer:", err);
      }
    };

    // Received remote ICE candidate
    const handleIceCandidate = async ({ candidate }) => {
      if (!candidate || !candidate.candidate) return;
      try {
        const iceCandidate = new RTCIceCandidate(candidate);
        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.remoteDescription &&
          peerConnectionRef.current.remoteDescription.type
        ) {
          await peerConnectionRef.current.addIceCandidate(iceCandidate);
        } else {
          iceCandidatesQueueRef.current.push(candidate);
        }
      } catch (err) {
        console.warn("[WebRTC] Error adding ICE candidate:", err.message);
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

