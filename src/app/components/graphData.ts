// 图谱节点数据模型 & 默认数据
// 用户可导出此结构的 JSON 文件，修改后重新导入以替换图谱内容

/** 三级节点 */
export interface L3Node {
  id: string;
  name: string;
  timeRange?: [number, number]; // [startYear, endYear]
}

/** 二级节点（含可选三级子节点） */
export interface L2Node {
  id: string;
  name: string;
  children?: L3Node[];
  timeRange?: [number, number];
}

/** 一级节点（文化基因分类） */
export interface L1Category {
  id: string;
  name: string;
  angle?: number;        // 在轨道上的角度（度），可选，系统会自动计算
  symbol?: string;      // ECharts symbol: 'diamond' | 'triangle' | 'roundRect' | 'rect' | 'pin' | 'circle'
  tooltip?: string;     // HTML 格式的提示文本
  children: L2Node[];
  timeRange?: [number, number];
}

/** 完整图谱数据 */
export interface GraphData {
  root: {
    name: string;
    subtitle: string;
    tooltip?: string;
    region?: string;      // 地区编码，如 "shanxi", "beijing", "sichuan" 等
    regionName?: string;  // 地区名称，如 "山西省"
  };
  categories: L1Category[];
}

/** 默认图谱数据：山西五大文化基因体系 */
export const DEFAULT_GRAPH_DATA: GraphData = {
  root: {
    name: '山西省\n文化基因库',
    subtitle: '三晋文脉 · 万代共根',
    tooltip: '<b>山西文化体系</b><br/>华夏文明的摇篮，五大文化基因在此交汇',
    region: 'shanxi',
    regionName: '山西省'
  },
  categories: [
    {
      id: 'genzhu',
      name: '根祖文化',
      angle: -90,
      symbol: 'diamond',
      timeRange: [-6000, -2100], // 仰韶文化到夏商
      tooltip: '<b>根祖文化</b><br/>临汾：尧都、丁村遗址<br/>运城：舜都、后土祠',
      children: [
        {
          id: 'genzhu-1', name: '祭祀',
          timeRange: [-2357, -1046],
          children: [
            { id: 'gz-1-1', name: '尧庙祭典', timeRange: [-2357, -2200] },
            { id: 'gz-1-2', name: '舜帝祭祀', timeRange: [-2200, -2100] },
            { id: 'gz-1-3', name: '大槐树寻根', timeRange: [1368, 1400] }
          ]
        },
        {
          id: 'genzhu-2', name: '建筑',
          timeRange: [-6000, -3000],
          children: [
            { id: 'gz-2-1', name: '陶寺遗址', timeRange: [-2357, -1900] },
            { id: 'gz-2-2', name: '丁村人', timeRange: [-100000, -60000] }, // 虽然很早，但为了视图可能需要映射到 -6000 之后
            { id: 'gz-2-3', name: '西侯度', timeRange: [-1800000, -1000000] }
          ]
        },
        { id: 'genzhu-3', name: '礼制', timeRange: [-1046, -221] },
        {
          id: 'genzhu-4', name: '民俗',
          timeRange: [1368, 1912],
          children: [
            { id: 'gz-4-1', name: '威风锣鼓', timeRange: [1368, 1644] },
            { id: 'gz-4-2', name: '尧都剪纸', timeRange: [1644, 1912] }
          ]
        }
      ]
    },
    {
      id: 'zhongyi',
      name: '忠义文化',
      angle: -18,
      symbol: 'triangle',
      timeRange: [-636, 1912], // 春秋到清末
      tooltip: '<b>忠义文化</b><br/>关公故里：忠肝义胆<br/>晋商精神：诚实守信',
      children: [
        {
          id: 'zhongyi-1', name: '人物',
          timeRange: [160, 220],
          children: [
            { id: 'zy-1-1', name: '武圣关羽', timeRange: [160, 220] },
            { id: 'zy-1-2', name: '神探狄公', timeRange: [630, 700] },
            { id: 'zy-1-3', name: '重耳传奇', timeRange: [-697, -628] },
            { id: 'zy-1-4', name: '一代廉吏', timeRange: [1617, 1684] }
          ]
        },
        {
          id: 'zhongyi-2', name: '商道',
          timeRange: [1823, 1912],
          children: [
            { id: 'zy-2-1', name: '日升昌票号', timeRange: [1823, 1912] },
            { id: 'zy-2-2', name: '万里茶道', timeRange: [1689, 1912] },
            { id: 'zy-2-3', name: '诚信本色', timeRange: [1368, 1912] }
          ]
        },
        { id: 'zhongyi-3', name: '信仰', timeRange: [220, 1912] },
        {
          id: 'zhongyi-4', name: '家训',
          timeRange: [200, 1912],
          children: [
            { id: 'zy-4-1', name: '裴氏家训', timeRange: [220, 581] },
            { id: 'zy-4-2', name: '宰相村风', timeRange: [581, 1368] }
          ]
        }
      ]
    },
    {
      id: 'shanhe',
      name: '山河文化',
      angle: 54,
      symbol: 'roundRect',
      timeRange: [-10000, 2026], // 亿万年到现代
      tooltip: '<b>山河文化</b><br/>表里山河：黄河、太行、汾河',
      children: [
        {
          id: 'shanhe-1', name: '河流',
          timeRange: [-5000, 2026],
          children: [
            { id: 'sh-1-1', name: '壶口壮歌', timeRange: [-2000, 2026] },
            { id: 'sh-1-2', name: '汾河晚渡', timeRange: [618, 907] },
            { id: 'sh-1-3', name: '黄河大拐弯', timeRange: [-5000, 2026] }
          ]
        },
        {
          id: 'shanhe-2', name: '山脉',
          timeRange: [-10000, 2026],
          children: [
            { id: 'sh-2-1', name: '五台圣境', timeRange: [782, 2026] },
            { id: 'sh-2-2', name: '北岳恒山', timeRange: [471, 2026] },
            { id: 'sh-2-3', name: '太行脊梁', timeRange: [-10000, 2026] },
            { id: 'sh-2-4', name: '绵山云海', timeRange: [-636, 2026] }
          ]
        },
        {
          id: 'shanhe-3', name: '关隘',
          timeRange: [-1000, 1949],
          children: [
            { id: 'sh-3-1', name: '雄关雁门', timeRange: [-300, 1949] },
            { id: 'sh-3-2', name: '娘子天险', timeRange: [618, 1949] },
            { id: 'sh-3-3', name: '偏关古道', timeRange: [1368, 1949] }
          ]
        },
        { id: 'shanhe-4', name: '盆地', timeRange: [-10000, 2026] }
      ]
    },
    {
      id: 'gujian',
      name: '古建文化',
      angle: 126,
      symbol: 'rect',
      timeRange: [386, 1912], // 北魏到清
      tooltip: '<b>古建文化</b><br/>地上文物博物馆：应县木塔、佛光寺',
      children: [
        {
          id: 'gujian-1', name: '木构',
          timeRange: [782, 1056],
          children: [
            { id: 'gj-1-1', name: '佛光寺大殿', timeRange: [857, 857] },
            { id: 'gj-1-2', name: '南禅寺', timeRange: [782, 782] },
            { id: 'gj-1-3', name: '应县木塔', timeRange: [1056, 1056] },
            { id: 'gj-1-4', name: '飞虹塔', timeRange: [1515, 1515] }
          ]
        },
        {
          id: 'gujian-2', name: '彩塑',
          timeRange: [550, 1368],
          children: [
            { id: 'gj-2-1', name: '双林寺彩塑', timeRange: [550, 550] },
            { id: 'gj-2-2', name: '铁佛寺', timeRange: [1368, 1368] }
          ]
        },
        {
          id: 'gujian-3', name: '石窟',
          timeRange: [460, 550],
          children: [
            { id: 'gj-3-1', name: '云冈石窟', timeRange: [460, 494] },
            { id: 'gj-3-2', name: '天龙山石窟', timeRange: [530, 750] }
          ]
        },
        { id: 'gujian-4', name: '城池', timeRange: [1368, 1912] }
      ]
    },
    {
      id: 'jiuhun',
      name: '酒魂文化',
      angle: 198,
      symbol: 'pin',
      timeRange: [-6000, 2026],
      tooltip: '<b>酒魂文化</b><br/>杏花村汾酒：6000年酿造史',
      children: [
        {
          id: 'jiuhun-1', name: '考古',
          timeRange: [-6000, -2000],
          children: [
            { id: 'jh-1-1', name: '杏花村遗址', timeRange: [-6000, -2000] },
            { id: 'jh-1-2', name: '小口尖底瓶', timeRange: [-5000, -3000] }
          ]
        },
        {
          id: 'jiuhun-2', name: '技艺',
          timeRange: [550, 2026],
          children: [
            { id: 'jh-2-1', name: '清蒸二次清', timeRange: [550, 2026] },
            { id: 'jh-2-2', name: '地缸发酵', timeRange: [1368, 2026] },
            { id: 'jh-2-3', name: '古法入库', timeRange: [1644, 2026] }
          ]
        },
        {
          id: 'jiuhun-3', name: '文学',
          timeRange: [803, 2026],
          children: [
            { id: 'jh-3-1', name: '牧童遥指', timeRange: [803, 852] },
            { id: 'jh-3-2', name: '汾酒赋', timeRange: [1915, 2026] }
          ]
        },
        { id: 'jiuhun-4', name: '荣耀', timeRange: [1915, 2026] }
      ]
    }
  ]
};

