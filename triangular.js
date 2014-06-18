// Generated by CoffeeScript 1.7.1
(function() {
  var umd;

  umd = function(root, factory) {
    if (typeof define === "function" && define.amd) {
      return define(["angular", "d3", "lodash"], factory);
    } else if (typeof exports === "object") {
      return module.exports = factory(require("angular"), require("d3"), require("lodash"));
    } else {
      return root.triangularjs = factory(root.angular, root.d3, root._);
    }
  };

  umd(this, function(angular, d3, _) {
    return angular.module('triangular', []).factory('d3ng', function($rootScope) {
      return {
        animatePath: function(newValue, oldValue, duration, updateFrame) {
          var interpolate, start, step;
          start = null;
          interpolate = d3.interpolateArray(oldValue, newValue);
          step = function(now) {
            var progress;
            if (start == null) {
              start = now;
            }
            progress = now - start;
            if (progress < duration) {
              requestAnimationFrame(step);
              return $rootScope.$apply(function() {
                return updateFrame(interpolate(progress / duration));
              });
            } else {
              return $rootScope.$apply(function() {
                return updateFrame(interpolate(1));
              });
            }
          };
          return requestAnimationFrame(step);
        }
      };
    }).directive("axis", function($parse) {
      return {
        restrict: 'A',
        scope: {
          scale: '=',
          orient: '@',
          ticks: '=',
          tickValues: '=',
          tickSubdivide: '=',
          tickSize: '=',
          tickPadding: '=',
          tickFormat: '@'
        },
        link: function(scope, element) {
          var axis;
          scope.tickFormat = ($parse(scope.tickFormat))({
            d3: d3
          });
          axis = d3.svg.axis();
          scope.$watch("attrs", function() {
            var p, parameters, _i, _len;
            parameters = ['scale', 'orient', 'ticks', 'tickValues', 'tickSubdivide', 'tickSize', 'tickPadding', 'tickFormat'];
            for (_i = 0, _len = parameters.length; _i < _len; _i++) {
              p = parameters[_i];
              if (scope[p]) {
                axis[p](scope[p]);
              }
            }
            return axis(element);
          });
          return scope.$watch('scale.domain()', function() {
            axis.scale(scope.scale);
            return d3.select(element[0]).transition().duration(750).call(axis);
          });
        }
      };
    }).directive("lineChart", function(d3ng) {
      return {
        restrict: "E",
        templateUrl: "template/lineChart.html",
        scope: {
          width: '=',
          height: '=',
          marginLeft: '=',
          marginRight: '=',
          marginTop: '=',
          marginBottom: '=',
          ticksX: '=',
          ticksY: '=',
          textX: '=',
          textY: '=',
          data: '=',
          lineColour: '=',
          lineWidth: '='
        },
        link: function(scope) {
          scope.total_subs_line = "M0,0";
          return scope.$watch("data", function(val, oldVal) {
            var item;
            scope.x = d3.scale.linear().range([0, scope.width - scope.marginLeft - scope.marginRight]);
            scope.y = d3.scale.linear().range([scope.height - scope.marginTop - scope.marginBottom, 0]);
            scope.x.domain(d3.extent(val, function(d, i) {
              return i;
            }));
            scope.y.domain(d3.extent(val, function(d) {
              return d;
            }));
            scope.line = d3.svg.line().x(function(d, i) {
              return scope.x(i);
            }).y(function(d) {
              return scope.y(d);
            }).interpolate("cardinal");
            if (_.some(val, _.isNaN)) {
              return scope.total_subs_line = "M0,0";
            } else if (val) {
              val = val.map(Math.round);
              oldVal = (function() {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = oldVal.length; _i < _len; _i++) {
                  item = oldVal[_i];
                  _results.push(item ? item : 0);
                }
                return _results;
              })();
              return d3ng.animatePath(val, oldVal, 750, function(value) {
                return scope.total_subs_line = scope.line(value);
              });
            } else {
              return console.warn("not implemented", val);
            }
          });
        }
      };
    }).directive('svgDraggable', function($document) {
      return function(scope, element, attr) {
        var mousemove, mouseup, node, startX, startY, svgRootX, svgRootY, x, y;
        startX = 0;
        startY = 0;
        x = 0;
        y = 0;
        svgRootX = 0;
        svgRootY = 0;
        node = {};
        element.on('mousedown', function(event) {
          event.preventDefault();
          node = scope.$parent.nodes[scope.$index];
          svgRootX = node.cx;
          svgRootY = node.cy;
          startX = event.screenX;
          startY = event.screenY;
          $document.on('mousemove', mousemove);
          return $document.on('mouseup', mouseup);
        });
        mousemove = function(event) {
          x = event.screenX - startX;
          y = event.screenY - startY;
          node.cx = x + svgRootX;
          node.cy = y + svgRootY;
          return scope.$parent.$parent.$digest();
        };
        return mouseup = function() {
          $document.off('mousemove', mousemove);
          return $document.off('mouseup', mouseup);
        };
      };
    }).directive('svgDraggableX', function($document) {
      return function(scope, element, attr) {
        var mousemove, mouseup, node, startX, svgRootX, x, y;
        startX = 0;
        x = 0;
        y = 0;
        svgRootX = 0;
        node = {};
        element.on('mousedown', function(event) {
          event.preventDefault();
          node = scope.$parent.nodes[scope.$index];
          svgRootX = node.cx;
          startX = event.screenX;
          $document.on('mousemove', mousemove);
          return $document.on('mouseup', mouseup);
        });
        mousemove = function(event) {
          x = event.screenX - startX;
          node.cx = x + svgRootX;
          return scope.$parent.$parent.$digest();
        };
        return mouseup = function() {
          $document.off('mousemove', mousemove);
          return $document.off('mouseup', mouseup);
        };
      };
    }).directive('svgDraggableY', function($document) {
      return function(scope, element, attr) {
        var mousemove, mouseup, node, startY, svgRootY, y;
        startY = 0;
        y = 0;
        svgRootY = 0;
        node = {};
        element.on('mousedown', function(event) {
          event.preventDefault();
          node = scope.$parent.nodes[scope.$index];
          svgRootY = node.cy;
          startY = event.screenY;
          $document.on('mousemove', mousemove);
          return $document.on('mouseup', mouseup);
        });
        mousemove = function(event) {
          y = event.screenY - startY;
          node.cy = y + svgRootY;
          return scope.$parent.$parent.$digest();
        };
        return mouseup = function() {
          $document.off('mousemove', mousemove);
          return $document.off('mouseup', mouseup);
        };
      };
    });
  });

}).call(this);

//# sourceMappingURL=triangular.map
