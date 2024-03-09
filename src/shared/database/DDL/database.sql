CREATE TABLE [pinecone_app].[WorkStreamAudits] (
  [WorkStreamAuditId] int identity(1,1) NOT NULL,
  [WorkStreamAuditGUID] uniqueidentifier NOT NULL,
  [WorkStream] varchar(200) NOT NULL,
  [Host] varchar(100) NOT NULL,
  [Origin] varchar(100) NOT NULL,
  [RequestJson] varchar(5000) NOT NULL,
  [RequestDate] datetime NOT NULL,
  [ResponseJson] varchar(5000) NULL,
  [ResponseDate] datetime NULL,
  [UserAgent] varchar(150) NOT NULL,
  [RequestIP] varchar(20) NOT NULL,
  PRIMARY KEY ([WorkStreamAuditId])
);
