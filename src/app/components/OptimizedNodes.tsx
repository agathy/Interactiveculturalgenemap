// 优化后的节点配置 - 丰富的视觉样式和文字装饰

import { getXiaoKouWengSVG, getAmberSVG } from './CulturalSymbols';
import { tooltipConfig } from './TooltipConfig';

export function getOptimizedNodes(fenjiu_colors: any, colors: any, getShanxiMapSVG: any) {
  return [
    // 中心节点 - 山西文化体系（圆形，多层次）
    {
      id: 'root',
      name: '山西文化体系',
      symbol: 'circle',
      symbolSize: 200,
      x: 500,
      y: 375,
      fixed: true,
      itemStyle: {
        color: `rgba(135, 206, 250, 0.08)`,
        borderColor: fenjiu_colors.ice_blue,
        borderWidth: 4,
        shadowBlur: 60,
        shadowColor: fenjiu_colors.ice_blue,
        opacity: 0.95
      },
      label: {
        show: true,
        fontSize: 20,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        position: 'inside',
        lineHeight: 28,
        formatter: '山西\n文化体系'
      },
      category: 'root',
      tooltip: {
        formatter: tooltipConfig['root']
      },
      // 添加呼吸效果
      rippleEffect: {
        period: 6,
        scale: 3,
        brushType: 'stroke',
        color: fenjiu_colors.ice_blue
      }
    },
    
    // 一级节点：根祖文化（圆形，多层次）
    {
      id: 'genzhu',
      name: '根祖文化',
      symbol: 'circle',
      symbolSize: 85,
      itemStyle: {
        color: colors['根祖文化'],
        borderColor: fenjiu_colors.ice_blue_light,
        borderWidth: 3,
        shadowBlur: 35,
        shadowColor: colors['根祖文化'],
        opacity: 0.85
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        distance: 12,
        formatter: '根祖文化\n华夏起源'
      },
      category: 'genzhu',
      tooltip: {
        formatter: tooltipConfig['genzhu']
      },
      rippleEffect: {
        period: 4,
        scale: 2.5,
        brushType: 'stroke',
        color: colors['根祖文化']
      }
    },

    // 一级节点：忠义文化（圆形，多层次）
    {
      id: 'zhongyi',
      name: '忠义文化',
      symbol: 'circle',
      symbolSize: 85,
      itemStyle: {
        color: colors['忠义文化'],
        borderColor: fenjiu_colors.ice_blue_light,
        borderWidth: 3,
        shadowBlur: 35,
        shadowColor: colors['忠义文化'],
        opacity: 0.85
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        distance: 12,
        formatter: '忠义文化\n精神高地'
      },
      category: 'zhongyi',
      tooltip: {
        formatter: tooltipConfig['zhongyi']
      },
      rippleEffect: {
        period: 4,
        scale: 2.5,
        brushType: 'stroke',
        color: colors['忠义文化']
      }
    },

    // 一级节点：山河文化（圆形，多层次）
    {
      id: 'shanhe',
      name: '山河文化',
      symbol: 'circle',
      symbolSize: 85,
      itemStyle: {
        color: colors['山河文化'],
        borderColor: fenjiu_colors.ice_blue_light,
        borderWidth: 3,
        shadowBlur: 35,
        shadowColor: colors['山河文化'],
        opacity: 0.85
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        distance: 12,
        formatter: '山河文化\n表里乾坤'
      },
      category: 'shanhe',
      tooltip: {
        formatter: tooltipConfig['shanhe']
      },
      rippleEffect: {
        period: 4,
        scale: 2.5,
        brushType: 'stroke',
        color: colors['山河文化']
      }
    },

    // 一级节点：古建文化（圆形，多层次）
    {
      id: 'gujian',
      name: '古建文化',
      symbol: 'circle',
      symbolSize: 85,
      itemStyle: {
        color: colors['古建文化'],
        borderColor: fenjiu_colors.ice_blue_light,
        borderWidth: 3,
        shadowBlur: 35,
        shadowColor: colors['古建文化'],
        opacity: 0.85
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        distance: 12,
        formatter: '古建文化\n匠心传世'
      },
      category: 'gujian',
      tooltip: {
        formatter: tooltipConfig['gujian']
      },
      rippleEffect: {
        period: 4,
        scale: 2.5,
        brushType: 'stroke',
        color: colors['古建文化']
      }
    },

    // 一级节点：酒魂文化（圆形，多层次）
    {
      id: 'jiuhun',
      name: '酒魂文化',
      symbol: 'circle',
      symbolSize: 85,
      itemStyle: {
        color: colors['酒魂文化'],
        borderColor: fenjiu_colors.ice_blue_light,
        borderWidth: 3,
        shadowBlur: 35,
        shadowColor: colors['酒魂文化'],
        opacity: 0.85
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        distance: 12,
        formatter: '酒魂文化\n清香鼻祖'
      },
      category: 'jiuhun',
      tooltip: {
        formatter: tooltipConfig['jiuhun']
      },
      rippleEffect: {
        period: 4,
        scale: 2.5,
        brushType: 'stroke',
        color: colors['酒魂文化']
      }
    },

    // 二级节点模板生成函数
    ...generateSecondLevelNodes('genzhu', colors['根祖文化'], fenjiu_colors, [
      { id: 'genzhu-1', name: '祭祀' },
      { id: 'genzhu-2', name: '建筑' },
      { id: 'genzhu-3', name: '礼制' },
      { id: 'genzhu-4', name: '民俗' }
    ]),

    ...generateSecondLevelNodes('zhongyi', colors['忠义文化'], fenjiu_colors, [
      { id: 'zhongyi-1', name: '人物' },
      { id: 'zhongyi-2', name: '商道' },
      { id: 'zhongyi-3', name: '信仰' },
      { id: 'zhongyi-4', name: '家训' }
    ]),

    ...generateSecondLevelNodes('shanhe', colors['山河文化'], fenjiu_colors, [
      { id: 'shanhe-1', name: '河流' },
      { id: 'shanhe-2', name: '山脉' },
      { id: 'shanhe-3', name: '关隘' },
      { id: 'shanhe-4', name: '盆地' }
    ]),

    ...generateSecondLevelNodes('gujian', colors['古建文化'], fenjiu_colors, [
      { id: 'gujian-1', name: '木构' },
      { id: 'gujian-2', name: '彩塑' },
      { id: 'gujian-3', name: '石窟' },
      { id: 'gujian-4', name: '城池' }
    ]),

    ...generateSecondLevelNodes('jiuhun', colors['酒魂文化'], fenjiu_colors, [
      { id: 'jiuhun-1', name: '考古' },
      { id: 'jiuhun-2', name: '技艺' },
      { id: 'jiuhun-3', name: '文学' },
      { id: 'jiuhun-4', name: '荣耀' }
    ])
  ];
}

// 生成二级节点的辅助函数
function generateSecondLevelNodes(category: string, color: string, fenjiu_colors: any, nodes: any[]) {
  return nodes.map(node => ({
    id: node.id,
    name: node.name,
    symbol: 'circle',
    symbolSize: 50,
    itemStyle: {
      color: `${color}99`,  // 60% opacity
      borderColor: color,
      borderWidth: 2,
      shadowBlur: 20,
      shadowColor: color
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: fenjiu_colors.ice_blue_light,
      formatter: `{name|${node.name}}`,
      rich: {
        name: { fontSize: 13, fontWeight: '600', color: fenjiu_colors.ice_blue_light }
      }
    },
    category: category,
    tooltip: {
      formatter: tooltipConfig[node.id]
    }
  }));
}