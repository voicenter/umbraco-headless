DROP FUNCTION IF EXISTS [dbo].[FN_GetNodeData]
GO
/****** Object:  UserDefinedFunction [dbo].[FN_GetNodeData]    Script Date: 10/28/2019 2:28:37 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
-- select * from FN_GetNodeData(1095)
-- =============================================
create FUNCTION [dbo].[FN_GetNodeData]
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

GO
DROP FUNCTION IF EXISTS [dbo].[FN_GetNodeFullData]
GO
/****** Object:  UserDefinedFunction [dbo].[FN_GetNodeFullData]    Script Date: 10/28/2019 2:25:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Shlomi Gutman
-- Create date:
-- Description:
-- select * from FN_GetNodeFullData(1095)
-- =============================================
create   FUNCTION [dbo].[FN_GetNodeFullData]
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
--set @response =  '{}'--(SELECT NULL AS TEST FOR JSON PATH,ROOT)
 select @response  =JSON_QUERY( JsonData.JsonData,'$') from FN_GetNodeData(@NodeID) as JsonData
select   @response=JSON_MODIFY(@response,'append $.'+[cmsContentType].alias,  JSON_QUERY( dataJson.JsonData,'$'))  from umbracoNode
inner join [dbo].[umbracoContent] on umbracoNode.id = [umbracoContent].nodeId
inner join [dbo].[cmsContentType] on  umbracoContent.[contentTypeId] = [cmsContentType].nodeId
cross apply  FN_GetNodeFullData(umbracoNode.ID) as dataJson where umbracoNode.parentId=@NodeID

insert into @Table_Var (NodeID,JsonData)  values (@NodeID, @response)

	RETURN
END
