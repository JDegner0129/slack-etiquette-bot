const { WebClient, RtmClient, MemoryDataStore, RTM_EVENTS, CLIENT_EVENTS } = require('@slack/client');

const token = process.env.SLACK_API_TOKEN || '';

const rtm = new RtmClient(token, { logLevel: 'error', dataStore: new MemoryDataStore() });
const web = new WebClient(token);

rtm.start();

const trySendMessageToChannel = ({ id, members }) => {
  const channelMemberThreshold = process.env.CHANNEL_MEMBER_THRESHOLD || 20;
  
  if (!members || members.length < channelMemberThreshold) {
    return;
  }

  rtm.sendMessage(
    `:wave: Hey there! You just used \`@here\` or \`@channel\` in a channel with ${members.length} members. Next time, consider giving your message a few minutes without the tag before tagging a large group (and maybe tag specific people!). :slightly_smiling_face:`,
    id
  );
};

rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
  console.log('RTM client authenticated!');
});

rtm.on(RTM_EVENTS.MESSAGE, ({ user, channel, text }) => {
  if (!(text.includes('<!here|@here>') || text.includes('<!channel>'))) {
    return;
  }

  let channelInfo = rtm.dataStore.getChannelById(channel);
  if (!channelInfo) {
    web.channels.info(channel).then(info => {
      channelInfo = info.channel;
      rtm.dataStore.setChannel(channelInfo);
      trySendMessageToChannel(channelInfo);
    });
  } else {
    trySendMessageToChannel(channelInfo);
  }
});
