// 古建窗棂网格（Lattice Grid）组件
export function LatticeGrid() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* 步步锦窗棂图案 */}
        <pattern id="bubujinPattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          {/* 外框 */}
          <rect x="0" y="0" width="60" height="60" fill="none" stroke="rgba(135, 206, 250, 0.25)" strokeWidth="1"/>
          
          {/* 内部几何网格 */}
          <rect x="15" y="15" width="30" height="30" fill="none" stroke="rgba(135, 206, 250, 0.2)" strokeWidth="0.8"/>
          <circle cx="30" cy="30" r="10" fill="none" stroke="rgba(135, 206, 250, 0.18)" strokeWidth="0.8"/>
          
          {/* 四角小方格 */}
          <rect x="5" y="5" width="8" height="8" fill="none" stroke="rgba(135, 206, 250, 0.15)" strokeWidth="0.6"/>
          <rect x="47" y="5" width="8" height="8" fill="none" stroke="rgba(135, 206, 250, 0.15)" strokeWidth="0.6"/>
          <rect x="5" y="47" width="8" height="8" fill="none" stroke="rgba(135, 206, 250, 0.15)" strokeWidth="0.6"/>
          <rect x="47" y="47" width="8" height="8" fill="none" stroke="rgba(135, 206, 250, 0.15)" strokeWidth="0.6"/>
          
          {/* 对角线装饰 */}
          <line x1="15" y1="15" x2="22" y2="22" stroke="rgba(135, 206, 250, 0.12)" strokeWidth="0.5"/>
          <line x1="45" y1="15" x2="38" y2="22" stroke="rgba(135, 206, 250, 0.12)" strokeWidth="0.5"/>
          <line x1="15" y1="45" x2="22" y2="38" stroke="rgba(135, 206, 250, 0.12)" strokeWidth="0.5"/>
          <line x1="45" y1="45" x2="38" y2="38" stroke="rgba(135, 206, 250, 0.12)" strokeWidth="0.5"/>
        </pattern>

        {/* 冰裂纹窗棂图案 */}
        <pattern id="bingliewenPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          {/* 主框架 */}
          <rect x="0" y="0" width="80" height="80" fill="none" stroke="rgba(135, 206, 250, 0.25)" strokeWidth="1.2"/>
          
          {/* 不规则裂纹线条（模拟冰裂） */}
          <path d="M 0,20 L 25,30 L 40,15 L 60,25 L 80,18" 
                fill="none" stroke="rgba(135, 206, 250, 0.2)" strokeWidth="0.8"/>
          <path d="M 0,45 L 20,50 L 45,42 L 65,48 L 80,45" 
                fill="none" stroke="rgba(135, 206, 250, 0.18)" strokeWidth="0.8"/>
          <path d="M 0,65 L 30,68 L 50,60 L 70,65 L 80,68" 
                fill="none" stroke="rgba(135, 206, 250, 0.16)" strokeWidth="0.8"/>
          
          {/* 垂直裂纹 */}
          <path d="M 20,0 L 18,25 L 22,45 L 20,65 L 18,80" 
                fill="none" stroke="rgba(135, 206, 250, 0.2)" strokeWidth="0.8"/>
          <path d="M 50,0 L 48,20 L 52,40 L 50,60 L 48,80" 
                fill="none" stroke="rgba(135, 206, 250, 0.18)" strokeWidth="0.8"/>
          
          {/* 细节裂痕 */}
          <circle cx="25" cy="30" r="8" fill="none" stroke="rgba(135, 206, 250, 0.12)" strokeWidth="0.6"/>
          <circle cx="60" cy="50" r="6" fill="none" stroke="rgba(135, 206, 250, 0.1)" strokeWidth="0.6"/>
          <polygon points="40,15 45,22 40,28 35,22" 
                   fill="none" stroke="rgba(135, 206, 250, 0.15)" strokeWidth="0.6"/>
        </pattern>

        {/* 发光效果 */}
        <filter id="latticeGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

// 窗棂分割线组件
interface LatticeDividerProps {
  orientation?: 'horizontal' | 'vertical';
  pattern?: 'bubujin' | 'bingliewen';
  className?: string;
}

export function LatticeDivider({ 
  orientation = 'horizontal', 
  pattern = 'bubujin',
  className = '' 
}: LatticeDividerProps) {
  const patternUrl = pattern === 'bubujin' ? 'url(#bubujinPattern)' : 'url(#bingliewenPattern)';
  
  if (orientation === 'horizontal') {
    return (
      <div 
        className={`w-full ${className}`}
        style={{
          height: '60px',
          background: patternUrl,
          opacity: 0.6,
          filter: 'url(#latticeGlow)'
        }}
      />
    );
  }
  
  return (
    <div 
      className={`h-full ${className}`}
      style={{
        width: '60px',
        background: patternUrl,
        opacity: 0.6,
        filter: 'url(#latticeGlow)'
      }}
    />
  );
}
