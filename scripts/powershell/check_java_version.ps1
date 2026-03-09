# 检查并确保所有模块的pom.xml都配置为Java 17
Write-Host "开始检查所有模块的Java版本配置..."

# 查找所有pom.xml文件
$pomFiles = Get-ChildItem -Path . -Filter "pom.xml" -Recurse -ErrorAction SilentlyContinue

$totalFiles = $pomFiles.Count
$updatedFiles = 0
$conformingFiles = 0
$errorFiles = 0

Write-Host "找到 $totalFiles 个pom.xml文件"
Write-Host "-------------------------------------"

foreach ($pomFile in $pomFiles) {
    try {
        $filePath = $pomFile.FullName
        $content = Get-Content -Path $filePath -Raw
        
        # 检查是否已有Java 17配置
        $hasJava17 = $content -match '<java\.version>17</java\.version>'
        $hasCompiler17 = $content -match '<source>17</source>.*<target>17</target>' -or $content -match '<target>17</target>.*<source>17</source>'
        
        $needsUpdate = $false
        
        # 如果没有java.version属性，添加到properties部分
        if (-not $hasJava17) {
            if ($content -match '(<properties>.*?</properties>)') {
                $propertiesSection = $matches[1]
                if (-not $propertiesSection -match '<java\.version>') {
                    $newProperties = $propertiesSection -replace '<properties>', '<properties>\n        <java.version>17</java.version>'
                    $content = $content -replace [regex]::Escape($propertiesSection), $newProperties
                    $needsUpdate = $true
                }
            }
        }
        
        # 如果没有maven-compiler-plugin的source和target配置，添加或更新
        if (-not $hasCompiler17) {
            if ($content -match '(<build>.*?</build>)') {
                $buildSection = $matches[1]
                
                if ($buildSection -match '(<plugin>.*?<artifactId>maven-compiler-plugin</artifactId>.*?</plugin>)') {
                    # 更新现有的maven-compiler-plugin配置
                    $pluginSection = $matches[1]
                    if (-not $pluginSection -match '<source>17</source>') {
                        if ($pluginSection -match '<configuration>') {
                            $newPlugin = $pluginSection -replace '<configuration>', '<configuration>\n                <source>17</source>\n                <target>17</target>'
                            $buildSection = $buildSection -replace [regex]::Escape($pluginSection), $newPlugin
                            $needsUpdate = $true
                        }
                    }
                } else {
                    # 添加新的maven-compiler-plugin配置
                    $newPlugin = @"
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>
"@
                    
                    if ($buildSection -match '(<plugins>.*?</plugins>)') {
                        $pluginsSection = $matches[1]
                        $newPlugins = $pluginsSection -replace '<plugins>', "<plugins>\n$newPlugin"
                        $buildSection = $buildSection -replace [regex]::Escape($pluginsSection), $newPlugins
                        $needsUpdate = $true
                    }
                }
                
                if ($needsUpdate) {
                    $content = $content -replace [regex]::Escape($matches[1]), $buildSection
                }
            }
        }
        
        # 保存更新后的文件
        if ($needsUpdate) {
            Set-Content -Path $filePath -Value $content
            Write-Host "✅ 已更新: $filePath"
            $updatedFiles++
        } else {
            Write-Host "✅ 已符合要求: $filePath"
            $conformingFiles++
        }
        
    } catch {
        Write-Host "❌ 处理失败: $($pomFile.FullName) - 错误: $($_.Exception.Message)"
        $errorFiles++
    }
}

Write-Host "-------------------------------------"
Write-Host "检查完成!"
Write-Host "总文件数: $totalFiles"
Write-Host "已更新文件: $updatedFiles"
Write-Host "已符合要求文件: $conformingFiles"
Write-Host "处理失败文件: $errorFiles"
Write-Host "-------------------------------------"