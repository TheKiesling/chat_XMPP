import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug';

const xmpp = client({
  service: 'ws://alumchat.lol:7070/ws',
  domain: 'alumchat.lol',
  resource: 'example',
  username: 'kie21581-test',
  password: '123',
});

debug(xmpp, true);

xmpp.on("error", (err) => {
  console.error(err);
});

xmpp.on("offline", () => {
  console.log("offline");
});

xmpp.on("stanza", async (stanza) => {
  if (stanza.is("message") && stanza.getChild("body")) {
    console.log("Received message:", stanza.getChildText("body"));
  }
});

xmpp.on("online", async (address) => {
  await xmpp.send(xml("presence"));

  const message = xml(
    "message",
    { type: "chat", to: "kie21581-test@alumchat.lol/example" },
    xml("body", {}, "hello world")
  );
  await xmpp.send(message);
  
  setTimeout(async () => {
    await xmpp.send(xml("presence", { type: "unavailable" }));
    await xmpp.stop();
  }, 5000); 
});

xmpp.start().catch(console.error);
