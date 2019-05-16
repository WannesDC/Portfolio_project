(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./portfolio/portfolio.module": [
		"./src/app/portfolio/portfolio.module.ts",
		"portfolio-portfolio-module"
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids) {
		return Promise.resolve().then(function() {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}
	return __webpack_require__.e(ids[1]).then(function() {
		var id = ids[0];
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";
module.exports = webpackAsyncContext;

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var _selective_preload_strategy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./selective-preload-strategy */ "./src/app/selective-preload-strategy.ts");
/* harmony import */ var _user_auth_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user/auth.guard */ "./src/app/user/auth.guard.ts");
/* harmony import */ var _main_page_main_page_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./main-page/main-page.component */ "./src/app/main-page/main-page.component.ts");







var appRoutes = [
    {
        path: 'portfolio',
        canActivate: [_user_auth_guard__WEBPACK_IMPORTED_MODULE_5__["AuthGuard"]],
        loadChildren: './portfolio/portfolio.module#PortfolioModule',
        data: { preload: true }
    },
    { path: 'main-page', component: _main_page_main_page_component__WEBPACK_IMPORTED_MODULE_6__["MainPageComponent"] },
    { path: '', redirectTo: 'portfolio/main-portfolio', pathMatch: 'full' },
    { path: '**', component: _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_3__["PageNotFoundComponent"] }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(appRoutes, {
                    preloadingStrategy: _selective_preload_strategy__WEBPACK_IMPORTED_MODULE_4__["SelectivePreloadStrategy"]
                })
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "body, html {\r\n    height: 100%;\r\n  }\r\n  .app-loading {\r\n    position: relative;\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    justify-content: center;\r\n    height: 100%;\r\n  }\r\n  .app-loading .spinner {\r\n    height: 200px;\r\n    width: 200px;\r\n    -webkit-animation: rotate 2s linear infinite;\r\n            animation: rotate 2s linear infinite;\r\n    -webkit-transform-origin: center center;\r\n            transform-origin: center center;\r\n    position: absolute;\r\n    top: 0;\r\n    bottom: 0;\r\n    left: 0;\r\n    right: 0;\r\n    margin: auto;\r\n  }\r\n  .app-loading .spinner .path {\r\n    stroke-dasharray: 1, 200;\r\n    stroke-dashoffset: 0;\r\n    -webkit-animation: dash 1.5s ease-in-out infinite;\r\n            animation: dash 1.5s ease-in-out infinite;\r\n    stroke-linecap: round;\r\n    stroke: #ddd;\r\n  }\r\n  @-webkit-keyframes rotate {\r\n    100% {\r\n      -webkit-transform: rotate(360deg);\r\n              transform: rotate(360deg);\r\n    }\r\n  }\r\n  @keyframes rotate {\r\n    100% {\r\n      -webkit-transform: rotate(360deg);\r\n              transform: rotate(360deg);\r\n    }\r\n  }\r\n  @-webkit-keyframes dash {\r\n    0% {\r\n      stroke-dasharray: 1, 200;\r\n      stroke-dashoffset: 0;\r\n    }\r\n    50% {\r\n      stroke-dasharray: 89, 200;\r\n      stroke-dashoffset: -35px;\r\n    }\r\n    100% {\r\n      stroke-dasharray: 89, 200;\r\n      stroke-dashoffset: -124px;\r\n    }\r\n  }\r\n  @keyframes dash {\r\n    0% {\r\n      stroke-dasharray: 1, 200;\r\n      stroke-dashoffset: 0;\r\n    }\r\n    50% {\r\n      stroke-dasharray: 89, 200;\r\n      stroke-dashoffset: -35px;\r\n    }\r\n    100% {\r\n      stroke-dasharray: 89, 200;\r\n      stroke-dashoffset: -124px;\r\n    }\r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxZQUFZO0VBQ2Q7RUFDQTtJQUNFLGtCQUFrQjtJQUNsQixhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjtJQUNuQix1QkFBdUI7SUFDdkIsWUFBWTtFQUNkO0VBQ0E7SUFDRSxhQUFhO0lBQ2IsWUFBWTtJQUNaLDRDQUFvQztZQUFwQyxvQ0FBb0M7SUFDcEMsdUNBQStCO1lBQS9CLCtCQUErQjtJQUMvQixrQkFBa0I7SUFDbEIsTUFBTTtJQUNOLFNBQVM7SUFDVCxPQUFPO0lBQ1AsUUFBUTtJQUNSLFlBQVk7RUFDZDtFQUNBO0lBQ0Usd0JBQXdCO0lBQ3hCLG9CQUFvQjtJQUNwQixpREFBeUM7WUFBekMseUNBQXlDO0lBQ3pDLHFCQUFxQjtJQUNyQixZQUFZO0VBQ2Q7RUFDQTtJQUNFO01BQ0UsaUNBQXlCO2NBQXpCLHlCQUF5QjtJQUMzQjtFQUNGO0VBSkE7SUFDRTtNQUNFLGlDQUF5QjtjQUF6Qix5QkFBeUI7SUFDM0I7RUFDRjtFQUNBO0lBQ0U7TUFDRSx3QkFBd0I7TUFDeEIsb0JBQW9CO0lBQ3RCO0lBQ0E7TUFDRSx5QkFBeUI7TUFDekIsd0JBQXdCO0lBQzFCO0lBQ0E7TUFDRSx5QkFBeUI7TUFDekIseUJBQXlCO0lBQzNCO0VBQ0Y7RUFiQTtJQUNFO01BQ0Usd0JBQXdCO01BQ3hCLG9CQUFvQjtJQUN0QjtJQUNBO01BQ0UseUJBQXlCO01BQ3pCLHdCQUF3QjtJQUMxQjtJQUNBO01BQ0UseUJBQXlCO01BQ3pCLHlCQUF5QjtJQUMzQjtFQUNGIiwiZmlsZSI6InNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5LCBodG1sIHtcclxuICAgIGhlaWdodDogMTAwJTtcclxuICB9XHJcbiAgLmFwcC1sb2FkaW5nIHtcclxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgaGVpZ2h0OiAxMDAlO1xyXG4gIH1cclxuICAuYXBwLWxvYWRpbmcgLnNwaW5uZXIge1xyXG4gICAgaGVpZ2h0OiAyMDBweDtcclxuICAgIHdpZHRoOiAyMDBweDtcclxuICAgIGFuaW1hdGlvbjogcm90YXRlIDJzIGxpbmVhciBpbmZpbml0ZTtcclxuICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlciBjZW50ZXI7XHJcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICB0b3A6IDA7XHJcbiAgICBib3R0b206IDA7XHJcbiAgICBsZWZ0OiAwO1xyXG4gICAgcmlnaHQ6IDA7XHJcbiAgICBtYXJnaW46IGF1dG87XHJcbiAgfVxyXG4gIC5hcHAtbG9hZGluZyAuc3Bpbm5lciAucGF0aCB7XHJcbiAgICBzdHJva2UtZGFzaGFycmF5OiAxLCAyMDA7XHJcbiAgICBzdHJva2UtZGFzaG9mZnNldDogMDtcclxuICAgIGFuaW1hdGlvbjogZGFzaCAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xyXG4gICAgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kO1xyXG4gICAgc3Ryb2tlOiAjZGRkO1xyXG4gIH1cclxuICBAa2V5ZnJhbWVzIHJvdGF0ZSB7XHJcbiAgICAxMDAlIHtcclxuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTtcclxuICAgIH1cclxuICB9XHJcbiAgQGtleWZyYW1lcyBkYXNoIHtcclxuICAgIDAlIHtcclxuICAgICAgc3Ryb2tlLWRhc2hhcnJheTogMSwgMjAwO1xyXG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogMDtcclxuICAgIH1cclxuICAgIDUwJSB7XHJcbiAgICAgIHN0cm9rZS1kYXNoYXJyYXk6IDg5LCAyMDA7XHJcbiAgICAgIHN0cm9rZS1kYXNob2Zmc2V0OiAtMzVweDtcclxuICAgIH1cclxuICAgIDEwMCUge1xyXG4gICAgICBzdHJva2UtZGFzaGFycmF5OiA4OSwgMjAwO1xyXG4gICAgICBzdHJva2UtZGFzaG9mZnNldDogLTEyNHB4O1xyXG4gICAgfVxyXG4gIH0iXX0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--make sure navbar doesn't show when you're viewing a portfolio by link!!!-->\r\n<div class=\"app-loading\" *ngIf=\"loadingRouteConfig\">\r\n  <div class=\"logo\"></div>\r\n  <svg class=\"spinner\" viewBox=\"25 25 50 50\">\r\n    <circle\r\n      class=\"path\"\r\n      cx=\"50\"\r\n      cy=\"50\"\r\n      r=\"20\"\r\n      fill=\"none\"\r\n      stroke-width=\"2\"\r\n      stroke-miterlimit=\"10\"\r\n    />\r\n  </svg>\r\n</div>\r\n<app-navbar> </app-navbar>\r\n<router-outlet> </router-outlet>\r\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _user_authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./user/authentication.service */ "./src/app/user/authentication.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");






var AppComponent = /** @class */ (function () {
    function AppComponent(breakpointObserver, _authenticationService, router) {
        this.breakpointObserver = breakpointObserver;
        this._authenticationService = _authenticationService;
        this.router = router;
        this.title = 'Project';
        this.loggedInUser$ = this._authenticationService.user$;
        this.isHandset$ = this.breakpointObserver
            .observe(_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_3__["Breakpoints"].Handset)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (result) { return result.matches; }));
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.router.events.subscribe(function (event) {
            if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouteConfigLoadStart"]) {
                _this.loadingRouteConfig = true;
            }
            else if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouteConfigLoadEnd"]) {
                _this.loadingRouteConfig = false;
            }
        });
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_3__["BreakpointObserver"],
            _user_authentication_service__WEBPACK_IMPORTED_MODULE_1__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./navbar/navbar.component */ "./src/app/navbar/navbar.component.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _main_page_main_page_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./main-page/main-page.component */ "./src/app/main-page/main-page.component.ts");
/* harmony import */ var _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./page-not-found/page-not-found.component */ "./src/app/page-not-found/page-not-found.component.ts");
/* harmony import */ var angular_font_awesome__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular-font-awesome */ "./node_modules/angular-font-awesome/dist/angular-font-awesome.es5.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _user_user_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./user/user.module */ "./src/app/user/user.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _interceptors__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./interceptors */ "./src/app/interceptors/index.ts");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./material/material.module */ "./src/app/material/material.module.ts");
/* harmony import */ var _navbar_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./navbar.service */ "./src/app/navbar.service.ts");
















