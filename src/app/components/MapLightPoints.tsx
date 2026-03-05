'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { MapLightPoint, MapLightPointsData } from './graphData';

interface MapLightPointsProps {
  lightPointsData: MapLightPointsData | null;
  chartInstance: any;
  rootNodeSize: number;
  centerX?: number;
  centerY?: number;
}

// 将经纬度转换为相对于地图中心的像素坐标
function geoToPixel(
  lng: number,
  lat: number,
  mapBounds: { minLng: number; maxLng: number; minLat: number; maxLat: number },
  mapSize: number
): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = mapBounds;
  
  // 等距圆柱投影修正
  const avgLat = (minLat + maxLat) / 2;
  const cosLat = Math.cos((avgLat * Math.PI) / 180);
  
  const rangeX = (maxLng - minLng) * cosLat;
  const rangeY = maxLat - minLat;
  
  const scale = mapSize / Math.max(rangeX, rangeY);
  
  const x = ((lng - minLng) * cosLat * scale);
  const y = mapSize - ((lat - minLat) * scale);
  
  return { x, y };
}

export function MapLightPoints({
  lightPointsData,
  chartInstance,
  rootNodeSize,
  centerX = 500,
  centerY = 375
}: MapLightPointsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const pointsRef = useRef<MapLightPoint[]>([]);
  const timeRef = useRef<number>(0);

  // 山西省地理边界
  const shanxiBounds = {
    minLng: 110.0,
    maxLng: 114.5,
    minLat: 34.5,
    maxLat: 40.5
  };

  const drawLightPoints = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    if (!pointsRef.current.length) return;

    const mapSize = rootNodeSize * 0.8; // 地图实际显示大小
    const offsetX = centerX - mapSize / 2;
    const offsetY = centerY - mapSize / 2;

    pointsRef.current.forEach((point, index) => {
      const pos = geoToPixel(point.lng, point.lat, shanxiBounds, mapSize);
      const x = offsetX + pos.x;
      const y = offsetY + pos.y;
      const size = point.size || 4;
      const color = point.color || '#00EAFF';
      
      // 闪烁动画 - 每个点有不同的相位
      const phase = (index * 0.5) % (Math.PI * 2);
      const blinkSpeed = 0.003;
      const opacity = 0.4 + 0.6 * Math.abs(Math.sin(time * blinkSpeed + phase));
      
      // 绘制外发光
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(0.4, color + Math.floor(opacity * 0.5 * 255).toString(16).padStart(2, '0'));
      gradient.addColorStop(1, color + '00');
      
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 绘制核心光点
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // 绘制十字光芒
      const rayLength = size * 2;
      const rayOpacity = opacity * 0.6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.globalAlpha = rayOpacity;
      
      // 水平光芒
      ctx.beginPath();
      ctx.moveTo(x - rayLength, y);
      ctx.lineTo(x + rayLength, y);
      ctx.stroke();
      
      // 垂直光芒
      ctx.beginPath();
      ctx.moveTo(x, y - rayLength);
      ctx.lineTo(x, y + rayLength);
      ctx.stroke();
      
      ctx.globalAlpha = 1;
    });
  }, [rootNodeSize, centerX, centerY]);

  useEffect(() => {
    if (!lightPointsData?.points?.length) return;
    
    pointsRef.current = lightPointsData.points;
    
    // 创建或获取 canvas
    let canvas = canvasRef.current;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '15'; // 在 ECharts 之上，但在 BreathingNodes 之下
      canvas.style.pointerEvents = 'none';
      
      // 找到图表容器并添加 canvas
      const chartContainer = document.querySelector('.echarts-container');
      if (chartContainer) {
        chartContainer.appendChild(canvas);
        canvasRef.current = canvas;
      }
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置 canvas 尺寸
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // 动画循环
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 16; // 约 60fps
      
      drawLightPoints(ctx, timeRef.current);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (canvas && canvas.parentElement) {
        canvas.parentElement.removeChild(canvas);
        canvasRef.current = null;
      }
    };
  }, [lightPointsData, drawLightPoints]);

  // 监听图表缩放和移动，更新光点位置
  useEffect(() => {
    if (!chartInstance || !canvasRef.current) return;

    const handleRoam = () => {
      const opt = chartInstance.getOption();
      if (opt.series && opt.series[0]) {
        const zoom = opt.series[0].zoom || 1;
        const center = opt.series[0].center || [500, 375];
        
        // 可以在这里根据 zoom 和 center 调整光点大小和位置
        // 目前光点是相对于根节点位置固定的
      }
    };

    chartInstance.on('graphroam', handleRoam);
    return () => {
      chartInstance.off('graphroam', handleRoam);
    };
  }, [chartInstance]);

  return null; // 这个组件不渲染任何 React 元素
}

export default MapLightPoints;
