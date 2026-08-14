export class BroadcastChannelAdapter {
    constructor(channelName = 'mfq_events') {
        this.channel = new BroadcastChannel(channelName);
        this.receiveCallback = null;

        this.channel.onmessage = (event) => {
            if (this.receiveCallback && event.data) {
                this.receiveCallback(event.data);
            }
        };
    }

    onReceive(callback) {
        this.receiveCallback = callback;
    }

    broadcast(event) {
        this.channel.postMessage(event);
    }
}
