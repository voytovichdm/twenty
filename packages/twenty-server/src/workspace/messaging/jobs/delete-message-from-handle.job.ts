import { Injectable, Logger } from '@nestjs/common';

import { MessageQueueJob } from 'src/integrations/message-queue/interfaces/message-queue-job.interface';

export type DeleteMessageFromHandleJobData = {
  workspaceId: string;
  workspaceMemberId: string;
  handle: string;
};

@Injectable()
export class DeleteMessageFromHandleJob
  implements MessageQueueJob<DeleteMessageFromHandleJobData>
{
  private readonly logger = new Logger(DeleteMessageFromHandleJob.name);

  constructor() {}

  async handle(data: DeleteMessageFromHandleJobData): Promise<void> {
    this.logger.log(
      `Deleting message from handle ${data.handle} in workspace ${data.workspaceId} for workspace member ${data.workspaceMemberId}`,
    );

    this.logger.log(
      `Deleting message from handle ${data.handle} in workspace ${data.workspaceId} for workspace member ${data.workspaceMemberId} done`,
    );
  }
}