var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _navbar_navbar_component__WEBPACK_IMPORTED_MODULE_4__["NavbarComponent"],
                _main_page_main_page_component__WEBPACK_IMPORTED_MODULE_6__["MainPageComponent"],
                _page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_7__["PageNotFoundComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_9__["HttpClientModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_5__["BrowserAnimationsModule"],
                angular_font_awesome__WEBPACK_IMPORTED_MODULE_8__["AngularFontAwesomeModule"],
                _user_user_module__WEBPACK_IMPORTED_MODULE_10__["UserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_11__["ReactiveFormsModule"],
                _material_material_module__WEBPACK_IMPORTED_MODULE_14__["MaterialModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_12__["AppRoutingModule"]
            ],
            providers: [_interceptors__WEBPACK_IMPORTED_MODULE_13__["httpInterceptorProviders"], _navbar_service__WEBPACK_IMPORTED_MODULE_15__["NavbarService"]],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/interceptors/authentication-interceptor.ts":
/*!************************************************************!*\
  !*** ./src/app/interceptors/authentication-interceptor.ts ***!
  \************************************************************/
/*! exports provided: AuthenticationInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationInterceptor", function() { return AuthenticationInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _user_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../user/authentication.service */ "./src/app/user/authentication.service.ts");



var AuthenticationInterceptor = /** @class */ (function () {
    function AuthenticationInterceptor(authService) {
        this.authService = authService;
    }
    AuthenticationInterceptor.prototype.intercept = function (req, next) {
        if (this.authService.token.length) {
            var clonedRequest = req.clone({
                headers: req.headers.set('Authorization', "Bearer " + this.authService.token)
            });
            return next.handle(clonedRequest);
        }
        return next.handle(req);
    };
    AuthenticationInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_user_authentication_service__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"]])
    ], AuthenticationInterceptor);
    return AuthenticationInterceptor;
}());



