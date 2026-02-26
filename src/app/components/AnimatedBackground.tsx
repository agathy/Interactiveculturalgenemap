// 动态背景渐变组件 - 呼吸感渐变效果

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

    // 设置canvas尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // 渐变动画参数
    let phase = 0;
    const speed = 0.001;

    // 创建多层渐变球
    class GradientOrb {
      x: number;
      y: number;
      radius: number;
      color1: string;
      color2: string;
      offset: number;
      speed: number;
      
      constructor(x: number, y: number, radius: number, color1: string, color2: string, offset: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color1 = color1;
        this.color2 = color2;
        this.offset = offset;
        this.speed = 0.5 + Math.random() * 0.5;
      }
      
      draw(time: number) {
        if (!ctx) return;
        
        // 呼吸效果 - 半径随时间变化
        const breathingFactor = Math.sin(time * this.speed + this.offset) * 0.15 + 1;
        const currentRadius = this.radius * breathingFactor;
        
        // 位置微微移动
        const offsetX = Math.sin(time * 0.3 + this.offset) * 30;
        const offsetY = Math.cos(time * 0.2 + this.offset) * 30;
        
        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
          this.x + offsetX, this.y + offsetY, 0,
          this.x + offsetX, this.y + offsetY, currentRadius
        );
        
        // 透明度也随时间变化
        const alpha = (Math.sin(time * 0.5 + this.offset) * 0.3 + 0.7) * 0.35;  // 增强：35%（原来15%）
        
        gradient.addColorStop(0, this.hexToRgba(this.color1, alpha));
        gradient.addColorStop(0.5, this.hexToRgba(this.color2, alpha * 0.6));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    // 创建多个渐变光球
    const orbs = [
      // 左上 - 冰蓝色调
      new GradientOrb(
        canvas.width * 0.1,
        canvas.height * 0.1,
        canvas.width * 0.6,
        fenjiu_colors.ice_blue,
        fenjiu_colors.ice_blue_light,
        0
      ),
      // 右下 - 琥珀金色调
      new GradientOrb(
        canvas.width * 0.9,
        canvas.height * 0.9,
        canvas.width * 0.5,
        fenjiu_colors.amber_gold,
        fenjiu_colors.terracotta_red,
        Math.PI
      ),
      // 中上 - 杏花粉色调
      new GradientOrb(
        canvas.width * 0.5,
        canvas.height * 0.2,
        canvas.width * 0.4,
        fenjiu_colors.apricot_pink,
        fenjiu_colors.ice_blue_light,
        Math.PI / 2
      ),
      // 左下 - 陶土色调
      new GradientOrb(
        canvas.width * 0.2,
        canvas.height * 0.8,
        canvas.width * 0.45,
        fenjiu_colors.terracotta_red,
        fenjiu_colors.amber_gold,
        Math.PI * 1.5
      ),
      // 右上 - 清波色调
      new GradientOrb(
        canvas.width * 0.85,
        canvas.height * 0.15,
        canvas.width * 0.35,
        fenjiu_colors.ice_blue_light,
        fenjiu_colors.ice_blue,
        Math.PI / 3
      )
    ];

    // 动画循环
    let animationId: number;
    const animate = () => {
      phase += speed;
      
      // 填充基础背景色
      ctx.fillStyle = fenjiu_colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 设置混合模式
      ctx.globalCompositeOperation = 'screen';
      
      // 绘制所有渐变球
      orbs.forEach(orb => orb.draw(phase));
      
      // 恢复混合模式
      ctx.globalCompositeOperation = 'source-over';
      
      // 添加整体暗角效果
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.8
      );
      vignette.addColorStop(0, 'rgba(10, 11, 16, 0)');
      vignette.addColorStop(0.7, 'rgba(10, 11, 16, 0.3)');
      vignette.addColorStop(1, 'rgba(10, 11, 16, 0.7)');
      
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // 窗口大小改变
    const handleResize = () => {
      setCanvasSize();
      
      // 更新光球位置
      orbs[0].x = canvas.width * 0.1;
      orbs[0].y = canvas.height * 0.1;
      orbs[0].radius = canvas.width * 0.6;
      
      orbs[1].x = canvas.width * 0.9;
      orbs[1].y = canvas.height * 0.9;
      orbs[1].radius = canvas.width * 0.5;
      
      orbs[2].x = canvas.width * 0.5;
      orbs[2].y = canvas.height * 0.2;
      orbs[2].radius = canvas.width * 0.4;
      
      orbs[3].x = canvas.width * 0.2;
      orbs[3].y = canvas.height * 0.8;
      orbs[3].radius = canvas.width * 0.45;
      
      orbs[4].x = canvas.width * 0.85;
      orbs[4].y = canvas.height * 0.15;
      orbs[4].radius = canvas.width * 0.35;
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