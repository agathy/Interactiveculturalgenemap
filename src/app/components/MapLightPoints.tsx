'use client';

import { useRef, useEffect } from 'react';
import type { MapLightPoint, MapLightPointsData } from './graphData';
import type { MapBounds } from '../../services/mapService';

interface MapLightPointsProps {
  lightPointsData: MapLightPointsData | null;
  chartInstance: any;
  rootNodeSize: number;
  mapBounds: MapBounds | null;
  viewStateRef: React.RefObject<{ zoom: number; center: [number, number] }>;
}

const PATH_SIZE = 200; // 必须与 geoJsonToSVGPath 的 size 参数一致

/**
 * 将经纬度转换为 path:// 路径坐标系内的位置
 * 使用与 geoJsonToSVGPath 完全相同的投影公式，确保光点与地图形状精确对齐
 */
function geoToPathCoord(lng: number, lat: number, b: MapBounds): { x: number; y: number } {
  const avgLat = (b.minLat + b.maxLat) / 2;
  const cosLat = Math.cos((avgLat * Math.PI) / 180);
  const adjustedRangeX = (b.maxLng - b.minLng) * cosLat;
  const rangeY = b.maxLat - b.minLat || 1;
  const pathScale = PATH_SIZE / Math.max(adjustedRangeX, rangeY);
  const padX = (PATH_SIZE - adjustedRangeX * pathScale) / 2;
  const padY = (PATH_SIZE - rangeY * pathScale) / 2;
  return {
    x: (lng - b.minLng) * cosLat * pathScale + padX,
    y: PATH_SIZE - ((lat - b.minLat) * pathScale + padY), // 翻转 Y 轴
  };
}

/** 绘制单个血光点（外发光 + 亮核心，无涟漪环） */
function drawBloodPoint(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  point: MapLightPoint,
  baseSize: number,
  time: number,
  index: number
) {
  const color = point.color || '#0042aa';
  const phase = (index * 1.618) % (Math.PI * 2); // 黄金角错相，避免同步闪烁
  const pulse = 0.5 + 0.5 * Math.sin(time * 0.002 + phase);

  // ── 外发光晕 ──────────────────────────────────────────
  const glowR = baseSize * 3.5;
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
  const a1 = Math.round((0.45 + pulse * 0.3) * 255).toString(16).padStart(2, '0');
  const a2 = Math.round((0.12 + pulse * 0.1) * 255).toString(16).padStart(2, '0');
  glow.addColorStop(0, color + a1);
  glow.addColorStop(0.5, color + a2);
  glow.addColorStop(1, color + '00');
  ctx.beginPath();
  ctx.arc(sx, sy, glowR, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.globalAlpha = 1;
  ctx.fill();

  // ── 亮核心点 ──────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(sx, sy, baseSize * 0.5, 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.globalAlpha = 0.65 + pulse * 0.35;
  ctx.fill();

  ctx.globalAlpha = 1;
}

export function MapLightPoints({
  lightPointsData,
  chartInstance,
  rootNodeSize,
  mapBounds,
  viewStateRef,
}: MapLightPointsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  // 用 ref 存储 chartInstance，确保动画循环始终拿到最新实例
  const chartInstanceRef = useRef(chartInstance);
  chartInstanceRef.current = chartInstance;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 16;

      const points = lightPointsData?.points;
      const bounds = mapBounds;
      const chart = chartInstanceRef.current;

      if (points?.length && bounds && chart && !chart.isDisposed()) {
        try {
          // 与 OrbitRings 相同的方式：直接用 convertToPixel 获取根节点屏幕坐标
          // 这会自动计入当前的 zoom 和 pan，不需要手动推算变换矩阵
          const rootPos = chart.convertToPixel({ seriesIndex: 0 }, [500, 375]);
          if (!rootPos) {
            animRef.current = requestAnimationFrame(animate);
            return;
          }

          const zoom = viewStateRef.current?.zoom || 1;
          // symbolSize 在 ECharts 内部随 zoom 线性缩放
          const pxPerUnit = (rootNodeSize * zoom) / PATH_SIZE;

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            const pathCoord = geoToPathCoord(pt.lng, pt.lat, bounds);
            // rootPos 对应 path 坐标系中心 (PATH_SIZE/2, PATH_SIZE/2)
            const sx = rootPos[0] + (pathCoord.x - PATH_SIZE / 2) * pxPerUnit;
            const sy = rootPos[1] + (pathCoord.y - PATH_SIZE / 2) * pxPerUnit;
            const baseSize = (pt.size || 4) * Math.max(0.5, Math.min(2, zoom * 0.8));
            drawBloodPoint(ctx, sx, sy, pt, baseSize, timeRef.current, i);
          }
        } catch (_) {
          // 图表切换期间忽略错误
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [lightPointsData, mapBounds, rootNodeSize, viewStateRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 5,       // ECharts(10) 之下，光点在节点标题层级下方
        pointerEvents: 'none',
      }}
    />
  );
}

export default MapLightPoints;
