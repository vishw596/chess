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
exports.Game = void 0;
exports.isPromoting = isPromoting;
var chess_js_1 = require("chess.js");
var message_1 = require("./message");
var crypto_1 = require("crypto");
var client_1 = require("@repo/db/client");
var SocketManager_1 = require("./SocketManager");
function isPromoting(chess, from, to) {
    if (!from)
        return false;
    var piece = chess.get(from);
    if ((piece === null || piece === void 0 ? void 0 : piece.type) !== "p") {
        return false;
    }
    if (piece.color !== chess.turn()) {
        return false;
    }
    if (!["1", "8"].some(function (it) { return to.endsWith(it); })) {
        return false;
    }
    return chess
        .moves({ square: from, verbose: true })
        .map(function (it) { return it.to; })
        .includes(to);
}
var Game = /** @class */ (function () {
    function Game(player1UserId, player2UserId, startTime, gameId) {
        this.moveCount = 0;
        this.time = null;
        this.moveTimer = null;
        this.result = null;
        this.player1TimeConsumed = 0;
        this.plater2TimeConsumed = 0;
        this.startTime = new Date(Date.now());
        this.lastMoveTime = new Date(Date.now());
        this.player1UserId = player1UserId;
        this.player2UserId = player2UserId;
        this.board = new chess_js_1.Chess();
        this.gameId = gameId !== null && gameId !== void 0 ? gameId : (0, crypto_1.randomUUID)();
        if (startTime) {
            this.startTime = startTime;
            this.lastMoveTime = startTime;
        }
        console.log(client_1.AuthProvider.EMAIL);
    }
    Game.prototype.seedMove = function (moves) {
        var _this = this;
        moves.forEach(function (move) {
            if (isPromoting(_this.board, move.from, move.to)) {
                _this.board.move({
                    from: move.from,
                    to: move.to,
                    promotion: "q",
                });
            }
            else {
                _this.board.move({
                    from: move.from,
                    to: move.to,
                });
            }
        });
        this.moveCount = moves.length;
        var lastMove = moves[moves.length - 1];
        if (lastMove && lastMove.createdAt) {
            this.lastMoveTime = lastMove.createdAt;
        }
        moves.map(function (move, index) {
            if (move.timeTaken) {
                if (index % 2 == 0) {
                    _this.player1TimeConsumed += move.timeTaken;
                }
                else {
                    _this.player1TimeConsumed += move.timeTaken;
                }
            }
        });
    };
    Game.prototype.updateSecondPlayer = function (player2UserId) {
        return __awaiter(this, void 0, void 0, function () {
            var users, e_1, WhitePlayer, BlackPlayer;
            var _this = this;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.player2UserId = player2UserId;
                        return [4 /*yield*/, client_1.client.user.findMany({
                                where: {
                                    id: {
                                        in: [this.player1UserId, (_a = this.player2UserId) !== null && _a !== void 0 ? _a : ""],
                                    },
                                },
                            })];
                    case 1:
                        users = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.createGameInDb()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        console.log(e_1);
                        return [2 /*return*/];
                    case 5:
                        WhitePlayer = users.find(function (user) { return user.id === _this.player1UserId; });
                        BlackPlayer = users.find(function (user) { return user.id === _this.player2UserId; });
                        SocketManager_1.socketManager.broadcast(this.gameId, JSON.stringify({
                            type: message_1.INIT_GAME,
                            payload: {
                                gameId: this.gameId,
                                whitePlayer: {
                                    name: WhitePlayer === null || WhitePlayer === void 0 ? void 0 : WhitePlayer.name,
                                    id: this.player1UserId,
                                    isGuest: (WhitePlayer === null || WhitePlayer === void 0 ? void 0 : WhitePlayer.provider) == client_1.AuthProvider.GUEST
                                }
                            }
                        }));
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.createGameInDb = function () {
        return __awaiter(this, void 0, void 0, function () {
            var game;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.startTime = new Date(Date.now());
                        this.lastMoveTime = this.startTime;
                        return [4 /*yield*/, client_1.client.game.create({
                                data: {
                                    id: this.gameId,
                                    timeControl: "CLASSICAL",
                                    status: "IN_PROGRESS",
                                    startAt: this.startTime,
                                    currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                                    whitePlayer: {
                                        connect: {
                                            id: this.player1UserId,
                                        },
                                    },
                                    blackPlayer: {
                                        connect: {
                                            id: this.player2UserId,
                                        },
                                    },
                                },
                                include: {
                                    whitePlayer: true,
                                    blackPlayer: true,
                                },
                            })];
                    case 1:
                        game = _a.sent();
                        this.gameId = game.id;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Game;
}());
exports.Game = Game;
var game = new Game("123", "123", new Date(), "ekjfns");
