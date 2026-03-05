// 呼吸脉动 + 装饰圆盘 Canvas 叠加层
// 通过 chartInstance 内部 API 实时跟随一级节点位置

import React, { useRef, useEffect } from 'react';
import type { GraphData } from './graphData';

interface BreathingNodesProps {
  fenjiu_colors: any;
  colors: Record<string, string>;
  chartInstance: any;
  l1Radius: number;
  decorSpinSpeed: number;
  breathFrequency: number;
  l1NodeSize: number;
  decorRadius: number;
  graphData: GraphData;
  showCenterText?: boolean;
}

export function BreathingNodes({
  fenjiu_colors,
  colors,
  chartInstance,
  l1Radius,
  decorSpinSpeed,
  breathFrequency,
  l1NodeSize,
  decorRadius,
  graphData,
  showCenterText = true,
}: BreathingNodesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const breathRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let animationFrame: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!chartInstance) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      // 安全检查 chart 是否已销毁
      try {
        if (chartInstance.isDisposed?.()) {
          animationFrame = requestAnimationFrame(draw);
          return;
        }
      } catch {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      rotationRef.current += decorSpinSpeed * 0.02;
      breathRef.current += breathFrequency;

      const breathScale = 1 + Math.sin(breathRef.current) * 0.15;

      // 获取 series data
      let seriesData: any = null;
      try {
        const seriesModel = chartInstance.getModel()?.getSeriesByIndex(0);
        seriesData = seriesModel?.getData();
      } catch {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      if (!seriesData) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      // 获取 chart 容器的 DOM 位置偏移量（canvas 是 fixed/absolute 定位，需要对齐）
      let containerRect: DOMRect | null = null;
      try {
        const dom = chartInstance.getDom();
        if (dom) containerRect = dom.getBoundingClientRect();
      } catch { /* ignore */ }

      const offsetX = containerRect?.left ?? 0;
      const offsetY = containerRect?.top ?? 0;

      // 获取图表当前的缩放比例
      let chartZoom = 1;
      try {
        const option = chartInstance.getOption();
        chartZoom = option?.series?.[0]?.zoom || 1;
      } catch { /* ignore */ }

      // 动态生成分类列表，提取中心文字（在"文化"前换行）
      const l1Nodes = graphData.categories.map(cat => {
        // 在"文化"前分割文本，如"根祖文化" -> ["根祖", "文化"]
        const parts = cat.name.split('文化');
        const line1 = parts[0]; // "根祖"
        const line2 = parts.length > 1 ? '文化' + parts[1] : ''; // "文化"
        return {
          id: cat.id,
          name: cat.name,
          colorKey: cat.name,
          centerTextLine1: line1,
          centerTextLine2: line2
        };
      });

      l1Nodes.forEach(({ id, name, colorKey, centerTextLine1, centerTextLine2 }) => {
        // 使用 name（中文名）查找，因为 ECharts indexOfName 按 name 属性搜索
        let nodeIndex = seriesData.indexOfName(name);
        
        // 如果按 name 找不到，尝试遍历查找 id
        if (nodeIndex === -1) {
          const count = seriesData.count();
          for (let i = 0; i < count; i++) {
            const rawItem = seriesData.getRawDataItem(i);
            if (rawItem && (rawItem as any).id === id) {
              nodeIndex = i;
              break;
            }
          }
        }

        if (nodeIndex === -1) return;

        // 方案一：通过 graphic element 获取实际渲染位置（最可靠）
        let x: number | null = null;
        let y: number | null = null;

        try {
          const el = seriesData.getItemGraphicEl(nodeIndex);
          if (el) {
            // 获取元素的全局变换矩阵，提取平移分量
            // 使用新版 zrender API：x/y 替代 position，scaleX/scaleY 替代 scale
            let globalX = 0;
            let globalY = 0;
            let current = el;
            while (current) {
              // zrender ≥5 使用 x/y 替代 position[]，scaleX/scaleY 替代 scale[]
              const posX = (current as any).x ?? 0;
              const posY = (current as any).y ?? 0;
              const scaleX = (current as any).scaleX ?? 1;
              const scaleY = (current as any).scaleY ?? 1;
              globalX = globalX * scaleX + posX;
              globalY = globalY * scaleY + posY;
              current = current.parent;
            }
            x = globalX + offsetX;
            y = globalY + offsetY;
          }
        } catch { /* fallback below */ }

        // 方案二：如果 graphic element 方式失败，尝试 convertToPixel
        if (x === null || y === null) {
          try {
            const layout = seriesData.getItemLayout(nodeIndex);
            if (layout) {
              const coords = Array.isArray(layout) ? layout : [layout[0], layout[1]];
              const point = chartInstance.convertToPixel({ seriesIndex: 0 }, coords);
              if (point) {
                x = point[0] + offsetX;
                y = point[1] + offsetY;
              }
            }
          } catch { /* ignore */ }
        }

        if (x === null || y === null || isNaN(x) || isNaN(y)) return;

        const nodeColor = colors[colorKey] || fenjiu_colors.ice_blue;
        const radius = (l1NodeSize / 2) * breathScale;

        // 1. 外层旋转虚线环
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotationRef.current);
        ctx.strokeStyle = nodeColor;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.arc(0, 0, radius + decorRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 2. 第二层反向旋转虚线环
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-rotationRef.current * 0.7);
        ctx.strokeStyle = nodeColor;
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 8]);
        ctx.beginPath();
        ctx.arc(0, 0, radius + decorRadius * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3. 脉冲光晕
        const glowRadius = radius + decorRadius * 1.5 + Math.sin(breathRef.current * 1.5) * 3;
        const gradient = ctx.createRadialGradient(x, y, radius * 0.3, x, y, glowRadius);
        gradient.addColorStop(0, hexToRgba(nodeColor, 0.1));
        gradient.addColorStop(0.5, hexToRgba(nodeColor, 0.04));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // 4. 内层装饰实线环
        ctx.strokeStyle = nodeColor;
        ctx.globalAlpha = 0.2;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(x, y, radius + decorRadius * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // 5. 呼吸脉动的核心光点
        const coreGlow = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.25);
        coreGlow.addColorStop(0, hexToRgba(nodeColor, 0.12 + Math.sin(breathRef.current) * 0.06));
        coreGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(x, y, radius * 0.25, 0, Math.PI * 2);
        ctx.fill();

        // 6. 四个方向的装饰小点（随旋转）
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotationRef.current * 1.5);
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI / 2) * i;
          const dotX = Math.cos(angle) * (radius + decorRadius * 0.75);
          const dotY = Math.sin(angle) * (radius + decorRadius * 0.75);
          ctx.fillStyle = nodeColor;
          ctx.globalAlpha = 0.35 + Math.sin(breathRef.current + i) * 0.15;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // 7. 一级节点中心文字（根据 showCenterText 开关决定是否显示）
        if (showCenterText) {
          ctx.save();
          // 字体大小跟随节点大小和图表缩放比例，保持与节点圆圈同比例（增大比例）
          const fontSize = Math.round(l1NodeSize * 0.28 * chartZoom);
          // 使用自定义字体文件（不使用 bold，避免过粗）
          ctx.font = `${fontSize}px "zihun266hao-shenshihei", "Source Han Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          // 重置阴影和透明度
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          
          // 计算两行文字的垂直偏移
          const lineHeight = fontSize * 1.05;
          const y1 = y - lineHeight / 2; // 第一行（根祖）
          const y2 = y + lineHeight / 2; // 第二行（文化）
          
          // 将节点颜色叠加50%黑色
          const textColor = blendWithBlack(nodeColor, 0.5);
          
          // 第一行 - 无描边，使用叠加后的颜色
          ctx.fillStyle = textColor;
          ctx.fillText(centerTextLine1, x, y1);
          
          // 第二行 - 无描边，使用叠加后的颜色
          if (centerTextLine2) {
            ctx.fillText(centerTextLine2, x, y2);
          }
          ctx.restore();
        }
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, [chartInstance, colors, fenjiu_colors, decorSpinSpeed, breathFrequency, l1NodeSize, decorRadius, showCenterText]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    />
  );
}

// Helper: convert hex color to rgba string
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(100,200,255,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

// Helper: blend color with black (ratio: 0-1, where 1 = full black)
function blendWithBlack(hex: string, ratio: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  // Blend with black: newColor = color * (1 - ratio) + black * ratio
  const newR = Math.round(r * (1 - ratio));
  const newG = Math.round(g * (1 - ratio));
  const newB = Math.round(b * (1 - ratio));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}