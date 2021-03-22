# wikiracer design

## useful links:

[XML Metadata](https://meta.wikimedia.org/wiki/Page_metadata)

[English WikiDumps](https://dumps.wikimedia.org/enwiki/)

## first class features:

- auth with twitch.tv (import avatar and nickname)

- private and public lobbies

- auto complete start/finish selection

- lobby chat (twitch emojis supported etc.)

- stats and ranks

## problem areas:

- underlines and dashes correctly formatted to search db

- do we need to parse our redirects (I.E. how does Anarchist -> Anarchism work?)

- when working through XML - what level of pre-parsing do we need before it hits the db?

- do we return wiki format with wiki parser clientside or a parse it server side and return nested objects to render?

- what happens when a request is made and we can't figure out an article to route to?

- how do the TOC and right hand summaries work for various topics?

- fast searching for autocomplete?

## tech:

- sql server seems the most scalable and obvious choice for hosting the wiki articles (stiffer data model - not gonna change often if at all)

- application insights for logging and dashboards

- cosmos db for auth + ranks + stats (flexible data model and is good for frequent changes)

- redis cache for messaging, lobbies, and game state (extremely fast and handles lots of repeat operations)
