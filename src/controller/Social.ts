import { withContext } from "@snek-at/function";
import {
  FiltersInput,
  FiltersInput_1,
  Mutation,
  PostDataInput,
  PostUpdateDataInput,
  Profile,
  Query,
} from "../clients/social/src/schema.generated";
import { forward } from "../utils/snek-function-forwarder";

const endpoint = {
  development: "https://services.snek.at/social/graphql",
  production: "http://social:3000/graphql",
};

export class SocialController {
  static socialProfile = withContext(
    (context) => async (profileId?: string) => {
      const res = await forward<ReturnType<Query["profile"]>>({
        context,
        endpoint,
        name: "profile",
        fieldPath: "socialProfile",
      });

      return res;
    }
  );

  static allSocialProfile = withContext((context) => async () => {
    const res = await forward<Query["allProfile"]>({
      context,
      endpoint,
      name: "allProfile",
      fieldPath: "allSocialProfile",
    });

    return res;
  });

  static socialPost = withContext((context) => async (postId: string) => {
    const res = await forward<ReturnType<Query["post"]>>({
      context,
      endpoint,
      name: "post",
      fieldPath: "socialPost",
    });

    return res;
  });

  static allSocialPost = withContext(
    (context) => async (filters?: FiltersInput) => {
      const res = await forward<ReturnType<Query["allPost"]>>({
        context,
        endpoint,
        name: "allPost",
        fieldPath: "allSocialPost",
      });

      return res;
    }
  );

  static allSocialPostTrending = withContext(
    (context) => async (filters?: FiltersInput_1) => {
      const res = await forward<ReturnType<Query["allPostTrending"]>>({
        context,
        endpoint,
        name: "allPostTrending",
        fieldPath: "allSocialPostTrending",
      });

      return res;
    }
  );

  static socialProfileCreate = withContext((context) => async () => {
    const res = await forward<Mutation["profileCreate"]>({
      context,
      endpoint,
      name: "profileCreate",
      fieldPath: "socialProfileCreate",
    });

    return res;
  });

  static socialProfileUpdate = withContext(
    (context) => async (data: Profile) => {
      const res = await forward<ReturnType<Mutation["profileUpdate"]>>({
        context,
        endpoint,
        name: "profileUpdate",
        fieldPath: "socialProfileUpdate",
      });

      return res;
    }
  );

  static socialProfileDelete = withContext((context) => async () => {
    const res = await forward<Mutation["profileDelete"]>({
      context,
      endpoint,
      name: "profileDelete",
      fieldPath: "socialProfileDelete",
    });

    return res;
  });

  static socialProfileFollow = withContext(
    (context) => async (followProfileId: string) => {
      const res = await forward<ReturnType<Mutation["profileFollow"]>>({
        context,
        endpoint,
        name: "profileFollow",
        fieldPath: "socialProfileFollow",
      });

      return res;
    }
  );

  static socialProfileUnfollow = withContext(
    (context) => async (followProfileId: string) => {
      const res = await forward<ReturnType<Mutation["profileUnfollow"]>>({
        context,
        endpoint,
        name: "profileUnfollow",
        fieldPath: "socialProfileUnfollow",
      });

      return res;
    }
  );

  static socialPostCreate = withContext(
    (context) => async (values: PostDataInput) => {
      const res = await forward<ReturnType<Mutation["postCreate"]>>({
        context,
        endpoint,
        name: "postCreate",
        fieldPath: "socialPostCreate",
      });

      return res;
    }
  );

  static socialPostUpdate = withContext(
    (context) => async (postId: string, values: PostUpdateDataInput) => {
      const res = await forward<ReturnType<Mutation["postUpdate"]>>({
        context,
        endpoint,
        name: "postUpdate",
        fieldPath: "socialPostUpdate",
      });

      return res;
    }
  );

  static socialPostDelete = withContext((context) => async (postId: string) => {
    const res = await forward<ReturnType<Mutation["postDelete"]>>({
      context,
      endpoint,
      name: "postDelete",
      fieldPath: "socialPostDelete",
    });

    return res;
  });

  static socialPostStar = withContext((context) => async (postId: string) => {
    const res = await forward<ReturnType<Mutation["postStar"]>>({
      context,
      endpoint,
      name: "postStar",
      fieldPath: "socialPostStar",
    });

    return res;
  });

  static socialPostUnstar = withContext((context) => async (postId: string) => {
    const res = await forward<ReturnType<Mutation["postUnstar"]>>({
      context,
      endpoint,
      name: "postUnstar",
      fieldPath: "socialPostUnstar",
    });

    return res;
  });
}
