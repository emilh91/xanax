var app = angular.module('NP2D_App', []);

app.service('dataService', function($http) {
    var svc = {};
    svc.getPlayers = function() {
        return $http.get('/players').then(function(result) {
            return result.data;
        });
    };
    svc.getIntel = function() {
        return $http.get('/intel').then(function(result) {
            return result.data;
        });
    };
    return svc;
});

app.controller('NP2D_Chart', function($scope, $http) {
    $scope.chart = new CanvasJS.Chart("chartContainer", {
        theme: "theme2",
        axisX: {
            title: "Tick",
            labelAngle: -30,
            interval: 6
        },
        legend:{
            verticalAlign: "top",
            horizontalAlign: "centre",
            fontSize: 18
        },
        data: []
    });
    
    $scope.markers = [
        { markerType:'circle', color:'blue' },
        { markerType:'circle', color:'teal' },
        { markerType:'circle', color:'green' },
        { markerType:'circle', color:'yellow' },
        { markerType:'circle', color:'orange' },
        { markerType:'circle', color:'red' },
        { markerType:'circle', color:'violet' },
        { markerType:'circle', color:'blueviolet' },
        { markerType:'square', color:'blue' },
        { markerType:'square', color:'teal' },
        { markerType:'square', color:'green' },
        { markerType:'square', color:'yellow' },
        { markerType:'square', color:'orange' },
        { markerType:'square', color:'red' },
        { markerType:'square', color:'violet' },
        { markerType:'square', color:'blueviolet' },
        { markerType:'triangle', color:'blue' },
        { markerType:'triangle', color:'teal' },
        { markerType:'triangle', color:'green' },
        { markerType:'triangle', color:'yellow' },
        { markerType:'triangle', color:'orange' },
        { markerType:'triangle', color:'red' },
        { markerType:'triangle', color:'violet' },
        { markerType:'triangle', color:'blueviolet' },
    ];
    
    $scope.criteria = [
        { field:'ts', title:'Stars', },
        { field:'sh', title:'Ships', },
        { field:'fl', title:'Carriers', },

        { field:'sy', title:'Ship Yield', alt:'Ships Per Hour: IND*(MNF+5)/24', callback: function(pl) {return pl.i*(pl.mt+5)/24;} },
        { field:'cy', title:'Credit Yield', alt:'Credits Per Galactic Cycle: ECO*10+BNK*75', callback: function(pl) {return pl.e*10 + pl.bt*75;} },

        { field:'e',  title:'Total Economy', },
        { field:'i',  title:'Total Industry', },
        { field:'s',  title:'Total Science', },

        { field:'st', title:'Scanning Level', },
        { field:'ht', title:'Hyperspace Range Level', },
        { field:'tt', title:'Terraforming Level', },
        { field:'gt', title:'Experimentation Level', },
        { field:'wt', title:'Weapons Level', },
        { field:'bt', title:'Banking Level', },
        { field:'mt', title:'Manufacturing Level', },
    ];
    
    $scope.getDataPointsFor = function(playerIdx) {
        var criterion = $scope.criteria[$scope.fieldIndex];
        var datapoints = [];
        for (var i in $scope.stats) {
            var ti = $scope.stats[i];
            var player = ti.players[playerIdx];
            var dp = {
                x: ti.tick,
                y: player.hasOwnProperty(criterion.field) ? player[criterion.field] : criterion.callback(player),
            };
            datapoints.push(dp);
        }
        return {
            type: 'line',
            markerType: $scope.markers[playerIdx].markerType,
            color: $scope.markers[playerIdx].color,
            dataPoints: datapoints.reverse(),
        };
    }
    
    $scope.changeCriterion = function(fieldIndex) {
        $scope.fieldIndex = fieldIndex;
        $scope.updateChart();
    }
    
    $scope.togglePlayer = function(playerIndex) {
        var idx = $scope.playerIndexes.indexOf(playerIndex);
        if (idx == -1) {
            $scope.playerIndexes.push(playerIndex);
        }
        else {
            $scope.playerIndexes.splice(idx, 1);
        }
        $scope.updateChart();
    }
    
    $scope.updateChart = function() {
        var data = [];
        for (var i in $scope.playerIndexes) {
            var idx = $scope.playerIndexes[i];
            data.push($scope.getDataPointsFor(idx));
        }
        
        $scope.chart.options.axisY = {
            title: $scope.criteria[$scope.fieldIndex].title,
        };
        $scope.chart.options.data = data;
        $scope.chart.render();
    }
    
    var gameid = document.location.href.split('/').slice(-1)[0].split('#')[0];
    $http.get('/'+gameid+'/intel').success(function(data) {
        $scope.stats = data.report.stats;
        $scope.fieldIndex = 0;
        $scope.playerIndexes = [];
        $scope.updateChart();
    });
});

