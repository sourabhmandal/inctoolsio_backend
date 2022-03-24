import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetUserByEmailArgs {
  @Field()
  email: string;
}

@ArgsType()
export class GetUserByIdArgs {
  @Field()
  email: string;
}
