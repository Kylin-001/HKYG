@echo off

rem 黑科易购项目Windows部署脚本
rem 使用说明: deploy.bat [环境] [服务名称]
rem 环境可选值: dev, test, prod
rem 服务名称可选值: admin, api, app, system, order, product

echo ============================================
echo 黑科易购项目部署脚本
rem Windows版本
echo ============================================

rem 检查参数
if "%1"=="" (    
    echo 错误: 缺少环境参数
    echo 使用方法: deploy.bat [环境] [服务名称]
    echo 环境: dev, test, prod
    echo 服务: admin, api, app, system, order, product
    exit /b 1
)

if "%2"=="" (    
    echo 错误: 缺少服务名称参数
    echo 使用方法: deploy.bat [环境] [服务名称]
    echo 环境: dev, test, prod
    echo 服务: admin, api, app, system, order, product
    exit /b 1
)

set ENV=%1
set SERVICE=%2

rem 验证环境参数
if "%ENV%" neq "dev" if "%ENV%" neq "test" if "%ENV%" neq "prod" (    
    echo 错误: 环境参数无效，必须是 dev, test 或 prod
    exit /b 1
)

rem 验证服务参数
set VALID_SERVICE=false
for %%s in (admin api app system order product) do (    
    if "%SERVICE%"=="%%s" set VALID_SERVICE=true
)

if "%VALID_SERVICE%"=="false" (    
    echo 错误: 服务参数无效，请检查服务名称
    exit /b 1
)

rem 定义变量
set PROJECT_NAME=heikeji-mall
set PROJECT_DIR=%~dp0
set PROJECT_DIR=%PROJECT_DIR:~0,-1%
set BUILD_DIR=%PROJECT_DIR%\target
set DEPLOY_DIR=C:\opt\%PROJECT_NAME%\%ENV%\%SERVICE%
set JAR_NAME=heikeji-%SERVICE%-1.0.0.jar
set CONFIG_DIR=%PROJECT_DIR%\heikeji-%SERVICE%\src\main\resources
set CONFIG_FILE=application-%ENV%.yml
set LOG_DIR=C:\var\log\%PROJECT_NAME%\%ENV%\%SERVICE%
set PID_FILE=%DEPLOY_DIR%\%SERVICE%.pid

rem 检查Java环境
echo 检查Java环境...
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (    
    echo 错误: 未找到Java，请安装JDK 8或更高版本
    exit /b 1
)

for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do (    
    set JAVA_VERSION=%%i
)
set JAVA_VERSION=%JAVA_VERSION:~1,-1%
echo 当前Java版本: %JAVA_VERSION%

rem 创建必要的目录
echo 创建必要的目录...
mkdir "%DEPLOY_DIR%" 2>nul
mkdir "%LOG_DIR%" 2>nul

rem 构建项目
echo 构建项目...
cd "%PROJECT_DIR%"
mvn clean package -Dmaven.test.skip=true -P%ENV%

if not exist "%BUILD_DIR%\%JAR_NAME%" (    
    echo 错误: 构建失败，未找到JAR文件 %BUILD_DIR%\%JAR_NAME%
    exit /b 1
)

rem 停止运行中的服务
echo 停止运行中的服务...
if exist "%PID_FILE%" (    
    for /f %%p in (%PID_FILE%) do (    
        set PID=%%p
    )
    tasklist /fi "PID eq %PID%" 2>nul | findstr /i "java.exe" >nul
    if %ERRORLEVEL% equ 0 (    
        echo 正在停止进程 %PID%...
        taskkill /PID %PID% /F >nul
        timeout /t 5 >nul
    )
    del "%PID_FILE%"
)

rem 部署应用
echo 部署应用...
copy /Y "%BUILD_DIR%\%JAR_NAME%" "%DEPLOY_DIR%\"
if exist "%CONFIG_DIR%\%CONFIG_FILE%" (    
    copy /Y "%CONFIG_DIR%\%CONFIG_FILE%" "%DEPLOY_DIR%\application.yml"
) else (    
    echo 警告: 未找到配置文件 %CONFIG_DIR%\%CONFIG_FILE%
    if exist "%CONFIG_DIR%\application.yml" (    
        copy /Y "%CONFIG_DIR%\application.yml" "%DEPLOY_DIR%\application.yml"
        echo 已复制默认配置文件
    )
)

rem 设置环境变量
set JAVA_OPTS=-Xms512m -Xmx1024m -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=256m
set JAVA_OPTS=%JAVA_OPTS% -Dspring.profiles.active=%ENV%
set JAVA_OPTS=%JAVA_OPTS% -Dlogging.file=%LOG_DIR%\%SERVICE%.log

rem 启动服务
echo 启动服务...
cd "%DEPLOY_DIR%"
start "黑科易购-%SERVICE%-%ENV%" javaw %JAVA_OPTS% -jar %JAR_NAME%

rem 获取新进程PID
echo 检查服务启动状态...
timeout /t 10 >nul
for /f "tokens=2" %%p in ('tasklist /fi "WINDOWTITLE eq 黑科易购-%SERVICE%-%ENV%" /fo LIST ^| findstr /i "PID"') do (    
    set NEW_PID=%%p
)

if defined NEW_PID (    
    echo %NEW_PID% > "%PID_FILE%"
    echo ============================================
    echo 服务部署成功!
    echo 服务名称: %SERVICE%
    echo 环境: %ENV%
    echo 部署目录: %DEPLOY_DIR%
    echo 日志目录: %LOG_DIR%
    echo PID: %NEW_PID%
    echo ============================================
) else (    
    echo 错误: 服务启动失败，请检查日志文件: %LOG_DIR%\%SERVICE%.log
    exit /b 1
)