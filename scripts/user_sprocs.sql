-- =============================================
-- Script creation: Stored Procedures for Users Management
-- =============================================

-- 1. SP: sp_GetAllUsers
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetAllUsers]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetAllUsers]
GO

CREATE PROCEDURE [dbo].[sp_GetAllUsers]
AS
BEGIN
    SELECT U.UserId, U.Username, U.FullName, U.Email, U.RoleId, R.RoleName, U.IsActive
    FROM Users U
    LEFT JOIN Roles R ON U.RoleId = R.RoleId
END
GO

-- 2. SP: sp_GetUserById
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_GetUserById]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_GetUserById]
GO

CREATE PROCEDURE [dbo].[sp_GetUserById]
    @UserId INT
AS
BEGIN
    SELECT U.UserId, U.Username, U.FullName, U.Email, U.RoleId, R.RoleName, U.IsActive
    FROM Users U
    LEFT JOIN Roles R ON U.RoleId = R.RoleId
    WHERE U.UserId = @UserId
END
GO

-- 3. SP: sp_CreateUser
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_CreateUser]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_CreateUser]
GO

CREATE PROCEDURE [dbo].[sp_CreateUser]
    @Username NVARCHAR(50),
    @PasswordHash NVARCHAR(MAX),
    @FullName NVARCHAR(100),
    @Email NVARCHAR(100),
    @RoleId INT,
    @IsActive BIT
AS
BEGIN
    INSERT INTO Users (Username, PasswordHash, FullName, Email, RoleId, IsActive)
    VALUES (@Username, @PasswordHash, @FullName, @Email, @RoleId, @IsActive)
END
GO

-- 4. SP: sp_UpdateUser
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdateUser]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdateUser]
GO

CREATE PROCEDURE [dbo].[sp_UpdateUser]
    @UserId INT,
    @FullName NVARCHAR(100),
    @Email NVARCHAR(100),
    @RoleId INT,
    @IsActive BIT,
    @PasswordHash NVARCHAR(MAX) = NULL -- Optional password update
AS
BEGIN
    UPDATE Users
    SET FullName = @FullName,
        Email = @Email,
        RoleId = @RoleId,
        IsActive = @IsActive,
        PasswordHash = ISNULL(@PasswordHash, PasswordHash)
    WHERE UserId = @UserId
END
GO

-- 5. SP: sp_DeleteUser
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_DeleteUser]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_DeleteUser]
GO

CREATE PROCEDURE [dbo].[sp_DeleteUser]
    @UserId INT
AS
BEGIN
    DELETE FROM Users WHERE UserId = @UserId
END
GO

-- 6. SP: sp_UpdatePassword (Use for Reset Password)
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_UpdatePassword]') AND type in (N'P', N'PC'))
    DROP PROCEDURE [dbo].[sp_UpdatePassword]
GO

CREATE PROCEDURE [dbo].[sp_UpdatePassword]
    @UserId INT,
    @PasswordHash NVARCHAR(MAX)
AS
BEGIN
    UPDATE Users SET PasswordHash = @PasswordHash WHERE UserId = @UserId
END
GO
