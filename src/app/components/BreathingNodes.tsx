// 节点呼吸动画组件 - 为图谱节点添加多层次呼吸光晕

import { useEffect, useRef } from 'react';

interface BreathingNodesProps {
  fenjiu_colors: any;
  colors: any;
}

export function BreathingNodes({ fenjiu_colors, colors }: BreathingNodesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置canvas尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // 节点位置配置（这些位置会被力引导布局动态调整，这里只是初始参考）
    const nodeConfig = [
      // 中心节点
      { x: 0.5, y: 0.5, size: 200, color: fenjiu_colors.ice_blue, opacity: 0.08, layers: 4 },
      
      // 一级节点（5个）
      { x: 0.3, y: 0.3, size: 85, color: colors['根祖文化'], opacity: 0.15, layers: 3 },
      { x: 0.7, y: 0.3, size: 85, color: colors['忠义文化'], opacity: 0.15, layers: 3 },
      { x: 0.7, y: 0.7, size: 85, color: colors['山河文化'], opacity: 0.15, layers: 3 },
      { x: 0.3, y: 0.7, size: 85, color: colors['古建文化'], opacity: 0.15, layers: 3 },
      { x: 0.5, y: 0.2, size: 85, color: colors['酒魂文化'], opacity: 0.15, layers: 3 }
    ];

    let phase = 0;

    // 呼吸节点类
    class BreathingNode {
      x: number;
      y: number;
      baseSize: number;
      color: string;
      opacity: number;
      layers: number;
      phaseOffset: number;
      
      constructor(config: any) {
        this.x = config.x * canvas.width;
        this.y = config.y * canvas.height;
        this.baseSize = config.size;
        this.color = config.color;
        this.opacity = config.opacity;
        this.layers = config.layers;
        this.phaseOffset = Math.random() * Math.PI * 2;
      }
      
      draw(time: number) {
        if (!ctx) return;
        
        // 绘制多层光晕
        for (let i = this.layers; i >= 1; i--) {
          // 每层有不同的呼吸周期
          const layerPhase = time + this.phaseOffset + (i * Math.PI / this.layers);
          const breathingFactor = Math.sin(layerPhase) * 0.15 + 1;
          
          // 每层的大小和透明度
          const layerSize = this.baseSize * (1 + i * 0.3) * breathingFactor;
          const layerOpacity = this.opacity / (i * 1.5);
          
          // 创建径向渐变
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, layerSize
          );
          
          gradient.addColorStop(0, this.hexToRgba(this.color, layerOpacity * 0.8));
          gradient.addColorStop(0.5, this.hexToRgba(this.color, layerOpacity * 0.4));
          gradient.addColorStop(1, this.hexToRgba(this.color, 0));
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, layerSize, 0, Math.PI * 2);
          ctx.fill();
          
          // 绘制边框光环
          ctx.strokeStyle = this.hexToRgba(this.color, layerOpacity * 0.6);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(this.x, this.y, layerSize - 1, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      updatePosition() {
        this.x = this.x;
        this.y = this.y;
      }
      
      hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    // 创建呼吸节点
    const breathingNodes = nodeConfig.map(config => new BreathingNode(config));

    // 动画循环
    let animationId: number;
    const animate = () => {
      phase += 0.015;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制所有节点
      breathingNodes.forEach(node => {
        node.draw(phase);
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // 窗口大小改变
    const handleResize = () => {
      setCanvasSize();
      
      // 更新节点位置（保持相对位置）
      breathingNodes.forEach((node, index) => {
        node.x = nodeConfig[index].x * canvas.width;
        node.y = nodeConfig[index].y * canvas.height;
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fenjiu_colors, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
    />
  );
}
