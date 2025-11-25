# 图片格式优化与压缩指南

## 问题描述
项目中未充分利用现代图片格式或未对图片进行有效压缩，影响页面加载性能。

## 优化建议

### 1. 使用现代图片格式

#### WebP格式
```html
<!-- 使用<picture>标签提供降级支持 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述">
</picture>
```

#### AVIF格式
```html
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="描述">
</picture>
```

### 2. 图片压缩工具

#### 使用Imagemin
```bash
# 安装imagemin及相关插件
npm install --save-dev imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant
```

#### Webpack配置
```javascript
// webpack.config.js
const ImageminPlugin = require('imagemin-webpack-plugin').default;

module.exports = {
  plugins: [
    new ImageminPlugin({
      webp: {
        quality: 75
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.6, 0.8]
      }
    })
  ]
};
```

### 3. Vite图片优化

#### 安装依赖
```bash
npm install --save-dev vite-plugin-imagemin
```

#### 配置Vite插件
```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default {
  plugins: [
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.6, 0.8],
        speed: 4
      },
      webp: {
        quality: 80
      }
    })
  ]
};
```

### 4. 响应式图片

#### 使用srcset
```html
<img 
  srcset="image-320w.jpg 320w,
          image-480w.jpg 480w,
          image-800w.jpg 800w"
  sizes="(max-width: 320px) 280px,
         (max-width: 480px) 440px,
         800px"
  src="image-800w.jpg" 
  alt="描述">
```

### 5. 实施步骤

1. 识别项目中的图片资源
2. 转换为现代格式（WebP/AVIF）
3. 配置构建工具进行自动压缩
4. 添加响应式图片支持
5. 提供降级方案

### 6. 注意事项

- 确保提供适当的降级方案
- 考虑转换成本与收益
- 测试不同浏览器兼容性

### 7. 验证方法

1. 检查图片文件大小
2. 验证现代格式支持
3. 对比优化前后的加载时间

通过图片格式优化与压缩，可以显著减小图片体积，提升页面加载性能。