/***/ }),

/***/ "./src/app/interceptors/index.ts":
/*!***************************************!*\
  !*** ./src/app/interceptors/index.ts ***!
  \***************************************/
/*! exports provided: httpInterceptorProviders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "httpInterceptorProviders", function() { return httpInterceptorProviders; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _authentication_interceptor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authentication-interceptor */ "./src/app/interceptors/authentication-interceptor.ts");


var httpInterceptorProviders = [
    {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HTTP_INTERCEPTORS"],
        useClass: _authentication_interceptor__WEBPACK_IMPORTED_MODULE_1__["AuthenticationInterceptor"],
        multi: true
    }
];


/***/ }),

/***/ "./src/app/main-page/main-page.component.css":
/*!***************************************************!*\
  !*** ./src/app/main-page/main-page.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "  .card {\r\n    background-color: rgba(0, 0, 0, 0.2);\r\n  }\r\n\r\n  h6 {\r\n    line-height: 1.7;\r\n  }\r\n\r\n\r\n\r\n\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWFpbi1wYWdlL21haW4tcGFnZS5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJFQUFFO0lBQ0Usb0NBQW9DO0VBQ3RDOztFQUVBO0lBQ0UsZ0JBQWdCO0VBQ2xCIiwiZmlsZSI6InNyYy9hcHAvbWFpbi1wYWdlL21haW4tcGFnZS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiICAuY2FyZCB7XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMik7XHJcbiAgfVxyXG5cclxuICBoNiB7XHJcbiAgICBsaW5lLWhlaWdodDogMS43O1xyXG4gIH1cclxuXHJcblxyXG5cclxuXHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/main-page/main-page.component.html":
/*!****************************************************!*\
  !*** ./src/app/main-page/main-page.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<main>\n  <div class=\"view\">\n    <!-- Mask & flexbox options-->\n    <div class=\"mask align-items-center\">\n      <!-- Content -->\n      <div class=\"container test\">\n        <!--Grid row-->\n        <div class=\"row mt-5\">\n          <!--Grid column-->\n          <div\n            class=\"col-md-6 mb-5 mt-md-0 mt-5 white-text text-center text-md-left\"\n          >\n            <h1 class=\"h1-responsive font-weight-bold \">Sign up right now!</h1>\n            <hr class=\"hr-light \" />\n            <h6 class=\"mb-3 \">\n              Do you want to use an extremely simple to use platform to create\n              your resume or portolio on? Look no further, as this site is just\n              that! An extremely user friendly tool to make simple portfolios.\n            </h6>\n            <a\n              class=\"btn btn-outline-dark\"\n              href=\"#\"\n              data-cy=\"register-open\"\n              data-toggle=\"collapse\"\n              data-target=\"#collapseExample\"\n              (click)=\"scroll(target)\"\n              >Register Now!</a\n            >\n          </div>\n          <!--Grid column-->\n          <!--Grid column-->\n          <div\n            #target\n            class=\"col-md-6 col-xl-5 mb-4 collapse\"\n            id=\"collapseExample\"\n          >\n            <!--Form-->\n            <div class=\"card\">\n              <div class=\"card-body\">\n                <!--Header-->\n                <div class=\"text-center\">\n                  <h3 class=\"white-text\">\n                    Register:\n                  </h3>\n                  <hr class=\"hr-light\" />\n                </div>\n\n                <!--Body-->\n                <app-register></app-register>\n\n                <div class=\"text-center mt-4\">\n                  <hr class=\"hr-light mb-3 mt-4\" />\n                  <div class=\"inline-ul text-center\">\n                    <button\n                      type=\"button\"\n                      class=\"btn btn-default\"\n                      data-toggle=\"tooltip\"\n                      data-placement=\"bottom\"\n                      title=\"Contact support\"\n                      href=\"#\"\n                    >\n                      <mat-icon>contact_support</mat-icon>\n                    </button>\n                  </div>\n                </div>\n              </div>\n            </div>\n            <!--/.Form-->\n          </div>\n          <!--Grid column-->\n        </div>\n        <!--Grid row-->\n      </div>\n      <!-- Content -->\n    </div>\n    <!-- Mask & flexbox options-->\n  </div>\n</main>\n"

/***/ }),

