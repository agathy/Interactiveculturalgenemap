import { useRef, useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { getXiaoKouWengSVG, getAmberSVG, RippleEffect } from './CulturalSymbols';
import { getOptimizedNodes } from './OptimizedNodes';
import { EnhancedTitle } from './EnhancedTitle';
import { Timeline } from './Timeline';
import { DataStats } from './DataStats';
import { OrbitRings } from './OrbitRings';
import { BrickPattern } from './BrickPattern';
import { LatticeGrid } from './LatticeGrid';
import { AnimatedBackground } from './AnimatedBackground';
import { StarField } from './StarField';
import { BreathingNodes } from './BreathingNodes';

export default function ShanxiCultureGraph() {
  const chartRef = useRef<any>(null);
  const [chartReady, setChartReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const rippleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rippleEffectRef = useRef<RippleEffect | null>(null);

  // 汾酒主题配色板（The Fenjiu Palette）
  const fenjiu_colors = {
    // 主视觉基调
    background: '#0A0B10',  // 太行夜墨
    
    // 清香灵魂色（琉璃冰蓝/汾河清波）
    ice_blue_light: '#E0FFFF',
    ice_blue: '#87CEFA',
    ice_blue_dark: '#5DADE2',
    
    // 匠心工艺色
    terracotta_red: '#CD5C5C',  // 陶土赭红
    amber_gold: '#DAA520',      // 高粱琥珀金
    
    // 文化点缀色
    apricot_pink: '#FFC0CB'  // 杏花微雨粉
  };

  // 定义五大文化基因的新配色（融入汾酒主题）
  const colors = {
    '根祖文化': fenjiu_colors.amber_gold,      // 高粱琥珀金
    '忠义文化': fenjiu_colors.terracotta_red,  // 陶土赭红
    '山河文化': fenjiu_colors.ice_blue,        // 琉璃冰蓝
    '古建文化': '#A0826D',                      // 古建土黄
    '酒魂文化': fenjiu_colors.ice_blue_light   // 汾河清波
  };

  // 加载山西省地图数据
  useEffect(() => {
    const loadShanxiMap = () => {
      try {
        // 直接使用简化的山西省地图数据（避免外部依赖）
        const geoJson = getSimplifiedShanxiMap();
        
        // 注册山西省地图
        echarts.registerMap('shanxi', geoJson);
        setMapLoaded(true);
        
        // 延迟设置chartReady，确保DOM已经渲染
        setTimeout(() => {
          setChartReady(true);
        }, 100);
      } catch (error) {
        // 静默处理错误，仍然显示图表但不显示地图
        setTimeout(() => {
          setChartReady(true);
        }, 100);
      }
    };

    loadShanxiMap();
  }, []);

  // 简化的山西省地图数据（更精确的轮廓）
  const getSimplifiedShanxiMap = () => {
    return {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: { name: "山西省", cp: [112.549248, 37.857014] },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [110.3, 34.5],
            [110.5, 34.3],
            [111.2, 34.2],
            [112.0, 34.3],
            [112.8, 34.4],
            [113.5, 34.6],
            [114.2, 35.0],
            [114.5, 35.5],
            [114.6, 36.2],
            [114.55, 36.8],
            [114.5, 37.5],
            [114.3, 38.2],
            [113.9, 38.8],
            [113.6, 39.3],
            [113.4, 39.7],
            [113.2, 40.0],
            [112.8, 40.3],
            [112.3, 40.5],
            [111.8, 40.45],
            [111.3, 40.3],
            [110.8, 40.0],
            [110.5, 39.6],
            [110.4, 39.2],
            [110.3, 38.7],
            [110.25, 38.2],
            [110.2, 37.6],
            [110.25, 37.0],
            [110.3, 36.4],
            [110.32, 35.8],
            [110.33, 35.2],
            [110.3, 34.5]
          ]]
        }
      }]
    };
  };

  // 生成山西省地图的SVG路径
  const getShanxiMapSVG = () => {
    // 简化的山西省轮廓SVG路径（相对坐标）
    return 'path://M 50,0 L 60,5 L 75,8 L 90,15 L 100,25 L 105,40 L 105,55 L 100,70 L 90,85 L 80,95 L 65,100 L 50,98 L 35,92 L 25,82 L 20,70 L 18,55 L 20,40 L 30,25 L 40,12 Z';
  };

  // 构建节点数据 - 使用优化后的节点配置
  const nodes = getOptimizedNodes(fenjiu_colors, colors, getShanxiMapSVG);
  
  // 原始节点数据（保留tooltip信息）
  const originalNodes = [
    // 中心节点 - 山西文化体系（地图形状）- 使用琉璃冰蓝色
    {
      id: 'root',
      name: '山西\n文化体系',
      symbol: getShanxiMapSVG(),
      symbolSize: 180,
      x: 500,
      y: 375,
      fixed: true,
      itemStyle: {
        color: `rgba(135, 206, 250, 0.12)`,  // 琉璃冰蓝，极高透明度
        borderColor: fenjiu_colors.ice_blue,
        borderWidth: 3,
        shadowBlur: 35,
        shadowColor: fenjiu_colors.ice_blue
      },
      label: {
        show: true,
        fontSize: 18,
        fontWeight: 'bold',
        color: fenjiu_colors.ice_blue_light,
        position: 'inside'
      },
      category: 'root',
      tooltip: {
        formatter: '<b>山西文化体系</b><br/><br/>五大文化基因汇聚<br/>构建三晋文明密码<br/><br/>表里山河 · 人文荟萃<br/>传承千年 · 根脉相连'
      }
    },
    
    // 一级节点：根祖文化
    {
      id: 'genzhu',
      name: '根祖文化',
      symbolSize: 70,
      itemStyle: {
        color: colors['根祖文化'],
        shadowBlur: 25,
        shadowColor: colors['根祖文化']
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      category: 'genzhu',
      tooltip: {
        formatter: '<b>根祖文化</b><br/>华夏文明起源密码<br/><br/>我们从哪里来?<br/><br/>以陶寺启文明、以尧帝定礼制<br/>以后土祠立祭祀、以大槐树系华人<br/><br/>关键场所: 万荣后土祠、临汾尧庙<br/>洪洞大槐树、襄汾陶寺遗址'
      }
    },

    // 根祖文化 - 二级节点
    {
      id: 'genzhu-1',
      name: '祭祀',
      symbolSize: 40,
      itemStyle: {
        color: colors['根祖文化'],
        shadowBlur: 15,
        shadowColor: colors['根祖文化']
      },
      category: 'genzhu',
      tooltip: {
        formatter: '<b>祭祀 - 精神源头</b><br/><br/>核心逻辑: 敬天、法祖、安民<br/><br/>关键事件:<br/>· 黄帝祭天<br/>· 汉武帝祭后土<br/>· 尧帝禅让<br/>· 大槐树移民祭祖<br/><br/>代表场所:<br/>万荣后土祠、临汾尧庙<br/>高平炎帝陵、洪洞大槐树<br/><br/>核心价值:<br/>华夏祭祀礼制源头<br/>天下华人寻根圣地'
      }
    },
    {
      id: 'genzhu-2',
      name: '建筑',
      symbolSize: 40,
      itemStyle: {
        color: colors['根祖文化'],
        shadowBlur: 15,
        shadowColor: colors['根祖文化']
      },
      category: 'genzhu',
      tooltip: {
        formatter: '<b>建筑 - 文明见证</b><br/><br/>核心逻辑:<br/>王都—祠庙—宗族建筑三级体系<br/><br/>代表文物:<br/>· 陶寺遗址<br/>· 朱书扁壶<br/>· 后土祠秋风楼<br/>· 尧庙五凤楼<br/><br/>核心场所:<br/>襄汾陶寺遗址、万荣后土祠<br/>闻喜裴柏村<br/><br/>核心价值:<br/>中国最早"都城范式"<br/>祠庙建筑活化石'
      }
    },
    {
      id: 'genzhu-3',
      name: '礼制',
      symbolSize: 40,
      itemStyle: {
        color: colors['根祖文化'],
        shadowBlur: 15,
        shadowColor: colors['根祖文化']
      },
      category: 'genzhu',
      tooltip: {
        formatter: '<b>礼制 - 秩序源头</b><br/><br/>核心逻辑:<br/>国家典制 + 宗族伦理<br/><br/>关键事件:<br/>· 陶寺观象授时<br/>· 禅让制<br/>· 祭祀制度化<br/>· 裴氏家法<br/><br/>代表文物:<br/>观象台、玉琮玉璧<br/>礼器、家训碑刻<br/><br/>核心价值:<br/>中国最早国家礼制<br/>宗法文化范本'
      }
    },
    {
      id: 'genzhu-4',
      name: '民俗',
      symbolSize: 40,
      itemStyle: {
        color: colors['根祖文化'],
        shadowBlur: 15,
        shadowColor: colors['根祖文化']
      },
      category: 'genzhu',
      tooltip: {
        formatter: '<b>民俗 - 活态传承</b><br/><br/>核心逻辑:<br/>移民记忆 + 始祖崇拜 + 民间信仰<br/><br/>关键事件:<br/>· 洪洞大槐树移民<br/>· 庙会<br/>· 炎帝祭祀<br/><br/>代表民俗:<br/>寻根祭祖大典、折槐为记<br/>小脚趾复形传说、晋南社火<br/><br/>核心场所:<br/>洪洞大槐树、河津高禖庙<br/>高平炎帝陵<br/><br/>核心价值:<br/>全球华人最强烈的宗族认同符号'
      }
    },

    // 一级节点：忠义文化
    {
      id: 'zhongyi',
      name: '忠义文化',
      symbolSize: 70,
      itemStyle: {
        color: colors['忠义文化'],
        shadowBlur: 25,
        shadowColor: colors['忠义文化']
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      category: 'zhongyi',
      tooltip: {
        formatter: '<b>忠义文化</b><br/>三晋精神道德高地<br/><br/>我们信仰什么?<br/><br/>以关公立忠义标杆<br/>以晋商树诚信典范<br/>以裴氏传家国情怀<br/>以廉吏显清正风骨<br/><br/>关键场所: 解州关帝庙<br/>平遥古城、乔家大院'
      }
    },

    // 忠义文化 - 二级节点
    {
      id: 'zhongyi-1',
      name: '人物',
      symbolSize: 40,
      itemStyle: {
        color: colors['忠义文化'],
        shadowBlur: 15,
        shadowColor: colors['忠义文化']
      },
      category: 'zhongyi',
      tooltip: {
        formatter: '<b>人物 - 忠义典范</b><br/><br/>核心逻辑:<br/>忠君爱国 + 义薄云天 + 清廉刚正<br/><br/>关键事件:<br/>· 关羽千里走单骑<br/>· 介子推割股奉君<br/>· 于成龙三举"卓异"<br/><br/>关键人物:<br/>关羽(武圣)、介子推<br/>狄仁杰、于成龙(天下廉吏第一)<br/><br/>代表场所:<br/>解州关帝庙、介休绵山<br/>闻喜裴柏村<br/><br/>核心价值:<br/>千秋忠义楷模,华人道德标杆'
      }
    },
    {
      id: 'zhongyi-2',
      name: '商道',
      symbolSize: 40,
      itemStyle: {
        color: colors['忠义文化'],
        shadowBlur: 15,
        shadowColor: colors['忠义文化']
      },
      category: 'zhongyi',
      tooltip: {
        formatter: '<b>商道 - 诚信天下</b><br/><br/>核心逻辑:<br/>诚信为本 + 义利兼顾 + 汇通天下<br/><br/>关键事件:<br/>· 日升昌票号创立(1823年)<br/>· 万里茶道开辟<br/>· 票号汇通九州<br/><br/>键人物:<br/>雷履泰、乔致庸<br/>王文素、常万达<br/><br/>代表场所:<br/>平遥古城、乔家大院<br/>曹家大院、常家庄园<br/><br/>核心价值:<br/>中国金融业开创者<br/>诚信经商文化典范'
      }
    },
    {
      id: 'zhongyi-3',
      name: '信仰',
      symbolSize: 40,
      itemStyle: {
        color: colors['忠义文化'],
        shadowBlur: 15,
        shadowColor: colors['忠义文化']
      },
      category: 'zhongyi',
      tooltip: {
        formatter: '<b>信仰 - 武庙之祖</b><br/><br/>核心逻辑:<br/>关公信仰全球化传播<br/><br/>关键事件:<br/>· 历代帝王41次敕封<br/>· 关帝庙遍天下<br/>· 信仰传播至五大洲<br/><br/>关键人物:<br/>关羽、历代敕封帝王、海外华人<br/><br/>代表场所:<br/>解州关帝祖庙<br/>常平关帝家庙<br/>全球3万余座关帝庙<br/><br/>核心价值:<br/>全球华人共同的精神信仰<br/>忠义文化的世界符号'
      }
    },
    {
      id: 'zhongyi-4',
      name: '家训',
      symbolSize: 40,
      itemStyle: {
        color: colors['忠义文化'],
        shadowBlur: 15,
        shadowColor: colors['忠义文化']
      },
      category: 'zhongyi',
      tooltip: {
        formatter: '<b>家训 - 精神赓续</b><br/><br/>核心逻辑:<br/>家训传世 + 制度化传承<br/><br/>关键事件:<br/>· 裴氏59位宰相传奇<br/>· 晋商立号规<br/>· 家族制度传承<br/><br/>关键人物:<br/>河东裴氏、晋商家族<br/>历代家族传人<br/><br/>代表文物:<br/>《裴氏家训》、晋商家谱<br/>票号账本、家族碑刻<br/><br/>核心价值:<br/>家国情怀代代相传<br/>义利观影响至今'
      }
    },

    // 一级节点：山河文化
    {
      id: 'shanhe',
      name: '山河文化',
      symbolSize: 70,
      itemStyle: {
        color: colors['山河文化'],
        shadowBlur: 25,
        shadowColor: colors['山河文化']
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      category: 'shanhe',
      tooltip: {
        formatter: '<b>山河文化</b><br/>表里山河壮美气象<br/><br/>我们生于何地?<br/><br/>以黄河为文明母脉<br/>以太行为东方屏障<br/>以雁门为九塞雄关<br/>以盆地为四塞之固<br/><br/>关键场所: 壶口瀑布、雁门关<br/>太行山、恒山悬空寺'
      }
    },

    // 山河文化 - 二级节点
    {
      id: 'shanhe-1',
      name: '河流',
      symbolSize: 40,
      itemStyle: {
        color: colors['山河文化'],
        shadowBlur: 15,
        shadowColor: colors['山河文化']
      },
      category: 'shanhe',
      tooltip: {
        formatter: '<b>河流 - 文明血脉</b><br/><br/>核心逻辑:<br/>黄河母亲 + 汾河润泽<br/><br/>关键事件:<br/>· 大禹龙门治水<br/>· 壶口瀑布奇观<br/>· 汾河流域孕育晋文化<br/><br/>关键人物:<br/>大禹、后稷、汾河流域先民<br/><br/>代表场所:<br/>壶口瀑布、碛口古镇<br/>汾河二库、龙门<br/><br/>核心价值:<br/>黄河文明核心区<br/>三晋文化发源地'
      }
    },
    {
      id: 'shanhe-2',
      name: '山脉',
      symbolSize: 40,
      itemStyle: {
        color: colors['山河文化'],
        shadowBlur: 15,
        shadowColor: colors['山河文化']
      },
      category: 'shanhe',
      tooltip: {
        formatter: '<b>山脉 - 脊梁屏障</b><br/><br/>核心逻辑:<br/>太行巍峨 + 吕梁绵延 + 恒山北镇<br/><br/>关键事件:<br/>· 太行八陉通晋冀<br/>· 恒山祭祀传统<br/>· 太行抗战根据地<br/><br/>关键人物:<br/>北岳大帝、历代守关将领<br/>八路军将士<br/><br/>代表场所:<br/>恒山悬空寺、太行大峡谷<br/>吕梁山脉、王莽岭<br/><br/>核心价值:<br/>华北屋脊,天然屏障,红色圣地'
      }
    },
    {
      id: 'shanhe-3',
      name: '关隘',
      symbolSize: 40,
      itemStyle: {
        color: colors['山河文化'],
        shadowBlur: 15,
        shadowColor: colors['山河文化']
      },
      category: 'shanhe',
      tooltip: {
        formatter: '<b>关隘 - 边塞雄关</b><br/><br/>核心逻辑:<br/>长城防线 + 九塞尊崇<br/><br/>关键事件:<br/>· 雁门关御敌<br/>· 娘子关天险<br/>· 平型关大捷<br/><br/>关键人物:<br/>李牧、卫青、霍去病<br/>杨家将、林彪<br/><br/>代表场所:<br/>雁门关、娘子关<br/>平型关、杀虎口<br/><br/>核心价值:<br/>万里长城精华段<br/>农耕游牧文化分界线'
      }
    },
    {
      id: 'shanhe-4',
      name: '盆地',
      symbolSize: 40,
      itemStyle: {
        color: colors['山河文化'],
        shadowBlur: 15,
        shadowColor: colors['山河文化']
      },
      category: 'shanhe',
      tooltip: {
        formatter: '<b>盆地 - 表里山河</b><br/><br/>核心逻辑:<br/>四塞之固 + 文化熔炉<br/><br/>关键事件:<br/>· 国称霸春秋<br/>· 三家分晋<br/>· 太原龙城军事重镇<br/><br/>关键人物:<br/>晋文公、赵襄子<br/>历代驻守将领<br/><br/>代表场所:<br/>太原盆地、临汾盆地<br/>运城盆地、长治盆地<br/><br/>核心价值:<br/>易守难攻的战略要地<br/>农耕文明的富庶之地'
      }
    },

    // 一级节点：古建文化
    {
      id: 'gujian',
      name: '古建文化',
      symbolSize: 70,
      itemStyle: {
        color: colors['古建文化'],
        shadowBlur: 25,
        shadowColor: colors['古建文化']
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      category: 'gujian',
      tooltip: {
        formatter: '<b>古建文化</b><br/>中国古筑博物馆<br/><br/>我们创造了什么?<br/><br/>以唐宋木构冠绝天下<br/>以彩塑壁画神韵传神<br/>以石窟寺观中西交融<br/>以古城格局完整留存<br/><br/>关键场所: 佛光寺、应县木塔<br/>云冈石窟、平遥古城'
      }
    },

    // 建文化 - 二级节点
    {
      id: 'gujian-1',
      name: '木构',
      symbolSize: 40,
      itemStyle: {
        color: colors['古建文化'],
        shadowBlur: 15,
        shadowColor: colors['古建文化']
      },
      category: 'gujian',
      tooltip: {
        formatter: '<b>木构 - 千年孤例</b><br/><br/>核心逻辑:<br/>唐宋遗构 + 营造法式 + 技艺传承<br/><br/>关键事件:<br/>· 佛光寺东大殿建成(857年)<br/>· 应县木塔屹立千年<br/>· 梁林发现国宝<br/><br/>关键人物:<br/>宁公遇、历代营造工匠<br/>梁思成、林徽因<br/><br/>代表文物:<br/>佛光寺东大殿、南禅寺大殿<br/>应县木塔、晋祠圣母殿<br/><br/>核心价值:<br/>全国70%以上元代以前木构在山西<br/>中国古建筑标本库'
      }
    },
    {
      id: 'gujian-2',
      name: '彩塑',
      symbolSize: 40,
      itemStyle: {
        color: colors['古建文化'],
        shadowBlur: 15,
        shadowColor: colors['古建文化']
      },
      category: 'gujian',
      tooltip: {
        formatter: '<b>彩塑 - 雕塑圣地</b><br/><br/>核心逻辑:<br/>唐宋彩塑巅峰 + 匠师流派 + 神韵传神<br/><br/>关键事件:<br/>· 双林寺彩塑艺术宝库<br/>· 晋祠侍女像誉为"东方维纳斯"<br/><br/>关键人物:<br/>历代塑像名匠<br/><br/>代表场所:<br/>平遥双林寺、晋祠圣母殿<br/>太原崇善寺、大同华严寺<br/><br/>核心价值:<br/>中国彩塑艺术最高水平<br/>神态传神冠绝天下'
      }
    },
    {
      id: 'gujian-3',
      name: '石窟',
      symbolSize: 40,
      itemStyle: {
        color: colors['古建文化'],
        shadowBlur: 15,
        shadowColor: colors['古建文化']
      },
      category: 'gujian',
      tooltip: {
        formatter: '<b>石窟 - 佛道双辉</b><br/><br/>核心逻辑:<br/>皇家开凿 + 佛道并存 + 中西交融<br/><br/>关键事件:<br/>· 北魏开凿云冈石窟<br/>· 唐代天龙艺术巅峰<br/>· 悬空寺千年不坠<br/><br/>关键人物:<br/>北魏文成帝、冯太后<br/>武则天、历代营造僧道<br/><br/>代表场所:<br/>云冈石窟、天龙山石窟<br/>悬空寺、永乐宫<br/><br/>核心价值:<br/>佛教东传艺术见证<br/>道教壁画艺术宝库'
      }
    },
    {
      id: 'gujian-4',
      name: '城池',
      symbolSize: 40,
      itemStyle: {
        color: colors['古建文化'],
        shadowBlur: 15,
        shadowColor: colors['古建文化']
      },
      category: 'gujian',
      tooltip: {
        formatter: '<b>城池 - 古城标本</b><br/><br/>核心逻辑:<br/>完整格局 + 商业繁荣 + 活态传承<br/><br/>关键事件:<br/>· 平遥古城明清格局完整保存<br/>· 票号发源金融中心<br/><br/>关键人物:<br/>晋商巨贾、历代知县、古城居民<br/><br/>代表场所:<br/>平遥古城、大同古城<br/>新绛古城、碛口古镇<br/><br/>核心价值:<br/>中国保存最完整的古城标本<br/>明清城市文化活化石'
      }
    },

    // 一级节点：酒魂文化
    {
      id: 'jiuhun',
      name: '酒魂文化',
      symbolSize: 70,
      itemStyle: {
        color: colors['酒魂文化'],
        shadowBlur: 25,
        shadowColor: colors['酒魂文化']
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold'
      },
      category: 'jiuhun',
      tooltip: {
        formatter: '<b>酒魂文化</b><br/>华夏酒文明传承密码<br/><br/>我们如何传承文明?<br/><br/>以仰韶文化证华夏酒源<br/>以清香工艺定白酒标准<br/>以杏花诗篇传千古佳话<br/>以国际荣耀扬中国品牌<br/><br/>关键场所: 杏花村遗址<br/>汾酒老作坊、汾酒博物馆'
      }
    },

    // 酒魂文化 - 二级节点
    {
      id: 'jiuhun-1',
      name: '考古',
      symbolSize: 40,
      itemStyle: {
        color: colors['酒魂文化'],
        shadowBlur: 15,
        shadowColor: colors['酒魂文化']
      },
      category: 'jiuhun',
      tooltip: {
        formatter: '<b>考古 - 华夏酒源</b><br/><br/>核心逻辑:<br/>仰韶文化 + 持续酿造 + 考古证据链<br/><br/>关键事件:<br/>· 小口尖底瓮出土杏花村<br/>· 汾酒作坊遗址入选<br/>  全国十大考古发现<br/><br/>关键人物:<br/>杏花村先民、历代酿酒匠人<br/>考古学者<br/><br/>代表文物:<br/>小口尖底瓮、汾酒作坊遗址<br/>地缸发酵池、历代酒器<br/><br/>核心价值:<br/>中国酿酒起源地之一<br/>6000年不间断酿造传承'
      }
    },
    {
      id: 'jiuhun-2',
      name: '技艺',
      symbolSize: 40,
      itemStyle: {
        color: colors['酒魂文化'],
        shadowBlur: 15,
        shadowColor: colors['酒魂文化']
      },
      category: 'jiuhun',
      tooltip: {
        formatter: '<b>技艺 - 清香鼻祖</b><br/><br/>核心逻辑:<br/>古法传承 + 工艺独创 + 标准制定<br/><br/>关键事件:<br/>· 汾清酒载入《北齐书》<br/>· 1915年巴拿马获奖<br/>· 1952年制定首个白酒国标<br/><br/>关键人物:<br/>历代汾酒酿酒大师<br/>秦含章、国家级白酒评委<br/><br/>代表技艺:<br/>清蒸二次清、固态地缸发酵<br/>看花摘酒、陶坛陈酿<br/><br/>核心价值:<br/>中国清香型白酒开创者与标准制定者<br/>国家级非遗技艺'
      }
    },
    {
      id: 'jiuhun-3',
      name: '文学',
      symbolSize: 40,
      itemStyle: {
        color: colors['酒魂文化'],
        shadowBlur: 15,
        shadowColor: colors['酒魂文化']
      },
      category: 'jiuhun',
      tooltip: {
        formatter: '<b>文学 - 诗酒千年</b><br/><br/>核心逻辑:<br/>文人雅士 + 诗词歌赋 + 文化符号<br/><br/>关键事件:<br/>· 杜牧《清明》千古绝唱<br/>  "借问酒家何处有,<br/>   牧童遥指杏花村"<br/>· 欧阳修范仲淹品评<br/>· 红楼金瓶多次提及<br/><br/>关键人物:<br/>杜牧、欧阳修、范仲淹、傅山<br/><br/>代表作品:<br/>《清明》《汾州》<br/>《金瓶梅》《红楼梦》<br/><br/>核心价值:<br/>中国最具文学意象的酒品牌<br/>诗酒文化的经典符号'
      }
    },
    {
      id: 'jiuhun-4',
      name: '荣耀',
      symbolSize: 40,
      itemStyle: {
        color: colors['酒魂文化'],
        shadowBlur: 15,
        shadowColor: colors['酒魂文化']
      },
      category: 'jiuhun',
      tooltip: {
        formatter: '<b>荣耀 - 世界认可</b><br/><br/>核心逻辑:<br/>国际荣誉 + 国酒地位 + 行业引领<br/><br/>关键事件:<br/>· 1915年巴拿马甲等大奖章<br/>· 连续五届国家名酒<br/>· 国宴用酒<br/><br/>关键人物:<br/>杨得龄<br/>历任汾酒厂厂长董事长<br/><br/>代表荣誉:<br/>巴拿马甲等大奖章<br/>国家名酒称号<br/>清香型国家标准制定者<br/><br/>核心价值:<br/>中国白酒走向世界的先驱<br/>国家名片级品牌'
      }
    }
  ];

  // 构建连线数据 - 使用琉璃冰蓝连接中心节点
  const links = [
    // 中心节点到五大文化基因 - 使用琉璃冰蓝，线条更细
    { source: 'root', target: 'genzhu', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'zhongyi', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'shanhe', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'gujian', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    { source: 'root', target: 'jiuhun', lineStyle: { color: fenjiu_colors.ice_blue, opacity: 0.3, width: 1, curveness: 0 } },
    
    // 根祖文化到二级节点
    { source: 'genzhu', target: 'genzhu-1', lineStyle: { color: colors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'genzhu', target: 'genzhu-2', lineStyle: { color: colors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'genzhu', target: 'genzhu-3', lineStyle: { color: colors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'genzhu', target: 'genzhu-4', lineStyle: { color: colors['根祖文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    // 忠义文化到二级节点
    { source: 'zhongyi', target: 'zhongyi-1', lineStyle: { color: colors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'zhongyi', target: 'zhongyi-2', lineStyle: { color: colors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'zhongyi', target: 'zhongyi-3', lineStyle: { color: colors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'zhongyi', target: 'zhongyi-4', lineStyle: { color: colors['忠义文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    // 山河文化到二级节点
    { source: 'shanhe', target: 'shanhe-1', lineStyle: { color: colors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'shanhe', target: 'shanhe-2', lineStyle: { color: colors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'shanhe', target: 'shanhe-3', lineStyle: { color: colors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'shanhe', target: 'shanhe-4', lineStyle: { color: colors['山河文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    // 古建文化到二级节点
    { source: 'gujian', target: 'gujian-1', lineStyle: { color: colors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'gujian', target: 'gujian-2', lineStyle: { color: colors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'gujian', target: 'gujian-3', lineStyle: { color: colors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'gujian', target: 'gujian-4', lineStyle: { color: colors['古建文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },

    // 酒魂文化到二级节点
    { source: 'jiuhun', target: 'jiuhun-1', lineStyle: { color: colors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'jiuhun', target: 'jiuhun-2', lineStyle: { color: colors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'jiuhun', target: 'jiuhun-3', lineStyle: { color: colors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } },
    { source: 'jiuhun', target: 'jiuhun-4', lineStyle: { color: colors['酒魂文化'], opacity: 0.2, width: 0.5, curveness: 0.2 } }
  ];

  // 定义分类
  const categories = [
    { name: 'root' },
    { name: 'genzhu' },
    { name: 'zhongyi' },
    { name: 'shanhe' },
    { name: 'gujian' },
    { name: 'jiuhun' }
  ];

  // ECharts 配置选项 - 使用汾酒主题配色
  const getOption = () => {
    const option: any = {
      backgroundColor: 'transparent',  // 改为透明，让底层背景效果显示出来
      tooltip: {
        show: true,
        backgroundColor: 'rgba(10, 11, 16, 0.95)',  // 太行夜墨背景
        borderColor: fenjiu_colors.ice_blue,        // 琉璃冰蓝边框
        borderWidth: 1,
        textStyle: {
          color: fenjiu_colors.ice_blue_light,      // 汾河清波文字
          fontSize: 13,
          lineHeight: 20
        },
        padding: [15, 20],
        extraCssText: 'box-shadow: 0 8px 32px rgba(135, 206, 250, 0.3); backdrop-filter: blur(12px);'
      },
      series: []
    };

    // 添加graph系列
    option.series.push({
      type: 'graph',
      layout: 'force',
      data: nodes,
      links: links,
      categories: categories,
      roam: true,
      draggable: true,
      zoom: 1,
      scaleLimit: {
        min: 0.4,
        max: 3
      },
      force: {
        repulsion: 1200,  // 增大斥力，让节点更分散
        gravity: 0.08,    // 减小引力，让节点离中心远一些
        edgeLength: [180, 280],  // 增加连线长度
        layoutAnimation: true,
        friction: 0.6
      },
      label: {
        show: true,
        position: 'inside',
        fontSize: 13,
        color: '#fff',
        formatter: (params: any) => {
          // 根据节点大小判断是一级还是二级节点
          if (params.data.symbolSize >= 60) {
            // 一级节点：在圆内显示，使用换行
            return params.data.name.replace(/文化$/, '\n文化');
          } else {
            // 二级节点：直接显示名称
            return params.data.name;
          }
        },
        fontWeight: 'bold',
        lineHeight: 18,
        textShadowBlur: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffsetX: 0,
        textShadowOffsetY: 0
      },
      labelLayout: {
        hideOverlap: false
      },
      emphasis: {
        focus: 'adjacency',
        label: {
          fontSize: 16,
          fontWeight: 'bold'
        },
        lineStyle: {
          width: 5,
          shadowBlur: 20
        }
      },
      lineStyle: {
        color: 'source',
        curveness: 0.2,
        opacity: 0.4
      }
    });

    return option;
  };

  // 添加汾水等高线隐纹背景效果
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';  // 在粒子背后
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 生成模拟山西地形的等高线数据
    const contourLines: any[] = [];
    const lineCount = 25;  // 等高线数量

    for (let i = 0; i < lineCount; i++) {
      const points: any[] = [];
      const baseY = (canvas.height / lineCount) * i;
      const amplitude = 50 + Math.random() * 80;  // 波动幅度
      const frequency = 0.002 + Math.random() * 0.003;  // 频率
      const phase = Math.random() * Math.PI * 2;  // 初始相位
      
      for (let x = 0; x < canvas.width + 100; x += 15) {
        const y = baseY + 
                  Math.sin(x * frequency + phase) * amplitude +
                  Math.sin(x * frequency * 2 + phase * 1.5) * (amplitude * 0.3);
        points.push({ x, y });
      }
      
      contourLines.push({
        points,
        phase,
        speed: 0.0001 + Math.random() * 0.0001,  // 极慢的流动速度
        opacity: 0.15 + Math.random() * 0.15  // 增强：15%-30% 透明度（原来5%-10%）
      });
    }

    let time = 0;

    function animateContours() {
      if (!ctx) return;
      
      // 清除画布，不填充背景色
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.3;

      // 绘制等高线
      contourLines.forEach(line => {
        ctx.beginPath();
        line.points.forEach((point: any, index: number) => {
          const animatedY = point.y + Math.sin(time * line.speed + point.x * 0.002) * 8;
          
          if (index === 0) {
            ctx.moveTo(point.x, animatedY);
          } else {
            ctx.lineTo(point.x, animatedY);
          }
        });
        
        // 琉璃冰蓝发光等高线
        ctx.strokeStyle = `rgba(135, 206, 250, ${line.opacity})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 3;
        ctx.shadowColor = `rgba(135, 206, 250, ${line.opacity * 2})`;
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

  // 添加清香气韵流（底部蒸汽效果）
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.bottom = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '40%';  // 占屏幕下方40%
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.4;

    // 蒸汽粒子
    const vaporParticles: any[] = [];
    const particleCount = 60;

    class VaporParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      maxOpacity: number;
      life: number;

      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 50;
        this.size = 40 + Math.random() * 80;
        this.speedY = -0.3 - Math.random() * 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0;
        this.maxOpacity = 0.18 + Math.random() * 0.22;  // 增强透明度：18%-40%（原来8%-20%）
        this.life = 0;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life += 0.005;
        
        // 透明度渐变：淡入->持续->淡出
        if (this.life < 0.2) {
          this.opacity = (this.life / 0.2) * this.maxOpacity;
        } else if (this.life > 0.8) {
          this.opacity = ((1 - this.life) / 0.2) * this.maxOpacity;
        } else {
          this.opacity = this.maxOpacity;
        }

        // 添加波动效果
        this.x += Math.sin(this.life * 10) * 0.5;

        // 重置粒子
        if (this.y < -this.size || this.life > 1) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        // 冷色调蒸汽：琉璃冰蓝到白色
        gradient.addColorStop(0, `rgba(224, 255, 255, ${this.opacity})`);  // 汾河清波
        gradient.addColorStop(0.4, `rgba(135, 206, 250, ${this.opacity * 0.6})`);  // 琉璃冰蓝
        gradient.addColorStop(1, `rgba(135, 206, 250, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      vaporParticles.push(new VaporParticle());
    }

    function animateVapor() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      vaporParticles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animateVapor);
    }

    animateVapor();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.4;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.removeChild(canvas);
    };
  }, []);

  // 添加涟漪效果
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '10';
    canvas.style.pointerEvents = 'none';
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

    // 监听ECharts点击事件 - 使用鼠标事件坐标
    const setupClickHandler = () => {
      if (chartRef.current) {
        const chart = chartRef.current.getEchartsInstance();
        
        chart.on('click', (params: any) => {
          if (params.componentType === 'series' && params.dataType === 'node') {
            // 直接使用鼠标事件的屏幕坐标
            if (params.event && params.event.event) {
              const mouseEvent = params.event.event;
              const screenX = mouseEvent.clientX;
              const screenY = mouseEvent.clientY;
              
              const color = params.data.itemStyle?.color || fenjiu_colors.ice_blue;
              
              // 添加涟漪效果
              rippleEffect.addRipple(screenX, screenY, color);
            }
          }
        });
      }
    };

    // 延迟设置点击处理器，确保图表已完全渲染
    const timer = setTimeout(setupClickHandler, 500);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        const chart = chartRef.current.getEchartsInstance();
        chart.off('click');
      }
      document.body.removeChild(canvas);
    };
  }, [chartReady]);

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: fenjiu_colors.background }}>  {/* 太行夜墨 */}
      {/* 动态渐变背景层 */}
      <AnimatedBackground fenjiu_colors={fenjiu_colors} />
      
      {/* 星空粒子层 */}
      <StarField fenjiu_colors={fenjiu_colors} />
      
      {/* 晋砖拓片肌理 SVG Pattern */}
      <BrickPattern />
      
      {/* 古建窗棂网格 SVG Pattern */}
      <LatticeGrid />
      
      {/* 标题 - 使用增强的标题组件 */}
      <EnhancedTitle fenjiu_colors={fenjiu_colors} />

      {/* 左侧时间轴 */}
      <Timeline fenjiu_colors={fenjiu_colors} />

      {/* 右侧数据统计 */}
      <DataStats fenjiu_colors={fenjiu_colors} />

      {/* ECharts 图表 */}
      {chartReady && (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
          {/* 呼吸节点光晕层 */}
          <BreathingNodes fenjiu_colors={fenjiu_colors} colors={colors} />
          
          {/* 同心圆轨道 */}
          <OrbitRings fenjiu_colors={fenjiu_colors} />
          
          <ReactECharts
            ref={chartRef}
            option={getOption()}
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      )}

      {/* 地图加载状态 */}
      {!mapLoaded && chartReady && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm"
             style={{ color: fenjiu_colors.ice_blue_light }}>
          正在加载山西省地图...
        </div>
      )}

      {/* 涟漪效果 */}
      <canvas ref={rippleCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
    </div>
  );
}