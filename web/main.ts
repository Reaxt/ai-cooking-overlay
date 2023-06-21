import "./style.css"

import { client } from "./rpc.ts"

client.webhook.subscribe(undefined, {
  onData(webhook) {
    console.log(webhook)
  },
})
