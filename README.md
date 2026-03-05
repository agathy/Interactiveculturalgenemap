
# Interactive Cultural Gene Map

一个交互式文化基因图谱可视化系统，支持动态地图展示、节点呼吸效果、时间轴动画和丰富的自定义配置选项。

## 版本信息

- **当前版本**：2026-03-05-v1.0.1
- **最后更新**：2026-03-05

## 项目特点

### 核心功能
- 🌍 **动态地图支持**：支持省级和市级行政区地图展示
- 🌟 **呼吸节点效果**：一级节点带动画效果和中心文字显示
- ⏰ **时间轴动画**：环形时间轴展示历史发展脉络
- 🎨 **丰富的视觉配置**：支持颜色、大小、发光效果等参数调整
- 📱 **响应式设计**：适配不同屏幕尺寸
- 📤 **数据导入导出**：支持 JSON 格式数据的导入导出
- 💡 **地图光点**：基于地理坐标的动态光点效果

### 技术栈
- React 18
- TypeScript
- ECharts 5
- Vite
- Lucide React (图标库)
- Sonner (通知组件)

## 快速开始

### 安装依赖
```bash
npm i
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 项目结构

```
├── src/
│   ├── app/components/          # 核心组件
│   │   ├── ShanxiCultureGraph.tsx  # 主图谱组件
│   │   ├── BreathingNodes.tsx      # 呼吸节点效果
│   │   ├── MapLightPoints.tsx      # 地图光点效果
│   │   ├── OptimizedNodes.tsx      # 节点优化
│   │   ├── OrbitRings.tsx          # 轨道环效果
│   │   └── graphData.ts            # 数据处理
│   ├── services/
│   │   └── mapService.ts          # 地图服务
│   ├── styles/
│   │   ├── fonts.css              # 字体样式
│   │   └── index.css              # 全局样式
│   └── font/                      # 字体文件
├── data/                         # 示例数据
│   ├── example_data_shanxi.json           # 山西文化基因数据
│   ├── example_data_heluo.json           # 河洛文化基因数据
│   └── exmaple_data_lightoints_shanxi.json # 山西地图光点数据
├── config/                       # 配置文件
│   └── config_default.json               # 默认配置
└── public/                       # 静态资源
    └── images/                   # 节点图片
```

## 数据格式

### 文化基因数据结构

```json
{
  "root": {
    "name": "区域名称\n文化基因库",
    "subtitle": "副标题",
    "tooltip": "根节点提示信息",
    "region": "地区代码",
    "regionName": "地区名称"
  },
  "categories": [
    {
      "id": "category-id",
      "name": "分类名称",
      "angle": -90,  // 初始角度
      "symbol": "diamond",  // 节点形状
      "timeRange": [1931, 2026],  // 时间范围
      "tooltip": "分类提示信息",
      "children": [
        {
          "id": "subcategory-id",
          "name": "子分类名称",
          "timeRange": [1931, 2000],
          "children": [
            {
              "id": "item-id",
              "name": "具体项目",
              "timeRange": [1931, 1934],
              "tooltip": "项目提示信息"
            }
          ]
        }
      ]
    }
  ]
}
```

### 地图光点数据结构

```json
{
  "region": "shanxi",
  "regionName": "山西省",
  "points": [
    {
      "id": "point-1",
      "name": "地点名称",
      "lng": 112.5489,  // 经度
      "lat": 37.8706,   // 纬度
      "color": "#0042aa",  // 光点颜色
      "size": 8,        // 光点大小
      "category": "分类"
    }
  ]
}
```

## 地图支持

系统支持中国所有省级行政区和部分市级行政区的地图展示。

### 支持的地区类型
- **省级行政区**：包括34个省级行政区（省、自治区、直辖市、特别行政区）
- **市级行政区**：包括瑞金市、杭州市、上海市、北京市等

### 如何添加新地区
在 `src/services/mapService.ts` 文件中添加新的地区配置，使用阿里云 DataV 提供的 GeoJSON 数据。

## 配置选项

系统提供丰富的配置选项，包括：

- 背景颜色
- 分类配色
- 节点大小
- 轨道半径
- 时间轴半径
- 根节点视觉参数
- 发光强度
- 旋转速度
- 呼吸频率
- 地图光点显示

## 自定义字体

项目使用以下自定义字体：
- 字魂266号-绅士黑：用于根节点标题
- 5c92f08e461aa1553133710：用于一级节点中心文字

## 部署说明

1. 构建生产版本：
   ```bash
   npm run build
   ```

2. 部署 `dist` 目录到你的服务器

3. 确保服务器配置正确的 MIME 类型，特别是对于 JSON 文件

## 开发指南

### 添加新的地区支持

在 `src/services/mapService.ts` 中的 `REGION_MAPS` 对象添加新的地区配置：

```typescript
'new_region': {
  name: '地区名称',
  geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/{adcode}_full.json',
  adcode: '行政区划代码'
}
```

### 自定义节点图片

1. 将图片文件放在 `public/images/` 目录
2. 在配置面板中上传图片到对应节点

## 常见问题

### 地图不显示
- 检查数据中的 `region` 字段是否正确
- 确保地区代码在 `REGION_MAPS` 中定义
- 检查网络连接，确保能访问阿里云 DataV 服务

### 光点不显示
- 确保 `showLightPoints` 为 true
- 检查光点数据格式是否正确
- 确保地图边界数据已正确加载

## 许可证

MIT License

## 致谢

- 地图数据来自 [阿里云 DataV](https://datav.aliyun.com/)
- 设计灵感来自 [Figma 设计稿](https://www.figma.com/design/dwLPLq5NKULHFYEUqZihlt/Interactive-Cultural-Gene-Map)

## 更多说明文档

- [详细使用说明](https://xhzy.yuque.com/gep9gl/gd84gm/iqgeekz3yi13sfda)
