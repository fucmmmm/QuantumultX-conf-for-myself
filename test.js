let url = $request.url;
let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);

        // 1. 彻底折叠主页、列表页等广告位占位符
        if (url.indexOf("/project/advSpace/app/v2/list") !== -1) {
            if (obj.data) {
                const adKeys = [
                    "openAdvId", "cutAdvId", "nativeAdvId", "feedAdvId", 
                    "feedGroupAdvId", "jutuiIconAdvId", "jutuiFloatAdvId", 
                    "jutuiTextLinkAdvId", "yifanTextLinkAdvId", "commandAdvStr"
                ];
                adKeys.forEach(key => {
                    if (obj.data[key] !== undefined) {
                        delete obj.data[key]; // 使用 delete 连根拔起，前端排版引擎会将其折叠
                    }
                });
            }
        } 
        // 2. 清空广告加载链条
        else if (url.indexOf("/project/adv/chain/get") !== -1) {
            if (obj.data) {
                obj.data = []; 
            }
        } 
        // 3. 彻底移除“我的”页面的附加推广渠道（如外卖券、霸王餐卡片）
        else if (url.indexOf("/user/coin/info/withAppAdvChannel") !== -1) {
            if (obj.data && obj.data.appAdvChannelList) {
                delete obj.data.appAdvChannelList; 
            }
        }

        body = JSON.stringify(obj);
    } catch (e) {
        console.log("趣智校园去广告解析异常: " + e);
    }
}

$done({ body });