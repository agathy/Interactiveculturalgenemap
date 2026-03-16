#!/usr/bin/env python3
"""
Download real photos for Henan L2 nodes from Bing Images (Chinese search).
Saves as /public/img/henan/{key}.jpg
"""
import requests
import re
import time
import os
import sys

DEST = '/Users/bbk/Desktop/Projects/Interactiveculturalgenemap/public/img/henan'
os.makedirs(DEST, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept': 'text/html,application/xhtml+xml,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Referer': 'https://cn.bing.com/',
}

# 52 L2 nodes with Chinese search keywords
NODES = {
    'a1': '龙门石窟 洛阳 风景照片',
    'a2': '殷墟遗址 安阳 考古',
    'a3': '仰韶文化 彩陶 遗址',
    'b1': '钧瓷 陶瓷 工艺品 河南',
    'b2': '少林功夫 武术 表演',
    'b3': '四大怀药 中药 山药 牛膝',
    'b4': '夸父逐日 神话 彩绘',
    'b5': '杂技 马戏 表演 中国',
    'c1': '河南美食 烩面 胡辣汤',
    'c2': '烩面 郑州 传统面食',
    'c3': '信阳毛尖 茶叶 茶园',
    'd1': '少林寺 嵩山 建筑 寺庙',
    'd2': '开封铁塔 古塔 建筑',
    'd3': '古村落 传统民居 河南',
    'e1': '春节 庙会 灯笼 传统节日',
    'e2': '洛阳牡丹 花会 节日',
    'f1': '中国书法 毛笔 汉字',
    'f2': '甲骨文 古文字 考古',
    'g1': '少林寺 禅宗 佛教',
    'g2': '道教 太极 道观',
    'g3': '儒家文化 孔庙 礼乐',
    'h1': '商朝 帝王 历史 古代',
    'h2': '岳飞 英雄 历史人物 河南',
    'h3': '红旗渠 林州 水渠 工程',
    'i1': '中原农耕 梯田 农业 传统',
    'i2': '汴绣 刺绣 传统工艺',
    'i3': '龙门石窟 旅游 景区 风景',
    'j1': '嵩山 峻极峰 山景 河南',
    'j2': '黄河 壶口 风景 河南',
    'j3': '云台山 地质 山水 风景',
    'k1': '大别山 森林 自然风光',
    'k2': '新县 红色基地 革命纪念馆',
    'k3': '红色文化 历史文物 档案',
    'k4': '红旗渠 水利工程 纪念馆',
    'l1': '黄帝故里 新郑 祭祖 陵寝',
    'l2': '寻根 族谱 家谱 祠堂',
    'l3': '客家 宗亲 文化 根亲',
    'l4': '宗族 祭祖 家族 聚会',
    'm1': '仰韶村遗址 陶器 考古发掘',
    'm2': '黄河 水坝 水利 三门峡',
    'm3': '黄河湿地 自然保护区 候鸟',
    'm4': '黄河文化 山水画 艺术',
    'n1': '传统村落 古民居 中原 乡村',
    'n2': '农耕文化 农具 传统农业',
    'n3': '民间工艺 手工艺 农村',
    'n4': '豫剧 戏曲 演出 河南',
    'o1': '郑州 现代城市 高楼 夜景',
    'o2': '郑州高铁 交通 现代化',
    'o3': '工业园区 高新技术 制造业',
    'o4': '大学校园 高等教育 河南',
    'o5': '互联网 科技 数字经济',
    'o6': '郑州航空港 机场 国际化',
}

def get_bing_image_urls(query, max_results=5):
    """Search Bing Images and return direct image URLs."""
    url = f'https://cn.bing.com/images/search?q={requests.utils.quote(query)}&form=HDRSC2&first=1'
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code != 200:
            return []
        # Extract direct image URLs from murl parameter
        urls = re.findall(r'murl&quot;:&quot;(https?://[^&<"]+?)&quot;', r.text)
        if not urls:
            # Try alternative pattern
            urls = re.findall(r'"murl":"(https?://[^"]+)"', r.text)
        return urls[:max_results]
    except Exception as e:
        print(f'  Search error: {e}')
        return []

def download_image(url, dest_path, timeout=15):
    """Download an image from URL to dest_path. Returns True on success."""
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout, stream=True)
        if r.status_code == 200:
            content_type = r.headers.get('content-type', '')
            # Accept image types
            if 'image' in content_type or url.lower().split('?')[0].endswith(('.jpg', '.jpeg', '.png', '.webp')):
                size = 0
                with open(dest_path, 'wb') as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        f.write(chunk)
                        size += len(chunk)
                if size > 10000:  # Must be >10KB (real photo, not placeholder)
                    return True, size
                else:
                    os.remove(dest_path)
                    return False, size
        return False, 0
    except Exception as e:
        return False, 0

# Main download loop
success_count = 0
fail_keys = []

for key, query in NODES.items():
    dest_path = os.path.join(DEST, f'{key}.jpg')

    print(f'[{key}] {query[:30]}...', end=' ', flush=True)

    urls = get_bing_image_urls(query, max_results=6)

    downloaded = False
    for url in urls:
        ok, size = download_image(url, dest_path)
        if ok:
            print(f'OK ({size//1024}KB) <- {url[:60]}')
            downloaded = True
            success_count += 1
            break
        time.sleep(0.3)

    if not downloaded:
        print('FAIL')
        fail_keys.append(key)

    time.sleep(1.0)  # Be polite to Bing

print(f'\n=== Done: {success_count}/{len(NODES)} succeeded ===')
if fail_keys:
    print(f'Failed: {fail_keys}')