/***/ "./src/app/main-page/main-page.component.ts":
/*!**************************************************!*\
  !*** ./src/app/main-page/main-page.component.ts ***!
  \**************************************************/
/*! exports provided: MainPageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPageComponent", function() { return MainPageComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var MainPageComponent = /** @class */ (function () {
    function MainPageComponent() {
    }
    MainPageComponent.prototype.ngOnInit = function () {
    };
    MainPageComponent.prototype.scroll = function (el) {
        el.scrollIntoView();
    };
    MainPageComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-main-page',
            template: __webpack_require__(/*! ./main-page.component.html */ "./src/app/main-page/main-page.component.html"),
            styles: [__webpack_require__(/*! ./main-page.component.css */ "./src/app/main-page/main-page.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], MainPageComponent);
    return MainPageComponent;
}());



/***/ }),

/***/ "./src/app/material/material.module.ts":
/*!*********************************************!*\
  !*** ./src/app/material/material.module.ts ***!
  \*********************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var angular_font_awesome__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-font-awesome */ "./node_modules/angular-font-awesome/dist/angular-font-awesome.es5.js");







var MaterialModule = /** @class */ (function () {
    function MaterialModule() {
    }
    MaterialModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_4__["FlexLayoutModule"],
                _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__["LayoutModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatOptionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSidenavModule"],
                angular_font_awesome__WEBPACK_IMPORTED_MODULE_6__["AngularFontAwesomeModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDatepickerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatNativeDateModule"]
            ],
            exports: [
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatButtonModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_4__["FlexLayoutModule"],
                _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__["LayoutModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatInputModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatOptionModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSelectModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatGridListModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatCardModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatIconModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatFormFieldModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatProgressSpinnerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSidenavModule"],
                angular_font_awesome__WEBPACK_IMPORTED_MODULE_6__["AngularFontAwesomeModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDatepickerModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatNativeDateModule"]
            ]
        })
    ], MaterialModule);
    return MaterialModule;
}());



/***/ }),

/***/ "./src/app/navbar.service.ts":
/*!***********************************!*\
  !*** ./src/app/navbar.service.ts ***!
  \***********************************/
/*! exports provided: NavbarService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarService", function() { return NavbarService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var NavbarService = /** @class */ (function () {
    function NavbarService() {
        this.visible = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](true);
        this.visible.next(true);
    }
    NavbarService.prototype.hide = function () { this.visible.next(false); };
    NavbarService.prototype.show = function () { this.visible.next(true); };
    NavbarService.prototype.toggle = function () { this.visible.next(!this.visible.getValue()); };
    NavbarService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], NavbarService);
    return NavbarService;
}());



/***/ }),

/***/ "./src/app/navbar/navbar.component.css":
/*!*********************************************!*\
  !*** ./src/app/navbar/navbar.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".login-container{\r\n    float: right;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbmF2YmFyL25hdmJhci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksWUFBWTtBQUNoQiIsImZpbGUiOiJzcmMvYXBwL25hdmJhci9uYXZiYXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5sb2dpbi1jb250YWluZXJ7XHJcbiAgICBmbG9hdDogcmlnaHQ7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/navbar/navbar.component.html":
/*!**********************************************!*\
  !*** ./src/app/navbar/navbar.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark\" *ngIf=\"visible$\">\n  <a href=\"#\" class=\"navbar-brand d-flex align-items-center\">\n    <svg\n      xmlns=\"http://www.w3.org/2000/svg\"\n      width=\"20\"\n      height=\"20\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      stroke-linecap=\"round\"\n      stroke-linejoin=\"round\"\n      stroke-width=\"2\"\n      aria-hidden=\"true\"\n      class=\"mr-2\"\n      viewBox=\"0 0 24 24\"\n      focusable=\"false\"\n    >\n      <path\n        d=\"M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z\"\n      ></path>\n      <circle cx=\"12\" cy=\"13\" r=\"4\"></circle>\n    </svg>\n    <strong>Portfolio</strong>\n  </a>\n  <button\n    class=\"navbar-toggler\"\n    type=\"button\"\n    data-toggle=\"collapse\"\n    data-target=\"#navbarNav\"\n    aria-controls=\"navbarNav\"\n    aria-expanded=\"false\"\n    aria-label=\"Toggle navigation\"\n  >\n    <span class=\"navbar-toggler-icon\"></span>\n  </button>\n  <div\n    *ngIf=\"loggedInUser$ | async as user; else elseNav\"\n    class=\"collapse navbar-collapse\"\n    id=\"navbarNav\"\n  >\n    <ul class=\"navbar-nav mr-auto\">\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" href=\"\"\n          >Settings <span class=\"sr-only\">(current)</span></a\n        >\n      </li>\n    </ul>\n    <span class=\"navbar-dark navbar-text mr-2 \">{{ user }}</span>\n\n    <button class=\"btn btn-outline-light mr-sm-2\" (click)=\"logout()\">\n      logout\n    </button>\n  </div>\n\n  <ng-template #elseNav>\n    <div class=\"collapse navbar-collapse\" id=\"navbarNav\">\n      <ul class=\"navbar-nav\"></ul>\n    </div>\n    <app-login></app-login>\n  </ng-template>\n</nav>\n"

/***/ }),

