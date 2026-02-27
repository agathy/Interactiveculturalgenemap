// 动态背景渐变组件 - 呼吸感渐变效果 - 调优为更深邃的太行夜色

import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  fenjiu_colors: any;
}

export function AnimatedBackground({ fenjiu_colors }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    let phase = 0;
    const speed = 0.0008; // 稍微降低速度，更沉静

    class GradientOrb {
      x: number; y: number; radius: number; color1: string; color2: string; offset: number; speed: number;
      
      constructor(x: number, y: number, radius: number, color1: string, color2: string, offset: number) {
        this.x = x; this.y = y; this.radius = radius;
        this.color1 = color1; this.color2 = color2;
        this.offset = offset;
        this.speed = 0.4 + Math.random() * 0.4;
      }
      
      draw(time: number) {
        if (!ctx) return;
        
        const breathingFactor = Math.sin(time * this.speed + this.offset) * 0.1 + 1;
        const currentRadius = this.radius * breathingFactor;
        
        const offsetX = Math.sin(time * 0.2 + this.offset) * 40;
        const offsetY = Math.cos(time * 0.15 + this.offset) * 40;
        
        const gradient = ctx.createRadialGradient(
          this.x + offsetX, this.y + offsetY, 0,
          this.x + offsetX, this.y + offsetY, currentRadius
        );
        
        // 恢复部分亮度：由 0.12 提升到 0.22，恢复朦胧感
        const alpha = (Math.sin(time * 0.4 + this.offset) * 0.2 + 0.8) * 0.22; 
        
        gradient.addColorStop(0, this.hexToRgba(this.color1, alpha));
        gradient.addColorStop(0.6, this.hexToRgba(this.color2, alpha * 0.3));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      hexToRgba(hex: string, alpha: number): string {
        if (hex.startsWith('rgb')) return hex.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    const orbs = [
      new GradientOrb(canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.6, fenjiu_colors.ice_blue, fenjiu_colors.ice_blue_light, 0),
      new GradientOrb(canvas.width * 0.9, canvas.height * 0.9, canvas.width * 0.5, fenjiu_colors.amber_gold, fenjiu_colors.terracotta_red, Math.PI),
      new GradientOrb(canvas.width * 0.5, canvas.height * 0.2, canvas.width * 0.4, fenjiu_colors.apricot_pink, fenjiu_colors.ice_blue_light, Math.PI / 2),
      new GradientOrb(canvas.width * 0.2, canvas.height * 0.8, canvas.width * 0.45, fenjiu_colors.terracotta_red, fenjiu_colors.amber_gold, Math.PI * 1.5),
      new GradientOrb(canvas.width * 0.85, canvas.height * 0.15, canvas.width * 0.35, fenjiu_colors.ice_blue_light, fenjiu_colors.ice_blue, Math.PI / 3)
    ];

    let animationId: number;
    const animate = () => {
      phase += speed;
      
      // 1. 回归暗蓝色底座
      ctx.fillStyle = fenjiu_colors.background || '#020308';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.globalCompositeOperation = 'screen';
      orbs.forEach(orb => orb.draw(phase));
      ctx.globalCompositeOperation = 'source-over';
      
      // 2. 软化暗角效果 (Vignette)
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 1.1
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)'); 
      vignette.addColorStop(1, 'rgba(0, 0, 0, 0.6)');     
      
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. 弱化顶部遮罩
      const topMask = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.4);
      topMask.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      topMask.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topMask;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.4);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      setCanvasSize();
      orbs[0].x = canvas.width * 0.1; orbs[0].y = canvas.height * 0.1; orbs[0].radius = canvas.width * 0.6;
      orbs[1].x = canvas.width * 0.9; orbs[1].y = canvas.height * 0.9; orbs[1].radius = canvas.width * 0.5;
      orbs[2].x = canvas.width * 0.5; orbs[2].y = canvas.height * 0.2; orbs[2].radius = canvas.width * 0.4;
      orbs[3].x = canvas.width * 0.2; orbs[3].y = canvas.height * 0.8; orbs[3].radius = canvas.width * 0.45;
      orbs[4].x = canvas.width * 0.85; orbs[4].y = canvas.height * 0.15; orbs[4].radius = canvas.width * 0.35;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [fenjiu_colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}
