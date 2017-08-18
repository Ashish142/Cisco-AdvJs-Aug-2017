var app = (function(){
	function addSync(x,y){
		console.log(`	[@Service] processing ${x} and ${y}`)
		var result = x + y;
		console.log(`	[@Service] returning the result`);
		return result;
	}

	function addSyncClient(x,y){
		console.log(`[@Consumer] triggering addSync`);
		var result = addSync(x,y);
		console.log(`[@Consumer] result = ${result}`);
	}

	function addAsync(x,y, callback){
		console.log(`	[@Service] processing ${x} and ${y}`)
		setTimeout(function(){
			var result = x + y;
			console.log(`	[@Service] returning the result`);
			if (typeof callback === 'function')
				callback(result);
		}, 4000);
	}

	var addAsyncEvents = (function(){
		var _callbacks = [];

		function subscribe(callback){
			if (typeof callback === 'function')
				_callbacks.push(callback);
		}
		function process(x,y){
			console.log(`	[@Service] processing ${x} and ${y}`)
			setTimeout(function(){
				var result = x + y;
				console.log(`	[@Service] returning the result`);
				_callbacks.forEach(function(callback){
					callback(result);
				})
			}, 4000);
		}
		return{
			subscribe : subscribe,
			process : process
		}
	})();

	function addAsyncClient(x,y){
		console.log(`[@Consumer] triggering addAsync`);
		addAsync(x,y, function(result){
			console.log(`[@Consumer] result = ${result}`);	
		});
		
	}

	return {
		addSyncClient : addSyncClient,
		addAsyncClient : addAsyncClient,
		addAsyncEvents : addAsyncEvents
	}
})();