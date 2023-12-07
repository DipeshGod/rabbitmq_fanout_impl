const amqp = require('amqplib');

const EXCHANGE_NAME = 'fanout_exchange';

let count = 0;

async function send() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // Declare a fanout exchange
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

    // Function to send message
    const sendMessage = () => {
      const message = `Hello, RabbitMQ! - ${new Date().toISOString()} - COUNT ${count++}`;
      
      // Publish the message to the fanout exchange
      channel.publish(EXCHANGE_NAME, '', Buffer.from(message));
      console.log(` [x] Sent '${message}'`);
    };

    // Send message every 3 seconds
    const interval = setInterval(sendMessage, 3000);

    // Stop sending after 15 seconds (for demonstration)
    // setTimeout(() => {
    //   clearInterval(interval);
    //   console.log('Stopped sending messages.');
    //   channel.close();
    //   connection.close();
    // }, 15000); // Send messages for 15 seconds

  } catch (error) {
    console.error(error);
  }
}

send();
