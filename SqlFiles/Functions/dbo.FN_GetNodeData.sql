SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
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
															(
															
															  CASE
                  WHEN      left(cast(textValue as varchar(1024)),6)='umb://' 
                     THEN 
						   dbo.FN_GetMediaURL (cast(textValue as varchar(1024))) 


                  ELSE textValue
             END 
															
															
															)))))))
FROM     umbracoPropertyData inner join [dbo].[cmsPropertyType] ON   umbracoPropertyData.propertyTypeId = [cmsPropertyType].id
where umbracoPropertyData.versionID=@VersionID
ORDER BY versionId DESC

select @response = JSON_MODIFY (@response,'$.Name', umbracoNode.text) FROM umbracoNode where id=  @NodeID

insert into @Table_Var (NodeID,JsonData)  values (@NodeID, @response)

	RETURN 
END
GO
