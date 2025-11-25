# 移除未使用资源优化指南

## 问题描述
项目中可能存在未使用的JS/CSS资源，增加了包体积和加载时间。

## 优化建议

### 1. 使用Webpack Bundle Analyzer

#### 安装依赖
```bash
npm install --save-dev webpack-bundle-analyzer
```

#### 配置分析工具
```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html'
    })
  ]
};
```

### 2. 使用Vite Bundle Analyzer

#### 安装依赖
```bash
npm install --save-dev rollup-plugin-visualizer
```

#### 配置分析工具
```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
};
```

### 3. 代码分割优化

#### 动态导入
```javascript
// 优化前
import { heavyFunction } from './utils/heavy';

// 优化后
const heavyFunction = () => import('./utils/heavy');
```

#### 路由懒加载
```javascript
// Vue Router示例
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')
  }
];
```

### 4. Tree Shaking配置

#### package.json配置
```json
{
  "sideEffects": false
}
```

#### Webpack配置
```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  optimization: {
    usedExports: true,
    sideEffects: true
  }
};
```

### 5. 实施步骤

1. 运行Bundle Analyzer分析包体积
2. 识别未使用的模块和依赖
3. 移除或懒加载不必要的代码
4. 验证优化效果

### 6. 注意事项

- 确保移除的代码确实未被使用
- 注意副作用模块的处理
- 考虑代码拆分对缓存的影响

### 7. 验证方法

1. 对比优化前后的包体积
2. 检查Bundle Analyzer报告
3. 确认功能完整性

通过移除未使用资源，可以有效减小包体积，提升加载性能。