// SetStartEndArticle STORED PROCEDURE
function SetStartEndArticle(lobbyKey, startArticleKey, endArticleKey) {
  var collection = getContext().getCollection();
  var collectionLink = collection.getSelfLink();
  var response = getContext().getResponse();

  // Query documents and take 1st item.
  var query = {query: "SELECT * FROM lobbies l WHERE l.Key = @key", parameters: [{name: "@key", value: lobbyKey}]};

  var isAccepted = collection.queryDocuments(collectionLink, query, function (err, documents, responseOptions) {
    if (err) throw err;

    if (documents.length > 0) {
      tryUpdate(documents[0], startArticleKey, endArticleKey);
    } else {
      throw new Error("Lobby not found.");
    }
  });

  function tryUpdate(document, startArticleKey, endArticleKey) {
    var requestOptions = {etag: document._etag};

    document.StartArticle = startArticleKey;
    document.EndArticleKey = endArticleKey;

    var isAccepted = collection.replaceDocument(document._self, document, requestOptions, function (err, updatedDocument, responseOptions) {
      if (err) throw err;
      response.setBody(updatedDocument);
    });
  }
}