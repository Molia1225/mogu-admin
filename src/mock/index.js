import Mock from 'mockjs'
const server = {
    point: '/point-server/intf/web/',
    mobile: '/game-mobile/intf/web/admin/',
    ttkx: '/game-ttkx-server/intf/web/admin/',
    mini: '/power-mnjy-mobile/intf/web/admin/',
    guessing: '/game-guessing-server/intf/web/admin/',
}
// 查询活动列表
Mock.mock( RegExp(`${server.point}task/admin/listUpGradeTasks` + ".*"),  function(options){
    console.log(options)
	return {
		"ret": 0,
		"msg": null,
		"result":  [
			{
                "id": "xxx",
                "name": "xxxx",
                "taskFatherType": 1, 
                "taskSonType": 1,
                "difficulty": 2,
                "frequency": 1,
                "typeCode": "nurturancPoint",
                "weight": 1,
                "gameType": 1,
                "completeType":2,
                "condition": "2.4",
                "status": 1,
                "isDelete": 0
			}
		]
	}
})
Mock.mock( RegExp(`${server.point}levelConf/admin/list` + ".*"),  function(options){
    console.log(options)
	return {
        "ret": 0,
        "msg": null,
        "result":{
            "pageNo": 1,
            "pageSize": 1,
            "totalCount": 1,
            "totalPage": 1,
            "list": [
                {
                    "id": "xxx",
                    "levelId": "xxxx",
                    "levelName": 1, 
                    "levelLogoId": 'https://r.moguyun.com/shop2.3/wlzq/img_medal1.png',
                    "taskId": 'xxx',
                    "coin": 1,
                    "typeCode": "nurturancPoint",
                    "status": 1,
                    "isDelete": 0
                }
            ]
        }
      }
})
export default Mock;