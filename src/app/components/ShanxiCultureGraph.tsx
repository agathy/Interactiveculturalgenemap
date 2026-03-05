import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { ChevronLeft, ChevronRight, Save, RotateCcw, LayoutGrid, FolderOpen, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { RippleEffect } from './CulturalSymbols';
import { getOptimizedNodes } from './OptimizedNodes';
import { DEFAULT_GRAPH_DATA, generateLinksFromData, generateCategoriesFromData, validateGraphData, buildTimeRangeMap, type GraphData } from './graphData';
import { loadRegionMap, getSupportedRegions, isRegionSupported } from '../../services/mapService';

// Helper: convert hex color to rgba string
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,234,255,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

import { Timeline } from './Timeline';
import { DataStats } from './DataStats';
import { OrbitRings } from './OrbitRings';
import { BrickPattern } from './BrickPattern';
import { LatticeGrid } from './LatticeGrid';
import { AnimatedBackground } from './AnimatedBackground';
import { StarField } from './StarField';
import { BreathingNodes } from './BreathingNodes';
import svgPaths from '../../imports/svg-bziglz2xr9';

// 从 localStorage 同步读取已保存配置（组件初始化前调用，避免闪烁）
function loadSavedConfig(): Record<string, any> | null {
  try {
    const saved = localStorage.getItem('shanxi_culture_graph_config');
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return null;
}
const _saved = loadSavedConfig();

export default function ShanxiCultureGraph() {
  const chartRef = useRef<any>(null);
  const [chartReady, setChartReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapSVGPath, setMapSVGPath] = useState<string>('');
  const [showPanels, setShowPanels] = useState(false);
  const [bgColor, setBgColor] = useState(_saved?.bgColor ?? '#020b22');
  const [timelineColor, setTimelineColor] = useState(_saved?.timelineColor ?? '#22d3ee');
  const rippleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rippleEffectRef = useRef<RippleEffect | null>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const viewStateRef = useRef({ zoom: 1, center: [500, 375] as [number, number] });

  const [focusedTimeRange, setFocusedTimeRange] = useState<[number, number] | null>(null);

  // 监听缩放和平移，实时记录视图状态
  useEffect(() => {
    if (!chartInstance) return;
    
    const handleRoam = () => {
      const opt = chartInstance.getOption();
      if (opt.series && opt.series[0]) {
        viewStateRef.current = {
          zoom: opt.series[0].zoom || 1,
          center: opt.series[0].center || [500, 375]
        };
      }
    };

    chartInstance.on('graphroam', handleRoam);
    return () => {
      chartInstance.off('graphroam', handleRoam);
    };
  }, [chartInstance]);

  // 汾酒主题配色板（The Fenjiu Palette）
  // useMemo 保证对象引用稳定，防止每次渲染产生新引用 → 级联 useMemo 全部失效 → ECharts 反复调用 setOption → 重复节点错误
  const fenjiu_colors = useMemo(() => ({
    // 主视觉基调
    background: bgColor,
    
    // 清香灵魂色（琉璃冰蓝/汾河清波）
    ice_blue_light: '#E0FFFF',
    ice_blue: '#87CEFA',
    ice_blue_dark: '#5DADE2',
    
    // 匠心工艺色
    terracotta_red: '#CD5C5C',  // 陶土赭
    amber_gold: '#DAA520',      // 高粱琥珀金
    
    // 文化点缀色
    apricot_pink: '#FFC0CB'  // 杏花微雨粉
  }), [bgColor]);

  // 定义12色标题颜色库（支持最多12个分类）
  // 注意：前5个是五大文化基因的固定配色，新增分类从第6个开始使用
  const defaultColorLibrary = [
    '#DAA520',      // 1. 高粱琥珀金 (根祖文化)
    '#CD5C5C',      // 2. 陶土赭 (忠义文化)
    '#87CEFA',      // 3. 冰蓝 (山河文化)
    '#A0826D',      // 4. 古木棕 (古建文化)
    '#20B2AA',      // 5. 汾酒青 (酒魂文化)
    '#C0C0C0',      // 6. 银灰 (中性色，作为缓冲)
    '#4A8FD4',      // 7. 靛青 (比 #87CEFA 更深的蓝，增加层次对比)
    '#68B08C',      // 8. 松石绿 (自然色系，与 #20B2AA 相邻但偏黄绿)
    '#9B7EC8',      // 9. 紫韵 (填补紫色维度，与 #87CEFA 冷色系呼应)
    '#E07840',      // 10. 琉璃橙 (暖色过渡，介于金 #DAA520 与红 #CD5C5C 之间)
    '#82a0ef',      // 11. 淡紫蓝
    '#7ECECE',      // 12. 碧水
  ];

  const [colorLibrary, setColorLibrary] = useState(_saved?.colorLibrary ?? defaultColorLibrary);

  // 定义五大文化基因的初始配色（兼容旧数据）
  const initialCultureColors = {
    '根祖文化': fenjiu_colors.amber_gold,      
    '忠义文化': fenjiu_colors.terracotta_red,  
    '山河文化': fenjiu_colors.ice_blue,        
    '古建文化': '#A0826D',                      
    '酒魂文化': '#20B2AA'                       
  };

  // 定义五大文化基因的颜色状态
  const [cultureColors, setCultureColors] = useState(_saved?.cultureColors ?? initialCultureColors);

  // 自定义节点形状状态
  const [customSymbols, setCustomSymbols] = useState<Record<string, string>>({});
  const [rawImages, setRawImages] = useState<Record<string, { file: File, color: string }>>({});

  // 节点大小状态
  const [nodeSizes, setNodeSizes] = useState(_saved?.nodeSizes ?? {
    root: 550,
    l1: 145,
    l2: 40,
    l3: 20
  });

  // 描边显隐状态
  const [nodeBorders, setNodeBorders] = useState(_saved?.nodeBorders ?? {
    root: false,
    l1: true,
    l2: false,
    l3: true
  });

  // 一级节点轨道半径状态
  const [l1Radius, setL1Radius] = useState(_saved?.l1Radius ?? 345);

  // 环形时间轴半径状态
  const [timelineRadius, setTimelineRadius] = useState(_saved?.timelineRadius ?? 275);

  // 新增：中心节点视觉参数
  const [rootColor, setRootColor] = useState(_saved?.rootColor ?? '#00EAFF');
  const [rootTitleFontSize, setRootTitleFontSize] = useState(_saved?.rootTitleFontSize ?? 32);
  const [rootGlowIntensity, setRootGlowIntensity] = useState(_saved?.rootGlowIntensity ?? 3);
  const [showRootLabels, setShowRootLabels] = useState(_saved?.showRootLabels ?? false);
  const [rootShadowColor, setRootShadowColor] = useState(_saved?.rootShadowColor ?? '#082f6d');
  const [rootTitleShadowColor, setRootTitleShadowColor] = useState(_saved?.rootTitleShadowColor ?? '#94e3fe');

  // 装饰环自转速度（面板"旋转速度"滑杆控制），呼吸频率系数（控制节点本体缩放+投影闪烁）
  const [rotationSpeed, setRotationSpeed] = useState(_saved?.rotationSpeed ?? 0.34);
  const [breathFrequency, setBreathFrequency] = useState(_saved?.breathFrequency ?? 0.160);

  // 装饰圆盘半径偏移量
  const [decorRadius, setDecorRadius] = useState(_saved?.decorRadius ?? 4);

  // 图谱节点数据（支持上传替换）
  const [graphData, setGraphData] = useState<GraphData>(DEFAULT_GRAPH_DATA);
  const graphDataFileRef = useRef<HTMLInputElement>(null);

  // 显示中心文字开关
  const [showCenterText, setShowCenterText] = useState(_saved?.showCenterText ?? true);

  // 获取节点对应的配色（支持12色自动分配）
  const getColorForNodeId = (id: string, categoryIndex?: number): string => {
    if (id === 'root') return rootColor;
    
    // 如果是已知的五大文化基因，使用传统配色（兼容旧数据）
    if (id.startsWith('genzhu') || id.startsWith('gz-')) return cultureColors['根祖文化'];
    if (id.startsWith('zhongyi') || id.startsWith('zy-')) return cultureColors['忠义文化'];
    if (id.startsWith('shanhe') || id.startsWith('sh-')) return cultureColors['山河文化'];
    if (id.startsWith('gujian') || id.startsWith('gj-')) return cultureColors['古建文化'];
    if (id.startsWith('jiuhun') || id.startsWith('jh-')) return cultureColors['酒魂文化'];
    
    // 对于新分类，根据索引从颜色库中分配颜色
    if (categoryIndex !== undefined && categoryIndex >= 0 && categoryIndex < colorLibrary.length) {
      return colorLibrary[categoryIndex];
    }
    
    return '#00EAFF';
  };

  // 处理图片裁切为圆形并根据设置增加描边
  const processCircularImage = async (file: File, color: string, showBorder: boolean = true): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // 统一输出尺寸，避免过大导致性能问题
          const targetSize = 512;
          const sourceSize = Math.min(img.width, img.height);
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(`image://${e.target?.result}`);
            return;
          }

          ctx.clearRect(0, 0, targetSize, targetSize);

          // 绘制圆形剪裁区域
          ctx.save();
          ctx.beginPath();
          ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2 - 10, 0, Math.PI * 2);
          ctx.clip();

          // 居中绘制并缩放图片
          const offsetX = (img.width - sourceSize) / 2;
          const offsetY = (img.height - sourceSize) / 2;
          ctx.drawImage(img, offsetX, offsetY, sourceSize, sourceSize, 0, 0, targetSize, targetSize);
          ctx.restore();

          // 始终绘制投影 (外发光)
          ctx.save();
          ctx.beginPath();
          ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2 - 12, 0, Math.PI * 2);
          
          // 投影参数
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
          
          if (showBorder) {
            // 绘制可见描边
            ctx.strokeStyle = color;
            ctx.lineWidth = 12;
            ctx.stroke();
          } else {
            // 绘制几乎透明的极其微细描边，仅为了承载投影效果
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.01)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
          ctx.restore();

          resolve(`image://${canvas.toDataURL('image/png')}`);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // 节点 ID 映射表（文件名关键字 → 节点ID）
  const nodeIdMapping: Record<string, string> = {
    '山西': 'root', '地图': 'root', '核心': 'root', 'root': 'root',
    '根祖': 'genzhu', 'genzhu': 'genzhu',
    '忠义': 'zhongyi', 'zhongyi': 'zhongyi',
    '山河': 'shanhe', 'shanhe': 'shanhe',
    '古建': 'gujian', 'gujian': 'gujian',
    '酒魂': 'jiuhun', 'jiuhun': 'jiuhun',
    // 二级节点映射
    '祭祀': 'genzhu-1', '建筑': 'genzhu-2', '礼制': 'genzhu-3', '民俗': 'genzhu-4',
    '人物': 'zhongyi-1', '商道': 'zhongyi-2', '信仰': 'zhongyi-3', '家训': 'zhongyi-4',
    '河流': 'shanhe-1', '山脉': 'shanhe-2', '关隘': 'shanhe-3', '盆地': 'shanhe-4',
    '木构': 'gujian-1', '彩塑': 'gujian-2', '石窟': 'gujian-3', '城池': 'gujian-4',
    '考古': 'jiuhun-1', '技艺': 'jiuhun-2', '文学': 'jiuhun-3', '荣耀': 'jiuhun-4',
  };

  // 从文件匹配节点 ID（支持文件名和路径中的关键字匹配）
  const matchFileToNodeId = (file: File): string => {
    const fileName = file.name.split('.')[0];
    // 也检查 webkitRelativePath（文件夹上传时包含子目录路径）
    const relativePath = (file as any).webkitRelativePath || '';
    const searchText = `${fileName} ${relativePath}`;

    for (const [key, id] of Object.entries(nodeIdMapping)) {
      if (searchText.includes(key) || fileName.toLowerCase() === key.toLowerCase()) {
        return id;
      }
    }
    return '';
  };

  // 处理批量上传（多选文件或文件夹）
  const handleBatchUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // 过滤出图片文件
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      toast.error('未找到图片文件');
      return;
    }

    let matchedCount = 0;
    const matchedNames: string[] = [];

    for (const file of imageFiles) {
      const matchedId = matchFileToNodeId(file);
      if (matchedId) {
        const color = getColorForNodeId(matchedId);
        setRawImages(prev => ({ ...prev, [matchedId]: { file, color } }));
        matchedCount++;
        matchedNames.push(file.name);
      }
    }

    if (matchedCount > 0) {
      toast.success(`成功匹配 ${matchedCount} 个图标`, {
        description: matchedNames.length <= 4
          ? matchedNames.join('、')
          : `${matchedNames.slice(0, 3).join('、')} 等 ${matchedNames.length} 个文件`
      });
    } else {
      toast.warning(`扫描了 ${imageFiles.length} 张图片，未匹配到节点`, {
        description: '请确保文件名包含节点关键字（如"根祖"、"酒魂"等）'
      });
    }
  };

  // 处理单个文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, nodeId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const color = getColorForNodeId(nodeId);
    setRawImages(prev => ({ ...prev, [nodeId]: { file, color } }));
  };

  // 重置所有调节项
  const resetAdjustments = () => {
    setBgColor('#020b22');
    setCultureColors(initialCultureColors);
    setColorLibrary(defaultColorLibrary);
    setCustomSymbols({});
    setRawImages({});
    setShowCenterText(true);
    setShowRootLabels(false);
    setRootColor('#00EAFF');
    setRootTitleFontSize(32);
    setRootGlowIntensity(15);
    setRootShadowColor('#082f6d');
    setL1Radius(345);
    setTimelineRadius(275);
    setRotationSpeed(0.34);
    setBreathFrequency(0.160);
    setDecorRadius(4);
    setNodeSizes({
      root: 550,
      l1: 145,
      l2: 40,
      l3: 20
    });
    localStorage.removeItem('shanxi_culture_graph_config');
    toast.info('配置已重置为初始状态', {
      style: { background: 'rgba(0, 0, 0, 0.8)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.1)' }
    });
  };

  // 隐藏的配置文件上传 input
  const configFileRef = useRef<HTMLInputElement>(null);

  // 导出配置为 JSON 文件
  const exportConfig = () => {
    const config = {
      _version: 1,
      _exportedAt: new Date().toISOString(),
      bgColor,
      cultureColors,
      colorLibrary,
      nodeSizes,
      nodeBorders,
      l1Radius,
      timelineRadius,
      rootColor,
      rootTitleFontSize,
      rootGlowIntensity,
      rootShadowColor,
      rootTitleShadowColor,
      showRootLabels,
      showCenterText,
      rotationSpeed,
      breathFrequency,
      decorRadius
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shanxi-culture-config-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('配置已导出', {
      style: { background: 'rgba(0, 0, 0, 0.8)', color: '#00EAFF', border: '1px solid rgba(0, 234, 255, 0.2)' }
    });
  };

  // 导入配置 JSON 文件
  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const config = JSON.parse(ev.target?.result as string);
        if (config.bgColor) setBgColor(config.bgColor);
        if (config.cultureColors) setCultureColors(config.cultureColors);
        if (config.colorLibrary) setColorLibrary(config.colorLibrary);
        if (config.nodeSizes) setNodeSizes(config.nodeSizes);
        if (config.nodeBorders) setNodeBorders(config.nodeBorders);
        if (config.l1Radius !== undefined) setL1Radius(config.l1Radius);
        if (config.timelineRadius !== undefined) setTimelineRadius(config.timelineRadius);
        if (config.rootColor) setRootColor(config.rootColor);
        if (config.rootTitleFontSize !== undefined) setRootTitleFontSize(config.rootTitleFontSize);
        if (config.rootGlowIntensity !== undefined) setRootGlowIntensity(config.rootGlowIntensity);
        if (config.rootShadowColor) setRootShadowColor(config.rootShadowColor);
        if (config.rootTitleShadowColor) setRootTitleShadowColor(config.rootTitleShadowColor);
        if (config.showRootLabels !== undefined) setShowRootLabels(config.showRootLabels);
        if (config.showCenterText !== undefined) setShowCenterText(config.showCenterText);
        if (config.rotationSpeed !== undefined) setRotationSpeed(config.rotationSpeed);
        if (config.breathFrequency !== undefined) setBreathFrequency(config.breathFrequency);
        if (config.decorRadius !== undefined) setDecorRadius(config.decorRadius);
        toast.success('配置已导入并应用', {
          style: { background: 'rgba(0, 0, 0, 0.8)', color: '#00EAFF', border: '1px solid rgba(0, 234, 255, 0.2)' }
        });
      } catch {
        toast.error('配置文件格式无效，请检查 JSON 格式', {
          style: { background: 'rgba(0, 0, 0, 0.8)', color: '#ff6b6b', border: '1px solid rgba(255, 107, 107, 0.2)' }
        });
      }
    };
    reader.readAsText(file);
    // 重置 input 值，允许重复上传同一文件
    e.target.value = '';
  };

  // 导出图谱节点数据为 JSON 文件
  const exportGraphData = () => {
    const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shanxi-graph-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('图谱节点数据已导出', {
      style: { background: 'rgba(0, 0, 0, 0.8)', color: '#00EAFF', border: '1px solid rgba(0, 234, 255, 0.2)' }
    });
  };

  // 导入图谱节点数据 JSON 文件
  const importGraphData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const result = validateGraphData(data);
        if (!result.valid) {
          toast.error(`图谱数据校验失败：${result.error}`, {
            style: { background: 'rgba(0, 0, 0, 0.8)', color: '#ff6b6b', border: '1px solid rgba(255, 107, 107, 0.2)' }
          });
          return;
        }
        setGraphData(data as GraphData);
        
        // 根据新数据更新 cultureColors，为每个分类分配颜色
        // 使用 defaultColorLibrary 确保使用最新的颜色配置
        const newCultureColors: Record<string, string> = {};
        data.categories.forEach((cat: any, index: number) => {
          // 如果是已知的五大文化基因，使用传统配色
          if (cat.name === '根祖文化') {
            newCultureColors[cat.name] = initialCultureColors['根祖文化'];
          } else if (cat.name === '忠义文化') {
            newCultureColors[cat.name] = initialCultureColors['忠义文化'];
          } else if (cat.name === '山河文化') {
            newCultureColors[cat.name] = initialCultureColors['山河文化'];
          } else if (cat.name === '古建文化') {
            newCultureColors[cat.name] = initialCultureColors['古建文化'];
          } else if (cat.name === '酒魂文化') {
            newCultureColors[cat.name] = initialCultureColors['酒魂文化'];
          } else {
            // 新分类从默认颜色库中分配颜色（使用最新的颜色配置）
            newCultureColors[cat.name] = defaultColorLibrary[index % defaultColorLibrary.length];
          }
        });
        setCultureColors(newCultureColors);
        
        // 同时更新 colorLibrary 为最新的默认颜色库
        setColorLibrary(defaultColorLibrary);
        
        // 统计节点数
        let totalNodes = 1; // root
        data.categories.forEach((cat: any) => {
          totalNodes += 1; // L1
          totalNodes += cat.children.length; // L2
          cat.children.forEach((l2: any) => {
            totalNodes += (l2.children?.length || 0); // L3
          });
        });
        toast.success(`图谱数据已导入：${data.categories.length} 个分类，${totalNodes} 个节点`, {
          style: { background: 'rgba(0, 0, 0, 0.8)', color: '#00EAFF', border: '1px solid rgba(0, 234, 255, 0.2)' }
        });
      } catch {
        toast.error('图谱数据文件格式无效，请检查 JSON 格式', {
          style: { background: 'rgba(0, 0, 0, 0.8)', color: '#ff6b6b', border: '1px solid rgba(255, 107, 107, 0.2)' }
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 重置图谱数据为默认
  const resetGraphData = () => {
    setGraphData(DEFAULT_GRAPH_DATA);
    toast.info('图谱节点数据已重置为默认', {
      style: { background: 'rgba(0, 0, 0, 0.8)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.1)' }
    });
  };

  // 保存当前配置为默认
  const saveAsDefault = () => {
    const config = {
      bgColor,
      cultureColors,
      nodeSizes,
      nodeBorders,
      l1Radius,
      timelineRadius,
      rootColor,
      rootTitleFontSize,
      rootGlowIntensity,
      rootShadowColor,
      showRootLabels,
      showCenterText,
      rotationSpeed,
      breathFrequency,
      decorRadius,
      timelineColor
    };
    localStorage.setItem('shanxi_culture_graph_config', JSON.stringify(config));
    toast.success('配置已保存为默认', {
      style: { background: 'rgba(0, 0, 0, 0.8)', color: '#00EAFF', border: '1px solid rgba(0, 234, 255, 0.2)' }
    });
  };

  // 自动持久化：任何参数变化时自动写入 localStorage（防抖 300ms）
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      const config = {
        bgColor, cultureColors, colorLibrary, nodeSizes, nodeBorders,
        l1Radius, timelineRadius, rootColor, rootTitleFontSize,
        rootGlowIntensity, rootShadowColor, rootTitleShadowColor, showRootLabels,
        showCenterText, rotationSpeed, breathFrequency, decorRadius,
        timelineColor
      };
      localStorage.setItem('shanxi_culture_graph_config', JSON.stringify(config));
    }, 300);
    return () => clearTimeout(autoSaveTimerRef.current);
  }, [bgColor, cultureColors, colorLibrary, nodeSizes, nodeBorders, l1Radius, timelineRadius, rootColor, rootTitleFontSize, rootGlowIntensity, rootShadowColor, rootTitleShadowColor, showRootLabels, showCenterText, rotationSpeed, breathFrequency, decorRadius, timelineColor]);

  // 根据数据中的 region 动态加载地图
  useEffect(() => {
    setMapSVGPath(''); // 清除旧地区路径，避免新地区加载期间显示错误形状
    const loadMap = async () => {
      try {
        const regionCode = graphData.root.region || 'shanxi';
        const mapData = await loadRegionMap(regionCode);
        if (mapData && mapData.geoJson) {
          echarts.registerMap(regionCode, mapData.geoJson);
          setMapLoaded(true);
          // 存储 SVG 路径，用于中心节点 symbol
          if (mapData.symbolPath) {
            setMapSVGPath(mapData.symbolPath);
          }
        }
        setTimeout(() => {
          setChartReady(true);
        }, 100);
      } catch (error) {
        console.error('Failed to load map:', error);
        setTimeout(() => {
          setChartReady(true);
        }, 100);
      }
    };
    loadMap();
  }, [graphData.root.region]);

  // 获取当前地区的地图 symbol（优先 path://，次选 map://，兜底圆形）
  const getRegionMapSVG = useCallback(() => {
    if (customSymbols['root']) return customSymbols['root'];
    if (mapSVGPath) return `path://${mapSVGPath}`;
    const regionCode = graphData.root.region || 'shanxi';
    // map:// 仅供兜底参考（ECharts graph 并不真正支持，会回退为圆形）
    return `map://${regionCode}`;
  }, [customSymbols, mapSVGPath, graphData.root.region]);

  // 构建节点数据（纯静态，不含呼吸动画）
  // 使用 useMemo 缓存节点数据，防止频繁重渲染导致 ECharts 内部状态异常
  const nodes = useMemo(() => getOptimizedNodes(
    fenjiu_colors,
    cultureColors,
    getRegionMapSVG,
    nodeSizes,
    customSymbols,
    l1Radius,
    {
      showRootLabels,
      rootTitleFontSize,
      rootColor,
      rootGlowIntensity,
      rootShadowColor,
      rootTitleShadowColor,
      nodeBorders
    },
    graphData,
    colorLibrary
  ), [fenjiu_colors, cultureColors, getRegionMapSVG, nodeSizes, customSymbols, l1Radius, showRootLabels, rootTitleFontSize, rootColor, rootGlowIntensity, rootShadowColor, rootTitleShadowColor, nodeBorders, graphData, colorLibrary]);

  // 呼吸动画已完全移至 BreathingNodes Canvas 叠加层
  // 不再调用 chartInstance.setOption()，力导向布局零干扰

  // 核心逻辑：根据当前描边开关和颜色，重新处理自定义节点图标
  useEffect(() => {
    const processAll = async () => {
      const newSymbols: Record<string, string> = {};
      for (const [id, data] of Object.entries(rawImages)) {
        // 使用当前最新的颜色配置
        const currentColor = getColorForNodeId(id);
        
        // 精确判定节点层级
        let showBorder = true;
        if (id === 'root') {
          showBorder = nodeBorders.root;
        } else if (['genzhu', 'zhongyi', 'shanhe', 'gujian', 'jiuhun'].includes(id)) {
          showBorder = nodeBorders.l1;
        } else if (id.includes('-')) {
          const parts = id.split('-');
          if (parts.length === 2) showBorder = nodeBorders.l2;
          else if (parts.length === 3) showBorder = nodeBorders.l3;
        }

        if (data.file.type === 'image/svg+xml') {
          const symbol = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const content = event.target?.result as string;
              const pathMatch = content.match(/<path[^>]*d="([^"]*)"/);
              if (pathMatch && pathMatch[1]) {
                resolve(`path://${pathMatch[1]}`);
              } else {
                const processed = await processCircularImage(data.file, currentColor, showBorder);
                resolve(processed);
              }
            };
            reader.readAsText(data.file);
          });
          newSymbols[id] = symbol;
        } else {
          const processed = await processCircularImage(data.file, currentColor, showBorder);
          newSymbols[id] = processed;
        }
      }
      setCustomSymbols(newSymbols);
    };

    processAll();
  }, [rawImages, nodeBorders, cultureColors, rootColor, rootShadowColor]);
  // 使用 useMemo 缓存链接数据（从 graphData 动态生成）
  const links = useMemo(() => generateLinksFromData(graphData, cultureColors, fenjiu_colors, colorLibrary), [cultureColors, fenjiu_colors, graphData, colorLibrary]);
  const categories = useMemo(() => generateCategoriesFromData(graphData), [graphData]);
  // 时间范围查找表：节点 ID → [startYear, endYear]
  const timeRangeMap = useMemo(() => buildTimeRangeMap(graphData), [graphData]);
  // 使用 ref 确保 handleClick 闭包内始终读取最新的查找表
  const timeRangeMapRef = useRef(timeRangeMap);
  useEffect(() => { timeRangeMapRef.current = timeRangeMap; }, [timeRangeMap]);
  /* eslint-disable */
  const _DEAD = false && [
    { source: 'root', target: 'genzhu', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'zhongyi', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'shanhe', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'gujian', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'jiuhun', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    
    { source: 'genzhu', target: 'genzhu-1', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'genzhu', target: 'genzhu-2', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'genzhu', target: 'genzhu-3', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'genzhu', target: 'genzhu-4', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    { source: 'zhongyi', target: 'zhongyi-1', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'zhongyi', target: 'zhongyi-2', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'zhongyi', target: 'zhongyi-3', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'zhongyi', target: 'zhongyi-4', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    { source: 'shanhe', target: 'shanhe-1', lineStyle: { color: cultureColors['��河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'shanhe', target: 'shanhe-2', lineStyle: { color: cultureColors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'shanhe', target: 'shanhe-3', lineStyle: { color: cultureColors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'shanhe', target: 'shanhe-4', lineStyle: { color: cultureColors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    { source: 'gujian', target: 'gujian-1', lineStyle: { color: cultureColors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'gujian', target: 'gujian-2', lineStyle: { color: cultureColors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'gujian', target: 'gujian-3', lineStyle: { color: cultureColors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'gujian', target: 'gujian-4', lineStyle: { color: cultureColors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    { source: 'jiuhun', target: 'jiuhun-1', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'jiuhun', target: 'jiuhun-2', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'jiuhun', target: 'jiuhun-3', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'jiuhun', target: 'jiuhun-4', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    // 三级节点连线
    { source: 'genzhu-1', target: 'gz-1-1', lineStyle: { color: cultureColors['祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-1', target: 'gz-1-2', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-1', target: 'gz-1-3', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-2', target: 'gz-2-1', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-2', target: 'gz-2-2', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-2', target: 'gz-2-3', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-4', target: 'gz-4-1', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'genzhu-4', target: 'gz-4-2', lineStyle: { color: cultureColors['根祖文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },

    { source: 'zhongyi-1', target: 'zy-1-1', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-1', target: 'zy-1-2', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-1', target: 'zy-1-3', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-1', target: 'zy-1-4', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-2', target: 'zy-2-1', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-2', target: 'zy-2-2', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-2', target: 'zy-2-3', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-4', target: 'zy-4-1', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'zhongyi-4', target: 'zy-4-2', lineStyle: { color: cultureColors['忠义文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },

    { source: 'shanhe-1', target: 'sh-1-1', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-1', target: 'sh-1-2', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-1', target: 'sh-1-3', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-2', target: 'sh-2-1', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-2', target: 'sh-2-2', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-2', target: 'sh-2-3', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-2', target: 'sh-2-4', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-3', target: 'sh-3-1', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-3', target: 'sh-3-2', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'shanhe-3', target: 'sh-3-3', lineStyle: { color: cultureColors['山河文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },

    { source: 'gujian-1', target: 'gj-1-1', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-1', target: 'gj-1-2', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-1', target: 'gj-1-3', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-2', target: 'gj-2-1', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-2', target: 'gj-2-2', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-3', target: 'gj-3-1', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-3', target: 'gj-3-2', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-4', target: 'gj-4-1', lineStyle: { color: cultureColors['古建文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-4', target: 'gj-4-2', lineStyle: { color: cultureColors['古建化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'gujian-4', target: 'gj-4-3', lineStyle: { color: cultureColors['古文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },

    { source: 'jiuhun-1', target: 'jh-1-1', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-1', target: 'jh-1-2', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-2', target: 'jh-2-1', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-2', target: 'jh-2-2', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-2', target: 'jh-2-3', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-3', target: 'jh-3-1', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-3', target: 'jh-3-2', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-3', target: 'jh-3-3', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-4', target: 'jh-4-1', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-4', target: 'jh-4-2', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } },
    { source: 'jiuhun-4', target: 'jh-4-3', lineStyle: { color: cultureColors['酒魂文化'], opacity: 0.12, width: 0.4, type: 'dashed' } }
  ];
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const getOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        show: true,
        backgroundColor: 'rgba(5, 5, 8, 0.95)',
        borderColor: fenjiu_colors.ice_blue,
        borderWidth: 1,
        textStyle: { color: fenjiu_colors.ice_blue_light, fontSize: 13, lineHeight: 20 },
        padding: [15, 20],
        extraCssText: 'box-shadow: 0 8px 32px rgba(135, 206, 250, 0.3); backdrop-filter: blur(12px);'
      },
      series: [{
        type: 'graph',
        layout: 'force',
        data: nodes,
        links: links,
        categories: categories,
        roam: true,
        draggable: true,
        zoom: viewStateRef.current.zoom,
        center: viewStateRef.current.center,
        scaleLimit: { min: 0.4, max: 3 },
        force: { 
            repulsion: 1200, 
            gravity: 0.05, 
            edgeLength: [180, 280], 
            layoutAnimation: true, 
            friction: 0.8,
            center: [500, 375]
        },
        label: {
          show: true,
          position: 'bottom',
          distance: 4,
          fontFamily: 'KingHwa_OldSong, serif',
          fontSize: 13,
          color: '#fff',
          // 根节点标签使用特定字体
          fontWeight: 'normal',
          formatter: (params: any) => {
            if (!params || !params.data) return '';
            const nodeName = params.data.name;
            const symbolSize = params.data.symbolSize;
            if (params.data.id === 'root') {
              if (!showRootLabels) return '';
              const title = graphData.root.name || '';
              const subtitle = graphData.root.subtitle || '';
              return `{rootTitle|${title}}\n{rootSubtitle|${subtitle}}`;
            }
            if (symbolSize >= 70) {
              const descriptions: Record<string, string> = {
                '根祖文化': '华夏文明起源密码',
                '忠义文化': '三晋精神道德高地',
                '山河文化': '表里山河壮美气象',
                '古建文化': '中国古建博物馆',
                '酒魂文化': '华夏酒文明传承密码'
              };
              const desc = descriptions[nodeName] || '';
              return `{title|${nodeName}}\n{desc|${desc}}`;
            }
            return nodeName;
          },
          rich: {
            rootTitle: {
              fontFamily: 'root-title-font',
              fontSize: rootTitleFontSize,
              fontWeight: 'bold',
              lineHeight: rootTitleFontSize * 1.3,
              align: 'center',
              color: rootColor,
              textShadowBlur: rootGlowIntensity,
              textShadowColor: hexToRgba(rootTitleShadowColor, 0.5),
              textBorderColor: 'rgba(0,0,0,0.8)',
              textBorderWidth: 1
            },
            rootSubtitle: {
              fontFamily: 'Source Han Sans, sans-serif',
              fontSize: 14,
              fontWeight: 'normal',
              color: '#B0E2FF',
              align: 'center',
              padding: [8, 0, 0, 0],
              lineHeight: 20
            },
            title: { fontFamily: 'KingHwa_OldSong, serif', fontSize: 21, fontWeight: 'bold', color: '#fff', align: 'center', lineHeight: 28 },
            desc: { fontFamily: 'Source Han Sans, sans-serif', fontSize: 11, fontWeight: 'normal', color: 'rgba(255, 255, 255, 0.8)', align: 'center', paddingTop: 2 }
          }
        },
        lineStyle: { color: 'source', curveness: 0.2, opacity: 0.2 },
        emphasis: { 
          focus: 'none', // 修复报错：在更新数据时，focus: 'adjacency' 可能导致 getRawIndex 错误
          lineStyle: { width: 3, opacity: 0.8 } 
        }
      }]
    };
  }, [nodes, links, categories, showRootLabels, rootTitleFontSize, rootColor, rootGlowIntensity, rootShadowColor, fenjiu_colors, graphData]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const contourLines: any[] = [];
    const lineCount = 25;

    for (let i = 0; i < lineCount; i++) {
      const points: any[] = [];
      const baseY = (canvas.height / lineCount) * i;
      const amplitude = 50 + Math.random() * 80;
      const frequency = 0.002 + Math.random() * 0.003;
      const phase = Math.random() * Math.PI * 2;
      
      for (let x = 0; x < canvas.width + 100; x += 15) {
        const y = baseY + Math.sin(x * frequency + phase) * amplitude + Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude * 0.3);
        points.push({ x, y });
      }
      
      contourLines.push({
        points,
        phase,
        speed: 0.0001 + Math.random() * 0.0001,
        opacity: 0.015 + Math.random() * 0.025 
      });
    }

    let time = 0;
    function animateContours() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.3;
      contourLines.forEach(line => {
        ctx.beginPath();
        line.points.forEach((point: any, index: number) => {
          const animatedY = point.y + Math.sin(time * line.speed + point.x * 0.002) * 8;
          if (index === 0) ctx.moveTo(point.x, animatedY);
          else ctx.lineTo(point.x, animatedY);
        });
        ctx.strokeStyle = `rgba(135, 206, 250, ${line.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      requestAnimationFrame(animateContours);
    }
    animateContours();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);

  // 涟漪交互效果
  useEffect(() => {
    if (!chartInstance || chartInstance.isDisposed()) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0'; canvas.style.left = '0';
    canvas.style.width = '100%'; canvas.style.height = '100%';
    canvas.style.zIndex = '10'; canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const rippleEffect = new RippleEffect();
    rippleEffectRef.current = rippleEffect;

    let animationId: number;
    function animateRipple() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rippleEffect.update();
      rippleEffect.draw(ctx);
      animationId = requestAnimationFrame(animateRipple);
    }
    animateRipple();

    const handleClick = (params: any) => {
      if (params.componentType === 'series' && params.dataType === 'node') {
        const nodeData = params.data;
        const color = nodeData.itemStyle?.borderColor || fenjiu_colors.ice_blue;

        // 1. 触发涟漪效果
        if (params.event && params.event.event) {
          const mouseEvent = params.event.event;
          rippleEffect.addRipple(mouseEvent.clientX, mouseEvent.clientY, color);
        }

        // 3. 设置时间轴聚焦范围（从独立 ref 查找表获取，不污染 ECharts 节点数据）
        const tr = timeRangeMapRef.current[nodeData.id];
        setFocusedTimeRange(tr ?? null);

        // 2. 将点击的节点平滑移动到画面中央
        // 获取节点实时位置（针对力导向布局下的动态节点）
        let targetX = nodeData.x;
        let targetY = nodeData.y;
        
        try {
          const seriesModel = chartInstance.getModel().getSeriesByIndex(0);
          const seriesData = seriesModel.getData();
          const layout = seriesData.getItemLayout(params.dataIndex);
          if (layout) {
            targetX = layout[0];
            targetY = layout[1];
          }
        } catch (e) { /* fallback to nodeData.x/y */ }

        if (targetX !== undefined && targetY !== undefined) {
          // 获取当前中心点
          const currentCenter = viewStateRef.current.center;
          const startX = currentCenter[0];
          const startY = currentCenter[1];
          
          // 动画参数
          const duration = 800; // 动画持续时间（毫秒）
          const startTime = Date.now();
          
          // 执行平滑动画过渡
          const animateCenter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用 easeOutCubic 缓动函数
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            // 计算当前插值位置
            const currentX = startX + (targetX - startX) * easeProgress;
            const currentY = startY + (targetY - startY) * easeProgress;
            
            // 更新视图状态记录
            viewStateRef.current.center = [currentX, currentY];
            
            // 执行 ECharts 中心点切换（先确认实例未被销毁）
            if (!chartInstance.isDisposed()) {
              chartInstance.setOption({
                series: [{
                  center: [currentX, currentY],
                  zoom: viewStateRef.current.zoom
                }]
              });
            }
            
            // 继续动画或结束
            if (progress < 1) {
              requestAnimationFrame(animateCenter);
            }
          };
          
          // 启动动画
          requestAnimationFrame(animateCenter);
          
          toast.info(`已聚焦至：${nodeData.name}`, {
            duration: 1500,
            style: { 
              background: 'rgba(0, 0, 0, 0.8)', 
              color: color, 
              border: `1px solid ${color}40`,
              fontSize: '10px'
            }
          });
        }
      }
    };

    const handleZrClick = (params: any) => {
      if (!params.target) {
        setFocusedTimeRange(null);
      }
    };

    chartInstance.on('click', handleClick);
    chartInstance.getZr().on('click', handleZrClick);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (chartInstance && !chartInstance.isDisposed()) {
        chartInstance.off('click', handleClick);
        chartInstance.getZr().off('click', handleZrClick);
      }
      document.body.removeChild(canvas);
    };
  }, [chartInstance]);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: fenjiu_colors.background }}>
      {/* 左侧调节面板 - 常驻显示 */}
      <div 
        className="absolute top-32 left-8 z-50 p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-2xl w-80 pointer-events-auto max-h-[75vh] overflow-y-auto custom-scrollbar shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-black/5 py-1 backdrop-blur-sm z-10">
          <h3 className="text-white/90 text-sm font-bold flex items-center gap-2">
            <div className="w-1 h-4 bg-cyan-400"></div>
            图谱视觉参数调节
          </h3>
          <div className="flex gap-1.5 flex-wrap justify-end">
            <button 
              onClick={saveAsDefault}
              className="text-[10px] text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 border border-white/10 px-1.5 py-1 rounded-md bg-white/5"
              title="保存当前配置为默认"
            >
              <Save size={10} />
              保存
            </button>
            <button 
              onClick={resetAdjustments}
              className="text-[10px] text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 border border-white/10 px-1.5 py-1 rounded-md bg-white/5"
              title="重置全部配置"
            >
              <RotateCcw size={10} />
              重置
            </button>
            <button 
              onClick={exportConfig}
              className="text-[10px] text-white/40 hover:text-emerald-400 transition-colors flex items-center gap-1 border border-white/10 px-1.5 py-1 rounded-md bg-white/5"
              title="导出配置为 JSON 文件"
            >
              <Download size={10} />
              导出
            </button>
            <button 
              onClick={() => configFileRef.current?.click()}
              className="text-[10px] text-white/40 hover:text-amber-400 transition-colors flex items-center gap-1 border border-white/10 px-1.5 py-1 rounded-md bg-white/5"
              title="导入配置 JSON 文件"
            >
              <Upload size={10} />
              导入
            </button>
            <input
              ref={configFileRef}
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="space-y-8">
          <section className="space-y-4">
            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5 pb-1">核心标题自定义</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>标题色 (渐变终点)</span>
                  <span className="font-mono">{rootColor}</span>
                </div>
                <div className="flex gap-2">
                  {['#00EAFF', '#FFD700', '#FF4500', '#7FFF00', '#FFFFFF'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setRootColor(c)}
                      className={`w-6 h-6 rounded-full border-2 ${rootColor === c ? 'border-white' : 'border-transparent'}`}
                      style={{ background: c }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={rootColor}
                    onChange={(e) => setRootColor(e.target.value)}
                    className="w-6 h-6 rounded-full bg-transparent border-none cursor-pointer p-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">显示文本标题</span>
                <button 
                  onClick={() => setShowRootLabels(!showRootLabels)}
                  className={`w-10 h-5 rounded-full p-1 transition-colors ${showRootLabels ? 'bg-cyan-500' : 'bg-white/10'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${showRootLabels ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>字体大小</span>
                  <span className="font-mono">{rootTitleFontSize}px</span>
                </div>
                <input 
                  type="range" min="20" max="60" step="1"
                  value={rootTitleFontSize}
                  onChange={(e) => setRootTitleFontSize(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>全息发光强度</span>
                  <span className="font-mono">{rootGlowIntensity}</span>
                </div>
                <input 
                  type="range" min="0" max="40" step="1"
                  value={rootGlowIntensity}
                  onChange={(e) => setRootGlowIntensity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-[10px] text-white/50">标题投影色</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-white/30">{rootTitleShadowColor}</span>
                  <input 
                    type="color" 
                    value={rootTitleShadowColor}
                    onChange={(e) => setRootTitleShadowColor(e.target.value)}
                    className="w-5 h-5 rounded-sm bg-transparent border-none cursor-pointer p-0"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5 pb-1">节点尺度</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>中心节点</span>
                  <span className="font-mono">{nodeSizes.root}px</span>
                </div>
                <input 
                  type="range" min="100" max="600" step="10"
                  value={nodeSizes.root}
                  onChange={(e) => setNodeSizes(prev => ({ ...prev, root: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>一级节点 (基因层)</span>
                  <span className="font-mono">{nodeSizes.l1}px</span>
                </div>
                <input 
                  type="range" min="40" max="250" step="5"
                  value={nodeSizes.l1}
                  onChange={(e) => setNodeSizes(prev => ({ ...prev, l1: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>二级节点 (目录层)</span>
                  <span className="font-mono">{nodeSizes.l2}px</span>
                </div>
                <input 
                  type="range" min="20" max="150" step="5"
                  value={nodeSizes.l2}
                  onChange={(e) => setNodeSizes(prev => ({ ...prev, l2: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>三级节点 (内容层)</span>
                  <span className="font-mono">{nodeSizes.l3}px</span>
                </div>
                <input 
                  type="range" min="10" max="100" step="5"
                  value={nodeSizes.l3}
                  onChange={(e) => setNodeSizes(prev => ({ ...prev, l3: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="pt-2 border-t border-white/5 mt-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">中心节点描边</span>
                  <button 
                    onClick={() => setNodeBorders(prev => ({ ...prev, root: !prev.root }))}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${nodeBorders.root ? 'bg-cyan-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${nodeBorders.root ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">一级节点描边</span>
                  <button 
                    onClick={() => setNodeBorders(prev => ({ ...prev, l1: !prev.l1 }))}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${nodeBorders.l1 ? 'bg-cyan-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${nodeBorders.l1 ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">二级节点描边</span>
                  <button 
                    onClick={() => setNodeBorders(prev => ({ ...prev, l2: !prev.l2 }))}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${nodeBorders.l2 ? 'bg-cyan-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${nodeBorders.l2 ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">三级节点描边</span>
                  <button 
                    onClick={() => setNodeBorders(prev => ({ ...prev, l3: !prev.l3 }))}
                    className={`w-10 h-5 rounded-full p-1 transition-colors ${nodeBorders.l3 ? 'bg-cyan-500' : 'bg-white/10'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${nodeBorders.l3 ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>一级轨道半径</span>
                  <span className="font-mono">{l1Radius}px</span>
                </div>
                <input 
                  type="range" min="150" max="500" step="5"
                  value={l1Radius}
                  onChange={(e) => setL1Radius(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>时间轴轨道半径</span>
                  <span className="font-mono">{timelineRadius}px</span>
                </div>
                <input 
                  type="range" min="80" max="400" step="5"
                  value={timelineRadius}
                  onChange={(e) => setTimelineRadius(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5 pb-1">动效参数</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>装饰环自转</span>
                  <span className="font-mono">{rotationSpeed.toFixed(2)}</span>
                </div>
                <input
                  type="range" min="0" max="1" step="0.01"
                  value={rotationSpeed}
                  onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[9px] text-white/25">
                  <span>静止</span>
                  <span>装饰圆环绕自身旋转</span>
                  <span>极速</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>呼吸频率</span>
                  <span className="font-mono">{breathFrequency.toFixed(3)}</span>
                </div>
                <input
                  type="range" min="0" max="0.2" step="0.005"
                  value={breathFrequency}
                  onChange={(e) => setBreathFrequency(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[9px] text-white/25">
                  <span>无呼吸</span>
                  <span>节点缩放+投影闪烁</span>
                  <span>快速脉动</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>装饰圆盘半径</span>
                  <span className="font-mono">{decorRadius}px</span>
                </div>
                <input
                  type="range" min="0" max="20" step="1"
                  value={decorRadius}
                  onChange={(e) => setDecorRadius(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[9px] text-white/25">
                  <span>紧贴节点</span>
                  <span>虚线环/光晕扩散距离</span>
                  <span>远离</span>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5 pb-1">配色方案</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <span className="text-[11px] text-white/60 group-hover:text-white transition-colors font-bold text-cyan-400">大屏背景色</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-white/30">{bgColor}</span>
                  <input 
                    type="color" 
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-5 h-5 rounded-sm bg-transparent border-none cursor-pointer p-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-[11px] text-white/60 group-hover:text-white transition-colors font-bold text-cyan-400">中心节点投影色</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-white/30">{rootShadowColor}</span>
                  <input 
                    type="color" 
                    value={rootShadowColor}
                    onChange={(e) => setRootShadowColor(e.target.value)}
                    className="w-5 h-5 rounded-sm bg-transparent border-none cursor-pointer p-0"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between group">
                <span className="text-[11px] text-white/60 group-hover:text-white transition-colors font-bold text-cyan-400">时间轴颜色</span>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono text-white/30">{timelineColor}</span>
                  <input 
                    type="color" 
                    value={timelineColor}
                    onChange={(e) => setTimelineColor(e.target.value)}
                    className="w-5 h-5 rounded-sm bg-transparent border-none cursor-pointer p-0"
                  />
                </div>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(cultureColors).map(([name, color]) => (
                <div key={name} className="flex items-center justify-between group">
                  <span className="text-[11px] text-white/60 group-hover:text-white transition-colors">{name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-mono text-white/30">{color}</span>
                    <input 
                      type="color" 
                      value={color}
                      onChange={(e) => setCultureColors(prev => ({ ...prev, [name]: e.target.value }))}
                      className="w-5 h-5 rounded-sm bg-transparent border-none cursor-pointer p-0"
                    />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">符号自定义</h4>
              <button 
                onClick={() => setShowCenterText(!showCenterText)}
                className={`text-[9px] px-2 py-0.5 rounded border transition-colors ${showCenterText ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-white/10 text-white/40'}`}
              >
                {showCenterText ? '显示中心文字' : '隐藏中心文字'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                <p className="text-[10px] text-white/40 leading-relaxed">
                  批量替换节点图标，文件名含关键字自动匹配（如“山西”、“根祖”、“酒魂”、“祭祀”）。支持 SVG/PNG/JPG，可直接上传整个文件夹。
                </p>
                <div className="flex gap-2">
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-white/20 rounded-md hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all cursor-pointer group">
                    <LayoutGrid className="w-3 h-3 text-white/30 group-hover:text-cyan-400 shrink-0" />
                    <span className="text-[10px] text-white/50 group-hover:text-cyan-400">多选文件</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => { handleBatchUpload(e.target.files); e.target.value = ''; }} />
                  </label>
                  <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-white/20 rounded-md hover:border-amber-400/50 hover:bg-amber-400/5 transition-all cursor-pointer group">
                    <FolderOpen className="w-3 h-3 text-white/30 group-hover:text-amber-400 shrink-0" />
                    <span className="text-[10px] text-white/50 group-hover:text-amber-400">上传文件夹</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { handleBatchUpload(e.target.files); e.target.value = ''; }}
                      {...{ webkitdirectory: '', directory: '' } as any}
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                {/* 根节点 */}
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                  <span className="text-[10px] text-white/70">{graphData.root.name.replace(/\n/g, ' ')}</span>
                  <label className="cursor-pointer">
                    <div className={`w-6 h-6 rounded flex items-center justify-center border ${customSymbols['root'] ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-white/10 text-white/20 hover:text-white/40'}`}>
                      <span className="text-[8px]">{customSymbols['root'] ? '已换' : '替换'}</span>
                    </div>
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'root')} accept="image/*" />
                  </label>
                </div>
                {/* 动态生成分类节点 */}
                {graphData.categories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between p-2 rounded bg-white/5 border border-transparent hover:border-white/10 transition-colors">
                    <span className="text-[10px] text-white/70">{cat.name}</span>
                    <label className="cursor-pointer">
                      <div className={`w-6 h-6 rounded flex items-center justify-center border ${customSymbols[cat.id] ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'border-white/10 text-white/20 hover:text-white/40'}`}>
                        <span className="text-[8px]">{customSymbols[cat.id] ? '已换' : '替换'}</span>
                      </div>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, cat.id)} accept="image/*" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-white/5 pb-1">图谱节点数据</h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">
                    当前：{graphData.categories.length} 分类 / {graphData.categories.reduce((acc, c) => acc + c.children.length, 0)} 二级 / {graphData.categories.reduce((acc, c) => acc + c.children.reduce((a2, l2) => a2 + (l2.children?.length || 0), 0), 0)} 三级
                  </span>
                  {graphData !== DEFAULT_GRAPH_DATA && (
                    <span className="text-[9px] text-amber-400/70 bg-amber-400/10 px-1.5 py-0.5 rounded">自定义</span>
                  )}
                </div>
                <p className="text-[9px] text-white/30 leading-relaxed">
                  上传 JSON 文件替换图谱节点内容。可先导出当前数据作为模板，修改后重新导入。
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportGraphData}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-white/20 rounded-md hover:border-emerald-400/50 hover:bg-emerald-400/5 transition-all cursor-pointer group"
                >
                  <Download className="w-3 h-3 text-white/30 group-hover:text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-white/50 group-hover:text-emerald-400">导出节点数据</span>
                </button>
                <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-dashed border-white/20 rounded-md hover:border-amber-400/50 hover:bg-amber-400/5 transition-all cursor-pointer group">
                  <Upload className="w-3 h-3 text-white/30 group-hover:text-amber-400 shrink-0" />
                  <span className="text-[10px] text-white/50 group-hover:text-amber-400">导入节点数据</span>
                  <input
                    ref={graphDataFileRef}
                    type="file"
                    accept=".json"
                    onChange={importGraphData}
                    className="hidden"
                  />
                </label>
              </div>
              {graphData !== DEFAULT_GRAPH_DATA && (
                <button
                  onClick={resetGraphData}
                  className="w-full text-[10px] text-white/40 hover:text-cyan-400 transition-colors flex items-center justify-center gap-1 border border-white/10 px-2 py-1.5 rounded-md bg-white/5"
                >
                  <RotateCcw size={10} />
                  恢复默认节点数据
                </button>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <AnimatedBackground fenjiu_colors={fenjiu_colors} />
        <StarField fenjiu_colors={fenjiu_colors} />
        <LatticeGrid />
        <BrickPattern />
        <OrbitRings fenjiu_colors={fenjiu_colors} chartInstance={chartInstance} l1Radius={l1Radius} timelineRadius={timelineRadius} focusedTimeRange={focusedTimeRange} timelineColor={timelineColor} />
        <Timeline fenjiu_colors={fenjiu_colors} visible={showPanels} />
      </div>

      {/* BreathingNodes 单独放在 z-20，确保在 ECharts (z-10) 之上 */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <BreathingNodes fenjiu_colors={fenjiu_colors} colors={cultureColors} chartInstance={chartInstance} l1Radius={l1Radius} decorSpinSpeed={rotationSpeed} breathFrequency={breathFrequency} l1NodeSize={nodeSizes.l1} decorRadius={decorRadius} graphData={graphData} showCenterText={showCenterText} colorLibrary={colorLibrary} />
      </div>

      
      <div className={`absolute top-0 right-0 h-screen w-96 pointer-events-none z-40 overflow-hidden transition-all duration-500 ${showPanels ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'}`}>
        <DataStats fenjiu_colors={fenjiu_colors} visible={showPanels} />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-auto">
        {chartReady && (
          <ReactECharts
            ref={chartRef}
            option={getOption}
            notMerge={true} // true：每次完整替换，防止 graph 系列 mergeOption 时重复追加节点导致"duplicate name or id"错误
            lazyUpdate={false}
            style={{ width: '100%', height: '100%' }}
            onEvents={{
              'rendered': () => {
                if (!chartInstance && chartRef.current) {
                  setChartInstance(chartRef.current.getEchartsInstance());
                }
              }
            }}
          />
        )}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <span className="text-[10px] text-white/60 tracking-widest uppercase">全息系统运行中</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex gap-4">
            <button className="text-[10px] text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-wider font-bold" onClick={() => {
              if (chartInstance) {
                chartInstance.dispatchAction({ type: 'restore' });
                viewStateRef.current = { zoom: 1, center: [500, 375] };
              }
            }}>视图重置</button>
            <button className="text-[10px] text-white/40 hover:text-cyan-400 transition-colors uppercase tracking-wider font-bold" onClick={exportGraphData}>数据导出</button>
          </div>
        </div>
      </div>

      {/* 控制按钮组 - 仅控制右侧数据面板 */}
      <div className="absolute top-8 right-8 z-[60] pointer-events-auto">
        <button 
          onClick={() => setShowPanels(!showPanels)}
          className={`w-12 h-12 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-all group shadow-2xl ${showPanels ? 'text-cyan-400 border-cyan-500/30 ring-4 ring-cyan-500/10' : ''}`}
          title={showPanels ? "隐藏数据面板" : "显示数据面板"}
        >
          <div className={`transition-all duration-500 ${showPanels ? 'rotate-90 scale-110' : 'rotate-0'}`}>
            <LayoutGrid size={22} />
          </div>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </div>
  );
}