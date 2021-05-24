/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "5226e9a5bf43c2b08d9d"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(4)(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _require = __webpack_require__(6),
    getCookie = _require.getCookie,
    setCookie = _require.setCookie;

var COLOR_MODE_COOKIE_NAME = exports.COLOR_MODE_COOKIE_NAME = 'color-mode';

var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

var faviconDarkModeSrc = '/favicon-dark.ico';
var faviconLightModeSrc = '/favicon.ico';

var setFavicon = function setFavicon(darkModeOn) {
  var link = document.querySelector("link[rel*='icon']");
  link.href = darkModeOn ? faviconDarkModeSrc : faviconLightModeSrc;
};

var getIsSystemDarkMode = function getIsSystemDarkMode() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

var getColorMode = exports.getColorMode = function getColorMode() {
  if (getCookie(COLOR_MODE_COOKIE_NAME)) {
    return getCookie(COLOR_MODE_COOKIE_NAME);
  }

  return 'auto';
};

var setClassNameOnBody = function setClassNameOnBody() {
  if (getColorMode() === 'dark' || getColorMode() === 'auto' && getIsSystemDarkMode()) {
    document.getElementsByTagName('body')[0].classList.add('prefers-dark');
  } else if (getColorMode() === 'light' || getColorMode() === 'auto' && !getIsSystemDarkMode()) {
    document.getElementsByTagName('body')[0].classList.remove('prefers-dark');
  }
};

var setColorMode = exports.setColorMode = function setColorMode(colorMode) {
  setCookie(COLOR_MODE_COOKIE_NAME, colorMode);
  setClassNameOnBody();
};

darkModeMediaQuery.addListener(function (e) {
  setFavicon(e.matches);

  if (getColorMode() === 'auto') {
    setColorMode();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  setFavicon(window.matchMedia('(prefers-color-scheme: dark)').matches);
  setClassNameOnBody();
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(14);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(5);

__webpack_require__(1);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(9);

__webpack_require__(10);

__webpack_require__(24);

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setCookie = setCookie;
exports.getCookie = getCookie;
/* eslint-disable */

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable indent */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-new */

var zoomEnum = Object.freeze({
  fit: 1,
  zoom: 2,
  full: 3,
  fill: 4
});

var ImageFocus = function () {
  function ImageFocus(el, src, caption) {
    _classCallCheck(this, ImageFocus);

    this.element = el;
    this.src = src;
    this.caption = caption;
    this.zoomMode = zoomEnum.fit;

    this.setup();
    this.createOverlay();
    this.attachEvents();
  }

  _createClass(ImageFocus, [{
    key: 'setup',
    value: function setup() {
      this.element.classList.add('is-focusable');
    }
  }, {
    key: 'createOverlay',
    value: function createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.classList.add('imageFocus');

      this.imageContainer = document.createElement('div');
      this.imageContainer.classList.add('imageFocus_imageContainer');

      var asset = void 0;

      if (this.element.dataset.imageSrc) {
        asset = document.createElement('img');
        asset.classList.add('imageFocus_image');
        asset.src = this.src;
      } else if (this.element.dataset.videoSrc) {
        asset = document.createElement('video');
        asset.setAttribute('autoplay', true);
        asset.setAttribute('muted', true);
        asset.setAttribute('loop', true);
        var videoSrc = document.createElement('source');
        asset.classList.add('imageFocus_image');
        videoSrc.src = this.src;
        asset.appendChild(videoSrc);
      }

      this.closeButton = document.createElement('button');
      this.closeButton.classList.add('imageFocus_close');

      var zoomIndicator = document.createElement('div');
      zoomIndicator.classList.add('image_zoomIndicator');

      this.imageContainer.appendChild(asset);
      this.imageContainer.appendChild(this.closeButton);

      this.sizeTestContainer = document.createElement('div');
      this.sizeTestContainer.classList.add('imageFocus_sizeTestContainer');
      this.sizeTestContainer.appendChild(asset.cloneNode());

      this.overlay.appendChild(this.imageContainer);
      this.overlay.appendChild(this.sizeTestContainer);

      if (this.caption) {
        this.createCaption();
      }

      this.createControls();
      this.configureZoom(this.zoomMode);

      document.body.appendChild(this.overlay);
      this.element.appendChild(zoomIndicator);
    }
  }, {
    key: 'createControls',
    value: function createControls() {
      this.controls = document.createElement('div');
      this.controls.classList.add('imageFocus_controls');

      this.fitButton = document.createElement('button');
      this.zoomButton = document.createElement('button');
      this.fullButton = document.createElement('button');
      this.fillButton = document.createElement('button');

      this.fitButton.classList.add('imageFocus_controlFitButton', 'imageFocus_controlButton');
      this.zoomButton.classList.add('imageFocus_controlZoomButton', 'imageFocus_controlButton');
      this.fullButton.classList.add('imageFocus_controlFullButton', 'imageFocus_controlButton');
      this.fillButton.classList.add('imageFocus_controlCoverButton', 'imageFocus_controlButton');

      this.zoomButton.textContent = 'Zoom';
      this.fitButton.textContent = 'Fit';
      this.fullButton.textContent = '100%';
      this.fillButton.textContent = 'Fill';

      this.controls.appendChild(this.fitButton);
      // this.controls.appendChild(this.zoomButton);
      this.controls.appendChild(this.fillButton);
      this.controls.appendChild(this.fullButton);

      this.overlay.appendChild(this.controls);
    }
  }, {
    key: 'createCaption',
    value: function createCaption() {
      var caption = document.createElement('p');
      caption.textContent = this.caption;
      caption.classList.add('imageFocus_caption');
      this.overlay.appendChild(caption);
    }
  }, {
    key: 'configureZoom',
    value: function configureZoom(zoomMode) {
      this.zoomMode = zoomMode;
      var buttons = Array.prototype.slice.call(this.overlay.querySelectorAll('.imageFocus_controlButton'));

      var elementHeight = this.sizeTestContainer.offsetHeight;
      var elementWidth = this.sizeTestContainer.offsetWidth;

      this.overlay.dataset.aspect = elementHeight > elementWidth ? 'tall' : 'wide';

      buttons.forEach(function (button) {
        button.classList.remove('is-selected');
      });

      if (this.zoomMode === zoomEnum.fit) {
        this.fitButton.classList.add('is-selected');
        this.overlay.dataset.zoomMode = 'fit';
      } else if (this.zoomMode === zoomEnum.zoom) {
        this.zoomButton.classList.add('is-selected');
        this.overlay.dataset.zoomMode = 'zoom';
      } else if (this.zoomMode === zoomEnum.full) {
        this.fullButton.classList.add('is-selected');
        this.overlay.dataset.zoomMode = 'full';
      } else if (this.zoomMode === zoomEnum.fill) {
        this.fillButton.classList.add('is-selected');
        this.overlay.dataset.zoomMode = 'fill';
      }
    }
  }, {
    key: 'attachEvents',
    value: function attachEvents() {
      var that = this;
      this.element.addEventListener('click', function () {
        that.openOverlay();
      });

      window.addEventListener('keyup', function (e) {
        if (e.key === 'Escape') {
          that.closeOverlay();
        }
      });

      this.closeButton.addEventListener('click', function () {
        that.closeOverlay();
      }, true);

      this.zoomButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.zoom));
      this.fullButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.full));
      this.fitButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.fit));
      this.fillButton.addEventListener('click', this.configureZoom.bind(this, zoomEnum.fill));
    }
  }, {
    key: 'openOverlay',
    value: function openOverlay() {
      this.overlay.classList.add('is-open');
      document.getElementsByTagName('html')[0].classList.add('has-open-overlay');
    }
  }, {
    key: 'closeOverlay',
    value: function closeOverlay() {
      this.overlay.classList.remove('is-open');
      document.getElementsByTagName('html')[0].classList.remove('has-open-overlay');
    }
  }]);

  return ImageFocus;
}();

