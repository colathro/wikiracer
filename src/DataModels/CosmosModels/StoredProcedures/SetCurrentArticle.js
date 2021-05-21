// SetCurrentArticle STORED PROCEDURE
function sample(lobbyKey, userId, articleKey) {
  var collection = getContext().getCollection();
  var collectionLink = collection.getSelfLink();
  var response = getContext().getResponse();

  // Query documents and take 1st item.
  var query = {query: "SELECT * FROM lobbies l WHERE l.Key = @key", parameters: [{name: "@key", value: lobbyKey}]};

  var isAccepted = collection.queryDocuments(collectionLink, query, function (err, documents, responseOptions) {
      if (err) throw err;

      if (documents.length > 0) {
          tryUpdate(documents[0], userId, articleKey);
      } else {
          throw new Error("Lobby not found.");
      }
  });

  function tryUpdate(document, userId, articleKey) {
      var requestOptions = {etag: document._etag};

      document.Players.every(player => {
          if (player.Id == userId) {
              player.CurrentArticle = articleKey;
              return false;
          } else {
              return true;
          }
      });

      var isAccepted = collection.replaceDocument(document._self, document, requestOptions, function (err, updatedDocument, responseOptions) {
          if (err) throw err;
          response.setBody(updatedDocument);
      });
  }
}