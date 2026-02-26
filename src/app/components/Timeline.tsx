// 左侧时间轴组件 - 山西文化历史沿革

interface TimelineProps {
  fenjiu_colors: any;
}

export function Timeline({ fenjiu_colors }: TimelineProps) {
  const timelineEvents = [
    { year: '6000年前', desc: '仰韶文化时期，杏花村先民开始酿酒，小口尖底瓮出土', category: '根祖文化' },
    { year: '前2357年', desc: '陶寺遗址建立，中国最早都城范式，尧帝定都平阳', category: '根祖文化' },
    { year: '前11世纪', desc: '西周分封，晋国立国，开启三晋文明', category: '根祖文化' },
    { year: '前636年', desc: '晋文公称霸，晋国成为春秋五霸之一', category: '忠义文化' },
    { year: '前403年', desc: '三家分晋，韩赵魏三国诞生，战国时代开启', category: '根祖文化' },
    { year: '220年', desc: '关羽殉国，忠义文化开始形成', category: '忠义文化' },
    { year: '471-476年', desc: '北魏开凿云冈石窟，佛教艺术东传', category: '古建文化' },
    { year: '782年', desc: '五台山成为文殊菩萨道场', category: '山河文化' },
    { year: '857年', desc: '佛光寺东大殿建成，唐代木构孤例', category: '古建文化' },
    { year: '1056年', desc: '应县木塔建成，世界最高木塔', category: '古建文化' },
    { year: '1324年', desc: '永乐宫壁画完成，道教艺术巅峰', category: '古建文化' },
    { year: '1823年', desc: '日升昌票号创立，开创中国金融业', category: '忠义文化' },
    { year: '1915年', desc: '汾酒荣获巴拿马万国博览会甲等大奖章', category: '酒魂文化' },
    { year: '1952年', desc: '汾酒制定中国第一个白酒国家标准', category: '酒魂文化' },
    { year: '1997年', desc: '平遥古城列入世界文化遗产', category: '古建文化' },
    { year: '2001年', desc: '云冈石窟列入世界文化遗产', category: '古建文化' },
    { year: '2009年', desc: '五台山列入世界文化遗产', category: '山河文化' }
  ];

  return (
    <div className="absolute left-0 top-32 bottom-6 w-80 overflow-y-auto z-40 timeline-container"
         style={{
           background: 'linear-gradient(135deg, rgba(10, 11, 16, 0.75) 0%, rgba(15, 20, 30, 0.65) 100%)',
           backdropFilter: 'blur(24px)',
           borderRight: `2px solid transparent`,
           backgroundImage: `
             linear-gradient(135deg, rgba(10, 11, 16, 0.75) 0%, rgba(15, 20, 30, 0.65) 100%),
             linear-gradient(90deg, ${fenjiu_colors.ice_blue}15, transparent)
           `,
           backgroundClip: 'padding-box, border-box',
           backgroundOrigin: 'padding-box, border-box',
           boxShadow: `
             inset -1px 0 40px rgba(135, 206, 250, 0.12),
             8px 0 60px rgba(0, 0, 0, 0.7),
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
          <div className="absolute -left-8 top-0 w-1 h-full"
               style={{
                 background: `linear-gradient(180deg, ${fenjiu_colors.ice_blue}, transparent)`
               }} />
          <div className="text-xl tracking-wider mb-2"
               style={{
                 color: fenjiu_colors.ice_blue_light,
                 fontWeight: 300,
                 letterSpacing: '0.15em'
               }}>
            历史沿革
          </div>
          <div className="text-xs tracking-widest opacity-50"
               style={{ color: fenjiu_colors.ice_blue }}>
            CULTURAL TIMELINE
          </div>
        </div>

        {/* 时间轴 */}
        <div className="space-y-8 relative">
          {/* 主轴线 */}
          <div className="absolute left-5 top-0 bottom-0 w-px"
               style={{
                 background: `linear-gradient(180deg, 
                   transparent,
                   ${fenjiu_colors.ice_blue}30 10%,
                   ${fenjiu_colors.ice_blue}30 90%,
                   transparent
                 )`
               }} />

          {timelineEvents.map((event, index) => (
            <div key={index} className="relative pl-14 group">
              {/* 时间节点 */}
              <div className="absolute left-3 top-0.5"
                   style={{ width: '14px', height: '14px' }}>
                <div className="absolute inset-0 rounded-full transition-all duration-500"
                     style={{
                       background: fenjiu_colors.ice_blue,
                       boxShadow: `0 0 0 4px rgba(10, 11, 16, 0.8), 0 0 12px ${fenjiu_colors.ice_blue}80`
                     }} />
                <div className="absolute inset-0 rounded-full animate-ping opacity-0 group-hover:opacity-75"
                     style={{
                       background: fenjiu_colors.ice_blue,
                       animationDuration: '2s'
                     }} />
              </div>
              
              {/* 横向连接线 */}
              <div className="absolute left-10 top-2 w-4 h-px opacity-0 group-hover:opacity-100 transition-all duration-300"
                   style={{
                     background: `linear-gradient(90deg, ${fenjiu_colors.ice_blue}, transparent)`
                   }} />

              {/* 内容卡片 */}
              <div className="transition-all duration-300 group-hover:translate-x-2">
                {/* 类别标签 */}
                <div className="inline-block px-2 py-0.5 rounded mb-2 text-xs"
                     style={{
                       background: `${fenjiu_colors.ice_blue}15`,
                       color: fenjiu_colors.ice_blue,
                       border: `1px solid ${fenjiu_colors.ice_blue}30`,
                       fontSize: '10px',
                       letterSpacing: '0.05em'
                     }}>
                  {event.category}
                </div>

                {/* 年份 */}
                <div className="font-bold mb-2 tracking-wide"
                     style={{ 
                       color: fenjiu_colors.ice_blue,
                       fontSize: '15px',
                       fontVariantNumeric: 'tabular-nums'
                     }}>
                  {event.year}
                </div>

                {/* 描述 */}
                <div className="leading-relaxed text-sm"
                     style={{ 
                       color: 'rgba(255, 255, 255, 0.75)',
                       lineHeight: '1.7'
                     }}>
                  {event.desc}
                </div>
              </div>

              {/* 装饰性发光效果 */}
              <div className="absolute left-0 top-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                   style={{
                     background: `radial-gradient(circle at 20px center, ${fenjiu_colors.ice_blue}05, transparent 60%)`,
                     mixBlendMode: 'screen'
                   }} />
            </div>
          ))}
        </div>

        {/* 底部渐变 */}
        <div className="h-20 mt-8"
             style={{
               background: `linear-gradient(180deg, transparent, rgba(10, 11, 16, 0.5))`
             }} />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .timeline-container::-webkit-scrollbar {
          width: 6px;
        }
        .timeline-container::-webkit-scrollbar-thumb {
          background: ${fenjiu_colors.ice_blue}30;
          border-radius: 3px;
          transition: background 0.3s;
        }
        .timeline-container::-webkit-scrollbar-thumb:hover {
          background: ${fenjiu_colors.ice_blue}60;
        }
        .timeline-container::-webkit-scrollbar-track {
          background: transparent;
        }
      `}} />
    </div>
  );
}