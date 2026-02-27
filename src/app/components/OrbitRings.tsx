// 同心圆轨道组件

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface OrbitRingsProps {
  fenjiu_colors: any;
  chartInstance?: any;
  l1Radius: number;
  timelineRadius: number;
}

export function OrbitRings({ fenjiu_colors, chartInstance, l1Radius, timelineRadius }: OrbitRingsProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    if (!chartInstance) return;

    const updatePosition = () => {
      if (!chartInstance || chartInstance.isDisposed()) return;

      try {
        // 获取中心节点 (root) 在屏幕上的像素坐标
        const pos = chartInstance.convertToPixel({ seriesIndex: 0 }, [500, 375]);
        
        // 获取当前的缩放比例
        const option = chartInstance.getOption();
        const zoom = (option && option.series && option.series[0] && option.series[0].zoom) || 1;
        
        if (pos) {
          setTransform({
            x: pos[0],
            y: pos[1],
            scale: zoom
          });
        }
      } catch (e) {
        // 忽略初始化期间的坐标转换错误
      }
    };

    // 初始计算
    updatePosition();

    // 监听缩放和拖拽
    chartInstance.on('graphroam', updatePosition);
    chartInstance.on('finished', updatePosition);

    return () => {
      if (chartInstance && !chartInstance.isDisposed()) {
        chartInstance.off('graphroam', updatePosition);
        chartInstance.off('finished', updatePosition);
      }
    };
  }, [chartInstance]);

  if (!fenjiu_colors) return null;

  const rings = [
    { size: l1Radius * 2, opacity: 0.15, style: 'solid', color: fenjiu_colors.ice_blue }, // 主轨道
    { size: l1Radius * 2 + 60, opacity: 0.08, style: 'solid' },
    { size: l1Radius * 2 + 150, opacity: 0.05, style: 'dashed' },
    { size: l1Radius * 2 + 280, opacity: 0.03, style: 'solid' }
  ];

  const timeMarkers = [
    { name: '上古', angle: 0 },
    { name: '夏商周', angle: 72 },
    { name: '汉唐', angle: 144 },
    { name: '明清', angle: 216 },
    { name: '现代', angle: 288 }
  ];

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 3 }}
    >
      <div 
        className="absolute top-0 left-0"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          {/* 基础轨道 */}
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

          {/* 时间轮回圆环 */}
          <motion.div 
            className="absolute rounded-full border border-cyan-400/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            style={{
              width: `${timelineRadius * 2}px`,
              height: `${timelineRadius * 2}px`,
              boxShadow: 'inset 0 0 30px rgba(135, 206, 250, 0.1)',
            }}
          >
            {timeMarkers.map((marker, idx) => (
              <div 
                key={idx}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotate(${marker.angle}deg) translateY(-${timelineRadius}px)`
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1 h-3 bg-cyan-400/60 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  <span 
                    className="text-[10px] text-cyan-200/60 font-medium tracking-tighter"
                    style={{ 
                      textShadow: '0 0 10px rgba(135, 206, 250, 0.5)',
                      transform: `rotate(-${marker.angle}deg)` // 文字保持水平可读
                    }}
                  >
                    {marker.name}
                  </span>
                </div>
              </div>
            ))}
            
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee]"
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                offsetPath: `path('M ${timelineRadius}, ${timelineRadius} m -${timelineRadius}, 0 a ${timelineRadius},${timelineRadius} 0 1,0 ${timelineRadius * 2},0 a ${timelineRadius},${timelineRadius} 0 1,0 -${timelineRadius * 2},0')`,
              }}
            />
          </motion.div>

          <div 
            className="absolute rounded-full opacity-10"
            style={{
              width: `${timelineRadius * 2 + 30}px`,
              height: `${timelineRadius * 2 + 30}px`,
              background: `conic-gradient(from 0deg, transparent, ${fenjiu_colors.ice_blue}, transparent)`
            }}
          />
        </div>
      </div>
    </div>
  );
}
