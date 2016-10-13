SearchApp.controller('peopleCtrl', ['$scope', 'peopleService', function ($scope, peopleService) {

    // Init variables
    $scope.peopleSearch = [];
    $scope.query = {};
    $scope.query.name = [];
    $scope.isEnd = true;

    $scope.tags = [];

    // Methods

    // Search button
    $scope.search = function(){

        // Split the query
        var searchConditionals = $scope.searchQuery.split(/[ ,]+/);

        // Pass the array and check the conditions
        for (var i = 0; i < searchConditionals.length; i++)
        {
            // Check if it's a name (can end with dot)
            if ((/^[a-zA-Z]/.test(searchConditionals[i])) || (/^[a-zA-Z]+\.$/.test(searchConditionals[i]))) {

                $scope.query.name.push(searchConditionals[i]);
            }

            // Check if there is a phone number
            if(/[0-9]+\-[0-9]/.test(searchConditionals[i])) {
                $scope.query.phone = searchConditionals[i];
            }

            // Check if it is a age
            if (/^[0-9]{2}$/.test(searchConditionals[i])) {

                $scope.query.age = parseInt(searchConditionals[i]);
            }
        }

        // Check if the query is defined
        if ($scope.query == {}){$scope.results = [];}

        // Send the query to the server for results and save them
        peopleService.getPeopleByQuery($scope.query).success(function (res) {
            $scope.peopleSearch = res.docs;
            $scope.isEnd = res.isEnd;

            // Calc the age
            $scope.ageCalc();

        }).error(function (error) {
            console.log(error);
        })

        // Clear the search conditions for the next query
        $scope.initQuery();
    }

    $scope.ageCalc = function () {

        // Pass all the ages
        for (var i = 0; i< $scope.peopleSearch.length; i++) {
            $scope.peopleSearch[i].age =
                moment($scope.peopleSearch[i].birthday).fromNow().split('years ago')[0];
        }
    }
    
    $scope.loadMore = function () {

        peopleService.getMorePeopleForQuery().success(function (res) {

            // Add the new array to the current array
            for (var i = 0; i< res.docs.length; i++) {
                $scope.peopleSearch.push(res.docs[i]);
            }
            $scope.isEnd = res.isEnd;

            // Calc the age
            $scope.ageCalc();
        }).error(function (error) {
            console.log(error);
        })
    }

    $scope.initQuery = function () {
        $scope.query = {};
        $scope.query.name = [];
        $scope.query.age = undefined;
        $scope.query.phone = undefined;
    }

}]);