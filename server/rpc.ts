import { initTRPC } from "@trpc/server"
import { type Observer, observable } from "@trpc/server/observable"
import { applyWSSHandler } from "@trpc/server/adapters/ws"
import ws from "ws"
import { type WebhookResponse } from "./zodobjects/webhook-response"

const observers = new Set<Observer<WebhookResponse, unknown>>()
export function sendWebhookResponse(res: WebhookResponse) {
  for (const o of observers) {
    o.next(res)
  }
}

const t = initTRPC.create()
export const router = t.router({
  webhook: t.procedure.subscription(() =>
    observable<WebhookResponse>((o) => {
      observers.add(o)
      return () => observers.delete(o)
    }),
  ),
})
export type Router = typeof router

const wss = new ws.Server({ port: 3001 })
applyWSSHandler({ wss, router, createContext: () => ({}) })
