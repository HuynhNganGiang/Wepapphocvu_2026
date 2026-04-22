-- =============================================
-- Script creation: Stored Procedures for Web App Học Vụ 2026
-- Date: 2026-04-15
-- =============================================

-- 1. SP: sp_GetUserByUsername
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetUserByUsername]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetUserByUsername]
GO

CREATE PROCEDURE [dbo].[sp_GetUserByUsername]
    @Username NVARCHAR(50)
AS
BEGIN
    SELECT UserId, Username, PasswordHash, RoleId 
    FROM Users 
    WHERE Username = @Username AND IsActive = 1
END
GO

-- 2. SP: sp_GetAllCourses
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllCourses]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllCourses]
GO

CREATE PROCEDURE [dbo].[sp_GetAllCourses]
AS
BEGIN
    SELECT * FROM Courses
END
GO

-- 3. SP: sp_GetCourseById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetCourseById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetCourseById]
GO

CREATE PROCEDURE [dbo].[sp_GetCourseById]
    @CourseId INT
AS
BEGIN
    SELECT * FROM Courses WHERE CourseId = @CourseId
END
GO

-- 4. SP: sp_CreateCourse
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CreateCourse]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_CreateCourse]
GO

CREATE PROCEDURE [dbo].[sp_CreateCourse]
    @CourseCode NVARCHAR(20),
    @CourseName NVARCHAR(100),
    @Credits INT,
    @DepartmentId INT
AS
BEGIN
    INSERT INTO Courses (CourseCode, CourseName, Credits, DepartmentId)
    VALUES (@CourseCode, @CourseName, @Credits, @DepartmentId)
END
GO

-- 5. SP: sp_UpdateCourse
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateCourse]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateCourse]
GO

CREATE PROCEDURE [dbo].[sp_UpdateCourse]
    @CourseId INT,
    @CourseCode NVARCHAR(20),
    @CourseName NVARCHAR(100),
    @Credits INT,
    @DepartmentId INT
AS
BEGIN
    UPDATE Courses 
    SET CourseCode = @CourseCode,
        CourseName = @CourseName,
        Credits = @Credits,
        DepartmentId = @DepartmentId
    WHERE CourseId = @CourseId
END
GO

-- 6. SP: sp_DeleteCourse
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteCourse]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteCourse]
GO

CREATE PROCEDURE [dbo].[sp_DeleteCourse]
    @CourseId INT
AS
BEGIN
    DELETE FROM Courses WHERE CourseId = @CourseId
END
GO
