import React, { useRef, useEffect } from 'react';

// AsciiArt — "Vignette Bloom", made with the 21st.dev ASCII editor and baked
// to its exact rendered output (looping video + poster). Zero dependencies:
// one <video> that fills its parent. Drop it behind or inside your content:
// <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
// https://21st.dev/community/ascii/editor?from=e05cb032-35be-4bcd-999b-cbf5b1588bac
export function AsciiArt({ className, style }) {
  const videoRef = useRef(null);

  // Robust asset path: handles subpaths (GitHub Pages) and root domains (Vercel / localhost)
  let videoSrc = "/vignette-bloom.mp4";
  let posterSrc = "/vignette-bloom.webp";

  if (typeof window !== "undefined") {
    // If running in a subpath like /P2P_App/submissions/group-peerforge/
    const subpathMatch = window.location.pathname.match(/^(\/[^#?]+?)(?:\/index\.html)?$/);
    const basePath = subpathMatch ? subpathMatch[1].replace(/\/$/, "") : "";
    if (basePath) {
      videoSrc = `${basePath}/vignette-bloom.mp4`;
      posterSrc = `${basePath}/vignette-bloom.webp`;
    }
  }

  // Ensure DOM muted property is true so Chrome / Safari never block autoplay
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play().catch(() => {});
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      src={videoSrc}
      poster={posterSrc}
      autoPlay
      loop
      muted
      playsInline
      aria-label="Vignette Bloom — animated ASCII art"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "30% center", // Centers the statue/man horizontally in the container
        ...style,
      }}
    />
  );
}

export default AsciiArt;
