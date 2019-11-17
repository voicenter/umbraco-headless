SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
-- =============================================
-- Author:		nitzan
-- Create date: 161119
-- Description:	url list of website
-- Example:     select dbo.FN_GetUrlList ()
-- =============================================
CREATE FUNCTION [dbo].[FN_GetUrlList] 
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
GO
