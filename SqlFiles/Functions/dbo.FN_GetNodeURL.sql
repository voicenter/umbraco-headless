SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
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
GO
