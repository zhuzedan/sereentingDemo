var commonData = require('data.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    maskFlag: false, // 蒙层
    // tab （0-4）分别为：位置，价格，户型，筛选，排序
    tabid: -1,
    // 位置
    // 位置的一级菜单
    location: {
      locationOneArr: [{
        id: 0,
        tag_name: '不限'
      }, {
        id: 1,
        tag_name: '区域'
      }, {
        id: 2,
        tag_name: '板块'
      }, {
        id: 3,
        tag_name: '地铁'
      }],
      // 位置的名字（并记录位置，再次展开时使用）
      locationName: {
        name: '',
        oneIndex: 0, // 记录第一级菜单当前为第几个
        twoIndex: -1, // 二级菜单当前为第几个
        threeIndex: -1 // 三级菜单当前为第几个
      },
      locationOneIndex: 0, // 以及菜单为第几个（渲染使用）
 
      // 位置的二级菜单（渲染使用）
      locationTwoIndex1: -1, // 区域
      locationTwoIndex2: -1, // 板块
      locationTwoIndex3: -1, // 地铁
 
      // 三级菜单
      locationThreeIndex: -1, // 地铁
    },
    // 配置接口（数据）
    pageConfig: {
      district: [], // 区域
      block: [], // 板块
      metro: [], // 地铁
      price: [], // 价格
      recommendTag: [], // 特色
      channel: [], // 类型
      mjtag: [], // 面积
      kptag: [], // 开盘时间
      decoratetag: [], // 装修
      paixu: [] // 排序
    },
    priceIndex: -1, // 价格
    roomtagIndex: -1, // 户型
    // 筛选
    shaixuan: {
      tese: [], // 特色：选中的id
      leixing: -1, // 类型：选中的index（因为需要判断是否选中，所以用的index而不是id，下同理）
      mianji: [], // 面积：选中的id
      kaipan: -1, // 开盘时间：选中的index
      zhuangxiu: -1, // 装修：选中的index
    },
 
    paixuIndex: -1, // 排序：选中的index
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
 
    // 获取数据
    this.getConfig();
  },
 
  // tab切换（列表顶部的tab切换） 
  tab(e) {
    var that = this;
    var tabid = e.currentTarget.dataset.id;
    that.setData({
      maskFlag: true,
      tabid: tabid
    });
 
    // 位置（需要判断，之前是否有选过的，如果有则切到当前选中的状态的界面）
    var locationName_name = that.data.location.locationName.name;
    var locationName_oneIndex = that.data.location.locationName.oneIndex;
    var locationName_twoIndex = that.data.location.locationName.twoIndex;
    var locationName_threeIndex = that.data.location.locationName.threeIndex;
 
    if (locationName_name) {
 
      // 把区域和板块相同的部分提取一下
      if ((locationName_oneIndex == 1 && locationName_twoIndex > -1) || (locationName_oneIndex == 2 && locationName_twoIndex > -1)) {
        that.setData({
          'location.locationTwoIndex3': -1,
          'location.locationThreeIndex': -1,
        })
      }
 
      // 区域
      if (locationName_oneIndex == 1 && locationName_twoIndex > -1) {
        that.setData({
          'location.locationOneIndex': locationName_oneIndex,
          'location.locationTwoIndex1': locationName_twoIndex,
          'location.locationTwoIndex2': -1,
        })
      }
 
      // 板块
      if (locationName_oneIndex == 2 && locationName_twoIndex > -1) {
        that.setData({
          'location.locationOneIndex': locationName_oneIndex,
          'location.locationTwoIndex1': -1,
          'location.locationTwoIndex2': locationName_twoIndex,
        })
      }
 
      // 地铁
      if (locationName_oneIndex == 3 && locationName_twoIndex > -1 && locationName_threeIndex > -1) {
        that.setData({
          'location.locationOneIndex': locationName_oneIndex,
          'location.locationTwoIndex1': -1,
          'location.locationTwoIndex2': -1,
          'location.locationTwoIndex3': locationName_twoIndex,
          'location.locationThreeIndex': locationName_threeIndex,
        })
      }
    }
  },
 
  // mask隐藏
  maskClick() {
    var that = this;
    that.setData({
      maskFlag: false
    });
  },
 
  // 阻止事件冒泡
  prevent() { },
 
  // 位置：点击一级菜单
  clickLocationOne(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      'location.locationOneIndex': index,
    });
    // 如果点击不限（清空locationName，初始化二级三级状态）
    if (index == 0) {
      that.setData({
        'maskFlag': false,
        'location.locationTwoIndex1': -1,
        'location.locationTwoIndex2': -1,
        'location.locationTwoIndex3': -1,
        'location.locationThreeIndex': -1,
        'location.locationName.name': '',
        'location.locationName.oneIndex': 0,
        'location.locationName.twoIndex': -1,
        'location.locationName.threeIndex': -1,
      });
      
      // 重新请求数据
    }
  },
 
  // 位置：点击二级菜单
  clickLocationTwo(e) {
    var that = this;
    // 积极菜单
    var type = e.currentTarget.dataset.type;
    // 当前第几个
    var index = e.currentTarget.dataset.index;
    // 名字
    var name = e.currentTarget.dataset.name;
 
    // 虽然同为2级，地铁的二级和其它的二级不同，需要区分
 
    // 把区域和板块相同部分合并一下
    if ((type == 1) || (type == 2)) {
      that.setData({
        'location.locationTwoIndex3': -1,
        'location.locationThreeIndex': -1,
        'location.locationName.name': name,
        'location.locationName.oneIndex': type,
        'location.locationName.twoIndex': index,
        'location.locationName.threeIndex': -1,
        'maskFlag': false,
      });
    }
 
    if (type == 1) {
      that.setData({
        'location.locationTwoIndex1': index,
        'location.locationTwoIndex2': -1,
      });
      
      // 重新请求数据
    }
 
    if (type == 2) {
      that.setData({
        'location.locationTwoIndex1': -1,
        'location.locationTwoIndex2': index,
      });
      
      // 重新请求数据
    }
 
    if (type == 3) {
      that.setData({
        'location.locationTwoIndex3': index
      });
 
      if (that.data.location.locationName.twoIndex == that.data.location.locationTwoIndex3) {
        that.setData({
          'location.locationThreeIndex': that.data.location.locationName.threeIndex
        });
      } else {
        that.setData({
          'location.locationThreeIndex': -1
        });
      }
 
    }
 
  },
 
  // 三级菜单点击(当前只按照地铁有三级菜单来写的)
  clickLocationThree(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var name = e.currentTarget.dataset.name;
    var type = e.currentTarget.dataset.type;
    var locationTwoIndex3 = that.data.location.locationTwoIndex3;
 
    that.setData({
      'location.locationThreeIndex': index,
      'location.locationName.oneIndex': type,
      'location.locationName.twoIndex': locationTwoIndex3,
      'location.locationName.threeIndex': index,
      'location.locationTwoIndex1': -1,
      'location.locationTwoIndex2': -1,
      'maskFlag': false
    });
 
    if (index) {
      that.setData({
        'location.locationName.name': name,
      });
    } else {
      that.setData({
        'location.locationName.name': that.data.pageConfig.metro[that.data.location.locationTwoIndex3].name,
      });
    }
 
    // 重新请求数据
  },
 
  // 价格，户型，排序
  clickSelectOne(e) {
    var that = this;
    // 1:价格；2：户型；4：排序
    var tabid = that.data.tabid;
    var index = e.currentTarget.dataset.index;
 
    if (tabid == 1) {
      that.setData({
        'priceIndex': index,
      });
    }
 
    if (tabid == 2) {
      that.setData({
        'roomtagIndex': index,
      });
    }
 
    if (tabid == 4) {
      that.setData({
        'paixuIndex': index,
      });
    }
 
    // 重新请求数据
 
    that.setData({
      'maskFlag': false
    });
  },
 
  // 筛选
  shaixuanOne(e) {
    // 1:类型；3：开盘时间；4：装修
    var that = this;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
 
    if (type == 1) {
      that.setData({
        'shaixuan.leixing': index
      });
    }
 
    if (type == 3) {
      that.setData({
        'shaixuan.kaipan': index
      });
    }
 
    if (type == 4) {
      that.setData({
        'shaixuan.zhuangxiu': index
      });
    }
 
  },
 
  shaixuanTwo(e) {
    // 0:特色；2：面积；
    var that = this;
    var type = e.currentTarget.dataset.type;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
 
    if (type == 0) {
      var key = 'pageConfig.recommendTag[' + index + '].flag';
      var flag = !that.data.pageConfig.recommendTag[index].flag;
      var tese = that.data.shaixuan.tese;
 
      if (flag) {
        if (tese.indexOf(id) < 0) {
          tese.push(id)
        }
      } else {
        if (tese.indexOf(id) > -1) {
          tese.splice(tese.indexOf(id), 1)
        }
      }
 
      that.setData({
        'shaixuan.tese': tese,
        [key]: flag
      });
    }
 
    if (type == 2) {
      var key = 'pageConfig.mjtag[' + index + '].flag';
      var flag = !that.data.pageConfig.mjtag[index].flag;
      var mianji = that.data.shaixuan.mianji;
 
      if (flag) {
        if (mianji.indexOf(id) < 0) {
          mianji.push(id)
        }
      } else {
        if (mianji.indexOf(id) > -1) {
          mianji.splice(mianji.indexOf(id), 1)
        }
      }
 
      that.setData({
        'mianji.tese': mianji,
        [key]: flag
      });
    }
  },
 
  // 取消和确认按钮
  cancle(e) {
    var that = this;
    var recommendTag = that.data.pageConfig.recommendTag.length ? that.data.pageConfig.recommendTag : [];
    var mjtag = that.data.pageConfig.mjtag.length ? that.data.pageConfig.mjtag : [];
 
    for (var i = 0; i < recommendTag.length; i++) {
      recommendTag[i]['flag'] = 0
    }
 
    for (var j = 0; j < mjtag.length; j++) {
      mjtag[j]['flag'] = 0
    }
 
    that.setData({
      shaixuan: {
        tese: [],
        leixing: -1,
        mianji: [],
        kaipan: -1,
        zhuangxiu: -1,
      },
      "pageConfig.recommendTag": recommendTag,
      "pageConfig.mjtag": mjtag,
      'maskFlag': false
    });
 
    // 冲洗请求数据
  },
 
  // 确认
  confirm(e) {
    // 搜索并关闭蒙层
    var that = this;
    // 重新请求数据
    that.setData({
      'maskFlag': false
    });
  },
 
 
  //请求配置
  getConfig: function() {
    var that = this;
    // 获取数据
    var res = commonData.get_data();
 
    // 对数据的处理
    var district = res.district.length ? res.district : [];
    var block = res.block.length ? res.block : [];
    var metro = res.metro.length ? res.metro : [];
    for (var i = 0; i < metro.length; i++) {
      if (metro[i].station.length) {
        metro[i].station.unshift({
          id: 0,
          name: '不限'
        });
      }
    }
 
    var price = res.price.length ? res.price : [];
    price.unshift({
      id: 0,
      tag_name: '不限'
    });
 
    var roomtag = res.roomtag.length ? res.roomtag : [];
    roomtag.unshift({
      tag_id: 0,
      tag_name: '不限'
    });
 
    // 筛选
    var recommendTag = res.recommendTag.length ? res.recommendTag : [];
    var channel = res.channel.length ? res.channel : [];
    var mjtag = res.mjtag.length ? res.mjtag : [];
    var kptag = res.kptag.length ? res.kptag : [];
    var decoratetag = res.decoratetag.length ? res.decoratetag : [];
 
    for (var i = 0; i < recommendTag.length; i++) {
      recommendTag[i]['flag'] = 0
    }
 
    for (var j = 0; j < mjtag.length; j++) {
      mjtag[j]['flag'] = 0
    }
 
    // 默认排序，价格由高到低，价格由低到高，关注度由高到低，开盘时间由近到远
    var paixu = [{
      tag_id: 0,
      tag_name: '默认排序',
    }, {
      tag_id: 2,
      tag_name: '价格由高到低',
    }, {
      tag_id: 3,
      tag_name: '价格由低到高',
    }, {
      tag_id: 6,
      tag_name: '关注度由高到低',
    }, {
      tag_id: 4,
      tag_name: '开盘时间由近到远',
    }];
 
    that.setData({
      'pageConfig.district': district,
      'pageConfig.block': block,
      'pageConfig.metro': metro,
      'pageConfig.price': price,
      'pageConfig.roomtag': roomtag,
      'pageConfig.recommendTag': recommendTag,
      'pageConfig.channel': channel,
      'pageConfig.mjtag': mjtag,
      'pageConfig.kptag': kptag,
      'pageConfig.decoratetag': decoratetag,
      'pageConfig.paixu': paixu,
    });
  },
  // 参数
  getparam() {
    var that = this;
    var param = {};
 
    if (that.data.location.locationName.name) {
      // 区域
      if (that.data.location.locationName.oneIndex == 1) {
        if (that.data.location.locationName.twoIndex > -1) {
          param.dist = that.data.pageConfig.district[that.data.location.locationName.twoIndex].id;
        }
      }
      // 板块
      if (that.data.location.locationName.oneIndex == 2) {
        if (that.data.location.locationName.twoIndex > -1) {
          param.block = that.data.pageConfig.block[that.data.location.locationName.twoIndex].id;
        }
      }
      // 地铁
      if (that.data.location.locationName.oneIndex == 3) {
        if (that.data.location.locationName.twoIndex > -1) {
          if (that.data.location.locationName.threeIndex > -1) {
            param.dttype_id = that.data.pageConfig.metro[that.data.location.locationName.twoIndex].id;
            param.dttag_id = that.data.pageConfig.metro[that.data.location.locationName.twoIndex].station[that.data.location.locationName.threeIndex].id;
          }
        }
      }
    }
 
    // 价格
    if (that.data.priceIndex > -1) {
      param.price = that.data.pageConfig.price[that.data.priceIndex].id;
    }
 
    // 户型
    if (that.data.roomtagIndex > -1) {
      param.roomtag_id = that.data.pageConfig.roomtag[that.data.roomtagIndex].tag_id;
    }
 
    // 特色
    if (that.data.shaixuan.tese.length) {
      param.tag_id = that.data.shaixuan.tese.join(',')
    }
 
    // 类型
    if (that.data.shaixuan.leixing > -1) {
      param.p = that.data.pageConfig.channel[that.data.shaixuan.leixing].id;
    }
 
    // 面积
    if (that.data.shaixuan.mianji.length) {
      param.mjtagid = that.data.shaixuan.mianji.join(',');
    }
 
    // 开盘时间
    if (that.data.shaixuan.kaipan > -1) {
      param.kptagid = that.data.pageConfig.kptag[that.data.shaixuan.kaipan].tag_id;
    }
 
    // 装修
    if (that.data.shaixuan.zhuangxiu > -1) {
      param.decoratetagid = that.data.pageConfig.decoratetag[that.data.shaixuan.zhuangxiu].tag_id;
    }
 
    // 排序
    if (that.data.paixuIndex > -1) {
      param.ordered = that.data.pageConfig.paixu[that.data.paixuIndex].tag_id;
    }
 
    return param;
  },
})