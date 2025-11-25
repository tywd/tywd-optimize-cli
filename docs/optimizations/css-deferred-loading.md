# 非首屏CSS延迟加载优化指南

## 问题描述
项目中未对非首屏CSS进行延迟加载，导致阻塞页面渲染，影响首屏加载性能。

## 优化建议

### 1. 使用media属性延迟加载

#### 基本用法
```html
<!-- 首屏关键CSS -->
<link rel="stylesheet" href="critical.css">

<!-- 非首屏CSS延迟加载 -->
<link rel="stylesheet" href="print.css" media="print" onload="this.media='all'">
<link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='screen'">
```

#### 多媒体查询延迟加载
```html
<link rel="stylesheet" href="desktop.css" media="print" onload="this.media='screen and (min-width: 768px)'">
<link rel="stylesheet" href="mobile.css" media="print" onload="this.media='screen and (max-width: 767px)'">
```

### 2. JavaScript动态加载

#### 动态创建link标签
```javascript
// 在页面加载完成后加载非关键CSS
window.addEventListener('load', function() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'non-critical.css';
  document.head.appendChild(link);
});
```

#### 使用loadCSS库
```html
<script>
  // loadCSS函数
  function loadCSS(href, before, media) {
    var ss = window.document.createElement('link');
    var ref = before || window.document.getElementsByTagName('script')[0];
    ss.rel = 'stylesheet';
    ss.href = href;
    ss.media = 'only x';
    ref.parentNode.insertBefore(ss, ref);
    setTimeout(function(){ ss.media = media || 'all'; });
    return ss;
  }
  
  // 使用示例
  loadCSS('non-critical.css');
</script>
```

### 3. Webpack配置

#### MiniCssExtractPlugin配置
```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      }
    ]
  }
};
```

### 4. Vite配置

#### CSS代码分割
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将非关键CSS分离
          critical: ['critical.css'],
          nonCritical: ['non-critical.css']
        }
      }
    }
  }
};
```

### 5. 实施步骤

1. 识别首屏和非首屏CSS
2. 为非首屏CSS添加延迟加载属性
3. 验证加载顺序和性能
4. 测试不同设备和网络环境

### 6. 注意事项

- 确保延迟加载不会影响用户体验
- 考虑无JavaScript环境的降级方案
- 避免过度延迟关键样式

### 7. 验证方法

1. 使用Chrome开发者工具Network面板
2. 检查CSS文件的加载时机
3. 对比优化前后的首屏渲染时间

通过非首屏CSS延迟加载，可以有效提升首屏渲染速度，改善用户体验。