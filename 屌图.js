import plugin from '../../lib/plugins/plugin.js'
import { segment } from "oicq";
import fs from "fs";
const path = process.cwd()

//定义图片路径 默认是Yunzai-Bot/resources/yuhuo/picCollect/pictures/
const tp_bq = '/resources/yuhuo/picCollect/pictures/'           //叼图的放置目录
const tp_qldt = '/resources/yuhuo/picCollect/qldt/'             //群叼图的放置目录
const tp_dt = '/resources/yuhuo/picCollect/dt/'

export class example extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '叼图',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 50,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: '^#来张(表情图|表情)$',
                    /** 执行方法 */
                    fnc: 'bq'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^#(叼|吊|屌|沙雕)发言$',
                    /** 执行方法 */
                    fnc: 'qydiaotu'
                },
                {
                    /** 命令正则匹配 */
                    reg: '^#来张(叼|雕|吊)图$',
                    /** 执行方法 */
                    fnc: 'diaotu'
                },
            ]
        })
    }

    async qydiaotu(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_qldt)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_qldt + photo_list[photo_number]))
        }
    }
    async bq(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_bq)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_bq + photo_list[photo_number]))

        }
    }
    async diaotu(e) {
        logger.info('[用户命令]'); {
            //读取文件夹里面的所有图片文件名
            let photo_list = fs.readdirSync(path + tp_dt)
            //随机选择一个文件名
            let photo_number = Math.floor(Math.random() * photo_list.length)
            //发送图片
            e.reply(segment.image('file:///' + path + tp_dt + photo_list[photo_number]))

        }
    }

}