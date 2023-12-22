import {
  AddItemBody,
  Env,
  EventType,
  EventTypeProposalData as EventTypeProposalData,
  InboxItemTypeProposalData,
  KvpkReverseResponse,
  NotifyBody,
} from '../types'
import { objectMatchesStructure, respond, respondError } from '../utils'

export const notify = async (
  request: Request,
  { kvpk, inbox, NOTIFY_SECRET, INBOX_SECRET }: Env
): Promise<Response> => {
  if (request.headers.get('x-api-key') !== NOTIFY_SECRET) {
    return respondError(401, 'Invalid secret')
  }

  const body: NotifyBody = await request.json()
  if (
    !objectMatchesStructure(body, {
      type: {},
      data: {},
    })
  ) {
    return respondError(400, 'Invalid request body')
  }

  switch (body.type) {
    case EventType.ProposalCreated:
    case EventType.ProposalExecuted:
    case EventType.ProposalClosed:
    case EventType.PendingProposalCreated:
    case EventType.PendingProposalRejected:
      const { data } = body
      if (
        objectMatchesStructure<EventTypeProposalData>(data, {
          chainId: {},
          dao: {},
          proposalId: {},
        })
      ) {
        // Get all public keys following the DAO.
        const publicKeys = (
          await (
            await kvpk.fetch(
              `https://kvpk.daodao.zone/reverse/following:${data.chainId}:${data.dao}`
            )
          ).json<KvpkReverseResponse>()
        ).items
          .map(({ publicKey }) => publicKey)
          .filter(Boolean)

        // Send a notification to each public key.
        await Promise.all(
          publicKeys.map((publicKey) => {
            const inboxData: AddItemBody<InboxItemTypeProposalData> = {
              chainId: data.chainId,
              type: body.type,
              data,
            }

            return inbox.fetch(
              'https://inbox.daodao.zone/add/pk/' + publicKey,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-API-Key': INBOX_SECRET,
                },
                body: JSON.stringify(inboxData),
              }
            )
          })
        )
      }

      break
    default:
      return respondError(400, 'Invalid event type')
  }

  return respond(200, {
    success: true,
  })
}
