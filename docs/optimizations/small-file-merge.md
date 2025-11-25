# 合并JS/CSS小文件优化指南

## 问题描述
项目中存在过多小文件（小于10KB），增加了HTTP请求数量，影响页面加载性能。

## 优化建议

### 1. Webpack配置优化

#### 启用splitChunks
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 合并第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        // 合并公共代码
        common: {
          minChunks: 2,
          chunks: 'all',
          priority: 5
        }
      }
    }
  }
};
```

#### 设置最小文件大小
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      minSize: 10000, // 10KB最小文件大小
      maxSize: 250000 // 250KB最大文件大小
    }
  }
};
```

### 2. Vite配置优化

#### 配置build.rollupOptions
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 手动分块
          vendor: ['vue', 'vue-router'],
          utils: ['lodash', 'axios']
        }
      }
    }
  }
};
```

### 3. 实施步骤

1. 分析构建产物中的小文件
2. 配置代码分割策略
3. 设置合理的文件大小阈值
4. 验证优化效果

### 4. 注意事项

- 避免过度合并导致单文件过大
- 考虑首屏加载和缓存策略
- 平衡请求数量和文件大小

### 5. 验证方法

1. 构建项目后检查dist目录
2. 统计小于10KB的文件数量
3. 确保小文件数量在合理范围内

通过合理的代码分割配置，可以有效减少小文件数量，提升页面加载性能。