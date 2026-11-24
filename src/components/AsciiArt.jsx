import React from 'react';

// AsciiArt — "Vignette Bloom", made with the 21st.dev ASCII editor and baked
// to its exact rendered output (looping video + poster). Zero dependencies:
// one <video> that fills its parent. Drop it behind or inside your content:
// <div className="relative h-96"><AsciiArt className="absolute inset-0" /></div>
// Remix the source recipe (styles, animation, palette) in the editor:
// https://21st.dev/community/ascii/editor?from=e05cb032-35be-4bcd-999b-cbf5b1588bac
export function AsciiArt({ className, style }) {
  // Support both root deployment (Vercel) and subpath deployment (GitHub Pages)
  const isSubpath =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/submissions/");
  const prefix = isSubpath ? "./" : "/";

  return (
    <video
      className={className}
      autoPlay
      loop
      muted
      playsInline
      poster={`${prefix}vignette-bloom.webp`}
      aria-label="Vignette Bloom — animated ASCII art"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "30% center", // Centers the statue/man horizontally in the container
        ...style,
      }}
    >
      <source src={`${prefix}vignette-bloom.mp4`} type="video/mp4" />
      <source src="./vignette-bloom.mp4" type="video/mp4" />
      <source src="vignette-bloom.mp4" type="video/mp4" />
      <source src="/vignette-bloom.mp4" type="video/mp4" />
    </video>
  );
}

export default AsciiArt;
