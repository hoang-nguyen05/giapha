export const POSTER_WIDTH = 1600;
export const POSTER_HEIGHT = 2400;

export default function PosterNode() {
  return (
    <div 
      className="family-poster-container"
      style={{
        width: `${POSTER_WIDTH}px`,
        height: `${POSTER_HEIGHT}px`,
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none',
        borderRadius: '8px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(196, 155, 56, 0.4)',
      }}
    >
      {/* Background Image */}
      <img 
        src="/bg.jpg" 
        alt="Poster Background" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: -1,
          filter: 'contrast(1.02) saturate(1.04)',
        }}
      />

      {/* Header Title Banner Image */}
      <img 
        src="/header.png"
        alt="SƠ ĐỒ GIA PHẢ HỌ NGUYỄN ĐẮC"
        style={{
          position: 'absolute',
          top: '115px', 
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          width: '76%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))',
        }}
      />
    </div>
  );
}
