// 同心圆轨道组件

interface OrbitRingsProps {
  fenjiu_colors: any;
}

export function OrbitRings({ fenjiu_colors }: OrbitRingsProps) {
  const rings = [
    { size: 280, opacity: 0.12, style: 'solid' },
    { size: 420, opacity: 0.08, style: 'solid' },
    { size: 560, opacity: 0.05, style: 'dashed' },
    { size: 700, opacity: 0.03, style: 'solid' }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {rings.map((ring, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            width: `${ring.size}px`,
            height: `${ring.size}px`,
            border: `1px ${ring.style} ${fenjiu_colors.ice_blue}`,
            opacity: ring.opacity,
            boxShadow: ring.style === 'solid' 
              ? `0 0 20px ${fenjiu_colors.ice_blue}${Math.floor(ring.opacity * 100).toString(16).padStart(2, '0')}`
              : 'none'
          }}
        />
      ))}
    </div>
  );
}
