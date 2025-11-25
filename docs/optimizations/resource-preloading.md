# 预加载关键资源优化指南

## 问题描述
项目中未对关键资源使用预加载，导致资源加载时机延迟，影响页面渲染性能。

## 优化建议

### 1. 使用link rel="preload"

#### 基本用法
```html
<!-- 预加载关键CSS -->
<link rel="preload" href="critical.css" as="style">

<!-- 预加载关键字体 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预加载关键图片 -->
<link rel="preload" href="hero-image.jpg" as="image">

<!-- 预加载关键脚本 -->
<link rel="preload" href="app.js" as="script">
```

#### as属性值
- `as="script"` - JavaScript文件
- `as="style"` - CSS文件
- `as="image"` - 图片资源
- `as="font"` - 字体文件
- `as="fetch"` - 通过fetch请求的资源

### 2. 预加载字体资源

#### 字体预加载
```html
<!-- 预加载WOFF2字体 -->
<link rel="preload" href="fonts/custom-font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预加载多个字体变体 -->
<link rel="preload" href="fonts/regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="fonts/bold.woff2" as="font" type="font/woff2" crossorigin>
```

#### CSS中使用预加载字体
```css
@font-face {
  font-family: 'CustomFont';
  src: url('fonts/custom-font.woff2') format('woff2');
  font-display: swap; /* 确保字体加载时的显示策略 */
}
```

### 3. 预加载图片资源

#### 关键图片预加载
```html
<!-- 预加载首屏关键图片 -->
<link rel="preload" href="hero-banner.jpg" as="image">

<!-- 预加载不同尺寸的响应式图片 -->
<link rel="preload" href="hero-320.jpg" as="image" media="(max-width: 320px)">
<link rel="preload" href="hero-768.jpg" as="image" media="(max-width: 768px)">
<link rel="preload" href="hero-1024.jpg" as="image" media="(min-width: 769px)">
```

### 4. 预加载API数据

#### 使用fetch预加载
```html
<!-- 预加载关键API数据 -->
<link rel="preload" href="/api/user-data" as="fetch" crossorigin>
```

#### JavaScript中处理预加载数据
```javascript
// 检查预加载的数据
async function getUserData() {
  try {
    const response = await fetch('/api/user-data');
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
}
```

### 5. Webpack预加载配置

#### 魔法注释预加载
```javascript
// 使用Webpack魔法注释预加载
const module = await import(
  /* webpackPreload: true */ 
  './critical-module.js'
);

// 预获取非关键模块
const module = await import(
  /* webpackPrefetch: true */ 
  './non-critical-module.js'
);
```

#### SplitChunks预加载
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

### 6. 实施步骤

1. 识别页面中的关键资源
2. 为关键资源添加preload标签
3. 配置字体和图片的预加载
4. 使用Webpack配置代码分割和预加载
5. 验证预加载效果

### 7. 注意事项

- 只预加载真正关键的资源
- 避免过度预加载占用带宽
- 确保预加载资源会被使用
- 处理预加载失败的情况

### 8. 验证方法

1. 使用Chrome开发者工具Network面板
2. 检查资源的加载优先级
3. 对比优化前后的页面渲染时间
4. 验证资源加载时机

通过预加载关键资源，可以有效提升页面渲染性能，改善用户体验。