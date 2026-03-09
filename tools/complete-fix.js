const fs = require('fs');
const path = require('path');

// 完全修复Vue文件中的转义引号问题
function completelyFixVueFile(filePath) {
    try {
        console.log(`=== 完全修复Vue文件转义引号 ===`);
        console.log(`文件: ${filePath}`);
        
        if (!fs.existsSync(filePath)) {
            console.log('❌ 文件不存在');
            return false;
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        console.log(`✅ 文件读取成功，大小: ${content.length} 字符`);
        
        // 检查修复前的状态
        console.log('\n=== 修复前检查 ===');
        const escapedQuotes = (content.match(/\\\\\"/g) || []).length;
        console.log(`转义引号数量 (\\\\\"): ${escapedQuotes}`);
        
        // 检查第5501位置的字符
        if (content.length > 5501) {
            const char5501 = content.charAt(5501);
            const ascii5501 = content.charCodeAt(5501);
            console.log(`第5501字符: "${char5501}" (ASCII: ${ascii5501})`);
            
            const context = content.substring(5480, 5520);
            console.log(`第5501位置上下文: ${JSON.stringify(context)}`);
        }
        
        if (escapedQuotes > 0) {
            console.log('\n=== 开始修复转义引号 ===');
            // 替换所有的转义引号
            content = content.replace(/\\\\\"/g, '"');
            
            // 验证修复结果
            const newEscapedQuotes = (content.match(/\\\\\"/g) || []).length;
            console.log(`修复后转义引号数量: ${newEscapedQuotes}`);
            
            if (newEscapedQuotes === 0) {
                console.log('✅ 转义引号修复成功！');
                
                // 检查修复后第5501位置的字符
                if (content.length > 5501) {
                    const newChar5501 = content.charAt(5501);
                    const newAscii5501 = content.charCodeAt(5501);
                    console.log(`修复后第5501字符: "${newChar5501}" (ASCII: ${newAscii5501})`);
                    
                    const newContext = content.substring(5480, 5520);
                    console.log(`修复后上下文: ${JSON.stringify(newContext)}`);
                }
                
                // 写回文件
                fs.writeFileSync(filePath, content);
                console.log('✅ 文件已保存');
                return true;
            } else {
                console.log('❌ 修复失败，仍有转义引号');
                return false;
            }
        } else {
            console.log('✅ 没有发现转义引号');
            
            // 检查是否已经有正常的引号
            if (content.length > 5501) {
                const char5501 = content.charAt(5501);
                const context = content.substring(5480, 5520);
                console.log(`当前第5501字符: "${char5501}"`);
                console.log(`当前上下文: ${JSON.stringify(context)}`);
                
                if (context.includes('class="') || context.includes("class='")) {
                    console.log('✅ 引号格式正确');
                    return true;
                } else {
                    console.log('❌ 引号格式不正确');
                    return false;
                }
            }
        }
        
        return true;
        
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return false;
    }
}

// 修复order.vue文件
const orderVuePath = path.join(__dirname, 'heikeji-frontend', 'src', 'views', 'takeaway', 'order.vue');
const isFixed = completelyFixVueFile(orderVuePath);

console.log(`\n${'='.repeat(60)}`);
console.log(`修复结果: ${isFixed ? '✅ 成功' : '❌ 失败'}`);