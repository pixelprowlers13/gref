class ArduinoExtension {
    getInfo() {
        return {
            id: 'arduinoExtension',
            name: 'Arduino',
            blocks: [
                {
                    opcode: 'digitalWrite',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set pin [PIN] to [VALUE]',
                    arguments: {
                        PIN: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 13
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.NUMBER,
                            menu: 'pinState',
                            defaultValue: 1
                        }
                    }
                },
                {
                    opcode: 'analogRead',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'read analog pin [PIN]',
                    arguments: {
                        PIN: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0
                        }
                    }
                }
            ],
            menus: {
                pinState: {
                    acceptReporters: true,
                    items: [
                        { text: 'HIGH', value: 1 },
                        { text: 'LOW', value: 0 }
                    ]
                }
            }
        };
    }

    digitalWrite(args) {
        const { PIN, VALUE } = args;
        // Emit socket event to set pin state
        socket.emit('digitalWrite', { pin: PIN, value: VALUE });
    }

    analogRead(args) {
        const { PIN } = args;
        // Emit socket event to read analog pin
        return new Promise((resolve) => {
            socket.emit('analogRead', PIN);
            socket.on('analogReadResponse', (data) => {
                if (data.pin === PIN) {
                    resolve(data.value);
                }
            });
        });
    }
}

const socket = io('http://localhost:3000');
Scratch.extensions.register(new ArduinoExtension());
