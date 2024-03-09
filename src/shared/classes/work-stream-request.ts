export class WorkStreamRequest {
  constructor(
    public workStream: string,
    public host: string,
    public origin: string,
    public requestJson: object | any,
    public requestDate: string | any,
    public userAgent: string,
    public requestIP: string,
  ) {}
}