/**
 * 从 GraphData 生成 ECharts links 数组
 */
export function generateLinksFromData(
  graphData: GraphData,
  colors: Record<string, string>,
  fenjiu_colors: any,
  colorLibrary?: string[]
) {
  const links: any[] = [];

  // root -> L1
  for (const cat of graphData.categories) {
    links.push({
      source: 'root',
      target: cat.id,
      lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 }
    });
  }

  // L1 -> L2
  for (const cat of graphData.categories) {
    const catIndex = graphData.categories.indexOf(cat);
    const color = colors[cat.name] || colorLibrary?.[catIndex % (colorLibrary?.length || 1)] || '#888';
    for (const l2 of cat.children) {
      links.push({
        source: cat.id,
        target: l2.id,
        lineStyle: { color, opacity: 0.4, width: 0.8, curveness: 0.2 }
      });

      // L2 -> L3
      if (l2.children) {
        for (const l3 of l2.children) {
          links.push({
            source: l2.id,
            target: l3.id,
            lineStyle: { color, opacity: 0.3, width: 0.6, type: 'dashed' as const }
          });
        }
      }
    }
  }

  return links;
}

/**
 * 从 GraphData 生成 ECharts categories 数组
 */
export function generateCategoriesFromData(graphData: GraphData) {
  return [
    { name: 'root' },
    ...graphData.categories.map(c => ({ name: c.id }))
  ];
}

