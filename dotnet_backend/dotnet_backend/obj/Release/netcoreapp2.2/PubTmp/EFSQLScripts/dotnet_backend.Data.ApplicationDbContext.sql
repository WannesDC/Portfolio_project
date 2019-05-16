IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetRoles] (
        [Id] nvarchar(450) NOT NULL,
        [Name] nvarchar(256) NULL,
        [NormalizedName] nvarchar(256) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetUsers] (
        [Id] nvarchar(450) NOT NULL,
        [UserName] nvarchar(256) NULL,
        [NormalizedUserName] nvarchar(256) NULL,
        [Email] nvarchar(256) NULL,
        [NormalizedEmail] nvarchar(256) NULL,
        [EmailConfirmed] bit NOT NULL,
        [PasswordHash] nvarchar(max) NULL,
        [SecurityStamp] nvarchar(max) NULL,
        [ConcurrencyStamp] nvarchar(max) NULL,
        [PhoneNumber] nvarchar(max) NULL,
        [PhoneNumberConfirmed] bit NOT NULL,
        [TwoFactorEnabled] bit NOT NULL,
        [LockoutEnd] datetimeoffset NULL,
        [LockoutEnabled] bit NOT NULL,
        [AccessFailedCount] int NOT NULL,
        CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Users] (
        [UserId] int NOT NULL IDENTITY,
        [FirstName] nvarchar(50) NOT NULL,
        [LastName] nvarchar(50) NOT NULL,
        [Email] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetRoleClaims] (
        [Id] int NOT NULL IDENTITY,
        [RoleId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetUserClaims] (
        [Id] int NOT NULL IDENTITY,
        [UserId] nvarchar(450) NOT NULL,
        [ClaimType] nvarchar(max) NULL,
        [ClaimValue] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetUserLogins] (
        [LoginProvider] nvarchar(450) NOT NULL,
        [ProviderKey] nvarchar(450) NOT NULL,
        [ProviderDisplayName] nvarchar(max) NULL,
        [UserId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
        CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetUserRoles] (
        [UserId] nvarchar(450) NOT NULL,
        [RoleId] nvarchar(450) NOT NULL,
        CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
        CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [AspNetUserTokens] (
        [UserId] nvarchar(450) NOT NULL,
        [LoginProvider] nvarchar(450) NOT NULL,
        [Name] nvarchar(450) NOT NULL,
        [Value] nvarchar(max) NULL,
        CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
        CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Portfolios] (
        [Id] int NOT NULL IDENTITY,
        [Name] nvarchar(25) NOT NULL,
        [Description] nvarchar(max) NULL,
        [IdOfUser] int NOT NULL,
        CONSTRAINT [PK_Portfolios] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Portfolios_Users_IdOfUser] FOREIGN KEY ([IdOfUser]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Contact] (
        [Id] int NOT NULL IDENTITY,
        [Email] nvarchar(max) NULL,
        [Name] nvarchar(max) NULL,
        [Surname] nvarchar(max) NULL,
        [Street] nvarchar(max) NULL,
        [City] nvarchar(max) NULL,
        [Country] nvarchar(max) NULL,
        [PostalCode] int NOT NULL,
        [BirthDate] datetime2 NOT NULL,
        [PortfolioId] int NOT NULL,
        CONSTRAINT [PK_Contact] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Contact_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Education] (
        [Id] int NOT NULL IDENTITY,
        [Institute] nvarchar(max) NULL,
        [Link] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [Course] nvarchar(max) NULL,
        [StartYear] datetime2 NOT NULL,
        [EndYear] datetime2 NOT NULL,
        [Position] int NOT NULL,
        [PortfolioId] int NOT NULL,
        CONSTRAINT [PK_Education] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Education_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Experience] (
        [Id] int NOT NULL IDENTITY,
        [Company] nvarchar(max) NULL,
        [JobPos] nvarchar(max) NULL,
        [Link] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [StartYear] datetime2 NOT NULL,
        [EndYear] datetime2 NOT NULL,
        [Position] int NOT NULL,
        [PortfolioId] int NOT NULL,
        CONSTRAINT [PK_Experience] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Experience_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Resume] (
        [PortfolioId] int NOT NULL,
        [PDF] varbinary(max) NOT NULL,
        [Extension] nvarchar(max) NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_Resume] PRIMARY KEY ([PortfolioId]),
        CONSTRAINT [FK_Resume_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Skill] (
        [Id] int NOT NULL IDENTITY,
        [Type] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [IconPath] nvarchar(max) NULL,
        [Position] int NOT NULL,
        [PortfolioId] int NOT NULL,
        CONSTRAINT [PK_Skill] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Skill_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [UserImage] (
        [PortfolioId] int NOT NULL,
        [Image] varbinary(max) NOT NULL,
        [Extension] nvarchar(max) NOT NULL,
        [FileName] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_UserImage] PRIMARY KEY ([PortfolioId]),
        CONSTRAINT [FK_UserImage_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE TABLE [Work] (
        [Id] int NOT NULL IDENTITY,
        [WorkName] nvarchar(max) NULL,
        [Description] nvarchar(max) NULL,
        [TimePublished] datetime2 NOT NULL,
        [Link] nvarchar(max) NULL,
        [ImagePath] nvarchar(max) NULL,
        [Position] int NOT NULL,
        [PortfolioId] int NOT NULL,
        CONSTRAINT [PK_Work] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Work_Portfolios_PortfolioId] FOREIGN KEY ([PortfolioId]) REFERENCES [Portfolios] ([Id]) ON DELETE CASCADE
    );
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE UNIQUE INDEX [IX_Contact_PortfolioId] ON [Contact] ([PortfolioId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_Education_PortfolioId] ON [Education] ([PortfolioId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_Experience_PortfolioId] ON [Experience] ([PortfolioId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE UNIQUE INDEX [IX_Portfolios_IdOfUser] ON [Portfolios] ([IdOfUser]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_Skill_PortfolioId] ON [Skill] ([PortfolioId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    CREATE INDEX [IX_Work_PortfolioId] ON [Work] ([PortfolioId]);
END;

GO

IF NOT EXISTS(SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = N'20190516183447_InitialCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20190516183447_InitialCreate', N'2.2.2-servicing-10034');
END;

GO

