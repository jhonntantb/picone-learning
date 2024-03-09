import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { QueryTypes, Sequelize } from 'sequelize';
import { WorkStreamRequest } from '../../classes/work-stream-request';
import { WorkStreamResponse } from '../../classes/tracking-response-server';
import { NameConnectionEnum } from '../../enums/connection-name';

@Injectable()
export class WorkStreamAuditService {
  constructor(
    @InjectConnection(NameConnectionEnum.NAME_CONNECTION)
    private connection: Sequelize,
  ) {}
  async insertWorkStreamAudit(workStreamRequest: WorkStreamRequest) {
    const query = `EXECUTE [${NameConnectionEnum.SCHEMA}].[spInsertWorkStreamAudit] 
            @WorkStream = $workStream, 
            @Host = $host,
            @Origin = $origin,
            @RequestJson = $requestJson,
            @RequestDate = $requestDate,
            @UserAgent = $userAgent,
            @RequestIP = $requestIP`;

    const workStream = await this.connection.query(query, {
      type: QueryTypes.INSERT,
      raw: true,
      bind: {
        workStream: workStreamRequest.workStream,
        host: workStreamRequest.host,
        origin: workStreamRequest.origin || '', //check origin in postman
        requestJson: workStreamRequest.requestJson,
        requestDate: workStreamRequest.requestDate,
        userAgent: workStreamRequest.userAgent,
        requestIP: workStreamRequest.requestIP,
      },
    });
    return workStream[0];
  }
  updateWorkStreamAudit(
    WorkStreamAuditId: number,
    workStreamResponse: WorkStreamResponse,
  ) {
    const query = `EXECUTE [${NameConnectionEnum.SCHEMA}].[spUpdateWorkStreamAudit] 
            @WorkStreamId = '${WorkStreamAuditId}', 
            @ResponseJson = '${workStreamResponse.responseJson}',
            @ResponseDate = '${workStreamResponse.responseDate}'`;

    this.connection.query(query, {
      type: QueryTypes.INSERT,
      raw: true,
    });
  }
}
