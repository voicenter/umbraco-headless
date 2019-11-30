DROP FUNCTION IF EXISTS FN_GetNodeDataOLD
 go
DROP FUNCTION IF EXISTS FN_GetNodeFullData
 go
DROP FUNCTION IF EXISTS FN_GetNodeDataNU
 go
DROP FUNCTION IF EXISTS FN_GetNodeJpath
 go
DROP FUNCTION IF EXISTS FN_GetNodeData
 go
DROP FUNCTION IF EXISTS FN_GetMediaURL
 go
DROP FUNCTION IF EXISTS FN_GetNodeURL
 go
DROP FUNCTION IF EXISTS FN_GetUrlList
 go
DROP FUNCTION IF EXISTS FN_GetFuctionSQLScriptNotWorking
 go
DROP PROCEDURE IF EXISTS LongPrint
 go
DROP FUNCTION IF EXISTS FN_GetFuctionSQLScript
 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
-- select * from FN_GetNodeData(1095)
-- =============================================
CREATE  FUNCTION [dbo].[FN_GetNodeData]
(
	-- Add the parameters for the function here
	@NodeID int
)
RETURNS
@Table_Var TABLE
(
	-- Add the column definitions for the TABLE variable here
	NodeID int ,
	JsonData nVarchar(max)
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set

Declare  @response   NVARCHAR(MAX)
set @response =  '{}'--(SELECT NULL AS TEST FOR JSON PATH,ROOT)
Declare @VersionID int

SELECT TOP (1) @VersionID=  id
FROM     umbracoContentVersion
WHERE  ([current] = 1) AND (nodeId = @NodeID)
ORDER BY id DESC

SELECT @response=     JSON_MODIFY( @response , '$.'+[cmsPropertyType].ALIAS, isnull( cast (intValue as nvarchar(1024)),
															isnull(cast ( decimalValue as nvarchar(1024)),
															isnull(cast ( decimalValue  as nvarchar(1024)),
															isnull(cast (dateValue as nvarchar(1024)),
															isnull(  varcharValue,
															(  textValue)))))))
FROM     umbracoPropertyData inner join [dbo].[cmsPropertyType] ON   umbracoPropertyData.propertyTypeId = [cmsPropertyType].id
where umbracoPropertyData.versionID=@VersionID
ORDER BY versionId DESC

insert into @Table_Var (NodeID,JsonData)  values (@NodeID, @response)

	RETURN
END

 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
-- select * from FN_GetNodeFullData(1095)
-- =============================================
CREATE   FUNCTION [dbo].[FN_GetNodeFullData]
(
	-- Add the parameters for the function here
	@NodeID int
)
RETURNS
@Table_Var TABLE
(
	-- Add the column definitions for the TABLE variable here
	NodeID int ,
	JsonData nVarchar(max)
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set

Declare  @response   NVARCHAR(MAX)
Declare  @responseChildren   NVARCHAR(MAX)
set @responseChildren =  '{}'--(SELECT NULL AS TEST FOR JSON PATH,ROOT)
 select @response  =JSON_QUERY( JsonData.JsonData,'$') from FN_GetNodeData(@NodeID) as JsonData

set    @response=JSON_MODIFY(@response,'$.children','')
select   @responseChildren=
JSON_MODIFY(@responseChildren,'$.'+[cmsContentType].alias+'_'+cast(umbracoNode.sortOrder as Varchar(7))+'_'+replace(cast( umbracoNode.id as Varchar(7)),'-','_'), JSON_QUERY( dataJson.JsonData,'$'))
 -- 'append $.'+[cmsContentType].alias+'.ID'+replace(cast([cmsContentType].nodeId as Varchar(7)),'-','_')
 from umbracoNode
inner join [dbo].[umbracoContent] on umbracoNode.id = [umbracoContent].nodeId
inner join [dbo].[cmsContentType] on  umbracoContent.[contentTypeId] = [cmsContentType].nodeId
cross apply  FN_GetNodeFullData(umbracoNode.ID) as dataJson where umbracoNode.parentId=@NodeID

insert into @Table_Var (NodeID,JsonData)  values (@NodeID,JSON_QUERY( JSON_MODIFY( @response,'$.children',JSON_QUERY(@responseChildren ,'$')),'$'))

	RETURN
END

 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
-- select * from FN_GetNodeData(1095)
-- =============================================
create FUNCTION [dbo].[FN_GetNodeDataNU]
(
	-- Add the parameters for the function here
	@NodeID int
)
RETURNS TABLE
AS
RETURN
(
	-- Add the SELECT statement with parameter references here
	SELECT TOP (1) [nodeId] as NodeID  ,
cast (	[cmsContentNu].data as nvarchar(max)) as  JsonData

  FROM [UmbracoNuxt].[dbo].[cmsContentNu] where cmsContentNu.nodeId = @NodeID and cmsContentNu.published=1 order by cmsContentNu.rv desc
)


 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:	Get Node Jpath in the full site tree data
--
--select dbo.FN_GetNodeJpath(1136)
-- =============================================
CREATE FUNCTION [dbo].[FN_GetNodeJpath]
(
	-- Add the parameters for the function here
	@NodeID int
)
RETURNS Varchar(max)
AS
BEGIN
	declare @Jpath varchar(max)
declare @parentsList varchar(1024)
select @parentsList=path from umbracoNode where umbracoNode.id =@NodeID
set @Jpath='$.'
select --value as [parentId], umbracoNode.*,cmsContentType.alias as cmsContentType
@Jpath =@Jpath+'children.'+  cmsContentType.alias+'_'+cast(umbracoNode.sortOrder as Varchar(7))+ '_'+cast (umbracoNode.id as varchar(12))+'.'
from STRING_SPLIT(@parentsList,',') as IdList
	inner join umbracoNode on IdList.value= umbracoNode.id
	inner join umbracoContent on IdList.value= umbracoContent.nodeId
	inner join cmsContentType on umbracoContent.contentTypeId = cmsContentType.nodeId
	where value>0
		and level <> 1
	order by level
	-- Return the result of the function
	RETURN left(@Jpath,len(@Jpath)-1)

END

 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
-- select * from FN_GetNodeData(1104)
-- =============================================
CREATE  FUNCTION [dbo].[FN_GetNodeData]
(
	-- Add the parameters for the function here
	@NodeID int
)
RETURNS
@Table_Var TABLE
(
	-- Add the column definitions for the TABLE variable here
	NodeID int ,
	JsonData nVarchar(max)
)
AS
BEGIN
	-- Fill the table variable with the rows for your result set

Declare  @response   NVARCHAR(MAX)
set @response =  '{}'--(SELECT NULL AS TEST FOR JSON PATH,ROOT)
Declare @VersionID int

SELECT TOP (1) @VersionID=  id
FROM     umbracoContentVersion
WHERE  ([current] = 1) AND (nodeId = @NodeID)
ORDER BY id DESC

SELECT @response=     JSON_MODIFY( @response , '$.'+[cmsPropertyType].ALIAS,


case
	when intValue is not null  then cast (intValue as nvarchar(MAX))
	when decimalValue is not null  then cast (decimalValue as nvarchar(MAX))
	when dateValue is not null  then cast (dateValue as nvarchar(MAX))
	when varcharValue is not null  then cast (varcharValue as nvarchar(MAX))
	when intValue is not null  then cast (intValue as nvarchar(MAX))
	when textValue is not null  and    left(cast(textValue as  NVARCHAR(MAX)),6)='umb://'   then dbo.FN_GetMediaURL (cast(textValue as varchar(MAX)))
	when textValue is not null   then cast (textValue as nvarchar(MAX))
	else 'UnKnown'
end





)
FROM     umbracoPropertyData inner join [dbo].[cmsPropertyType] ON   umbracoPropertyData.propertyTypeId = [cmsPropertyType].id
where umbracoPropertyData.versionID=@VersionID
ORDER BY versionId DESC

select @response = JSON_MODIFY (@response,'$.Name', umbracoNode.text) FROM umbracoNode where id=  @NodeID

insert into @Table_Var (NodeID,JsonData)  values (@NodeID, @response)

	RETURN
END

 go
-- =============================================
-- Author:		nitzan gutman
-- Create date: 161119
-- Description:	getting media full path from prefix
-- Example:
-- select dbo.FN_GetMediaURL ('umb://media/c0969cab13ab4de9819a848619ac2b5d')
-- =============================================
CREATE FUNCTION [dbo].[FN_GetMediaURL]
(
	-- Add the parameters for the function here
	@mediaPath varchar(max)
)
RETURNS varchar(max)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result varchar(max)

	-- Add the T-SQL statements to compute the return value here

	SELECT TOP (1)
	 @Result=path
		FROM     umbracoMediaVersion
				WHERE  (path LIKE right(@mediaPath,len(@mediaPath)-5)+'%')

	--SELECT @Result = @mediaPath


	-- Return the result of the function
	RETURN @Result

END

 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:	Get Node Jpath in the full site tree data
--
--select dbo.[FN_GetNodeURL](1113)
-- =============================================
CREATE FUNCTION [dbo].[FN_GetNodeURL]
(
	-- Add the parameters for the function here
	@NodeID int
)
RETURNS Varchar(max)
AS
BEGIN
	declare @url varchar(max)
declare @parentsList varchar(1024)
declare @VersionID int

	SELECT TOP (1) @VersionID=  id
		FROM     umbracoContentVersion
		WHERE  ([current] = 1) AND (nodeId = @NodeID)
		ORDER BY id DESC

		SELECT TOP (1) @url = '/'+umbracoPropertyData.varcharValue
		FROM     cmsPropertyType INNER JOIN
						  umbracoPropertyData ON cmsPropertyType.id = umbracoPropertyData.propertyTypeId
		WHERE  (cmsPropertyType.Alias = N'urlAlias') AND (umbracoPropertyData.versionId = @VersionID)
		ORDER BY cmsPropertyType.id DESC
		IF not @url is null
		BEGIN
			Return @url
		END

select @parentsList=path from umbracoNode where umbracoNode.id =@NodeID


set @url='/'
select --value as [parentId], umbracoNode.*,cmsContentType.alias as cmsContentType
@url =@url+umbracoNode.text+'/'
from STRING_SPLIT(@parentsList,',') as IdList
	inner join umbracoNode on IdList.value= umbracoNode.id
	inner join umbracoContent on IdList.value= umbracoContent.nodeId
	inner join cmsContentType on umbracoContent.contentTypeId = cmsContentType.nodeId
	where value>0
		and level <> 1
	order by level
	-- Return the result of the function

	set @url=REPLACE(@url,' ','-')
	set @url=REPLACE(@url,'(','-')
	set @url=REPLACE(@url,')','-')
	set @url=REPLACE(@url,'----','-')
	set @url=REPLACE(@url,'---','-')
	set @url=REPLACE(@url,'--','-')
	set @url=LOWER(@url)

	 RETURN left(@url,len(@url)-1)

END

 go
-- =============================================
-- Author:		nitzan
-- Create date: 161119
-- Description:	url list of website
-- Example:     select dbo.FN_GetUrlList ()
-- =============================================
CREATE FUNCTION FN_GetUrlList
(
	-- Add the parameters for the function here

)
RETURNS varchar(max)
AS
BEGIN
	-- Declare the return variable here
		DECLARE @Response varchar(max)
		DECLARE @urlList varchar(max)
		DECLARE @hideUrlPropertyTypeID int
		SET @Response = '{}'
		SET @urlList = '{}'
		select @hideUrlPropertyTypeID=cmsPropertyType.id
		FROM cmsPropertyType where cmsPropertyType.Alias = 'disableURL'
		SELECT	@urlList=JSON_MODIFY (@urlList ,'append $.urlList',
				JSON_MODIFY(	JSON_MODIFY ( JSON_MODIFY (JSON_MODIFY (
														@response , '$.nodeID',umbracoContentVersion.nodeId),
													'$.url',dbo.[FN_GetNodeURL](umbracoContentVersion.nodeId)),
													'$.Jpath',dbo.[FN_GetNodeJpath](umbracoContentVersion.nodeId)),
													'$.TemplateAlias', cmsTemplate.alias ))
				FROM     umbracoContentVersion
		LEFT JOIN umbracoPropertyData ON umbracoPropertyData.versionId = umbracoContentVersion.id
		AND umbracoPropertyData.propertyTypeId = @hideUrlPropertyTypeID
		JOIN umbracoDocumentVersion ON umbracoContentVersion.id = umbracoDocumentVersion.id
		left JOIN cmsTemplate ON umbracoDocumentVersion.templateId = cmsTemplate.nodeId
		WHERE  ([current] = 1) 	AND (umbracoPropertyData.intValue <>1 or umbracoPropertyData.intValue is null)
		ORDER BY umbracoContentVersion.Id DESC
--		print @urlList




	-- Return the result of the function
	RETURN @urlList

END

 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:	select dbo.FN_GetFuctionSQLScript()
-- =============================================
CREATE FUNCTION FN_GetFuctionSQLScript
(
	-- Add the parameters for the function here

)
RETURNS  nvarchar(max)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result nvarchar(max)

	set @Result=''
	-- Add the T-SQL statements to compute the return value here

-- Get the function name, definition, and relevant properties
SELECT
   @Result = @Result  +'  -- go --  '+ sm.definition

FROM sys.sql_modules AS sm
JOIN sys.objects AS o ON sm.object_id = o.object_id
-- from the function 'dbo.ufnGetProductDealerPrice'
--WHERE sm.object_id = OBJECT_ID('dbo.FN_GetNodeData')
ORDER BY o.type;


	-- Return the result of the function
	RETURN @Result

END

 go
CREATE PROCEDURE [dbo].[LongPrint]
      @String NVARCHAR(MAX)

AS

/*
Example:

exec LongPrint @string =
'This String
Exists to test
the system.'

*/

/* This procedure is designed to overcome the limitation
in the SQL print command that causes it to truncate strings
longer than 8000 characters (4000 for nvarchar).

It will print the text passed to it in substrings smaller than 4000
characters.  If there are carriage returns (CRs) or new lines (NLs in the text),
it will break up the substrings at the carriage returns and the
printed version will exactly reflect the string passed.

If there are insufficient line breaks in the text, it will
print it out in blocks of 4000 characters with an extra carriage
return at that point.

If it is passed a null value, it will do virtually nothing.

NOTE: This is substantially slower than a simple print, so should only be used
when actually needed.
 */

DECLARE @CurrentEnd BIGINT, /* track the length of the next substring */
	@offset TINYINT /*tracks the amount of offset needed */


SET @string = REPLACE(  REPLACE(@string, CHAR(13) + CHAR(10), CHAR(10))   , CHAR(13), CHAR(10))

WHILE LEN(@String) > 1
BEGIN


    IF CHARINDEX(CHAR(10), @String) BETWEEN 1 AND 4000
    BEGIN

           SET @CurrentEnd =  CHARINDEX(CHAR(10), @String) -1
           SET @offset = 2
    END
    ELSE
    BEGIN
           SET @CurrentEnd = 4000
            SET @offset = 1
    END


    PRINT SUBSTRING(@String, 1, @CurrentEnd)

    SET @string = SUBSTRING(@String, @CurrentEnd+@offset, 1073741822)

END /*End While loop*/


 go
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
--  select * from FN_GetFuctionSQLScript()
-- =============================================
CREATE FUNCTION FN_GetFuctionSQLScript
(
	-- Add the parameters for the function here

)
RETURNS TABLE
AS
RETURN
(
	SELECT
  cast (
  'DROP '+
  CASE type
     WHEN 'TF' THEN 'FUNCTION'
     WHEN 'FN' THEN 'FUNCTION'
     WHEN 'IF' THEN 'FUNCTION'
     WHEN 'P' THEN 'PROCEDURE'
	ELSE type collate SQL_Latin1_General_CP1_CI_AS

  end

  +' IF EXISTS '+ name  collate SQL_Latin1_General_CP1_CI_AS + CHAR(13) + CHAR(10) +' go ' + CHAR(13) + CHAR(10)
   as varchar(4000)) collate SQL_Latin1_General_CP1_CI_AS as Script
FROM sys.sql_modules AS sm
JOIN sys.objects AS o ON sm.object_id = o.object_id


union all


	-- Add the SELECT statement with parameter references here
	SELECT
 --  @Result = @Result  +'  -- go --  '+
 cast (sm.definition as varchar(max)) collate SQL_Latin1_General_CP1_CI_AS
 + CHAR(13) + CHAR(10) +' go ' + CHAR(13) + CHAR(10)  as Script

FROM sys.sql_modules AS sm
JOIN sys.objects AS o ON sm.object_id = o.object_id
-- from the function 'dbo.ufnGetProductDealerPrice'
--WHERE sm.object_id = OBJECT_ID('dbo.FN_GetNodeData')


)

 go
