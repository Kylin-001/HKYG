package com.heikeji.mall.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.heikeji.mall.product.entity.Category;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 商品分类Mapper接口
 */
public interface CategoryMapper extends BaseMapper<Category> {

    /**
     * 查询所有启用状态的分类
     */
    List<Category> selectEnabledCategories();

    /**
     * 根据状态查询分类
     */
    List<Category> selectByStatus(Integer status);

    /**
     * 按排序顺序查询分类列表
     */
    List<Category> selectOrderBySort();
    
    /**
     * 根据父分类ID查询子分类
     * @param parentId 父分类ID
     * @return 子分类列表
     */
    List<Category> selectByParentId(@Param("parentId") Long parentId);
    
    /**
     * 获取所有分类（包含父子关系）
     * @return 分类列表
     */
    List<Category> selectAllCategoriesWithRelation();
    
    /**
     * 获取启用的分类树
     * @return 分类树列表
     */
    List<Category> selectEnabledCategoryTree();
    
    /**
     * 计算分类的深度（层级）
     * @param categoryId 分类ID
     * @return 分类深度（从1开始计数）
     */
    Integer selectCategoryDepth(@Param("categoryId") Long categoryId);
    
    /**
     * 检查是否存在启用状态的子分类
     * @param categoryId 分类ID
     * @return 存在启用状态子分类的数量
     */
    Integer countEnabledSubCategories(@Param("categoryId") Long categoryId);
    
    /**
     * 检查是否存在子分类
     * @param categoryId 分类ID
     * @return 子分类数量
     */
    Integer countSubCategories(@Param("categoryId") Long categoryId);
    
    /**
     * 获取完整分类路径（从顶级到当前分类）
     * @param categoryId 分类ID
     * @return 分类路径列表
     */
    List<Category> selectCategoryPath(@Param("categoryId") Long categoryId);
    
    /**
     * 获取父分类列表（递归）
     * @param categoryId 分类ID
     * @return 父分类列表
     */
    List<Category> selectParentCategories(@Param("categoryId") Long categoryId);
    
    /**
     * 查询指定层级的分类
     * @param level 层级
     * @return 分类列表
     */
    List<Category> selectCategoriesByLevel(@Param("level") Integer level);
    
    /**
     * 根据分类ID列表查询分类信息
     * @param ids 分类ID列表
     * @return 分类列表
     */
    List<Category> selectCategoriesByIds(@Param("ids") List<Long> ids);
    
    /**
     * 检查分类名称是否存在（排除指定ID）
     * @param name 分类名称
     * @param id 排除的分类ID
     * @return 存在数量
     */
    Integer checkCategoryNameExists(@Param("name") String name, @Param("id") Long id);
}