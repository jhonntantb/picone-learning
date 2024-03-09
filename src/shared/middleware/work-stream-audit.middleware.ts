import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { WorkStreamRequest } from '../classes/work-stream-request';
import * as requestIp from 'request-ip';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { WorkStreamResponse } from '../classes/tracking-response-server';
import { WorkStreamAuditRepository } from '../repository/stored-procedure/work-stream-audit.repository';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class WorkStreamAuditMiddleware implements NestMiddleware {
  constructor(
    private readonly workStreamAuditRepository: WorkStreamAuditRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    const requestTracked = this.trackRequest(req);

    const workStreamAuditId =
      await this.workStreamAuditRepository.insertWorkStreamAudit(
        requestTracked,
      );
    console.log('--------------------workStreamAuditId', workStreamAuditId);
    this.trackResponse(workStreamAuditId[0].WorkStreamAuditId, res);

    const id: string = '9r949nvidi847'; // will be capture of header
    this.logger
      .child({
        workStream: requestTracked.workStream,
        host: requestTracked.host,
        origin: requestTracked.origin,
        requestJson: requestTracked.requestJson,
        requestDate: requestTracked.requestDate,
        userAgent: requestTracked.userAgent,
        requestIP: requestTracked.requestIP,
      })
      .debug(id);

    next();
  }
  trackRequest(req: Request) {
    const clientIp = requestIp.getClientIp(req);
    const trackingRequest = new WorkStreamRequest(
      req.url,
      req.headers.host,
      req.headers.origin,
      JSON.stringify({
        body: req.body,
        /* headers: {
                    RecaptchaToken: req.headers['recaptchatoken'],
                }, */
      }),
      dayjs().locale('es').utc(true).format(),
      req.headers['user-agent'],
      clientIp,
    );

    return trackingRequest;
  }
  trackResponse(workStreamAuditId: number, res: Response) {
    res.on('finish', () => {
      const trackingResponse = new WorkStreamResponse(
        JSON.stringify({
          status: res.statusCode,
          statusMessage: res.statusMessage,
        }),
        dayjs().locale('es').utc(true).format(),
      );
      this.workStreamAuditRepository.updateWorkStreamAudit(
        workStreamAuditId,
        trackingResponse,
      );
    });
  }
}
