
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

export enum Language {
    EN = "EN",
    DE = "DE"
}
export enum Privacy {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FRIENDS = "FRIENDS"
}
export enum LanguageInput {
    EN = "EN",
    DE = "DE"
}
export enum MOST_RECENT_MOST_STARREDInput {
    MOST_RECENT = "MOST_RECENT",
    MOST_STARRED = "MOST_STARRED"
}
export enum PrivacyInput {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    FRIENDS = "FRIENDS"
}

export type FiltersInput_1_2_3_4_5_6 = {
    userId?: t.String;
};
export type FiltersInput_1_2 = {
    query?: t.String;
    from?: t.Date;
    to?: t.Date;
    language?: LanguageInput;
    orderBy?: MOST_RECENT_MOST_STARREDInput;
};
export type FiltersInput_1_2_3 = {
    query?: t.String;
    from?: t.Date;
    to?: t.Date;
    language?: LanguageInput;
    orderBy?: MOST_RECENT_MOST_STARREDInput;
};
export type FiltersInput_1_2_3_4 = {
    userId?: t.String;
    from?: t.Date;
    to?: t.Date;
};
export type FiltersInput_1_2_3_4_5 = {
    userId?: t.String;
    from?: t.Date;
    to?: t.Date;
};
export type FiltersInput = {
    userId?: t.String;
    privacy?: PrivacyInput;
    language?: LanguageInput;
    query?: t.String;
    from?: t.Date;
    to?: t.Date;
};
export type FiltersInput_1 = {
    userId?: t.String;
    language?: LanguageInput;
};
export type ProfileUpdateDataInput = {
    language?: LanguageInput;
    bio?: t.String;
};
export type PostDataInput = {
    title: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInput;
    language?: LanguageInput;
};
export type PostUpdateDataInput = {
    title?: t.String;
    language?: LanguageInput;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInput;
};

