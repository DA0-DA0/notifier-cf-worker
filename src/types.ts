export interface Env {
  // Service bindings.
  kvpk: Fetcher
  inbox: Fetcher

  // Secrets.
  NOTIFY_SECRET: string
  INBOX_SECRET: string
}

export type NotifyBody = {
  type: string
  data: Record<string, unknown>
}

export enum EventType {
  ProposalCreated = 'proposal_created',
  ProposalExecuted = 'proposal_executed',
  ProposalClosed = 'proposal_closed',
}

export type EventTypeProposalCreatedData = {
  chainId: string
  dao: string
}

export type KvpkReverseResponse = {
  items: {
    publicKey: string
    value: unknown
  }[]
}

export type AddItemBody<Data = Record<string, unknown>> = {
  chainId?: string
  type: string
  data: Data
}

export type InboxItemTypeProposalCreatedData = Omit<
  EventTypeProposalCreatedData,
  'chainId'
>
