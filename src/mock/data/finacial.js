import Mock from 'mockjs';
const FinacialData = [];
const AdName = '广告主';
const CuName = '客户';
const OrName = '订单';
const PlName = '计划';
for (let i = 0; i < 1000; i++) {
  FinacialData.push(Mock.mock({
    AdvName: AdName + Mock.Random.natural(1,10),
    CusName: CuName + Mock.Random.natural(1,100),
    OrdName: OrName + Mock.Random.natural(1,50),
    PlaName: PlName + Mock.Random.natural(1,10),
    'OldMoney|1-100.2': 20,
    'NewMoney|1-100.2': 30,
    'state|1' : true,
  }));
}

export { FinacialData };
