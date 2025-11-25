# 图片懒加载优化指南

## 问题描述
项目中未对非首屏图片使用懒加载，导致一次性加载过多图片，影响页面加载性能。

## 优化建议

### 1. 使用loading="lazy"属性

#### 基本用法
```html
<!-- 为非首屏图片添加loading="lazy"属性 -->
<img src="image.jpg" alt="描述" loading="lazy">

<!-- 适用于图片和iframe -->
<iframe src="video.html" loading="lazy"></iframe>
```

#### 适用场景
- 非首屏图片
- 用户需要滚动才能看到的内容
- 大量图片的列表或网格

### 2. 使用Intersection Observer API

#### 基本实现
```javascript
// 创建观察器
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

// 观察所有懒加载图片
document.querySelectorAll('img[data-src]').forEach(img => {
  imageObserver.observe(img);
});
```

#### HTML结构
```html
<!-- 使用data-src存储真实图片地址 -->
<img data-src="image.jpg" alt="描述" class="lazy">
```

#### CSS样式
```css
.lazy {
  opacity: 0;
  transition: opacity 0.3s;
}

.lazy.loaded {
  opacity: 1;
}
```

### 3. 完整的懒加载实现

#### JavaScript实现
```javascript
class LazyLoad {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.imageObserver = null;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            observer.unobserve(entry.target);
          }
        });
      });

      this.images.forEach(img => this.imageObserver.observe(img));
    } else {
      // 降级处理：直接加载所有图片
      this.images.forEach(img => this.loadImage(img));
    }
  }

  loadImage(image) {
    image.src = image.dataset.src;
    image.classList.add('loaded');
  }
}

// 初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
  new LazyLoad();
});
```

### 4. Webpack/Vite配置

#### 图片优化插件
```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin';

export default {
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.6, 0.8] },
      webp: { quality: 80 }
    })
  ]
};
```

### 5. 实施步骤

1. 识别非首屏图片
2. 为图片添加loading="lazy"属性
3. 实现Intersection Observer API方案
4. 添加降级处理
5. 验证懒加载效果

### 6. 注意事项

- 首屏图片不建议使用懒加载
- 确保提供合适的占位符
- 考虑SEO对懒加载图片的影响
- 测试不同浏览器兼容性

### 7. 验证方法

1. 使用Chrome开发者工具Network面板
2. 检查图片加载时机
3. 对比优化前后的页面加载时间
4. 验证滚动时的图片加载

通过图片懒加载，可以有效减少初始页面加载的图片数量，提升页面加载性能。