app.controller('NP2D_Table', function($scope, $http) {
    $scope.sortField = 'total_stars';
    $scope.sortDesc = true;
    
    var categories = [
        {
            name: 'General',
            fields: [
                { name: 'UID', sortField:'uid', title:'Player ID' },
                { name: 'Name', sortField:'alias', title:'Player Name' },
            ]
        },
        {
            name: 'Empire',
            fields: [
                { name: 'Stars', sortField:'total_stars', title:'# Of Stars' },
                { name: 'Ships', sortField:'total_strength', title:'# Of Ships' },
                { name: 'Carriers', sortField:'total_fleets', title:'# Of Carriers' },
            ]
        },
        {
            name: 'Yield',
            fields: [
                { name: 'Ships', sortField:'sph', title:'Ships Per Hour: IND*(MNF+5)/24' },
                { name: 'Credits', sortField:'cpc', title:'Credits Per Galactic Cycle: ECO*10+BNK*75' },
            ]
        },
        {
            name: 'Infrastructure',
            fields: [
                { name: 'ECO', sortField:'total_economy', title:'Total Economy' },
                { name: 'IND', sortField:'total_industry', title:'Total Industry' },
                { name: 'SCI', sortField:'total_science', title:'Total Science' },
            ]
        },
        {
            name: 'Technology',
            fields: [
                { name: 'SCN', sortField:'tech.scanning.level', title:'Scanning Level' },
                { name: 'HYP', sortField:'tech.propulsion.level', title:'Hyperspace Range Level' },
                { name: 'TRF', sortField:'tech.terraforming.level', title:'Terraforming Level' },
                { name: 'EXP', sortField:'tech.research.level', title:'Experimentation Level' },
                { name: 'WPN', sortField:'tech.weapons.level', title:'Weapons Level' },
                { name: 'BNK', sortField:'tech.banking.level', title:'Banking Level' },
                { name: 'MNF', sortField:'tech.manufacturing.level', title:'Manufacturing Level' },
            ]
        },
    ];
    $scope.categories = categories;
    
    var fields = []
    for (var i in categories) {
        for (var j in categories[i].fields) {
            fields.push(categories[i].fields[j])
        }
    }
    $scope.fields = fields;
    
    var gameid = document.location.href.split('/').slice(-1)[0].split('#')[0];
    $http.get('/'+gameid+'/state/latest').success(function(data) {
        var players = [];
        for (var i in data.report.players) {
            var pl = data.report.players[i];
            pl.sph = $scope.shipsPerHour(pl);
            pl.cpc = $scope.creditsPerCycle(pl);
            players.push(pl);
        }
        //$scope.viewWRT(players[0]);
        $scope.viewWRT(players[data.report.player_uid]);
        $scope.admin = players[data.report.admin];
        $scope.players = players;
    });
    
    $scope.sortBy = function(field) {
        if ($scope.sortField == field) {
            $scope.sortDesc = !$scope.sortDesc;
        }
        else {
            $scope.sortDesc = field!=='alias' && field!='uid';
        }
        
        $scope.sortField = field;
    }
    
    $scope.triangleClass = function() {
        var cl = 'pull-right glyphicon glyphicon-triangle-';
        var dir = $scope.sortDesc ? 'bottom' : 'top';
        return cl+dir;
    }
    
    $scope.shipsPerHour = function(player) {
        var ind = player.total_industry;
        var mnf = player.tech.manufacturing.level;
        return ind * (mnf + 5) / 24; // TODO Do not hardcode production rate
    }
    
    $scope.creditsPerCycle = function(player) {
        var eco = player.total_economy;
        var bnk = player.tech.banking.level;
        return eco*10 + bnk*75;
    }
    
    $scope.viewWRT = function(player) {
        $scope.wrt = player;
    }
    
    $scope.ringClassFor = function(player) {
        return 'ring pci_48_'+player.uid;
    }
    
    $scope.playerNameClassFor = function(player) {
        var cl = 'player';
        if (player.ai) cl += ' player-ai';
        return cl;
    }
    
    $scope.statClassFor = function(player, fieldStr) {
        var thisVal = $scope.resolve($scope.wrt, fieldStr);
        var thatVal = $scope.resolve(player, fieldStr);
        if (thisVal > thatVal) return 'label label-success';
        if (thisVal < thatVal) return 'label label-danger';
        return 'label label-default';
    }
    
    $scope.readyTitleFor = function(player) {
        if (player.ai) return 'This player is an AI and is ready by default.';
        if (player.ready) return 'This player has submitted his/her turn.';
        return '';
    }
    
    // TODO Move elsewhere
    $scope.resolve = function(object, fieldStr) {
        var val = object;
        var fields = fieldStr.split('.');
        for (var i in fields) {
            var f = fields[i];
            val = val[f];
        }
        return val;
    }
});
