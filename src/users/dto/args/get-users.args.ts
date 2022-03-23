import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetUsersArgs {
  @Field((type) => [Int])
  id: number[];
}
