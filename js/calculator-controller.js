function CalculatorController ($scope, $http) {
   
    $scope.data = angular.fromJson(localStorage["data"]);
    var GRADE_POINTS = {'A+': 5.0, 'A': 5.0, 'A-': 4.5, 'B+': 4.0, 'B': 3.5, 'B-': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0.0, 'S': 0.0, 'U': 0.0, 'CS': 0.0, 'CU': 0.0};

    if (!$scope.data) {
        $scope.data = { 'records': [], 'historical_credits': 0, 'historical_grade_points': 0};
        saveRecords();
    }

    function saveRecords() {
        localStorage["data"] = angular.toJson($scope.data);
    }

    $scope.addSemester = function() {
        var sem = {
            'acad_year': '13/14',
            'sem_name': 'Sem 1',
            'modules': [],
            'editing': false
        };
        $scope.data.records.unshift(sem);
        $scope.completeSync();
    };

    $scope.addModule = function(modules) {
        var mod =  {
                    'title': '',
                    'code': '',
                    'credits': 4,
                    'grade': 'S',
                    'editing': true
                };
        $scope.resetAllEditing();
        modules.push(mod);
        $scope.completeSync();
    };

    $scope.resetAllEditing = function() {
        for (var i = 0; i < $scope.data.records.length; i++) {
            $scope.data.records[i].editing = false;
            for (var j = 0; j < $scope.data.records[i].modules.length; j++) {
                $scope.data.records[i].modules[j].editing = false;
            }
        }
    };

    $scope.getCreditsForSem = function(sem, graded) {
        var total = 0;
        for (var j = 0; j < sem.modules.length; j++) {
            if (!graded || (graded && sem.modules[j].grade != 'S' && sem.modules[j].grade != 'U' && sem.modules[j].grade != 'CS' && sem.modules[j].grade != 'CU')) {
                total += parseInt(sem.modules[j].credits);
            }
        }
        return parseInt(total);
    };

    function getGradePointsForSem(sem) {
        var total = 0;
        for (var j = 0; j < sem.modules.length; j++) {
            total += GRADE_POINTS[sem.modules[j].grade] * sem.modules[j].credits;
        }
        return parseFloat(total);
    };

    $scope.getSAPForSem = function(sem) {
        var sap = parseFloat(getGradePointsForSem(sem)/$scope.getCreditsForSem(sem, true));
        if (isNaN(sap)) {
            sap = 0;
        }
        return (Math.ceil(sap * 100)/100).toFixed(2);
    };

    $scope.getTotalCredits = function(records) {
        var total_credits = parseInt($scope.data.historical_grade_points);
        for (var i = 0; i < records.length; i++) {
            total_credits += $scope.getCreditsForSem(records[i], false);
        }
        return total_credits;
    }

    $scope.getCAP = function(records) {
        var total_credits = parseInt($scope.data.historical_credits);
        var total_grade_points = parseInt($scope.data.historical_grade_points);
        for (var i = 0; i < records.length; i++) {
            total_credits += $scope.getCreditsForSem(records[i], true);
            total_grade_points += getGradePointsForSem(records[i]);
        }
        var cap = parseFloat(total_grade_points/total_credits);
        if (isNaN(cap)) {
            cap = 0;
        }
        saveRecords();
        return (Math.ceil(cap * 100)/100).toFixed(2);
    };

    $scope.completeSync = function() {
        saveRecords();
    };

    $http.get('data/mod_op.json').success(function(res) {
        $scope.module_data = res;
        console.log(res);
    });
}