// 朱砂篆刻印章（Crimson Seals）组件
import { useEffect, useState } from 'react';

interface CrimsonSealProps {
  text: string;
  size?: number;
  category?: 'genzhu' | 'zhongyi' | 'shanhe' | 'gujian' | 'jiuhun';
}

export function CrimsonSeal({ text, size = 50, category = 'genzhu' }: CrimsonSealProps) {
  const [glow, setGlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 根据类别定制印章内容
  const getSealContent = () => {
    const seals = {
      'genzhu': { main: '根祖', sub: '华夏源头', border: 'square' },
      'zhongyi': { main: '忠义', sub: '诚信天下', border: 'square' },
      'shanhe': { main: '山河', sub: '表里乾坤', border: 'round' },
      'gujian': { main: '古建', sub: '匠心传世', border: 'square' },
      'jiuhun': { main: '酒魂', sub: '清香鼻祖', border: 'round' }
    };
    return seals[category];
  };

  const seal = getSealContent();
  const glowIntensity = 0.6 + Math.sin(glow * 0.1) * 0.3;

  return (
    <div 
      className="inline-block"
      style={{
        width: size,
        height: size,
        filter: `drop-shadow(0 0 ${8 * glowIntensity}px rgba(205, 92, 92, 0.8))`
      }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 朱砂红色渐变 */}
          <linearGradient id={`sealGradient-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CD5C5C" stopOpacity="1"/>
            <stop offset="50%" stopColor="#DC143C" stopOpacity="1"/>
            <stop offset="100%" stopColor="#B22222" stopOpacity="0.95"/>
          </linearGradient>
          
          {/* 3D厚重感滤镜 */}
          <filter id={`seal3D-${category}`}>
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* 石质纹理 */}
          <filter id={`texture-${category}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
            <feColorMatrix in="noise" type="saturate" values="0"/>
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" result="textured"/>
          </filter>
        </defs>

        {/* 印章边框 */}
        {seal.border === 'square' ? (
          <g filter={`url(#seal3D-${category})`}>
            <rect 
              x="5" y="5" 
              width="90" height="90" 
              fill={`url(#sealGradient-${category})`}
              stroke="#8B0000"
              strokeWidth="3"
              filter={`url(#texture-${category})`}
            />
            <rect 
              x="10" y="10" 
              width="80" height="80" 
              fill="none"
              stroke="#FFD700"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        ) : (
          <g filter={`url(#seal3D-${category})`}>
            <circle 
              cx="50" cy="50" 
              r="45" 
              fill={`url(#sealGradient-${category})`}
              stroke="#8B0000"
              strokeWidth="3"
              filter={`url(#texture-${category})`}
            />
            <circle 
              cx="50" cy="50" 
              r="40" 
              fill="none"
              stroke="#FFD700"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        )}

        {/* 篆书文字（简化版） */}
        <g fill="none" stroke="#FFFAF0" strokeWidth="2.5" strokeLinecap="round" opacity="0.95">
          {/* 根据类别绘制不同的篆书笔画 */}
          {category === 'genzhu' && (
            <>
              {/* "根"字篆书简化 */}
              <path d="M 30,25 L 30,75" />
              <path d="M 25,35 L 35,35" />
              <path d="M 25,50 L 35,50" />
              <circle cx="30" cy="65" r="3" fill="#FFFAF0"/>
              
              {/* "祖"字篆书简化 */}
              <path d="M 65,30 L 65,70" />
              <path d="M 60,40 L 70,40" />
              <rect x="62" y="55" width="6" height="12" fill="none"/>
            </>
          )}
          
          {category === 'zhongyi' && (
            <>
              {/* "忠"字篆书简化 */}
              <path d="M 30,30 L 30,70" />
              <circle cx="30" cy="45" r="8" fill="none"/>
              <path d="M 25,60 L 35,60" />
              
              {/* "义"字篆书简化 */}
              <path d="M 60,35 L 70,35" />
              <path d="M 65,35 L 65,70" />
              <path d="M 60,55 L 70,55" />
            </>
          )}
          
          {category === 'shanhe' && (
            <>
              {/* "山"字篆书简化 */}
              <path d="M 25,40 L 30,30 L 35,40" />
              <path d="M 20,50 L 40,50" />
              
              {/* "河"字篆书简化 */}
              <path d="M 55,30 L 55,70" />
              <path d="M 60,35 Q 70,45 60,55" />
              <circle cx="67" cy="45" r="2" fill="#FFFAF0"/>
              <path d="M 60,60 L 75,60" />
            </>
          )}
          
          {category === 'gujian' && (
            <>
              {/* "古"字篆书简化 */}
              <rect x="25" y="30" width="15" height="40" fill="none"/>
              <path d="M 27,45 L 38,45" />
              
              {/* "建"字篆书简化 */}
              <path d="M 60,30 L 70,30" />
              <path d="M 65,30 L 65,70" />
              <path d="M 55,50 L 75,50" />
              <circle cx="65" cy="60" r="3" fill="#FFFAF0"/>
            </>
          )}
          
          {category === 'jiuhun' && (
            <>
              {/* "酒"字篆书简化 */}
              <circle cx="30" cy="45" r="15" fill="none"/>
              <path d="M 30,35 L 30,55" />
              <path d="M 23,45 L 37,45" />
              
              {/* "魂"字篆书简化 */}
              <path d="M 60,30 L 70,30 L 70,60 L 60,60 Z" fill="none"/>
              <circle cx="65" cy="45" r="4" fill="#FFFAF0"/>
              <path d="M 65,60 L 65,70" />
            </>
          )}
        </g>

        {/* 底部小字 */}
        <text 
          x="50" 
          y="92" 
          textAnchor="middle" 
          fontSize="8" 
          fill="#FFFAF0" 
          fontFamily="serif"
          opacity="0.8"
        >
          {seal.sub}
        </text>
      </svg>
    </div>
  );
}
