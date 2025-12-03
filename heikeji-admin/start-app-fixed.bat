@echo off
echo Starting Spring Boot application...
java -jar target/heikeji-admin-1.0.0.jar > startup-fixed.log 2>&1
echo Application startup completed with exit code: %ERRORLEVEL%
pause