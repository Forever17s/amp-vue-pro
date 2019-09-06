import Mock from 'mockjs';

const alarmsData = [];

for (let i = 0; i <100; i++) {
  alarmsData.push(Mock.mock({
    'id|1-100': 1 ,
    'monitorId|1-1000': 1,
    beginTime: Mock.Random.date(),
    endTime: Mock.Random.date(),
    'count|1-1000': 1,
    'status|1':['notice','confirm','resolved'],
    creation: Mock.Random.date(),
    solver: Mock.Random.cname(),
    'solution|1':['manual','auto'],
    lastModified: Mock.Random.date(),
    'removed':Mock.Random.integer(0, 1),
  }));
}

export { alarmsData };