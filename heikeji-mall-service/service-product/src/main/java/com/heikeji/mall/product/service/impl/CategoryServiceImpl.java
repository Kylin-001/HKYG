package com.heikeji.mall.product.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.heikeji.mall.product.entity.Category;
import com.heikeji.mall.product.mapper.CategoryMapper;
import com.heikeji.mall.product.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 商品分类服务实现类
 */
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    private static final int MAX_CATEGORY_LEVEL = 3; // 最大分类层级

    @Autowired
    private CategoryMapper categoryMapper;

    @Override
    @Cacheable(value = "category", key = "'enabled_list'")
    public List<Category> getEnabledCategories() {
        return categoryMapper.selectEnabledCategories();
    }

    @Override
    public List<Category> getByStatus(Integer status) {
        return categoryMapper.selectByStatus(status);
    }

    @Override
    public List<Category> getCategoriesBySort() {
        return categoryMapper.selectOrderBySort();
    }

    @Override
    @CacheEvict(value = {"category"}, allEntries = true)
    public Boolean enableCategory(Long categoryId) {
        Category category = this.getById(categoryId);
        if (category != null) {
            category.setStatus(1);
            return this.updateById(category);
        }
        return false;
    }

    @Override
    @CacheEvict(value = {"category"}, allEntries = true)
    public Boolean disableCategory(Long categoryId) {
        // 检查是否有启用状态的子分类
        List<Category> subCategories = this.getSubCategoriesRecursive(categoryId);
        for (Category subCategory : subCategories) {
            if (subCategory.getStatus() == 1) {
                // 存在启用状态的子分类，不允许禁用
                return false;
            }
        }
        
        Category category = this.getById(categoryId);
        if (category != null) {
            category.setStatus(0);
            return this.updateById(category);
        }
        return false;
    }
    
    @Override
    @Cacheable(value = "category", key = "'sub_'+#parentId")
    public List<Category> getSubCategories(Long parentId) {
        return categoryMapper.selectByParentId(parentId);
    }
    
    /**
     * 递归获取所有子分类
     * @param parentId 父分类ID
     * @return 所有子分类列表
     */
    public List<Category> getSubCategoriesRecursive(Long parentId) {
        List<Category> allSubCategories = new ArrayList<>();
        getSubCategoriesRecursive(parentId, allSubCategories);
        return allSubCategories;
    }
    
    private void getSubCategoriesRecursive(Long parentId, List<Category> result) {
        List<Category> subCategories = this.getSubCategories(parentId);
        if (!CollectionUtils.isEmpty(subCategories)) {
            result.addAll(subCategories);
            for (Category subCategory : subCategories) {
                getSubCategoriesRecursive(subCategory.getId(), result);
            }
        }
    }
    
    @Override
    @Cacheable(value = "category", key = "'all_tree'")
    public List<Category> getAllCategoryTree() {
        List<Category> allCategories = categoryMapper.selectAllCategoriesWithRelation();
        if (CollectionUtils.isEmpty(allCategories)) {
            return new ArrayList<>();
        }
        // 使用备用方法构建树形结构，确保children正确设置
        return buildCategoryTree(allCategories);
    }
    
    @Override
    @Cacheable(value = "category", key = "'enabled_tree'")
    public List<Category> getEnabledCategoryTree() {
        List<Category> enabledCategories = categoryMapper.selectEnabledCategoryTree();
        if (CollectionUtils.isEmpty(enabledCategories)) {
            return new ArrayList<>();
        }
        // 确保返回的是正确的树形结构
        return buildCategoryTree(enabledCategories.stream()
                .filter(cat -> cat.getStatus() == 1)
                .collect(Collectors.toList()));
    }
    
    @Override
    public List<Category> getParentCategories(Long categoryId) {
        List<Category> parentCategories = new ArrayList<>();
        Category currentCategory = this.getById(categoryId);
        
        // 递归查找父分类
        while (currentCategory != null && currentCategory.getParentId() != null && currentCategory.getParentId() != 0) {
            currentCategory = this.getById(currentCategory.getParentId());
            if (currentCategory != null) {
                parentCategories.add(0, currentCategory); // 添加到列表开头，保证顺序从顶级到当前
            }
        }
        
        return parentCategories;
    }
    
    /**
     * 构建完整的分类路径（包含当前分类）
     * @param categoryId 分类ID
     * @return 完整分类路径
     */
    public List<Category> getCompleteCategoryPath(Long categoryId) {
        List<Category> path = getParentCategories(categoryId);
        Category currentCategory = getById(categoryId);
        if (currentCategory != null) {
            path.add(currentCategory);
        }
        return path;
    }
    
    /**
     * 检查分类层级是否合法
     * @param parentId 父分类ID
     * @return 是否合法
     */
    public boolean checkCategoryLevel(Long parentId) {
        if (parentId == null || parentId == 0) {
            // 顶级分类，层级为1
            return true;
        }
        
        Category parentCategory = getById(parentId);
        if (parentCategory == null) {
            return false;
        }
        
        // 检查父分类的层级
        int parentLevel = parentCategory.getLevel() == null ? 0 : parentCategory.getLevel();
        return parentLevel < MAX_CATEGORY_LEVEL;
    }
    
    /**
     * 计算分类层级
     * @param parentId 父分类ID
     * @return 分类层级
     */
    public int calculateCategoryLevel(Long parentId) {
        if (parentId == null || parentId == 0) {
            return 1;
        }
        
        Category parentCategory = getById(parentId);
        if (parentCategory == null) {
            return 1; // 默认顶级分类
        }
        
        int parentLevel = parentCategory.getLevel() == null ? 0 : parentCategory.getLevel();
        return parentLevel + 1;
    }
    
    /**
     * 构建分类树
     * @param allCategories 所有分类列表
     * @return 分类树列表
     */
    private List<Category> buildCategoryTree(List<Category> allCategories) {
        List<Category> rootCategories = new ArrayList<>();
        Map<Long, Category> categoryMap = new HashMap<>();
        
        // 构建分类ID到分类对象的映射
        for (Category category : allCategories) {
            categoryMap.put(category.getId(), category);
            category.setChildren(new ArrayList<Category>());
        }
        
        // 构建树形结构
        for (Category category : allCategories) {
            if (category.getParentId() == null || category.getParentId() == 0) {
                // 顶级分类
                rootCategories.add(category);
            } else {
                // 子分类，添加到父分类的children列表
                Category parent = categoryMap.get(category.getParentId());
                if (parent != null) {
                    parent.getChildren().add(category);
                }
            }
        }
        
        // 对子分类进行排序
        sortCategoryTree(rootCategories);
        
        return rootCategories;
    }
    
    /**
     * 递归对子分类进行排序
     * @param categories 分类列表
     */
    private void sortCategoryTree(List<Category> categories) {
        if (CollectionUtils.isEmpty(categories)) {
            return;
        }
        
        // 按排序字段排序
        categories.sort(Comparator.comparingInt(Category::getSortOrder).thenComparing(Category::getId));
        
        // 递归排序子分类
        for (Category category : categories) {
            if (!CollectionUtils.isEmpty(category.getChildren())) {
                sortCategoryTree(category.getChildren());
            }
        }
    }
    
    @Override
    @Transactional
    @CacheEvict(value = {"category"}, allEntries = true)
    public boolean save(Category category) {
        // 检查分类层级
        if (!checkCategoryLevel(category.getParentId())) {
            throw new RuntimeException("分类层级超过最大限制（" + MAX_CATEGORY_LEVEL + "级）");
        }
        
        // 计算层级
        category.setLevel(calculateCategoryLevel(category.getParentId()));
        
        // 设置默认值
        if (category.getSortOrder() == null) {
            category.setSortOrder(0);
        }
        if (category.getStatus() == null) {
            category.setStatus(1); // 默认启用
        }
        
        return super.save(category);
    }
    
    @Override
    @Transactional
    @CacheEvict(value = {"category"}, allEntries = true)
    public boolean updateById(Category category) {
        // 如果修改了父分类，需要重新计算层级
        if (category.getParentId() != null) {
            // 检查不能将分类设置为其子分类的子分类（避免循环引用）
            List<Category> subCategories = getSubCategoriesRecursive(category.getId());
            for (Category subCategory : subCategories) {
                if (subCategory.getId().equals(category.getParentId())) {
                    throw new RuntimeException("不能将分类设置为其子分类的子分类");
                }
            }
            
            // 检查分类层级
            if (!checkCategoryLevel(category.getParentId())) {
                throw new RuntimeException("分类层级超过最大限制（" + MAX_CATEGORY_LEVEL + "级）");
            }
            
            // 计算层级
            category.setLevel(calculateCategoryLevel(category.getParentId()));
        }
        
        return super.updateById(category);
    }
    
    @Override
    @Transactional
    @CacheEvict(value = {"category"}, allEntries = true)
    public boolean removeById(Serializable id) {
        // 检查是否有子分类
        List<Category> subCategories = getSubCategories((Long) id);
        if (!CollectionUtils.isEmpty(subCategories)) {
            throw new RuntimeException("该分类下存在子分类，无法删除");
        }
        
        // 可以添加检查是否有商品使用该分类
        
        return super.removeById(id);
    }
    
    @Override
    @Transactional
    @CacheEvict(value = {"category"}, allEntries = true)
    public boolean removeByIds(Collection<?> idList) {
        for (Object id : idList) {
            if (!removeById((Long) id)) {
                return false;
            }
        }
        return true;
    }
}