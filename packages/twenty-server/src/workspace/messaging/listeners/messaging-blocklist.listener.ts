import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ObjectRecordCreateEvent } from 'src/integrations/event-emitter/types/object-record-create.event';
import { MessageQueue } from 'src/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/integrations/message-queue/services/message-queue.service';
import {
  DeleteMessageFromHandleJobData,
  DeleteMessageFromHandleJob,
} from 'src/workspace/messaging/jobs/delete-message-from-handle.job';
import { BlocklistObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/blocklist.object-metadata';

@Injectable()
export class MessagingBlocklistListener {
  constructor(
    @Inject(MessageQueue.messagingQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('blocklist.created')
  handleCreatedEvent(
    payload: ObjectRecordCreateEvent<BlocklistObjectMetadata>,
  ) {
    this.messageQueueService.add<DeleteMessageFromHandleJobData>(
      DeleteMessageFromHandleJob.name,
      {
        workspaceId: payload.workspaceId,
        workspaceMemberId: payload.createdRecord.workspaceMember.id,
        handle: payload.createdRecord.handle,
      },
    );
  }
}
