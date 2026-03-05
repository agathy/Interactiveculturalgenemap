// 地图服务模块 - 动态加载各地区地图数据
// 使用阿里云 DataV 地理数据服务

/** 地理边界框（经纬度），与 geoJsonToSVGPath 使用完全相同的坐标系 */
export interface MapBounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

/** 从 GeoJSON 提取精确边界框 */
export function extractGeoJsonBounds(geoJson: any): MapBounds | null {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  const features = geoJson?.features || (geoJson?.type === 'Feature' ? [geoJson] : []);
  for (const feature of features) {
    const geom = feature?.geometry;
    if (!geom) continue;
    const rings: [number, number][][] =
      geom.type === 'Polygon' ? [geom.coordinates[0]] :
      geom.type === 'MultiPolygon' ? geom.coordinates.map((p: any) => p[0]) : [];
    for (const ring of rings) {
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }
    }
  }
  if (!isFinite(minLng)) return null;
  return { minLng, maxLng, minLat, maxLat };
}

// 预定义支持的地区及其地图数据URL
export const REGION_MAPS: Record<string, {
  name: string;
  geoJsonUrl: string;
  adcode: string;
}> = {
  'shanxi': {
    name: '山西省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/140000_full.json',
    adcode: '140000'
  },
  'beijing': {
    name: '北京市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/110000_full.json',
    adcode: '110000'
  },
  'tianjin': {
    name: '天津市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/120000_full.json',
    adcode: '120000'
  },
  'hebei': {
    name: '河北省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/130000_full.json',
    adcode: '130000'
  },
  'neimenggu': {
    name: '内蒙古自治区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/150000_full.json',
    adcode: '150000'
  },
  'liaoning': {
    name: '辽宁省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/210000_full.json',
    adcode: '210000'
  },
  'jilin': {
    name: '吉林省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/220000_full.json',
    adcode: '220000'
  },
  'heilongjiang': {
    name: '黑龙江省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/230000_full.json',
    adcode: '230000'
  },
  'shanghai': {
    name: '上海市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/310000_full.json',
    adcode: '310000'
  },
  'jiangsu': {
    name: '江苏省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/320000_full.json',
    adcode: '320000'
  },
  'zhejiang': {
    name: '浙江省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/330000_full.json',
    adcode: '330000'
  },
  'anhui': {
    name: '安徽省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/340000_full.json',
    adcode: '340000'
  },
  'fujian': {
    name: '福建省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/350000_full.json',
    adcode: '350000'
  },
  'jiangxi': {
    name: '江西省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/360000_full.json',
    adcode: '360000'
  },
  'shandong': {
    name: '山东省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/370000_full.json',
    adcode: '370000'
  },
  'henan': {
    name: '河南省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/410000_full.json',
    adcode: '410000'
  },
  'hubei': {
    name: '湖北省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/420000_full.json',
    adcode: '420000'
  },
  'hunan': {
    name: '湖南省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/430000_full.json',
    adcode: '430000'
  },
  'guangdong': {
    name: '广东省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/440000_full.json',
    adcode: '440000'
  },
  'guangxi': {
    name: '广西壮族自治区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/450000_full.json',
    adcode: '450000'
  },
  'hainan': {
    name: '海南省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/460000_full.json',
    adcode: '460000'
  },
  'chongqing': {
    name: '重庆市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/500000_full.json',
    adcode: '500000'
  },
  'sichuan': {
    name: '四川省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/510000_full.json',
    adcode: '510000'
  },
  'guizhou': {
    name: '贵州省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/520000_full.json',
    adcode: '520000'
  },
  'yunnan': {
    name: '云南省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/530000_full.json',
    adcode: '530000'
  },
  'xizang': {
    name: '西藏自治区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/540000_full.json',
    adcode: '540000'
  },
  'shaanxi': {
    name: '陕西省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/610000_full.json',
    adcode: '610000'
  },
  'gansu': {
    name: '甘肃省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/620000_full.json',
    adcode: '620000'
  },
  'qinghai': {
    name: '青海省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/630000_full.json',
    adcode: '630000'
  },
  'ningxia': {
    name: '宁夏回族自治区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/640000_full.json',
    adcode: '640000'
  },
  'xinjiang': {
    name: '新疆维吾尔自治区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/650000_full.json',
    adcode: '650000'
  },
  'taiwan': {
    name: '台湾省',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/710000_full.json',
    adcode: '710000'
  },
  'xianggang': {
    name: '香港特别行政区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/810000_full.json',
    adcode: '810000'
  },
  'aomen': {
    name: '澳门特别行政区',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/820000_full.json',
    adcode: '820000'
  },
  // 市级行政区
  'ruijin': {
    name: '江西省瑞金市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/360781_full.json',
    adcode: '360781'
  },
  'hangzhou': {
    name: '浙江省杭州市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/330100_full.json',
    adcode: '330100'
  },
  'shanghai_city': {
    name: '上海市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/310100_full.json',
    adcode: '310100'
  },
  'beijing_city': {
    name: '北京市',
    geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/110100_full.json',
    adcode: '110100'
  }
};

