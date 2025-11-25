# 避免同步阻塞API优化指南

## 问题描述
项目中使用alert、confirm、prompt等同步阻塞API，阻塞用户界面和JavaScript执行，影响用户体验。

## 优化建议

### 1. 使用异步模态框替代alert

#### 不推荐的写法
```javascript
// 不推荐：使用alert阻塞执行
function showAlert() {
  alert('这是一个警告信息');
  console.log('这行代码在用户关闭alert后才会执行');
}
```

#### 推荐的异步模态框
```javascript
// 推荐：使用自定义异步模态框
function showAsyncAlert(message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <p>${message}</p>
        <button id="confirm-btn">确定</button>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirm-btn').onclick = () => {
      document.body.removeChild(modal);
      resolve();
    };
  });
}

// 使用示例
async function handleAction() {
  await showAsyncAlert('操作完成！');
  console.log('这行代码会立即执行');
}
```

### 2. 使用异步确认框替代confirm

#### 不推荐的写法
```javascript
// 不推荐：使用confirm阻塞执行
function deleteItem() {
  const confirmed = confirm('确定要删除这个项目吗？');
  if (confirmed) {
    performDelete();
  }
}
```

#### 推荐的异步确认框
```javascript
// 推荐：使用自定义异步确认框
function showAsyncConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <p>${message}</p>
        <div class="modal-buttons">
          <button id="cancel-btn">取消</button>
          <button id="confirm-btn">确定</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirm-btn').onclick = () => {
      document.body.removeChild(modal);
      resolve(true);
    };
    
    document.getElementById('cancel-btn').onclick = () => {
      document.body.removeChild(modal);
      resolve(false);
    };
  });
}

// 使用示例
async function deleteItem() {
  const confirmed = await showAsyncConfirm('确定要删除这个项目吗？');
  if (confirmed) {
    performDelete();
  }
}
```

### 3. 使用异步输入框替代prompt

#### 不推荐的写法
```javascript
// 不推荐：使用prompt阻塞执行
function renameItem() {
  const newName = prompt('请输入新名称：');
  if (newName) {
    performRename(newName);
  }
}
```

#### 推荐的异步输入框
```javascript
// 推荐：使用自定义异步输入框
function showAsyncPrompt(message, defaultValue = '') {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <p>${message}</p>
        <input type="text" id="prompt-input" value="${defaultValue}">
        <div class="modal-buttons">
          <button id="cancel-btn">取消</button>
          <button id="confirm-btn">确定</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    const input = document.getElementById('prompt-input');
    input.focus();
    
    document.getElementById('confirm-btn').onclick = () => {
      const value = input.value;
      document.body.removeChild(modal);
      resolve(value || null);
    };
    
    document.getElementById('cancel-btn').onclick = () => {
      document.body.removeChild(modal);
      resolve(null);
    };
    
    // 支持回车确认
    input.onkeypress = (e) => {
      if (e.key === 'Enter') {
        document.getElementById('confirm-btn').click();
      }
    };
  });
}

// 使用示例
async function renameItem() {
  const newName = await showAsyncPrompt('请输入新名称：');
  if (newName) {
    performRename(newName);
  }
}
```

### 4. 使用现代UI库

#### 使用Element Plus
```javascript
// 使用Element Plus的MessageBox
import { ElMessageBox } from 'element-plus';

async function handleAction() {
  try {
    await ElMessageBox.alert('这是一条消息', '提示', {
      confirmButtonText: '确定'
    });
    console.log('用户点击了确定');
  } catch (action) {
    console.log('用户关闭了对话框');
  }
}

async function deleteItem() {
  try {
    await ElMessageBox.confirm('确定要删除这个项目吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    performDelete();
  } catch (action) {
    console.log('用户取消了删除');
  }
}
```

### 5. 实施步骤

1. 识别项目中使用的同步阻塞API
2. 设计异步替代方案
3. 实现自定义模态框或集成UI库
4. 替换原有同步调用
5. 验证优化效果

### 6. 注意事项

- 确保异步模态框的样式和体验
- 处理键盘导航和无障碍访问
- 考虑移动端适配
- 测试不同浏览器兼容性

### 7. 验证方法

1. 使用Chrome开发者工具Performance面板
2. 检查页面阻塞情况
3. 对比优化前后的用户交互体验
4. 验证功能完整性

通过避免同步阻塞API，可以有效提升用户交互体验，避免页面阻塞。