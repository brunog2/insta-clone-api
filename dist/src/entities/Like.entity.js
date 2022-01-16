"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
const typeorm_1 = require("typeorm");
const Post_entity_1 = require("./Post.entity");
const Comment_entity_1 = require("./Comment.entity");
let Like = class Like extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Like.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 1000 }),
    __metadata("design:type", String)
], Like.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Post_entity_1.Post, post => post.likes),
    __metadata("design:type", Post_entity_1.Post)
], Like.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Comment_entity_1.Comment, comment => comment.likes),
    __metadata("design:type", Comment_entity_1.Comment)
], Like.prototype, "comment", void 0);
Like = __decorate([
    (0, typeorm_1.Entity)()
], Like);
exports.Like = Like;
