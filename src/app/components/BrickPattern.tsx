// 晋砖拓片肌理 SVG Pattern 组件
export function BrickPattern() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        {/* 葡萄纹样式 */}
        <pattern id="grapePattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(160, 130, 109, 0.08)" strokeWidth="1.5"/>
          <circle cx="35" cy="35" r="8" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <circle cx="65" cy="35" r="8" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <circle cx="35" cy="65" r="8" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <circle cx="65" cy="65" r="8" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <path d="M 50,35 Q 45,40 50,50 Q 55,40 50,35 Z" fill="rgba(160, 130, 109, 0.04)" stroke="rgba(160, 130, 109, 0.05)"/>
        </pattern>

        {/* 缠枝莲纹样式 */}
        <pattern id="lotusPattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M 60,30 Q 45,45 60,60 Q 75,45 60,30 Z" fill="none" stroke="rgba(160, 130, 109, 0.07)" strokeWidth="1.5"/>
          <path d="M 30,60 Q 45,45 60,60 Q 45,75 30,60 Z" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <path d="M 90,60 Q 75,75 60,60 Q 75,45 90,60 Z" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <path d="M 60,90 Q 75,75 60,60 Q 45,75 60,90 Z" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <circle cx="60" cy="60" r="5" fill="rgba(160, 130, 109, 0.05)"/>
        </pattern>

        {/* 回字纹样式 */}
        <pattern id="geometricPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect x="20" y="20" width="40" height="40" fill="none" stroke="rgba(160, 130, 109, 0.08)" strokeWidth="1.5"/>
          <rect x="30" y="30" width="20" height="20" fill="none" stroke="rgba(160, 130, 109, 0.06)" strokeWidth="1"/>
          <line x1="20" y1="40" x2="30" y2="40" stroke="rgba(160, 130, 109, 0.05)" strokeWidth="1"/>
          <line x1="50" y1="40" x2="60" y2="40" stroke="rgba(160, 130, 109, 0.05)" strokeWidth="1"/>
          <line x1="40" y1="20" x2="40" y2="30" stroke="rgba(160, 130, 109, 0.05)" strokeWidth="1"/>
          <line x1="40" y1="50" x2="40" y2="60" stroke="rgba(160, 130, 109, 0.05)" strokeWidth="1"/>
        </pattern>

        {/* 砖雕纹理叠加 */}
        <pattern id="brickTexture" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <rect width="200" height="200" fill="url(#grapePattern)"/>
          <rect width="200" height="200" fill="url(#lotusPattern)" opacity="0.5"/>
          <rect width="200" height="200" fill="url(#geometricPattern)" opacity="0.3"/>
          {/* 添加粗糙肌理 */}
          <filter id="roughness">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
            <feColorMatrix in="noise" type="saturate" values="0"/>
            <feBlend in="SourceGraphic" in2="noise" mode="multiply"/>
          </filter>
        </pattern>
      </defs>
    </svg>
  );
}