/***/ "./src/app/navbar/navbar.component.ts":
/*!********************************************!*\
  !*** ./src/app/navbar/navbar.component.ts ***!
  \********************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/layout */ "./node_modules/@angular/cdk/esm5/layout.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _navbar_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../navbar.service */ "./src/app/navbar.service.ts");
/* harmony import */ var _user_authentication_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../user/authentication.service */ "./src/app/user/authentication.service.ts");






var NavbarComponent = /** @class */ (function () {
    function NavbarComponent(_authenticationService, breakpointObserver, nav) {
        this._authenticationService = _authenticationService;
        this.breakpointObserver = breakpointObserver;
        this.nav = nav;
        this.loggedInUser$ = this._authenticationService.user$;
        this.isHandset$ = this.breakpointObserver
            .observe(_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_1__["Breakpoints"].Handset)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (result) { return result.matches; }));
    }
    NavbarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.nav.visible.subscribe(function (x) { return _this.visible$ = x; });
    };
    NavbarComponent.prototype.logout = function () {
        this._authenticationService.logout();
        location.reload();
    };
    NavbarComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-navbar',
            template: __webpack_require__(/*! ./navbar.component.html */ "./src/app/navbar/navbar.component.html"),
            styles: [__webpack_require__(/*! ./navbar.component.css */ "./src/app/navbar/navbar.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_user_authentication_service__WEBPACK_IMPORTED_MODULE_5__["AuthenticationService"],
            _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_1__["BreakpointObserver"],
            _navbar_service__WEBPACK_IMPORTED_MODULE_4__["NavbarService"]])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.css":
/*!*************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.css ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".error-template {padding: 40px 15px;text-align: center;}\r\n.error-actions {margin-top:15px;margin-bottom:15px;}\r\n.error-actions .btn { margin-right:10px; }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvcGFnZS1ub3QtZm91bmQvcGFnZS1ub3QtZm91bmQuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUIsa0JBQWtCLENBQUMsa0JBQWtCLENBQUM7QUFDdkQsZ0JBQWdCLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQztBQUNuRCxzQkFBc0IsaUJBQWlCLEVBQUUiLCJmaWxlIjoic3JjL2FwcC9wYWdlLW5vdC1mb3VuZC9wYWdlLW5vdC1mb3VuZC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmVycm9yLXRlbXBsYXRlIHtwYWRkaW5nOiA0MHB4IDE1cHg7dGV4dC1hbGlnbjogY2VudGVyO31cclxuLmVycm9yLWFjdGlvbnMge21hcmdpbi10b3A6MTVweDttYXJnaW4tYm90dG9tOjE1cHg7fVxyXG4uZXJyb3ItYWN0aW9ucyAuYnRuIHsgbWFyZ2luLXJpZ2h0OjEwcHg7IH0iXX0= */"

/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.html":
/*!**************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-md-12\">\n      <div class=\"error-template\">\n        <h1>\n          Oops!\n        </h1>\n        <h2>\n          404 Page Not Found\n        </h2>\n        <div class=\"error-details\">\n          Sorry, an error has occured, Requested page not found!\n        </div>\n        <div class=\"error-actions\">\n          <a href=\"\" class=\"btn btn-outline-dark mr-sm-2\"\n            ><span class=\"glyphicon glyphicon-home\"></span> Take Me Home </a\n          ><a\n            href=\"\"\n            class=\"btn btn-outline-dark mr-sm-2\"\n            data-toggle=\"collapse\"\n            data-target=\"#collapseExample\"\n            ><span class=\"glyphicon glyphicon-envelope\"></span> Contact Support\n          </a>\n        </div>\n        <iframe\n          class=\"collapse\"\n          id=\"collapseExample\"\n          width=\"560\"\n          height=\"315\"\n          src=\"https://www.youtube.com/embed/1vrEljMfXYo\"\n          frameborder=\"0\"\n          allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\"\n          allowfullscreen\n        ></iframe>\n      </div>\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/page-not-found/page-not-found.component.ts":
/*!************************************************************!*\
  !*** ./src/app/page-not-found/page-not-found.component.ts ***!
  \************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var PageNotFoundComponent = /** @class */ (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    PageNotFoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-page-not-found',
            template: __webpack_require__(/*! ./page-not-found.component.html */ "./src/app/page-not-found/page-not-found.component.html"),
            styles: [__webpack_require__(/*! ./page-not-found.component.css */ "./src/app/page-not-found/page-not-found.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/selective-preload-strategy.ts":
/*!***********************************************!*\
  !*** ./src/app/selective-preload-strategy.ts ***!
  \***********************************************/
/*! exports provided: SelectivePreloadStrategy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SelectivePreloadStrategy", function() { return SelectivePreloadStrategy; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");



var SelectivePreloadStrategy = /** @class */ (function () {
    function SelectivePreloadStrategy() {
    }
    SelectivePreloadStrategy.prototype.preload = function (route, load) {
        if (route.data && route.data.preload) {
            console.log('preload ' + route.path);
            return load();
        }
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(null);
    };
    SelectivePreloadStrategy = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({ providedIn: 'root' })
    ], SelectivePreloadStrategy);
    return SelectivePreloadStrategy;
}());



/***/ }),

/***/ "./src/app/user/auth.guard.ts":
/*!************************************!*\
  !*** ./src/app/user/auth.guard.ts ***!
  \************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./authentication.service */ "./src/app/user/authentication.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");




