# 合并域名数量优化指南

## 问题描述
静态资源域名数量过多，增加了DNS解析开销和TCP连接数，影响页面加载性能。

## 优化建议

### 1. 域名合并原则
- 静态资源域名控制在1-2个以内
- 避免为不同类型资源使用过多独立域名
- 合理利用域名分片技术

### 2. 实施方案

#### 方案一：统一CDN域名
将所有静态资源统一部署到一个CDN域名下：
```
// 合并前
img.example.com
css.example.com
js.example.com

// 合并后
static.example.com
```

#### 方案二：合理分片
如果需要并行下载，可以使用2个域名：
```
static1.example.com
static2.example.com
```

### 3. Webpack配置示例
```javascript
// webpack.config.js
module.exports = {
  output: {
    publicPath: '//static.example.com/',
    // ...
  }
};
```

### 4. Vite配置示例
```javascript
// vite.config.js
export default {
  build: {
    assetsDir: 'assets',
    // ...
  },
  base: '//static.example.com/',
};
```

### 5. 注意事项
- 避免超过3个静态资源域名
- 考虑HTTP/2的多路复用特性
- 评估域名合并对缓存策略的影响

### 6. 验证方法
1. 使用Chrome开发者工具Network面板
2. 统计页面加载的域名数量
3. 确认静态资源域名在合理范围内

通过合理合并域名数量，可以有效减少DNS解析开销，提升页面加载性能。