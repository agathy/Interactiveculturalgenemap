import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFile = path.join(__dirname, 'data/河洛文化知识图谱_graph.json');
const outputFile = path.join(__dirname, 'data/heluo-culture-graph-data.json');

const rawData = fs.readFileSync(inputFile, 'utf8');
const sourceData = JSON.parse(rawData);

const nodesMap = new Map();
sourceData.nodes.forEach(node => {
  nodesMap.set(node.id, node);
});

const geneCategories = [
  { id: 'zhong', name: '【中】字基因', angle: -90, symbol: 'diamond' },
  { id: 'jiagu', name: '【甲骨】基因', angle: -18, symbol: 'triangle' },
  { id: 'laojia', name: '【老家】基因', angle: 54, symbol: 'roundRect' },
  { id: 'heliu', name: '【河洛汇流】基因', angle: 126, symbol: 'rect' },
  { id: 'liji', name: '【立极】基因', angle: 198, symbol: 'pin' },
  { id: 'yaobian', name: '【窑变】基因', angle: 270, symbol: 'circle' },
  { id: 'menghua', name: '【梦华】基因', angle: 342, symbol: 'star' },
  { id: 'shengsheng', name: '【生生】基因', angle: 414, symbol: 'heart' }
];

const geneNodeMap = {
  '【中】字基因': 'zhong',
  '【甲骨】基因': 'jiagu',
  '【老家】基因': 'laojia',
  '【河洛汇流】基因': 'heliu',
  '【立极】基因': 'liji',
  '【窑变】基因': 'yaobian',
  '【梦华】基因': 'menghua',
  '【生生】基因': 'shengsheng'
};

const labelToSubCategory = {
  '人物': 'renwu',
  '地理': 'dili',
  '文物': 'wenwu',
  '作品': 'zuopin'
};

const subCategoryNames = {
  'renwu': '人物',
  'dili': '地理',
  'wenwu': '文物',
  'zuopin': '作品'
};

const geneToNodes = {};

geneCategories.forEach(cat => {
  geneToNodes[cat.id] = {
    renwu: [],
    dili: [],
    wenwu: [],
    zuopin: []
  };
});

sourceData.links.forEach(link => {
  const sourceNode = nodesMap.get(link.source);
  const targetNode = nodesMap.get(link.target);
  
  if (!sourceNode || !targetNode) return;
  
  if (geneNodeMap[link.source]) {
    const geneId = geneNodeMap[link.source];
    const label = targetNode.label;
    const subCatId = labelToSubCategory[label];
    
    if (subCatId && geneToNodes[geneId]) {
      if (!geneToNodes[geneId][subCatId].includes(link.target)) {
        geneToNodes[geneId][subCatId].push(link.target);
      }
    }
  }
});

const categories = geneCategories.map(cat => {
  const nodes = geneToNodes[cat.id];
  const children = [];
  
  Object.keys(nodes).forEach(subCatId => {
    const nodeIds = nodes[subCatId];
    if (nodeIds.length > 0) {
      const subChildren = nodeIds.map(nodeId => {
        const node = nodesMap.get(nodeId);
        return {
          id: `${cat.id}-${subCatId}-${nodeId}`,
          name: node.name,
          timeRange: [-5000, 2026]
        };
      });
      
      children.push({
        id: `${cat.id}-${subCatId}`,
        name: subCategoryNames[subCatId],
        timeRange: [-5000, 2026],
        children: subChildren
      });
    }
  });
  
  return {
    id: cat.id,
    name: cat.name,
    angle: cat.angle,
    symbol: cat.symbol,
    timeRange: [-5000, 2026],
    tooltip: `<b>${cat.name}</b>`,
    children: children
  };
});

const targetData = {
  root: {
    name: '河洛文化\n知识图谱',
    subtitle: '中原文明 · 华夏之源',
    tooltip: '<b>河洛文化体系</b><br/>八大文化基因构成完整文明演化链',
    region: 'henan',
    regionName: '河南省'
  },
  categories: categories
};

fs.writeFileSync(outputFile, JSON.stringify(targetData, null, 2), 'utf8');
console.log(`转换完成！输出文件: ${outputFile}`);
console.log(`共生成 ${categories.length} 个分类`);