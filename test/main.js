import { client, xml } from "@xmpp/client";
import debug from '@xmpp/debug';

const xmpp = client({
  service: 'ws://alumchat.lol:7070/ws/',
  domain: 'alumchat.lol',
  resource: 'example',
  username: 'test1234',
  password: 'test1234',
});

xmpp.on("error", (err) => {
  console.error("Error:", err);
});

xmpp.on("status", (status) => {
  console.log("Status:", status);
});



xmpp.on('online', async (address) => {
  console.log('✅', 'Connected as', address.toString());

  // Send initial presence
  await xmpp.send(xml('presence'));

  // Send a message
  const message = xml(
    'message',
    { type: 'chat', to: 'kie21581@alumchat.lol/example' },
    xml('body', {}, 'enviarNuevo11')
  );
  await xmpp.send(message);

});

debug(xmpp, true);


xmpp.start().catch(console.error);

