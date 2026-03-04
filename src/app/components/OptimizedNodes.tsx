import { GraphData } from './graphData';

export function getOptimizedNodes(
  fenjiu_colors: any, 
  colors: any, 
  getShanxiMapSVG: any, 
  nodeSizes: any, 
  customSymbols: Record<string, string> = {}, 
  useCircles: boolean = false, 
  l1Radius: number = 260,
  rootParams: any = { showRootLabels: false, rootTitleFontSize: 32, rootColor: '#00EAFF', rootGlowIntensity: 15, rootShadowColor: '#082f6d', nodeBorders: { root: false, l1: true, l2: false, l3: true } },
  graphData?: GraphData
) {
  const centerX = 500;
  const centerY = 375;
  
  const { showRootLabels, rootTitleFontSize, rootColor, rootGlowIntensity, rootShadowColor, nodeBorders } = rootParams;

  if (!graphData) return [];

  // 一级节点轨道位置计算
  const l1Positions: Record<string, {x: number, y: number}> = {};
  graphData.categories.forEach(cat => {
    const rad = (cat.angle * Math.PI) / 180;
    l1Positions[cat.id] = {
      x: centerX + l1Radius * Math.cos(rad),
      y: centerY + l1Radius * Math.sin(rad)
    };
  });

  const allNodes: any[] = [];

  // 根节点标签文本（将 \n 转换为 ECharts 换行）
  const rootTitle = graphData.root.name.replace(/\n/g, '\\n');
  const rootSubtitle = graphData.root.subtitle;

  // 中心节点
  allNodes.push({
    id: 'root',
    name: graphData.root.name.replace(/\n/g, ' '),
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
            x: 0.5, y: 0.5, r: 0.5,
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
      formatter: () => {
        return showRootLabels ? `{rootTitle|${rootTitle}}\\n{rootSubtitle|${rootSubtitle}}` : '';
      },
      rich: {
        rootTitle: {
          fontFamily: 'zihun266hao-shenshihei, sans-serif',
          fontSize: rootTitleFontSize,
          fontWeight: 'bold',
          lineHeight: rootTitleFontSize * 1.3,
          color: rootColor,
          padding: [0, 0, 8, 0],
          align: 'center',
          textShadowBlur: rootGlowIntensity,
          textShadowColor: rootColor,
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
      formatter: graphData.root.tooltip || `<b>${graphData.root.name.replace(/\n/g, '')}</b>`
    }
  });

  // 一级节点
  graphData.categories.forEach(cat => {
    const catColor = colors[cat.name] || '#888';
    const defaultSymbol = cat.symbol || 'circle';
    allNodes.push({
      id: cat.id,
      name: cat.name,
      x: l1Positions[cat.id].x,
      y: l1Positions[cat.id].y,
      fixed: true,
      draggable: false,
      symbol: customSymbols[cat.id] || (useCircles ? 'circle' : defaultSymbol),
      symbolSize: nodeSizes.l1,
      itemStyle: {
        color: customSymbols[cat.id]?.startsWith('image://')
          ? 'transparent'
          : {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: catColor },
                { offset: 1, color: 'rgba(0, 0, 0, 0.4)' }
              ]
            },
        borderColor: catColor,
        borderWidth: nodeBorders.l1 ? 1.5 : 0,
        shadowBlur: 30,
        shadowColor: catColor,
        opacity: 0.85
      },
      category: cat.id,
      tooltip: {
        formatter: cat.tooltip || `<b>${cat.name}</b>`
      }
    });

    // 二级节点
    cat.children.forEach((l2, l2Index) => {
      const angle = (l2Index * (360 / cat.children.length) * Math.PI) / 180;
      const initialDistance = 75;
      allNodes.push({
        id: l2.id,
        name: l2.name,
        x: l1Positions[cat.id].x + initialDistance * Math.cos(angle),
        y: l1Positions[cat.id].y + initialDistance * Math.sin(angle),
        fixed: false,
        symbol: customSymbols[l2.id] || 'circle',
        symbolSize: nodeSizes.l2,
        itemStyle: {
          color: customSymbols[l2.id]?.startsWith('image://')
            ? 'transparent'
            : {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.5,
                colorStops: [
                  { offset: 0, color: catColor },
                  { offset: 1, color: 'rgba(0, 0, 0, 0.5)' }
                ]
              },
          borderColor: catColor,
          borderWidth: nodeBorders.l2 ? 0.8 : 0,
          shadowBlur: 20,
          shadowColor: catColor
        },
        label: {
          fontSize: nodeSizes.l2 * 0.26,
          fontWeight: '600',
          fontFamily: 'KingHwa_OldSong, serif',
          color: fenjiu_colors.ice_blue_light,
          formatter: `{name|${l2.name}}`,
          rich: {
            name: { fontFamily: 'KingHwa_OldSong, serif', fontSize: nodeSizes.l2 * 0.26, fontWeight: '600', color: fenjiu_colors.ice_blue_light }
          }
        },
        category: cat.id,
        draggable: true,
        tooltip: {
          formatter: `<b>${l2.name}</b><br/>山西${cat.name}相关节点`
        }
      });

      // 三级节点
      if (l2.children) {
        l2.children.forEach(l3 => {
          allNodes.push({
            id: l3.id,
            name: l3.name,
            symbol: 'circle',
            symbolSize: nodeSizes.l3 || 35,
            x: 500 + (Math.random() - 0.5) * 50,
            y: 375 + (Math.random() - 0.5) * 50,
            itemStyle: {
              color: 'transparent',
              borderColor: catColor,
              borderWidth: nodeBorders.l3 ? 1 : 0,
              borderType: 'dashed',
              shadowBlur: 10,
              shadowColor: catColor
            },
            label: {
              show: true,
              position: 'bottom',
              distance: 5,
              fontFamily: 'KingHwa_OldSong, serif',
              fontSize: (nodeSizes.l3 || 35) * 0.35,
              color: 'rgba(255, 255, 255, 0.8)'
            },
            category: cat.id,
            tooltip: {
              formatter: `<b>${l3.name}</b><br/>三晋文化代表性内容`
            }
          });
        });
      }
    });
  });

  return allNodes;
}
