import {Client} from 'discord.js';
import PhilipsHueClient from './PhilipsHueClient';
import SpeechToTextDaemon from './SpeechToTextDaemon';

const client = new Client();

const colors = {
	'rouge': {
		on: true,
		sat: 254,
		bri: 254,
		hue: 10000
	}
};

const actions = ['on', 'off'];

const philipsHueClient = new PhilipsHueClient();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
	if (message.content.startsWith('!lumiere')) {
		const args = message.content.split(' ');
		if (Object.keys(colors).includes(args[1])) {
			const color = args[1];
			await philipsHueClient.turnRoomOff(1);
			await message.channel.send('ok.');
		} else if (actions.includes(args[1])) {
			switch (args[1]) {
				case 'on':
					await philipsHueClient.turnRoomOn(1);
					break;
				case 'off':
					await philipsHueClient.turnRoomOff(1);
					break;
			}
		} else {
			const [command, sat, bri, hue] = args;
			const result = await philipsHueClient.turnRoomOn(1);
			await message.channel.send('Lumiere changée !');
		}
	}
});

client.login(process.env.TOKEN);

const speechToTextDaemon = new SpeechToTextDaemon(philipsHueClient);
speechToTextDaemon.start();
