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
/******/ 	var hotCurrentHash = "968a3b83fb305647d2b0"; // eslint-disable-line no-unused-vars
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

  return rect.top >= 0 && rect.left >= 0 && rect.bottom - el.clientHeight / 3 <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
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
    this.isPristine = true;

    if (el.dataset.swipeAnimate) {
      this.setTranslate(20);
      this.xOffset = 20;
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

      this.isPristine = false;

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

      if (this.hasAnimated || !this.isPristine) {
        return;
      }

      var startTime = void 0;
      var startOffset = 20;
      var duration = 1000;
      var targetOffset = this.width / 2;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOTY4YTNiODNmYjMwNTY0N2QyYjAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2RhcmstbW9kZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL19zcmMvaW5kZXguc2NzcyIsIndlYnBhY2s6Ly8vLi9fc3JjL2Nvb2tpZXMuanMiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9pbWFnZS1mb2N1cy5qcyIsIndlYnBhY2s6Ly8vLi9fc3JjL3N0aWNreS1oZWFkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vX3NyYy9idWxiLmpzIiwid2VicGFjazovLy8uL19zcmMvc3dpcGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC90aHJvdHRsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvbm93LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VUcmltLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RyaW1tZWRFbmRJbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VHZXRUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fZ2V0UmF3VGFnLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwid2VicGFjazovLy8uL19zcmMvcGVyc3BlY3RpdmUuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsImdldENvb2tpZSIsInNldENvb2tpZSIsIkNPTE9SX01PREVfQ09PS0lFX05BTUUiLCJkYXJrTW9kZU1lZGlhUXVlcnkiLCJ3aW5kb3ciLCJtYXRjaE1lZGlhIiwiZmF2aWNvbkRhcmtNb2RlU3JjIiwiZmF2aWNvbkxpZ2h0TW9kZVNyYyIsInNldEZhdmljb24iLCJkYXJrTW9kZU9uIiwibGluayIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImhyZWYiLCJnZXRJc1N5c3RlbURhcmtNb2RlIiwibWF0Y2hlcyIsImdldENvbG9yTW9kZSIsInNldENsYXNzTmFtZU9uQm9keSIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiY2xhc3NMaXN0IiwiYWRkIiwicmVtb3ZlIiwic2V0Q29sb3JNb2RlIiwiY29sb3JNb2RlIiwiYWRkTGlzdGVuZXIiLCJlIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm5hbWUiLCJ2YWx1ZSIsImRheXMiLCJleHBpcmVzIiwiZGF0ZSIsIkRhdGUiLCJzZXRUaW1lIiwiZ2V0VGltZSIsInRvVVRDU3RyaW5nIiwiY29va2llIiwibmFtZUVRIiwiY2EiLCJzcGxpdCIsImkiLCJsZW5ndGgiLCJjIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwiaW5kZXhPZiIsInpvb21FbnVtIiwiT2JqZWN0IiwiZnJlZXplIiwiZml0Iiwiem9vbSIsImZ1bGwiLCJmaWxsIiwiSW1hZ2VGb2N1cyIsImVsIiwic3JjIiwiY2FwdGlvbiIsImVsZW1lbnQiLCJ6b29tTW9kZSIsInNldHVwIiwiY3JlYXRlT3ZlcmxheSIsImF0dGFjaEV2ZW50cyIsIm92ZXJsYXkiLCJjcmVhdGVFbGVtZW50IiwiaW1hZ2VDb250YWluZXIiLCJhc3NldCIsImRhdGFzZXQiLCJpbWFnZVNyYyIsInZpZGVvU3JjIiwic2V0QXR0cmlidXRlIiwiYXBwZW5kQ2hpbGQiLCJjbG9zZUJ1dHRvbiIsInpvb21JbmRpY2F0b3IiLCJzaXplVGVzdENvbnRhaW5lciIsImNsb25lTm9kZSIsImNyZWF0ZUNhcHRpb24iLCJjcmVhdGVDb250cm9scyIsImNvbmZpZ3VyZVpvb20iLCJib2R5IiwiY29udHJvbHMiLCJmaXRCdXR0b24iLCJ6b29tQnV0dG9uIiwiZnVsbEJ1dHRvbiIsImZpbGxCdXR0b24iLCJ0ZXh0Q29udGVudCIsImJ1dHRvbnMiLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJlbGVtZW50SGVpZ2h0Iiwib2Zmc2V0SGVpZ2h0IiwiZWxlbWVudFdpZHRoIiwib2Zmc2V0V2lkdGgiLCJhc3BlY3QiLCJmb3JFYWNoIiwiYnV0dG9uIiwidGhhdCIsIm9wZW5PdmVybGF5Iiwia2V5IiwiY2xvc2VPdmVybGF5IiwiYmluZCIsIlN0aWNreUhlYWRlciIsInRlc3RFbENsYXNzIiwiaGFzU2Nyb2xsZWQiLCJkZWZhdWx0U2Nyb2xsdmFsdWUiLCJzZXR1cFNjcm9sbEV2ZW50IiwiY2hlY2tTY3JvbGxQb3NpdGlvbiIsInNjcm9sbFkiLCJzZXR1cEZvclNjcm9sbGVkIiwiaXNTY3JvbGxlZCIsIkJ1bGIiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaWNvbnMiLCJsaWdodCIsImRhcmsiLCJhdXRvIiwic2V0SWNvblZpc2libGUiLCJrZXlzIiwiayIsImlzRWxlbWVudEluVmlld3BvcnQiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsImJvdHRvbSIsImNsaWVudEhlaWdodCIsImlubmVySGVpZ2h0IiwiZG9jdW1lbnRFbGVtZW50IiwicmlnaHQiLCJpbm5lcldpZHRoIiwiY2xpZW50V2lkdGgiLCJTd2lwZWFibGVJbWFnZSIsImhhbmRsZSIsInN3aXBlIiwic3dpcGVDaGlsZCIsImhhbmRsZURyYWciLCJoYW5kbGVEcmFnRW5kIiwiaGFuZGxlRHJhZ1N0YXJ0IiwiaGFuZGxlU2Nyb2xsIiwidGhyb3R0bGVkSGFuZGxlU2Nyb2xsIiwidGhyb3R0bGVkSGFuZGxlRHJhZyIsImN1cnJlbnRYIiwiaW5pdGlhbFgiLCJ4T2Zmc2V0Iiwid2lkdGgiLCJhY3RpdmUiLCJoYXNBbmltYXRlZCIsImlzUHJpc3RpbmUiLCJzd2lwZUFuaW1hdGUiLCJzZXRUcmFuc2xhdGUiLCJvbmNlIiwidHlwZSIsInRvdWNoZXMiLCJjbGllbnRYIiwidGFyZ2V0IiwicHJldmVudERlZmF1bHQiLCJ4IiwiZGVzaXJlZFgiLCJzdHlsZSIsInRyYW5zZm9ybSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJhbmltYXRlIiwic3RhcnRUaW1lIiwic3RhcnRPZmZzZXQiLCJkdXJhdGlvbiIsInRhcmdldE9mZnNldCIsImVhc2VJbk91dEN1YmljIiwidCIsImIiLCJkIiwiYW5pbSIsInRpbWVzdGFtcCIsImVsYXBzZWQiLCJwcm9ncmVzcyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIlBlcnNwZWN0aXZlR3JvdXAiLCJwYXJlbnQiLCJmb3JlZ3JvdW5kSXRlbXMiLCJiYWNrZ3JvdW5kSXRlbXMiLCJyYW5nZSIsInBlcnNwZWN0aXZlUmFuZ2UiLCJjYWxjVmFsdWUiLCJhIiwidG9GaXhlZCIsInRpbWVvdXQiLCJwZXJzcGVjdGl2ZSIsInRyYW5zZm9ybVN0eWxlIiwiaXRlbSIsImJnSXRlbSIsInRyYW5zZm9ybU9yaWdpbiIsImZvcmVncm91bmRJdGVtIiwieSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwieVZhbHVlIiwieFZhbHVlIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLDJEQUEyRDtRQUMzRDtRQUNBO1FBQ0EsR0FBRzs7UUFFSCw0Q0FBNEM7UUFDNUM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUEsZ0RBQWdEO1FBQ2hEO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBLE1BQU07UUFDTjtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOzs7O1FBSUE7UUFDQSw4Q0FBOEM7UUFDOUM7UUFDQTtRQUNBLDRCQUE0QjtRQUM1Qiw2QkFBNkI7UUFDN0IsaUNBQWlDOztRQUVqQyx1Q0FBdUM7UUFDdkM7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUEsc0NBQXNDO1FBQ3RDO1FBQ0E7UUFDQSw2QkFBNkI7UUFDN0IsNkJBQTZCO1FBQzdCO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxvQkFBb0IsZ0JBQWdCO1FBQ3BDO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBLG9CQUFvQixnQkFBZ0I7UUFDcEM7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQSxLQUFLO1FBQ0w7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQSxLQUFLOztRQUVMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBLEtBQUs7O1FBRUw7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGlCQUFpQiw4QkFBOEI7UUFDL0M7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKOztRQUVBLG9EQUFvRDtRQUNwRDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTtRQUNKO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxtQkFBbUIsMkJBQTJCO1FBQzlDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxPQUFPO1FBQ1A7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLGtCQUFrQixjQUFjO1FBQ2hDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsTUFBTTtRQUNOO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBLGFBQWEsNEJBQTRCO1FBQ3pDO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSxNQUFNO1FBQ047O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsSUFBSTs7UUFFSjtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7O1FBRUE7UUFDQTtRQUNBLGNBQWMsNEJBQTRCO1FBQzFDO1FBQ0E7UUFDQTtR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IiwiZmlsZSI6ImFwcC5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHRmdW5jdGlvbiBob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRkZWxldGUgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuIFx0fVxuIFx0dmFyIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrID0gdGhpc1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR0aGlzW1wid2VicGFja0hvdFVwZGF0ZVwiXSA9IFxyXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGhvdEFkZFVwZGF0ZUNodW5rKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcclxuIFx0XHRpZihwYXJlbnRIb3RVcGRhdGVDYWxsYmFjaykgcGFyZW50SG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xyXG4gXHR9IDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdFx0dmFyIGhlYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XHJcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiBcdFx0c2NyaXB0LnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xyXG4gXHRcdHNjcmlwdC5zcmMgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBcIlwiICsgY2h1bmtJZCArIFwiLlwiICsgaG90Q3VycmVudEhhc2ggKyBcIi5ob3QtdXBkYXRlLmpzXCI7XHJcbiBcdFx0aGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHRyZXF1ZXN0VGltZW91dCA9IHJlcXVlc3RUaW1lb3V0IHx8IDEwMDAwO1xyXG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcclxuIFx0XHRcdGlmKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCA9PT0gXCJ1bmRlZmluZWRcIilcclxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xyXG4gXHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XHJcbiBcdFx0XHRcdHJlcXVlc3Qub3BlbihcIkdFVFwiLCByZXF1ZXN0UGF0aCwgdHJ1ZSk7XHJcbiBcdFx0XHRcdHJlcXVlc3QudGltZW91dCA9IHJlcXVlc3RUaW1lb3V0O1xyXG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XHJcbiBcdFx0XHR9IGNhdGNoKGVycikge1xyXG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXF1ZXN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRpZihyZXF1ZXN0LnJlYWR5U3RhdGUgIT09IDQpIHJldHVybjtcclxuIFx0XHRcdFx0aWYocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcclxuIFx0XHRcdFx0XHQvLyB0aW1lb3V0XHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIHRpbWVkIG91dC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2UgaWYocmVxdWVzdC5zdGF0dXMgPT09IDQwNCkge1xyXG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcclxuIFx0XHRcdFx0XHRyZXNvbHZlKCk7XHJcbiBcdFx0XHRcdH0gZWxzZSBpZihyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcclxuIFx0XHRcdFx0XHQvLyBvdGhlciBmYWlsdXJlXHJcbiBcdFx0XHRcdFx0cmVqZWN0KG5ldyBFcnJvcihcIk1hbmlmZXN0IHJlcXVlc3QgdG8gXCIgKyByZXF1ZXN0UGF0aCArIFwiIGZhaWxlZC5cIikpO1xyXG4gXHRcdFx0XHR9IGVsc2Uge1xyXG4gXHRcdFx0XHRcdC8vIHN1Y2Nlc3NcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xyXG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xyXG4gXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH07XHJcbiBcdFx0fSk7XHJcbiBcdH1cclxuXG4gXHRcclxuIFx0XHJcbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcclxuIFx0dmFyIGhvdEN1cnJlbnRIYXNoID0gXCI5NjhhM2I4M2ZiMzA1NjQ3ZDJiMFwiOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiBcdHZhciBob3RSZXF1ZXN0VGltZW91dCA9IDEwMDAwO1xyXG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcclxuIFx0dmFyIGhvdEN1cnJlbnRDaGlsZE1vZHVsZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHMgPSBbXTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdGlmKCFtZSkgcmV0dXJuIF9fd2VicGFja19yZXF1aXJlX187XHJcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xyXG4gXHRcdFx0aWYobWUuaG90LmFjdGl2ZSkge1xyXG4gXHRcdFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdKSB7XHJcbiBcdFx0XHRcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpIDwgMClcclxuIFx0XHRcdFx0XHRcdGluc3RhbGxlZE1vZHVsZXNbcmVxdWVzdF0ucGFyZW50cy5wdXNoKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0aG90Q3VycmVudENoaWxkTW9kdWxlID0gcmVxdWVzdDtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihtZS5jaGlsZHJlbi5pbmRleE9mKHJlcXVlc3QpIDwgMClcclxuIFx0XHRcdFx0XHRtZS5jaGlsZHJlbi5wdXNoKHJlcXVlc3QpO1xyXG4gXHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVxdWVzdCArIFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArIG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbXTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKHJlcXVlc3QpO1xyXG4gXHRcdH07XHJcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcclxuIFx0XHRcdFx0Z2V0OiBmdW5jdGlvbigpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXTtcclxuIFx0XHRcdFx0fSxcclxuIFx0XHRcdFx0c2V0OiBmdW5jdGlvbih2YWx1ZSkge1xyXG4gXHRcdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX19bbmFtZV0gPSB2YWx1ZTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fTtcclxuIFx0XHR9O1xyXG4gXHRcdGZvcih2YXIgbmFtZSBpbiBfX3dlYnBhY2tfcmVxdWlyZV9fKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX193ZWJwYWNrX3JlcXVpcmVfXywgbmFtZSkgJiYgbmFtZSAhPT0gXCJlXCIpIHtcclxuIFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGZuLCBuYW1lLCBPYmplY3RGYWN0b3J5KG5hbWUpKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFx0Zm4uZSA9IGZ1bmN0aW9uKGNodW5rSWQpIHtcclxuIFx0XHRcdGlmKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKVxyXG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xyXG4gXHRcdFx0aG90Q2h1bmtzTG9hZGluZysrO1xyXG4gXHRcdFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uZShjaHVua0lkKS50aGVuKGZpbmlzaENodW5rTG9hZGluZywgZnVuY3Rpb24oZXJyKSB7XHJcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xyXG4gXHRcdFx0XHR0aHJvdyBlcnI7XHJcbiBcdFx0XHR9KTtcclxuIFx0XHJcbiBcdFx0XHRmdW5jdGlvbiBmaW5pc2hDaHVua0xvYWRpbmcoKSB7XHJcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmctLTtcclxuIFx0XHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIikge1xyXG4gXHRcdFx0XHRcdGlmKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRpZihob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH07XHJcbiBcdFx0cmV0dXJuIGZuO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdHZhciBob3QgPSB7XHJcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXHJcbiBcdFx0XHRfYWNjZXB0ZWREZXBlbmRlbmNpZXM6IHt9LFxyXG4gXHRcdFx0X2RlY2xpbmVkRGVwZW5kZW5jaWVzOiB7fSxcclxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxyXG4gXHRcdFx0X3NlbGZEZWNsaW5lZDogZmFsc2UsXHJcbiBcdFx0XHRfZGlzcG9zZUhhbmRsZXJzOiBbXSxcclxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxyXG4gXHRcclxuIFx0XHRcdC8vIE1vZHVsZSBBUElcclxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcclxuIFx0XHRcdGFjY2VwdDogZnVuY3Rpb24oZGVwLCBjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRpZih0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKVxyXG4gXHRcdFx0XHRcdGhvdC5fc2VsZkFjY2VwdGVkID0gdHJ1ZTtcclxuIFx0XHRcdFx0ZWxzZSBpZih0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmQWNjZXB0ZWQgPSBkZXA7XHJcbiBcdFx0XHRcdGVsc2UgaWYodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcclxuIFx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxyXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcclxuIFx0XHRcdFx0ZWxzZVxyXG4gXHRcdFx0XHRcdGhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwXSA9IGNhbGxiYWNrIHx8IGZ1bmN0aW9uKCkge307XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0ZGVjbGluZTogZnVuY3Rpb24oZGVwKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpXHJcbiBcdFx0XHRcdFx0aG90Ll9zZWxmRGVjbGluZWQgPSB0cnVlO1xyXG4gXHRcdFx0XHRlbHNlIGlmKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXHJcbiBcdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGRlcC5sZW5ndGg7IGkrKylcclxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XHJcbiBcdFx0XHRcdGVsc2VcclxuIFx0XHRcdFx0XHRob3QuX2RlY2xpbmVkRGVwZW5kZW5jaWVzW2RlcF0gPSB0cnVlO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGRpc3Bvc2U6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XHJcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdGFkZERpc3Bvc2VIYW5kbGVyOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gXHRcdFx0XHRob3QuX2Rpc3Bvc2VIYW5kbGVycy5wdXNoKGNhbGxiYWNrKTtcclxuIFx0XHRcdH0sXHJcbiBcdFx0XHRyZW1vdmVEaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdC5fZGlzcG9zZUhhbmRsZXJzLmluZGV4T2YoY2FsbGJhY2spO1xyXG4gXHRcdFx0XHRpZihpZHggPj0gMCkgaG90Ll9kaXNwb3NlSGFuZGxlcnMuc3BsaWNlKGlkeCwgMSk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcclxuIFx0XHRcdC8vIE1hbmFnZW1lbnQgQVBJXHJcbiBcdFx0XHRjaGVjazogaG90Q2hlY2ssXHJcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXHJcbiBcdFx0XHRzdGF0dXM6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0aWYoIWwpIHJldHVybiBob3RTdGF0dXM7XHJcbiBcdFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzLnB1c2gobCk7XHJcbiBcdFx0XHR9LFxyXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xyXG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xyXG4gXHRcdFx0fSxcclxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcclxuIFx0XHRcdFx0dmFyIGlkeCA9IGhvdFN0YXR1c0hhbmRsZXJzLmluZGV4T2YobCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdH0sXHJcbiBcdFxyXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXHJcbiBcdFx0XHRkYXRhOiBob3RDdXJyZW50TW9kdWxlRGF0YVttb2R1bGVJZF1cclxuIFx0XHR9O1xyXG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcclxuIFx0XHRyZXR1cm4gaG90O1xyXG4gXHR9XHJcbiBcdFxyXG4gXHR2YXIgaG90U3RhdHVzSGFuZGxlcnMgPSBbXTtcclxuIFx0dmFyIGhvdFN0YXR1cyA9IFwiaWRsZVwiO1xyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90U2V0U3RhdHVzKG5ld1N0YXR1cykge1xyXG4gXHRcdGhvdFN0YXR1cyA9IG5ld1N0YXR1cztcclxuIFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaG90U3RhdHVzSGFuZGxlcnMubGVuZ3RoOyBpKyspXHJcbiBcdFx0XHRob3RTdGF0dXNIYW5kbGVyc1tpXS5jYWxsKG51bGwsIG5ld1N0YXR1cyk7XHJcbiBcdH1cclxuIFx0XHJcbiBcdC8vIHdoaWxlIGRvd25sb2FkaW5nXHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xyXG4gXHR2YXIgaG90Q2h1bmtzTG9hZGluZyA9IDA7XHJcbiBcdHZhciBob3RXYWl0aW5nRmlsZXNNYXAgPSB7fTtcclxuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XHJcbiBcdHZhciBob3RBdmFpbGFibGVGaWxlc01hcCA9IHt9O1xyXG4gXHR2YXIgaG90RGVmZXJyZWQ7XHJcbiBcdFxyXG4gXHQvLyBUaGUgdXBkYXRlIGluZm9cclxuIFx0dmFyIGhvdFVwZGF0ZSwgaG90VXBkYXRlTmV3SGFzaDtcclxuIFx0XHJcbiBcdGZ1bmN0aW9uIHRvTW9kdWxlSWQoaWQpIHtcclxuIFx0XHR2YXIgaXNOdW1iZXIgPSAoK2lkKSArIFwiXCIgPT09IGlkO1xyXG4gXHRcdHJldHVybiBpc051bWJlciA/ICtpZCA6IGlkO1xyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RDaGVjayhhcHBseSkge1xyXG4gXHRcdGlmKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpIHRocm93IG5ldyBFcnJvcihcImNoZWNrKCkgaXMgb25seSBhbGxvd2VkIGluIGlkbGUgc3RhdHVzXCIpO1xyXG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJjaGVja1wiKTtcclxuIFx0XHRyZXR1cm4gaG90RG93bmxvYWRNYW5pZmVzdChob3RSZXF1ZXN0VGltZW91dCkudGhlbihmdW5jdGlvbih1cGRhdGUpIHtcclxuIFx0XHRcdGlmKCF1cGRhdGUpIHtcclxuIFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcCA9IHt9O1xyXG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XHJcbiBcdFx0XHRob3RBdmFpbGFibGVGaWxlc01hcCA9IHVwZGF0ZS5jO1xyXG4gXHRcdFx0aG90VXBkYXRlTmV3SGFzaCA9IHVwZGF0ZS5oO1xyXG4gXHRcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcInByZXBhcmVcIik7XHJcbiBcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xyXG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcclxuIFx0XHRcdFx0XHRyZXNvbHZlOiByZXNvbHZlLFxyXG4gXHRcdFx0XHRcdHJlamVjdDogcmVqZWN0XHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdGhvdFVwZGF0ZSA9IHt9O1xyXG4gXHRcdFx0dmFyIGNodW5rSWQgPSAwO1xyXG4gXHRcdFx0eyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXHJcbiBcdFx0XHRcdC8qZ2xvYmFscyBjaHVua0lkICovXHJcbiBcdFx0XHRcdGhvdEVuc3VyZVVwZGF0ZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdFx0aWYoaG90U3RhdHVzID09PSBcInByZXBhcmVcIiAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwICYmIGhvdFdhaXRpbmdGaWxlcyA9PT0gMCkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0XHR9XHJcbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcclxuIFx0XHR9KTtcclxuIFx0fVxyXG4gXHRcclxuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gXHRcdGlmKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXHJcbiBcdFx0XHRyZXR1cm47XHJcbiBcdFx0aG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0gPSBmYWxzZTtcclxuIFx0XHRmb3IodmFyIG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRob3RVcGRhdGVbbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHRpZigtLWhvdFdhaXRpbmdGaWxlcyA9PT0gMCAmJiBob3RDaHVua3NMb2FkaW5nID09PSAwKSB7XHJcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKSB7XHJcbiBcdFx0aWYoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0gPSB0cnVlO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XHJcbiBcdFx0XHRob3RXYWl0aW5nRmlsZXMrKztcclxuIFx0XHRcdGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XHJcbiBcdFx0fVxyXG4gXHR9XHJcbiBcdFxyXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xyXG4gXHRcdGhvdFNldFN0YXR1cyhcInJlYWR5XCIpO1xyXG4gXHRcdHZhciBkZWZlcnJlZCA9IGhvdERlZmVycmVkO1xyXG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcclxuIFx0XHRpZighZGVmZXJyZWQpIHJldHVybjtcclxuIFx0XHRpZihob3RBcHBseU9uVXBkYXRlKSB7XHJcbiBcdFx0XHQvLyBXcmFwIGRlZmVycmVkIG9iamVjdCBpbiBQcm9taXNlIHRvIG1hcmsgaXQgYXMgYSB3ZWxsLWhhbmRsZWQgUHJvbWlzZSB0b1xyXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXHJcbiBcdFx0XHQvLyBTZWUgaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NDY1NjY2XHJcbiBcdFx0XHRQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCkge1xyXG4gXHRcdFx0XHRyZXR1cm4gaG90QXBwbHkoaG90QXBwbHlPblVwZGF0ZSk7XHJcbiBcdFx0XHR9KS50aGVuKFxyXG4gXHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcclxuIFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XHJcbiBcdFx0XHRcdH0sXHJcbiBcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xyXG4gXHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHQpO1xyXG4gXHRcdH0gZWxzZSB7XHJcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcclxuIFx0XHRcdFx0XHRvdXRkYXRlZE1vZHVsZXMucHVzaCh0b01vZHVsZUlkKGlkKSk7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHRcdGRlZmVycmVkLnJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHR9XHJcbiBcdH1cclxuIFx0XHJcbiBcdGZ1bmN0aW9uIGhvdEFwcGx5KG9wdGlvbnMpIHtcclxuIFx0XHRpZihob3RTdGF0dXMgIT09IFwicmVhZHlcIikgdGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xyXG4gXHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgY2I7XHJcbiBcdFx0dmFyIGk7XHJcbiBcdFx0dmFyIGo7XHJcbiBcdFx0dmFyIG1vZHVsZTtcclxuIFx0XHR2YXIgbW9kdWxlSWQ7XHJcbiBcdFxyXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcclxuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbdXBkYXRlTW9kdWxlSWRdO1xyXG4gXHRcdFx0dmFyIG91dGRhdGVkRGVwZW5kZW5jaWVzID0ge307XHJcbiBcdFxyXG4gXHRcdFx0dmFyIHF1ZXVlID0gb3V0ZGF0ZWRNb2R1bGVzLnNsaWNlKCkubWFwKGZ1bmN0aW9uKGlkKSB7XHJcbiBcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXHJcbiBcdFx0XHRcdFx0aWQ6IGlkXHJcbiBcdFx0XHRcdH07XHJcbiBcdFx0XHR9KTtcclxuIFx0XHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xyXG4gXHRcdFx0XHR2YXIgbW9kdWxlSWQgPSBxdWV1ZUl0ZW0uaWQ7XHJcbiBcdFx0XHRcdHZhciBjaGFpbiA9IHF1ZXVlSXRlbS5jaGFpbjtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdGlmKCFtb2R1bGUgfHwgbW9kdWxlLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRpZihtb2R1bGUuaG90Ll9zZWxmRGVjbGluZWQpIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWRlY2xpbmVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKG1vZHVsZS5ob3QuX21haW4pIHtcclxuIFx0XHRcdFx0XHRyZXR1cm4ge1xyXG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXHJcbiBcdFx0XHRcdFx0XHRjaGFpbjogY2hhaW4sXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnRJZCA9IG1vZHVsZS5wYXJlbnRzW2ldO1xyXG4gXHRcdFx0XHRcdHZhciBwYXJlbnQgPSBpbnN0YWxsZWRNb2R1bGVzW3BhcmVudElkXTtcclxuIFx0XHRcdFx0XHRpZighcGFyZW50KSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwiZGVjbGluZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRwYXJlbnRJZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHRcdH07XHJcbiBcdFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRcdGlmKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSA+PSAwKSBjb250aW51ZTtcclxuIFx0XHRcdFx0XHRpZihwYXJlbnQuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcclxuIFx0XHRcdFx0XHRcdGlmKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXHJcbiBcdFx0XHRcdFx0XHRcdG91dGRhdGVkRGVwZW5kZW5jaWVzW3BhcmVudElkXSA9IFtdO1xyXG4gXHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdLCBbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHRkZWxldGUgb3V0ZGF0ZWREZXBlbmRlbmNpZXNbcGFyZW50SWRdO1xyXG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcclxuIFx0XHRcdFx0XHRxdWV1ZS5wdXNoKHtcclxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbi5jb25jYXQoW3BhcmVudElkXSksXHJcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcclxuIFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcclxuIFx0XHRcdHJldHVybiB7XHJcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcclxuIFx0XHRcdFx0bW9kdWxlSWQ6IHVwZGF0ZU1vZHVsZUlkLFxyXG4gXHRcdFx0XHRvdXRkYXRlZE1vZHVsZXM6IG91dGRhdGVkTW9kdWxlcyxcclxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXHJcbiBcdFx0XHR9O1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0ZnVuY3Rpb24gYWRkQWxsVG9TZXQoYSwgYikge1xyXG4gXHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0dmFyIGl0ZW0gPSBiW2ldO1xyXG4gXHRcdFx0XHRpZihhLmluZGV4T2YoaXRlbSkgPCAwKVxyXG4gXHRcdFx0XHRcdGEucHVzaChpdGVtKTtcclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGF0IGJlZ2luIGFsbCB1cGRhdGVzIG1vZHVsZXMgYXJlIG91dGRhdGVkXHJcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxyXG4gXHRcdHZhciBvdXRkYXRlZERlcGVuZGVuY2llcyA9IHt9O1xyXG4gXHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcclxuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xyXG4gXHRcclxuIFx0XHR2YXIgd2FyblVuZXhwZWN0ZWRSZXF1aXJlID0gZnVuY3Rpb24gd2FyblVuZXhwZWN0ZWRSZXF1aXJlKCkge1xyXG4gXHRcdFx0Y29uc29sZS53YXJuKFwiW0hNUl0gdW5leHBlY3RlZCByZXF1aXJlKFwiICsgcmVzdWx0Lm1vZHVsZUlkICsgXCIpIHRvIGRpc3Bvc2VkIG1vZHVsZVwiKTtcclxuIFx0XHR9O1xyXG4gXHRcclxuIFx0XHRmb3IodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGhvdFVwZGF0ZSwgaWQpKSB7XHJcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XHJcbiBcdFx0XHRcdHZhciByZXN1bHQ7XHJcbiBcdFx0XHRcdGlmKGhvdFVwZGF0ZVtpZF0pIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSBnZXRBZmZlY3RlZFN0dWZmKG1vZHVsZUlkKTtcclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XHJcbiBcdFx0XHRcdFx0XHR0eXBlOiBcImRpc3Bvc2VkXCIsXHJcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogaWRcclxuIFx0XHRcdFx0XHR9O1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0FwcGx5ID0gZmFsc2U7XHJcbiBcdFx0XHRcdHZhciBkb0Rpc3Bvc2UgPSBmYWxzZTtcclxuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XHJcbiBcdFx0XHRcdGlmKHJlc3VsdC5jaGFpbikge1xyXG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRzd2l0Y2gocmVzdWx0LnR5cGUpIHtcclxuIFx0XHRcdFx0XHRjYXNlIFwic2VsZi1kZWNsaW5lZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGlmKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIG9mIHNlbGYgZGVjbGluZTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBjaGFpbkluZm8pO1xyXG4gXHRcdFx0XHRcdFx0YnJlYWs7XHJcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25EZWNsaW5lZChyZXN1bHQpO1xyXG4gXHRcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXHJcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIiBpbiBcIiArIHJlc3VsdC5wYXJlbnRJZCArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vblVuYWNjZXB0ZWQpXHJcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25VbmFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVVbmFjY2VwdGVkKVxyXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mbyk7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRjYXNlIFwiYWNjZXB0ZWRcIjpcclxuIFx0XHRcdFx0XHRcdGlmKG9wdGlvbnMub25BY2NlcHRlZClcclxuIFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XHJcbiBcdFx0XHRcdFx0XHRkb0FwcGx5ID0gdHJ1ZTtcclxuIFx0XHRcdFx0XHRcdGJyZWFrO1xyXG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxyXG4gXHRcdFx0XHRcdFx0aWYob3B0aW9ucy5vbkRpc3Bvc2VkKVxyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRGlzcG9zZWQocmVzdWx0KTtcclxuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XHJcbiBcdFx0XHRcdFx0XHRicmVhaztcclxuIFx0XHRcdFx0XHRkZWZhdWx0OlxyXG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRpZihhYm9ydEVycm9yKSB7XHJcbiBcdFx0XHRcdFx0aG90U2V0U3RhdHVzKFwiYWJvcnRcIik7XHJcbiBcdFx0XHRcdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGFib3J0RXJyb3IpO1xyXG4gXHRcdFx0XHR9XHJcbiBcdFx0XHRcdGlmKGRvQXBwbHkpIHtcclxuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCByZXN1bHQub3V0ZGF0ZWRNb2R1bGVzKTtcclxuIFx0XHRcdFx0XHRmb3IobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0XHRcdFx0aWYoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcclxuIFx0XHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF0gPSBbXTtcclxuIFx0XHRcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLCByZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKTtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdFx0aWYoZG9EaXNwb3NlKSB7XHJcbiBcdFx0XHRcdFx0YWRkQWxsVG9TZXQob3V0ZGF0ZWRNb2R1bGVzLCBbcmVzdWx0Lm1vZHVsZUlkXSk7XHJcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIFN0b3JlIHNlbGYgYWNjZXB0ZWQgb3V0ZGF0ZWQgbW9kdWxlcyB0byByZXF1aXJlIHRoZW0gbGF0ZXIgYnkgdGhlIG1vZHVsZSBzeXN0ZW1cclxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdICYmIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkKVxyXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XHJcbiBcdFx0XHRcdFx0bW9kdWxlOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRlcnJvckhhbmRsZXI6IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmhvdC5fc2VsZkFjY2VwdGVkXHJcbiBcdFx0XHRcdH0pO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiZGlzcG9zZVwiKTtcclxuIFx0XHRPYmplY3Qua2V5cyhob3RBdmFpbGFibGVGaWxlc01hcCkuZm9yRWFjaChmdW5jdGlvbihjaHVua0lkKSB7XHJcbiBcdFx0XHRpZihob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSA9PT0gZmFsc2UpIHtcclxuIFx0XHRcdFx0aG90RGlzcG9zZUNodW5rKGNodW5rSWQpO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH0pO1xyXG4gXHRcclxuIFx0XHR2YXIgaWR4O1xyXG4gXHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpO1xyXG4gXHRcdHdoaWxlKHF1ZXVlLmxlbmd0aCA+IDApIHtcclxuIFx0XHRcdG1vZHVsZUlkID0gcXVldWUucG9wKCk7XHJcbiBcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdGlmKCFtb2R1bGUpIGNvbnRpbnVlO1xyXG4gXHRcclxuIFx0XHRcdHZhciBkYXRhID0ge307XHJcbiBcdFxyXG4gXHRcdFx0Ly8gQ2FsbCBkaXNwb3NlIGhhbmRsZXJzXHJcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xyXG4gXHRcdFx0Zm9yKGogPSAwOyBqIDwgZGlzcG9zZUhhbmRsZXJzLmxlbmd0aDsgaisrKSB7XHJcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xyXG4gXHRcdFx0XHRjYihkYXRhKTtcclxuIFx0XHRcdH1cclxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gZGlzYWJsZSBtb2R1bGUgKHRoaXMgZGlzYWJsZXMgcmVxdWlyZXMgZnJvbSB0aGlzIG1vZHVsZSlcclxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIG1vZHVsZSBmcm9tIGNhY2hlXHJcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFxyXG4gXHRcdFx0Ly8gcmVtb3ZlIFwicGFyZW50c1wiIHJlZmVyZW5jZXMgZnJvbSBhbGwgY2hpbGRyZW5cclxuIFx0XHRcdGZvcihqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xyXG4gXHRcdFx0XHR2YXIgY2hpbGQgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZS5jaGlsZHJlbltqXV07XHJcbiBcdFx0XHRcdGlmKCFjaGlsZCkgY29udGludWU7XHJcbiBcdFx0XHRcdGlkeCA9IGNoaWxkLnBhcmVudHMuaW5kZXhPZihtb2R1bGVJZCk7XHJcbiBcdFx0XHRcdGlmKGlkeCA+PSAwKSB7XHJcbiBcdFx0XHRcdFx0Y2hpbGQucGFyZW50cy5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cclxuIFx0XHR2YXIgZGVwZW5kZW5jeTtcclxuIFx0XHR2YXIgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXM7XHJcbiBcdFx0Zm9yKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XHJcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3V0ZGF0ZWREZXBlbmRlbmNpZXMsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcclxuIFx0XHRcdFx0aWYobW9kdWxlKSB7XHJcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdFx0Zm9yKGogPSAwOyBqIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBqKyspIHtcclxuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcclxuIFx0XHRcdFx0XHRcdGlkeCA9IG1vZHVsZS5jaGlsZHJlbi5pbmRleE9mKGRlcGVuZGVuY3kpO1xyXG4gXHRcdFx0XHRcdFx0aWYoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcclxuIFx0XHRob3RTZXRTdGF0dXMoXCJhcHBseVwiKTtcclxuIFx0XHJcbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xyXG4gXHRcclxuIFx0XHQvLyBpbnNlcnQgbmV3IGNvZGVcclxuIFx0XHRmb3IobW9kdWxlSWQgaW4gYXBwbGllZFVwZGF0ZSkge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xyXG4gXHRcdFx0XHRtb2R1bGVzW21vZHVsZUlkXSA9IGFwcGxpZWRVcGRhdGVbbW9kdWxlSWRdO1xyXG4gXHRcdFx0fVxyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0Ly8gY2FsbCBhY2NlcHQgaGFuZGxlcnNcclxuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xyXG4gXHRcdGZvcihtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xyXG4gXHRcdFx0aWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZCkpIHtcclxuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XHJcbiBcdFx0XHRcdG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzID0gb3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdO1xyXG4gXHRcdFx0XHR2YXIgY2FsbGJhY2tzID0gW107XHJcbiBcdFx0XHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHRcdFx0ZGVwZW5kZW5jeSA9IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldO1xyXG4gXHRcdFx0XHRcdGNiID0gbW9kdWxlLmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbZGVwZW5kZW5jeV07XHJcbiBcdFx0XHRcdFx0aWYoY2FsbGJhY2tzLmluZGV4T2YoY2IpID49IDApIGNvbnRpbnVlO1xyXG4gXHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcclxuIFx0XHRcdFx0fVxyXG4gXHRcdFx0XHRmb3IoaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuIFx0XHRcdFx0XHRjYiA9IGNhbGxiYWNrc1tpXTtcclxuIFx0XHRcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRcdFx0Y2IobW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMpO1xyXG4gXHRcdFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJhY2NlcHQtZXJyb3JlZFwiLFxyXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcclxuIFx0XHRcdFx0XHRcdFx0XHRkZXBlbmRlbmN5SWQ6IG1vZHVsZU91dGRhdGVkRGVwZW5kZW5jaWVzW2ldLFxyXG4gXHRcdFx0XHRcdFx0XHRcdGVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIExvYWQgc2VsZiBhY2NlcHRlZCBtb2R1bGVzXHJcbiBcdFx0Zm9yKGkgPSAwOyBpIDwgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XHJcbiBcdFx0XHR2YXIgaXRlbSA9IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlc1tpXTtcclxuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XHJcbiBcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XHJcbiBcdFx0XHR0cnkge1xyXG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcclxuIFx0XHRcdH0gY2F0Y2goZXJyKSB7XHJcbiBcdFx0XHRcdGlmKHR5cGVvZiBpdGVtLmVycm9ySGFuZGxlciA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiBcdFx0XHRcdFx0dHJ5IHtcclxuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XHJcbiBcdFx0XHRcdFx0fSBjYXRjaChlcnIyKSB7XHJcbiBcdFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0XHRvcHRpb25zLm9uRXJyb3JlZCh7XHJcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXHJcbiBcdFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVycjIsXHJcbiBcdFx0XHRcdFx0XHRcdFx0b3JnaW5hbEVycm9yOiBlcnJcclxuIFx0XHRcdFx0XHRcdFx0fSk7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XHJcbiBcdFx0XHRcdFx0XHRcdGlmKCFlcnJvcilcclxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjI7XHJcbiBcdFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0XHRpZighZXJyb3IpXHJcbiBcdFx0XHRcdFx0XHRcdGVycm9yID0gZXJyO1xyXG4gXHRcdFx0XHRcdH1cclxuIFx0XHRcdFx0fSBlbHNlIHtcclxuIFx0XHRcdFx0XHRpZihvcHRpb25zLm9uRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xyXG4gXHRcdFx0XHRcdFx0XHR0eXBlOiBcInNlbGYtYWNjZXB0LWVycm9yZWRcIixcclxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXHJcbiBcdFx0XHRcdFx0XHR9KTtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdFx0aWYoIW9wdGlvbnMuaWdub3JlRXJyb3JlZCkge1xyXG4gXHRcdFx0XHRcdFx0aWYoIWVycm9yKVxyXG4gXHRcdFx0XHRcdFx0XHRlcnJvciA9IGVycjtcclxuIFx0XHRcdFx0XHR9XHJcbiBcdFx0XHRcdH1cclxuIFx0XHRcdH1cclxuIFx0XHR9XHJcbiBcdFxyXG4gXHRcdC8vIGhhbmRsZSBlcnJvcnMgaW4gYWNjZXB0IGhhbmRsZXJzIGFuZCBzZWxmIGFjY2VwdGVkIG1vZHVsZSBsb2FkXHJcbiBcdFx0aWYoZXJyb3IpIHtcclxuIFx0XHRcdGhvdFNldFN0YXR1cyhcImZhaWxcIik7XHJcbiBcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IpO1xyXG4gXHRcdH1cclxuIFx0XHJcbiBcdFx0aG90U2V0U3RhdHVzKFwiaWRsZVwiKTtcclxuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xyXG4gXHRcdFx0cmVzb2x2ZShvdXRkYXRlZE1vZHVsZXMpO1xyXG4gXHRcdH0pO1xyXG4gXHR9XHJcblxuIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aG90OiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpLFxuIFx0XHRcdHBhcmVudHM6IChob3RDdXJyZW50UGFyZW50c1RlbXAgPSBob3RDdXJyZW50UGFyZW50cywgaG90Q3VycmVudFBhcmVudHMgPSBbXSwgaG90Q3VycmVudFBhcmVudHNUZW1wKSxcbiBcdFx0XHRjaGlsZHJlbjogW11cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgaG90Q3JlYXRlUmVxdWlyZShtb2R1bGVJZCkpO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9hc3NldHMvXCI7XG5cbiBcdC8vIF9fd2VicGFja19oYXNoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18uaCA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gaG90Q3VycmVudEhhc2g7IH07XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIGhvdENyZWF0ZVJlcXVpcmUoNCkoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gNCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOTY4YTNiODNmYjMwNTY0N2QyYjAiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCB7IGdldENvb2tpZSwgc2V0Q29va2llIH0gPSByZXF1aXJlKCcuL2Nvb2tpZXMnKTtcblxuZXhwb3J0IGNvbnN0IENPTE9SX01PREVfQ09PS0lFX05BTUUgPSAnY29sb3ItbW9kZSc7XG5cbmNvbnN0IGRhcmtNb2RlTWVkaWFRdWVyeSA9IHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJyk7XG5cbmNvbnN0IGZhdmljb25EYXJrTW9kZVNyYyA9ICcvZmF2aWNvbi1kYXJrLmljbyc7XG5jb25zdCBmYXZpY29uTGlnaHRNb2RlU3JjID0gJy9mYXZpY29uLmljbyc7XG5cbmNvbnN0IHNldEZhdmljb24gPSAoZGFya01vZGVPbikgPT4ge1xuICBjb25zdCBsaW5rID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImxpbmtbcmVsKj0naWNvbiddXCIpO1xuICBsaW5rLmhyZWYgPSBkYXJrTW9kZU9uID8gZmF2aWNvbkRhcmtNb2RlU3JjIDogZmF2aWNvbkxpZ2h0TW9kZVNyYztcbn07XG5cbmNvbnN0IGdldElzU3lzdGVtRGFya01vZGUgPSAoKSA9PlxuICB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXM7XG5cbmV4cG9ydCBjb25zdCBnZXRDb2xvck1vZGUgPSAoKSA9PiB7XG4gIGlmIChnZXRDb29raWUoQ09MT1JfTU9ERV9DT09LSUVfTkFNRSkpIHtcbiAgICByZXR1cm4gZ2V0Q29va2llKENPTE9SX01PREVfQ09PS0lFX05BTUUpO1xuICB9XG5cbiAgcmV0dXJuICdhdXRvJztcbn07XG5cbmNvbnN0IHNldENsYXNzTmFtZU9uQm9keSA9ICgpID0+IHtcbiAgaWYgKFxuICAgIGdldENvbG9yTW9kZSgpID09PSAnZGFyaycgfHxcbiAgICAoZ2V0Q29sb3JNb2RlKCkgPT09ICdhdXRvJyAmJiBnZXRJc1N5c3RlbURhcmtNb2RlKCkpXG4gICkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uY2xhc3NMaXN0LmFkZCgncHJlZmVycy1kYXJrJyk7XG4gIH0gZWxzZSBpZiAoXG4gICAgZ2V0Q29sb3JNb2RlKCkgPT09ICdsaWdodCcgfHxcbiAgICAoZ2V0Q29sb3JNb2RlKCkgPT09ICdhdXRvJyAmJiAhZ2V0SXNTeXN0ZW1EYXJrTW9kZSgpKVxuICApIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWZlcnMtZGFyaycpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc2V0Q29sb3JNb2RlID0gKGNvbG9yTW9kZSkgPT4ge1xuICBzZXRDb29raWUoQ09MT1JfTU9ERV9DT09LSUVfTkFNRSwgY29sb3JNb2RlKTtcbiAgc2V0Q2xhc3NOYW1lT25Cb2R5KCk7XG59O1xuXG5kYXJrTW9kZU1lZGlhUXVlcnkuYWRkTGlzdGVuZXIoKGUpID0+IHtcbiAgc2V0RmF2aWNvbihlLm1hdGNoZXMpO1xuXG4gIGlmIChnZXRDb2xvck1vZGUoKSA9PT0gJ2F1dG8nKSB7XG4gICAgc2V0Q29sb3JNb2RlKCk7XG4gIH1cbn0pO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBzZXRGYXZpY29uKHdpbmRvdy5tYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlcyk7XG4gIHNldENsYXNzTmFtZU9uQm9keSgpO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2RhcmstbW9kZS5qcyIsInZhciBmcmVlR2xvYmFsID0gcmVxdWlyZSgnLi9fZnJlZUdsb2JhbCcpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm9vdDtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fcm9vdC5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ1NTIGFuZCBTQVNTIGZpbGVzXG5pbXBvcnQgJy4vaW5kZXguc2Nzcyc7XG5cbmltcG9ydCAnLi9kYXJrLW1vZGUnO1xuaW1wb3J0ICcuL2ltYWdlLWZvY3VzJztcbmltcG9ydCAnLi9zdGlja3ktaGVhZGVyJztcbmltcG9ydCAnLi9idWxiJztcbmltcG9ydCAnLi9zd2lwZSc7XG5pbXBvcnQgJy4vcGVyc3BlY3RpdmUnO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9pbmRleC5qcyIsIi8vIHJlbW92ZWQgYnkgZXh0cmFjdC10ZXh0LXdlYnBhY2stcGx1Z2luXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9fc3JjL2luZGV4LnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyogZXNsaW50LWRpc2FibGUgKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuICBsZXQgZXhwaXJlcyA9ICcnO1xuICBpZiAoZGF5cykge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuICB9XG4gIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyAodmFsdWUgfHwgJycpICsgZXhwaXJlcyArICc7IHBhdGg9Lyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICBjb25zdCBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICBjb25zdCBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGMgPSBjYVtpXTtcbiAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICBpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2Nvb2tpZXMuanMiLCIvKiBlc2xpbnQtZGlzYWJsZSBpbmRlbnQgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXRyYWlsaW5nLXNwYWNlcyAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tbmV3ICovXG5cbmNvbnN0IHpvb21FbnVtID0gT2JqZWN0LmZyZWV6ZSh7XG4gIGZpdDogMSxcbiAgem9vbTogMixcbiAgZnVsbDogMyxcbiAgZmlsbDogNCxcbn0pO1xuXG5jbGFzcyBJbWFnZUZvY3VzIHtcbiAgY29uc3RydWN0b3IoZWwsIHNyYywgY2FwdGlvbikge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsO1xuICAgIHRoaXMuc3JjID0gc3JjO1xuICAgIHRoaXMuY2FwdGlvbiA9IGNhcHRpb247XG4gICAgdGhpcy56b29tTW9kZSA9IHpvb21FbnVtLmZpdDtcblxuICAgIHRoaXMuc2V0dXAoKTtcbiAgICB0aGlzLmNyZWF0ZU92ZXJsYXkoKTtcbiAgICB0aGlzLmF0dGFjaEV2ZW50cygpO1xuICB9XG5cbiAgc2V0dXAoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2lzLWZvY3VzYWJsZScpO1xuICB9XG5cbiAgY3JlYXRlT3ZlcmxheSgpIHtcbiAgICB0aGlzLm92ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1cycpO1xuXG4gICAgdGhpcy5pbWFnZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuaW1hZ2VDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19pbWFnZUNvbnRhaW5lcicpO1xuXG4gICAgbGV0IGFzc2V0O1xuXG4gICAgaWYgKHRoaXMuZWxlbWVudC5kYXRhc2V0LmltYWdlU3JjKSB7XG4gICAgICBhc3NldCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgICAgYXNzZXQuY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19pbWFnZScpO1xuICAgICAgYXNzZXQuc3JjID0gdGhpcy5zcmM7XG4gICAgfSBlbHNlIGlmICh0aGlzLmVsZW1lbnQuZGF0YXNldC52aWRlb1NyYykge1xuICAgICAgYXNzZXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgICAgYXNzZXQuc2V0QXR0cmlidXRlKCdhdXRvcGxheScsIHRydWUpO1xuICAgICAgYXNzZXQuc2V0QXR0cmlidXRlKCdtdXRlZCcsIHRydWUpO1xuICAgICAgYXNzZXQuc2V0QXR0cmlidXRlKCdsb29wJywgdHJ1ZSk7XG4gICAgICBjb25zdCB2aWRlb1NyYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpO1xuICAgICAgYXNzZXQuY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19pbWFnZScpO1xuICAgICAgdmlkZW9TcmMuc3JjID0gdGhpcy5zcmM7XG4gICAgICBhc3NldC5hcHBlbmRDaGlsZCh2aWRlb1NyYyk7XG4gICAgfVxuXG4gICAgdGhpcy5jbG9zZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24uY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19jbG9zZScpO1xuXG4gICAgY29uc3Qgem9vbUluZGljYXRvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHpvb21JbmRpY2F0b3IuY2xhc3NMaXN0LmFkZCgnaW1hZ2Vfem9vbUluZGljYXRvcicpO1xuXG4gICAgdGhpcy5pbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZChhc3NldCk7XG4gICAgdGhpcy5pbWFnZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlQnV0dG9uKTtcblxuICAgIHRoaXMuc2l6ZVRlc3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnNpemVUZXN0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2ltYWdlRm9jdXNfc2l6ZVRlc3RDb250YWluZXInKTtcbiAgICB0aGlzLnNpemVUZXN0Q29udGFpbmVyLmFwcGVuZENoaWxkKGFzc2V0LmNsb25lTm9kZSgpKTtcblxuICAgIHRoaXMub3ZlcmxheS5hcHBlbmRDaGlsZCh0aGlzLmltYWdlQ29udGFpbmVyKTtcbiAgICB0aGlzLm92ZXJsYXkuYXBwZW5kQ2hpbGQodGhpcy5zaXplVGVzdENvbnRhaW5lcik7XG5cbiAgICBpZiAodGhpcy5jYXB0aW9uKSB7XG4gICAgICB0aGlzLmNyZWF0ZUNhcHRpb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLmNyZWF0ZUNvbnRyb2xzKCk7XG4gICAgdGhpcy5jb25maWd1cmVab29tKHRoaXMuem9vbU1vZGUpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXkpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh6b29tSW5kaWNhdG9yKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbnRyb2xzKCkge1xuICAgIHRoaXMuY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmNvbnRyb2xzLmNsYXNzTGlzdC5hZGQoJ2ltYWdlRm9jdXNfY29udHJvbHMnKTtcblxuICAgIHRoaXMuZml0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdGhpcy56b29tQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdGhpcy5mdWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgdGhpcy5maWxsQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICB0aGlzLmZpdEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFxuICAgICAgJ2ltYWdlRm9jdXNfY29udHJvbEZpdEJ1dHRvbicsXG4gICAgICAnaW1hZ2VGb2N1c19jb250cm9sQnV0dG9uJyxcbiAgICApO1xuICAgIHRoaXMuem9vbUJ1dHRvbi5jbGFzc0xpc3QuYWRkKFxuICAgICAgJ2ltYWdlRm9jdXNfY29udHJvbFpvb21CdXR0b24nLFxuICAgICAgJ2ltYWdlRm9jdXNfY29udHJvbEJ1dHRvbicsXG4gICAgKTtcbiAgICB0aGlzLmZ1bGxCdXR0b24uY2xhc3NMaXN0LmFkZChcbiAgICAgICdpbWFnZUZvY3VzX2NvbnRyb2xGdWxsQnV0dG9uJyxcbiAgICAgICdpbWFnZUZvY3VzX2NvbnRyb2xCdXR0b24nLFxuICAgICk7XG4gICAgdGhpcy5maWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoXG4gICAgICAnaW1hZ2VGb2N1c19jb250cm9sQ292ZXJCdXR0b24nLFxuICAgICAgJ2ltYWdlRm9jdXNfY29udHJvbEJ1dHRvbicsXG4gICAgKTtcblxuICAgIHRoaXMuem9vbUJ1dHRvbi50ZXh0Q29udGVudCA9ICdab29tJztcbiAgICB0aGlzLmZpdEJ1dHRvbi50ZXh0Q29udGVudCA9ICdGaXQnO1xuICAgIHRoaXMuZnVsbEJ1dHRvbi50ZXh0Q29udGVudCA9ICcxMDAlJztcbiAgICB0aGlzLmZpbGxCdXR0b24udGV4dENvbnRlbnQgPSAnRmlsbCc7XG5cbiAgICB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuZml0QnV0dG9uKTtcbiAgICAvLyB0aGlzLmNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuem9vbUJ1dHRvbik7XG4gICAgdGhpcy5jb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmZpbGxCdXR0b24pO1xuICAgIHRoaXMuY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5mdWxsQnV0dG9uKTtcblxuICAgIHRoaXMub3ZlcmxheS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2xzKTtcbiAgfVxuXG4gIGNyZWF0ZUNhcHRpb24oKSB7XG4gICAgY29uc3QgY2FwdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBjYXB0aW9uLnRleHRDb250ZW50ID0gdGhpcy5jYXB0aW9uO1xuICAgIGNhcHRpb24uY2xhc3NMaXN0LmFkZCgnaW1hZ2VGb2N1c19jYXB0aW9uJyk7XG4gICAgdGhpcy5vdmVybGF5LmFwcGVuZENoaWxkKGNhcHRpb24pO1xuICB9XG5cbiAgY29uZmlndXJlWm9vbSh6b29tTW9kZSkge1xuICAgIHRoaXMuem9vbU1vZGUgPSB6b29tTW9kZTtcbiAgICBjb25zdCBidXR0b25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXG4gICAgICB0aGlzLm92ZXJsYXkucXVlcnlTZWxlY3RvckFsbCgnLmltYWdlRm9jdXNfY29udHJvbEJ1dHRvbicpLFxuICAgICk7XG5cbiAgICBjb25zdCBlbGVtZW50SGVpZ2h0ID0gdGhpcy5zaXplVGVzdENvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgZWxlbWVudFdpZHRoID0gdGhpcy5zaXplVGVzdENvbnRhaW5lci5vZmZzZXRXaWR0aDtcblxuICAgIHRoaXMub3ZlcmxheS5kYXRhc2V0LmFzcGVjdCA9XG4gICAgICBlbGVtZW50SGVpZ2h0ID4gZWxlbWVudFdpZHRoID8gJ3RhbGwnIDogJ3dpZGUnO1xuXG4gICAgYnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpcy1zZWxlY3RlZCcpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuem9vbU1vZGUgPT09IHpvb21FbnVtLmZpdCkge1xuICAgICAgdGhpcy5maXRCdXR0b24uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcbiAgICAgIHRoaXMub3ZlcmxheS5kYXRhc2V0Lnpvb21Nb2RlID0gJ2ZpdCc7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpvb21Nb2RlID09PSB6b29tRW51bS56b29tKSB7XG4gICAgICB0aGlzLnpvb21CdXR0b24uY2xhc3NMaXN0LmFkZCgnaXMtc2VsZWN0ZWQnKTtcbiAgICAgIHRoaXMub3ZlcmxheS5kYXRhc2V0Lnpvb21Nb2RlID0gJ3pvb20nO1xuICAgIH0gZWxzZSBpZiAodGhpcy56b29tTW9kZSA9PT0gem9vbUVudW0uZnVsbCkge1xuICAgICAgdGhpcy5mdWxsQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2lzLXNlbGVjdGVkJyk7XG4gICAgICB0aGlzLm92ZXJsYXkuZGF0YXNldC56b29tTW9kZSA9ICdmdWxsJztcbiAgICB9IGVsc2UgaWYgKHRoaXMuem9vbU1vZGUgPT09IHpvb21FbnVtLmZpbGwpIHtcbiAgICAgIHRoaXMuZmlsbEJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdpcy1zZWxlY3RlZCcpO1xuICAgICAgdGhpcy5vdmVybGF5LmRhdGFzZXQuem9vbU1vZGUgPSAnZmlsbCc7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNoRXZlbnRzKCkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgIHRoYXQub3Blbk92ZXJsYXkoKTtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIHRoYXQuY2xvc2VPdmVybGF5KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmNsb3NlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGF0LmNsb3NlT3ZlcmxheSgpO1xuICAgICAgfSxcbiAgICAgIHRydWUsXG4gICAgKTtcblxuICAgIHRoaXMuem9vbUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIHRoaXMuY29uZmlndXJlWm9vbS5iaW5kKHRoaXMsIHpvb21FbnVtLnpvb20pLFxuICAgICk7XG4gICAgdGhpcy5mdWxsQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnY2xpY2snLFxuICAgICAgdGhpcy5jb25maWd1cmVab29tLmJpbmQodGhpcywgem9vbUVudW0uZnVsbCksXG4gICAgKTtcbiAgICB0aGlzLmZpdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgJ2NsaWNrJyxcbiAgICAgIHRoaXMuY29uZmlndXJlWm9vbS5iaW5kKHRoaXMsIHpvb21FbnVtLmZpdCksXG4gICAgKTtcbiAgICB0aGlzLmZpbGxCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICdjbGljaycsXG4gICAgICB0aGlzLmNvbmZpZ3VyZVpvb20uYmluZCh0aGlzLCB6b29tRW51bS5maWxsKSxcbiAgICApO1xuICB9XG5cbiAgb3Blbk92ZXJsYXkoKSB7XG4gICAgdGhpcy5vdmVybGF5LmNsYXNzTGlzdC5hZGQoJ2lzLW9wZW4nKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaHRtbCcpWzBdLmNsYXNzTGlzdC5hZGQoJ2hhcy1vcGVuLW92ZXJsYXknKTtcbiAgfVxuXG4gIGNsb3NlT3ZlcmxheSgpIHtcbiAgICB0aGlzLm92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnaXMtb3BlbicpO1xuICAgIGRvY3VtZW50XG4gICAgICAuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2h0bWwnKVswXVxuICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1vcGVuLW92ZXJsYXknKTtcbiAgfVxufVxuXG5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtaW1hZ2UtZm9jdXMnKS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gIGNvbnN0IHNyYyA9IGVsZW1lbnQuZGF0YXNldC5pbWFnZVNyYyB8fCBlbGVtZW50LmRhdGFzZXQudmlkZW9TcmM7XG4gIG5ldyBJbWFnZUZvY3VzKGVsZW1lbnQsIHNyYywgZWxlbWVudC5kYXRhc2V0LmNhcHRpb24pO1xufSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9fc3JjL2ltYWdlLWZvY3VzLmpzIiwiLyogZXNsaW50LWRpc2FibGUgbm8tbmV3ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG5jbGFzcyBTdGlja3lIZWFkZXIge1xuICBjb25zdHJ1Y3RvcihlbCwgdGVzdEVsQ2xhc3MpIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5oYXNTY3JvbGxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZGVmYXVsdFNjcm9sbHZhbHVlID0gMzAwO1xuXG4gICAgaWYgKHRlc3RFbENsYXNzKSB7XG4gICAgICB0aGlzLmRlZmF1bHRTY3JvbGx2YWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGVzdEVsQ2xhc3MpLm9mZnNldEhlaWdodDtcbiAgICB9XG5cbiAgICB0aGlzLnNldHVwU2Nyb2xsRXZlbnQoKTtcbiAgICB0aGlzLmNoZWNrU2Nyb2xsUG9zaXRpb24oKTtcbiAgfVxuXG4gIHNldHVwU2Nyb2xsRXZlbnQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuY2hlY2tTY3JvbGxQb3NpdGlvbi5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGNoZWNrU2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgaWYgKHdpbmRvdy5zY3JvbGxZID4gdGhpcy5kZWZhdWx0U2Nyb2xsdmFsdWUgJiYgdGhpcy5oYXNTY3JvbGxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuaGFzU2Nyb2xsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5zZXR1cEZvclNjcm9sbGVkKHRydWUpO1xuICAgIH0gZWxzZSBpZiAod2luZG93LnNjcm9sbFkgPCB0aGlzLmRlZmF1bHRTY3JvbGx2YWx1ZSAmJiB0aGlzLmhhc1Njcm9sbGVkID09PSB0cnVlKSB7XG4gICAgICB0aGlzLmhhc1Njcm9sbGVkID0gZmFsc2U7XG4gICAgICB0aGlzLnNldHVwRm9yU2Nyb2xsZWQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwRm9yU2Nyb2xsZWQoaXNTY3JvbGxlZCkge1xuICAgIGlmIChpc1Njcm9sbGVkKSB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lzLXNjcm9sbGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtc2Nyb2xsZWQnKTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LlN0aWNreUhlYWRlciA9IFN0aWNreUhlYWRlcjtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvc3RpY2t5LWhlYWRlci5qcyIsImNvbnN0IHsgZ2V0Q29sb3JNb2RlLCBzZXRDb2xvck1vZGUgfSA9IHJlcXVpcmUoJy4vZGFyay1tb2RlJyk7XG5cbmNsYXNzIEJ1bGIge1xuICBjb25zdHJ1Y3RvcihlbCkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmJ1dHRvbiA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLWJ1bGItYnV0dG9uJylbMF07XG4gICAgdGhpcy5pY29ucyA9IHtcbiAgICAgIGxpZ2h0OiBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1idWxiLW9uJylbMF0sXG4gICAgICBkYXJrOiBlbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdqcy1idWxiLW9mZicpWzBdLFxuICAgICAgYXV0bzogZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtYnVsYi1hdXRvJylbMF0sXG4gICAgfTtcbiAgICB0aGlzLnNldENvbG9yTW9kZSgpO1xuXG4gICAgY29uc3QgZGFya01vZGVNZWRpYVF1ZXJ5ID0gd2luZG93Lm1hdGNoTWVkaWEoXG4gICAgICAnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScsXG4gICAgKTtcbiAgICBkYXJrTW9kZU1lZGlhUXVlcnkuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRDb2xvck1vZGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29sb3JNb2RlID09PSAnZGFyaycpIHtcbiAgICAgICAgdGhpcy5zZXRDb2xvck1vZGUoJ2xpZ2h0Jyk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY29sb3JNb2RlID09PSAnbGlnaHQnKSB7XG4gICAgICAgIHRoaXMuc2V0Q29sb3JNb2RlKCdhdXRvJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldENvbG9yTW9kZSgnZGFyaycpO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRDb2xvck1vZGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNldENvbG9yTW9kZShjb2xvck1vZGUpIHtcbiAgICBpZiAoY29sb3JNb2RlKSB7XG4gICAgICB0aGlzLmNvbG9yTW9kZSA9IGNvbG9yTW9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2xvck1vZGUgPSBnZXRDb2xvck1vZGUoKTtcbiAgICB9XG5cbiAgICBzZXRDb2xvck1vZGUodGhpcy5jb2xvck1vZGUpO1xuXG4gICAgdGhpcy5zZXRJY29uVmlzaWJsZSgpO1xuICB9XG5cbiAgc2V0SWNvblZpc2libGUoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5pY29ucykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IHRoaXMuY29sb3JNb2RlKSB7XG4gICAgICAgIHRoaXMuaWNvbnNba10uY2xhc3NMaXN0LmFkZCgnaXMtdmlzaWJsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5pY29uc1trXS5jbGFzc0xpc3QucmVtb3ZlKCdpcy12aXNpYmxlJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxud2luZG93LkJ1bGIgPSBCdWxiO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vX3NyYy9idWxiLmpzIiwiaW1wb3J0IHRocm90dGxlIGZyb20gJ2xvZGFzaC90aHJvdHRsZSc7XG5cbmNvbnN0IGlzRWxlbWVudEluVmlld3BvcnQgPSAoZWwpID0+IHtcbiAgY29uc3QgcmVjdCA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gIHJldHVybiAoXG4gICAgcmVjdC50b3AgPj0gMCAmJlxuICAgIHJlY3QubGVmdCA+PSAwICYmXG4gICAgcmVjdC5ib3R0b20gLSAoZWwuY2xpZW50SGVpZ2h0IC8gMykgPD1cbiAgICAgICh3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCkgJiZcbiAgICByZWN0LnJpZ2h0IDw9ICh3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpXG4gICk7XG59O1xuXG5jbGFzcyBTd2lwZWFibGVJbWFnZSB7XG4gIGNvbnN0cnVjdG9yKGVsKSB7XG4gICAgdGhpcy5lbCA9IGVsO1xuICAgIHRoaXMuaGFuZGxlID0gZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnanMtc3dpcGUtaGFuZGxlJylbMF07XG4gICAgdGhpcy5zd2lwZSA9IGVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXN3aXBlLWl0ZW0nKVswXTtcbiAgICB0aGlzLnN3aXBlQ2hpbGQgPSB0aGlzLnN3aXBlLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdkaXYnKVswXTtcblxuICAgIHRoaXMuaGFuZGxlRHJhZyA9IHRoaXMuaGFuZGxlRHJhZy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlRHJhZ0VuZCA9IHRoaXMuaGFuZGxlRHJhZ0VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0ID0gdGhpcy5oYW5kbGVEcmFnU3RhcnQuYmluZCh0aGlzKTtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCA9IHRoaXMuaGFuZGxlU2Nyb2xsLmJpbmQodGhpcyk7XG4gICAgdGhpcy50aHJvdHRsZWRIYW5kbGVTY3JvbGwgPSB0aHJvdHRsZSh0aGlzLmhhbmRsZVNjcm9sbCwgMjUwKTtcblxuICAgIHRoaXMudGhyb3R0bGVkSGFuZGxlRHJhZyA9IHRocm90dGxlKHRoaXMuaGFuZGxlRHJhZywgMjUwKTtcblxuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5oYW5kbGVEcmFnLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZURyYWdTdGFydCwgZmFsc2UpO1xuICAgIHRoaXMuZWwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlRHJhZ0VuZCwgZmFsc2UpO1xuXG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVEcmFnU3RhcnQsIGZhbHNlKTtcbiAgICB0aGlzLmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5oYW5kbGVEcmFnRW5kLCBmYWxzZSk7XG4gICAgdGhpcy5lbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLmhhbmRsZURyYWcsIGZhbHNlKTtcblxuICAgIHRoaXMuY3VycmVudFggPSBudWxsO1xuICAgIHRoaXMuaW5pdGlhbFggPSBudWxsO1xuICAgIHRoaXMueE9mZnNldCA9IHRoaXMuZWwuY2xpZW50V2lkdGggLyAyO1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmVsLmNsaWVudFdpZHRoO1xuXG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLmhhc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgdGhpcy5pc1ByaXN0aW5lID0gdHJ1ZTtcblxuICAgIGlmIChlbC5kYXRhc2V0LnN3aXBlQW5pbWF0ZSkge1xuICAgICAgdGhpcy5zZXRUcmFuc2xhdGUoMjApO1xuICAgICAgdGhpcy54T2Zmc2V0ID0gMjA7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy50aHJvdHRsZWRIYW5kbGVTY3JvbGwpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0aGlzLmhhbmRsZVNjcm9sbCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFRyYW5zbGF0ZSh0aGlzLnhPZmZzZXQpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyYWdTdGFydChlKSB7XG4gICAgaWYgKGUudHlwZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICB0aGlzLmluaXRpYWxYID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLnhPZmZzZXQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbFggPSBlLmNsaWVudFggLSB0aGlzLnhPZmZzZXQ7XG4gICAgfVxuXG4gICAgaWYgKGUudGFyZ2V0ID09PSB0aGlzLmhhbmRsZSkge1xuICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZURyYWcoZSkge1xuICAgIGlmICghdGhpcy5hY3RpdmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmlzUHJpc3RpbmUgPSBmYWxzZTtcblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIGlmIChlLnR5cGUgPT09ICd0b3VjaG1vdmUnKSB7XG4gICAgICB0aGlzLmN1cnJlbnRYID0gZS50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmluaXRpYWxYO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRYID0gZS5jbGllbnRYIC0gdGhpcy5pbml0aWFsWDtcbiAgICB9XG5cbiAgICB0aGlzLnhPZmZzZXQgPSB0aGlzLmN1cnJlbnRYO1xuXG4gICAgdGhpcy5zZXRUcmFuc2xhdGUodGhpcy5jdXJyZW50WCk7XG4gIH1cblxuICBoYW5kbGVEcmFnRW5kKCkge1xuICAgIHRoaXMuaW5pdGlhbFggPSB0aGlzLmN1cnJlbnRYO1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gIH1cblxuICBzZXRUcmFuc2xhdGUoeCkge1xuICAgIGxldCBkZXNpcmVkWCA9IHg7XG4gICAgaWYgKGRlc2lyZWRYIDwgMCkge1xuICAgICAgZGVzaXJlZFggPSAwO1xuICAgIH1cblxuICAgIGlmIChkZXNpcmVkWCA+IHRoaXMud2lkdGgpIHtcbiAgICAgIGRlc2lyZWRYID0gdGhpcy53aWR0aDtcbiAgICB9XG5cbiAgICB0aGlzLnN3aXBlLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7LSh0aGlzLndpZHRoIC0gZGVzaXJlZFgpfXB4KWA7XG4gICAgdGhpcy5zd2lwZUNoaWxkLnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7dGhpcy53aWR0aCAtIGRlc2lyZWRYfXB4KWA7XG4gICAgdGhpcy5oYW5kbGUuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZTNkKCR7ZGVzaXJlZFh9cHgsIDAsIDApYDtcbiAgfVxuXG4gIGhhbmRsZVNjcm9sbCgpIHtcbiAgICBpZiAoaXNFbGVtZW50SW5WaWV3cG9ydCh0aGlzLmVsKSkge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMudGhyb3R0bGVkSGFuZGxlU2Nyb2xsKTtcbiAgICAgIHRoaXMuYW5pbWF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGFuaW1hdGUoKSB7XG4gICAgaWYgKHRoaXMuaGFzQW5pbWF0ZWQgfHwgIXRoaXMuaXNQcmlzdGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzdGFydFRpbWU7XG4gICAgY29uc3Qgc3RhcnRPZmZzZXQgPSAyMDtcbiAgICBjb25zdCBkdXJhdGlvbiA9IDEwMDA7XG4gICAgY29uc3QgdGFyZ2V0T2Zmc2V0ID0gdGhpcy53aWR0aCAvIDI7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xuICAgIGNvbnN0IGVhc2VJbk91dEN1YmljID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICAgIGlmICgodCAvPSBkIC8gMikgPCAxKSByZXR1cm4gKGMgLyAyKSAqIHQgKiB0ICogdCArIGI7XG4gICAgICByZXR1cm4gKGMgLyAyKSAqICgodCAtPSAyKSAqIHQgKiB0ICsgMikgKyBiO1xuICAgIH07XG4gICAgLyogZXNsaW50LWVuYWJsZSAqL1xuXG4gICAgaWYgKGR1cmF0aW9uID4gMCkge1xuICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcblxuICAgICAgY29uc3QgYW5pbSA9ICh0aW1lc3RhbXApID0+IHtcbiAgICAgICAgc3RhcnRUaW1lID0gc3RhcnRUaW1lIHx8IHRpbWVzdGFtcDtcbiAgICAgICAgY29uc3QgZWxhcHNlZCA9IHRpbWVzdGFtcCAtIHN0YXJ0VGltZTtcbiAgICAgICAgY29uc3QgcHJvZ3Jlc3MgPSBlYXNlSW5PdXRDdWJpYyhcbiAgICAgICAgICBlbGFwc2VkLFxuICAgICAgICAgIHN0YXJ0T2Zmc2V0LFxuICAgICAgICAgIHRhcmdldE9mZnNldCAtIHN0YXJ0T2Zmc2V0LFxuICAgICAgICAgIGR1cmF0aW9uLFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnNldFRyYW5zbGF0ZShwcm9ncmVzcyk7XG4gICAgICAgIGlmIChlbGFwc2VkIDwgZHVyYXRpb24pIHtcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRUcmFuc2xhdGUodGFyZ2V0T2Zmc2V0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRUcmFuc2xhdGUodGFyZ2V0T2Zmc2V0KTtcbiAgICAgIHRoaXMuaGFzQW5pbWF0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuU3dpcGVhYmxlSW1hZ2UgPSBTd2lwZWFibGVJbWFnZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvc3dpcGUuanMiLCJ2YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL2RlYm91bmNlJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0Jyk7XG5cbi8qKiBFcnJvciBtZXNzYWdlIGNvbnN0YW50cy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHRocm90dGxlZCBmdW5jdGlvbiB0aGF0IG9ubHkgaW52b2tlcyBgZnVuY2AgYXQgbW9zdCBvbmNlIHBlclxuICogZXZlcnkgYHdhaXRgIG1pbGxpc2Vjb25kcy4gVGhlIHRocm90dGxlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGBcbiAqIG1ldGhvZCB0byBjYW5jZWwgZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG9cbiAqIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYFxuICogc2hvdWxkIGJlIGludm9rZWQgb24gdGhlIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YFxuICogdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZVxuICogdGhyb3R0bGVkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50IGNhbGxzIHRvIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gcmV0dXJuIHRoZVxuICogcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYCBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLnRocm90dGxlYCBhbmQgYF8uZGVib3VuY2VgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gdGhyb3R0bGUuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhyb3R0bGUgaW52b2NhdGlvbnMgdG8uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgdGhyb3R0bGVkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBleGNlc3NpdmVseSB1cGRhdGluZyB0aGUgcG9zaXRpb24gd2hpbGUgc2Nyb2xsaW5nLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Njcm9sbCcsIF8udGhyb3R0bGUodXBkYXRlUG9zaXRpb24sIDEwMCkpO1xuICpcbiAqIC8vIEludm9rZSBgcmVuZXdUb2tlbmAgd2hlbiB0aGUgY2xpY2sgZXZlbnQgaXMgZmlyZWQsIGJ1dCBub3QgbW9yZSB0aGFuIG9uY2UgZXZlcnkgNSBtaW51dGVzLlxuICogdmFyIHRocm90dGxlZCA9IF8udGhyb3R0bGUocmVuZXdUb2tlbiwgMzAwMDAwLCB7ICd0cmFpbGluZyc6IGZhbHNlIH0pO1xuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIHRocm90dGxlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyB0aHJvdHRsZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIHRocm90dGxlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiB0aHJvdHRsZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsZWFkaW5nID0gdHJ1ZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gJ2xlYWRpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMubGVhZGluZyA6IGxlYWRpbmc7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuICByZXR1cm4gZGVib3VuY2UoZnVuYywgd2FpdCwge1xuICAgICdsZWFkaW5nJzogbGVhZGluZyxcbiAgICAnbWF4V2FpdCc6IHdhaXQsXG4gICAgJ3RyYWlsaW5nJzogdHJhaWxpbmdcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvdGhyb3R0bGUuanNcbi8vIG1vZHVsZSBpZCA9IDExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBub3cgPSByZXF1aXJlKCcuL25vdycpLFxuICAgIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogRXJyb3IgbWVzc2FnZSBjb25zdGFudHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgdGltZVdhaXRpbmcgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nXG4gICAgICA/IG5hdGl2ZU1pbih0aW1lV2FpdGluZywgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpXG4gICAgICA6IHRpbWVXYWl0aW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9kZWJvdW5jZS5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbm93O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL25vdy5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlR2xvYmFsO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBiYXNlVHJpbSA9IHJlcXVpcmUoJy4vX2Jhc2VUcmltJyksXG4gICAgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSBiYXNlVHJpbSh2YWx1ZSk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvTnVtYmVyO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgdHJpbW1lZEVuZEluZGV4ID0gcmVxdWlyZSgnLi9fdHJpbW1lZEVuZEluZGV4Jyk7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW1TdGFydCA9IC9eXFxzKy87XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udHJpbWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byB0cmltLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgdHJpbW1lZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUcmltKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nXG4gICAgPyBzdHJpbmcuc2xpY2UoMCwgdHJpbW1lZEVuZEluZGV4KHN0cmluZykgKyAxKS5yZXBsYWNlKHJlVHJpbVN0YXJ0LCAnJylcbiAgICA6IHN0cmluZztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlVHJpbTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVRyaW0uanNcbi8vIG1vZHVsZSBpZCA9IDE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiBVc2VkIHRvIG1hdGNoIGEgc2luZ2xlIHdoaXRlc3BhY2UgY2hhcmFjdGVyLiAqL1xudmFyIHJlV2hpdGVzcGFjZSA9IC9cXHMvO1xuXG4vKipcbiAqIFVzZWQgYnkgYF8udHJpbWAgYW5kIGBfLnRyaW1FbmRgIHRvIGdldCB0aGUgaW5kZXggb2YgdGhlIGxhc3Qgbm9uLXdoaXRlc3BhY2VcbiAqIGNoYXJhY3RlciBvZiBgc3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbGFzdCBub24td2hpdGVzcGFjZSBjaGFyYWN0ZXIuXG4gKi9cbmZ1bmN0aW9uIHRyaW1tZWRFbmRJbmRleChzdHJpbmcpIHtcbiAgdmFyIGluZGV4ID0gc3RyaW5nLmxlbmd0aDtcblxuICB3aGlsZSAoaW5kZXgtLSAmJiByZVdoaXRlc3BhY2UudGVzdChzdHJpbmcuY2hhckF0KGluZGV4KSkpIHt9XG4gIHJldHVybiBpbmRleDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmltbWVkRW5kSW5kZXg7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3RyaW1tZWRFbmRJbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBuYXRpdmVPYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1Ub1N0cmluZ1RhZyA9IFN5bWJvbCA/IFN5bWJvbC50b1N0cmluZ1RhZyA6IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VHZXRUYWdgIHdoaWNoIGlnbm9yZXMgYFN5bWJvbC50b1N0cmluZ1RhZ2AgdmFsdWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHJhdyBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBnZXRSYXdUYWcodmFsdWUpIHtcbiAgdmFyIGlzT3duID0gaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgc3ltVG9TdHJpbmdUYWcpLFxuICAgICAgdGFnID0gdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuXG4gIHRyeSB7XG4gICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdW5kZWZpbmVkO1xuICAgIHZhciB1bm1hc2tlZCA9IHRydWU7XG4gIH0gY2F0Y2ggKGUpIHt9XG5cbiAgdmFyIHJlc3VsdCA9IG5hdGl2ZU9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICBpZiAodW5tYXNrZWQpIHtcbiAgICBpZiAoaXNPd24pIHtcbiAgICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHRhZztcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZXRlIHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnZXRSYXdUYWc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qc1xuLy8gbW9kdWxlIGlkID0gMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdExpa2U7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzXG4vLyBtb2R1bGUgaWQgPSAyM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjbGFzcyBQZXJzcGVjdGl2ZUdyb3VwIHtcbiAgY29uc3RydWN0b3IoZWwpIHtcbiAgICBpZiAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50ID0gZWw7XG4gICAgdGhpcy5mb3JlZ3JvdW5kSXRlbXMgPSBwYXJlbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLXBlcnNwZWN0aXZlLWZvcmVncm91bmQnKTtcbiAgICB0aGlzLmJhY2tncm91bmRJdGVtcyA9IHBhcmVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtcGVyc3BlY3RpdmUtYmFja2dyb3VuZCcpO1xuICAgIGNvbnN0IHJhbmdlID0gcGFyZW50LmRhdGFzZXQucGVyc3BlY3RpdmVSYW5nZSB8fCA0MDtcbiAgICBjb25zdCBjYWxjVmFsdWUgPSAoYSwgYikgPT4gKCgoYSAvIGIpICogcmFuZ2UpIC0gKHJhbmdlIC8gMikpLnRvRml4ZWQoMSk7XG5cbiAgICBsZXQgdGltZW91dDtcblxuICAgIHBhcmVudC5zdHlsZS5wZXJzcGVjdGl2ZSA9ICcxODAwcHgnO1xuICAgIHBhcmVudC5zdHlsZS50cmFuc2Zvcm1TdHlsZSA9ICdwcmVzZXJ2ZS0zZCc7XG5cbiAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5iYWNrZ3JvdW5kSXRlbXMsIChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBiZ0l0ZW0gPSBpdGVtO1xuICAgICAgYmdJdGVtLnN0eWxlLnRyYW5zZm9ybVN0eWxlID0gJ3ByZXNlcnZlLTNkJztcbiAgICAgIGJnSXRlbS5zdHlsZS5wZXJzcGVjdGl2ZSA9ICcxMjAwcHgnO1xuICAgICAgYmdJdGVtLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICc1MCUgNTAlJztcbiAgICB9KTtcblxuICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmZvcmVncm91bmRJdGVtcywgKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGZvcmVncm91bmRJdGVtID0gaXRlbTtcbiAgICAgIGZvcmVncm91bmRJdGVtLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICc1MCUgNTAlJztcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICh7IHksIHggfSkgPT4ge1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRpbWVvdXQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBjb25zdCB5VmFsdWUgPSBjYWxjVmFsdWUoeSwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgICBjb25zdCB4VmFsdWUgPSBjYWxjVmFsdWUoeCwgd2luZG93LmlubmVyV2lkdGgpO1xuXG4gICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHRoaXMuZm9yZWdyb3VuZEl0ZW1zLCAoaXRlbSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZm9yZWdyb3VuZEl0ZW0gPSBpdGVtO1xuICAgICAgICAgICAgZm9yZWdyb3VuZEl0ZW0uc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHt4VmFsdWV9cHgpIHRyYW5zbGF0ZVkoJHt5VmFsdWV9cHgpYDtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmJhY2tncm91bmRJdGVtcywgKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGJnSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICBiZ0l0ZW0uc3R5bGUudHJhbnNmb3JtID0gYHJvdGF0ZVgoJHt4VmFsdWUgKiAxLjV9ZGVnKSByb3RhdGVZKCR7eVZhbHVlICogMS41fWRlZylgO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZSxcbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5QZXJzcGVjdGl2ZUdyb3VwID0gUGVyc3BlY3RpdmVHcm91cDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL19zcmMvcGVyc3BlY3RpdmUuanMiXSwic291cmNlUm9vdCI6IiJ9