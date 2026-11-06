import React, { useRef, useEffect } from "react";
import { Mic, MicOff, User, Wifi, WifiOff } from "lucide-react";
import MediaControls from "./MediaControls";

/**
 * VideoStreamTile
 * Single participant video card with avatar fallback and audio indicators.
 */
const VideoStreamTile = ({
  stream,
  isVideoOff,
  isMuted,
  isLocal,
  user,
  role,
  connectionStatus,
}) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : isLocal
    ? "ME"
    : "P";

  const hasVideoTrack = stream && stream.getVideoTracks().some((t) => t.enabled && t.readyState === "live");
  const showVideo = !isVideoOff && hasVideoTrack;

  return (
    <div className="relative bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col items-center justify-center aspect-video w-full group">
      {/* Active Video Stream */}
      {showVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Always mute local video playback to prevent audio feedback
          className="w-full h-full object-cover"
        />
      ) : (
        /* Monogram Avatar Fallback */
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 font-mono text-sm font-medium mb-2 shadow-inner">
            {initials}
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {isVideoOff ? "Camera Off" : isLocal ? "Camera Inactive" : "Waiting for Video"}
          </span>
        </div>
      )}

      {/* Top Left: Role & Connection Indicator */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5">
        <span
          className={`px-1.5 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase border ${
            role === "interviewer"
              ? "bg-amber-950/40 text-amber-300 border-amber-800/40"
              : "bg-blue-950/40 text-blue-300 border-blue-800/40"
          }`}
        >
          {role || (isLocal ? "Candidate" : "Peer")}
        </span>

        {!isLocal && (
          <span
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-900/80 border border-neutral-800 text-neutral-400"
            title={`Connection: ${connectionStatus}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-emerald-500"
                  : connectionStatus === "connecting"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-neutral-600"
              }`}
            />
            <span className="hidden sm:inline">
              {connectionStatus === "connected" ? "Live" : connectionStatus}
            </span>
          </span>
        )}
      </div>

      {/* Top Right: Mic Status Badge */}
      <div className="absolute top-2 right-2">
        <div
          className={`p-1 rounded-md border text-xs ${
            isMuted
              ? "bg-rose-950/70 border-rose-800/60 text-rose-300"
              : "bg-neutral-900/70 border-neutral-800 text-emerald-400"
          }`}
          title={isMuted ? "Muted" : "Active Audio"}
        >
          {isMuted ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
        </div>
      </div>

      {/* Bottom Bar: Name Label */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <span className="px-2 py-0.5 rounded bg-neutral-950/80 backdrop-blur border border-neutral-800 text-xs font-mono text-neutral-200 truncate max-w-[80%]">
          {isLocal ? `${user?.name || "You"} (You)` : user?.name || "Peer Developer"}
        </span>
      </div>
    </div>
  );
};

/**
 * VideoTiles
 * Container rendering both Remote Peer and Local Video tiles with media controls.
 */
export const VideoTiles = ({
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  isScreenSharing,
  connectionStatus,
  peerMediaStatus,
  user,
  peerUser,
  userRole,
  peerRole,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeaveRoom,
}) => {
  return (
    <div className="flex flex-col h-full gap-3 p-3 bg-neutral-950 border-l border-neutral-800">
      {/* Remote Peer Video Tile */}
      <div className="flex-1 min-h-[140px] flex flex-col justify-center">
        <VideoStreamTile
          stream={remoteStream}
          isVideoOff={!peerMediaStatus.video}
          isMuted={!peerMediaStatus.audio}
          isLocal={false}
          user={peerUser}
          role={peerRole}
          connectionStatus={connectionStatus}
        />
      </div>

      {/* Local User Video Tile */}
      <div className="flex-1 min-h-[140px] flex flex-col justify-center">
        <VideoStreamTile
          stream={localStream}
          isVideoOff={isVideoOff}
          isMuted={isMuted}
          isLocal={true}
          user={user}
          role={userRole}
          connectionStatus="connected"
        />
      </div>

      {/* Media Controls Dock */}
      <div className="pt-1">
        <MediaControls
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          onToggleAudio={onToggleAudio}
          onToggleVideo={onToggleVideo}
          onToggleScreenShare={onToggleScreenShare}
          onLeaveRoom={onLeaveRoom}
        />
      </div>
    </div>
  );
};

export default VideoTiles;
