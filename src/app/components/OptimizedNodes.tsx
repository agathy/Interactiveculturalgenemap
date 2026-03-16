import { GraphData } from './graphData';

// Helper: convert hex color to rgba string
function hexToRgba(hex: string, alpha: number): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,234,255,${alpha})`;
  return `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})`;
}

export function getOptimizedNodes(
  fenjiu_colors: any, 
  colors: any, 
  getShanxiMapSVG: any, 
  nodeSizes: any, 
  customSymbols: Record<string, string> = {}, 
  l1Radius: number = 260,
  rootParams: any = { showRootLabels: false, rootTitleFontSize: 32, rootColor: '#00EAFF', rootGlowIntensity: 3, rootShadowColor: '#082f6d', rootTitleShadowColor: '#94e3fe', nodeBorders: { root: false, l1: true, l2: false, l3: true } },
  graphData?: GraphData,
  colorLibrary?: string[]
) {
  const centerX = 500;
  const centerY = 375;
  
  const { showRootLabels, rootTitleFontSize, rootColor, rootGlowIntensity, rootShadowColor, rootTitleShadowColor, nodeBorders, currentZoom = 1 } = rootParams;

  if (!graphData) return [];

  const categoryCount = graphData.categories.length;
  const angleStep = 360 / categoryCount;
  const startAngle = -90;

  // 12色标题颜色库
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
    '#E07090',      // 11. 胭脂 (暖粉红，与冷色系形成对比张力)
    '#7ECECE',      // 12. 碧水
  ];

  const library = colorLibrary || defaultColorLibrary;

  // 一级节点轨道位置计算 - 自动均匀分布
  const l1Positions: Record<string, {x: number, y: number}> = {};
  graphData.categories.forEach((cat, index) => {
    const angle = startAngle + (index * angleStep);
    const rad = (angle * Math.PI) / 180;
    l1Positions[cat.id] = {
      x: centerX + l1Radius * Math.cos(rad),
      y: centerY + l1Radius * Math.sin(rad)
    };
  });

  const allNodes: any[] = [];

  // 根节点标签文本
  const rootTitle = graphData.root.name;
  const rootSubtitle = graphData.root.subtitle;

  // 中心节点
  allNodes.push({
    id: 'root',
    name: graphData.root.name.replace(/\n/g, ' '),
    symbol: customSymbols['root'] || getShanxiMapSVG(),
    symbolSize: nodeSizes.root * currentZoom,
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
      fontFamily: 'root-title-font, sans-serif',
      fontSize: rootTitleFontSize,
      fontWeight: 'bold',
      formatter: () => {
        if (!showRootLabels) return '';
        // rootTitle 可能包含换行符，需要保留
        // rootSubtitle 单独一行显示，使用实际的换行符
        return `{rootTitle|${rootTitle}}\n{rootSubtitle|${rootSubtitle}}`;
      },
      rich: {
        rootTitle: {
          fontFamily: 'root-title-font',
          fontSize: rootTitleFontSize,
          fontWeight: 'bold',
          lineHeight: rootTitleFontSize * 1.3,
          color: rootColor,
          padding: [0, 0, 8, 0],
          align: 'center',
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
          letterSpacing: 2
        }
      }
    },
    category: 'root',
    tooltip: {
      formatter: graphData.root.tooltip || `<b>${graphData.root.name.replace(/\n/g, '')}</b>`
    }
  });

  // 一级节点 - 默认使用 img 文件夹中的配图
  graphData.categories.forEach((cat, index) => {
    const catColor = colors[cat.name] || library[index % library.length];
    // 默认使用 img 文件夹中的图片 (1.png - 12.png)
    // public 目录下的文件可以直接通过根路径访问
    const imgNumber = (index % 12) + 1;
    // 使用相对于当前页面的完整 URL
    const defaultImgSymbol = `image://${window.location.origin}/img/${imgNumber}.png`;
    // 优先级：自定义符号 > 图片（默认）
    const finalSymbol = customSymbols[cat.id] || defaultImgSymbol;
    const isImageSymbol = finalSymbol.startsWith('image://');
    
    // 调试信息
    console.log(`Node ${cat.id}: symbol = ${finalSymbol}, isImage = ${isImageSymbol}`);
    
    allNodes.push({
      id: cat.id,
      name: cat.name,
      x: l1Positions[cat.id].x,
      y: l1Positions[cat.id].y,
      fixed: true,
      draggable: false,
      symbol: finalSymbol,
      symbolSize: nodeSizes.l1,
      symbolKeepAspect: true,
      // 图片节点不需要设置 color，让图片自然显示
      itemStyle: isImageSymbol
        ? {
            borderColor: catColor,
            borderWidth: nodeBorders.l1 ? 3 : 0,
            shadowBlur: 30,
            shadowColor: catColor,
            opacity: 1
          }
        : {
            color: {
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
        symbol: customSymbols[l2.id] || l2.symbol || 'circle',
        symbolSize: nodeSizes.l2,
        itemStyle: {
          color: (customSymbols[l2.id] || l2.symbol)?.startsWith('image://')
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
          borderWidth: (customSymbols[l2.id] || l2.symbol)?.startsWith('image://') ? 2 : (nodeBorders.l2 ? 0.8 : 0),
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