var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (next, state) {
        var x = state.url.toString().split('/');
        if (this.authService.user$.getValue() || x[x.length - 2] === "viewPortfolio") {
            return true;
        }
        this.authService.redirectUrl = state.url;
        this.router.navigate(['/main-page']);
        return false;
    };
    AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_authentication_service__WEBPACK_IMPORTED_MODULE_1__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/user/authentication.service.ts":
/*!************************************************!*\
  !*** ./src/app/user/authentication.service.ts ***!
  \************************************************/
/*! exports provided: AuthenticationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return AuthenticationService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");







function parseJwt(token) {
    if (!token) {
        return null;
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
}
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http, router) {
        var _this = this;
        this.http = http;
        this.router = router;
        this._tokenKey = 'currentUser';
        this.checkUserNameAvailability = function (email) {
            return _this.http.get(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Users/checkusername", {
                params: { email: email }
            });
        };
        var parsedToken = parseJwt(localStorage.getItem(this._tokenKey));
        if (parsedToken) {
            var expires = new Date(parseInt(parsedToken.exp, 10) * 1000) < new Date();
            if (expires) {
                localStorage.removeItem(this._tokenKey);
                parsedToken = null;
            }
        }
        this._user$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](parsedToken && parsedToken.unique_name);
    }
    Object.defineProperty(AuthenticationService.prototype, "user$", {
        get: function () {
            return this._user$;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthenticationService.prototype, "token", {
        get: function () {
            var localToken = localStorage.getItem(this._tokenKey);
            return !!localToken ? localToken : '';
        },
        enumerable: true,
        configurable: true
    });
    AuthenticationService.prototype.login = function (email, password) {
        var _this = this;
        return this.http
            .post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Users", { email: email, password: password })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (token) {
            if (token) {
                localStorage.setItem(_this._tokenKey, token);
                _this._user$.next(email);
                return true;
            }
            else {
                return false;
            }
        }));
    };
    AuthenticationService.prototype.logout = function () {
        if (this._user$.getValue()) {
            localStorage.removeItem(this._tokenKey);
            this._user$.next(null);
            this.router.navigateByUrl("");
        }
    };
    AuthenticationService.prototype.register = function (firstname, lastname, email, password) {
        var _this = this;
        return this.http
            .post(src_environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].apiUrl + "/Users/register", { email: email, password: password, firstname: firstname, lastname: lastname, passwordConfirmation: password })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (token) {
            if (token) {
                localStorage.setItem(_this._tokenKey, token);
                _this._user$.next(email);
                return true;
            }
            else {
                return false;
            }
        }));
    };
    AuthenticationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"], _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"]])
    ], AuthenticationService);
    return AuthenticationService;
}());



/***/ }),

/***/ "./src/app/user/login/login.component.css":
/*!************************************************!*\
  !*** ./src/app/user/login/login.component.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3VzZXIvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/user/login/login.component.html":
/*!*************************************************!*\
  !*** ./src/app/user/login/login.component.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<form class=\"form-inline\" [formGroup]=\"user\" (ngSubmit)=\"onSubmit()\">\n    <div *ngIf=\"user.invalid\">\n      <div *ngIf=\"user.dirty\">\n        <div class=\"alert alert-danger m-auto mr-sm-2\" >\n        <div class=\"m-auto mr-2 text-white\" *ngIf=\"isValid('username')\">Email is required</div>\n        <div class=\"m-auto mr-2 text-white\" *ngIf=\"isValid('password')\">Password is required</div>\n      </div>\n      </div>\n    </div>\n    <div class=\"alert alert-danger m-auto mr-sm-2\" *ngIf=\"errorMsg\">\n        {{errorMsg}}\n      </div>\n\n  <div class=\"input-group p-1\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon1\">\n        <mat-icon>person</mat-icon>\n      </span>\n    </div>\n    \n    <input\n      type=\"email\"\n      class=\"form-control mr-sm-2 \"\n      placeholder=\"Email\"\n      aria-label=\"Username\"\n      aria-describedby=\"basic-addon1\"\n      data-cy=\"login-email\"\n      formControlName=\"username\"\n      [ngClass]=\"fieldClass('username')\"\n    />\n    \n  </div>\n\n\n  <div class=\"input-group p-1\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon2\">\n        <mat-icon>lock</mat-icon>\n      </span>\n    </div>\n    <input\n      type=\"password\"\n      class=\"form-control mr-sm-2 \"\n      placeholder=\"Password\"\n      aria-label=\"Password\"\n      aria-describedby=\"basic-addon2\"\n      data-cy=\"login-password\"\n      formControlName=\"password\"\n      [ngClass]=\"fieldClass('password')\"\n    />\n  </div>\n\n  <div class=\"p-1\">\n    <button\n      class=\"btn btn-outline-light mr-sm-2\"\n      type=\"submit\"\n      data-cy=\"login-button\"\n      [disabled]=\"user.invalid\"\n    >\n      Login\n    </button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/user/login/login.component.ts":
/*!***********************************************!*\
  !*** ./src/app/user/login/login.component.ts ***!
  \***********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../authentication.service */ "./src/app/user/authentication.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");





