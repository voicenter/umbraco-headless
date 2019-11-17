SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
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
GO
