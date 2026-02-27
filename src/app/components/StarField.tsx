// 星空粒子组件 - 带闪烁效果

import { useEffect, useRef } from 'react';

interface StarFieldProps {
  fenjiu_colors: any;
}

export function StarField({ fenjiu_colors }: StarFieldProps) {
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

    // 星星粒子类
    class Star {
      x: number;
      y: number;
      size: number;
      brightness: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
      pulseSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.3;  // 调小：0.3-1.5
        this.brightness = Math.random();
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        
        // 根据汾酒主题色系随机分配颜色
        const colors = [
          fenjiu_colors.ice_blue,        // 琉璃冰蓝
          fenjiu_colors.ice_blue_light,  // 汾河清波
          fenjiu_colors.amber_gold,      // 高粱琥珀金
          fenjiu_colors.apricot_pink,    // 杏花微雨粉
          '#FFFFFF'                       // 纯白
        ];
        
        // 60%为冰蓝系，20%为琥珀金，10%为粉色，10%为纯白
        const rand = Math.random();
        if (rand < 0.6) {
          this.color = Math.random() > 0.5 ? colors[0] : colors[1];
        } else if (rand < 0.8) {
          this.color = colors[2];
        } else if (rand < 0.9) {
          this.color = colors[3];
        } else {
          this.color = colors[4];
        }
      }
      
      update() {
        // 闪烁效果 - 使用正弦波
        this.twinklePhase += this.twinkleSpeed;
        this.brightness = (Math.sin(this.twinklePhase) + 1) / 2;
        
        // 微小的位置抖动
        this.x += (Math.random() - 0.5) * 0.1;
        this.y += (Math.random() - 0.5) * 0.1;
        
        // 边界检查
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        if (!ctx) return;
        
        // 计算当前透明度（基于闪烁）- 降低整体透明度
        const alpha = (this.brightness * 0.5 + 0.1) * 0.7; 
        
        // 绘制光晕
        const glowSize = this.size * 3;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, glowSize
        );
        
        // 转换颜色为rgba
        gradient.addColorStop(0, this.hexToRgba(this.color, alpha * 0.8));
        gradient.addColorStop(0.5, this.hexToRgba(this.color, alpha * 0.3));
        gradient.addColorStop(1, this.hexToRgba(this.color, 0));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制核心
        ctx.fillStyle = this.hexToRgba(this.color, alpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      hexToRgba(hex: string, alpha: number): string {
        // 处理 #RRGGBB 格式
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    // 创建星星
    const stars: Star[] = [];
    const starCount = 250; // 减少星星数量，从 400 降回 250，保持沉静感
    
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }
    
    // 添加流星效果
    class ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
      
      constructor() {
        this.reset();
        this.active = false;
      }
      
      reset() {
        // 从屏幕边缘开始
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.3; // 上半部分
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // 大致45度
        this.opacity = 1;
        this.active = false;
      }
      
      update() {
        if (!this.active) return;
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.01;
        
        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
          this.reset();
        }
      }
      
      draw() {
        if (!this.active || !ctx) return;
        
        const gradient = ctx.createLinearGradient(
          this.x, this.y,
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(0.3, `rgba(135, 206, 250, ${this.opacity * 0.6})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.length,
          this.y - Math.sin(this.angle) * this.length
        );
        ctx.stroke();
      }
      
      trigger() {
        this.active = true;
        this.opacity = 1;
      }
    }
    
    // 创建流星
    const shootingStars: ShootingStar[] = [];
    const shootingStarCount = 3;
    
    for (let i = 0; i < shootingStarCount; i++) {
      shootingStars.push(new ShootingStar());
    }
    
    // 随机触发流星
    const triggerShootingStar = () => {
      const inactiveStar = shootingStars.find(s => !s.active);
      if (inactiveStar) {
        inactiveStar.trigger();
      }
      
      // 随机3-8秒后再次触发（原来是5-15秒）
      setTimeout(triggerShootingStar, Math.random() * 5000 + 3000);
    };
    
    // 首次触发
    setTimeout(triggerShootingStar, Math.random() * 2000 + 1000);
    
    // 动画循环
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制星星
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      
      // 更新和绘制流星
      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    // 窗口大小改变
    const handleResize = () => {
      setCanvasSize();
      // 重新定位星星
      stars.forEach(star => {
        if (star.x > canvas.width) star.x = canvas.width;
        if (star.y > canvas.height) star.y = canvas.height;
      });
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
      style={{ zIndex: 2 }}
    />
  );
}