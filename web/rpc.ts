import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client"
import { type Router } from "../server/rpc"

const wsClient = createWSClient({
  url: `ws://localhost:3001`,
})
export const client = createTRPCProxyClient<Router>({
  links: [
    wsLink({
      client: wsClient,
    }),
  ],
})
