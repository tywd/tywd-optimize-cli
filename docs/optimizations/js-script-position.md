# JS脚本位置优化指南

## 问题描述
项目中存在在head标签中使用同步脚本的情况，阻塞HTML解析和页面渲染。

## 优化建议

### 1. 推荐的脚本位置

#### 最佳实践
```html
<!DOCTYPE html>
<html>
<head>
  <!-- 关键CSS放在head中 -->
  <link rel="stylesheet" href="critical.css">
  
  <!-- 非关键CSS延迟加载 -->
  <link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
</head>
<body>
  <!-- 页面内容 -->
  <div id="app">
    <!-- 应用内容 -->
  </div>
  
  <!-- 脚本放在body底部 -->
  <script src="vendor.js" defer></script>
  <script src="app.js" defer></script>
  
  <!-- 第三方脚本使用async -->
  <script src="analytics.js" async></script>
</body>
</html>
```

### 2. 脚本加载策略

#### defer脚本
```html
<!-- defer脚本：HTML解析完成后按顺序执行 -->
<script src="script1.js" defer></script>
<script src="script2.js" defer></script>
```

#### async脚本
```html
<!-- async脚本：异步加载并立即执行 -->
<script src="analytics.js" async></script>
<script src="ads.js" async></script>
```

### 3. 关键脚本内联

#### 内联关键脚本
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="styles.css">
  
  <!-- 内联关键脚本 -->
  <script>
    // 关键初始化代码
    window.APP_CONFIG = {
      apiUrl: 'https://api.example.com',
      version: '1.0.0'
    };
  </script>
</head>
<body>
  <div id="app"></div>
  
  <!-- 非关键脚本 -->
  <script src="app.js" defer></script>
</body>
</html>
```

### 4. 动态脚本加载

#### JavaScript动态加载
```javascript
// 动态加载非关键脚本
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
}

// 页面加载完成后加载非关键脚本
window.addEventListener('load', function() {
  loadScript('non-critical.js', function() {
    console.log('非关键脚本加载完成');
  });
});
```

### 5. Webpack配置优化

#### 代码分割
```javascript
// webpack.config.js
module.exports = {
  entry: {
    main: './src/main.js',
    vendor: './src/vendor.js'
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

### 6. 实施步骤

1. 分析现有脚本位置
2. 将非关键脚本移至body底部
3. 为脚本添加适当的加载属性
4. 内联关键脚本
5. 实现动态加载机制
6. 验证优化效果

### 7. 注意事项

- 关键CSS仍应放在head中
- 避免阻塞渲染的脚本
- 确保脚本执行顺序
- 考虑SEO对脚本位置的要求

### 8. 验证方法

1. 使用Chrome开发者工具Performance面板
2. 检查HTML解析和脚本执行时间线
3. 对比优化前后的页面加载性能
4. 验证功能完整性

通过优化JS脚本位置，可以有效减少HTML解析阻塞，提升页面渲染性能。