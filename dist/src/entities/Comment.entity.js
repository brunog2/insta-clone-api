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
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
const Post_entity_1 = require("./Post.entity");
const Like_entity_1 = require("./Like.entity");
let Comment = Comment_1 = class Comment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { length: 1000 }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Like_entity_1.Like, like => like.post),
    __metadata("design:type", Array)
], Comment.prototype, "likes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Post_entity_1.Post, post => post.comments),
    __metadata("design:type", Post_entity_1.Post)
], Comment.prototype, "post", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.posts),
    __metadata("design:type", User_entity_1.User)
], Comment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Comment_1, comment => comment.children),
    __metadata("design:type", Comment)
], Comment.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => Comment_1, comment => comment.parent),
    __metadata("design:type", Array)
], Comment.prototype, "children", void 0);
Comment = Comment_1 = __decorate([
    (0, typeorm_1.Entity)()
], Comment);
exports.Comment = Comment;