var LoginComponent = /** @class */ (function () {
    function LoginComponent(authService, router, fb) {
        this.authService = authService;
        this.router = router;
        this.fb = fb;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.user = this.fb.group({
            username: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].email]],
            password: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required]
        });
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        //ADD EXHAUST HERE IN CASE THEY SPAM LOGIN!!
        this.authService
            .login(this.user.value.username, this.user.value.password)
            .subscribe(function (val) {
            if (val) {
                if (_this.authService.redirectUrl) {
                    _this.router.navigateByUrl(_this.authService.redirectUrl);
                    _this.authService.redirectUrl = undefined;
                }
                else {
                    _this.router.navigate(["/portfolio/main-portfolio"]);
                }
            }
            else {
                _this.errorMsg = "Could not login";
            }
        }, function (err) {
            console.log(err);
            if (err.error instanceof Error) {
                _this.errorMsg = "Error while trying to login user " + _this.user.value.username + ": " + err.error.message;
            }
            else {
                _this.errorMsg = "Error " + err.status + " while trying to login user " + _this.user.value.username + ": " + err.error;
                _this.errorMsg = "Are you sure you entered the right Email and Password?";
            }
        });
    };
    LoginComponent.prototype.isValid = function (field) {
        var input = this.user.get(field);
        return input.dirty && input.invalid;
    };
    LoginComponent.prototype.fieldClass = function (field) {
        return { "is-invalid": this.isValid(field) };
    };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: "app-login",
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/user/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/user/login/login.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_authentication_service__WEBPACK_IMPORTED_MODULE_1__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/user/register/register.component.css":
/*!******************************************************!*\
  !*** ./src/app/user/register/register.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3VzZXIvcmVnaXN0ZXIvcmVnaXN0ZXIuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/user/register/register.component.html":
/*!*******************************************************!*\
  !*** ./src/app/user/register/register.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"alert alert-danger mr-sm-2\" role=\"alert\" *ngIf=\"\nuser.get('passwordGroup').errors &&\nuser.get('passwordGroup').get('confirmPassword').touched &&\nuser.get('passwordGroup').get('password').touched\n\">\n\n\n  {{ getErrorMessage(user.get(\"passwordGroup\").errors) }}\n\n</div>\n\n\n<div class=\"alert alert-danger mr-sm-2\" *ngIf=\"errorMsg\">\n  {{errorMsg}}\n</div>\n\n<form [formGroup]=\"user\" (ngSubmit)=\"onSubmit()\">\n<div class=\"form-row\">\n  <div class=\"col-sm-6 input-group mb-3\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon1\">\n        <mat-icon>account_circle</mat-icon>\n      </span>\n    </div>\n    <input\n      type=\"text\"\n      class=\"form-control mr-sm-2\"\n      placeholder=\"Firstname\"\n      aria-label=\"Firstname\"\n      aria-describedby=\"basic-addon1\"\n      data-cy=\"register-firstname\"\n      formControlName=\"firstname\"\n      [ngClass]=\"fieldClass('firstname')\"\n    />\n    <div class=\"invalid-feedback\" *ngIf=\"isValid('firstname')\">\n        Firstname {{getErrorMessage(user.get(\"firstname\").errors)}}\n    </div>\n  </div>\n\n    <div class=\"col-sm-6 input-group mb-3\">\n    <input\n      type=\"text\"\n      class=\"form-control mr-sm-2\"\n      placeholder=\"Surname\"\n      aria-label=\"Surname\"\n      aria-describedby=\"basic-addon1\"\n      data-cy=\"register-lastname\"\n      formControlName=\"lastname\"\n      [ngClass]=\"fieldClass('lastname')\"\n    />\n    <div class=\"invalid-feedback\" *ngIf=\"isValid('lastname')\">\n        Lastname {{getErrorMessage(user.get(\"lastname\").errors)}}\n    </div>\n  </div>\n</div>\n  \n  <div class=\"input-group mb-3\">\n    <div class=\"input-group-prepend\">\n      <span class=\"input-group-text\" id=\"basic-addon1\">\n        <mat-icon>email</mat-icon>\n      </span>\n    </div>\n    <input\n      type=\"email\"\n      class=\"form-control mr-sm-2\"\n      placeholder=\"Email\"\n      aria-label=\"Username\"\n      aria-describedby=\"basic-addon1\"\n      data-cy=\"register-email\"\n      formControlName=\"email\"\n      [ngClass]=\"fieldClass('email')\"\n    />\n    <div class=\"invalid-feedback\" *ngIf=\"isValid('email')\">\n        User {{getErrorMessage(user.get(\"email\").errors)}}\n    </div>\n  </div>\n \n  <span formGroupName=\"passwordGroup\">\n    <div class=\"input-group mb-3\">\n      <div class=\"input-group-prepend\">\n        <span class=\" input-group-text\" id=\"basic-addon2\">\n          <mat-icon>lock</mat-icon>\n        </span>\n      </div>\n      <input\n        type=\"password\"\n        class=\"form-control mr-sm-2\"\n        placeholder=\"Password\"\n        aria-label=\"Password\"\n        aria-describedby=\"basic-addon2\"\n        data-cy=\"register-password\"\n        formControlName=\"password\"\n        [ngClass]=\"fieldClass('passwordGroup.password')\"\n        \n      />\n      <div class=\"invalid-feedback\" *ngIf=\"isValid('passwordGroup.password')\">\n          Password {{getErrorMessage(user.get(\"passwordGroup.password\").errors)}}\n      </div>\n    </div>\n  \n    <div class=\"input-group mb-3\">\n      <div class=\"input-group-prepend\">\n        <span class=\" input-group-text\" id=\"basic-addon2\">\n          <mat-icon>lock</mat-icon>\n        </span>\n      </div>\n      <input\n        type=\"password\"\n        class=\"form-control mr-sm-2\"\n        placeholder=\"Password Confirmation\"\n        aria-label=\"Password\"\n        aria-describedby=\"basic-addon2\"\n        data-cy=\"register-confirm-password\"\n        formControlName=\"confirmPassword\"\n        [ngClass]=\"fieldClass('passwordGroup.confirmPassword')\"\n      />\n      <div class=\"invalid-feedback\" *ngIf=\"isValid('passwordGroup.confirmPassword')\">\n          Password {{getErrorMessage(user.get(\"passwordGroup.confirmPassword\").errors)}}\n      </div>\n    </div>\n  </span>\n  <div class=\"text-center mt-4\">\n    <button\n      type=\"submit\"\n      class=\"btn btn-outline-dark\"\n      data-cy=\"register-button\"\n      [disabled]=\"user.invalid\"\n    >\n      Sign up\n    </button>\n  </div>\n</form>\n"

/***/ }),

