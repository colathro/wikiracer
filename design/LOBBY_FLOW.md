Lobby:

Id: unique guid # unique identifier
Key: string # key to join
Owner: User # owner of lobby, only user who can change stuff and kick
Started: bool # whether the game is running
EndTime: DateTime # time the round ends
StartArticle: string # start article key
EndArticle: string # end article key
Users: UserStatus[] # List of UserStatus objects
ChatEnabled: bool # whether chat is enabled or not
Public: bool # whether the lobby shows in the menu or not
Banned: string[] # user keys that are muted

UserStatus:

Id: unique guid # unique user to the lobby
User: User # the user object
CurrentArticle: string # current article the user is on
ArticleHistory: string[] # history the user navigated to (pushed/pop)

ChatMessage:
User: User # User who sent message
Message: string # 140 character limit