/**
 * 校验上传的 JSON 是否为合法的 GraphData
 */
export function validateGraphData(data: any): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') return { valid: false, error: '数据格式错误：需要 JSON 对象' };
  if (!data.root || !data.root.name) return { valid: false, error: '缺少 root.name 字段' };
  if (!Array.isArray(data.categories) || data.categories.length === 0) return { valid: false, error: '缺少 categories 数组或为空' };

  for (let i = 0; i < data.categories.length; i++) {
    const cat = data.categories[i];
    if (!cat.id || !cat.name) return { valid: false, error: `categories[${i}] 缺少 id 或 name` };
    if (cat.angle !== undefined && typeof cat.angle !== 'number') return { valid: false, error: `categories[${i}] (${cat.id}) 的 angle 必须是数字（可选，系统会自动计算）` };
    if (!Array.isArray(cat.children)) return { valid: false, error: `categories[${i}] (${cat.id}) 缺少 children 数组` };
    if (data.categories.length > 12) return { valid: false, error: `分类数量不能超过 12 个，当前有 ${data.categories.length} 个` };
    for (let j = 0; j < cat.children.length; j++) {
      const l2 = cat.children[j];
      if (!l2.id || !l2.name) return { valid: false, error: `${cat.id}.children[${j}] 缺少 id 或 name` };
    }
  }

  return { valid: true };
}

/**
 * 构建节点 ID → 时间范围 的查找表
 */
export function buildTimeRangeMap(graphData: GraphData): Record<string, [number, number]> {
  const map: Record<string, [number, number]> = {};

  if (graphData.categories) {
    for (const cat of graphData.categories) {
      if (cat.timeRange) map[cat.id] = cat.timeRange;
      if (cat.children) {
        for (const l2 of cat.children) {
          if (l2.timeRange) map[l2.id] = l2.timeRange;
          if (l2.children) {
            for (const l3 of l2.children) {
              if (l3.timeRange) map[l3.id] = l3.timeRange;
            }
          }
        }
      }
    }
  }

  return map;
}