/***/ "./src/app/user/register/register.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/user/register/register.component.ts ***!
  \*****************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _authentication_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../authentication.service */ "./src/app/user/authentication.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");






function comparePasswords(control) {
    var password = control.get('password');
    var confirmPassword = control.get('confirmPassword');
    return password.value === confirmPassword.value
        ? null
        : { passwordsDiffer: true };
}
function serverSideValidateUsername(checkAvailabilityFn) {
    return function (control) {
        return checkAvailabilityFn(control.value).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (available) {
            if (available) {
                return null;
            }
            return { userAlreadyExists: true };
        }));
    };
}
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(authService, router, fb) {
        this.authService = authService;
        this.router = router;
        this.fb = fb;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        var signRegex = /[!@#$%^&*(),.?":{}|<>_-]/;
        this.user = this.fb.group({
            firstname: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            lastname: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required],
            email: [
                '',
                [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].email],
                serverSideValidateUsername(this.authService.checkUserNameAvailability)
            ],
            passwordGroup: this.fb.group({
                password: ['',
                    [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(/\d/),
                        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(/[A-Z]/),
                        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(/[a-z]/),
                        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(signRegex),
                        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(8)
                    ]],
                confirmPassword: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required]
            }, { validator: comparePasswords })
        });
    };
    RegisterComponent.prototype.getErrorMessage = function (errors) {
        if (!errors) {
            return null;
        }
        if (errors.required) {
            return 'is required';
        }
        else if (errors.minlength) {
            return "needs at least " + errors.minlength.requiredLength + " characters (got " + errors.minlength.actualLength + ")";
        }
        else if (errors.userAlreadyExists) {
            return "already exists";
        }
        else if (errors.email) {
            return "Not valid";
        }
        else if (errors.passwordsDiffer) {
            return "Passwords are not the same";
        }
        else if (errors.pattern) {
            return " need at least 8 characters, one number, one capital, one lower case and one special symbol";
        }
    };
    RegisterComponent.prototype.onSubmit = function () {
        var _this = this;
        //ADD EXHAUST HERE IN CASE THEY SPAM LOGIN!!
        this.authService
            .register(this.user.value.firstname, this.user.value.lastname, this.user.value.email, this.user.value.passwordGroup.password)
            .subscribe(function (val) {
            if (val) {
                if (_this.authService.redirectUrl) {
                    _this.router.navigateByUrl(_this.authService.redirectUrl);
                    _this.authService.redirectUrl = undefined;
                }
                else {
                    _this.router.navigate(['']);
                }
            }
            else {
                _this.errorMsg = "Could not login";
            }
        }, function (err) {
            console.log(err);
            if (err.error instanceof Error) {
                _this.errorMsg = "Error while trying to login user " + _this.user.value.email + ": " + err.error.message;
            }
            else {
                _this.errorMsg = "Error " + err.status + " while trying to login user " + _this.user.value.email + ": " + err.error;
            }
        });
    };
    RegisterComponent.prototype.isValid = function (field) {
        var input = this.user.get(field);
        return input.dirty && input.invalid;
    };
    RegisterComponent.prototype.fieldClass = function (field) {
        return { "is-invalid": this.isValid(field) };
    };
    RegisterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-register',
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/user/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.css */ "./src/app/user/register/register.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_authentication_service__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_4__["Router"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"]])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "./src/app/user/user.module.ts":
/*!*************************************!*\
  !*** ./src/app/user/user.module.ts ***!
  \*************************************/
/*! exports provided: UserModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserModule", function() { return UserModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login/login.component */ "./src/app/user/login/login.component.ts");
/* harmony import */ var _register_register_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./register/register.component */ "./src/app/user/register/register.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _material_material_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../material/material.module */ "./src/app/material/material.module.ts");









var routes = [
    { path: 'login', component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"] },
    { path: 'register', component: _register_register_component__WEBPACK_IMPORTED_MODULE_4__["RegisterComponent"] }
];
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"], _register_register_component__WEBPACK_IMPORTED_MODULE_4__["RegisterComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_6__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ReactiveFormsModule"],
                _material_material_module__WEBPACK_IMPORTED_MODULE_8__["MaterialModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forChild(routes)
            ],
            exports: [_login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"], _register_register_component__WEBPACK_IMPORTED_MODULE_4__["RegisterComponent"]]
        })
    ], UserModule);
    return UserModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    apiUrl: '/api'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\wanne\Documents\school\TI\Jaar 2\web4\project\web4-20182019-gent-2b32c3ic-WannesDC\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map