// 获取支持的地区列表
export function getSupportedRegions(): Array<{ code: string; name: string }> {
  return Object.entries(REGION_MAPS).map(([code, info]) => ({
    code,
    name: info.name
  }));
}

// 动态加载地图数据
// 支持三种 regionCode：
//   1. REGION_MAPS 中的具名 key（如 'shanxi'、'ruijin'）
//   2. 6 位行政区划代码（如 '360781'）——直接调 DataV API，无需提前注册
//   3. 地区名称（如 '瑞金市'）——通过 getRegionCodeByName 模糊匹配
export async function loadRegionMap(regionCode: string): Promise<any> {
  // Step1: 尝试具名 key
  let region = REGION_MAPS[regionCode];

  // Step2: 6 位纯数字 → 当作 adcode 动态构造 URL
  if (!region && /^\d{6}$/.test(regionCode)) {
    region = {
      name: regionCode,
      geoJsonUrl: `https://geo.datav.aliyun.com/areas_v3/bound/${regionCode}_full.json`,
      adcode: regionCode,
    };
  }

  // Step3: 名称模糊匹配
  if (!region) {
    const matched = getRegionCodeByName(regionCode);
    if (matched) region = REGION_MAPS[matched];
  }

  if (!region) {
    console.warn(`Unsupported region: ${regionCode}, falling back to shanxi`);
    return loadRegionMap('shanxi');
  }

  const adcode = region.adcode;
  const fullUrl = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}_full.json`;
  const boundUrl = `https://geo.datav.aliyun.com/areas_v3/bound/${adcode}.json`;

  try {
    // 优先加载含子区划的 _full.json；县级市/区县可能没有子区划，
    // 此时 features 为空或请求失败，自动降级到仅边界 .json
    let geoJson: any = null;
    try {
      const fullResp = await fetch(fullUrl);
      if (fullResp.ok) {
        const data = await fullResp.json();
        if (data?.features?.length > 0) geoJson = data;
      }
    } catch (_) { /* ignore */ }

    if (!geoJson) {
      const boundResp = await fetch(boundUrl);
      if (!boundResp.ok) throw new Error(`HTTP ${boundResp.status} for ${boundUrl}`);
      geoJson = await boundResp.json();
    }

    // symbol 路径和边界框优先使用更简洁的 boundUrl（仅外轮廓）
    let symbolPath = '';
    let bounds: MapBounds | null = null;
    try {
      const bResp = await fetch(boundUrl);
      if (bResp.ok) {
        const boundaryJson = await bResp.json();
        symbolPath = geoJsonToSVGPath(boundaryJson);
        bounds = extractGeoJsonBounds(boundaryJson);
      }
    } catch (_) { /* ignore */ }
    if (!symbolPath) symbolPath = geoJsonToSVGPath(geoJson);
    if (!bounds) bounds = extractGeoJsonBounds(geoJson);

    return { geoJson, regionInfo: region, symbolPath, bounds };
  } catch (e) {
    console.error('Failed to load map:', e);
    if (regionCode !== 'shanxi') return loadRegionMap('shanxi');
    return null;
  }
}

