// pages/user/address.js
Page({
  data: {
    // 地址列表数据
    addresses: []
  },

  onLoad: function(options) {
    // 初始化地址列表
    this.loadAddresses();
  },

  onShow: function() {
    // 每次显示页面时刷新地址数据
    this.loadAddresses();
  },

  /**
   * 加载地址列表
   */
  loadAddresses: function() {
    wx.showLoading({
      title: '加载中...'
    });

    // 模拟地址数据，实际项目中应该调用API获取
    const mockAddresses = this.getMockAddresses();
    
    this.setData({
      addresses: mockAddresses
    });

    wx.hideLoading();
  },

  /**
   * 新增地址
   */
  onAddAddress: function() {
    wx.navigateTo({
      url: '/pages/user/address-edit?mode=add'
    });
  },

  /**
   * 编辑地址
   */
  onEditAddress: function(e) {
    const addressId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/user/address-edit?mode=edit&id=${addressId}`
    });
  },

  /**
   * 设置默认地址
   */
  onSetDefault: function(e) {
    const addressId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '设置默认地址',
      content: '确定要设为默认地址吗？',
      success: (res) => {
        if (res.confirm) {
          // 更新地址列表，设置默认地址
          const updatedAddresses = this.data.addresses.map(address => ({
            ...address,
            isDefault: address.addressId === addressId
          }));
          
          this.setData({
            addresses: updatedAddresses
          });
          
          // 保存到本地缓存，实际项目中应该调用API
          wx.setStorageSync('addresses', updatedAddresses);
          
          wx.showToast({
            title: '设置成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 删除地址
   */
  onDeleteAddress: function(e) {
    const addressId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '删除地址',
      content: '确定要删除该地址吗？',
      success: (res) => {
        if (res.confirm) {
          // 从地址列表中删除
          const updatedAddresses = this.data.addresses.filter(address => address.addressId !== addressId);
          
          this.setData({
            addresses: updatedAddresses
          });
          
          // 保存到本地缓存，实际项目中应该调用API
          wx.setStorageSync('addresses', updatedAddresses);
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 获取模拟地址数据
   */
  getMockAddresses: function() {
    return [
      {
        addressId: '1',
        name: '张三',
        phone: '13800138000',
        province: '黑龙江省',
        city: '哈尔滨市',
        district: '松北区',
        address: '黑龙江科技大学主校区宿舍A栋101室',
        isDefault: true
      },
      {
        addressId: '2',
        name: '张三',
        phone: '13800138000',
        province: '黑龙江省',
        city: '哈尔滨市',
        district: '松北区',
        address: '黑龙江科技大学科技大厦B座205室',
        isDefault: false
      }
    ];
  }
});