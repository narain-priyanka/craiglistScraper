"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapedJobListing = scrapedJobListing;
exports.scrapedJobDescription = scrapedJobDescription;
var puppeteer = require("puppeteer");
var cheerio = require("cheerio");
var randomSleep = function (min, max) { return new Promise(function (r) { return setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min); }); };
var userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
];
var getRandomUserAgent = function () { return userAgents[Math.floor(Math.random() * userAgents.length)]; };
// const listOfJobs: { job: string, url: string | undefined, description: string, datePosted: Date, hood: string }[] = [];
function scrapedJobListing(page) {
    return __awaiter(this, void 0, void 0, function () {
        var listOfJobs, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listOfJobs = [];
                    _loop_1 = function (i) {
                        var pageUrl, html, $, scrappedJobList;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    pageUrl = "https://newyork.craigslist.org/search/jjj#search=1~thumb~".concat(i, "~0");
                                    return [4 /*yield*/, page.setUserAgent(getRandomUserAgent())];
                                case 1:
                                    _b.sent();
                                    return [4 /*yield*/, page.setViewport({ width: 1280, height: 800 })];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 30000 })];
                                case 3:
                                    _b.sent();
                                    return [4 /*yield*/, randomSleep(2000, 5000)];
                                case 4:
                                    _b.sent(); // Avoid bot detection
                                    // Wait for the job listing elements
                                    return [4 /*yield*/, page.waitForSelector(".result-info")];
                                case 5:
                                    // Wait for the job listing elements
                                    _b.sent(); // for race condition
                                    return [4 /*yield*/, page.content()];
                                case 6:
                                    html = _b.sent();
                                    $ = cheerio.load(html);
                                    scrappedJobList = $(".result-info").map(function (index, element) {
                                        var jobTitleUrlData = $(element).find(".title-blob>a");
                                        var job = $(jobTitleUrlData).text();
                                        var url = $(jobTitleUrlData).attr("href");
                                        var timeElement = $(element).find(".meta > span");
                                        var datePosted = new Date($(timeElement).attr("title"));
                                        var hoodElement = $(element).find(".supertitle");
                                        var hood = $(hoodElement).text().trim().replace("(", "").replace(")", "");
                                        return { job: job, url: url, datePosted: datePosted, hood: hood, description: "" };
                                    }).get();
                                    listOfJobs.push.apply(listOfJobs, scrappedJobList);
                                    console.log("Page ".concat(i, " scraped successfully."));
                                    return [2 /*return*/];
                            }
                        });
                    };
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i <= 20)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log(listOfJobs);
                    // console.log(`Total jobs scraped: ${listOfJobs.length}`);
                    return [2 /*return*/, listOfJobs];
            }
        });
    });
}
function scrapedJobDescription(jobListings, page) {
    return __awaiter(this, void 0, void 0, function () {
        var i, url, html, $, description, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < jobListings.length)) return [3 /*break*/, 13];
                    url = jobListings[i].url;
                    if (!url) return [3 /*break*/, 10];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, randomSleep(2000, 5000)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.setUserAgent(getRandomUserAgent())];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, randomSleep(1000, 3000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page.content()];
                case 7:
                    html = _a.sent();
                    $ = cheerio.load(html);
                    description = $("#postingbody").text();
                    jobListings[i].description = description.trim(); // Update the job description
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("Failed to scrape ".concat(url, ": ").concat(error_1.message));
                    return [3 /*break*/, 9];
                case 9: return [3 /*break*/, 11];
                case 10:
                    console.warn("Job listing at index ".concat(i, " has no URL."));
                    _a.label = 11;
                case 11:
                    console.log("Job ".concat(i + 1, ":"));
                    console.log("Title: ".concat(jobListings[i].job));
                    console.log("Location: ".concat(jobListings[i].hood));
                    console.log("Posted: ".concat(jobListings[i].datePosted));
                    console.log("Link: ".concat(jobListings[i].url));
                    console.log("Description: ".concat(jobListings[i].description.slice(0, 200), "..."));
                    console.log("---------------------------------------------------");
                    _a.label = 12;
                case 12:
                    i++;
                    return [3 /*break*/, 1];
                case 13: 
                // console.log(jobListings);
                return [2 /*return*/, jobListings];
            }
        });
    });
}
