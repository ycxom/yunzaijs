import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq";
import common from '../../lib/common/common.js'
import fs from "fs";
const path = process.cwd()

//回复模式，[1]图片 ,[2]图文，[3]文字,[0]无回复
const hfms = '2'

//添加屏蔽词，用`|`分开继续添加
const pbc = '^(替死鬼|#添加(.*)|添加(.*)|1)$'

//定义图片路径 默认是Yunzai-Bot/resources/yuhuo/picCollect/
const tp_a = '/resources/yuhuo/picCollect/'

//拦截强度，越小越大
const priority_sz = 20




export class example extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '拦截',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: priority_sz,
            rule: [
                {
                    reg: pbc,
                    fnc: hfms
                },
            ]
        })
    }
    //图片回复模式
    async 1(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_a)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_a + photo_list[photo_number]))
        }
    }
    //图片与文字回复模式
    async 2(e) {
        logger.info('[用户命令]', e.msg);
        let photo_list = fs.readdirSync(path + tp_a)
        let photo_number = Math.floor(Math.random() * photo_list.length)
        let msg = e.msg.replace(" ").trim();
        msg = msg.split(" ");
        /*e.reply(msg + `你m呢` + msg)
        await common.sleep(500);
        e.reply(`沙皮东西`)
        await common.sleep(500);*/
        e.reply('你在发什么啊')
        await common.sleep(1000);
        e.reply(segment.image('file:///' + path + tp_a + photo_list[photo_number]))
    }
    //文字回复模式
    async 3(e) {
        let msg = e.msg.replace(" ").trim();
        msg = msg.split(" ");
        e.reply(msg + `？呢` + msg)
        await common.sleep(500);
        e.reply(`沙皮东西`)
        await common.sleep(500);
        e.reply(`一定是群里某个人教的`)
    }

}
