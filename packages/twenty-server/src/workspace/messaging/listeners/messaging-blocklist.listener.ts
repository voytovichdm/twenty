import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ObjectRecordDeleteEvent } from 'src/integrations/event-emitter/types/object-record-delete.event';
import { MessageQueue } from 'src/integrations/message-queue/message-queue.constants';
import { MessageQueueService } from 'src/integrations/message-queue/services/message-queue.service';
import { BlocklistObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/blocklist.object-metadata';

@Injectable()
export class MessagingBlocklistListener {
  constructor(
    @Inject(MessageQueue.messagingQueue)
    private readonly messageQueueService: MessageQueueService,
  ) {}

  @OnEvent('blocklist.deleted')
  handleDeletedEvent(
    payload: ObjectRecordDeleteEvent<BlocklistObjectMetadata>,
  ) {}
}
