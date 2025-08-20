// API 基础URL
const API_BASE_URL = ''; // 为空时使用相对路径

// API 请求工具
const api = {
    get: async (url) => {
        const response = await fetch(`${API_BASE_URL}${url}`);
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        return response.json();
    },
    post: async (url, data) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        return response.json();
    },
    put: async (url, data) => {
        const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        return response.json();
    }
};

// 检查登录状态
function checkLogin() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return null;
    }
    return JSON.parse(userStr);
}

// 退出登录
function logout() {
    localStorage.removeItem('user');
    window.location.href = '/';
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待审批',
        'approved': '已批准',
        'rejected': '已拒绝'
    };
    return statusMap[status] || '未知状态';
}

// 显示提示消息
function showToast(message, type = 'success') {
    // 检查是否已存在toast元素，存在则移除
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = `toast-notification fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-y-0 opacity-100 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    toast.textContent = message;

    // 添加到页面
    document.body.appendChild(toast);

    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
