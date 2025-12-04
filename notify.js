export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }

      const raw = Buffer.concat(chunks).toString('utf-8');
      const data = JSON.parse(raw || '{}');
      const { title, msg } = data;

      console.log('收到通知:', { title, msg });

      // 发送 Telegram 消息
      const botToken = '71907867373873527:Afdsfsfdafgdsdsadadad1bifYE'; // 替换为你的 Bot Token
      const chatId = '743564353300'; // 替换为你的 Telegram 用户 ID 或群组 ID
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const sendMessage = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔔 ${title}\n\n${msg}`,
          parse_mode: 'Markdown',
        }),
      });

      const responseData = await sendMessage.json();

      if (!responseData.ok) {
        throw new Error(`Telegram API 返回错误: ${JSON.stringify(responseData)}`);
      }

      return res.status(200).json({ message: '通知成功发送到 Telegram', title, msg });
    } catch (err) {
      console.error('处理错误:', err);
      return res.status(500).json({ error: '处理请求失败', detail: String(err) });
    }
  }

  res.status(200).send('Apprise 通知服务运行正常，请使用 POST 方法发送通知。');
}


























import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }

      const raw = Buffer.concat(chunks).toString('utf-8');
      const data = JSON.parse(raw || '{}');
      const { title, msg } = data;

      console.log('收到通知:', { title, msg });

      // --- 1. 发送 Telegram 消息 ---
      const botToken = '721521527:AAFUdysafdsdsadadfq5q0s1bifYE'; // 你的 Bot Token
      const chatId = '73424324200'; // 你的 Telegram 用户 ID 或群组 ID
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

      const sendTelegram = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `🔔 ${title}\n\n${msg}`,
          parse_mode: 'Markdown',
        }),
      });

      const telegramResult = await sendTelegram.json();

      if (!telegramResult.ok) {
        throw new Error(`Telegram API 返回错误: ${JSON.stringify(telegramResult)}`);
      }

      // --- 2. 发送邮件通知 ---
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465, // 587
        secure: true, // 使用 SSL修改为true，使用tls修改为false
        auth: {
          user: 'admin@xyz.com',        // 你的发信邮箱账号
          pass: 'u5161ax!',             // SMTP 授权码（不是邮箱密码）
        },
      });

      await transporter.sendMail({
        from: '"监控通知" <admin@xyz.com>',   // 发件人
        to: 'zai@outlook.com',                 // 收件人（你自己或者其他人）
        subject: title,
        text: msg,
      });

      return res.status(200).json({ message: '通知成功发送到 Telegram 和邮箱', title, msg });
    } catch (err) {
      console.error('处理错误:', err);
      return res.status(500).json({ error: '处理请求失败', detail: String(err) });
    }
  }

  res.status(200).send('Apprise 通知服务运行正常，请使用 POST 方法发送通知。');
}
