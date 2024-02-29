import { Injectable, Logger } from '@nestjs/common';

import { MessageQueueJob } from 'src/integrations/message-queue/interfaces/message-queue-job.interface';

import { ConnectedAccountService } from 'src/workspace/messaging/repositories/connected-account/connected-account.service';
import { GmailFullSyncService } from 'src/workspace/messaging/services/gmail-full-sync.service';

export type ReimportMessagesFromHandleJobData = {
  workspaceId: string;
  workspaceMemberId: string;
  handle: string;
};

@Injectable()
export class ReimportMessagesFromHandleJob
  implements MessageQueueJob<ReimportMessagesFromHandleJobData>
{
  private readonly logger = new Logger(ReimportMessagesFromHandleJob.name);

  constructor(
    private readonly connectedAccountService: ConnectedAccountService,
    private readonly gmailFullSyncService: GmailFullSyncService,
  ) {}

  async handle(data: ReimportMessagesFromHandleJobData): Promise<void> {
    this.logger.log(
      `Reimporting messages from handle ${data.handle} in workspace ${data.workspaceId} for workspace member ${data.workspaceMemberId}`,
    );

    const { handle, workspaceId, workspaceMemberId } = data;

    const connectedAccount =
      await this.connectedAccountService.getAllByWorkspaceMemberId(
        workspaceMemberId,
        workspaceId,
      );

    this.gmailFullSyncService.startGmailFullSync(
      workspaceId,
      connectedAccount[0].id,
      undefined,
      [handle],
    );

    this.logger.log(
      `Reimporting messages from ${data.handle} in workspace ${data.workspaceId} for workspace member ${data.workspaceMemberId} done`,
    );
  }
}
