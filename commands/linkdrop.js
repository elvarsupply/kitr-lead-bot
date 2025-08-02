const axios = require('axios');

module.exports = function (bot) {
  const state = {};

  bot.command('linkdrop', (ctx) => {
    const id = ctx.from.id;
    state[id] = { step: 'awaiting_link' };
    ctx.reply('🔗 Drop the Apollo URL to scrape:');
  });

  bot.on('text', async (ctx) => {
    const id = ctx.from.id;
    const msg = ctx.message.text;

    if (!state[id]) return;

    if (state[id].step === 'awaiting_link') {
      state[id].link = msg;
      state[id].step = 'awaiting_employees';
      ctx.reply('👥 Estimated leads?');
    } else if (state[id].step === 'awaiting_employees') {
      try {
        await axios.post(process.env.WEBHOOK_URL, {
          type: 'linkdrop',
          from: ctx.from.username || ctx.from.first_name || '',
          link: state[id].link,
          employeeCap: msg,
        });
        // No success reply
      } catch (err) {
        ctx.reply('❌ Webhook failed.');
      }
      delete state[id];
    }
  });
};