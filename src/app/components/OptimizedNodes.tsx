import { fenjiu_colors } from "../styles/theme";

// 提示框配置
const tooltipConfig: Record<string, string> = {
  root: '<b>山西文化体系</b><br/>华夏文明的摇篮，五大文化基因在此交汇',
  genzhu: '<b>根祖文化</b><br/>临汾：尧都、丁村遗址<br/>运城：舜都、后土祠',
  zhongyi: '<b>忠义文化</b><br/>关公故里：忠肝义胆<br/>晋商精神：诚实守信',
  shanhe: '<b>山河文化</b><br/>表里山河：黄河、太行、汾河',
  gujian: '<b>古建文化</b><br/>地上文物博物馆：应县木塔、佛光寺',
  jiuhun: '<b>酒魂文化</b><br/>杏花村汾酒：6000年酿造史',
};

export function getOptimizedNodes(
  fenjiu_colors: any, 
  colors: any, 
  getShanxiMapSVG: any, 
  nodeSizes: any, 
  customSymbols: Record<string, string> = {}, 
  useCircles: boolean = false, 
  l1Radius: number = 260,
  rootParams: any = { showRootLabels: false, rootTitleFontSize: 32, rootColor: '#00EAFF', rootGlowIntensity: 15, rootShadowColor: '#082f6d', nodeBorders: { root: false, l1: true, l2: false, l3: true } }
) {
  const centerX = 500;
  const centerY = 375;
  
  const { showRootLabels, rootTitleFontSize, rootColor, rootGlowIntensity, rootShadowColor, nodeBorders } = rootParams;

  // 一级节点轨道配置（固定位置，无公转）
  const l1Configs = [
    { id: 'genzhu', angle: -90 },
    { id: 'zhongyi', angle: -18 },
    { id: 'shanhe', angle: 54 },
    { id: 'gujian', angle: 126 },
    { id: 'jiuhun', angle: 198 }
  ];

  const l1Positions: Record<string, {x: number, y: number}> = {};
  l1Configs.forEach(conf => {
    const rad = (conf.angle * Math.PI) / 180;
    l1Positions[conf.id] = {
      x: centerX + l1Radius * Math.cos(rad),
      y: centerY + l1Radius * Math.sin(rad)
    };
  });

  return [
    // 中心节点 - 山西省 文化基因库
    {
      id: 'root',
      name: '山西省 文化基因库',
      symbol: customSymbols['root'] || getShanxiMapSVG(),
      symbolSize: nodeSizes.root,
      x: centerX,
      y: centerY,
      fixed: true,
      draggable: false,
      itemStyle: {
        color: customSymbols['root']?.startsWith('image://') 
          ? 'transparent' 
          : {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(135, 206, 250, 0.25)' },
                { offset: 1, color: 'rgba(135, 206, 250, 0.05)' }
              ]
            },
        borderColor: rootShadowColor || fenjiu_colors.ice_blue_light,
        borderWidth: nodeBorders.root ? 2 : 0,
        shadowBlur: 30,
        shadowColor: rootShadowColor || fenjiu_colors.ice_blue_light,
      },
      label: {
        show: showRootLabels,
        position: 'inside',
        fontFamily: 'zihun266hao-shenshihei, Source Han Sans, sans-serif',
        fontSize: rootTitleFontSize,
        fontWeight: 'bold',
        formatter: (params: any) => {
          return showRootLabels ? '{rootTitle|山西省\n文化基因库}\n{rootSubtitle|三晋文脉 · 万代共根}' : '';
        },
        rich: {
          rootTitle: {
            fontFamily: 'zihun266hao-shenshihei, sans-serif',
            fontSize: rootTitleFontSize,
            fontWeight: 'bold',
            lineHeight: rootTitleFontSize * 1.3,
            // 使用纯色字符串确保颜色生效，渐变效果通过阴影增强
            color: rootColor,
            padding: [0, 0, 8, 0],
            align: 'center',
            textShadowBlur: rootGlowIntensity,
            textShadowColor: rootColor,
            // 额外增加一层深色描边，增强文字在发光环境下的可读性
            textBorderColor: 'rgba(0,0,0,0.8)',
            textBorderWidth: 1
          },
          rootSubtitle: {
            fontFamily: 'Source Han Sans, sans-serif',
            fontSize: 14,
            fontWeight: 'normal',
            color: '#B0E2FF',
            align: 'center',
            letterSpacing: 2
          }
        }
      },
      category: 'root',
      tooltip: {
        formatter: tooltipConfig.root
      }
    },

    // 一级节点：根祖文化
    {
      id: 'genzhu',
      name: '根祖文化',
      x: l1Positions['genzhu'].x,
      y: l1Positions['genzhu'].y,
      fixed: true,
      symbol: customSymbols['genzhu'] || (useCircles ? 'circle' : 'diamond'),
      symbolSize: nodeSizes.l1,
      itemStyle: {
        color: customSymbols['genzhu']?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                { offset: 0, color: colors['根祖文化'] },
                { offset: 1, color: 'rgba(0, 0, 0, 0.4)' }
              ]
            },
        borderColor: colors['根祖文化'],
        borderWidth: nodeBorders.l1 ? 1.5 : 0,
        shadowBlur: 30,
        shadowColor: colors['根祖文化'],
        opacity: 0.85
      },
      category: 'genzhu',
      tooltip: {
        formatter: tooltipConfig['genzhu']
      },
      rippleEffect: {
        period: 4,
        scale: 2.8,
        brushType: 'stroke',
        color: colors['根祖文化']
      }
    },

    // 一级节点：忠义文化
    {
      id: 'zhongyi',
      name: '忠义文化',
      x: l1Positions['zhongyi'].x,
      y: l1Positions['zhongyi'].y,
      fixed: true,
      symbol: customSymbols['zhongyi'] || (useCircles ? 'circle' : 'triangle'),
      symbolSize: nodeSizes.l1,
      itemStyle: {
        color: customSymbols['zhongyi']?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: colors['忠义文化'] },
                { offset: 1, color: 'rgba(0, 0, 0, 0.4)' }
              ]
            },
        borderColor: colors['忠义文化'],
        borderWidth: nodeBorders.l1 ? 1.5 : 0,
        shadowBlur: 30,
        shadowColor: colors['忠义文化'],
        opacity: 0.85
      },
      category: 'zhongyi',
      tooltip: {
        formatter: tooltipConfig['zhongyi']
      }
    },

    // 一级节点：山河文化
    {
      id: 'shanhe',
      name: '山河文化',
      x: l1Positions['shanhe'].x,
      y: l1Positions['shanhe'].y,
      fixed: true,
      symbol: customSymbols['shanhe'] || (useCircles ? 'circle' : 'roundRect'),
      symbolSize: nodeSizes.l1,
      itemStyle: {
        color: customSymbols['shanhe']?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: colors['山河文化'] },
                { offset: 1, color: 'rgba(0, 0, 0, 0.4)' }
              ]
            },
        borderColor: colors['山河文化'],
        borderWidth: nodeBorders.l1 ? 1.5 : 0,
        shadowBlur: 30,
        shadowColor: colors['山河文化'],
        opacity: 0.85
      },
      category: 'shanhe',
      tooltip: {
        formatter: tooltipConfig['shanhe']
      }
    },

    // 一级节点：古建文化
    {
      id: 'gujian',
      name: '古建文化',
      x: l1Positions['gujian'].x,
      y: l1Positions['gujian'].y,
      fixed: true,
      symbol: customSymbols['gujian'] || (useCircles ? 'circle' : 'rect'),
      symbolSize: nodeSizes.l1,
      itemStyle: {
        color: customSymbols['gujian']?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: colors['古建文化'] },
                { offset: 1, color: 'rgba(0, 0, 0, 0.4)' }
              ]
            },
        borderColor: colors['古建文化'],
        borderWidth: nodeBorders.l1 ? 1.5 : 0,
        shadowBlur: 30,
        shadowColor: colors['古建文化'],
        opacity: 0.85
      },
      category: 'gujian',
      tooltip: {
        formatter: tooltipConfig['gujian']
      }
    },

    // 一级节点：酒魂文化
    {
      id: 'jiuhun',
      name: '酒魂文化',
      x: l1Positions['jiuhun'].x,
      y: l1Positions['jiuhun'].y,
      fixed: true,
      symbol: customSymbols['jiuhun'] || (useCircles ? 'circle' : 'pin'),
      symbolSize: nodeSizes.l1,
      itemStyle: {
        color: customSymbols['jiuhun']?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: colors['酒魂文化'] },
                { offset: 1, color: 'rgba(0, 0, 0, 0.4)' }
              ]
            },
        borderColor: colors['酒魂文化'],
        borderWidth: nodeBorders.l1 ? 1.5 : 0,
        shadowBlur: 30,
        shadowColor: colors['酒魂文化'],
        opacity: 0.85
      },
      category: 'jiuhun',
      tooltip: {
        formatter: tooltipConfig['jiuhun']
      }
    },

    // 二级节点生成 (自由态)
    ...generateSecondLevelNodes('genzhu', colors['根祖文化'], fenjiu_colors, [
      { id: 'genzhu-1', name: '祭祀' }, { id: 'genzhu-2', name: '建筑' },
      { id: 'genzhu-3', name: '礼制' }, { id: 'genzhu-4', name: '民俗' }
    ], nodeSizes, customSymbols, l1Positions['genzhu'], nodeBorders.l2),

    ...generateSecondLevelNodes('zhongyi', colors['忠义文化'], fenjiu_colors, [
      { id: 'zhongyi-1', name: '人物' }, { id: 'zhongyi-2', name: '商道' },
      { id: 'zhongyi-3', name: '信仰' }, { id: 'zhongyi-4', name: '家训' }
    ], nodeSizes, customSymbols, l1Positions['zhongyi'], nodeBorders.l2),

    ...generateSecondLevelNodes('shanhe', colors['山河文化'], fenjiu_colors, [
      { id: 'shanhe-1', name: '河流' }, { id: 'shanhe-2', name: '山脉' },
      { id: 'shanhe-3', name: '关隘' }, { id: 'shanhe-4', name: '盆地' }
    ], nodeSizes, customSymbols, l1Positions['shanhe'], nodeBorders.l2),

    ...generateSecondLevelNodes('gujian', colors['古建文化'], fenjiu_colors, [
      { id: 'gujian-1', name: '木构' }, { id: 'gujian-2', name: '彩塑' },
      { id: 'gujian-3', name: '石窟' }, { id: 'gujian-4', name: '城池' }
    ], nodeSizes, customSymbols, l1Positions['gujian'], nodeBorders.l2),

    ...generateSecondLevelNodes('jiuhun', colors['酒魂文化'], fenjiu_colors, [
      { id: 'jiuhun-1', name: '考古' }, { id: 'jiuhun-2', name: '技艺' },
      { id: 'jiuhun-3', name: '文学' }, { id: 'jiuhun-4', name: '荣耀' }
    ], nodeSizes, customSymbols, l1Positions['jiuhun'], nodeBorders.l2),

    // 三级节点
    ...generateThirdLevelNodes('genzhu-1', colors['根祖文化'], fenjiu_colors, [
      { id: 'gz-1-1', name: '尧庙祭典' }, { id: 'gz-1-2', name: '舜帝祭祀' }, { id: 'gz-1-3', name: '大槐树寻根' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('genzhu-2', colors['根祖文化'], fenjiu_colors, [
      { id: 'gz-2-1', name: '陶寺遗址' }, { id: 'gz-2-2', name: '丁村人' }, { id: 'gz-2-3', name: '西侯度' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('genzhu-4', colors['根祖文化'], fenjiu_colors, [
      { id: 'gz-4-1', name: '威风锣鼓' }, { id: 'gz-4-2', name: '尧都剪纸' }
    ], nodeSizes, nodeBorders.l3),

    ...generateThirdLevelNodes('zhongyi-1', colors['忠义文化'], fenjiu_colors, [
      { id: 'zy-1-1', name: '武圣关羽' }, { id: 'zy-1-2', name: '神探狄公' }, { id: 'zy-1-3', name: '重耳传奇' }, { id: 'zy-1-4', name: '一代廉吏' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('zhongyi-2', colors['忠义文化'], fenjiu_colors, [
      { id: 'zy-2-1', name: '日升昌票号' }, { id: 'zy-2-2', name: '万里茶道' }, { id: 'zy-2-3', name: '诚信本色' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('zhongyi-4', colors['忠义文化'], fenjiu_colors, [
      { id: 'zy-4-1', name: '裴氏家训' }, { id: 'zy-4-2', name: '宰相村风' }
    ], nodeSizes, nodeBorders.l3),

    ...generateThirdLevelNodes('shanhe-1', colors['山河文化'], fenjiu_colors, [
      { id: 'sh-1-1', name: '壶口壮歌' }, { id: 'sh-1-2', name: '汾河晚渡' }, { id: 'sh-1-3', name: '黄河大拐弯' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('shanhe-2', colors['山河文化'], fenjiu_colors, [
      { id: 'sh-2-1', name: '五台圣境' }, { id: 'sh-2-2', name: '北岳恒山' }, { id: 'sh-2-3', name: '太行脊梁' }, { id: 'sh-2-4', name: '绵山云海' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('shanhe-3', colors['山河文化'], fenjiu_colors, [
      { id: 'sh-3-1', name: '雄关雁门' }, { id: 'sh-3-2', name: '娘子天险' }, { id: 'sh-3-3', name: '偏关古道' }
    ], nodeSizes, nodeBorders.l3),

    ...generateThirdLevelNodes('gujian-1', colors['古建文化'], fenjiu_colors, [
      { id: 'gj-1-1', name: '佛光寺大殿' }, { id: 'gj-1-2', name: '南禅寺' }, { id: 'gj-1-3', name: '应县木塔' }, { id: 'gj-1-4', name: '飞虹塔' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('gujian-2', colors['古建文化'], fenjiu_colors, [
      { id: 'gj-2-1', name: '双林寺彩塑' }, { id: 'gj-2-2', name: '铁佛寺' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('gujian-3', colors['古建文化'], fenjiu_colors, [
      { id: 'gj-3-1', name: '云冈石窟' }, { id: 'gj-3-2', name: '天龙山石窟' }
    ], nodeSizes, nodeBorders.l3),

    ...generateThirdLevelNodes('jiuhun-1', colors['酒魂文化'], fenjiu_colors, [
      { id: 'jh-1-1', name: '杏花村遗址' }, { id: 'jh-1-2', name: '小口尖底瓶' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('jiuhun-2', colors['酒魂文化'], fenjiu_colors, [
      { id: 'jh-2-1', name: '清蒸二次清' }, { id: 'jh-2-2', name: '地缸发酵' }, { id: 'jh-2-3', name: '古法入库' }
    ], nodeSizes, nodeBorders.l3),
    ...generateThirdLevelNodes('jiuhun-3', colors['酒魂文化'], fenjiu_colors, [
      { id: 'jh-3-1', name: '牧童遥指' }, { id: 'jh-3-2', name: '汾酒赋' }
    ], nodeSizes, nodeBorders.l3)
  ];
}

// 生成二级节点的辅助函数 (自由态)
function generateSecondLevelNodes(category: string, color: string, fenjiu_colors: any, nodes: any[], nodeSizes: any, customSymbols: Record<string, string>, parentPos: {x: number, y: number}, showBorder: boolean = true) {
  return nodes.map((node, index) => {
    const angle = (index * (360 / nodes.length) * Math.PI) / 180;
    const initialDistance = 75; 
    
    return {
      id: node.id,
      name: node.name,
      x: parentPos.x + initialDistance * Math.cos(angle),
      y: parentPos.y + initialDistance * Math.sin(angle),
      fixed: false, // 恢复自由移动
      symbol: customSymbols[node.id] || 'circle',
      symbolSize: nodeSizes.l2,
      itemStyle: {
        color: customSymbols[node.id]?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: color },
                { offset: 1, color: 'rgba(0, 0, 0, 0.5)' }
              ]
            },
        borderColor: color,
        borderWidth: showBorder ? 0.8 : 0,
        shadowBlur: 20,
        shadowColor: color
      },
      label: {
        fontSize: nodeSizes.l2 * 0.26,
        fontWeight: '600',
        fontFamily: 'KingHwa_OldSong, serif',
        color: fenjiu_colors.ice_blue_light,
        formatter: `{name|${node.name}}`,
        rich: {
          name: { fontFamily: 'KingHwa_OldSong, serif', fontSize: nodeSizes.l2 * 0.26, fontWeight: '600', color: fenjiu_colors.ice_blue_light }
        }
      },
      category: category,
      draggable: true,
      tooltip: {
        formatter: tooltipConfig[node.id] || `<b>${node.name}</b><br/>山西${category}相关节点`
      }
    };
   });
}

// 生成三级节点的辅助函数（展示层）
function generateThirdLevelNodes(parentId: string, color: string, fenjiu_colors: any, nodes: any[], nodeSizes: any, showBorder: boolean = true) {
  return nodes.map((node, index) => {
    return {
      id: node.id,
      name: node.name,
      symbol: 'circle',
      symbolSize: nodeSizes.l3 || 35,
      // 赋予初始随机坐标，避免从 [0,0] 飞入导致的“向右下偏移”错觉
      x: 500 + (Math.random() - 0.5) * 50,
      y: 375 + (Math.random() - 0.5) * 50,
      itemStyle: {
        color: 'transparent',
        borderColor: color,
        borderWidth: showBorder ? 1 : 0,
        borderType: 'dashed',
        shadowBlur: 10,
        shadowColor: color
      },
      label: {
        show: true,
        position: 'bottom',
        distance: 5,
        fontFamily: 'KingHwa_OldSong, serif',
        fontSize: (nodeSizes.l3 || 35) * 0.35,
        color: 'rgba(255, 255, 255, 0.8)'
      },
      category: parentId,
      tooltip: {
        formatter: `<b>${node.name}</b><br/>三晋文化代表性内容`
      }
    };
  });
}

export function getOptimizedLinks(colors: any) {
  const links: any[] = [];
  
  // 核心连接到一级节点
  const categories = ['genzhu', 'zhongyi', 'shanhe', 'gujian', 'jiuhun'];
  categories.forEach(cat => {
    links.push({
      source: 'root',
      target: cat,
      lineStyle: { width: 3, curveness: 0.1, color: 'rgba(255,255,255,0.15)', type: 'solid' }
    });
  });

  // 一连接到二级
  const genzhu_subs = ['genzhu-1', 'genzhu-2', 'genzhu-3', 'genzhu-4'];
  genzhu_subs.forEach(sub => links.push({ source: 'genzhu', target: sub, lineStyle: { width: 1.5, color: colors['根祖文化'], opacity: 0.4 } }));

  const zhongyi_subs = ['zhongyi-1', 'zhongyi-2', 'zhongyi-3', 'zhongyi-4'];
  zhongyi_subs.forEach(sub => links.push({ source: 'zhongyi', target: sub, lineStyle: { width: 1.5, color: colors['忠义文化'], opacity: 0.4 } }));

  const shanhe_subs = ['shanhe-1', 'shanhe-2', 'shanhe-3', 'shanhe-4'];
  shanhe_subs.forEach(sub => links.push({ source: 'shanhe', target: sub, lineStyle: { width: 1.5, color: colors['山河文化'], opacity: 0.4 } }));

  const gujian_subs = ['gujian-1', 'gujian-2', 'gujian-3', 'gujian-4'];
  gujian_subs.forEach(sub => links.push({ source: 'gujian', target: sub, lineStyle: { width: 1.5, color: colors['古建文化'], opacity: 0.4 } }));

  const jiuhun_subs = ['jiuhun-1', 'jiuhun-2', 'jiuhun-3', 'jiuhun-4'];
  jiuhun_subs.forEach(sub => links.push({ source: 'jiuhun', target: sub, lineStyle: { width: 1.5, color: colors['酒魂文化'], opacity: 0.4 } }));

  // 二级连接到三级
  const thirdLevelMap: Record<string, string[]> = {
    'genzhu-1': ['gz-1-1', 'gz-1-2', 'gz-1-3'],
    'genzhu-2': ['gz-2-1', 'gz-2-2', 'gz-2-3'],
    'genzhu-4': ['gz-4-1', 'gz-4-2'],
    'zhongyi-1': ['zy-1-1', 'zy-1-2', 'zy-1-3', 'zy-1-4'],
    'zhongyi-2': ['zy-2-1', 'zy-2-2', 'zy-2-3'],
    'zhongyi-4': ['zy-4-1', 'zy-4-2'],
    'shanhe-1': ['sh-1-1', 'sh-1-2', 'sh-1-3'],
    'shanhe-2': ['sh-2-1', 'sh-2-2', 'sh-2-3', 'sh-2-4'],
    'shanhe-3': ['sh-3-1', 'sh-3-2', 'sh-3-3'],
    'gujian-1': ['gj-1-1', 'gj-1-2', 'gj-1-3', 'gj-1-4'],
    'gujian-2': ['gj-2-1', 'gj-2-2'],
    'gujian-3': ['gj-3-1', 'gj-3-2'],
    'jiuhun-1': ['jh-1-1', 'jh-1-2'],
    'jiuhun-2': ['jh-2-1', 'jh-2-2', 'jh-2-3'],
    'jiuhun-3': ['jh-3-1', 'jh-3-2']
  };

  Object.entries(thirdLevelMap).forEach(([parent, children]) => {
    children.forEach(child => {
      links.push({
        source: parent,
        target: child,
        lineStyle: { width: 0.5, type: 'dashed', curveness: 0.2, opacity: 0.3 }
      });
    });
  });

  return links;
}