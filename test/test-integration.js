// 黑科易购订单模块集成测试脚本
// 使用说明：在Node.js环境中运行此脚本

console.log('=== 黑科易购订单模块集成测试 ===');

// 引入Node.js原生模块
const http = require('http');
const https = require('https');

// 测试配置
const testConfig = {
    userId: '1', // 测试用户ID
    testOrderNo: 'TEST' + new Date().getTime().toString().substr(6), // 生成测试订单号
    baseUrl: 'http://localhost:8080/app/order',
    testAddressId: '1', // 测试地址ID
    testProductId: '1', // 测试商品ID
    testProductCount: 1 // 测试商品数量
};

// HTTP请求封装
function httpRequest(url, method, data = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: method,
            headers: {
                'X-User-Id': testConfig.userId,
                'Content-Type': 'application/json'
            }
        };
        
        const req = client.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedResponse = JSON.parse(responseData);
                    resolve(parsedResponse);
                } catch (error) {
                    resolve({ code: res.statusCode, data: responseData, error: error.message });
                }
            });
        });
        
        req.on('error', (error) => {
            reject({ error: error.message });
        });
        
        if (method !== 'GET' && Object.keys(data).length > 0) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// API请求封装
function apiRequest(endpoint, method, data = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${testConfig.baseUrl}${endpoint}`;
    return httpRequest(url, method, data);
}

// 测试用例1：创建订单
async function testCreateOrder() {
    console.log('\n=== 测试用例1：创建订单 ===');
    try {
        const response = await apiRequest('/create', 'POST', {
            addressId: testConfig.testAddressId,
            paymentMethod: 1,
            remark: '测试订单',
            productId: testConfig.testProductId,
            productCount: testConfig.testProductCount
        });
        
        console.log('创建订单响应:', response);
        
        if (response.code === 200 && response.data) {
            console.log('✅ 订单创建成功，订单号:', response.data.orderNo);
            testConfig.testOrderNo = response.data.orderNo;
            return true;
        } else {
            console.error('❌ 订单创建失败:', response.message || '未知错误');
            return false;
        }
    } catch (error) {
        console.error('❌ 订单创建请求失败:', error);
        return false;
    }
}

// 测试用例2：查询订单详情
async function testOrderDetail() {
    console.log('\n=== 测试用例2：查询订单详情 ===');
    try {
        const response = await apiRequest('/detail', 'GET', {
            orderNo: testConfig.testOrderNo
        });
        
        console.log('订单详情响应状态:', response.code);
        
        if (response.code === 200 && response.data) {
            console.log('✅ 订单详情查询成功，订单状态:', response.data.status);
            return true;
        } else {
            console.error('❌ 订单详情查询失败:', response.message || '未知错误');
            return false;
        }
    } catch (error) {
        console.error('❌ 订单详情请求失败:', error);
        return false;
    }
}

// 测试用例3：获取订单列表
async function testOrderList() {
    console.log('\n=== 测试用例3：获取订单列表 ===');
    try {
        const response = await apiRequest('/list', 'GET', {
            status: 'all'
        });
        
        console.log('订单列表响应状态:', response.code);
        
        if (response.code === 200) {
            console.log(`✅ 订单列表获取成功，共${response.data ? response.data.length : 0}个订单`);
            return true;
        } else {
            console.error('❌ 订单列表获取失败:', response.message || '未知错误');
            return false;
        }
    } catch (error) {
        console.error('❌ 订单列表请求失败:', error);
        return false;
    }
}

// 测试用例4：获取订单数量统计
async function testOrderCount() {
    console.log('\n=== 测试用例4：获取订单数量统计 ===');
    try {
        const response = await apiRequest('/count', 'GET');
        
        console.log('订单数量统计响应状态:', response.code);
        
        if (response.code === 200 && response.data) {
            console.log('✅ 订单数量统计获取成功:', response.data);
            return true;
        } else {
            console.error('❌ 订单数量统计获取失败:', response.message || '未知错误');
            return false;
        }
    } catch (error) {
        console.error('❌ 订单数量统计请求失败:', error);
        return false;
    }
}

// 测试用例5：取消订单
async function testCancelOrder() {
    console.log('\n=== 测试用例5：取消订单 ===');
    try {
        const response = await apiRequest('/cancel', 'POST', {
            orderNo: testConfig.testOrderNo
        });
        
        console.log('取消订单响应状态:', response.code);
        
        if (response.code === 200) {
            console.log('✅ 订单取消成功');
            return true;
        } else {
            console.error('❌ 订单取消失败:', response.message || '未知错误');
            return false;
        }
    } catch (error) {
        console.error('❌ 订单取消请求失败:', error);
        return false;
    }
}

// 执行测试套件
async function runTestSuite() {
    console.log(`开始测试，使用用户ID: ${testConfig.userId}`);
    
    // 记录测试结果
    const results = [];
    
    // 执行测试用例
    results.push(await testOrderCount());
    results.push(await testOrderList());
    results.push(await testCreateOrder());
    results.push(await testOrderDetail());
    results.push(await testCancelOrder());
    
    // 计算通过率
    const passedCount = results.filter(result => result).length;
    const totalCount = results.length;
    const passRate = (passedCount / totalCount * 100).toFixed(1);
    
    // 输出测试总结
    console.log('\n=== 测试总结 ===');
    console.log(`总测试用例: ${totalCount}`);
    console.log(`通过: ${passedCount}`);
    console.log(`失败: ${totalCount - passedCount}`);
    console.log(`通过率: ${passRate}%`);
    
    if (passedCount === totalCount) {
        console.log('🎉 所有测试用例通过！');
    } else {
        console.log('⚠️  部分测试用例失败，请检查相关接口');
    }
}

// 自动运行测试
runTestSuite();