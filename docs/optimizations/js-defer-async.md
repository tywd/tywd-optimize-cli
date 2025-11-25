# JS使用defer/async优化指南

## 问题描述
项目中存在过多同步脚本，阻塞HTML解析和页面渲染，影响加载性能。

## 优化建议

### 1. defer属性使用

#### 基本用法
```html
<!-- 使用defer属性，脚本会在HTML解析完成后按顺序执行 -->
<script src="script1.js" defer></script>
<script src="script2.js" defer></script>
```

#### 适用场景
- 不依赖DOM的脚本
- 不需要立即执行的脚本
- 需要保证执行顺序的脚本

### 2. async属性使用

#### 基本用法
```html
<!-- 使用async属性，脚本会异步加载并立即执行 -->
<script src="analytics.js" async></script>
<script src="ads.js" async></script>
```

#### 适用场景
- 独立的第三方脚本
- 不依赖其他脚本的模块
- 执行顺序不重要的脚本

### 3. 脚本位置优化

#### 推荐的脚本位置
```html
<!DOCTYPE html>
<html>
<head>
  <!-- 关键CSS -->
  <link rel="stylesheet" href="critical.css">
  
  <!-- 非关键CSS延迟加载 -->
  <link rel="stylesheet" href="non-critical.css" media="print" onload="this.media='all'">
</head>
<body>
  <!-- 页面内容 -->
  <div id="app"></div>
  
  <!-- 关键脚本使用defer -->
  <script src="vendor.js" defer></script>
  <script src="app.js" defer></script>
  
  <!-- 非关键脚本使用async -->
  <script src="analytics.js" async></script>
</body>
</html>
```

### 4. 动态脚本加载

#### JavaScript动态加载
```javascript
// 动态加载脚本
function loadScript(src, callback) {
  const script = document.createElement('script');
  script.src = src;
  script.onload = callback;
  document.head.appendChild(script);
}

// 使用示例
loadScript('non-critical.js', function() {
  console.log('脚本加载完成');
});
```

### 5. Webpack配置优化

#### 代码分割配置
```javascript
// webpack.config.js
module.exports = {
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

#### 动态导入
```javascript
// 使用动态导入实现懒加载
const module = await import('./module.js');
module.doSomething();
```

### 6. 实施步骤

1. 分析页面中的脚本类型
2. 为合适脚本添加defer或async属性
3. 调整脚本位置到body底部
4. 使用动态加载处理非关键脚本
5. 验证优化效果

### 7. 注意事项

- 避免在head中使用同步脚本
- 确保defer脚本的执行顺序
- 考虑async脚本的执行时机
- 测试不同加载策略的兼容性

### 8. 验证方法

1. 使用Chrome开发者工具Network面板
2. 检查脚本加载和执行时机
3. 对比优化前后的页面加载时间
4. 验证功能完整性

通过合理使用defer和async属性，可以有效避免脚本阻塞，提升页面加载性能。