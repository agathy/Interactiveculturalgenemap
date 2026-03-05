// 地图服务模块 - 动态加载各地区地图数据
// 使用阿里云 DataV 地理数据服务

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
export async function loadRegionMap(regionCode: string): Promise<any> {
  const region = REGION_MAPS[regionCode];
  if (!region) {
    console.warn(`Unsupported region: ${regionCode}, falling back to shanxi`);
    return loadRegionMap('shanxi');
  }

  try {
    const response = await fetch(region.geoJsonUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const geoJson = await response.json();

    // 优先用不含子区划的边界 JSON（URL 去掉 _full 后缀）来生成 symbol 路径，
    // 路径更简洁；若请求失败则退回使用 full 数据。
    let symbolPath = '';
    try {
      const boundaryUrl = region.geoJsonUrl.replace('_full.json', '.json');
      if (boundaryUrl !== region.geoJsonUrl) {
        const bResp = await fetch(boundaryUrl);
        if (bResp.ok) {
          const boundaryJson = await bResp.json();
          symbolPath = geoJsonToSVGPath(boundaryJson);
        }
      }
    } catch (_) { /* ignore */ }
    if (!symbolPath) symbolPath = geoJsonToSVGPath(geoJson);

    return {
      geoJson,
      regionInfo: region,
      symbolPath
    };
  } catch (e) {
    console.error('Failed to load map:', e);
    // 如果加载失败，尝试加载山西地图作为回退
    if (regionCode !== 'shanxi') {
      console.log('Falling back to shanxi map');
      return loadRegionMap('shanxi');
    }
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
  const scale = size / Math.max(rangeX, rangeY);
  const padX = (size - rangeX * scale) / 2;
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
      const x = ((lng - minLng) * scale + padX).toFixed(1);
      const y = (size - ((lat - minLat) * scale + padY)).toFixed(1); // 翻转 Y 轴
      cmds.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
    }
    if (cmds.length >= 3) {
      cmds.push('Z');
      paths.push(cmds.join(''));
    }
  }

  return paths.join(' ');
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
