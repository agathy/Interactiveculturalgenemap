// 优化后的标题组件 - 丰富的装饰效果

interface EnhancedTitleProps {
  fenjiu_colors: any;
}

export function EnhancedTitle({ fenjiu_colors }: EnhancedTitleProps) {
  if (!fenjiu_colors) return null;

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pt-8 pb-6 px-12 pointer-events-none">
      {/* 顶部装饰线 */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex-1 h-px" style={{
          background: `linear-gradient(to right, transparent, ${fenjiu_colors.ice_blue} 20%, ${fenjiu_colors.ice_blue} 80%, transparent)`,
          boxShadow: `0 0 10px ${fenjiu_colors.ice_blue}`
        }} />
        <div className="mx-6" style={{
          color: fenjiu_colors.ice_blue,
          fontSize: '20px',
          textShadow: `0 0 15px ${fenjiu_colors.ice_blue}`
        }}>
          ◆
        </div>
        <div className="flex-1 h-px" style={{
          background: `linear-gradient(to left, transparent, ${fenjiu_colors.ice_blue} 20%, ${fenjiu_colors.ice_blue} 80%, transparent)`,
          boxShadow: `0 0 10px ${fenjiu_colors.ice_blue}`
        }} />
      </div>

      {/* 主标题 */}
      <h1 className="text-3xl font-bold text-center tracking-widest relative"
          style={{
            background: `linear-gradient(135deg, ${fenjiu_colors.ice_blue} 0%, ${fenjiu_colors.ice_blue_light} 50%, ${fenjiu_colors.ice_blue} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: `0 0 20px ${fenjiu_colors.ice_blue}`,
            letterSpacing: '0.25em',
            fontFamily: 'serif'
          }}>
        山西五大文化基因体系
        
        {/* 标题装饰元素 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2"
             style={{
               color: fenjiu_colors.amber_gold,
               fontSize: '12px',
               opacity: 0.7,
               textShadow: `0 0 8px ${fenjiu_colors.amber_gold}`
             }}>
          ◈
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
             style={{
               color: fenjiu_colors.terracotta_red,
               fontSize: '10px',
               opacity: 0.5,
               textShadow: `0 0 6px ${fenjiu_colors.terracotta_red}`
             }}>
          ◆
        </div>
      </h1>

      {/* 副标题 */}
      <div className="text-center mt-3 space-y-1.5">
        <p className="text-sm tracking-widest"
           style={{ 
             color: fenjiu_colors.ice_blue_light, 
             opacity: 0.8,
             letterSpacing: '0.15em',
             fontFamily: 'serif'
           }}>
          Shanxi Five Cultural Gene System
        </p>
        <p className="text-xs tracking-wider"
           style={{ 
             color: fenjiu_colors.ice_blue, 
             opacity: 0.6,
             fontStyle: 'italic'
           }}>
          Interactive Knowledge Graph · 交互式知识图谱
        </p>
      </div>

      {/* 底部装饰线 */}
      <div className="flex items-center justify-center mt-4">
        <div className="w-32 h-px" style={{
          background: `linear-gradient(to right, transparent, ${fenjiu_colors.apricot_pink})`,
          boxShadow: `0 0 8px ${fenjiu_colors.apricot_pink}`
        }} />
        <div className="mx-4" style={{
          color: fenjiu_colors.apricot_pink,
          fontSize: '8px',
          textShadow: `0 0 10px ${fenjiu_colors.apricot_pink}`
        }}>
          ❋ ❋ ❋
        </div>
        <div className="w-32 h-px" style={{
          background: `linear-gradient(to left, transparent, ${fenjiu_colors.apricot_pink})`,
          boxShadow: `0 0 8px ${fenjiu_colors.apricot_pink}`
        }} />
      </div>

      {/* 环绕装饰元素 */}
      <div className="absolute top-10 left-10" style={{
        color: fenjiu_colors.amber_gold,
        fontSize: '24px',
        opacity: 0.4,
        textShadow: `0 0 15px ${fenjiu_colors.amber_gold}`,
        animation: 'pulse 3s ease-in-out infinite'
      }}>
        ◈
      </div>
      <div className="absolute top-10 right-10" style={{
        color: fenjiu_colors.terracotta_red,
        fontSize: '24px',
        opacity: 0.4,
        textShadow: `0 0 15px ${fenjiu_colors.terracotta_red}`,
        animation: 'pulse 3s ease-in-out infinite 0.5s'
      }}>
        ◆
      </div>
    </div>
  );
}