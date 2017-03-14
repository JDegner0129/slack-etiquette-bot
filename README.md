# slack-etiquette-bot
A bot that politely instructs users on proper Slack etiquette when they've sent a certain message. For now, it just responds to usages of "@here" or "@channel" in channels with a large amount of members.

# Configuration
`process.env.SLACK_API_TOKEN` - The access token to be used for the bot
`process.env.CHANNEL_MEMBER_THRESHOLD` - The threshold at which the bot should post when a message is received
