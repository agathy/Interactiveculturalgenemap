// 数字榫卯角花（Digital Dougong Corners）组件
import { useEffect, useState } from 'react';

interface DougongCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: number;
}

export function DougongCorner({ position, color = '#87CEFA', size = 60 }: DougongCornerProps) {
  const [animation, setAnimation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimation(prev => (prev + 0.5) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 计算旋转角度
  const getRotation = () => {
    switch (position) {
      case 'top-left': return 0;
      case 'top-right': return 90;
      case 'bottom-right': return 180;
      case 'bottom-left': return 270;
      default: return 0;
    }
  };

  // 计算位置
  const getPosition = () => {
    switch (position) {
      case 'top-left': return { top: -1, left: -1 };
      case 'top-right': return { top: -1, right: -1 };
      case 'bottom-right': return { bottom: -1, right: -1 };
      case 'bottom-left': return { bottom: -1, left: -1 };
      default: return { top: 0, left: 0 };
    }
  };

  // 榫卯咬合动画的偏移量
  const offset = Math.sin(animation * 0.1) * 2;

  return (
    <div 
      className="absolute pointer-events-none"
      style={{
        ...getPosition(),
        width: size,
        height: size,
        transform: `rotate(${getRotation()}deg)`,
        transformOrigin: 'center'
      }}
    >
      <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* 发光滤镜 */}
          <filter id={`glow-${position}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 外层斗拱框架 */}
        <g filter={`url(#glow-${position})`}>
          {/* 主横梁 */}
          <line x1="0" y1="15" x2="60" y2="15" stroke={color} strokeWidth="1.5" opacity="0.9"/>
          <line x1="0" y1="30" x2="60" y2="30" stroke={color} strokeWidth="2" opacity="1"/>
          <line x1="0" y1="45" x2="60" y2="45" stroke={color} strokeWidth="1.5" opacity="0.8"/>
          
          {/* 主竖梁 */}
          <line x1="15" y1="0" x2="15" y2="60" stroke={color} strokeWidth="1.5" opacity="0.9"/>
          <line x1="30" y1="0" x2="30" y2="60" stroke={color} strokeWidth="2" opacity="1"/>
          <line x1="45" y1="0" x2="45" y2="60" stroke={color} strokeWidth="1.5" opacity="0.8"/>
          
          {/* 斗拱层叠结构 - 带微动画 */}
          <rect x={5 + offset} y="5" width="10" height="6" stroke={color} strokeWidth="1" fill="none" opacity="0.7"/>
          <rect x={3} y={12 - offset * 0.5} width="14" height="6" stroke={color} strokeWidth="1" fill="none" opacity="0.8"/>
          <rect x={1} y={20} width="18" height="6" stroke={color} strokeWidth="1.2" fill="none" opacity="0.9"/>
          
          {/* 榫头结构（可见的连接点）*/}
          <circle cx="30" cy="30" r="3" stroke={color} strokeWidth="1.5" fill="none" opacity="1"/>
          <circle cx="15" cy="15" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.8"/>
          <circle cx="45" cy="15" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.8"/>
          <circle cx="15" cy="45" r="2" stroke={color} strokeWidth="1" fill="none" opacity="0.8"/>
          
          {/* 榫卯咬合细节 */}
          <path 
            d={`M 25,${30 + offset} L 30,30 L 35,${30 - offset}`} 
            stroke={color} 
            strokeWidth="1" 
            fill="none" 
            opacity="0.6"
          />
          <path 
            d={`M ${30 + offset},25 L 30,30 L ${30 - offset},35`} 
            stroke={color} 
            strokeWidth="1" 
            fill="none" 
            opacity="0.6"
          />
          
          {/* 角部加固纹饰 */}
          <polyline 
            points="0,0 10,0 10,2 2,2 2,10 0,10" 
            stroke={color} 
            strokeWidth="1.5" 
            fill="none" 
            opacity="1"
          />
        </g>
      </svg>
    </div>
  );
}
