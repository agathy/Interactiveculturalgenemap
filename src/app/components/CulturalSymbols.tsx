// 文化符号组件：小口尖底瓮、红高粱琥珀、飞白笔触等

// 小口尖底瓮 SVG 路径（仰韶陶片）
export function getXiaoKouWengSVG() {
  return 'path://M 50,10 Q 45,15 45,25 L 40,60 Q 40,75 50,80 Q 60,75 60,60 L 55,25 Q 55,15 50,10 M 47,12 Q 50,8 53,12';
}

// 红高粱琥珀 SVG 路径（晶莹剔透的琥珀形状）
export function getAmberSVG() {
  return 'path://M 50,15 Q 60,20 65,35 Q 68,50 65,65 Q 60,80 50,85 Q 40,80 35,65 Q 32,50 35,35 Q 40,20 50,15 Z M 45,25 Q 43,28 44,32 M 58,40 Q 60,42 59,46';
}

// 生成节点涟漪效果的Canvas动画
export class RippleEffect {
  private ripples: Array<{
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    opacity: number;
    color: string;
  }> = [];

  addRipple(x: number, y: number, color: string = '#87CEFA') {
    this.ripples.push({
      x,
      y,
      radius: 0,
      maxRadius: 80,
      opacity: 0.8,
      color
    });
  }

  update() {
    this.ripples = this.ripples.filter(ripple => {
      // 更新涟漪
      ripple.radius += 2;
      ripple.opacity -= 0.015;
      return ripple.opacity > 0;
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.ripples.forEach(ripple => {
      // 绘制涟漪（三圈同心圆）
      for (let i = 0; i < 3; i++) {
        const offset = i * 15;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius + offset, 0, Math.PI * 2);
        ctx.strokeStyle = `${ripple.color}${Math.floor(ripple.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2 - i * 0.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ripple.color;
        ctx.stroke();
      }
    });
  }

  hasRipples() {
    return this.ripples.length > 0;
  }
}

// 飞白笔触路径生成器
export function generateFeibaiPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  points: number = 20
): string {
  const path: string[] = [];
  
  // 起笔锋芒（书法起笔效果）
  const startAngle = Math.atan2(endY - startY, endX - startX);
  const startFengX1 = startX + Math.cos(startAngle - Math.PI / 4) * 5;
  const startFengY1 = startY + Math.sin(startAngle - Math.PI / 4) * 5;
  const startFengX2 = startX + Math.cos(startAngle + Math.PI / 4) * 5;
  const startFengY2 = startY + Math.sin(startAngle + Math.PI / 4) * 5;
  
  path.push(`M ${startFengX1},${startFengY1}`);
  path.push(`L ${startX},${startY}`);
  path.push(`L ${startFengX2},${startFengY2}`);
  path.push(`M ${startX},${startY}`);

  // 中间笔画（带随机飞白断续效果）
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    
    // 添加随机偏移模拟笔触自然感
    const offsetX = (Math.random() - 0.5) * 3;
    const offsetY = (Math.random() - 0.5) * 3;
    
    // 飞白效果：随机断续
    if (Math.random() > 0.15) {  // 85%的点连接，15%断开
      if (i === 0) {
        path.push(`M ${x + offsetX},${y + offsetY}`);
      } else {
        path.push(`L ${x + offsetX},${y + offsetY}`);
      }
    } else {
      // 断笔，下一个点重新起笔
      if (i < points) {
        const nextT = (i + 1) / points;
        const nextX = startX + (endX - startX) * nextT;
        const nextY = startY + (endY - startY) * nextT;
        path.push(`M ${nextX},${nextY}`);
      }
    }
  }

  // 收笔锋芒
  const endAngle = Math.atan2(endY - startY, endX - startX);
  const endFengX1 = endX + Math.cos(endAngle - Math.PI / 6) * 6;
  const endFengY1 = endY + Math.sin(endAngle - Math.PI / 6) * 6;
  const endFengX2 = endX + Math.cos(endAngle + Math.PI / 6) * 6;
  const endFengY2 = endY + Math.sin(endAngle + Math.PI / 6) * 6;
  
  path.push(`L ${endX},${endY}`);
  path.push(`L ${endFengX1},${endFengY1}`);
  path.push(`M ${endX},${endY}`);
  path.push(`L ${endFengX2},${endFengY2}`);

  return path.join(' ');
}

// 汾酒挂杯效果路径生成器（Tears of Wine）
export function generateTearsOfWinePath(
  width: number,
  baseHeight: number,
  tearCount: number = 8
): string {
  const path: string[] = [];
  const segmentWidth = width / tearCount;
  
  path.push(`M 0,${baseHeight}`);

  for (let i = 0; i < tearCount; i++) {
    const x1 = i * segmentWidth;
    const x2 = (i + 0.5) * segmentWidth;
    const x3 = (i + 1) * segmentWidth;
    
    // 每个"泪滴"的下垂高度随机
    const tearDepth = 5 + Math.random() * 15;
    const y2 = baseHeight + tearDepth;
    
    // 使用贝塞尔曲线创建圆润的泪滴形状
    path.push(`Q ${x2},${y2} ${x3},${baseHeight}`);
  }

  return path.join(' ');
}

// 流光效果动画（光芒在墨迹中穿梭）
export class FlowingLightEffect {
  private progress: number = 0;
  private speed: number = 0.01;
  
  constructor(speed: number = 0.01) {
    this.speed = speed;
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) {
      this.progress = 0;
    }
  }

  getGradient(
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    color: string = '#87CEFA'
  ) {
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    
    const lightPos = this.progress;
    const lightWidth = 0.15;
    
    // 基础墨色
    gradient.addColorStop(0, `${color}40`);
    
    // 流光前方渐暗
    if (lightPos - lightWidth > 0) {
      gradient.addColorStop(lightPos - lightWidth, `${color}40`);
    }
    
    // 流光中心
    gradient.addColorStop(lightPos, `${color}FF`);
    
    // 流光后方渐暗
    if (lightPos + lightWidth < 1) {
      gradient.addColorStop(lightPos + lightWidth, `${color}40`);
    }
    
    gradient.addColorStop(1, `${color}40`);
    
    return gradient;
  }
}

// Canvas绘制飞白笔触
export function drawFeibaiStroke(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string = '#87CEFA',
  width: number = 3
) {
  const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
  const steps = Math.floor(distance / 5);
  
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  // 起笔锋芒
  const angle = Math.atan2(endY - startY, endX - startX);
  ctx.beginPath();
  ctx.moveTo(
    startX + Math.cos(angle - Math.PI / 4) * 5,
    startY + Math.sin(angle - Math.PI / 4) * 5
  );
  ctx.lineTo(startX, startY);
  ctx.lineTo(
    startX + Math.cos(angle + Math.PI / 4) * 5,
    startY + Math.sin(angle + Math.PI / 4) * 5
  );
  ctx.stroke();
  
  // 主笔画（飞白效果）
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = startX + (endX - startX) * t;
    const y = startY + (endY - startY) * t;
    
    // 随机飞白断续
    if (Math.random() > 0.12) {
      ctx.lineTo(
        x + (Math.random() - 0.5) * 2,
        y + (Math.random() - 0.5) * 2
      );
    } else {
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }
  
  ctx.lineTo(endX, endY);
  ctx.stroke();
  
  // 收笔锋芒
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX + Math.cos(angle - Math.PI / 6) * 6,
    endY + Math.sin(angle - Math.PI / 6) * 6
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX + Math.cos(angle + Math.PI / 6) * 6,
    endY + Math.sin(angle + Math.PI / 6) * 6
  );
  ctx.stroke();
}