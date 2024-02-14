import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ObjectRecordDeleteEvent } from 'src/integrations/event-emitter/types/object-record-delete.event';
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
    payload: ObjectRecordDeleteEvent<BlocklistObjectMetadata>,
  ) {
    this.messageQueueService.add<DeleteMessageFromHandleJobData>(
      DeleteMessageFromHandleJob.name,
      {
        workspaceId: payload.workspaceId,
        workspaceMemberId: payload.deletedRecord.id,
        handle: payload.deletedRecord.handle,
      },
    );
  }
}