export class Query {
    __typename: t.String;
    profile: (userId: t.String) => Profile;
    allProfile: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number) => Connection;
    post: (postId?: t.String, slug?: t.String) => Post;
    allPost: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput) => Connection_1;
    allPostTrending: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput_1) => Connection_1;
    version: t.String;
    constructor() { this.__typename = ""; this.profile = fnProxy(Profile); this.allProfile = fnProxy(Connection); this.post = fnProxy(Post); this.allPost = fnProxy(Connection_1); this.allPostTrending = fnProxy(Connection_1); this.version = ""; }
}
export class Profile {
    __typename: t.String;
    id: t.String;
    bio: t.Nullable<t.String>;
    createdAt: t.Date;
    updatedAt: t.Date;
    language: t.Nullable<Language>;
    posts: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number) => Connection_1;
    starredPosts: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput_1_2) => Connection_1_2;
    stars: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput_1_2_3) => Connection_1_2_3;
    followers: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput_1_2_3_4) => Connection_1_2_3_4;
    following: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput_1_2_3_4_5) => Connection_1_2_3_4_5;
    activity: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number) => Connection_1_2_3_4_5_6;
    views: t.Number;
    constructor() { this.__typename = ""; this.id = ""; this.bio = null; this.createdAt = ""; this.updatedAt = ""; this.language = null; this.posts = fnProxy(Connection_1); this.starredPosts = fnProxy(Connection_1_2); this.stars = fnProxy(Connection_1_2_3); this.followers = fnProxy(Connection_1_2_3_4); this.following = fnProxy(Connection_1_2_3_4_5); this.activity = fnProxy(Connection_1_2_3_4_5_6); this.views = null; }
}
export class Connection_1 {
    __typename: t.String;
    nodes: Post[];
    edges: Edge[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Post); this.edges = arrayProxy(Edge); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Post {
    __typename: t.String;
    id: t.String;
    slug: t.String;
    title: t.String;
    avatarURL: t.Nullable<t.String>;
    summary: t.Nullable<t.String>;
    content: t.Nullable<t.String>;
    profileId: t.String;
    createdAt: t.Date;
    updatedAt: t.Date;
    privacy: t.Nullable<Privacy>;
    language: t.Nullable<Language>;
    matchingQuery: t.Nullable<t.String>;
    profile: t.Nullable<Profile>;
    stars: (after?: t.String, before?: t.String, first?: t.Number, last?: t.Number, filters?: FiltersInput_1_2_3_4_5_6) => Connection_1_2_3_4_5_6_7;
    views: t.Number;
    constructor() { this.__typename = ""; this.id = ""; this.slug = ""; this.title = ""; this.avatarURL = null; this.summary = null; this.content = null; this.profileId = ""; this.createdAt = ""; this.updatedAt = ""; this.privacy = null; this.language = null; this.matchingQuery = null; this.profile = proxy(Profile); this.stars = fnProxy(Connection_1_2_3_4_5_6_7); this.views = null; }
}
export class Connection_1_2_3_4_5_6_7 {
    __typename: t.String;
    nodes: Nodes[];
    edges: Edge_1[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes); this.edges = arrayProxy(Edge_1); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes {
    __typename: t.String;
    id: t.String;
    profile: Profile;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.profile = proxy(Profile); this.createdAt = ""; }
}
export class Edge_1 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes); }
}
export class PageInfo {
    __typename: t.String;
    hasNextPage: t.Boolean;
    hasPreviousPage: t.Boolean;
    startCursor: t.Nullable<t.String>;
    endCursor: t.Nullable<t.String>;
    constructor() { this.__typename = ""; this.hasNextPage = false; this.hasPreviousPage = false; this.startCursor = null; this.endCursor = null; }
}
export class Edge {
    __typename: t.String;
    cursor: t.String;
    node: Post;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Post); }
}
export class Connection_1_2 {
    __typename: t.String;
    nodes: Nodes_1[];
    edges: Edge_1_2[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1); this.edges = arrayProxy(Edge_1_2); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1 {
    __typename: t.String;
    id: t.String;
    post: Post;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.post = proxy(Post); this.createdAt = ""; }
}
export class Edge_1_2 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1); }
}
export class Connection_1_2_3 {
    __typename: t.String;
    nodes: Nodes_1_2[];
    edges: Edge_1_2_3[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2); this.edges = arrayProxy(Edge_1_2_3); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2 {
    __typename: t.String;
    id: t.String;
    post: Post;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.post = proxy(Post); this.createdAt = ""; }
}
export class Edge_1_2_3 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2); }
}
export class Connection_1_2_3_4 {
    __typename: t.String;
    nodes: Nodes_1_2_3[];
    edges: Edge_1_2_3_4[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2_3); this.edges = arrayProxy(Edge_1_2_3_4); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2_3 {
    __typename: t.String;
    id: t.String;
    follower: Profile;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.follower = proxy(Profile); this.createdAt = ""; }
}
export class Edge_1_2_3_4 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2_3;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2_3); }
}
export class Connection_1_2_3_4_5 {
    __typename: t.String;
    nodes: Nodes_1_2_3_4[];
    edges: Edge_1_2_3_4_5[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2_3_4); this.edges = arrayProxy(Edge_1_2_3_4_5); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2_3_4 {
    __typename: t.String;
    id: t.String;
    followed: Profile;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.followed = proxy(Profile); this.createdAt = ""; }
}
export class Edge_1_2_3_4_5 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2_3_4;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2_3_4); }
}
export class Connection_1_2_3_4_5_6 {
    __typename: t.String;
    nodes: Nodes_1_2_3_4_5[];
    edges: Edge_1_2_3_4_5_6[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Nodes_1_2_3_4_5); this.edges = arrayProxy(Edge_1_2_3_4_5_6); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Nodes_1_2_3_4_5 {
    __typename: t.String;
    id: t.String;
    createdAt: t.String;
    type: t.String;
    post: t.Nullable<Post>;
    follow: t.Nullable<Follow>;
    constructor() { this.__typename = ""; this.id = ""; this.createdAt = ""; this.type = ""; this.post = proxy(Post); this.follow = proxy(Follow); }
}
export class Follow {
    __typename: t.String;
    createdAt: t.Date;
    followed: Profile;
    constructor() { this.__typename = ""; this.createdAt = ""; this.followed = proxy(Profile); }
}
export class Edge_1_2_3_4_5_6 {
    __typename: t.String;
    cursor: t.String;
    node: Nodes_1_2_3_4_5;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Nodes_1_2_3_4_5); }
}
export class Connection {
    __typename: t.String;
    nodes: Profile[];
    edges: Edge_1_2_3_4_5_6_7[];
    pageInfo: PageInfo;
    totalCount: t.Number;
    constructor() { this.__typename = ""; this.nodes = arrayProxy(Profile); this.edges = arrayProxy(Edge_1_2_3_4_5_6_7); this.pageInfo = proxy(PageInfo); this.totalCount = null; }
}
export class Edge_1_2_3_4_5_6_7 {
    __typename: t.String;
    cursor: t.String;
    node: Profile;
    constructor() { this.__typename = ""; this.cursor = ""; this.node = proxy(Profile); }
}
export class Mutation {
    __typename: t.String;
    profileCreate: Profile;
    profileUpdate: (values: ProfileUpdateDataInput) => Profile;
    profileDelete: t.Boolean;
    profileFollow: (userId: t.String) => ProfileFollow;
    profileUnfollow: (userId: t.String) => ProfileFollow;
    postCreate: (values: PostDataInput) => Post;
    postUpdate: (postId: t.String, values: PostUpdateDataInput) => Post;
    postDelete: (postId: t.String) => t.Boolean;
    postStar: (postId: t.String) => PostStar;
    postUnstar: (postId: t.String) => PostStar;
    constructor() { this.__typename = ""; this.profileCreate = proxy(Profile); this.profileUpdate = fnProxy(Profile); this.profileDelete = false; this.profileFollow = fnProxy(ProfileFollow); this.profileUnfollow = fnProxy(ProfileFollow); this.postCreate = fnProxy(Post); this.postUpdate = fnProxy(Post); this.postDelete = () => false; this.postStar = fnProxy(PostStar); this.postUnstar = fnProxy(PostStar); }
}
export class ProfileFollow {
    __typename: t.String;
    id: t.String;
    followerId: t.String;
    followedId: t.String;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.followerId = ""; this.followedId = ""; this.createdAt = ""; }
}
export class PostStar {
    __typename: t.String;
    id: t.String;
    postId: t.String;
    profileId: t.String;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.id = ""; this.postId = ""; this.profileId = ""; this.createdAt = ""; }
}

