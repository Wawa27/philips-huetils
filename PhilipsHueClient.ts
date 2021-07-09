import axios from 'axios';

interface LightState {

}

export default class PhilipsHueClient {
	#axiosInstance;

	public constructor() {
		this.#axiosInstance = axios.create({
			baseURL: `${process.env.PHILIPS_HUE_ADDRESS}/api/${process.env.PHILIPS_HUE_USERNAME}`
		});
	}

	// LIGHTS

	public turnRoomOff(groupId: number) {
		this.#axiosInstance.put(`/groups/${groupId}/action`, {
			on: false
		});
	}

	public turnRoomOn(groupId: number) {
		this.#axiosInstance.put(`/groups/${groupId}/action`, {
			on: true
		});
	}

	public setLightState(lightId: number, lightState: LightState) {
		this.#axiosInstance.put(`/1/state`, {'on': true, 'sat': 254, 'bri': 254, 'hue': 10000});
	}

	public async setLightColor(lightId: number, color: string) {
		let xy = [0, 0];
		switch (color) {
			case 'red': {
				xy = [0.65, 0.3];
				break;
			}
			case 'green': {
				xy = [0.27355203404808925, 0.685437768711856];
				break;
			}
			case 'blue': {
				xy = [0, 0];
				break;
			}
			case 'random': {
				xy = [Math.random(), Math.random()];
				break;
			}
		}
		console.debug(xy);
		const result = await this.#axiosInstance.put(`/lights/3/state`, {xy});
		console.debug(result.data);
	}
}
