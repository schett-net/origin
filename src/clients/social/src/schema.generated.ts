
import { proxy, arrayProxy, fnProxy, fnArrayProxy, t } from "snek-query";

export enum Privacy {
    public = "public",
    private = "private",
    friends = "friends"
}
export enum PrivacyInput {
    public = "public",
    private = "private",
    friends = "friends"
}

export type FiltersInput = {
    profileId?: t.String;
    privacy?: PrivacyInput;
    limit?: t.NotSupportedYet;
    offset?: t.NotSupportedYet;
};
export type FiltersInput_1 = {
    limit?: t.NotSupportedYet;
    offset?: t.NotSupportedYet;
};
export type ProfileUpdateDataInput = {
    bio?: t.String;
};
export type PostDataInput = {
    title: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInput;
};
export type PostUpdateDataInput = {
    title?: t.String;
    avatarURL?: t.String;
    summary?: t.String;
    content?: t.String;
    privacy?: PrivacyInput;
};

export class Query {
    __typename: t.String;
    profile: (args?: {
        profileId?: t.String;
    }) => Profile;
    allProfile: Profile[];
    post: (args: {
        postId: t.String;
    }) => t.Nullable<Post>;
    allPost: (args?: {
        filters?: FiltersInput;
    }) => Post[];
    allPostTrending: (args?: {
        filters?: FiltersInput_1;
    }) => Post[];
    version: t.String;
    constructor() { this.__typename = ""; this.profile = fnProxy(Profile); this.allProfile = arrayProxy(Profile); this.post = fnProxy(Post); this.allPost = fnArrayProxy(Post); this.allPostTrending = fnArrayProxy(Post); this.version = ""; }
}
export class Profile {
    __typename: t.String;
    id: t.String;
    userId: t.String;
    bio: t.Nullable<t.String>;
    createdAt: t.Date;
    updatedAt: t.Date;
    posts: Post[];
    starredPosts: StarredPosts[];
    followers: Profile[];
    following: Profile[];
    activity: Activity[];
    views: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.id = ""; this.userId = ""; this.bio = null; this.createdAt = ""; this.updatedAt = ""; this.posts = arrayProxy(Post); this.starredPosts = arrayProxy(StarredPosts); this.followers = arrayProxy(Profile); this.following = arrayProxy(Profile); this.activity = arrayProxy(Activity); this.views = null; }
}
export class Post {
    __typename: t.String;
    id: t.String;
    title: t.String;
    avatarURL: t.Nullable<t.String>;
    summary: t.Nullable<t.String>;
    content: t.Nullable<t.String>;
    profileId: t.String;
    createdAt: t.Date;
    updatedAt: t.Date;
    privacy: t.Nullable<Privacy>;
    profile: t.Nullable<Profile>;
    stars: Stars[];
    views: t.NotSupportedYet;
    constructor() { this.__typename = ""; this.id = ""; this.title = ""; this.avatarURL = null; this.summary = null; this.content = null; this.profileId = ""; this.createdAt = ""; this.updatedAt = ""; this.privacy = null; this.profile = proxy(Profile); this.stars = arrayProxy(Stars); this.views = null; }
}
export class Stars {
    __typename: t.String;
    profile: Profile;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.profile = proxy(Profile); this.createdAt = ""; }
}
export class StarredPosts {
    __typename: t.String;
    post: Post;
    createdAt: t.Date;
    constructor() { this.__typename = ""; this.post = proxy(Post); this.createdAt = ""; }
}
export class Activity {
    __typename: t.String;
    createdAt: t.String;
    type: t.String;
    post: t.Nullable<Post>;
    follow: t.Nullable<Follow>;
    constructor() { this.__typename = ""; this.createdAt = ""; this.type = ""; this.post = proxy(Post); this.follow = proxy(Follow); }
}
export class Follow {
    __typename: t.String;
    createdAt: t.Date;
    followed: Profile;
    constructor() { this.__typename = ""; this.createdAt = ""; this.followed = proxy(Profile); }
}
export class Mutation {
    __typename: t.String;
    profileCreate: Profile;
    profileUpdate: (args: {
        values: ProfileUpdateDataInput;
    }) => Profile;
    profileDelete: t.Boolean;
    profileFollow: (args: {
        followProfileId: t.String;
    }) => ProfileFollow;
    profileUnfollow: (args: {
        followProfileId: t.String;
    }) => ProfileFollow;
    postCreate: (args: {
        values: PostDataInput;
    }) => Post;
    postUpdate: (args: {
        postId: t.String;
        values: PostUpdateDataInput;
    }) => Post;
    postDelete: (args: {
        postId: t.String;
    }) => t.NotSupportedYet;
    postStar: (args: {
        postId: t.String;
    }) => PostStar;
    postUnstar: (args: {
        postId: t.String;
    }) => PostStar;
    constructor() { this.__typename = ""; this.profileCreate = proxy(Profile); this.profileUpdate = fnProxy(Profile); this.profileDelete = false; this.profileFollow = fnProxy(ProfileFollow); this.profileUnfollow = fnProxy(ProfileFollow); this.postCreate = fnProxy(Post); this.postUpdate = fnProxy(Post); this.postDelete = () => null; this.postStar = fnProxy(PostStar); this.postUnstar = fnProxy(PostStar); }
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

