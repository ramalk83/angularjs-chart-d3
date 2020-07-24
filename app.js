/*global angular, d3 */
 
angular.module ('charts', [])
 
.controller('MainCtrl', function($scope) {
  $scope.data = [
		{
			name : "Blue",
			value : 10,
			color : "#4a87ee"
		},
		{
			name : "Green",
			value : 40,
			color : "#66cc33"
		},
		{
			name : "Orange",
			value : 70,
			color : "#f0b840"
		},
		{
			name : "Red",
			value : 2,
			color : "#ef4e3a"
		}
	];
})
 
.directive ("pieChart", function () {
	return {
		restrict : "A",
		scope : {
			data : "="
		},
		link : function (scope, element) {
			var width,
				height,
				radius,
				pie,
				arc,
				svg,
				path;
 
			width = element[0].clientWidth;
			height = element[0].clientHeight;
			radius = Math.min (width, height) / 2;
 
			pie = d3.layout.pie ()
					.value (function (d) {return d.value;})
					.sort (null);
 
			arc = d3.svg.arc ()
					.outerRadius (radius - 20)
					.innerRadius (radius - 80);
 
			svg = d3.select (element[0])
					.append ("svg")
					.attr ({width : width, height : height})
					.append ("g")
					.attr ("transform", "translate(" + width * 0.5 + "," + height * 0.5 + ")");
 
			path = svg.datum (scope.data)
					.selectAll ("path")
					.data (pie)
					.enter ()
					.append ("path")
					.attr ({
						fill : function (d, i) {return scope.data [i].color;},
						d : arc
					});
				
			scope.$watch (
				"data",
				function () {
					pie.value (function (d) {return d.value;});
					path = path.data(pie);
					path.attr ("d", arc);
				},
				true
			);
		}
	};
})
 
.directive ("lineChart", function () {
	return {
		restrict : "A",
		scope : {
			data : "="
		},
		link : function (scope, element) {
			var vis;
			var width;
			var height;
			var margin;
			var xRange;
			var yRange;
			var xAxis;
			var yAxis;
			var lineFunc;
 
			element.addClass ('line-chart');
  
      width = element [0].clientWidth;
			height = element [0].clientHeight;
			margin = 35;
			
			vis = d3.select (element[0])
					.append ("svg")
					.attr ({width : width, height : height});
 
			xRange = d3.scale.linear ()
						.range ([margin, width - margin])
						.domain ([0,3]);
 
			xAxis = d3.svg.axis ()
						.scale (xRange)
						.tickValues([]);
 
			vis.append ("svg:g")
				.attr ("class", "x axis")
				.attr ("transform", "translate(0," + (height - margin) + ")")
				.call (xAxis);
 
			yRange = d3.scale.linear ()
						.range ([height - margin, margin])
						.domain ([0, 100]);
			
			yAxis = d3.svg.axis()
						.scale(yRange)
						.tickValues([])
						.orient("left");
 
			vis.append ("svg:g")
				.attr ("class", "y axis")
				.attr ("transform", "translate(" + (margin) + ",0)")
				.call (yAxis);
 
			lineFunc = d3.svg.line ()
				.x (function (d, i) {return xRange (i);})
				.y (function (d) {return yRange (d.value);})
				.interpolate ('cardinal');
 
			var path = vis.append ("svg:path")
				.attr ("d", lineFunc (scope.data))
				.attr ("stroke", "black")
				.attr ("stroke-width", 1)
				.attr ("fill", "none");
 
			var circle = vis.selectAll ("circle")
							.data (scope.data);
 
			circle.enter ().append ("circle")
				.attr ("cx", function (d, i) {return i * ((width - margin*2)/3) + margin;})
				.attr ("cy", function (d) {return height - margin - (d.value/100)*height;})
				.attr ("r", 10)
				.style ("fill", function (d) {return d.color;});
 
			scope.$watch (
				"data",
				function () {
					path.attr ("d", lineFunc (scope.data));
 
					vis.selectAll ("circle")
						.attr ("cy", function (d) {return height - margin - (d.value/100)*(height-margin*2);});
				},
				true
			);
		}
	};
});