On load we check local storage for a user object

if exists we bypass the login prompts and take straight to lobbies

- then add it to the auth state manager

if not exist bring them to home and prompt

- guest login mints a token valid anywhere a normal user token is

logout does both oidc-client and removes from our store
redirect to main page after logout which should prompt login
