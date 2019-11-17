SET QUOTED_IDENTIFIER ON
GO
SET ANSI_NULLS ON
GO
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
	@mediaPath varchar(1024)
)
RETURNS varchar(1024)
AS
BEGIN
	-- Declare the return variable here
	DECLARE @Result varchar(1024)

	-- Add the T-SQL statements to compute the return value here
	
	SELECT TOP (1)
	 @Result=path
		FROM     umbracoMediaVersion
				WHERE  (path LIKE right(@mediaPath,len(@mediaPath)-5)+'%')
	
	--SELECT @Result = @mediaPath


	-- Return the result of the function
	RETURN @Result

END
GO
