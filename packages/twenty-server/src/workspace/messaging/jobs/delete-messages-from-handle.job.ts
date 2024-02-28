import { Injectable, Logger } from '@nestjs/common';

import { MessageQueueJob } from 'src/integrations/message-queue/interfaces/message-queue-job.interface';

import { MessageChannelMessageAssociationService } from 'src/workspace/messaging/repositories/message-channel-message-association/message-channel-message-association.service';
import { MessageChannelService } from 'src/workspace/messaging/repositories/message-channel/message-channel.service';

export type DeleteMessagesFromHandleJobData = {
  workspaceId: string;
  workspaceMemberId: string;
  handle: string;
};

@Injectable()
export class DeleteMessagesFromHandleJob
  implements MessageQueueJob<DeleteMessagesFromHandleJobData>
{
  private readonly logger = new Logger(DeleteMessagesFromHandleJob.name);

  constructor(
    private readonly messageChannelService: MessageChannelService,
    private readonly messageChannelMessageAssociationService: MessageChannelMessageAssociationService,
  ) {}

  async handle(data: DeleteMessagesFromHandleJobData): Promise<void> {
    this.logger.log(
      `Deleting messages from ${data.handle} in workspace ${data.workspaceId} for workspace member ${data.workspaceMemberId}`,
    );

    const { handle, workspaceId, workspaceMemberId } = data;

    const messageChannelIds =
      await this.messageChannelService.getMessageChannelIdsByWorkspaceMemberId(
        workspaceMemberId,
        workspaceId,
      );

    await this.messageChannelMessageAssociationService.deleteByHandleAndMessageChannelIds(
      handle,
      messageChannelIds,
      workspaceId,
    );

    this.logger.log(
      `Deleting messages from handle ${data.handle} in workspace ${data.workspaceId} for workspace member ${data.workspaceMemberId} done`,
    );
  }
}
