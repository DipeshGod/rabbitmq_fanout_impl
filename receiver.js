const amqp = require('amqplib');

const EXCHANGE_NAME = 'fanout_exchange';

async function receive() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a fanout exchange
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

    // Create a unique queue for consumer 1
    const { queue } = await channel.assertQueue('', { exclusive: true });

    // Bind the queue to the fanout exchange
    await channel.bindQueue(queue, EXCHANGE_NAME, '');

    console.log(`Consumer 1 [*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    // Receive message from the queue
    await channel.consume(
      queue,
      (msg) => {
        console.log(`Consumer 1 [x] Received ${msg.content.toString()} in receiver`);
        channel.ack(msg); // Acknowledge the message
      },
      { noAck: false }
    );

  } catch (error) {
    console.error(error);
  }
}

// Start consumer 1
receive();
