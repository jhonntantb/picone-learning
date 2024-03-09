----------------------------------------------------------------WORK STREAM AUDIT

--insert work stream audit
CREATE PROCEDURE [pinecone_app].[spInsertWorkStreamAudit](
	@WorkStream as varchar(150), 
	@Host as varchar(150),
	@Origin varchar(100),
	@RequestJson varchar(1500),
	@RequestDate datetime,
	@UserAgent varchar(100),
	@RequestIP varchar(20)
	
)
as
begin
	insert into [pinecone_app].[WorkStreamAudits] 
	output inserted.WorkStreamAuditId 
	values(NEWID(), @WorkStream, @Host, @Origin, @RequestJson, @RequestDate, NULL, NULL, @UserAgent, @RequestIP)
	
END;


--update work stream audit
CREATE PROCEDURE [pinecone_app].[spUpdateWorkStreamAudit](
	@WorkStreamId as varchar(36), 
	@ResponseJson varchar(1500),
	@ResponseDate datetime 
)
as
begin
	update [pinecone_app].[WorkStreamAudits] set ResponseJson = @ResponseJson, ResponseDate = @ResponseDate where WorkStreamAuditId = @WorkStreamId
END;