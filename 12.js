// 引入 oicq 模块
import { segment } from "oicq";
import plugin from '../../lib/plugins/plugin.js'
import common from'../../lib/common/common.js'
import schedule from 'node-schedule'

//let rule =`秒 分 时 * * ?` 改完记得重启一下
//默认早上八点整
let rule =`0 0 8 * * ?`
const sleepTime = '1:16'

// 设置一个标志位，表示是否已经提醒过睡觉
let reminded = false;

// 设置需要提醒的 QQ 号（默认值）
let target = 2326980754;

// 设置需要提醒的群号或群名（默认值），可以是一个数组或一个字符串
let groups = ["703205802", ""];

// 设置一个标志位，表示是否开启提醒功能（默认值）
let on = true;

export class Example extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '提醒助手',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message.group',
      /** 优先级，数字越小等级越高 */
      priority: 1,
      rule: [
        {
          // 设置提醒规则，匹配 #设置提醒 命令，并执行 set 方法
          reg: '^#设置提醒$',
          fnc: "t_set"
        },
        {
          // 显示设置规则，匹配 #显示设置 命令，并执行 show 方法
          reg: '^#显示设置$',
          fnc: "t_show",
        },
        {
          // 关闭提醒规则，匹配 #关闭提醒 命令，并执行 off 方法
          reg: '^#关闭提醒$',
          fnc: "t_off",
        },
        {
          reg: '(.*)',
          fnc:"onMessage",
        }
      ]
    });
  }

  // 定义设置提醒的方法，接收一个事件对象作为参数
  async t_set(e) {
    // 判断消息发送者是否是管理员或群主
    if (e.sender.role === "admin" || e.sender.role === "owner") {
      // 如果是，就发送一条消息，提示用户输入需要提醒的 QQ 号、时间和群号或群名，并监听用户的回复
      e.reply("请输入需要提醒的 QQ 号、时间和群号或群名，格式为：\nQQ号 时间 群号或群名"); // 使用await等待回复完成
      client.on("message.group", async (e) => {
        // 获取用户回复的内容，并解析出参数
        const reply = e.raw_message;
        const params = reply.split(" ");
        // 判断参数是否合法，并修改设置
        if (params.length === 3) {
          target = Number(params[0]);
          sleepTime = params[1];
          groups = params[2].split(",");
          let msg_1 = [
            `已设置提醒如下：
             提醒对象：${target}
             提醒时间：${sleepTime}
             提醒群：${groups.join(", ")}`
          ];
          e.reply(msg_1);
        } else {
          // 参数不合法，提示用法，并结束函数执行
          e.reply(
            "用法：QQ号 时间 群号或群名\n例如：123456789 21:00 测试群"
          );
        }
      });
    } else {
      // 如果不是管理员或群主，就忽略指令，并结束函数执行
      return;
    }
  }

  // 定义显示设置的方法，接收一个事件对象作为参数
  async t_show(e) {
    // 发送一条消息，显示当前的设置
    let msg_2 = [
      `当前设置如下：
      提醒对象：${target}
      提醒时间：${sleepTime}
      提醒群：${groups.join(", ")}
      提醒开关：${on ? "开" : "关"}`
    ];
    e.reply(msg_2);
  }

  // 定义关闭提醒的方法，接收一个事件对象作为参数
  async t_off(e) {
    // 关闭提醒功能，并重置标志位为 false，并发送一条消息提示用户
    on = false;
    reminded = false;
    e.reply("已关闭提醒功能。");
  }

  // 处理消息的方法
  async onMessage(e) {
    // 获取当前本地时间的字符串表示形式，格式为 "HH:MM"
    const currentTime = new Date()//.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }).slice(0, -3);

    // 判断是否开启了提醒功能，并且当前时间是否超过睡觉时间，并且消息发送者是目标 QQ 号，并且当前群号或群名在提醒列表中
    if (
      on &&
      currentTime/* >= sleepTime*/ &&
      e.user_id === target &&
      (groups.includes(e.group_id) || groups.includes(e.group_name))
    ) {
      // 如果超过，并且是第一次提醒，就提醒用户睡觉，并设置标志位为 true
      if (!reminded) {
        e.reply(segment.at(target) + "该睡觉了！"); // 发送群消息并 @ 目标 QQ 号
        reminded = true;
      } else {
        // 如果超过，并且已经提醒过，就 @ 目标 QQ 号继续提醒
        e.reply(segment.at(target) + "还不睡觉？"); // 发送群消息并 @ 目标 QQ 号
      }
    } else {
      // 如果没有超过，或者消息发送者不是目标 QQ 号，或者当前群号或群名不在提醒列表中，就重置标志位为 false
      reminded = false;
    }
  }
}
