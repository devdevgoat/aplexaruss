var startMovie= function(app, options, response) {
    if(!options.spokenShowName) {
        return Q.reject(new Error('startMovie must be provided with a spokenShowName option'));
    }
    if(!options.playerName) {
        return Q.reject(new Error('startMovie must be provided with a playerName option'));
    }

    var playerName = options.playerName;
    var spokenShowName = options.spokenShowName;

    var responseSpeech;
    var matchConfidence;

    return getlistOfMovies(app, app.user.MovieLibrary).then(function(listOfMovies) {
        console.log('listOfMovies=',util.inspect(listOfMovies.MediaContainer));
        var bestMovieMatch = getShowFromSpokenName(spokenShowName, listOfMovies.MediaContainer.Metadata);
        console.log(util.inspect(bestMovieMatch));
        var movie = bestMovieMatch.bestMatch;
        matchConfidence = bestMovieMatch.confidence;

        if (!movie) {
            // Show name not found
            console.warn("Movie requested not found: " + spokenShowName);
            response.say("Sorry, I couldn't find that movie in your library");
            return Q.resolve();
        }

            var episode;
            var viewOffset = 0;
            console.log('All Movies = ',allEpisodes);
           
           response.card('Playing Movie ' + movie.title);

            if (matchConfidence >= app.CONFIDICE_CONFIRM_THRESHOLD) {
                response.say(responseSpeech);
                return playMedia(app, {
                    playerName: playerName, // TODO! this is no longer respected and should be removed. Eventually player selection on each request will be supported
                    mediaKey: episode.key,
                    offset: viewOffset
                });
            } else {
                console.log('confidence: ' , matchConfidence);
                response.session('promptData', {
                    yesAction  : 'startEpisode',
                    yesResponse: responseSpeech,
                    noResponse : 'Oh. Sorry about that.',
                    noAction   : 'endSession',
                    mediaKey   : episode.key,
                    mediaOffset : viewOffset,
                });
                response.shouldEndSession(false);
                return response.say('You would like to watch an episode of ' + episode.grandparentTitle + '. Is that correct?');
            }
    }).catch(function(err) {
        return Q.reject(err);
    });
};