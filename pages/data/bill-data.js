var monthly={
  monthlyexpend:100,
  monthlyincome : 1000,
 monthlybalance : 900,
}
var local_database=[
{
  billId:0,
  smallData:'04月04号',
  bigType:'支出',//去掉
  totalSum:100,//去掉
  bill:[{
    detailId:0,
    smallType:'餐饮',
    typeImg:'../../images/icon_1/canyin.png',
    remark:'早餐',
    smallSum:4
  },
  {
    detailId: 1,
    smallType: '娱乐',
    typeImg: '../../images/icon_1/yule.png',
    remark: '',
    smallSum: 50,
  },
  {
    detailId: 2,
    smallType: '服饰',
    typeImg: '../../images/icon_1/fushi.png',
    remark: '上衣',
    smallSum: 46,
  }
  ]
},
 {
  billId: 1,
  smallData: '04月08号',
  bigType: '支出',//去掉
  totalSum: 14,//去掉
  bill: [{
    detailId:3,
    smallType: '餐饮',
    typeImg: '../../images/icon_1/canyin.png',
    remark: '午餐',
    smallSum: 7.25
  },
  {
    detailId: 5,
    smallType: '餐饮',
    typeImg: '../../images/icon_1/canyin.png',
    remark: '',
    smallSum: 6.75,
  }
  ]
}
]
module.exports = {
  billList: local_database,
  monthly: monthly
}