// 同心圆轨道组件

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface OrbitRingsProps {
  fenjiu_colors: any;
  chartInstance?: any;
  l1Radius: number;
  timelineRadius: number;
  focusedTimeRange?: [number, number] | null;
  timelineColor?: string;
}

export function OrbitRings({ fenjiu_colors, chartInstance, l1Radius, timelineRadius, focusedTimeRange, timelineColor = '#22d3ee' }: OrbitRingsProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  // Orbit particle: angle in degrees, animated via rAF to avoid Motion deprecated offsetDistance
  const orbitAngleRef = useRef(0);
  const orbitDotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!chartInstance) return;

    const updatePosition = () => {
      if (!chartInstance || chartInstance.isDisposed()) return;

      try {
        const pos = chartInstance.convertToPixel({ seriesIndex: 0 }, [500, 375]);
        const option = chartInstance.getOption();
        const zoom = (option && option.series && option.series[0] && option.series[0].zoom) || 1;
        if (pos) {
          setTransform({ x: pos[0], y: pos[1], scale: zoom });
        }
      } catch (e) { /* ignore */ }
    };

    updatePosition();
    chartInstance.on('graphroam', updatePosition);
    chartInstance.on('finished', updatePosition);

    return () => {
      if (chartInstance && !chartInstance.isDisposed()) {
        chartInstance.off('graphroam', updatePosition);
        chartInstance.off('finished', updatePosition);
      }
    };
  }, [chartInstance]);

  // Animate the orbit particle using rAF instead of Motion offsetDistance
  useEffect(() => {
    const r = timelineRadius;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      orbitAngleRef.current = (orbitAngleRef.current + (dt / 20000) * 360) % 360;
      const rad = ((orbitAngleRef.current - 90) * Math.PI) / 180;
      const cx = r + r * Math.cos(rad);
      const cy = r + r * Math.sin(rad);
      if (orbitDotRef.current) {
        orbitDotRef.current.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [timelineRadius]);

  if (!fenjiu_colors) return null;

  const rings = [
    { size: l1Radius * 2, opacity: 0.15, style: 'solid', color: fenjiu_colors.ice_blue },
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

  const getYearAngle = (year: number) => {
    const minYear = -6000;
    const maxYear = 2026;
    const clamped = Math.max(minYear, Math.min(maxYear, year));
    return ((clamped - minYear) / (maxYear - minYear)) * 360;
  };

  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180.0;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // 默认显示完整时间范围（-6000年到2026年）
  const defaultTimeRange: [number, number] = [-6000, 2026];
  const activeTimeRange = focusedTimeRange ?? defaultTimeRange;
  
  // 检查是否是完整时间范围（用于绘制完整圆环）
  const isFullRange = activeTimeRange[0] === -6000 && activeTimeRange[1] === 2026;

  const arcPath = (() => {
    const startAngle = getYearAngle(activeTimeRange[0]) - 90;
    const endAngle   = getYearAngle(activeTimeRange[1]) - 90;
    const diff = endAngle - startAngle;
    
    // 如果是完整范围，返回null表示使用圆形而非弧线
    if (isFullRange) {
      return null;
    }
    
    const start = polarToCartesian(timelineRadius, timelineRadius, timelineRadius, startAngle);
    const end   = polarToCartesian(timelineRadius, timelineRadius, timelineRadius, startAngle + Math.max(5, diff));
    const largeArcFlag = diff <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${timelineRadius} ${timelineRadius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
  })();

  const endDot = isFullRange 
    ? null 
    : polarToCartesian(timelineRadius, timelineRadius, timelineRadius, getYearAngle(activeTimeRange[1]) - 90);

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
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{
              width: `${timelineRadius * 2}px`,
              height: `${timelineRadius * 2}px`,
              boxShadow: 'inset 0 0 30px rgba(135, 206, 250, 0.1)',
            }}
          >
            {timeMarkers.map((marker, idx) => (
              <div
                key={idx}
                className="absolute top-1/2 left-1/2"
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
                      transform: `rotate(-${marker.angle}deg)`
                    }}
                  >
                    {marker.name}
                  </span>
                </div>
              </div>
            ))}

            {/* 高亮聚焦时间段的弧形 - 默认显示完整时间范围 */}
            {isFullRange ? (
              /* 完整圆环 - 默认状态显示 */
              <svg
                className="absolute top-0 left-0"
                width={timelineRadius * 2}
                height={timelineRadius * 2}
                viewBox={`0 0 ${timelineRadius * 2} ${timelineRadius * 2}`}
                style={{ overflow: 'visible' }}
              >
                <motion.circle
                  key="full-range"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  cx={timelineRadius}
                  cy={timelineRadius}
                  r={timelineRadius}
                  fill="none"
                  stroke={timelineColor}
                  strokeWidth="2"
                  style={{ filter: `drop-shadow(0 0 10px ${timelineColor})` }}
                />
              </svg>
            ) : arcPath ? (
              <svg
                className="absolute top-0 left-0"
                width={timelineRadius * 2}
                height={timelineRadius * 2}
                viewBox={`0 0 ${timelineRadius * 2} ${timelineRadius * 2}`}
                style={{ overflow: 'visible' }}
              >
                {/* 弧线 */}
                <motion.path
                  key={activeTimeRange.join(',')}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  d={arcPath}
                  fill="none"
                  stroke={timelineColor}
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 10px ${timelineColor})` }}
                />
                {/* 端点光点 - 用 opacity 动画替代 scale */}
                {endDot && (
                  <motion.circle
                    key={`dot-${activeTimeRange.join(',')}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    cx={endDot.x}
                    cy={endDot.y}
                    r="5"
                    fill={timelineColor}
                    style={{ filter: `drop-shadow(0 0 12px ${timelineColor})` }}
                  />
                )}
              </svg>
            ) : null}
          </motion.div>

          {/* 轨道粒子 - 使用 rAF 驱动，避免 Motion offsetDistance 警告 */}
          <div
            className="absolute"
            style={{
              width: `${timelineRadius * 2}px`,
              height: `${timelineRadius * 2}px`,
              pointerEvents: 'none'
            }}
          >
            <div
              ref={orbitDotRef}
              className="absolute w-2 h-2 rounded-full"
              style={{
                top: 0,
                left: 0,
                backgroundColor: timelineColor,
                boxShadow: `0 0 15px ${timelineColor}, 0 0 4px ${timelineColor}`,
                willChange: 'transform'
              }}
            />
          </div>

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
