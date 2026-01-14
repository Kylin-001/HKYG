#!/bin/bash

# 转换Swagger 2注解为OpenAPI 3注解的脚本

# 要转换的目录
TARGET_DIR="/home/heikeji/heikeji-mall/heikeji-mall-service"

# 查找所有使用了Swagger 2注解的Java文件
FILES=$(grep -r -l "io.swagger.annotations" $TARGET_DIR --include="*.java")

# 遍历所有文件进行转换
for FILENAME in $FILES; do
    echo "正在转换文件: $FILENAME"
    
    # 转换导入语句
    sed -i 's/import io.swagger.annotations.ApiModel;/import io.swagger.v3.oas.annotations.media.Schema;/g' $FILENAME
    sed -i 's/import io.swagger.annotations.ApiModelProperty;/import io.swagger.v3.oas.annotations.media.Schema;/g' $FILENAME
    
    # 转换类注解
    sed -i 's/@ApiModel(description = "\(.*\)")/@Schema(description = "\1")/g' $FILENAME
    
    # 转换属性注解
    sed -i 's/@ApiModelProperty(value = "\(.*\)")/@Schema(description = "\1")/g' $FILENAME
    
    # 如果有@Api、@ApiOperation、@ApiParam等注解，也进行转换
    sed -i 's/import io.swagger.annotations.Api;/import io.swagger.v3.oas.annotations.tags.Tag;/g' $FILENAME
    sed -i 's/import io.swagger.annotations.ApiOperation;/import io.swagger.v3.oas.annotations.Operation;/g' $FILENAME
    sed -i 's/import io.swagger.annotations.ApiParam;/import io.swagger.v3.oas.annotations.Parameter;/g' $FILENAME
    sed -i 's/import io.swagger.annotations.ApiImplicitParam;/import io.swagger.v3.oas.annotations.Parameter;/g' $FILENAME
    sed -i 's/import io.swagger.annotations.ApiImplicitParams;/import io.swagger.v3.oas.annotations.Parameters;/g' $FILENAME
    
    sed -i 's/@Api(tags = "\(.*\)")/@Tag(name = "\1")/g' $FILENAME
    sed -i 's/@ApiOperation("\(.*\)")/@Operation(summary = "\1")/g' $FILENAME
    sed -i 's/@ApiParam("\(.*\)")/@Parameter(description = "\1")/g' $FILENAME
    sed -i 's/@ApiParam(name = "\(.*\)", value = "\(.*\)")/@Parameter(name = "\1", description = "\2")/g' $FILENAME
done

echo "转换完成！"