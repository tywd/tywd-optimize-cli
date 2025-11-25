# 拆分JS长任务优化指南

## 问题描述
项目中存在执行时间超过50ms的JS长任务，阻塞主线程，影响页面交互响应性能。

## 优化建议

### 1. 使用requestIdleCallback

#### 基本用法
```javascript
// 使用requestIdleCallback处理非紧急任务
function performIdleWork(deadline) {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.pop();
    processTask(task);
  }
  
  if (tasks.length > 0) {
    requestIdleCallback(performIdleWork);
  }
}

// 启动空闲任务处理
if ('requestIdleCallback' in window) {
  requestIdleCallback(performIdleWork);
} else {
  // 降级处理
  setTimeout(performIdleWork, 1);
}
```

### 2. 使用requestAnimationFrame

#### 动画任务处理
```javascript
// 使用requestAnimationFrame处理动画相关任务
function animateProgress() {
  const progress = getProgress();
  
  // 更新UI
  updateProgressBar(progress);
  
  if (progress < 100) {
    requestAnimationFrame(animateProgress);
  }
}

// 启动动画
requestAnimationFrame(animateProgress);
```

### 3. 任务分片处理

#### 大数据处理分片
```javascript
// 将大任务分片处理
function processLargeDataSet(data, chunkSize = 100) {
  let index = 0;
  
  function processChunk() {
    const chunk = data.slice(index, index + chunkSize);
    
    // 处理当前分片
    chunk.forEach(item => {
      processItem(item);
    });
    
    index += chunkSize;
    
    // 如果还有数据，继续处理
    if (index < data.length) {
      setTimeout(processChunk, 0);
    } else {
      // 处理完成
      onComplete();
    }
  }
  
  // 开始处理
  processChunk();
}
```

### 4. Web Workers

#### 后台线程处理
```javascript
// main.js
// 创建Web Worker处理耗时任务
const worker = new Worker('worker.js');

worker.postMessage({
  type: 'PROCESS_DATA',
  data: largeDataSet
});

worker.onmessage = function(event) {
  const { type, result } = event.data;
  
  if (type === 'PROCESS_COMPLETE') {
    updateUI(result);
  }
};

// worker.js
self.onmessage = function(event) {
  const { type, data } = event.data;
  
  if (type === 'PROCESS_DATA') {
    const result = processData(data);
    
    self.postMessage({
      type: 'PROCESS_COMPLETE',
      result: result
    });
  }
};
```

### 5. 实施步骤

1. 识别项目中的长任务
2. 分析任务执行时间和频率
3. 选择合适的任务拆分策略
4. 实现任务分片或后台处理
5. 验证优化效果

### 6. 注意事项

- 确保任务拆分不影响功能逻辑
- 考虑任务状态和数据一致性
- 处理浏览器兼容性问题
- 避免过度拆分影响性能

### 7. 验证方法

1. 使用Chrome开发者工具Performance面板
2. 检查主线程任务执行时间
3. 对比优化前后的页面响应性能
4. 验证功能完整性

通过拆分JS长任务，可以有效减少主线程阻塞，提升页面交互响应性能。