import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PineconeService } from './adapters/out/pinecone.service';
import { PineconeController } from './adapters/in/pinecone.controller';
import { WorkStreamAuditMiddleware } from 'src/shared/middleware/work-stream-audit.middleware';
import { WorkStreamAuditRepository } from 'src/shared/repository/stored-procedure/work-stream-audit.repository';

@Module({
  imports: [WorkStreamAuditRepository],
  controllers: [PineconeController],
  providers: [PineconeService],
})
export class PineconeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WorkStreamAuditMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
