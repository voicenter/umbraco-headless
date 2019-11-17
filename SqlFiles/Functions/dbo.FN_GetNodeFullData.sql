SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
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
GO
