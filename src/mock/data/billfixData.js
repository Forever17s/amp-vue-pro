import Mock from 'mockjs';

const billfixData = [];

for (let i = 0; i <100; i++) {
  billfixData.push(Mock.mock({
    'partnerId|1-100': 1 ,
    'advertiserId|1-1000': 1,
    advertiserName: Mock.Random.cname(),
  }));
}

export { billfixData };