document.querySelectorAll('.js-image-focus').forEach(function (element) {
  var src = element.dataset.imageSrc || element.dataset.videoSrc;
  new ImageFocus(element, src, element.dataset.caption);
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable no-new */
/* eslint-disable no-unused-vars */

var StickyHeader = function () {
  function StickyHeader(el, testElClass) {
    _classCallCheck(this, StickyHeader);

    this.el = el;
    this.hasScrolled = false;
    this.defaultScrollvalue = 300;

    if (testElClass) {
      this.defaultScrollvalue = document.querySelector(testElClass).offsetHeight;
    }

    this.setupScrollEvent();
    this.checkScrollPosition();
  }

  _createClass(StickyHeader, [{
    key: 'setupScrollEvent',
    value: function setupScrollEvent() {
      window.addEventListener('scroll', this.checkScrollPosition.bind(this));
    }
  }, {
    key: 'checkScrollPosition',
    value: function checkScrollPosition() {
      if (window.scrollY > this.defaultScrollvalue && this.hasScrolled === false) {
        this.hasScrolled = true;
        this.setupForScrolled(true);
      } else if (window.scrollY < this.defaultScrollvalue && this.hasScrolled === true) {
        this.hasScrolled = false;
        this.setupForScrolled(false);
      }
    }
  }, {
    key: 'setupForScrolled',
    value: function setupForScrolled(isScrolled) {
      if (isScrolled) {
        this.el.classList.add('is-scrolled');
      } else {
        this.el.classList.remove('is-scrolled');
      }
    }
  }]);

  return StickyHeader;
}();

window.StickyHeader = StickyHeader;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = __webpack_require__(1),
    getColorMode = _require.getColorMode,
    _setColorMode = _require.setColorMode;

var Bulb = function () {
  function Bulb(el) {
    var _this = this;

    _classCallCheck(this, Bulb);

    this.el = el;
    this.button = el.getElementsByClassName('js-bulb-button')[0];
    this.icons = {
      light: el.getElementsByClassName('js-bulb-on')[0],
      dark: el.getElementsByClassName('js-bulb-off')[0],
      auto: el.getElementsByClassName('js-bulb-auto')[0]
    };
    this.setColorMode();

    var darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addListener(function () {
      _this.setColorMode();
    });

    this.button.addEventListener('click', function () {
      if (_this.colorMode === 'dark') {
        _this.setColorMode('light');
      } else if (_this.colorMode === 'light') {
        _this.setColorMode('auto');
      } else {
        _this.setColorMode('dark');
      }
      _this.setColorMode();
    });
  }

  _createClass(Bulb, [{
    key: 'setColorMode',
    value: function setColorMode(colorMode) {
      if (colorMode) {
        this.colorMode = colorMode;
      } else {
        this.colorMode = getColorMode();
      }

      _setColorMode(this.colorMode);

      this.setIconVisible();
    }
  }, {
    key: 'setIconVisible',
    value: function setIconVisible() {
      var _this2 = this;

      Object.keys(this.icons).forEach(function (k) {
        if (k === _this2.colorMode) {
          _this2.icons[k].classList.add('is-visible');
        } else {
          _this2.icons[k].classList.remove('is-visible');
        }
      });
    }
  }]);

  return Bulb;
}();

window.Bulb = Bulb;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _throttle = __webpack_require__(11);

var _throttle2 = _interopRequireDefault(_throttle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var isElementInViewport = function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();

  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};

var SwipeableImage = function () {
  function SwipeableImage(el) {
    _classCallCheck(this, SwipeableImage);

    this.el = el;
    this.handle = el.getElementsByClassName('js-swipe-handle')[0];
    this.swipe = el.getElementsByClassName('js-swipe-item')[0];
    this.swipeChild = this.swipe.getElementsByTagName('div')[0];

    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.throttledHandleScroll = (0, _throttle2.default)(this.handleScroll, 250);

    this.throttledHandleDrag = (0, _throttle2.default)(this.handleDrag, 250);

    this.el.addEventListener('mousemove', this.handleDrag, false);
    this.el.addEventListener('mousedown', this.handleDragStart, false);
    this.el.addEventListener('mouseup', this.handleDragEnd, false);

    this.el.addEventListener('touchstart', this.handleDragStart, false);
    this.el.addEventListener('touchend', this.handleDragEnd, false);
    this.el.addEventListener('touchmove', this.handleDrag, false);

    this.currentX = null;
    this.initialX = null;
    this.xOffset = this.el.clientWidth / 2;
    this.width = this.el.clientWidth;

    this.active = false;
    this.hasAnimated = false;

    if (el.dataset.swipeAnimate) {
      this.setTranslate(20);
      window.addEventListener('scroll', this.throttledHandleScroll);
      window.addEventListener('load', this.handleScroll, { once: true });
    } else {
      this.setTranslate(this.xOffset);
    }
  }

  _createClass(SwipeableImage, [{
    key: 'handleDragStart',
    value: function handleDragStart(e) {
      if (e.type === 'touchstart') {
        this.initialX = e.touches[0].clientX - this.xOffset;
      } else {
        this.initialX = e.clientX - this.xOffset;
      }

      if (e.target === this.handle) {
        this.active = true;
      }
    }
  }, {
    key: 'handleDrag',
    value: function handleDrag(e) {
      if (!this.active) {
        return;
      }

      e.preventDefault();

      if (e.type === 'touchmove') {
        this.currentX = e.touches[0].clientX - this.initialX;
      } else {
        this.currentX = e.clientX - this.initialX;
      }

      this.xOffset = this.currentX;

      this.setTranslate(this.currentX);
    }
  }, {
    key: 'handleDragEnd',
    value: function handleDragEnd() {
      this.initialX = this.currentX;
      this.active = false;
    }
  }, {
    key: 'setTranslate',
    value: function setTranslate(x) {
      var desiredX = x;
      if (desiredX < 0) {
        desiredX = 0;
      }

      if (desiredX > this.width) {
        desiredX = this.width;
      }

      this.swipe.style.transform = 'translateX(' + -(this.width - desiredX) + 'px)';
      this.swipeChild.style.transform = 'translateX(' + (this.width - desiredX) + 'px)';
      this.handle.style.transform = 'translate3d(' + desiredX + 'px, 0, 0)';
    }
  }, {
    key: 'handleScroll',
    value: function handleScroll() {
      if (isElementInViewport(this.el)) {
        window.removeEventListener('scroll', this.throttledHandleScroll);
        this.animate();
      }
    }
  }, {
    key: 'animate',
    value: function animate() {
      var _this = this;

      if (this.hasAnimated) {
        return;
      }

      var startTime = void 0;
      var startOffset = 20;
      var duration = 1000;
      var targetOffset = this.xOffset;

      /* eslint-disable */
      var easeInOutCubic = function easeInOutCubic(t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
      };
      /* eslint-enable */

      if (duration > 0) {
        this.active = false;

        var anim = function anim(timestamp) {
          startTime = startTime || timestamp;
          var elapsed = timestamp - startTime;
          var progress = easeInOutCubic(elapsed, startOffset, targetOffset - startOffset, duration);
          _this.setTranslate(progress);
          if (elapsed < duration) {
            requestAnimationFrame(anim);
          } else {
            _this.setTranslate(targetOffset);
          }
        };
        requestAnimationFrame(anim);
      } else {
        this.setTranslate(targetOffset);
        this.hasAnimated = true;
        this.active = true;
      }
    }
  }]);

  return SwipeableImage;
}();

window.SwipeableImage = SwipeableImage;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var debounce = __webpack_require__(12),
    isObject = __webpack_require__(0);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(0),
    now = __webpack_require__(13),
    toNumber = __webpack_require__(16);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(2);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var baseTrim = __webpack_require__(17),
    isObject = __webpack_require__(0),
    isSymbol = __webpack_require__(19);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var trimmedEndIndex = __webpack_require__(18);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(20),
    isObjectLike = __webpack_require__(23);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3),
    getRawTag = __webpack_require__(21),
    objectToString = __webpack_require__(22);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(3);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 23 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PerspectiveGroup = function PerspectiveGroup(el) {
  var _this = this;

  _classCallCheck(this, PerspectiveGroup);

  if ('ontouchstart' in window) {
    return;
  }

  var parent = el;
  this.foregroundItems = parent.querySelectorAll('.js-perspective-foreground');
  this.backgroundItems = parent.querySelectorAll('.js-perspective-background');
  var range = parent.dataset.perspectiveRange || 40;
  var calcValue = function calcValue(a, b) {
    return (a / b * range - range / 2).toFixed(1);
  };

  var timeout = void 0;

  parent.style.perspective = '1800px';
  parent.style.transformStyle = 'preserve-3d';

  [].forEach.call(this.backgroundItems, function (item) {
    var bgItem = item;
    bgItem.style.transformStyle = 'preserve-3d';
    bgItem.style.perspective = '1200px';
    bgItem.style.transformOrigin = '50% 50%';
  });

  [].forEach.call(this.foregroundItems, function (item) {
    var foregroundItem = item;
    foregroundItem.style.transformOrigin = '50% 50%';
  });

  document.addEventListener('mousemove', function (_ref) {
    var y = _ref.y,
        x = _ref.x;

    if (timeout) {
      window.cancelAnimationFrame(timeout);
    }

    timeout = window.requestAnimationFrame(function () {
      var yValue = calcValue(y, window.innerHeight);
      var xValue = calcValue(x, window.innerWidth);

      [].forEach.call(_this.foregroundItems, function (item) {
        var foregroundItem = item;
        foregroundItem.style.transform = 'translateX(' + xValue + 'px) translateY(' + yValue + 'px)';
      });

      [].forEach.call(_this.backgroundItems, function (item) {
        var bgItem = item;
        bgItem.style.transform = 'rotateX(' + xValue * 1.5 + 'deg) rotateY(' + yValue * 1.5 + 'deg)';
      });
    });
  }, false);
};

window.PerspectiveGroup = PerspectiveGroup;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTIyNmU5YTViZjQzYzJiMDhkOWQiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2RhcmstbW9kZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL19zcmMvaW5kZXguc2NzcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9pbWFnZS1mb2N1cy5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL3N0aWNreS1oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9idWxiLmpzIiwid2VicGFjazovLy8uL19zcmMvc3dpcGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUcmltLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RyaW1tZWRFbmRJbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovLy8uL19zcmMvcGVyc3BlY3RpdmUuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldENvb2tpZSIsInNldENvb2tpZSIsIkNPTE9SX01PREVfQ09PS0lFX05BTUUiLCJkYXJrTW9kZU1lZGlhUXVlcnkiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiZmF2aWNvbkRhcmtNb2RlU3JjIiwiZmF2aWNvbkxpZ2h0TW9kZVNyYyIsInNldEZhdmljb24iLCJkYXJrTW9kZU9uIiwibGluayIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImhyZWYiLCJnZXRJc1N5c3RlbURhcmtNb2RlIiwibWF0Y2hlcyIsImdldENvbG9yTW9kZSIsInNldENsYXNzTmFtZU9uQm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwic2V0Q29sb3JNb2RlIiwiY29sb3JNb2RlIiwiYWRkTGlzdGVuZXIiLCJlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hbWUiLCJ2YWx1ZSIsImRheXMiLCJleHBpcmVzIiwiZGF0ZSIsIkRhdGUiLCJzZXRUaW1lIiwiZ2V0VGltZSIsInRvVVRDU3RyaW5nIiwiY29va2llIiwibmFtZUVRIiwiY2EiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJjIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInpvb21FbnVtIiwiT2JqZWN0IiwiZnJlZXplIiwiZml0Iiwiem9vbSIsImZ1bGwiLCJmaWxsIiwiSW1hZ2VGb2N1cyIsImVsIiwic3JjIiwiY2FwdGlvbiIsImVsZW1lbnQiLCJ6b29tTW9kZSIsInNldHVwIiwiY3JlYXRlT3ZlcmxheSIsImF0dGFjaEV2ZW50cyIsIm92ZXJsYXkiLCJjcmVhdGVFbGVtZW50IiwiaW1hZ2VDb250YWluZXIiLCJhc3NldCIsImRhdGFzZXQiLCJpbWFnZVNyYyIsInZpZGVvU3JjIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJjbG9zZUJ1dHRvbiIsInpvb21JbmRpY2F0b3IiLCJzaXplVGVzdENvbnRhaW5lciIsImNsb25lTm9kZSIsImNyZWF0ZUNhcHRpb24iLCJjcmVhdGVDb250cm9scyIsImNvbmZpZ3VyZVpvb20iLCJib2R5IiwiY29udHJvbHMiLCJmaXRCdXR0b24iLCJ6b29tQnV0dG9uIiwiZnVsbEJ1dHRvbiIsImZpbGxCdXR0b24iLCJ0ZXh0Q29udGVudCIsImJ1dHRvbnMiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiZWxlbWVudFdpZHRoIiwib2Zmc2V0V2lkdGgiLCJhc3BlY3QiLCJmb3JFYWNoIiwiYnV0dG9uIiwidGhhdCIsIm9wZW5PdmVybGF5Iiwia2V5IiwiY2xvc2VPdmVybGF5IiwiYmluZCIsIlN0aWNreUhlYWRlciIsInRlc3RFbENsYXNzIiwiaGFzU2Nyb2xsZWQiLCJkZWZhdWx0U2Nyb2xsdmFsdWUiLCJzZXR1cFNjcm9sbEV2ZW50IiwiY2hlY2tTY3JvbGxQb3NpdGlvbiIsInNjcm9sbFkiLCJzZXR1cEZvclNjcm9sbGVkIiwiaXNTY3JvbGxlZCIsIkJ1bGIiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaWNvbnMiLCJsaWdodCIsImRhcmsiLCJhdXRvIiwic2V0SWNvblZpc2libGUiLCJrZXlzIiwiayIsImlzRWxlbWVudEluVmlld3BvcnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsImJvdHRvbSIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnRFbGVtZW50IiwiY2xpZW50SGVpZ2h0IiwicmlnaHQiLCJpbm5lcldpZHRoIiwiY2xpZW50V2lkdGgiLCJTd2lwZWFibGVJbWFnZSIsImhhbmRsZSIsInN3aXBlIiwic3dpcGVDaGlsZCIsImhhbmRsZURyYWciLCJoYW5kbGVEcmFnRW5kIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlU2Nyb2xsIiwidGhyb3R0bGVkSGFuZGxlU2Nyb2xsIiwidGhyb3R0bGVkSGFuZGxlRHJhZyIsImN1cnJlbnRYIiwiaW5pdGlhbFgiLCJ4T2Zmc2V0Iiwid2lkdGgiLCJhY3RpdmUiLCJoYXNBbmltYXRlZCIsInN3aXBlQW5pbWF0ZSIsInNldFRyYW5zbGF0ZSIsIm9uY2UiLCJ0eXBlIiwidG91Y2hlcyIsImNsaWVudFgiLCJ0YXJnZXQiLCJwcmV2ZW50RGVmYXVsdCIsIngiLCJkZXNpcmVkWCIsInN0eWxlIiwidHJhbnNmb3JtIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImFuaW1hdGUiLCJzdGFydFRpbWUiLCJzdGFydE9mZnNldCIsImR1cmF0aW9uIiwidGFyZ2V0T2Zmc2V0IiwiZWFzZUluT3V0Q3ViaWMiLCJ0IiwiYiIsImQiLCJhbmltIiwidGltZXN0YW1wIiwiZWxhcHNlZCIsInByb2dyZXNzIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiUGVyc3BlY3RpdmVHcm91cCIsInBhcmVudCIsImZvcmVncm91bmRJdGVtcyIsImJhY2tncm91bmRJdGVtcyIsInJhbmdlIiwicGVyc3BlY3RpdmVSYW5nZSIsImNhbGNWYWx1ZSIsImEiLCJ0b0ZpeGVkIiwidGltZW91dCIsInBlcnNwZWN0aXZlIiwidHJhbnNmb3JtU3R5bGUiLCJpdGVtIiwiYmdJdGVtIiwidHJhbnNmb3JtT3JpZ2luIiwiZm9yZWdyb3VuZEl0ZW0iLCJ5IiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ5VmFsdWUiLCJ4VmFsdWUiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsMkRBQTJEO1FBQzNEO1FBQ0E7UUFDQSxHQUFHOztRQUVILDRDQUE0QztRQUM1QztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQSxnREFBZ0Q7UUFDaEQ7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBLE9BQU87UUFDUDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7Ozs7UUFJQTtRQUNBLDhDQUE4QztRQUM5QztRQUNBO1FBQ0EsNEJBQTRCO1FBQzVCLDZCQUE2QjtRQUM3QixpQ0FBaUM7O1FBRWpDLHVDQUF1QztRQUN2QztRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQSxzQ0FBc0M7UUFDdEM7UUFDQTtRQUNBLDZCQUE2QjtRQUM3Qiw2QkFBNkI7UUFDN0I7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLG9CQUFvQixnQkFBZ0I7UUFDcEM7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0Esb0JBQW9CLGdCQUFnQjtRQUNwQztRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EsS0FBSzs7UUFFTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0EsaUJBQWlCLDhCQUE4QjtRQUMvQztRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7O1FBRUEsb0RBQW9EO1FBQ3BEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJO1FBQ0o7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLG1CQUFtQiwyQkFBMkI7UUFDOUM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE9BQU87UUFDUDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0Esa0JBQWtCLGNBQWM7UUFDaEM7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0EsYUFBYSw0QkFBNEI7UUFDekM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLE1BQU07UUFDTjs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxJQUFJOztRQUVKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTs7UUFFQTtRQUNBO1FBQ0EsY0FBYyw0QkFBNEI7UUFDMUM7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0EsY0FBYyw0QkFBNEI7UUFDMUM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsZ0JBQWdCLHVDQUF1QztRQUN2RDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGVBQWUsdUNBQXVDO1FBQ3REO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxlQUFlLHNCQUFzQjtRQUNyQztRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsU0FBUztRQUNUO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLGFBQWEsd0NBQXdDO1FBQ3JEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBO1FBQ0EsT0FBTztRQUNQO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLFNBQVM7UUFDVDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxRQUFRO1FBQ1I7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLElBQUk7UUFDSjs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLGVBQWU7UUFDZjtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7UUFFQTtRQUNBLHNDQUFzQyx1QkFBdUI7O1FBRTdEO1FBQ0E7Ozs7Ozs7QUMxc0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7ZUM5QmlDQSxtQkFBT0EsQ0FBQyxDQUFSLEM7SUFBekJDLFMsWUFBQUEsUztJQUFXQyxTLFlBQUFBLFM7O0FBRVosSUFBTUMsMERBQXlCLFlBQS9COztBQUVQLElBQU1DLHFCQUFxQkMsT0FBT0MsVUFBUCxDQUFrQiw4QkFBbEIsQ0FBM0I7O0FBRUEsSUFBTUMscUJBQXFCLG1CQUEzQjtBQUNBLElBQU1DLHNCQUFzQixjQUE1Qjs7QUFFQSxJQUFNQyxhQUFhLFNBQWJBLFVBQWEsQ0FBQ0MsVUFBRCxFQUFnQjtBQUNqQyxNQUFNQyxPQUFPQyxTQUFTQyxhQUFULENBQXVCLG1CQUF2QixDQUFiO0FBQ0FGLE9BQUtHLElBQUwsR0FBWUosYUFBYUgsa0JBQWIsR0FBa0NDLG1CQUE5QztBQUNELENBSEQ7O0FBS0EsSUFBTU8sc0JBQXNCLFNBQXRCQSxtQkFBc0I7QUFBQSxTQUMxQlYsT0FBT0MsVUFBUCxDQUFrQiw4QkFBbEIsRUFBa0RVLE9BRHhCO0FBQUEsQ0FBNUI7O0FBR08sSUFBTUMsc0NBQWUsU0FBZkEsWUFBZSxHQUFNO0FBQ2hDLE1BQUloQixVQUFVRSxzQkFBVixDQUFKLEVBQXVDO0FBQ3JDLFdBQU9GLFVBQVVFLHNCQUFWLENBQVA7QUFDRDs7QUFFRCxTQUFPLE1BQVA7QUFDRCxDQU5NOztBQVFQLElBQU1lLHFCQUFxQixTQUFyQkEsa0JBQXFCLEdBQU07QUFDL0IsTUFDRUQsbUJBQW1CLE1BQW5CLElBQ0NBLG1CQUFtQixNQUFuQixJQUE2QkYscUJBRmhDLEVBR0U7QUFDQUgsYUFBU08sb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUNDLFNBQXpDLENBQW1EQyxHQUFuRCxDQUF1RCxjQUF2RDtBQUNELEdBTEQsTUFLTyxJQUNMSixtQkFBbUIsT0FBbkIsSUFDQ0EsbUJBQW1CLE1BQW5CLElBQTZCLENBQUNGLHFCQUYxQixFQUdMO0FBQ0FILGFBQVNPLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEVBQXlDQyxTQUF6QyxDQUFtREUsTUFBbkQsQ0FBMEQsY0FBMUQ7QUFDRDtBQUNGLENBWkQ7O0FBY08sSUFBTUMsc0NBQWUsU0FBZkEsWUFBZSxDQUFDQyxTQUFELEVBQWU7QUFDekN0QixZQUFVQyxzQkFBVixFQUFrQ3FCLFNBQWxDO0FBQ0FOO0FBQ0QsQ0FITTs7QUFLUGQsbUJBQW1CcUIsV0FBbkIsQ0FBK0IsVUFBQ0MsQ0FBRCxFQUFPO0FBQ3BDakIsYUFBV2lCLEVBQUVWLE9BQWI7O0FBRUEsTUFBSUMsbUJBQW1CLE1BQXZCLEVBQStCO0FBQzdCTTtBQUNEO0FBQ0YsQ0FORDs7QUFRQVgsU0FBU2UsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbERsQixhQUFXSixPQUFPQyxVQUFQLENBQWtCLDhCQUFsQixFQUFrRFUsT0FBN0Q7QUFDQUU7QUFDRCxDQUhELEU7Ozs7OztBQ3BEQSxpQkFBaUIsbUJBQU8sQ0FBQyxFQUFlOztBQUV4QztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNSQSxXQUFXLG1CQUFPLENBQUMsQ0FBUzs7QUFFNUI7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ0pBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBLHdCOzs7Ozs7QUNSQSx5Qzs7Ozs7Ozs7Ozs7O1FDRWdCaEIsUyxHQUFBQSxTO1FBVUFELFMsR0FBQUEsUztBQVpoQjs7QUFFTyxTQUFTQyxTQUFULENBQW1CMEIsSUFBbkIsRUFBeUJDLEtBQXpCLEVBQWdDQyxJQUFoQyxFQUFzQztBQUMzQyxNQUFJQyxVQUFVLEVBQWQ7QUFDQSxNQUFJRCxJQUFKLEVBQVU7QUFDUixRQUFNRSxPQUFPLElBQUlDLElBQUosRUFBYjtBQUNBRCxTQUFLRSxPQUFMLENBQWFGLEtBQUtHLE9BQUwsS0FBaUJMLE9BQU8sRUFBUCxHQUFZLEVBQVosR0FBaUIsRUFBakIsR0FBc0IsSUFBcEQ7QUFDQUMsY0FBVSxlQUFlQyxLQUFLSSxXQUFMLEVBQXpCO0FBQ0Q7QUFDRHhCLFdBQVN5QixNQUFULEdBQWtCVCxPQUFPLEdBQVAsSUFBY0MsU0FBUyxFQUF2QixJQUE2QkUsT0FBN0IsR0FBdUMsVUFBekQ7QUFDRDs7QUFFTSxTQUFTOUIsU0FBVCxDQUFtQjJCLElBQW5CLEVBQXlCO0FBQzlCLE1BQU1VLFNBQVNWLE9BQU8sR0FBdEI7QUFDQSxNQUFNVyxLQUFLM0IsU0FBU3lCLE1BQVQsQ0FBZ0JHLEtBQWhCLENBQXNCLEdBQXRCLENBQVg7QUFDQSxPQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUYsR0FBR0csTUFBdkIsRUFBK0JELEdBQS9CLEVBQW9DO0FBQ2xDLFFBQUlFLElBQUlKLEdBQUdFLENBQUgsQ0FBUjtBQUNBLFdBQU9FLEVBQUVDLE1BQUYsQ0FBUyxDQUFULE1BQWdCLEdBQXZCO0FBQTRCRCxVQUFJQSxFQUFFRSxTQUFGLENBQVksQ0FBWixFQUFlRixFQUFFRCxNQUFqQixDQUFKO0FBQTVCLEtBQ0EsSUFBSUMsRUFBRUcsT0FBRixDQUFVUixNQUFWLE1BQXNCLENBQTFCLEVBQTZCLE9BQU9LLEVBQUVFLFNBQUYsQ0FBWVAsT0FBT0ksTUFBbkIsRUFBMkJDLEVBQUVELE1BQTdCLENBQVA7QUFDOUI7QUFDRCxTQUFPLElBQVA7QUFDRCxDOzs7Ozs7Ozs7Ozs7O0FDckJEO0FBQ0E7QUFDQTs7QUFFQSxJQUFNSyxXQUFXQyxPQUFPQyxNQUFQLENBQWM7QUFDN0JDLE9BQUssQ0FEd0I7QUFFN0JDLFFBQU0sQ0FGdUI7QUFHN0JDLFFBQU0sQ0FIdUI7QUFJN0JDLFFBQU07QUFKdUIsQ0FBZCxDQUFqQjs7SUFPTUMsVTtBQUNKLHNCQUFZQyxFQUFaLEVBQWdCQyxHQUFoQixFQUFxQkMsT0FBckIsRUFBOEI7QUFBQTs7QUFDNUIsU0FBS0MsT0FBTCxHQUFlSCxFQUFmO0FBQ0EsU0FBS0MsR0FBTCxHQUFXQSxHQUFYO0FBQ0EsU0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0EsU0FBS0UsUUFBTCxHQUFnQlosU0FBU0csR0FBekI7O0FBRUEsU0FBS1UsS0FBTDtBQUNBLFNBQUtDLGFBQUw7QUFDQSxTQUFLQyxZQUFMO0FBQ0Q7Ozs7NEJBRU87QUFDTixXQUFLSixPQUFMLENBQWF0QyxTQUFiLENBQXVCQyxHQUF2QixDQUEyQixjQUEzQjtBQUNEOzs7b0NBRWU7QUFDZCxXQUFLMEMsT0FBTCxHQUFlbkQsU0FBU29ELGFBQVQsQ0FBdUIsS0FBdkIsQ0FBZjtBQUNBLFdBQUtELE9BQUwsQ0FBYTNDLFNBQWIsQ0FBdUJDLEdBQXZCLENBQTJCLFlBQTNCOztBQUVBLFdBQUs0QyxjQUFMLEdBQXNCckQsU0FBU29ELGFBQVQsQ0FBdUIsS0FBdkIsQ0FBdEI7QUFDQSxXQUFLQyxjQUFMLENBQW9CN0MsU0FBcEIsQ0FBOEJDLEdBQTlCLENBQWtDLDJCQUFsQzs7QUFFQSxVQUFJNkMsY0FBSjs7QUFFQSxVQUFJLEtBQUtSLE9BQUwsQ0FBYVMsT0FBYixDQUFxQkMsUUFBekIsRUFBbUM7QUFDakNGLGdCQUFRdEQsU0FBU29ELGFBQVQsQ0FBdUIsS0FBdkIsQ0FBUjtBQUNBRSxjQUFNOUMsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0Isa0JBQXBCO0FBQ0E2QyxjQUFNVixHQUFOLEdBQVksS0FBS0EsR0FBakI7QUFDRCxPQUpELE1BSU8sSUFBSSxLQUFLRSxPQUFMLENBQWFTLE9BQWIsQ0FBcUJFLFFBQXpCLEVBQW1DO0FBQ3hDSCxnQkFBUXRELFNBQVNvRCxhQUFULENBQXVCLE9BQXZCLENBQVI7QUFDQUUsY0FBTUksWUFBTixDQUFtQixVQUFuQixFQUErQixJQUEvQjtBQUNBSixjQUFNSSxZQUFOLENBQW1CLE9BQW5CLEVBQTRCLElBQTVCO0FBQ0FKLGNBQU1JLFlBQU4sQ0FBbUIsTUFBbkIsRUFBMkIsSUFBM0I7QUFDQSxZQUFNRCxXQUFXekQsU0FBU29ELGFBQVQsQ0FBdUIsUUFBdkIsQ0FBakI7QUFDQUUsY0FBTTlDLFNBQU4sQ0FBZ0JDLEdBQWhCLENBQW9CLGtCQUFwQjtBQUNBZ0QsaUJBQVNiLEdBQVQsR0FBZSxLQUFLQSxHQUFwQjtBQUNBVSxjQUFNSyxXQUFOLENBQWtCRixRQUFsQjtBQUNEOztBQUVELFdBQUtHLFdBQUwsR0FBbUI1RCxTQUFTb0QsYUFBVCxDQUF1QixRQUF2QixDQUFuQjtBQUNBLFdBQUtRLFdBQUwsQ0FBaUJwRCxTQUFqQixDQUEyQkMsR0FBM0IsQ0FBK0Isa0JBQS9COztBQUVBLFVBQU1vRCxnQkFBZ0I3RCxTQUFTb0QsYUFBVCxDQUF1QixLQUF2QixDQUF0QjtBQUNBUyxvQkFBY3JELFNBQWQsQ0FBd0JDLEdBQXhCLENBQTRCLHFCQUE1Qjs7QUFFQSxXQUFLNEMsY0FBTCxDQUFvQk0sV0FBcEIsQ0FBZ0NMLEtBQWhDO0FBQ0EsV0FBS0QsY0FBTCxDQUFvQk0sV0FBcEIsQ0FBZ0MsS0FBS0MsV0FBckM7O0FBRUEsV0FBS0UsaUJBQUwsR0FBeUI5RCxTQUFTb0QsYUFBVCxDQUF1QixLQUF2QixDQUF6QjtBQUNBLFdBQUtVLGlCQUFMLENBQXVCdEQsU0FBdkIsQ0FBaUNDLEdBQWpDLENBQXFDLDhCQUFyQztBQUNBLFdBQUtxRCxpQkFBTCxDQUF1QkgsV0FBdkIsQ0FBbUNMLE1BQU1TLFNBQU4sRUFBbkM7O0FBRUEsV0FBS1osT0FBTCxDQUFhUSxXQUFiLENBQXlCLEtBQUtOLGNBQTlCO0FBQ0EsV0FBS0YsT0FBTCxDQUFhUSxXQUFiLENBQXlCLEtBQUtHLGlCQUE5Qjs7QUFFQSxVQUFJLEtBQUtqQixPQUFULEVBQWtCO0FBQ2hCLGFBQUttQixhQUFMO0FBQ0Q7O0FBRUQsV0FBS0MsY0FBTDtBQUNBLFdBQUtDLGFBQUwsQ0FBbUIsS0FBS25CLFFBQXhCOztBQUVBL0MsZUFBU21FLElBQVQsQ0FBY1IsV0FBZCxDQUEwQixLQUFLUixPQUEvQjtBQUNBLFdBQUtMLE9BQUwsQ0FBYWEsV0FBYixDQUF5QkUsYUFBekI7QUFDRDs7O3FDQUVnQjtBQUNmLFdBQUtPLFFBQUwsR0FBZ0JwRSxTQUFTb0QsYUFBVCxDQUF1QixLQUF2QixDQUFoQjtBQUNBLFdBQUtnQixRQUFMLENBQWM1RCxTQUFkLENBQXdCQyxHQUF4QixDQUE0QixxQkFBNUI7O0FBRUEsV0FBSzRELFNBQUwsR0FBaUJyRSxTQUFTb0QsYUFBVCxDQUF1QixRQUF2QixDQUFqQjtBQUNBLFdBQUtrQixVQUFMLEdBQWtCdEUsU0FBU29ELGFBQVQsQ0FBdUIsUUFBdkIsQ0FBbEI7QUFDQSxXQUFLbUIsVUFBTCxHQUFrQnZFLFNBQVNvRCxhQUFULENBQXVCLFFBQXZCLENBQWxCO0FBQ0EsV0FBS29CLFVBQUwsR0FBa0J4RSxTQUFTb0QsYUFBVCxDQUF1QixRQUF2QixDQUFsQjs7QUFFQSxXQUFLaUIsU0FBTCxDQUFlN0QsU0FBZixDQUF5QkMsR0FBekIsQ0FDRSw2QkFERixFQUVFLDBCQUZGO0FBSUEsV0FBSzZELFVBQUwsQ0FBZ0I5RCxTQUFoQixDQUEwQkMsR0FBMUIsQ0FDRSw4QkFERixFQUVFLDBCQUZGO0FBSUEsV0FBSzhELFVBQUwsQ0FBZ0IvRCxTQUFoQixDQUEwQkMsR0FBMUIsQ0FDRSw4QkFERixFQUVFLDBCQUZGO0FBSUEsV0FBSytELFVBQUwsQ0FBZ0JoRSxTQUFoQixDQUEwQkMsR0FBMUIsQ0FDRSwrQkFERixFQUVFLDBCQUZGOztBQUtBLFdBQUs2RCxVQUFMLENBQWdCRyxXQUFoQixHQUE4QixNQUE5QjtBQUNBLFdBQUtKLFNBQUwsQ0FBZUksV0FBZixHQUE2QixLQUE3QjtBQUNBLFdBQUtGLFVBQUwsQ0FBZ0JFLFdBQWhCLEdBQThCLE1BQTlCO0FBQ0EsV0FBS0QsVUFBTCxDQUFnQkMsV0FBaEIsR0FBOEIsTUFBOUI7O0FBRUEsV0FBS0wsUUFBTCxDQUFjVCxXQUFkLENBQTBCLEtBQUtVLFNBQS9CO0FBQ0E7QUFDQSxXQUFLRCxRQUFMLENBQWNULFdBQWQsQ0FBMEIsS0FBS2EsVUFBL0I7QUFDQSxXQUFLSixRQUFMLENBQWNULFdBQWQsQ0FBMEIsS0FBS1ksVUFBL0I7O0FBRUEsV0FBS3BCLE9BQUwsQ0FBYVEsV0FBYixDQUF5QixLQUFLUyxRQUE5QjtBQUNEOzs7b0NBRWU7QUFDZCxVQUFNdkIsVUFBVTdDLFNBQVNvRCxhQUFULENBQXVCLEdBQXZCLENBQWhCO0FBQ0FQLGNBQVE0QixXQUFSLEdBQXNCLEtBQUs1QixPQUEzQjtBQUNBQSxjQUFRckMsU0FBUixDQUFrQkMsR0FBbEIsQ0FBc0Isb0JBQXRCO0FBQ0EsV0FBSzBDLE9BQUwsQ0FBYVEsV0FBYixDQUF5QmQsT0FBekI7QUFDRDs7O2tDQUVhRSxRLEVBQVU7QUFDdEIsV0FBS0EsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxVQUFNMkIsVUFBVUMsTUFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQ2QsS0FBSzNCLE9BQUwsQ0FBYTRCLGdCQUFiLENBQThCLDJCQUE5QixDQURjLENBQWhCOztBQUlBLFVBQU1DLGdCQUFnQixLQUFLbEIsaUJBQUwsQ0FBdUJtQixZQUE3QztBQUNBLFVBQU1DLGVBQWUsS0FBS3BCLGlCQUFMLENBQXVCcUIsV0FBNUM7O0FBRUEsV0FBS2hDLE9BQUwsQ0FBYUksT0FBYixDQUFxQjZCLE1BQXJCLEdBQ0VKLGdCQUFnQkUsWUFBaEIsR0FBK0IsTUFBL0IsR0FBd0MsTUFEMUM7O0FBR0FSLGNBQVFXLE9BQVIsQ0FBZ0IsVUFBQ0MsTUFBRCxFQUFZO0FBQzFCQSxlQUFPOUUsU0FBUCxDQUFpQkUsTUFBakIsQ0FBd0IsYUFBeEI7QUFDRCxPQUZEOztBQUlBLFVBQUksS0FBS3FDLFFBQUwsS0FBa0JaLFNBQVNHLEdBQS9CLEVBQW9DO0FBQ2xDLGFBQUsrQixTQUFMLENBQWU3RCxTQUFmLENBQXlCQyxHQUF6QixDQUE2QixhQUE3QjtBQUNBLGFBQUswQyxPQUFMLENBQWFJLE9BQWIsQ0FBcUJSLFFBQXJCLEdBQWdDLEtBQWhDO0FBQ0QsT0FIRCxNQUdPLElBQUksS0FBS0EsUUFBTCxLQUFrQlosU0FBU0ksSUFBL0IsRUFBcUM7QUFDMUMsYUFBSytCLFVBQUwsQ0FBZ0I5RCxTQUFoQixDQUEwQkMsR0FBMUIsQ0FBOEIsYUFBOUI7QUFDQSxhQUFLMEMsT0FBTCxDQUFhSSxPQUFiLENBQXFCUixRQUFyQixHQUFnQyxNQUFoQztBQUNELE9BSE0sTUFHQSxJQUFJLEtBQUtBLFFBQUwsS0FBa0JaLFNBQVNLLElBQS9CLEVBQXFDO0FBQzFDLGFBQUsrQixVQUFMLENBQWdCL0QsU0FBaEIsQ0FBMEJDLEdBQTFCLENBQThCLGFBQTlCO0FBQ0EsYUFBSzBDLE9BQUwsQ0FBYUksT0FBYixDQUFxQlIsUUFBckIsR0FBZ0MsTUFBaEM7QUFDRCxPQUhNLE1BR0EsSUFBSSxLQUFLQSxRQUFMLEtBQWtCWixTQUFTTSxJQUEvQixFQUFxQztBQUMxQyxhQUFLK0IsVUFBTCxDQUFnQmhFLFNBQWhCLENBQTBCQyxHQUExQixDQUE4QixhQUE5QjtBQUNBLGFBQUswQyxPQUFMLENBQWFJLE9BQWIsQ0FBcUJSLFFBQXJCLEdBQWdDLE1BQWhDO0FBQ0Q7QUFDRjs7O21DQUVjO0FBQ2IsVUFBTXdDLE9BQU8sSUFBYjtBQUNBLFdBQUt6QyxPQUFMLENBQWEvQixnQkFBYixDQUE4QixPQUE5QixFQUF1QyxZQUFNO0FBQzNDd0UsYUFBS0MsV0FBTDtBQUNELE9BRkQ7O0FBSUEvRixhQUFPc0IsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBQ0QsQ0FBRCxFQUFPO0FBQ3RDLFlBQUlBLEVBQUUyRSxHQUFGLEtBQVUsUUFBZCxFQUF3QjtBQUN0QkYsZUFBS0csWUFBTDtBQUNEO0FBQ0YsT0FKRDs7QUFNQSxXQUFLOUIsV0FBTCxDQUFpQjdDLGdCQUFqQixDQUNFLE9BREYsRUFFRSxZQUFNO0FBQ0p3RSxhQUFLRyxZQUFMO0FBQ0QsT0FKSCxFQUtFLElBTEY7O0FBUUEsV0FBS3BCLFVBQUwsQ0FBZ0J2RCxnQkFBaEIsQ0FDRSxPQURGLEVBRUUsS0FBS21ELGFBQUwsQ0FBbUJ5QixJQUFuQixDQUF3QixJQUF4QixFQUE4QnhELFNBQVNJLElBQXZDLENBRkY7QUFJQSxXQUFLZ0MsVUFBTCxDQUFnQnhELGdCQUFoQixDQUNFLE9BREYsRUFFRSxLQUFLbUQsYUFBTCxDQUFtQnlCLElBQW5CLENBQXdCLElBQXhCLEVBQThCeEQsU0FBU0ssSUFBdkMsQ0FGRjtBQUlBLFdBQUs2QixTQUFMLENBQWV0RCxnQkFBZixDQUNFLE9BREYsRUFFRSxLQUFLbUQsYUFBTCxDQUFtQnlCLElBQW5CLENBQXdCLElBQXhCLEVBQThCeEQsU0FBU0csR0FBdkMsQ0FGRjtBQUlBLFdBQUtrQyxVQUFMLENBQWdCekQsZ0JBQWhCLENBQ0UsT0FERixFQUVFLEtBQUttRCxhQUFMLENBQW1CeUIsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJ4RCxTQUFTTSxJQUF2QyxDQUZGO0FBSUQ7OztrQ0FFYTtBQUNaLFdBQUtVLE9BQUwsQ0FBYTNDLFNBQWIsQ0FBdUJDLEdBQXZCLENBQTJCLFNBQTNCO0FBQ0FULGVBQVNPLG9CQUFULENBQThCLE1BQTlCLEVBQXNDLENBQXRDLEVBQXlDQyxTQUF6QyxDQUFtREMsR0FBbkQsQ0FBdUQsa0JBQXZEO0FBQ0Q7OzttQ0FFYztBQUNiLFdBQUswQyxPQUFMLENBQWEzQyxTQUFiLENBQXVCRSxNQUF2QixDQUE4QixTQUE5QjtBQUNBVixlQUNHTyxvQkFESCxDQUN3QixNQUR4QixFQUNnQyxDQURoQyxFQUVHQyxTQUZILENBRWFFLE1BRmIsQ0FFb0Isa0JBRnBCO0FBR0Q7Ozs7OztBQUdIVixTQUFTK0UsZ0JBQVQsQ0FBMEIsaUJBQTFCLEVBQTZDTSxPQUE3QyxDQUFxRCxVQUFDdkMsT0FBRCxFQUFhO0FBQ2hFLE1BQU1GLE1BQU1FLFFBQVFTLE9BQVIsQ0FBZ0JDLFFBQWhCLElBQTRCVixRQUFRUyxPQUFSLENBQWdCRSxRQUF4RDtBQUNBLE1BQUlmLFVBQUosQ0FBZUksT0FBZixFQUF3QkYsR0FBeEIsRUFBNkJFLFFBQVFTLE9BQVIsQ0FBZ0JWLE9BQTdDO0FBQ0QsQ0FIRCxFOzs7Ozs7Ozs7Ozs7O0FDOU1BO0FBQ0E7O0lBRU0rQyxZO0FBQ0osd0JBQVlqRCxFQUFaLEVBQWdCa0QsV0FBaEIsRUFBNkI7QUFBQTs7QUFDM0IsU0FBS2xELEVBQUwsR0FBVUEsRUFBVjtBQUNBLFNBQUttRCxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsU0FBS0Msa0JBQUwsR0FBMEIsR0FBMUI7O0FBRUEsUUFBSUYsV0FBSixFQUFpQjtBQUNmLFdBQUtFLGtCQUFMLEdBQTBCL0YsU0FBU0MsYUFBVCxDQUF1QjRGLFdBQXZCLEVBQW9DWixZQUE5RDtBQUNEOztBQUVELFNBQUtlLGdCQUFMO0FBQ0EsU0FBS0MsbUJBQUw7QUFDRDs7Ozt1Q0FFa0I7QUFDakJ4RyxhQUFPc0IsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBS2tGLG1CQUFMLENBQXlCTixJQUF6QixDQUE4QixJQUE5QixDQUFsQztBQUNEOzs7MENBRXFCO0FBQ3BCLFVBQUlsRyxPQUFPeUcsT0FBUCxHQUFpQixLQUFLSCxrQkFBdEIsSUFBNEMsS0FBS0QsV0FBTCxLQUFxQixLQUFyRSxFQUE0RTtBQUMxRSxhQUFLQSxXQUFMLEdBQW1CLElBQW5CO0FBQ0EsYUFBS0ssZ0JBQUwsQ0FBc0IsSUFBdEI7QUFDRCxPQUhELE1BR08sSUFBSTFHLE9BQU95RyxPQUFQLEdBQWlCLEtBQUtILGtCQUF0QixJQUE0QyxLQUFLRCxXQUFMLEtBQXFCLElBQXJFLEVBQTJFO0FBQ2hGLGFBQUtBLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxhQUFLSyxnQkFBTCxDQUFzQixLQUF0QjtBQUNEO0FBQ0Y7OztxQ0FFZ0JDLFUsRUFBWTtBQUMzQixVQUFJQSxVQUFKLEVBQWdCO0FBQ2QsYUFBS3pELEVBQUwsQ0FBUW5DLFNBQVIsQ0FBa0JDLEdBQWxCLENBQXNCLGFBQXRCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS2tDLEVBQUwsQ0FBUW5DLFNBQVIsQ0FBa0JFLE1BQWxCLENBQXlCLGFBQXpCO0FBQ0Q7QUFDRjs7Ozs7O0FBR0hqQixPQUFPbUcsWUFBUCxHQUFzQkEsWUFBdEIsQzs7Ozs7Ozs7Ozs7OztlQ3hDdUN4RyxtQkFBT0EsQ0FBQyxDQUFSLEM7SUFBL0JpQixZLFlBQUFBLFk7SUFBY00sYSxZQUFBQSxZOztJQUVoQjBGLEk7QUFDSixnQkFBWTFELEVBQVosRUFBZ0I7QUFBQTs7QUFBQTs7QUFDZCxTQUFLQSxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLMkMsTUFBTCxHQUFjM0MsR0FBRzJELHNCQUFILENBQTBCLGdCQUExQixFQUE0QyxDQUE1QyxDQUFkO0FBQ0EsU0FBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU83RCxHQUFHMkQsc0JBQUgsQ0FBMEIsWUFBMUIsRUFBd0MsQ0FBeEMsQ0FESTtBQUVYRyxZQUFNOUQsR0FBRzJELHNCQUFILENBQTBCLGFBQTFCLEVBQXlDLENBQXpDLENBRks7QUFHWEksWUFBTS9ELEdBQUcyRCxzQkFBSCxDQUEwQixjQUExQixFQUEwQyxDQUExQztBQUhLLEtBQWI7QUFLQSxTQUFLM0YsWUFBTDs7QUFFQSxRQUFNbkIscUJBQXFCQyxPQUFPQyxVQUFQLENBQ3pCLDhCQUR5QixDQUEzQjtBQUdBRix1QkFBbUJxQixXQUFuQixDQUErQixZQUFNO0FBQ25DLFlBQUtGLFlBQUw7QUFDRCxLQUZEOztBQUlBLFNBQUsyRSxNQUFMLENBQVl2RSxnQkFBWixDQUE2QixPQUE3QixFQUFzQyxZQUFNO0FBQzFDLFVBQUksTUFBS0gsU0FBTCxLQUFtQixNQUF2QixFQUErQjtBQUM3QixjQUFLRCxZQUFMLENBQWtCLE9BQWxCO0FBQ0QsT0FGRCxNQUVPLElBQUksTUFBS0MsU0FBTCxLQUFtQixPQUF2QixFQUFnQztBQUNyQyxjQUFLRCxZQUFMLENBQWtCLE1BQWxCO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsY0FBS0EsWUFBTCxDQUFrQixNQUFsQjtBQUNEO0FBQ0QsWUFBS0EsWUFBTDtBQUNELEtBVEQ7QUFVRDs7OztpQ0FFWUMsUyxFQUFXO0FBQ3RCLFVBQUlBLFNBQUosRUFBZTtBQUNiLGFBQUtBLFNBQUwsR0FBaUJBLFNBQWpCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS0EsU0FBTCxHQUFpQlAsY0FBakI7QUFDRDs7QUFFRE0sb0JBQWEsS0FBS0MsU0FBbEI7O0FBRUEsV0FBSytGLGNBQUw7QUFDRDs7O3FDQUVnQjtBQUFBOztBQUNmdkUsYUFBT3dFLElBQVAsQ0FBWSxLQUFLTCxLQUFqQixFQUF3QmxCLE9BQXhCLENBQWdDLFVBQUN3QixDQUFELEVBQU87QUFDckMsWUFBSUEsTUFBTSxPQUFLakcsU0FBZixFQUEwQjtBQUN4QixpQkFBSzJGLEtBQUwsQ0FBV00sQ0FBWCxFQUFjckcsU0FBZCxDQUF3QkMsR0FBeEIsQ0FBNEIsWUFBNUI7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBSzhGLEtBQUwsQ0FBV00sQ0FBWCxFQUFjckcsU0FBZCxDQUF3QkUsTUFBeEIsQ0FBK0IsWUFBL0I7QUFDRDtBQUNGLE9BTkQ7QUFPRDs7Ozs7O0FBR0hqQixPQUFPNEcsSUFBUCxHQUFjQSxJQUFkLEM7Ozs7Ozs7Ozs7O0FDdkRBOzs7Ozs7OztBQUVBLElBQU1TLHNCQUFzQixTQUF0QkEsbUJBQXNCLENBQUNuRSxFQUFELEVBQVE7QUFDbEMsTUFBTW9FLE9BQU9wRSxHQUFHcUUscUJBQUgsRUFBYjs7QUFFQSxTQUNFRCxLQUFLRSxHQUFMLElBQVksQ0FBWixJQUNBRixLQUFLRyxJQUFMLElBQWEsQ0FEYixJQUVBSCxLQUFLSSxNQUFMLEtBQ0cxSCxPQUFPMkgsV0FBUCxJQUFzQnBILFNBQVNxSCxlQUFULENBQXlCQyxZQURsRCxDQUZBLElBSUFQLEtBQUtRLEtBQUwsS0FBZTlILE9BQU8rSCxVQUFQLElBQXFCeEgsU0FBU3FILGVBQVQsQ0FBeUJJLFdBQTdELENBTEY7QUFPRCxDQVZEOztJQVlNQyxjO0FBQ0osMEJBQVkvRSxFQUFaLEVBQWdCO0FBQUE7O0FBQ2QsU0FBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsU0FBS2dGLE1BQUwsR0FBY2hGLEdBQUcyRCxzQkFBSCxDQUEwQixpQkFBMUIsRUFBNkMsQ0FBN0MsQ0FBZDtBQUNBLFNBQUtzQixLQUFMLEdBQWFqRixHQUFHMkQsc0JBQUgsQ0FBMEIsZUFBMUIsRUFBMkMsQ0FBM0MsQ0FBYjtBQUNBLFNBQUt1QixVQUFMLEdBQWtCLEtBQUtELEtBQUwsQ0FBV3JILG9CQUFYLENBQWdDLEtBQWhDLEVBQXVDLENBQXZDLENBQWxCOztBQUVBLFNBQUt1SCxVQUFMLEdBQWtCLEtBQUtBLFVBQUwsQ0FBZ0JuQyxJQUFoQixDQUFxQixJQUFyQixDQUFsQjtBQUNBLFNBQUtvQyxhQUFMLEdBQXFCLEtBQUtBLGFBQUwsQ0FBbUJwQyxJQUFuQixDQUF3QixJQUF4QixDQUFyQjtBQUNBLFNBQUtxQyxlQUFMLEdBQXVCLEtBQUtBLGVBQUwsQ0FBcUJyQyxJQUFyQixDQUEwQixJQUExQixDQUF2QjtBQUNBLFNBQUtzQyxZQUFMLEdBQW9CLEtBQUtBLFlBQUwsQ0FBa0J0QyxJQUFsQixDQUF1QixJQUF2QixDQUFwQjtBQUNBLFNBQUt1QyxxQkFBTCxHQUE2Qix3QkFBUyxLQUFLRCxZQUFkLEVBQTRCLEdBQTVCLENBQTdCOztBQUVBLFNBQUtFLG1CQUFMLEdBQTJCLHdCQUFTLEtBQUtMLFVBQWQsRUFBMEIsR0FBMUIsQ0FBM0I7O0FBRUEsU0FBS25GLEVBQUwsQ0FBUTVCLGdCQUFSLENBQXlCLFdBQXpCLEVBQXNDLEtBQUsrRyxVQUEzQyxFQUF1RCxLQUF2RDtBQUNBLFNBQUtuRixFQUFMLENBQVE1QixnQkFBUixDQUF5QixXQUF6QixFQUFzQyxLQUFLaUgsZUFBM0MsRUFBNEQsS0FBNUQ7QUFDQSxTQUFLckYsRUFBTCxDQUFRNUIsZ0JBQVIsQ0FBeUIsU0FBekIsRUFBb0MsS0FBS2dILGFBQXpDLEVBQXdELEtBQXhEOztBQUVBLFNBQUtwRixFQUFMLENBQVE1QixnQkFBUixDQUF5QixZQUF6QixFQUF1QyxLQUFLaUgsZUFBNUMsRUFBNkQsS0FBN0Q7QUFDQSxTQUFLckYsRUFBTCxDQUFRNUIsZ0JBQVIsQ0FBeUIsVUFBekIsRUFBcUMsS0FBS2dILGFBQTFDLEVBQXlELEtBQXpEO0FBQ0EsU0FBS3BGLEVBQUwsQ0FBUTVCLGdCQUFSLENBQXlCLFdBQXpCLEVBQXNDLEtBQUsrRyxVQUEzQyxFQUF1RCxLQUF2RDs7QUFFQSxTQUFLTSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixJQUFoQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxLQUFLM0YsRUFBTCxDQUFROEUsV0FBUixHQUFzQixDQUFyQztBQUNBLFNBQUtjLEtBQUwsR0FBYSxLQUFLNUYsRUFBTCxDQUFROEUsV0FBckI7O0FBRUEsU0FBS2UsTUFBTCxHQUFjLEtBQWQ7QUFDQSxTQUFLQyxXQUFMLEdBQW1CLEtBQW5COztBQUVBLFFBQUk5RixHQUFHWSxPQUFILENBQVdtRixZQUFmLEVBQTZCO0FBQzNCLFdBQUtDLFlBQUwsQ0FBa0IsRUFBbEI7QUFDQWxKLGFBQU9zQixnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxLQUFLbUgscUJBQXZDO0FBQ0F6SSxhQUFPc0IsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MsS0FBS2tILFlBQXJDLEVBQW1ELEVBQUVXLE1BQU0sSUFBUixFQUFuRDtBQUNELEtBSkQsTUFJTztBQUNMLFdBQUtELFlBQUwsQ0FBa0IsS0FBS0wsT0FBdkI7QUFDRDtBQUNGOzs7O29DQUVleEgsQyxFQUFHO0FBQ2pCLFVBQUlBLEVBQUUrSCxJQUFGLEtBQVcsWUFBZixFQUE2QjtBQUMzQixhQUFLUixRQUFMLEdBQWdCdkgsRUFBRWdJLE9BQUYsQ0FBVSxDQUFWLEVBQWFDLE9BQWIsR0FBdUIsS0FBS1QsT0FBNUM7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLRCxRQUFMLEdBQWdCdkgsRUFBRWlJLE9BQUYsR0FBWSxLQUFLVCxPQUFqQztBQUNEOztBQUVELFVBQUl4SCxFQUFFa0ksTUFBRixLQUFhLEtBQUtyQixNQUF0QixFQUE4QjtBQUM1QixhQUFLYSxNQUFMLEdBQWMsSUFBZDtBQUNEO0FBQ0Y7OzsrQkFFVTFILEMsRUFBRztBQUNaLFVBQUksQ0FBQyxLQUFLMEgsTUFBVixFQUFrQjtBQUNoQjtBQUNEOztBQUVEMUgsUUFBRW1JLGNBQUY7O0FBRUEsVUFBSW5JLEVBQUUrSCxJQUFGLEtBQVcsV0FBZixFQUE0QjtBQUMxQixhQUFLVCxRQUFMLEdBQWdCdEgsRUFBRWdJLE9BQUYsQ0FBVSxDQUFWLEVBQWFDLE9BQWIsR0FBdUIsS0FBS1YsUUFBNUM7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLRCxRQUFMLEdBQWdCdEgsRUFBRWlJLE9BQUYsR0FBWSxLQUFLVixRQUFqQztBQUNEOztBQUVELFdBQUtDLE9BQUwsR0FBZSxLQUFLRixRQUFwQjs7QUFFQSxXQUFLTyxZQUFMLENBQWtCLEtBQUtQLFFBQXZCO0FBQ0Q7OztvQ0FFZTtBQUNkLFdBQUtDLFFBQUwsR0FBZ0IsS0FBS0QsUUFBckI7QUFDQSxXQUFLSSxNQUFMLEdBQWMsS0FBZDtBQUNEOzs7aUNBRVlVLEMsRUFBRztBQUNkLFVBQUlDLFdBQVdELENBQWY7QUFDQSxVQUFJQyxXQUFXLENBQWYsRUFBa0I7QUFDaEJBLG1CQUFXLENBQVg7QUFDRDs7QUFFRCxVQUFJQSxXQUFXLEtBQUtaLEtBQXBCLEVBQTJCO0FBQ3pCWSxtQkFBVyxLQUFLWixLQUFoQjtBQUNEOztBQUVELFdBQUtYLEtBQUwsQ0FBV3dCLEtBQVgsQ0FBaUJDLFNBQWpCLG1CQUEyQyxFQUFFLEtBQUtkLEtBQUwsR0FBYVksUUFBZixDQUEzQztBQUNBLFdBQUt0QixVQUFMLENBQWdCdUIsS0FBaEIsQ0FBc0JDLFNBQXRCLG9CQUFnRCxLQUFLZCxLQUFMLEdBQWFZLFFBQTdEO0FBQ0EsV0FBS3hCLE1BQUwsQ0FBWXlCLEtBQVosQ0FBa0JDLFNBQWxCLG9CQUE2Q0YsUUFBN0M7QUFDRDs7O21DQUVjO0FBQ2IsVUFBSXJDLG9CQUFvQixLQUFLbkUsRUFBekIsQ0FBSixFQUFrQztBQUNoQ2xELGVBQU82SixtQkFBUCxDQUEyQixRQUEzQixFQUFxQyxLQUFLcEIscUJBQTFDO0FBQ0EsYUFBS3FCLE9BQUw7QUFDRDtBQUNGOzs7OEJBRVM7QUFBQTs7QUFDUixVQUFJLEtBQUtkLFdBQVQsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxVQUFJZSxrQkFBSjtBQUNBLFVBQU1DLGNBQWMsRUFBcEI7QUFDQSxVQUFNQyxXQUFXLElBQWpCO0FBQ0EsVUFBTUMsZUFBZSxLQUFLckIsT0FBMUI7O0FBRUE7QUFDQSxVQUFNc0IsaUJBQWlCLFNBQWpCQSxjQUFpQixDQUFDQyxDQUFELEVBQUlDLENBQUosRUFBTy9ILENBQVAsRUFBVWdJLENBQVYsRUFBZ0I7QUFDckMsWUFBSSxDQUFDRixLQUFLRSxJQUFJLENBQVYsSUFBZSxDQUFuQixFQUFzQixPQUFRaEksSUFBSSxDQUFMLEdBQVU4SCxDQUFWLEdBQWNBLENBQWQsR0FBa0JBLENBQWxCLEdBQXNCQyxDQUE3QjtBQUN0QixlQUFRL0gsSUFBSSxDQUFMLElBQVcsQ0FBQzhILEtBQUssQ0FBTixJQUFXQSxDQUFYLEdBQWVBLENBQWYsR0FBbUIsQ0FBOUIsSUFBbUNDLENBQTFDO0FBQ0QsT0FIRDtBQUlBOztBQUVBLFVBQUlKLFdBQVcsQ0FBZixFQUFrQjtBQUNoQixhQUFLbEIsTUFBTCxHQUFjLEtBQWQ7O0FBRUEsWUFBTXdCLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxTQUFELEVBQWU7QUFDMUJULHNCQUFZQSxhQUFhUyxTQUF6QjtBQUNBLGNBQU1DLFVBQVVELFlBQVlULFNBQTVCO0FBQ0EsY0FBTVcsV0FBV1AsZUFDZk0sT0FEZSxFQUVmVCxXQUZlLEVBR2ZFLGVBQWVGLFdBSEEsRUFJZkMsUUFKZSxDQUFqQjtBQU1BLGdCQUFLZixZQUFMLENBQWtCd0IsUUFBbEI7QUFDQSxjQUFJRCxVQUFVUixRQUFkLEVBQXdCO0FBQ3RCVSxrQ0FBc0JKLElBQXRCO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsa0JBQUtyQixZQUFMLENBQWtCZ0IsWUFBbEI7QUFDRDtBQUNGLFNBZkQ7QUFnQkFTLDhCQUFzQkosSUFBdEI7QUFDRCxPQXBCRCxNQW9CTztBQUNMLGFBQUtyQixZQUFMLENBQWtCZ0IsWUFBbEI7QUFDQSxhQUFLbEIsV0FBTCxHQUFtQixJQUFuQjtBQUNBLGFBQUtELE1BQUwsR0FBYyxJQUFkO0FBQ0Q7QUFDRjs7Ozs7O0FBR0gvSSxPQUFPaUksY0FBUCxHQUF3QkEsY0FBeEIsQzs7Ozs7O0FDNUpBLGVBQWUsbUJBQU8sQ0FBQyxFQUFZO0FBQ25DLGVBQWUsbUJBQU8sQ0FBQyxDQUFZOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPLFlBQVk7QUFDOUIsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxvQkFBb0I7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBOzs7Ozs7O0FDcEVBLGVBQWUsbUJBQU8sQ0FBQyxDQUFZO0FBQ25DLFVBQVUsbUJBQU8sQ0FBQyxFQUFPO0FBQ3pCLGVBQWUsbUJBQU8sQ0FBQyxFQUFZOztBQUVuQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixXQUFXLE9BQU87QUFDbEIsV0FBVyxPQUFPLFlBQVk7QUFDOUIsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsYUFBYSxTQUFTO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsOENBQThDLGtCQUFrQjtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDOUxBLFdBQVcsbUJBQU8sQ0FBQyxDQUFTOztBQUU1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN0QkE7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNIQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7OztBQ3BCQSxlQUFlLG1CQUFPLENBQUMsRUFBYTtBQUNwQyxlQUFlLG1CQUFPLENBQUMsQ0FBWTtBQUNuQyxlQUFlLG1CQUFPLENBQUMsRUFBWTs7QUFFbkM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDL0RBLHNCQUFzQixtQkFBTyxDQUFDLEVBQW9COztBQUVsRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNsQkE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxPQUFPO0FBQ2xCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDbEJBLGlCQUFpQixtQkFBTyxDQUFDLEVBQWU7QUFDeEMsbUJBQW1CLG1CQUFPLENBQUMsRUFBZ0I7O0FBRTNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDNUJBLGFBQWEsbUJBQU8sQ0FBQyxDQUFXO0FBQ2hDLGdCQUFnQixtQkFBTyxDQUFDLEVBQWM7QUFDdEMscUJBQXFCLG1CQUFPLENBQUMsRUFBbUI7O0FBRWhEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzNCQSxhQUFhLG1CQUFPLENBQUMsQ0FBVzs7QUFFaEM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzdDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0lDNUJNMkMsZ0IsR0FDSiwwQkFBWTFILEVBQVosRUFBZ0I7QUFBQTs7QUFBQTs7QUFDZCxNQUFJLGtCQUFrQmxELE1BQXRCLEVBQThCO0FBQzVCO0FBQ0Q7O0FBRUQsTUFBTTZLLFNBQVMzSCxFQUFmO0FBQ0EsT0FBSzRILGVBQUwsR0FBdUJELE9BQU92RixnQkFBUCxDQUF3Qiw0QkFBeEIsQ0FBdkI7QUFDQSxPQUFLeUYsZUFBTCxHQUF1QkYsT0FBT3ZGLGdCQUFQLENBQXdCLDRCQUF4QixDQUF2QjtBQUNBLE1BQU0wRixRQUFRSCxPQUFPL0csT0FBUCxDQUFlbUgsZ0JBQWYsSUFBbUMsRUFBakQ7QUFDQSxNQUFNQyxZQUFZLFNBQVpBLFNBQVksQ0FBQ0MsQ0FBRCxFQUFJZCxDQUFKO0FBQUEsV0FBVSxDQUFHYyxJQUFJZCxDQUFMLEdBQVVXLEtBQVgsR0FBcUJBLFFBQVEsQ0FBOUIsRUFBa0NJLE9BQWxDLENBQTBDLENBQTFDLENBQVY7QUFBQSxHQUFsQjs7QUFFQSxNQUFJQyxnQkFBSjs7QUFFQVIsU0FBT2xCLEtBQVAsQ0FBYTJCLFdBQWIsR0FBMkIsUUFBM0I7QUFDQVQsU0FBT2xCLEtBQVAsQ0FBYTRCLGNBQWIsR0FBOEIsYUFBOUI7O0FBRUEsS0FBRzNGLE9BQUgsQ0FBV1AsSUFBWCxDQUFnQixLQUFLMEYsZUFBckIsRUFBc0MsVUFBQ1MsSUFBRCxFQUFVO0FBQzlDLFFBQU1DLFNBQVNELElBQWY7QUFDQUMsV0FBTzlCLEtBQVAsQ0FBYTRCLGNBQWIsR0FBOEIsYUFBOUI7QUFDQUUsV0FBTzlCLEtBQVAsQ0FBYTJCLFdBQWIsR0FBMkIsUUFBM0I7QUFDQUcsV0FBTzlCLEtBQVAsQ0FBYStCLGVBQWIsR0FBK0IsU0FBL0I7QUFDRCxHQUxEOztBQU9BLEtBQUc5RixPQUFILENBQVdQLElBQVgsQ0FBZ0IsS0FBS3lGLGVBQXJCLEVBQXNDLFVBQUNVLElBQUQsRUFBVTtBQUM5QyxRQUFNRyxpQkFBaUJILElBQXZCO0FBQ0FHLG1CQUFlaEMsS0FBZixDQUFxQitCLGVBQXJCLEdBQXVDLFNBQXZDO0FBQ0QsR0FIRDs7QUFLQW5MLFdBQVNlLGdCQUFULENBQ0UsV0FERixFQUVFLGdCQUFjO0FBQUEsUUFBWHNLLENBQVcsUUFBWEEsQ0FBVztBQUFBLFFBQVJuQyxDQUFRLFFBQVJBLENBQVE7O0FBQ1osUUFBSTRCLE9BQUosRUFBYTtBQUNYckwsYUFBTzZMLG9CQUFQLENBQTRCUixPQUE1QjtBQUNEOztBQUVEQSxjQUFVckwsT0FBTzJLLHFCQUFQLENBQTZCLFlBQU07QUFDM0MsVUFBTW1CLFNBQVNaLFVBQVVVLENBQVYsRUFBYTVMLE9BQU8ySCxXQUFwQixDQUFmO0FBQ0EsVUFBTW9FLFNBQVNiLFVBQVV6QixDQUFWLEVBQWF6SixPQUFPK0gsVUFBcEIsQ0FBZjs7QUFFQSxTQUFHbkMsT0FBSCxDQUFXUCxJQUFYLENBQWdCLE1BQUt5RixlQUFyQixFQUFzQyxVQUFDVSxJQUFELEVBQVU7QUFDOUMsWUFBTUcsaUJBQWlCSCxJQUF2QjtBQUNBRyx1QkFBZWhDLEtBQWYsQ0FBcUJDLFNBQXJCLG1CQUErQ21DLE1BQS9DLHVCQUF1RUQsTUFBdkU7QUFDRCxPQUhEOztBQUtBLFNBQUdsRyxPQUFILENBQVdQLElBQVgsQ0FBZ0IsTUFBSzBGLGVBQXJCLEVBQXNDLFVBQUNTLElBQUQsRUFBVTtBQUM5QyxZQUFNQyxTQUFTRCxJQUFmO0FBQ0FDLGVBQU85QixLQUFQLENBQWFDLFNBQWIsZ0JBQW9DbUMsU0FBUyxHQUE3QyxxQkFBZ0VELFNBQVMsR0FBekU7QUFDRCxPQUhEO0FBSUQsS0FiUyxDQUFWO0FBY0QsR0FyQkgsRUFzQkUsS0F0QkY7QUF3QkQsQzs7QUFHSDlMLE9BQU80SyxnQkFBUCxHQUEwQkEsZ0JBQTFCLEMiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdGZ1bmN0aW9uIGhvdERpc3Bvc2VDaHVuayhjaHVua0lkKSB7XG4gXHRcdGRlbGV0ZSBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF07XG4gXHR9XG4gXHR2YXIgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2sgPSB0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXTtcbiBcdHRoaXNbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gXHJcbiBcdGZ1bmN0aW9uIHdlYnBhY2tIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHRcdGlmKHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKSBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayhjaHVua0lkLCBtb3JlTW9kdWxlcyk7XHJcbiBcdH0gO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcclxuIFx0XHR2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuIFx0XHRzY3JpcHQudHlwZSA9IFwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiBcdFx0c2NyaXB0LmNoYXJzZXQgPSBcInV0Zi04XCI7XHJcbiBcdFx0c2NyaXB0LnNyYyA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIFwiXCIgKyBjaHVua0lkICsgXCIuXCIgKyBob3RDdXJyZW50SGFzaCArIFwiLmhvdC11cGRhdGUuanNcIjtcclxuIFx0XHRoZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkTWFuaWZlc3QocmVxdWVzdFRpbWVvdXQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XHJcbiBcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0aWYodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcIk5vIGJyb3dzZXIgc3VwcG9ydFwiKSk7XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gXHRcdFx0XHR2YXIgcmVxdWVzdFBhdGggPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzb25cIjtcclxuIFx0XHRcdFx0cmVxdWVzdC5vcGVuKFwiR0VUXCIsIHJlcXVlc3RQYXRoLCB0cnVlKTtcclxuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XHJcbiBcdFx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdHJldHVybiByZWplY3QoZXJyKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdGlmKHJlcXVlc3QucmVhZHlTdGF0ZSAhPT0gNCkgcmV0dXJuO1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnN0YXR1cyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdC8vIHRpbWVvdXRcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XHJcbiBcdFx0XHRcdFx0Ly8gbm8gdXBkYXRlIGF2YWlsYWJsZVxyXG4gXHRcdFx0XHRcdHJlc29sdmUoKTtcclxuIFx0XHRcdFx0fSBlbHNlIGlmKHJlcXVlc3Quc3RhdHVzICE9PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgIT09IDMwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG90aGVyIGZhaWx1cmVcclxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XHJcbiBcdFx0XHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRcdFx0Ly8gc3VjY2Vzc1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHR2YXIgdXBkYXRlID0gSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcbiBcdFx0XHRcdFx0XHRyZWplY3QoZSk7XHJcbiBcdFx0XHRcdFx0XHRyZXR1cm47XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdHJlc29sdmUodXBkYXRlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG5cbiBcdFxyXG4gXHRcclxuIFx0dmFyIGhvdEFwcGx5T25VcGRhdGUgPSB0cnVlO1xyXG4gXHR2YXIgaG90Q3VycmVudEhhc2ggPSBcIjUyMjZlOWE1YmY0M2MyYjA4ZDlkXCI7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XHJcbiBcdHZhciBob3RDdXJyZW50TW9kdWxlRGF0YSA9IHt9O1xyXG4gXHR2YXIgaG90Q3VycmVudENoaWxkTW9kdWxlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RDdXJyZW50UGFyZW50c1RlbXAgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIG1lID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0aWYoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcclxuIFx0XHR2YXIgZm4gPSBmdW5jdGlvbihyZXF1ZXN0KSB7XHJcbiBcdFx0XHRpZihtZS5ob3QuYWN0aXZlKSB7XHJcbiBcdFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0pIHtcclxuIFx0XHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCkgPCAwKVxyXG4gXHRcdFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLnB1c2gobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50Q2hpbGRNb2R1bGUgPSByZXF1ZXN0O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1lLmNoaWxkcmVuLmluZGV4T2YocmVxdWVzdCkgPCAwKVxyXG4gXHRcdFx0XHRcdG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XHJcbiBcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXF1ZXN0ICsgXCIpIGZyb20gZGlzcG9zZWQgbW9kdWxlIFwiICsgbW9kdWxlSWQpO1xyXG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18ocmVxdWVzdCk7XHJcbiBcdFx0fTtcclxuIFx0XHR2YXIgT2JqZWN0RmFjdG9yeSA9IGZ1bmN0aW9uIE9iamVjdEZhY3RvcnkobmFtZSkge1xyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxyXG4gXHRcdFx0XHRnZXQ6IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xyXG4gXHRcdFx0XHR9LFxyXG4gXHRcdFx0XHRzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9O1xyXG4gXHRcdH07XHJcbiBcdFx0Zm9yKHZhciBuYW1lIGluIF9fd2VicGFja19yZXF1aXJlX18pIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJiBuYW1lICE9PSBcImVcIikge1xyXG4gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIG5hbWUsIE9iamVjdEZhY3RvcnkobmFtZSkpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRmbi5lID0gZnVuY3Rpb24oY2h1bmtJZCkge1xyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInJlYWR5XCIpXHJcbiBcdFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHRob3RDaHVua3NMb2FkaW5nKys7XHJcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcclxuIFx0XHRcdFx0ZmluaXNoQ2h1bmtMb2FkaW5nKCk7XHJcbiBcdFx0XHRcdHRocm93IGVycjtcclxuIFx0XHRcdH0pO1xyXG4gXHRcclxuIFx0XHRcdGZ1bmN0aW9uIGZpbmlzaENodW5rTG9hZGluZygpIHtcclxuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xyXG4gXHRcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiKSB7XHJcbiBcdFx0XHRcdFx0aWYoIWhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSkge1xyXG4gXHRcdFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fTtcclxuIFx0XHRyZXR1cm4gZm47XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhvdCA9IHtcclxuIFx0XHRcdC8vIHByaXZhdGUgc3R1ZmZcclxuIFx0XHRcdF9hY2NlcHRlZERlcGVuZGVuY2llczoge30sXHJcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X3NlbGZBY2NlcHRlZDogZmFsc2UsXHJcbiBcdFx0XHRfc2VsZkRlY2xpbmVkOiBmYWxzZSxcclxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxyXG4gXHRcdFx0X21haW46IGhvdEN1cnJlbnRDaGlsZE1vZHVsZSAhPT0gbW9kdWxlSWQsXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxyXG4gXHRcdFx0YWN0aXZlOiB0cnVlLFxyXG4gXHRcdFx0YWNjZXB0OiBmdW5jdGlvbihkZXAsIGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwiZnVuY3Rpb25cIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZBY2NlcHRlZCA9IGRlcDtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcIm9iamVjdFwiKVxyXG4gXHRcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRcdFx0XHRob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW2RlcFtpXV0gPSBjYWxsYmFjayB8fCBmdW5jdGlvbigpIHt9O1xyXG4gXHRcdFx0XHRlbHNlXHJcbiBcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRkZWNsaW5lOiBmdW5jdGlvbihkZXApIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGRlcCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0XHRob3QuX3NlbGZEZWNsaW5lZCA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1tkZXBbaV1dID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGlzcG9zZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZURpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3QuX2Rpc3Bvc2VIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly8gTWFuYWdlbWVudCBBUElcclxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcclxuIFx0XHRcdGFwcGx5OiBob3RBcHBseSxcclxuIFx0XHRcdHN0YXR1czogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRpZighbCkgcmV0dXJuIGhvdFN0YXR1cztcclxuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRhZGRTdGF0dXNIYW5kbGVyOiBmdW5jdGlvbihsKSB7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0cmVtb3ZlU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90U3RhdHVzSGFuZGxlcnMuaW5kZXhPZihsKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIGhvdFN0YXR1c0hhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHJcbiBcdFx0XHQvL2luaGVyaXQgZnJvbSBwcmV2aW91cyBkaXNwb3NlIGNhbGxcclxuIFx0XHRcdGRhdGE6IGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXVxyXG4gXHRcdH07XHJcbiBcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gdW5kZWZpbmVkO1xyXG4gXHRcdHJldHVybiBob3Q7XHJcbiBcdH1cclxuIFx0XHJcbiBcdHZhciBob3RTdGF0dXNIYW5kbGVycyA9IFtdO1xyXG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RTZXRTdGF0dXMobmV3U3RhdHVzKSB7XHJcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBob3RTdGF0dXNIYW5kbGVycy5sZW5ndGg7IGkrKylcclxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcclxuIFx0fVxyXG4gXHRcclxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlcyA9IDA7XHJcbiBcdHZhciBob3RDaHVua3NMb2FkaW5nID0gMDtcclxuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90UmVxdWVzdGVkRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdEF2YWlsYWJsZUZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3REZWZlcnJlZDtcclxuIFx0XHJcbiBcdC8vIFRoZSB1cGRhdGUgaW5mb1xyXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gdG9Nb2R1bGVJZChpZCkge1xyXG4gXHRcdHZhciBpc051bWJlciA9ICgraWQpICsgXCJcIiA9PT0gaWQ7XHJcbiBcdFx0cmV0dXJuIGlzTnVtYmVyID8gK2lkIDogaWQ7XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENoZWNrKGFwcGx5KSB7XHJcbiBcdFx0aWYoaG90U3RhdHVzICE9PSBcImlkbGVcIikgdGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XHJcbiBcdFx0aG90QXBwbHlPblVwZGF0ZSA9IGFwcGx5O1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcImNoZWNrXCIpO1xyXG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoIXVwZGF0ZSkge1xyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0XHRcdGhvdEF2YWlsYWJsZUZpbGVzTWFwID0gdXBkYXRlLmM7XHJcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XHJcbiBcdFxyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwicHJlcGFyZVwiKTtcclxuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiBcdFx0XHRcdGhvdERlZmVycmVkID0ge1xyXG4gXHRcdFx0XHRcdHJlc29sdmU6IHJlc29sdmUsXHJcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0aG90VXBkYXRlID0ge307XHJcbiBcdFx0XHR2YXIgY2h1bmtJZCA9IDA7XHJcbiBcdFx0XHR7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9uZS1ibG9ja3NcclxuIFx0XHRcdFx0LypnbG9iYWxzIGNodW5rSWQgKi9cclxuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRpZihob3RTdGF0dXMgPT09IFwicHJlcGFyZVwiICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiYgaG90V2FpdGluZ0ZpbGVzID09PSAwKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBwcm9taXNlO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RBZGRVcGRhdGVDaHVuayhjaHVua0lkLCBtb3JlTW9kdWxlcykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdIHx8ICFob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSlcclxuIFx0XHRcdHJldHVybjtcclxuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xyXG4gXHRcdGZvcih2YXIgbW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdGhvdFVwZGF0ZVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcdGlmKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcclxuIFx0XHRcdGhvdFVwZGF0ZURvd25sb2FkZWQoKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpIHtcclxuIFx0XHRpZighaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcclxuIFx0XHRcdGhvdFdhaXRpbmdGaWxlcysrO1xyXG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdFVwZGF0ZURvd25sb2FkZWQoKSB7XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwicmVhZHlcIik7XHJcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XHJcbiBcdFx0aG90RGVmZXJyZWQgPSBudWxsO1xyXG4gXHRcdGlmKCFkZWZlcnJlZCkgcmV0dXJuO1xyXG4gXHRcdGlmKGhvdEFwcGx5T25VcGRhdGUpIHtcclxuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXHJcbiBcdFx0XHQvLyBhdm9pZCB0cmlnZ2VyaW5nIHVuY2F1Z2h0IGV4Y2VwdGlvbiB3YXJuaW5nIGluIENocm9tZS5cclxuIFx0XHRcdC8vIFNlZSBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD00NjU2NjZcclxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiBcdFx0XHRcdHJldHVybiBob3RBcHBseShob3RBcHBseU9uVXBkYXRlKTtcclxuIFx0XHRcdH0pLnRoZW4oXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKHJlc3VsdCkge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0ZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdFx0ZGVmZXJyZWQucmVqZWN0KGVycik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdCk7XHJcbiBcdFx0fSBlbHNlIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChob3RVcGRhdGUsIGlkKSkge1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHRvTW9kdWxlSWQoaWQpKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdFx0ZGVmZXJyZWQucmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH1cclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJyZWFkeVwiKSB0aHJvdyBuZXcgRXJyb3IoXCJhcHBseSgpIGlzIG9ubHkgYWxsb3dlZCBpbiByZWFkeSBzdGF0dXNcIik7XHJcbiBcdFx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiBcdFxyXG4gXHRcdHZhciBjYjtcclxuIFx0XHR2YXIgaTtcclxuIFx0XHR2YXIgajtcclxuIFx0XHR2YXIgbW9kdWxlO1xyXG4gXHRcdHZhciBtb2R1bGVJZDtcclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gZ2V0QWZmZWN0ZWRTdHVmZih1cGRhdGVNb2R1bGVJZCkge1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFt1cGRhdGVNb2R1bGVJZF07XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKS5tYXAoZnVuY3Rpb24oaWQpIHtcclxuIFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRjaGFpbjogW2lkXSxcclxuIFx0XHRcdFx0XHRpZDogaWRcclxuIFx0XHRcdFx0fTtcclxuIFx0XHRcdH0pO1xyXG4gXHRcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0XHR2YXIgcXVldWVJdGVtID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRcdHZhciBtb2R1bGVJZCA9IHF1ZXVlSXRlbS5pZDtcclxuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYobW9kdWxlLmhvdC5fbWFpbikge1xyXG4gXHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcInVuYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1vZHVsZS5wYXJlbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudElkID0gbW9kdWxlLnBhcmVudHNbaV07XHJcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdGlmKCFwYXJlbnQpIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4uY29uY2F0KFtwYXJlbnRJZF0pLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdFx0fTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYob3V0ZGF0ZWRNb2R1bGVzLmluZGV4T2YocGFyZW50SWQpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGlmKHBhcmVudC5ob3QuX2FjY2VwdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSlcclxuIFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdID0gW107XHJcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0Y29udGludWU7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XHJcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2gocGFyZW50SWQpO1xyXG4gXHRcdFx0XHRcdHF1ZXVlLnB1c2goe1xyXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdGlkOiBwYXJlbnRJZFxyXG4gXHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFxyXG4gXHRcdFx0cmV0dXJuIHtcclxuIFx0XHRcdFx0dHlwZTogXCJhY2NlcHRlZFwiLFxyXG4gXHRcdFx0XHRtb2R1bGVJZDogdXBkYXRlTW9kdWxlSWQsXHJcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxyXG4gXHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llczogb3V0ZGF0ZWREZXBlbmRlbmNpZXNcclxuIFx0XHRcdH07XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRmdW5jdGlvbiBhZGRBbGxUb1NldChhLCBiKSB7XHJcbiBcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgYi5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHR2YXIgaXRlbSA9IGJbaV07XHJcbiBcdFx0XHRcdGlmKGEuaW5kZXhPZihpdGVtKSA8IDApXHJcbiBcdFx0XHRcdFx0YS5wdXNoKGl0ZW0pO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcclxuIFx0XHQvLyB0aGUgXCJvdXRkYXRlZFwiIHN0YXR1cyBjYW4gcHJvcGFnYXRlIHRvIHBhcmVudHMgaWYgdGhleSBkb24ndCBhY2NlcHQgdGhlIGNoaWxkcmVuXHJcbiBcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xyXG4gXHRcdHZhciBhcHBsaWVkVXBkYXRlID0ge307XHJcbiBcdFxyXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XHJcbiBcdFx0XHRjb25zb2xlLndhcm4oXCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCIpO1xyXG4gXHRcdH07XHJcbiBcdFxyXG4gXHRcdGZvcih2YXIgaWQgaW4gaG90VXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlSWQgPSB0b01vZHVsZUlkKGlkKTtcclxuIFx0XHRcdFx0dmFyIHJlc3VsdDtcclxuIFx0XHRcdFx0aWYoaG90VXBkYXRlW2lkXSkge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IGdldEFmZmVjdGVkU3R1ZmYobW9kdWxlSWQpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdHJlc3VsdCA9IHtcclxuIFx0XHRcdFx0XHRcdHR5cGU6IFwiZGlzcG9zZWRcIixcclxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxyXG4gXHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0dmFyIGFib3J0RXJyb3IgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvQXBwbHkgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xyXG4gXHRcdFx0XHR2YXIgY2hhaW5JbmZvID0gXCJcIjtcclxuIFx0XHRcdFx0aWYocmVzdWx0LmNoYWluKSB7XHJcbiBcdFx0XHRcdFx0Y2hhaW5JbmZvID0gXCJcXG5VcGRhdGUgcHJvcGFnYXRpb246IFwiICsgcmVzdWx0LmNoYWluLmpvaW4oXCIgLT4gXCIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHN3aXRjaChyZXN1bHQudHlwZSkge1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJzZWxmLWRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2Ygc2VsZiBkZWNsaW5lOiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiZGVjbGluZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25EZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVEZWNsaW5lZClcclxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcIkFib3J0ZWQgYmVjYXVzZSBvZiBkZWNsaW5lZCBkZXBlbmRlbmN5OiBcIiArIHJlc3VsdC5tb2R1bGVJZCArIFwiIGluIFwiICsgcmVzdWx0LnBhcmVudElkICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJ1bmFjY2VwdGVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uVW5hY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZVVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2UgXCIgKyBtb2R1bGVJZCArIFwiIGlzIG5vdCBhY2NlcHRlZFwiICsgY2hhaW5JbmZvKTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJhY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uQWNjZXB0ZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvQXBwbHkgPSB0cnVlO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRpc3Bvc2VkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGlzcG9zZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0ZG9EaXNwb3NlID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGRlZmF1bHQ6XHJcbiBcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4Y2VwdGlvbiB0eXBlIFwiICsgcmVzdWx0LnR5cGUpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGFib3J0RXJyb3IpIHtcclxuIFx0XHRcdFx0XHRob3RTZXRTdGF0dXMoXCJhYm9ydFwiKTtcclxuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9BcHBseSkge1xyXG4gXHRcdFx0XHRcdGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdID0gaG90VXBkYXRlW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIHJlc3VsdC5vdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdFx0XHRcdGZvcihtb2R1bGVJZCBpbiByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRcdFx0XHRpZighb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKVxyXG4gXHRcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0sIHJlc3VsdC5vdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihkb0Rpc3Bvc2UpIHtcclxuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IHdhcm5VbmV4cGVjdGVkUmVxdWlyZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxyXG4gXHRcdHZhciBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gb3V0ZGF0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gJiYgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWQpXHJcbiBcdFx0XHRcdG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5wdXNoKHtcclxuIFx0XHRcdFx0XHRtb2R1bGU6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcclxuIFx0XHRcdFx0fSk7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBOb3cgaW4gXCJkaXNwb3NlXCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJkaXNwb3NlXCIpO1xyXG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdID09PSBmYWxzZSkge1xyXG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0fSk7XHJcbiBcdFxyXG4gXHRcdHZhciBpZHg7XHJcbiBcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCk7XHJcbiBcdFx0d2hpbGUocXVldWUubGVuZ3RoID4gMCkge1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBxdWV1ZS5wb3AoKTtcclxuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0aWYoIW1vZHVsZSkgY29udGludWU7XHJcbiBcdFxyXG4gXHRcdFx0dmFyIGRhdGEgPSB7fTtcclxuIFx0XHJcbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcclxuIFx0XHRcdHZhciBkaXNwb3NlSGFuZGxlcnMgPSBtb2R1bGUuaG90Ll9kaXNwb3NlSGFuZGxlcnM7XHJcbiBcdFx0XHRmb3IoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0Y2IgPSBkaXNwb3NlSGFuZGxlcnNbal07XHJcbiBcdFx0XHRcdGNiKGRhdGEpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdID0gZGF0YTtcclxuIFx0XHJcbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxyXG4gXHRcdFx0bW9kdWxlLmhvdC5hY3RpdmUgPSBmYWxzZTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcclxuIFx0XHRcdGRlbGV0ZSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHJcbiBcdFx0XHQvLyByZW1vdmUgXCJwYXJlbnRzXCIgcmVmZXJlbmNlcyBmcm9tIGFsbCBjaGlsZHJlblxyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlLmNoaWxkcmVuLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdHZhciBjaGlsZCA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlLmNoaWxkcmVuW2pdXTtcclxuIFx0XHRcdFx0aWYoIWNoaWxkKSBjb250aW51ZTtcclxuIFx0XHRcdFx0aWR4ID0gY2hpbGQucGFyZW50cy5pbmRleE9mKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aWYoaWR4ID49IDApIHtcclxuIFx0XHRcdFx0XHRjaGlsZC5wYXJlbnRzLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyByZW1vdmUgb3V0ZGF0ZWQgZGVwZW5kZW5jeSBmcm9tIG1vZHVsZSBjaGlsZHJlblxyXG4gXHRcdHZhciBkZXBlbmRlbmN5O1xyXG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gb3V0ZGF0ZWREZXBlbmRlbmNpZXMpIHtcclxuIFx0XHRcdGlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUpIHtcclxuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0XHRmb3IoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2pdO1xyXG4gXHRcdFx0XHRcdFx0aWR4ID0gbW9kdWxlLmNoaWxkcmVuLmluZGV4T2YoZGVwZW5kZW5jeSk7XHJcbiBcdFx0XHRcdFx0XHRpZihpZHggPj0gMCkgbW9kdWxlLmNoaWxkcmVuLnNwbGljZShpZHgsIDEpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm90IGluIFwiYXBwbHlcIiBwaGFzZVxyXG4gXHRcdGhvdFNldFN0YXR1cyhcImFwcGx5XCIpO1xyXG4gXHRcclxuIFx0XHRob3RDdXJyZW50SGFzaCA9IGhvdFVwZGF0ZU5ld0hhc2g7XHJcbiBcdFxyXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBhcHBsaWVkVXBkYXRlKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXBwbGllZFVwZGF0ZSwgbW9kdWxlSWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZXNbbW9kdWxlSWRdID0gYXBwbGllZFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHR9XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xyXG4gXHRcdHZhciBlcnJvciA9IG51bGw7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdHZhciBjYWxsYmFja3MgPSBbXTtcclxuIFx0XHRcdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XHJcbiBcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcclxuIFx0XHRcdFx0XHRpZihjYWxsYmFja3MuaW5kZXhPZihjYikgPj0gMCkgY29udGludWU7XHJcbiBcdFx0XHRcdFx0Y2FsbGJhY2tzLnB1c2goY2IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xyXG4gXHRcdFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcImFjY2VwdC1lcnJvcmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGRlcGVuZGVuY3lJZDogbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV0sXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcclxuIFx0XHRmb3IoaSA9IDA7IGkgPCBvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xyXG4gXHRcdFx0bW9kdWxlSWQgPSBpdGVtLm1vZHVsZTtcclxuIFx0XHRcdGhvdEN1cnJlbnRQYXJlbnRzID0gW21vZHVsZUlkXTtcclxuIFx0XHRcdHRyeSB7XHJcbiBcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpO1xyXG4gXHRcdFx0fSBjYXRjaChlcnIpIHtcclxuIFx0XHRcdFx0aWYodHlwZW9mIGl0ZW0uZXJyb3JIYW5kbGVyID09PSBcImZ1bmN0aW9uXCIpIHtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0aXRlbS5lcnJvckhhbmRsZXIoZXJyKTtcclxuIFx0XHRcdFx0XHR9IGNhdGNoKGVycjIpIHtcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcclxuIFx0XHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yLWhhbmRsZXItZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcclxuIFx0XHRcdFx0XHRcdFx0XHRvcmdpbmFsRXJyb3I6IGVyclxyXG4gXHRcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyMjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0ZXJyb3IgPSBlcnI7XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdGlmKG9wdGlvbnMub25FcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdH0pO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gaGFuZGxlIGVycm9ycyBpbiBhY2NlcHQgaGFuZGxlcnMgYW5kIHNlbGYgYWNjZXB0ZWQgbW9kdWxlIGxvYWRcclxuIFx0XHRpZihlcnJvcikge1xyXG4gXHRcdFx0aG90U2V0U3RhdHVzKFwiZmFpbFwiKTtcclxuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XHJcbiBcdFx0fVxyXG4gXHRcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XHJcbiBcdFx0XHRyZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRob3Q6IGhvdENyZWF0ZU1vZHVsZShtb2R1bGVJZCksXG4gXHRcdFx0cGFyZW50czogKGhvdEN1cnJlbnRQYXJlbnRzVGVtcCA9IGhvdEN1cnJlbnRQYXJlbnRzLCBob3RDdXJyZW50UGFyZW50cyA9IFtdLCBob3RDdXJyZW50UGFyZW50c1RlbXApLFxuIFx0XHRcdGNoaWxkcmVuOiBbXVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Fzc2V0cy9cIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gaG90Q3JlYXRlUmVxdWlyZSg0KShfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1MjI2ZTlhNWJmNDNjMmIwOGQ5ZCIsIi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzT2JqZWN0O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHsgZ2V0Q29va2llLCBzZXRDb29raWUgfSA9IHJlcXVpcmUoJy4vY29va2llcycpO1xuXG5leHBvcnQgY29uc3QgQ09MT1JfTU9ERV9DT09LSUVfTkFNRSA9ICdjb2xvci1tb2RlJztcblxuY29uc3QgZGFya01vZGVNZWRpYVF1ZXJ5ID0gd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKTtcblxuY29uc3QgZmF2aWNvbkRhcmtNb2RlU3JjID0gJy9mYXZpY29uLWRhcmsuaWNvJztcbmNvbnN0IGZhdmljb25MaWdodE1vZGVTcmMgPSAnL2Zhdmljb24uaWNvJztcblxuY29uc3Qgc2V0RmF2aWNvbiA9IChkYXJrTW9kZU9uKSA9PiB7XG4gIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwibGlua1tyZWwqPSdpY29uJ11cIik7XG4gIGxpbmsuaHJlZiA9IGRhcmtNb2RlT24gPyBmYXZpY29uRGFya01vZGVTcmMgOiBmYXZpY29uTGlnaHRNb2RlU3JjO1xufTtcblxuY29uc3QgZ2V0SXNTeXN0ZW1EYXJrTW9kZSA9ICgpID0+XG4gIHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlcztcblxuZXhwb3J0IGNvbnN0IGdldENvbG9yTW9kZSA9ICgpID0+IHtcbiAgaWYgKGdldENvb2tpZShDT0xPUl9NT0RFX0NPT0tJRV9OQU1FKSkge1xuICAgIHJldHVybiBnZXRDb29raWUoQ09MT1JfTU9ERV9DT09LSUVfTkFNRSk7XG4gIH1cblxuICByZXR1cm4gJ2F1dG8nO1xufTtcblxuY29uc3Qgc2V0Q2xhc3NOYW1lT25Cb2R5ID0gKCkgPT4ge1xuICBpZiAoXG4gICAgZ2V0Q29sb3JNb2RlKCkgPT09ICdkYXJrJyB8fFxuICAgIChnZXRDb2xvck1vZGUoKSA9PT0gJ2F1dG8nICYmIGdldElzU3lzdGVtRGFya01vZGUoKSlcbiAgKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5jbGFzc0xpc3QuYWRkKCdwcmVmZXJzLWRhcmsnKTtcbiAgfSBlbHNlIGlmIChcbiAgICBnZXRDb2xvck1vZGUoKSA9PT0gJ2xpZ2h0JyB8fFxuICAgIChnZXRDb2xvck1vZGUoKSA9PT0gJ2F1dG8nICYmICFnZXRJc1N5c3RlbURhcmtNb2RlKCkpXG4gICkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LnJlbW92ZSgncHJlZmVycy1kYXJrJyk7XG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBzZXRDb2xvck1vZGUgPSAoY29sb3JNb2RlKSA9PiB7XG4gIHNldENvb2tpZShDT0xPUl9NT0RFX0NPT0tJRV9OQU1FLCBjb2xvck1vZGUpO1xuICBzZXRDbGFzc05hbWVPbkJvZHkoKTtcbn07XG5cbmRhcmtNb2RlTWVkaWFRdWVyeS5hZGRMaXN0ZW5lcigoZSkgPT4ge1xuICBzZXRGYXZpY29uKGUubWF0Y2hlcyk7XG5cbiAgaWYgKGdldENvbG9yTW9kZSgpID09PSAnYXV0bycpIHtcbiAgICBzZXRDb2xvck1vZGUoKTtcbiAgfVxufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIHNldEZhdmljb24od2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzKTtcbiAgc2V0Q2xhc3NOYW1lT25Cb2R5KCk7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvZGFyay1tb2RlLmpzIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbDtcblxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2w7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDU1MgYW5kIFNBU1MgZmlsZXNcbmltcG9ydCAnLi9pbmRleC5zY3NzJztcblxuaW1wb3J0ICcuL2RhcmstbW9kZSc7XG5pbXBvcnQgJy4vaW1hZ2UtZm9jdXMnO1xuaW1wb3J0ICcuL3N0aWNreS1oZWFkZXInO1xuaW1wb3J0ICcuL2J1bGInO1xuaW1wb3J0ICcuL3N3aXBlJztcbmltcG9ydCAnLi9wZXJzcGVjdGl2ZSc7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2luZGV4LmpzIiwiLy8gcmVtb3ZlZCBieSBleHRyYWN0LXRleHQtd2VicGFjay1wbHVnaW5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL19zcmMvaW5kZXguc2Nzc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBkYXlzKSB7XG4gIGxldCBleHBpcmVzID0gJyc7XG4gIGlmIChkYXlzKSB7XG4gICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgIGV4cGlyZXMgPSAnOyBleHBpcmVzPScgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArICh2YWx1ZSB8fCAnJykgKyBleHBpcmVzICsgJzsgcGF0aD0vJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG4gIGNvbnN0IG5hbWVFUSA9IG5hbWUgKyAnPSc7XG4gIGNvbnN0IGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgYyA9IGNhW2ldO1xuICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgIGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvY29va2llcy5qcyIsIi8qIGVzbGludC1kaXNhYmxlIGluZGVudCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdHJhaWxpbmctc3BhY2VzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1uZXcgKi9cblxuY29uc3Qgem9vbUVudW0gPSBPYmplY3QuZnJlZXplKHtcbiAgZml0OiAxLFxuICB6b29tOiAyLFxuICBmdWxsOiAzLFxuICBmaWxsOiA0LFxufSk7XG5cbmNsYXNzIEltYWdlRm9jdXMge1xuICBjb25zdHJ1Y3RvcihlbCwgc3JjLCBjYXB0aW9uKSB7XG4gICAgdGhpcy5lbGVtZW50ID0gZWw7XG4gICAgdGhpcy5zcmMgPSBzcmM7XG4gICAgdGhpcy5jYXB0aW9uID0gY2FwdGlvbjtcbiAgICB0aGlzLnpvb21Nb2RlID0gem9vbUVudW0uZml0O1xuXG4gICAgdGhpcy5zZXR1cCgpO1xuICAgIHRoaXMuY3JlYXRlT3ZlcmxheSgpO1xuICAgIHRoaXMuYXR0YWNoRXZlbnRzKCk7XG4gIH1cblxuICBzZXR1cCgpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnaXMtZm9jdXNhYmxlJyk7XG4gIH1cblxuICBjcmVhdGVPdmVybGF5KCkge1xuICAgIHRoaXMub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCdpbWFnZUZvY3VzJyk7XG5cbiAgICB0aGlzLmltYWdlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5pbWFnZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdpbWFnZUZvY3VzX2ltYWdlQ29udGFpbmVyJyk7XG5cbiAgICBsZXQgYXNzZXQ7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50LmRhdGFzZXQuaW1hZ2VTcmMpIHtcbiAgICAgIGFzc2V0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgICBhc3NldC5jbGFzc0xpc3QuYWRkKCdpbWFnZUZvY3VzX2ltYWdlJyk7XG4gICAgICBhc3NldC5zcmMgPSB0aGlzLnNyYztcbiAgICB9IGVsc2UgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LnZpZGVvU3JjKSB7XG4gICAgICBhc3NldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgICBhc3NldC5zZXRBdHRyaWJ1dGUoJ2F1dG9wbGF5JywgdHJ1ZSk7XG4gICAgICBhc3NldC5zZXRBdHRyaWJ1dGUoJ211dGVkJywgdHJ1ZSk7XG4gICAgICBhc3NldC5zZXRBdHRyaWJ1dGUoJ2xvb3AnLCB0cnVlKTtcbiAgICAgIGNvbnN0IHZpZGVvU3JjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc291cmNlJyk7XG4gICAgICBhc3NldC5jbGFzc0xpc3QuYWRkKCdpbWFnZUZvY3VzX2ltYWdlJyk7XG4gICAgICB2aWRlb1NyYy5zcmMgPSB0aGlzLnNyYztcbiAgICAgIGFzc2V0LmFwcGVuZENoaWxkKHZpZGVvU3JjKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpbWFnZUZvY3VzX2Nsb3NlJyk7XG5cbiAgICBjb25zdCB6b29tSW5kaWNhdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgem9vbUluZGljYXRvci5jbGFzc0xpc3QuYWRkKCdpbWFnZV96b29tSW5kaWNhdG9yJyk7XG5cbiAgICB0aGlzLmltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKGFzc2V0KTtcbiAgICB0aGlzLmltYWdlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2xvc2VCdXR0b24pO1xuXG4gICAgdGhpcy5zaXplVGVzdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuc2l6ZVRlc3RDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19zaXplVGVzdENvbnRhaW5lcicpO1xuICAgIHRoaXMuc2l6ZVRlc3RDb250YWluZXIuYXBwZW5kQ2hpbGQoYXNzZXQuY2xvbmVOb2RlKCkpO1xuXG4gICAgdGhpcy5vdmVybGF5LmFwcGVuZENoaWxkKHRoaXMuaW1hZ2VDb250YWluZXIpO1xuICAgIHRoaXMub3ZlcmxheS5hcHBlbmRDaGlsZCh0aGlzLnNpemVUZXN0Q29udGFpbmVyKTtcblxuICAgIGlmICh0aGlzLmNhcHRpb24pIHtcbiAgICAgIHRoaXMuY3JlYXRlQ2FwdGlvbigpO1xuICAgIH1cblxuICAgIHRoaXMuY3JlYXRlQ29udHJvbHMoKTtcbiAgICB0aGlzLmNvbmZpZ3VyZVpvb20odGhpcy56b29tTW9kZSk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub3ZlcmxheSk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHpvb21JbmRpY2F0b3IpO1xuICB9XG5cbiAgY3JlYXRlQ29udHJvbHMoKSB7XG4gICAgdGhpcy5jb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuY29udHJvbHMuY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19jb250cm9scycpO1xuXG4gICAgdGhpcy5maXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICB0aGlzLnpvb21CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICB0aGlzLmZ1bGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICB0aGlzLmZpbGxCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgIHRoaXMuZml0QnV0dG9uLmNsYXNzTGlzdC5hZGQoXG4gICAgICAnaW1hZ2VGb2N1c19jb250cm9sRml0QnV0dG9uJyxcbiAgICAgICdpbWFnZUZvY3VzX2NvbnRyb2xCdXR0b24nLFxuICAgICk7XG4gICAgdGhpcy56b29tQnV0dG9uLmNsYXNzTGlzdC5hZGQoXG4gICAgICAnaW1hZ2VGb2N1c19jb250cm9sWm9vbUJ1dHRvbicsXG4gICAgICAnaW1hZ2VGb2N1c19jb250cm9sQnV0dG9uJyxcbiAgICApO1xuICAgIHRoaXMuZnVsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFxuICAgICAgJ2ltYWdlRm9jdXNfY29udHJvbEZ1bGxCdXR0b24nLFxuICAgICAgJ2ltYWdlRm9jdXNfY29udHJvbEJ1dHRvbicsXG4gICAgKTtcbiAgICB0aGlzLmZpbGxCdXR0b24uY2xhc3NMaXN0LmFkZChcbiAgICAgICdpbWFnZUZvY3VzX2NvbnRyb2xDb3ZlckJ1dHRvbicsXG4gICAgICAnaW1hZ2VGb2N1c19jb250cm9sQnV0dG9uJyxcbiAgICApO1xuXG4gICAgdGhpcy56b29tQnV0dG9uLnRleHRDb250ZW50ID0gJ1pvb20nO1xuICAgIHRoaXMuZml0QnV0dG9uLnRleHRDb250ZW50ID0gJ0ZpdCc7XG4gICAgdGhpcy5mdWxsQnV0dG9uLnRleHRDb250ZW50ID0gJzEwMCUnO1xuICAgIHRoaXMuZmlsbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdGaWxsJztcblxuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5maXRCdXR0b24pO1xuICAgIC8vIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy56b29tQnV0dG9uKTtcbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuZmlsbEJ1dHRvbik7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmZ1bGxCdXR0b24pO1xuXG4gICAgdGhpcy5vdmVybGF5LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbHMpO1xuICB9XG5cbiAgY3JlYXRlQ2FwdGlvbigpIHtcbiAgICBjb25zdCBjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGNhcHRpb24udGV4dENvbnRlbnQgPSB0aGlzLmNhcHRpb247XG4gICAgY2FwdGlvbi5jbGFzc0xpc3QuYWRkKCdpbWFnZUZvY3VzX2NhcHRpb24nKTtcbiAgICB0aGlzLm92ZXJsYXkuYXBwZW5kQ2hpbGQoY2FwdGlvbik7XG4gIH1cblxuICBjb25maWd1cmVab29tKHpvb21Nb2RlKSB7XG4gICAgdGhpcy56b29tTW9kZSA9IHpvb21Nb2RlO1xuICAgIGNvbnN0IGJ1dHRvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChcbiAgICAgIHRoaXMub3ZlcmxheS5xdWVyeVNlbGVjdG9yQWxsKCcuaW1hZ2VGb2N1c19jb250cm9sQnV0dG9uJyksXG4gICAgKTtcblxuICAgIGNvbnN0IGVsZW1lbnRIZWlnaHQgPSB0aGlzLnNpemVUZXN0Q29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBlbGVtZW50V2lkdGggPSB0aGlzLnNpemVUZXN0Q29udGFpbmVyLm9mZnNldFdpZHRoO1xuXG4gICAgdGhpcy5vdmVybGF5LmRhdGFzZXQuYXNwZWN0ID1cbiAgICAgIGVsZW1lbnRIZWlnaHQgPiBlbGVtZW50V2lkdGggPyAndGFsbCcgOiAnd2lkZSc7XG5cbiAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXNlbGVjdGVkJyk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy56b29tTW9kZSA9PT0gem9vbUVudW0uZml0KSB7XG4gICAgICB0aGlzLmZpdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xuICAgICAgdGhpcy5vdmVybGF5LmRhdGFzZXQuem9vbU1vZGUgPSAnZml0JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuem9vbU1vZGUgPT09IHpvb21FbnVtLnpvb20pIHtcbiAgICAgIHRoaXMuem9vbUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xuICAgICAgdGhpcy5vdmVybGF5LmRhdGFzZXQuem9vbU1vZGUgPSAnem9vbSc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpvb21Nb2RlID09PSB6b29tRW51bS5mdWxsKSB7XG4gICAgICB0aGlzLmZ1bGxCdXR0b24uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcbiAgICAgIHRoaXMub3ZlcmxheS5kYXRhc2V0Lnpvb21Nb2RlID0gJ2Z1bGwnO1xuICAgIH0gZWxzZSBpZiAodGhpcy56b29tTW9kZSA9PT0gem9vbUVudW0uZmlsbCkge1xuICAgICAgdGhpcy5maWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XG4gICAgICB0aGlzLm92ZXJsYXkuZGF0YXNldC56b29tTW9kZSA9ICdmaWxsJztcbiAgICB9XG4gIH1cblxuICBhdHRhY2hFdmVudHMoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgdGhhdC5vcGVuT3ZlcmxheSgpO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgdGhhdC5jbG9zZU92ZXJsYXkoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoYXQuY2xvc2VPdmVybGF5KCk7XG4gICAgICB9LFxuICAgICAgdHJ1ZSxcbiAgICApO1xuXG4gICAgdGhpcy56b29tQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgdGhpcy5jb25maWd1cmVab29tLmJpbmQodGhpcywgem9vbUVudW0uem9vbSksXG4gICAgKTtcbiAgICB0aGlzLmZ1bGxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICB0aGlzLmNvbmZpZ3VyZVpvb20uYmluZCh0aGlzLCB6b29tRW51bS5mdWxsKSxcbiAgICApO1xuICAgIHRoaXMuZml0QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgdGhpcy5jb25maWd1cmVab29tLmJpbmQodGhpcywgem9vbUVudW0uZml0KSxcbiAgICApO1xuICAgIHRoaXMuZmlsbEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIHRoaXMuY29uZmlndXJlWm9vbS5iaW5kKHRoaXMsIHpvb21FbnVtLmZpbGwpLFxuICAgICk7XG4gIH1cblxuICBvcGVuT3ZlcmxheSgpIHtcbiAgICB0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaXMtb3BlbicpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdodG1sJylbMF0uY2xhc3NMaXN0LmFkZCgnaGFzLW9wZW4tb3ZlcmxheScpO1xuICB9XG5cbiAgY2xvc2VPdmVybGF5KCkge1xuICAgIHRoaXMub3ZlcmxheS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuJyk7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaHRtbCcpWzBdXG4gICAgICAuY2xhc3NMaXN0LnJlbW92ZSgnaGFzLW9wZW4tb3ZlcmxheScpO1xuICB9XG59XG5cbmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1pbWFnZS1mb2N1cycpLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgY29uc3Qgc3JjID0gZWxlbWVudC5kYXRhc2V0LmltYWdlU3JjIHx8IGVsZW1lbnQuZGF0YXNldC52aWRlb1NyYztcbiAgbmV3IEltYWdlRm9jdXMoZWxlbWVudCwgc3JjLCBlbGVtZW50LmRhdGFzZXQuY2FwdGlvbik7XG59KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvaW1hZ2UtZm9jdXMuanMiLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1uZXcgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG5cbmNsYXNzIFN0aWNreUhlYWRlciB7XG4gIGNvbnN0cnVjdG9yKGVsLCB0ZXN0RWxDbGFzcykge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmhhc1Njcm9sbGVkID0gZmFsc2U7XG4gICAgdGhpcy5kZWZhdWx0U2Nyb2xsdmFsdWUgPSAzMDA7XG5cbiAgICBpZiAodGVzdEVsQ2xhc3MpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFNjcm9sbHZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0ZXN0RWxDbGFzcykub2Zmc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIHRoaXMuc2V0dXBTY3JvbGxFdmVudCgpO1xuICAgIHRoaXMuY2hlY2tTY3JvbGxQb3NpdGlvbigpO1xuICB9XG5cbiAgc2V0dXBTY3JvbGxFdmVudCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5jaGVja1Njcm9sbFBvc2l0aW9uLmJpbmQodGhpcykpO1xuICB9XG5cbiAgY2hlY2tTY3JvbGxQb3NpdGlvbigpIHtcbiAgICBpZiAod2luZG93LnNjcm9sbFkgPiB0aGlzLmRlZmF1bHRTY3JvbGx2YWx1ZSAmJiB0aGlzLmhhc1Njcm9sbGVkID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5oYXNTY3JvbGxlZCA9IHRydWU7XG4gICAgICB0aGlzLnNldHVwRm9yU2Nyb2xsZWQodHJ1ZSk7XG4gICAgfSBlbHNlIGlmICh3aW5kb3cuc2Nyb2xsWSA8IHRoaXMuZGVmYXVsdFNjcm9sbHZhbHVlICYmIHRoaXMuaGFzU2Nyb2xsZWQgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuaGFzU2Nyb2xsZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2V0dXBGb3JTY3JvbGxlZChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBGb3JTY3JvbGxlZChpc1Njcm9sbGVkKSB7XG4gICAgaWYgKGlzU2Nyb2xsZWQpIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnaXMtc2Nyb2xsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zY3JvbGxlZCcpO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuU3RpY2t5SGVhZGVyID0gU3RpY2t5SGVhZGVyO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9zdGlja3ktaGVhZGVyLmpzIiwiY29uc3QgeyBnZXRDb2xvck1vZGUsIHNldENvbG9yTW9kZSB9ID0gcmVxdWlyZSgnLi9kYXJrLW1vZGUnKTtcblxuY2xhc3MgQnVsYiB7XG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuYnV0dG9uID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtYnVsYi1idXR0b24nKVswXTtcbiAgICB0aGlzLmljb25zID0ge1xuICAgICAgbGlnaHQ6IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWJ1bGItb24nKVswXSxcbiAgICAgIGRhcms6IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWJ1bGItb2ZmJylbMF0sXG4gICAgICBhdXRvOiBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1idWxiLWF1dG8nKVswXSxcbiAgICB9O1xuICAgIHRoaXMuc2V0Q29sb3JNb2RlKCk7XG5cbiAgICBjb25zdCBkYXJrTW9kZU1lZGlhUXVlcnkgPSB3aW5kb3cubWF0Y2hNZWRpYShcbiAgICAgICcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJyxcbiAgICApO1xuICAgIGRhcmtNb2RlTWVkaWFRdWVyeS5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICB0aGlzLnNldENvbG9yTW9kZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5jb2xvck1vZGUgPT09ICdkYXJrJykge1xuICAgICAgICB0aGlzLnNldENvbG9yTW9kZSgnbGlnaHQnKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jb2xvck1vZGUgPT09ICdsaWdodCcpIHtcbiAgICAgICAgdGhpcy5zZXRDb2xvck1vZGUoJ2F1dG8nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0Q29sb3JNb2RlKCdkYXJrJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnNldENvbG9yTW9kZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgc2V0Q29sb3JNb2RlKGNvbG9yTW9kZSkge1xuICAgIGlmIChjb2xvck1vZGUpIHtcbiAgICAgIHRoaXMuY29sb3JNb2RlID0gY29sb3JNb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNvbG9yTW9kZSA9IGdldENvbG9yTW9kZSgpO1xuICAgIH1cblxuICAgIHNldENvbG9yTW9kZSh0aGlzLmNvbG9yTW9kZSk7XG5cbiAgICB0aGlzLnNldEljb25WaXNpYmxlKCk7XG4gIH1cblxuICBzZXRJY29uVmlzaWJsZSgpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmljb25zKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBpZiAoayA9PT0gdGhpcy5jb2xvck1vZGUpIHtcbiAgICAgICAgdGhpcy5pY29uc1trXS5jbGFzc0xpc3QuYWRkKCdpcy12aXNpYmxlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmljb25zW2tdLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLXZpc2libGUnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG53aW5kb3cuQnVsYiA9IEJ1bGI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2J1bGIuanMiLCJpbXBvcnQgdGhyb3R0bGUgZnJvbSAnbG9kYXNoL3Rocm90dGxlJztcblxuY29uc3QgaXNFbGVtZW50SW5WaWV3cG9ydCA9IChlbCkgPT4ge1xuICBjb25zdCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgcmV0dXJuIChcbiAgICByZWN0LnRvcCA+PSAwICYmXG4gICAgcmVjdC5sZWZ0ID49IDAgJiZcbiAgICByZWN0LmJvdHRvbSA8PVxuICAgICAgKHdpbmRvdy5pbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0KSAmJlxuICAgIHJlY3QucmlnaHQgPD0gKHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aClcbiAgKTtcbn07XG5cbmNsYXNzIFN3aXBlYWJsZUltYWdlIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5oYW5kbGUgPSBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1zd2lwZS1oYW5kbGUnKVswXTtcbiAgICB0aGlzLnN3aXBlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtc3dpcGUtaXRlbScpWzBdO1xuICAgIHRoaXMuc3dpcGVDaGlsZCA9IHRoaXMuc3dpcGUuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2RpdicpWzBdO1xuXG4gICAgdGhpcy5oYW5kbGVEcmFnID0gdGhpcy5oYW5kbGVEcmFnLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVEcmFnRW5kID0gdGhpcy5oYW5kbGVEcmFnRW5kLmJpbmQodGhpcyk7XG4gICAgdGhpcy5oYW5kbGVEcmFnU3RhcnQgPSB0aGlzLmhhbmRsZURyYWdTdGFydC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlU2Nyb2xsID0gdGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKTtcbiAgICB0aGlzLnRocm90dGxlZEhhbmRsZVNjcm9sbCA9IHRocm90dGxlKHRoaXMuaGFuZGxlU2Nyb2xsLCAyNTApO1xuXG4gICAgdGhpcy50aHJvdHRsZWRIYW5kbGVEcmFnID0gdGhyb3R0bGUodGhpcy5oYW5kbGVEcmFnLCAyNTApO1xuXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLmhhbmRsZURyYWcsIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0LCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5oYW5kbGVEcmFnRW5kLCBmYWxzZSk7XG5cbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZURyYWdTdGFydCwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLmhhbmRsZURyYWdFbmQsIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuaGFuZGxlRHJhZywgZmFsc2UpO1xuXG4gICAgdGhpcy5jdXJyZW50WCA9IG51bGw7XG4gICAgdGhpcy5pbml0aWFsWCA9IG51bGw7XG4gICAgdGhpcy54T2Zmc2V0ID0gdGhpcy5lbC5jbGllbnRXaWR0aCAvIDI7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMuZWwuY2xpZW50V2lkdGg7XG5cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMuaGFzQW5pbWF0ZWQgPSBmYWxzZTtcblxuICAgIGlmIChlbC5kYXRhc2V0LnN3aXBlQW5pbWF0ZSkge1xuICAgICAgdGhpcy5zZXRUcmFuc2xhdGUoMjApO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMudGhyb3R0bGVkSGFuZGxlU2Nyb2xsKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdGhpcy5oYW5kbGVTY3JvbGwsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRUcmFuc2xhdGUodGhpcy54T2Zmc2V0KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVEcmFnU3RhcnQoZSkge1xuICAgIGlmIChlLnR5cGUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgdGhpcy5pbml0aWFsWCA9IGUudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy54T2Zmc2V0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmluaXRpYWxYID0gZS5jbGllbnRYIC0gdGhpcy54T2Zmc2V0O1xuICAgIH1cblxuICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5oYW5kbGUpIHtcbiAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVEcmFnKGUpIHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgaWYgKGUudHlwZSA9PT0gJ3RvdWNobW92ZScpIHtcbiAgICAgIHRoaXMuY3VycmVudFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuaW5pdGlhbFg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFggPSBlLmNsaWVudFggLSB0aGlzLmluaXRpYWxYO1xuICAgIH1cblxuICAgIHRoaXMueE9mZnNldCA9IHRoaXMuY3VycmVudFg7XG5cbiAgICB0aGlzLnNldFRyYW5zbGF0ZSh0aGlzLmN1cnJlbnRYKTtcbiAgfVxuXG4gIGhhbmRsZURyYWdFbmQoKSB7XG4gICAgdGhpcy5pbml0aWFsWCA9IHRoaXMuY3VycmVudFg7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgfVxuXG4gIHNldFRyYW5zbGF0ZSh4KSB7XG4gICAgbGV0IGRlc2lyZWRYID0geDtcbiAgICBpZiAoZGVzaXJlZFggPCAwKSB7XG4gICAgICBkZXNpcmVkWCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGRlc2lyZWRYID4gdGhpcy53aWR0aCkge1xuICAgICAgZGVzaXJlZFggPSB0aGlzLndpZHRoO1xuICAgIH1cblxuICAgIHRoaXMuc3dpcGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHstKHRoaXMud2lkdGggLSBkZXNpcmVkWCl9cHgpYDtcbiAgICB0aGlzLnN3aXBlQ2hpbGQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt0aGlzLndpZHRoIC0gZGVzaXJlZFh9cHgpYDtcbiAgICB0aGlzLmhhbmRsZS5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlM2QoJHtkZXNpcmVkWH1weCwgMCwgMClgO1xuICB9XG5cbiAgaGFuZGxlU2Nyb2xsKCkge1xuICAgIGlmIChpc0VsZW1lbnRJblZpZXdwb3J0KHRoaXMuZWwpKSB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy50aHJvdHRsZWRIYW5kbGVTY3JvbGwpO1xuICAgICAgdGhpcy5hbmltYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgYW5pbWF0ZSgpIHtcbiAgICBpZiAodGhpcy5oYXNBbmltYXRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdGFydFRpbWU7XG4gICAgY29uc3Qgc3RhcnRPZmZzZXQgPSAyMDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IDEwMDA7XG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gdGhpcy54T2Zmc2V0O1xuXG4gICAgLyogZXNsaW50LWRpc2FibGUgKi9cbiAgICBjb25zdCBlYXNlSW5PdXRDdWJpYyA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSkgcmV0dXJuIChjIC8gMikgKiB0ICogdCAqIHQgKyBiO1xuICAgICAgcmV0dXJuIChjIC8gMikgKiAoKHQgLT0gMikgKiB0ICogdCArIDIpICsgYjtcbiAgICB9O1xuICAgIC8qIGVzbGludC1lbmFibGUgKi9cblxuICAgIGlmIChkdXJhdGlvbiA+IDApIHtcbiAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cbiAgICAgIGNvbnN0IGFuaW0gPSAodGltZXN0YW1wKSA9PiB7XG4gICAgICAgIHN0YXJ0VGltZSA9IHN0YXJ0VGltZSB8fCB0aW1lc3RhbXA7XG4gICAgICAgIGNvbnN0IGVsYXBzZWQgPSB0aW1lc3RhbXAgLSBzdGFydFRpbWU7XG4gICAgICAgIGNvbnN0IHByb2dyZXNzID0gZWFzZUluT3V0Q3ViaWMoXG4gICAgICAgICAgZWxhcHNlZCxcbiAgICAgICAgICBzdGFydE9mZnNldCxcbiAgICAgICAgICB0YXJnZXRPZmZzZXQgLSBzdGFydE9mZnNldCxcbiAgICAgICAgICBkdXJhdGlvbixcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zZXRUcmFuc2xhdGUocHJvZ3Jlc3MpO1xuICAgICAgICBpZiAoZWxhcHNlZCA8IGR1cmF0aW9uKSB7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0VHJhbnNsYXRlKHRhcmdldE9mZnNldCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0VHJhbnNsYXRlKHRhcmdldE9mZnNldCk7XG4gICAgICB0aGlzLmhhc0FuaW1hdGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LlN3aXBlYWJsZUltYWdlID0gU3dpcGVhYmxlSW1hZ2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL3N3aXBlLmpzIiwidmFyIGRlYm91bmNlID0gcmVxdWlyZSgnLi9kZWJvdW5jZScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRocm90dGxlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3Rocm90dGxlLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi9ub3cnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHRpbWVXYWl0aW5nID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZ1xuICAgICAgPyBuYXRpdmVNaW4odGltZVdhaXRpbmcsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKVxuICAgICAgOiB0aW1lV2FpdGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvZGVib3VuY2UuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciByb290ID0gcmVxdWlyZSgnLi9fcm9vdCcpO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vdztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnJlZUdsb2JhbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgYmFzZVRyaW0gPSByZXF1aXJlKCcuL19iYXNlVHJpbScpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gYmFzZVRyaW0odmFsdWUpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b051bWJlcjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qc1xuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHRyaW1tZWRFbmRJbmRleCA9IHJlcXVpcmUoJy4vX3RyaW1tZWRFbmRJbmRleCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltU3RhcnQgPSAvXlxccysvO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRyaW1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVHJpbShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZ1xuICAgID8gc3RyaW5nLnNsaWNlKDAsIHRyaW1tZWRFbmRJbmRleChzdHJpbmcpICsgMSkucmVwbGFjZShyZVRyaW1TdGFydCwgJycpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRyaW07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUcmltLmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKiogVXNlZCB0byBtYXRjaCBhIHNpbmdsZSB3aGl0ZXNwYWNlIGNoYXJhY3Rlci4gKi9cbnZhciByZVdoaXRlc3BhY2UgPSAvXFxzLztcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLnRyaW1gIGFuZCBgXy50cmltRW5kYCB0byBnZXQgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlXG4gKiBjaGFyYWN0ZXIgb2YgYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxhc3Qgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyLlxuICovXG5mdW5jdGlvbiB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSB7XG4gIHZhciBpbmRleCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgd2hpbGUgKGluZGV4LS0gJiYgcmVXaGl0ZXNwYWNlLnRlc3Qoc3RyaW5nLmNoYXJBdChpbmRleCkpKSB7fVxuICByZXR1cm4gaW5kZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJpbW1lZEVuZEluZGV4O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL190cmltbWVkRW5kSW5kZXguanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBzdHJpbmcgdXNpbmcgYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgY29udmVydGVkIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcodmFsdWUpIHtcbiAgcmV0dXJuIG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9iamVjdFRvU3RyaW5nO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY2xhc3MgUGVyc3BlY3RpdmVHcm91cCB7XG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgaWYgKCdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcmVudCA9IGVsO1xuICAgIHRoaXMuZm9yZWdyb3VuZEl0ZW1zID0gcGFyZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5qcy1wZXJzcGVjdGl2ZS1mb3JlZ3JvdW5kJyk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kSXRlbXMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXBlcnNwZWN0aXZlLWJhY2tncm91bmQnKTtcbiAgICBjb25zdCByYW5nZSA9IHBhcmVudC5kYXRhc2V0LnBlcnNwZWN0aXZlUmFuZ2UgfHwgNDA7XG4gICAgY29uc3QgY2FsY1ZhbHVlID0gKGEsIGIpID0+ICgoKGEgLyBiKSAqIHJhbmdlKSAtIChyYW5nZSAvIDIpKS50b0ZpeGVkKDEpO1xuXG4gICAgbGV0IHRpbWVvdXQ7XG5cbiAgICBwYXJlbnQuc3R5bGUucGVyc3BlY3RpdmUgPSAnMTgwMHB4JztcbiAgICBwYXJlbnQuc3R5bGUudHJhbnNmb3JtU3R5bGUgPSAncHJlc2VydmUtM2QnO1xuXG4gICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuYmFja2dyb3VuZEl0ZW1zLCAoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgYmdJdGVtID0gaXRlbTtcbiAgICAgIGJnSXRlbS5zdHlsZS50cmFuc2Zvcm1TdHlsZSA9ICdwcmVzZXJ2ZS0zZCc7XG4gICAgICBiZ0l0ZW0uc3R5bGUucGVyc3BlY3RpdmUgPSAnMTIwMHB4JztcbiAgICAgIGJnSXRlbS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAnNTAlIDUwJSc7XG4gICAgfSk7XG5cbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5mb3JlZ3JvdW5kSXRlbXMsIChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBmb3JlZ3JvdW5kSXRlbSA9IGl0ZW07XG4gICAgICBmb3JlZ3JvdW5kSXRlbS5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSAnNTAlIDUwJSc7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ21vdXNlbW92ZScsXG4gICAgICAoeyB5LCB4IH0pID0+IHtcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aW1lb3V0ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeVZhbHVlID0gY2FsY1ZhbHVlKHksIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgICAgY29uc3QgeFZhbHVlID0gY2FsY1ZhbHVlKHgsIHdpbmRvdy5pbm5lcldpZHRoKTtcblxuICAgICAgICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmZvcmVncm91bmRJdGVtcywgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcmVncm91bmRJdGVtID0gaXRlbTtcbiAgICAgICAgICAgIGZvcmVncm91bmRJdGVtLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7eFZhbHVlfXB4KSB0cmFuc2xhdGVZKCR7eVZhbHVlfXB4KWA7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5iYWNrZ3JvdW5kSXRlbXMsIChpdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBiZ0l0ZW0gPSBpdGVtO1xuICAgICAgICAgICAgYmdJdGVtLnN0eWxlLnRyYW5zZm9ybSA9IGByb3RhdGVYKCR7eFZhbHVlICogMS41fWRlZykgcm90YXRlWSgke3lWYWx1ZSAqIDEuNX1kZWcpYDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2UsXG4gICAgKTtcbiAgfVxufVxuXG53aW5kb3cuUGVyc3BlY3RpdmVHcm91cCA9IFBlcnNwZWN0aXZlR3JvdXA7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL3BlcnNwZWN0aXZlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==