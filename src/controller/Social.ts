import { withContext } from "@snek-at/function";
import {
  FiltersInput,
  FiltersInput_1,
  Mutation,
  PostDataInput,
  PostUpdateDataInput,
  Profile,
  ProfileUpdateDataInput,
  Query,
} from "../clients/social/src/schema.generated";
import { sfProxy } from "../utils/snek-function-proxy";

const endpoint = {
  development: "https://services.snek.at/social/graphql",
  production: "http://social:3000/graphql",
};

export class SocialController {
  static endpoint = endpoint;

  static socialPost = withContext(
    (context) => async (postId?: string, slug?: string) => {
      const res = await sfProxy<ReturnType<Query["post"]>>({
        context,
        endpoint,
        splitter: {
          path: "socialPost",
          remoteFieldName: "post",
          operationName: "Post",
        },
      });

      return res;
    }
  );

  static allSocialPost = withContext(
    (context) =>
      async (
        after?: string,
        before?: string,
        first?: number,
        last?: number,
        filters?: FiltersInput
      ) => {
        const res = await sfProxy<ReturnType<Query["allPost"]>>({
          context,
          endpoint,
          splitter: {
            path: "allSocialPost",
            remoteFieldName: "allPost",
            operationName: "AllPost",
          },
        });

        return res;
      }
  );

  static allSocialPostTrending = withContext(
    (context) =>
      async (
        after?: string,
        before?: string,
        first?: number,
        last?: number,
        filters?: FiltersInput_1
      ) => {
        const res = await sfProxy<ReturnType<Query["allPostTrending"]>>({
          context,
          endpoint,
          splitter: {
            path: "allSocialPostTrending",
            remoteFieldName: "allPostTrending",
            operationName: "AllPostTrending",
          },
        });

        return res;
      }
  );

  static socialProfileCreate = withContext((context) => async () => {
    const res = await sfProxy<Mutation["profileCreate"]>({
      context,
      endpoint,
      splitter: {
        path: "socialProfileCreate",
        remoteFieldName: "profileCreate",
        operationName: "ProfileCreate",
      },
    });

    return res;
  });

  static socialProfileUpdate = withContext(
    (context) => async (values: ProfileUpdateDataInput) => {
      const res = await sfProxy<ReturnType<Mutation["profileUpdate"]>>({
        context,
        endpoint,
        splitter: {
          path: "socialProfileUpdate",
          remoteFieldName: "profileUpdate",
          operationName: "ProfileUpdate",
        },
      });

      return res;
    }
  );

  static socialProfileDelete = withContext((context) => async () => {
    const res = await sfProxy<Mutation["profileDelete"]>({
      context,
      endpoint,
      splitter: {
        path: "socialProfileDelete",
        remoteFieldName: "profileDelete",
        operationName: "ProfileDelete",
      },
    });

    return res;
  });

  static socialProfileFollow = withContext(
    (context) => async (userId: string) => {
      const res = await sfProxy<ReturnType<Mutation["profileFollow"]>>({
        context,
        endpoint,
        splitter: {
          path: "socialProfileFollow",
          remoteFieldName: "profileFollow",
          operationName: "ProfileFollow",
        },
      });

      return res;
    }
  );

  static socialProfileUnfollow = withContext(
    (context) => async (userId: string) => {
      const res = await sfProxy<ReturnType<Mutation["profileUnfollow"]>>({
        context,
        endpoint,
        splitter: {
          path: "socialProfileUnfollow",
          remoteFieldName: "profileUnfollow",
          operationName: "ProfileUnfollow",
        },
      });

      return res;
    }
  );

  static socialPostCreate = withContext(
    (context) => async (values: PostDataInput) => {
      const res = await sfProxy<ReturnType<Mutation["postCreate"]>>({
        context,
        endpoint,
        splitter: {
          path: "socialPostCreate",
          remoteFieldName: "postCreate",
          operationName: "PostCreate",
        },
      });

      return res;
    }
  );

  static socialPostUpdate = withContext(
    (context) => async (postId: string, values: PostUpdateDataInput) => {
      const res = await sfProxy<ReturnType<Mutation["postUpdate"]>>({
        context,
        endpoint,
        splitter: {
          path: "socialPostUpdate",
          remoteFieldName: "postUpdate",
          operationName: "PostUpdate",
        },
      });

      return res;
    }
  );

  static socialPostDelete = withContext((context) => async (postId: string) => {
    const res = await sfProxy<ReturnType<Mutation["postDelete"]>>({
      context,
      endpoint,
      splitter: {
        path: "socialPostDelete",
        remoteFieldName: "postDelete",
        operationName: "PostDelete",
      },
    });

    return res;
  });

  static socialPostStar = withContext((context) => async (postId: string) => {
    const res = await sfProxy<ReturnType<Mutation["postStar"]>>({
      context,
      endpoint,
      splitter: {
        path: "socialPostStar",
        remoteFieldName: "postStar",
        operationName: "PostStar",
      },
    });

    return res;
  });

  static socialPostUnstar = withContext((context) => async (postId: string) => {
    const res = await sfProxy<ReturnType<Mutation["postUnstar"]>>({
      context,
      endpoint,
      splitter: {
        path: "socialPostUnstar",
        remoteFieldName: "postUnstar",
        operationName: "PostUnstar",
      },
    });

    return res;
  });
}