/**
 * 将 GeoJSON FeatureCollection 转换为 ECharts path:// 格式的 SVG 路径字符串
 * 支持 Polygon / MultiPolygon，自动归一化坐标并翻转 Y 轴
 */
export function geoJsonToSVGPath(geoJson: any, size: number = 200): string {
  if (!geoJson) return '';

  const rings: [number, number][][] = [];

  const features = geoJson.features || (geoJson.type === 'Feature' ? [geoJson] : []);
  for (const feature of features) {
    const geom = feature?.geometry;
    if (!geom) continue;
    if (geom.type === 'Polygon') {
      if (geom.coordinates[0]?.length >= 3) rings.push(geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        if (poly[0]?.length >= 3) rings.push(poly[0]);
      }
    }
  }

  if (rings.length === 0) return '';

  // 求边界框
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lng, lat] of ring) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }

  const rangeX = maxLng - minLng || 1;
  const rangeY = maxLat - minLat || 1;

  // 等距圆柱投影修正：1° 经度的物理长度 = cos(纬度) × 1° 纬度的物理长度
  // 不修正会导致地图 X 方向被拉宽（越高纬误差越大，山西约 37°N 需修正 ~20%）
  const avgLat = (minLat + maxLat) / 2;
  const cosLat = Math.cos((avgLat * Math.PI) / 180);
  const adjustedRangeX = rangeX * cosLat; // 投影后实际宽度（纬度等价单位）

  const scale = size / Math.max(adjustedRangeX, rangeY);
  const padX = (size - adjustedRangeX * scale) / 2;
  const padY = (size - rangeY * scale) / 2;

  // 按总点数动态决定采样步长，控制路径总点数 ≤ 800
  const totalPts = rings.reduce((s, r) => s + r.length, 0);
  const step = Math.max(1, Math.ceil(totalPts / 800));

  const paths: string[] = [];
  for (const ring of rings) {
    const cmds: string[] = [];
    for (let i = 0; i < ring.length; i++) {
      if (i !== 0 && i !== ring.length - 1 && i % step !== 0) continue;
      const [lng, lat] = ring[i];
      // X 坐标乘以 cosLat 修正经度→距离压缩比
      const x = ((lng - minLng) * cosLat * scale + padX).toFixed(1);
      const y = (size - ((lat - minLat) * scale + padY)).toFixed(1); // 翻转 Y 轴
      cmds.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
    }
    if (cmds.length >= 3) {
      cmds.push('Z');
      paths.push(cmds.join(''));
    }
  }

  // 在路径末尾附加两个零长度的不可见锚点，强制边界框恰好为 [0,0]→[size,size]。
  // 原因：ECharts 渲染 path:// symbol 时用
  //   scaleX = symbolSize / rect.width
  //   scaleY = symbolSize / rect.height
  // 做非均匀拉伸。若地图路径的 rect 不是正方形（山西约为 0.56:1 窄高），
  // X 方向会被过度放大，导致地图横向被"压扁"变宽。
  // 强制 rect = size×size 后，scaleX === scaleY，实现等比缩放。
  const s = size.toFixed(1);
  return `M0,0L0,0M${s},${s}L${s},${s} ` + paths.join(' ');
}

// 根据地区名称获取地区编码
export function getRegionCodeByName(name: string): string | null {
  const entry = Object.entries(REGION_MAPS).find(([_, info]) =>
    info.name.includes(name) || name.includes(info.name.replace(/省|市|自治区|特别行政区/g, ''))
  );
  return entry ? entry[0] : null;
}

// 检查是否支持某个地区
export function isRegionSupported(regionCode: string): boolean {
  return regionCode in REGION_MAPS;
}
