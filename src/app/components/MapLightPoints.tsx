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

/**
 * 将 path 坐标系位置转换为当前屏幕像素坐标
 *
 * ECharts graph 坐标系规则：
 *   screenX = (nodeDataX - center[0]) * zoom + canvasWidth / 2
 * 根节点在 data 坐标 (500, 375)，中心节点始终位于 canvas 中心。
 * path:// symbol 以节点位置为中心，以 symbolSize * zoom 为像素尺寸渲染。
 */
function pathToScreen(
  pathX: number,
  pathY: number,
  rootNodeSize: number,
  center: [number, number],
  zoom: number
): { x: number; y: number } {
  // 根节点屏幕位置
  const rootScreenX = (500 - center[0]) * zoom + window.innerWidth / 2;
  const rootScreenY = (375 - center[1]) * zoom + window.innerHeight / 2;
  // path 坐标系中心为 (PATH_SIZE/2, PATH_SIZE/2)
  // 每个 path 单位对应的像素数 = symbolSize * zoom / PATH_SIZE
  const pxPerUnit = (rootNodeSize * zoom) / PATH_SIZE;
  return {
    x: rootScreenX + (pathX - PATH_SIZE / 2) * pxPerUnit,
    y: rootScreenY + (pathY - PATH_SIZE / 2) * pxPerUnit,
  };
}

/** 绘制单个血光点（核心 + 外发光 + 多圈扩散涟漪） */
function drawBloodPoint(
  ctx: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  point: MapLightPoint,
  baseSize: number,
  time: number,
  index: number
) {
  const color = point.color || '#FF1111';
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

  // ── 3 圈错相扩散涟漪 ──────────────────────────────────
  for (let ring = 0; ring < 3; ring++) {
    const progress = ((time * 0.0007 + index * 0.4 + ring / 3) % 1);
    const ringR = baseSize * (0.6 + progress * 3.5);
    const ringAlpha = (1 - progress) * 0.55;
    ctx.beginPath();
    ctx.arc(sx, sy, ringR, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = ringAlpha;
    ctx.stroke();
  }

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
      const vs = viewStateRef.current;

      if (points?.length && bounds && vs) {
        const { zoom, center } = vs;
        // 点大小随缩放轻微缩放（不完全跟随，保持可读性）
        const zoomScale = Math.max(0.6, Math.min(2, 0.7 + zoom * 0.5));

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          const pathCoord = geoToPathCoord(pt.lng, pt.lat, bounds);
          const screen = pathToScreen(pathCoord.x, pathCoord.y, rootNodeSize, center, zoom);
          const baseSize = (pt.size || 4) * zoomScale;
          drawBloodPoint(ctx, screen.x, screen.y, pt, baseSize, timeRef.current, i);
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
        zIndex: 15,      // ECharts(10) 之上，BreathingNodes(20) 之下
        pointerEvents: 'none',
      }}
    />
  );
}

export default MapLightPoints;
