var products = [
	{id : 5, name : 'Pen', cost : 60, units : 40, category : 'stationary'},
	{id : 9, name : 'Len', cost : 40, units : 30, category : 'grocery'},
	{id : 7, name : 'Ten', cost : 80, units : 80, category : 'grocery'},
	{id : 3, name : 'Den', cost : 50, units : 70, category : 'stationary'},
	{id : 6, name : 'Zen', cost : 60, units : 50, category : 'stationary'},
];

//Sort, Filter, GroupBy

function describe(title, fn){
	console.group(title);
	fn();
	console.groupEnd();
}


describe('Default List', function(){
	console.table(products);
});

describe("Sorting", function(){
	describe("Default sort [products by id]", function(){
		function sort(){
			for(var i=0; i < products.length-1; i++)
				for(var j=i+1; j < products.length; j++)
					if (products[i].id > products[j].id){
						var temp = products[i];
						products[i] = products[j];
						products[j] = temp;
					}
		}
		sort();
		console.table(products);
	});

	describe("Sort by any attribute", function(){
		function sort(list, attrName){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (list[i][attrName] > list[j][attrName]){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}
		describe('Products by cost', function(){
			sort(products, 'cost');
			console.table(products);
		});

		describe('Products by units', function(){
			sort(products, 'units');
			console.table(products);
		});
	});

	describe("Sort by any comparer", function(){
		function sort(list, comparerFn){
			for(var i=0; i < list.length-1; i++)
				for(var j=i+1; j < list.length; j++)
					if (comparerFn(list[i], list[j]) > 0 ){
						var temp = list[i];
						list[i] = list[j];
						list[j] = temp;
					}
		}
		function getDescending(comparerFn){
			return function(){
				return comparerFn.apply(this, arguments) * -1;
			}
		}
		var productComparerByValue = function(p1, p2){
			var p1Value = p1.cost * p1.units,
				p2Value = p2.cost * p2.units;
			if (p1Value < p2Value) return -1;
			if (p1Value > p2Value) return 1;
			return 0;
		}
		describe('Products by value [ cost * units ]', function(){
			
			sort(products, productComparerByValue);
			console.table(products);
		});

		describe('Products by value [ cost * units ] descending', function(){
			var descendingProductComparerByValue = getDescending(productComparerByValue);
			sort(products, descendingProductComparerByValue);
			console.table(products);
		});

		
	});
});

describe('Filtering', function(){
	describe('All costly products [ cost > 50 ]', function(){
		function filterCostlyProducts(){
			var result = [];
			for(var index=0; index < products.length; index++){
				if (products[index].cost > 50)
					result.push(products[index]);
			}
			return result;
		}
		var costlyProducts = filterCostlyProducts();
		console.table(costlyProducts);
	});

	describe('Filter any list by any criteria', function(){
		function filter(list, criteriaFn){
			var result = [];
			for(var index=0; index < list.length; index++){
				if (criteriaFn(list[index]))
					result.push(list[index]);
			}
			return result;
		}
		function negate(criteriaFn){
			return function(){
				return !criteriaFn.apply(this, arguments);
			}
		}


		describe('Products by category', function(){
			describe('All stationary products', function(){
				var stationaryProductCriteria = function(product){
					return product.category === 'stationary';
				};
				var stationaryProducts = filter(products, stationaryProductCriteria);
				console.table(stationaryProducts);
			});
		});

		describe('Products by cost', function(){
			var costlyProductCriteria = function(product){
				return product.cost > 50;
			}
			describe('All costly produycts', function(){
				var costlyProducts = filter(products, costlyProductCriteria);
				console.table(costlyProducts);
			});
			describe('All affordable products', function(){
				/*var affordableProductCriteria = function(product){
					return !costlyProductCriteria(product);
				}*/
				var affordableProductCriteria = negate(costlyProductCriteria);
				var affordableProducts = filter(products, affordableProductCriteria);
				console.table(affordableProducts);
			});
		});

		describe('Products by units', function(){
			var understockedProductCriteria = function(product){
				return product.units < 50;
			};
			describe('All understocked products', function(){
				var understockedProducts = filter(products, understockedProductCriteria);
				console.table(understockedProducts);
			});
			describe('Well understocked products', function(){
				/*var wellstockedProductCriteria = function(product){
					return !understockedProductCriteria(product);
				};*/
				var wellstockedProductCriteria = negate(understockedProductCriteria);
				var wellstockedProducts = filter(products, wellstockedProductCriteria);
				console.table(wellstockedProducts);
			});
		});
	})

});