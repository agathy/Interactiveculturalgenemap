// 节点装饰动画组件 - 为一级节点添加围绕自身旋转的装饰光圈 + 呼吸脉动效果
// 装饰环只围绕自身中心自转，不公转；自转速度由面板"旋转速度"滑杆控制
// 呼吸效果（大小脉动、投影闪烁、明暗变化）完全在 Canvas 层绘制，
// 不调用 chartInstance.setOption()，力导向布局零干扰

import { useEffect, useRef } from 'react';

interface BreathingNodesProps {
  fenjiu_colors: any;
  colors: any;
  chartInstance?: any;
  l1Radius: number;
  /** 装饰环自转速度系数（0~1），由面板"旋转速度"滑杆传入 */
  decorSpinSpeed?: number;
  /** 呼吸频率系数，由面板"呼吸频率"滑杆传入 */
  breathFrequency?: number;
  /** 一级节点 symbolSize（px），用于绘制呼吸脉动圆盘 */
  l1NodeSize?: number;
}

export function BreathingNodes({
  fenjiu_colors, colors, chartInstance, l1Radius,
  decorSpinSpeed = 0.34,
  breathFrequency = 0.160,
  l1NodeSize = 145
}: BreathingNodesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const l1RadiusRef = useRef(l1Radius);
  const colorsRef = useRef(colors);
  const fenjiuRef = useRef(fenjiu_colors);
  const spinSpeedRef = useRef(decorSpinSpeed);
  const breathFreqRef = useRef(breathFrequency);
  const l1NodeSizeRef = useRef(l1NodeSize);

  useEffect(() => { l1RadiusRef.current = l1Radius; }, [l1Radius]);
  useEffect(() => { colorsRef.current = colors; }, [colors]);
  useEffect(() => { fenjiuRef.current = fenjiu_colors; }, [fenjiu_colors]);
  useEffect(() => { spinSpeedRef.current = decorSpinSpeed; }, [decorSpinSpeed]);
  useEffect(() => { breathFreqRef.current = breathFrequency; }, [breathFrequency]);
  useEffect(() => { l1NodeSizeRef.current = l1NodeSize; }, [l1NodeSize]);

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

    const centerX = 500;
    const centerY = 375;

    const l1BaseAngles: Record<string, number> = {
      genzhu: -90,
      zhongyi: -18,
      shanhe: 54,
      gujian: 126,
      jiuhun: 198
    };

    const cultureKeys: Record<string, string> = {
      genzhu: '根祖文化',
      zhongyi: '忠义文化',
      shanhe: '山河文化',
      gujian: '古建文化',
      jiuhun: '酒魂文化'
    };

    // 每个节点的自转方向倍率（正/负决定方向，绝对值决定相对速度差异）
    const spinDirections: Record<string, number> = {
      root: 0.4,
      genzhu: 1.0,
      zhongyi: -0.75,
      shanhe: 0.9,
      gujian: -1.1,
      jiuhun: 0.65
    };

    // 呼吸相位偏移（让5个节点呼吸错开，视觉更自然）
    const breathOffsets: Record<string, number> = {
      root: 0,
      genzhu: 0,
      zhongyi: Math.PI * 0.4,
      shanhe: Math.PI * 0.8,
      gujian: Math.PI * 1.2,
      jiuhun: Math.PI * 1.6
    };

    function hexToRgba(hex: string, alpha: number): string {
      if (!hex) return `rgba(0, 234, 255, ${alpha})`;
      if (hex.startsWith('rgba')) return hex.replace(/[\d.]+\)$/, `${alpha})`);
      if (hex.startsWith('rgb')) return hex.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function getScreenPos(graphX: number, graphY: number): { x: number; y: number; zoom: number } | null {
      if (!chartInstance || chartInstance.isDisposed()) return null;
      try {
        const pos = chartInstance.convertToPixel({ seriesIndex: 0 }, [graphX, graphY]);
        const option = chartInstance.getOption();
        const zoom = (option?.series?.[0]?.zoom) || 1;
        if (pos) return { x: pos[0], y: pos[1], zoom };
      } catch (e) { /* ignore */ }
      return null;
    }

    // ===== 绘制 L1 节点呼吸脉动效果（圆盘 + 投影 + 明暗）=====
    function drawBreathingDisc(
      x: number, y: number, baseNodeSize: number, color: string,
      scaleFactor: number, breathVal: number
    ) {
      if (!ctx) return;

      ctx.save();
      ctx.translate(x, y);

      // breathVal: 0~1，0=最小/最暗，1=最大/最亮
      // 脉动半径：节点半径的 92%~108%
      const nodeRadius = (baseNodeSize / 2) * scaleFactor;
      const pulseRadius = nodeRadius * (0.92 + breathVal * 0.16);

      // 投影闪烁（外层发光）
      const shadowBlur = (30 + breathVal * 30) * scaleFactor;
      const shadowAlpha = 0.25 + breathVal * 0.35;

      // 外层辉光
      const glowGradient = ctx.createRadialGradient(0, 0, pulseRadius * 0.5, 0, 0, pulseRadius + shadowBlur);
      glowGradient.addColorStop(0, hexToRgba(color, shadowAlpha * 0.4));
      glowGradient.addColorStop(0.6, hexToRgba(color, shadowAlpha * 0.15));
      glowGradient.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(0, 0, pulseRadius + shadowBlur, 0, Math.PI * 2);
      ctx.fill();

      // 内层脉动圆盘（半透明，叠加在 ECharts 节点下方营造尺寸脉动感）
      const discAlpha = 0.08 + breathVal * 0.12; // 明暗变化
      const discGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, pulseRadius);
      discGradient.addColorStop(0, hexToRgba(color, discAlpha * 1.5));
      discGradient.addColorStop(0.7, hexToRgba(color, discAlpha));
      discGradient.addColorStop(1, hexToRgba(color, discAlpha * 0.3));
      ctx.fillStyle = discGradient;
      ctx.beginPath();
      ctx.arc(0, 0, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 绘制围绕节点自转的装饰
    function drawSpinningDecoration(
      x: number, y: number, baseSize: number, color: string,
      scaleFactor: number, spinAngle: number, breathVal: number
    ) {
      if (!ctx) return;

      ctx.save();
      ctx.translate(x, y);

      // === 1. 底层：呼吸光晕（不旋转）===
      const glowSize = baseSize * (0.9 + breathVal * 0.2) * scaleFactor;
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, hexToRgba(color, 0.12 * (0.7 + breathVal * 0.3)));
      gradient.addColorStop(0.5, hexToRgba(color, 0.04));
      gradient.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // === 2. 旋转装饰层 ===
      ctx.rotate(spinAngle);

      // 外圈旋转虚线环
      const ringR = baseSize * 1.3 * scaleFactor;
      const ringOpacity = 0.25 + breathVal * 0.15;
      ctx.strokeStyle = hexToRgba(color, ringOpacity);
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 内圈反向旋转弧段（3段，每段约100°）
      ctx.rotate(-spinAngle * 2); // 反向旋转
      const innerR = baseSize * 1.05 * scaleFactor;
      ctx.strokeStyle = hexToRgba(color, ringOpacity * 0.6);
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 3; i++) {
        const startArc = (i * Math.PI * 2) / 3;
        const endArc = startArc + Math.PI * 0.55;
        ctx.beginPath();
        ctx.arc(0, 0, innerR, startArc, endArc);
        ctx.stroke();
      }

      // 小圆点装饰（4个，分布在外圈上）
      ctx.rotate(spinAngle * 3); // 再次换一个旋转方向
      const dotR = ringR + 4 * scaleFactor;
      const dotSize = 2 * scaleFactor;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        const dx = dotR * Math.cos(a);
        const dy = dotR * Math.sin(a);
        ctx.fillStyle = hexToRgba(color, 0.5 + breathVal * 0.3);
        ctx.beginPath();
        ctx.arc(dx, dy, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // 刻度标记（8个短线段，分布在外圈外侧）
      ctx.rotate(-spinAngle * 2);
      const tickInner = ringR - 3 * scaleFactor;
      const tickOuter = ringR + 2 * scaleFactor;
      ctx.strokeStyle = hexToRgba(color, ringOpacity * 0.4);
      ctx.lineWidth = 0.5;
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(tickInner * Math.cos(a), tickInner * Math.sin(a));
        ctx.lineTo(tickOuter * Math.cos(a), tickOuter * Math.sin(a));
        ctx.stroke();
      }

      ctx.restore();
    }

    // 绘制中心节点装饰（更大、更柔和）
    function drawRootDecoration(
      x: number, y: number, scaleFactor: number, spinAngle: number, breathVal: number, color: string
    ) {
      if (!ctx) return;

      ctx.save();
      ctx.translate(x, y);

      // 底层大光晕
      const glowSize = 280 * (0.9 + breathVal * 0.15) * scaleFactor;
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
      gradient.addColorStop(0, hexToRgba(color, 0.06));
      gradient.addColorStop(0.4, hexToRgba(color, 0.02));
      gradient.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // 旋转虚线环
      ctx.rotate(spinAngle);
      const ringR = 200 * scaleFactor;
      ctx.strokeStyle = hexToRgba(color, 0.08 + breathVal * 0.04);
      ctx.lineWidth = 0.8;
      ctx.setLineDash([8, 16]);
      ctx.beginPath();
      ctx.arc(0, 0, ringR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // 弧段
      ctx.rotate(-spinAngle * 1.5);
      const arcR = 230 * scaleFactor;
      ctx.strokeStyle = hexToRgba(color, 0.06);
      ctx.lineWidth = 0.6;
      for (let i = 0; i < 4; i++) {
        const startArc = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.arc(0, 0, arcR, startArc, startArc + Math.PI * 0.3);
        ctx.stroke();
      }

      ctx.restore();
    }

    let frame = 0;
    let animationId: number;

    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentRadius = l1RadiusRef.current;
      const currentColors = colorsRef.current;
      const currentFenjiu = fenjiuRef.current;
      const speed = spinSpeedRef.current;
      const freq = breathFreqRef.current;
      const nodeSize = l1NodeSizeRef.current;

      // 累计自转角度：frame × 基础进 × 面板速度系数
      // speed=0 → 静止，speed=0.34（默认）→ 柔和自转，speed=1 → 极速
      const spinBase = frame * 0.02 * speed;

      // 呼吸时间：由面板 breathFrequency 控制
      const breathTime = frame * freq * 0.3;

      // 中心节点
      const rootPos = getScreenPos(centerX, centerY);
      if (rootPos) {
        const rootBreath = Math.sin(breathTime + breathOffsets.root) * 0.5 + 0.5;
        const rootSpin = spinBase * spinDirections.root;
        drawRootDecoration(rootPos.x, rootPos.y, rootPos.zoom, rootSpin, rootBreath, currentFenjiu.ice_blue);
      }

      // 五个一级节点 — 固定位置，装饰只绕自身中心自转 + 呼吸脉动
      Object.entries(l1BaseAngles).forEach(([id, baseAngle]) => {
        const rad = (baseAngle * Math.PI) / 180;
        const graphX = centerX + currentRadius * Math.cos(rad);
        const graphY = centerY + currentRadius * Math.sin(rad);

        const pos = getScreenPos(graphX, graphY);
        if (pos) {
          const color = currentColors[cultureKeys[id]] || '#00EAFF';
          const breathVal = Math.sin(breathTime + breathOffsets[id]) * 0.5 + 0.5;
          // 每个节点的自转角度 = 累计基础角度 × 该节点方向倍率
          const spinAngle = spinBase * spinDirections[id];

          // 先绘制呼吸脉动圆盘（在装饰环下层）
          drawBreathingDisc(pos.x, pos.y, nodeSize, color, pos.zoom, breathVal);
          // 再绘制旋转装饰
          drawSpinningDecoration(pos.x, pos.y, 80, color, pos.zoom, spinAngle, breathVal);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => { setCanvasSize(); };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [chartInstance]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 4 }}
    />
  );
}
