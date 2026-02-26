// 右侧数据统计卡片组件

interface DataStatsProps {
  fenjiu_colors: any;
}

export function DataStats({ fenjiu_colors }: DataStatsProps) {
  const stats = [
    {
      label: '古建遗存',
      value: '70%',
      unit: '以上',
      desc: '全国元代以前木构建筑',
      color: fenjiu_colors.ice_blue
    },
    {
      label: '非遗项目',
      value: '537',
      unit: '项',
      desc: '国家级89项，省级537项',
      color: fenjiu_colors.ice_blue
    },
    {
      label: '文保单位',
      value: '531',
      unit: '处',
      desc: '国保162处，居全国第一',
      color: '#FFD700' // 琥珀金
    },
    {
      label: '博物馆',
      value: '165',
      unit: '座',
      desc: '国家一级博物馆8座',
      color: fenjiu_colors.ice_blue
    },
    {
      label: '酒文明',
      value: '6000',
      unit: '年',
      desc: '不间断酿造传承史',
      color: '#FFD700' // 琥珀金
    },
    {
      label: '关帝庙',
      value: '3',
      unit: '万+',
      desc: '全球关帝庙总数',
      color: '#CD853F' // 陶土赭
    },
    {
      label: '世界遗产',
      value: '5',
      unit: '处',
      desc: '平遥古城、云冈石窟等',
      color: '#FFD700' // 琥珀金
    },
    {
      label: '晋商票号',
      value: '51',
      unit: '家',
      desc: '鼎盛时期票号数量',
      color: '#CD853F' // 陶土赭
    }
  ];

  return (
    <div className="absolute right-0 top-32 bottom-6 w-96 overflow-y-auto z-40 stats-container"
         style={{
           background: 'linear-gradient(225deg, rgba(10, 11, 16, 0.75) 0%, rgba(15, 20, 30, 0.65) 100%)',
           backdropFilter: 'blur(24px)',
           borderLeft: `2px solid transparent`,
           backgroundImage: `
             linear-gradient(225deg, rgba(10, 11, 16, 0.75) 0%, rgba(15, 20, 30, 0.65) 100%),
             linear-gradient(270deg, ${fenjiu_colors.ice_blue}15, transparent)
           `,
           backgroundClip: 'padding-box, border-box',
           backgroundOrigin: 'padding-box, border-box',
           boxShadow: `
             inset 1px 0 40px rgba(135, 206, 250, 0.12),
             -8px 0 60px rgba(0, 0, 0, 0.7),
             0 8px 40px rgba(0, 0, 0, 0.6)
           `
         }}>
      
      {/* 转角支架装饰 - 左上角 */}
      <div className="corner-bracket corner-top-left" style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '30px',
        height: '30px',
        borderTop: `2px solid ${fenjiu_colors.ice_blue}`,
        borderLeft: `2px solid ${fenjiu_colors.ice_blue}`,
        boxShadow: `0 0 10px ${fenjiu_colors.ice_blue}60`,
        zIndex: 50
      }} />
      
      {/* 转角支架装饰 - 右上角 */}
      <div className="corner-bracket corner-top-right" style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '30px',
        height: '30px',
        borderTop: `2px solid ${fenjiu_colors.ice_blue}`,
        borderRight: `2px solid ${fenjiu_colors.ice_blue}`,
        boxShadow: `0 0 10px ${fenjiu_colors.ice_blue}60`,
        zIndex: 50
      }} />
      
      {/* 转角支架装饰 - 左下角 */}
      <div className="corner-bracket corner-bottom-left" style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        width: '30px',
        height: '30px',
        borderBottom: `2px solid ${fenjiu_colors.ice_blue}`,
        borderLeft: `2px solid ${fenjiu_colors.ice_blue}`,
        boxShadow: `0 0 10px ${fenjiu_colors.ice_blue}60`,
        zIndex: 50
      }} />
      
      {/* 转角支架装饰 - 右下角 */}
      <div className="corner-bracket corner-bottom-right" style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        width: '30px',
        height: '30px',
        borderBottom: `2px solid ${fenjiu_colors.ice_blue}`,
        borderRight: `2px solid ${fenjiu_colors.ice_blue}`,
        boxShadow: `0 0 10px ${fenjiu_colors.ice_blue}60`,
        zIndex: 50
      }} />

      <div className="p-8">
        {/* 标题区域 */}
        <div className="mb-8 relative">
          <div className="absolute -right-8 top-0 w-1 h-full"
               style={{
                 background: `linear-gradient(180deg, ${fenjiu_colors.ice_blue}, transparent)`
               }} />
          <div className="text-xl tracking-wider mb-2 text-right"
               style={{
                 color: fenjiu_colors.ice_blue_light,
                 fontWeight: 300,
                 letterSpacing: '0.15em'
               }}>
            文化数据
          </div>
          <div className="text-xs tracking-widest opacity-50 text-right"
               style={{ color: fenjiu_colors.ice_blue }}>
            CULTURAL STATISTICS
          </div>
        </div>

        {/* 数据卡片 */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index}
                 className="group relative overflow-hidden rounded-lg transition-all duration-500 hover:scale-105"
                 style={{
                   background: 'rgba(10, 20, 35, 0.6)',
                   border: `1px solid ${stat.color}20`,
                   boxShadow: `
                     0 4px 16px rgba(0, 0, 0, 0.3),
                     inset 0 1px 0 rgba(255, 255, 255, 0.05)
                   `,
                   cursor: 'pointer'
                 }}
                 onMouseEnter={(e) => {
                   e.currentTarget.style.borderColor = `${stat.color}60`;
                   e.currentTarget.style.boxShadow = `
                     0 8px 32px rgba(0, 0, 0, 0.4),
                     0 0 20px ${stat.color}30,
                     inset 0 1px 0 rgba(255, 255, 255, 0.1)
                   `;
                 }}
                 onMouseLeave={(e) => {
                   e.currentTarget.style.borderColor = `${stat.color}20`;
                   e.currentTarget.style.boxShadow = `
                     0 4px 16px rgba(0, 0, 0, 0.3),
                     inset 0 1px 0 rgba(255, 255, 255, 0.05)
                   `;
                 }}>
              
              {/* 背景装饰 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: `radial-gradient(circle at 50% 0%, ${stat.color}10, transparent 70%)`
                   }} />

              {/* 左上角装饰线 */}
              <div className="absolute top-0 left-0 w-8 h-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px"
                     style={{ background: `linear-gradient(90deg, ${stat.color}60, transparent)` }} />
                <div className="absolute top-0 left-0 h-full w-px"
                     style={{ background: `linear-gradient(180deg, ${stat.color}60, transparent)` }} />
              </div>

              <div className="relative p-5">
                {/* 标签 */}
                <div className="text-xs mb-3 tracking-wider opacity-70"
                     style={{ 
                       color: 'rgba(255, 255, 255, 0.6)',
                       letterSpacing: '0.08em'
                     }}>
                  {stat.label}
                </div>

                {/* 数值区域 */}
                <div className="flex items-baseline gap-1.5 mb-3">
                  <span className="text-3xl font-bold tracking-tight transition-all duration-300 group-hover:scale-110"
                        style={{ 
                          color: stat.color,
                          fontVariantNumeric: 'tabular-nums',
                          textShadow: `0 0 20px ${stat.color}40`
                        }}>
                    {stat.value}
                  </span>
                  <span className="text-sm font-medium"
                        style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {stat.unit}
                  </span>
                </div>

                {/* 描述 */}
                <div className="text-xs leading-relaxed"
                     style={{ 
                       color: 'rgba(255, 255, 255, 0.45)',
                       lineHeight: '1.6'
                     }}>
                  {stat.desc}
                </div>

                {/* 右下角光效 */}
                <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none"
                     style={{
                       background: `radial-gradient(circle at 100% 100%, ${stat.color}15, transparent 70%)`,
                       filter: 'blur(8px)'
                     }} />
              </div>

              {/* 底部进度条装饰 */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden">
                <div className="h-full w-0 group-hover:w-full transition-all duration-700"
                     style={{
                       background: `linear-gradient(90deg, transparent, ${stat.color}80, transparent)`
                     }} />
              </div>
            </div>
          ))}
        </div>

        {/* 底部总结卡片 */}
        <div className="mt-6 p-6 rounded-lg relative overflow-hidden"
             style={{
               background: 'rgba(10, 20, 35, 0.4)',
               border: `1px solid ${fenjiu_colors.ice_blue}20`,
               boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
             }}>
          <div className="text-sm leading-relaxed"
               style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
            山西拥有中国70%以上的元代以前古建筑，162处国家级文物保护单位居全国第一。
            五千年文明史在此留下深深印记，是名副其实的中华文明摇篮。
          </div>
          
          {/* 装饰性扫光效果 */}
          <div className="absolute inset-0 pointer-events-none"
               style={{
                 background: `linear-gradient(120deg, transparent 30%, ${fenjiu_colors.ice_blue}08 50%, transparent 70%)`,
                 animation: 'shimmer 8s infinite',
               }} />
        </div>

        {/* 底部渐变 */}
        <div className="h-20 mt-8"
             style={{
               background: `linear-gradient(180deg, transparent, rgba(10, 11, 16, 0.5))`
             }} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        .stats-container::-webkit-scrollbar {
          width: 6px;
        }
        .stats-container::-webkit-scrollbar-thumb {
          background: ${fenjiu_colors.ice_blue}30;
          border-radius: 3px;
          transition: background 0.3s;
        }
        .stats-container::-webkit-scrollbar-thumb:hover {
          background: ${fenjiu_colors.ice_blue}60;
        }
        .stats-container::-webkit-scrollbar-track {
          background: transparent;
        }
      `}} />
    </div>
  );
}