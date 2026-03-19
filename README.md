
# Interactive Cultural Gene Map

一个交互式文化基因图谱可视化系统，支持动态地图展示、节点详情弹窗、时间轴动画和丰富的自定义配置选项。

## 版本信息

- **当前版本**：2026-03-17-v1.0.3
- **最后更新**：2026-03-17

## 项目特点

### 核心功能
- 🌍 **动态地图支持**：支持省级和市级行政区地图展示
- 🌟 **呼吸节点效果**：一级节点带动画效果和中心文字显示
- ⏰ **时间轴动画**：环形时间轴展示历史发展脉络
- 🪟 **节点详情弹窗**：点击任意节点弹出图片、名称、描述三模块卡片，自动根据节点位置决定弹窗方向
- 🎨 **丰富的视觉配置**：支持颜色、大小、发光效果等参数调整
- 📤 **数据导入导出**：支持 JSON 格式数据的导入导出
- 💡 **地图光点**：基于地理坐标的动态光点效果

### 技术栈
- React 18
- TypeScript
- ECharts 5
- Vite
- Lucide React（图标库）
- Sonner（通知组件）

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
│   ├── main.tsx                    # 应用入口
│   ├── app/
│   │   ├── App.tsx                 # 根组件
│   │   └── components/
│   │       ├── ShanxiCultureGraph.tsx  # 主图谱组件（含节点详情弹窗）
│   │       ├── OptimizedNodes.tsx      # 节点数据生成
│   │       ├── graphData.ts            # 数据模型与工具函数
│   │       ├── BreathingNodes.tsx      # 呼吸节点动画
│   │       ├── OrbitRings.tsx          # 轨道环 + 时间轴
│   │       ├── Timeline.tsx            # 时间轴组件
│   │       ├── MapLightPoints.tsx      # 地图光点效果
│   │       ├── AnimatedBackground.tsx  # 动态背景
│   │       ├── StarField.tsx           # 星空粒子
│   │       ├── LatticeGrid.tsx         # 格栅装饰
│   │       ├── BrickPattern.tsx        # 砖纹装饰
│   │       ├── DataStats.tsx           # 数据统计面板
│   │       ├── CulturalSymbols.tsx     # 涟漪等文化符号
│   │       └── ui/                     # shadcn 通用 UI 组件
│   ├── services/
│   │   └── mapService.ts           # 地图 GeoJSON 加载服务
│   └── styles/
│       ├── index.css               # 样式入口
│       ├── theme.css               # 主题变量（Tailwind v4）
│       ├── tailwind.css            # Tailwind 配置
│       └── fonts.css               # 字体声明
├── public/
│   ├── data/
│   │   ├── example_data_shanxi.json             # 山西文化基因数据
│   │   ├── example_data_heluo.json              # 河洛文化基因数据
│   │   ├── example_data_henan.json              # 河南文化基因数据
│   │   └── example_data_lightpoints_shanxi.json # 山西地图光点数据
│   ├── img/
│   │   ├── henan/                  # 河南节点配图（按节点名自动匹配）
│   │   └── *.png                   # 通用备用图片
│   └── font/                       # 自定义字体文件
```

## 数据格式

### 文化基因数据结构

`tooltip` 字段只需填写**描述内容**，节点名称由系统自动作为标题显示，无需重复写入。

```json
{
  "root": {
    "name": "区域名称\n文化基因库",
    "subtitle": "副标题",
    "tooltip": "描述内容",
    "region": "地区代码",
    "regionName": "地区名称"
  },
  "categories": [
    {
      "id": "category-id",
      "name": "分类名称",
      "symbol": "diamond",
      "timeRange": [开始年份, 结束年份],
      "tooltip": "描述内容",
      "children": [
        {
          "id": "subcategory-id",
          "name": "子分类名称",
          "timeRange": [开始年份, 结束年份],
          "tooltip": "描述内容",
          "children": [
            {
              "id": "item-id",
              "name": "具体项目",
              "timeRange": [开始年份, 结束年份],
              "tooltip": "描述内容"
            }
          ]
        }
      ]
    }
  ]
}
```

#### 必填字段
- `root.name`、`root.region`
- `category.id`、`category.name`、`category.children`
- `child.id`、`child.name`

#### 可选字段
- `tooltip`：悬停提示与详情弹窗描述，支持 HTML（如 `<br/>` 换行）；所有层级均支持
- `timeRange`：时间范围 `[开始年份, 结束年份]`
- `symbol`：节点形状，可选 `diamond` / `triangle` / `roundRect` / `circle` / `rect` / `pin`

### 地图光点数据结构

```json
{
  "region": "shanxi",
  "regionName": "山西省",
  "points": [
    {
      "id": "point-1",
      "name": "地点名称",
      "lng": 112.5489,
      "lat": 37.8706,
      "color": "#0042aa",
      "size": 8,
      "category": "分类"
    }
  ]
}
```

## 节点详情弹窗

点击图谱中任意节点，屏幕左侧或右侧会弹出详情卡片（与节点同侧），包含：

1. **图片**：二级节点自动匹配 `public/img/{region}/{节点名}.jpg`，其他层级显示占位符
2. **名称**：节点名称 + 时间范围
3. **详情**：`tooltip` 字段内容

点击空白区域或卡片右上角 ✕ 关闭。

## 配置选项

系统提供丰富的可视化配置，通过左侧面板调整：

- 背景颜色 / 分类配色
- 节点大小（根节点 / 一级 / 二级 / 三级）
- 轨道半径 / 时间轴半径
- 根节点字体大小 / 发光强度
- 旋转速度 / 呼吸频率
- 地图光点显示开关

配置自动保存至 localStorage，重新打开后恢复上次状态。

## 地图支持

支持中国所有省级行政区和部分市级行政区，数据来自阿里云 DataV GeoJSON 服务。

在 `src/services/mapService.ts` 的 `REGION_MAPS` 中添加新地区：

```typescript
'new_region': {
  name: '地区名称',
  geoJsonUrl: 'https://geo.datav.aliyun.com/areas_v3/bound/{adcode}_full.json',
  adcode: '行政区划代码'
}
```

## 节点配图

将图片命名为 `{节点名}.jpg`，放入 `public/img/{region}/` 目录，系统启动时自动裁切为圆形并绑定到对应二级节点。

## 常见问题

**地图不显示**
- 检查数据中 `region` 字段是否正确
- 确保地区代码已在 `REGION_MAPS` 中定义
- 检查网络连接（需访问阿里云 DataV 服务）

**光点不显示**
- 确认右上角面板中光点开关已打开
- 检查光点数据格式与坐标是否正确

**详情弹窗无内容**
- 为对应节点在数据文件中添加 `tooltip` 字段

## 许可证

MIT License

## 致谢

- 地图数据来自 [阿里云 DataV](https://datav.aliyun.com/)
- 设计灵感来自 [Figma 设计稿](https://www.figma.com/design/dwLPLq5NKULHFYEUqZihlt/Interactive-Cultural-Gene-Map)

## 更多说明文档

- [详细使用说明](https://xhzy.yuque.com/gep9gl/gd84gm/iqgeekz3yi13sfda)
