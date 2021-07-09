import speech from '@google-cloud/speech';
import * as protos from '@google-cloud/speech/build/protos/protos';
import recorder from 'node-record-lpcm16';
import PhilipsHueClient from './PhilipsHueClient';

export default class SpeechToTextDaemon {
	philipsHueClient: PhilipsHueClient;

	constructor(philipsHueClient: PhilipsHueClient) {
		this.philipsHueClient = philipsHueClient;
	}

	start() {
		try {
			let sampleRateHertz = 16000;
			const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
				sampleRateHertz,
				encoding: 'LINEAR16',
				languageCode: 'en-US'
			};

			const request: protos.google.cloud.speech.v1.IStreamingRecognitionConfig = {
				config,
				interimResults: false //Get interim results from stream
			};

			const client = new speech.SpeechClient();

			const recognizeStream = client
			.streamingRecognize(request)
			.on('error', console.error)
			.on('data', data =>
				data.results[0] && data.results[0].alternatives[0]
					? this.turnLight(data.results[0].alternatives[0].transcript)
					: process.stdout.write('\n\nReached transcription time limit, press Ctrl+C\n')
			);

			recorder
			.record({
				sampleRateHertz,
				threshold: 0, //silence threshold
				recordProgram: 'rec', // Try also "arecord" or "sox"
				silence: '5.0' //seconds of silence before ending
			})
			.stream()
			.on('error', console.error)
			.pipe(recognizeStream);
		}
		catch (e) {
			console.error('ERROR');
			console.error(e);
			return this.start();
		}
	}

	turnLight(transcription: string) {
		transcription = transcription.trim();
		switch (transcription.toLocaleLowerCase()) {
			case 'lights on':
				return this.philipsHueClient.turnRoomOn(0);
			case 'lights off':
				return this.philipsHueClient.turnRoomOff(0);
		}
		if (transcription.startsWith('lights')) {
			return this.philipsHueClient.setLightColor(0, transcription.split(' ')[1]);
		}
	}
}
