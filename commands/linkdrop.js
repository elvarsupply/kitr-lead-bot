const axios = require('axios');

module.exports = function (bot) {
  const state = {};

  bot.command('linkdrop', (ctx) => {
    const id = ctx.from.id;
    state[id] = { step: 'awaiting_link' };
    ctx.reply('Drop the Apollo URL to scrape below👇');
  });

  bot.on('text', async (ctx) => {
    const id = ctx.from.id;
    const msg = ctx.message.text;

    // ⛔️ Ignore commands in text handler
    if (msg.startsWith('/')) return;

    if (!state[id]) return;

    if (state[id].step === 'awaiting_link') {
      state[id].link = msg;
      state[id].step = 'awaiting_leads';
      ctx.reply('👥 Estimated leads?');
    } else if (state[id].step === 'awaiting_leads') {
      try {
        await axios.post(process.env.WEBHOOK_URL, {
          type: 'linkdrop',
          from: ctx.from.username || ctx.from.first_name || '',
          link: state[id].link,
          estimated_leads: msg,
        });
        // Optionally confirm:
        // ctx.reply('✅ Submitted!');
      } catch (err) {
        console.error(err);
        ctx.reply('❌ Webhook failed.');
      }
      delete state[id];
    }
  });
};