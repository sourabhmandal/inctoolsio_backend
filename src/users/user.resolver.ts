import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { GetUserArgs } from './dto/args/get-user.args';
import { CreateUserInput } from './dto/input/create-user.input';
import { Users } from './user.model';
import { UsersService } from './users.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UsersService) {}

  @Query(() => Users, { name: 'getUserByEmail', nullable: true })
  getUserByEmail(@Args() getUserArgs: GetUserArgs): Promise<Users> {
    return this.userService.getUserByEmail(getUserArgs);
  }

  @Query(() => [Users], { name: 'getAllUsers', nullable: 'items' })
  getAllUsers(): Promise<Users[]> {
    return this.userService.getAllUsers();
  }
  @Mutation(() => Users, { name: 'createUser', nullable: true })
  createUser(
    @Args('createUserInput') createUser: CreateUserInput,
  ): Promise<Users> {
    return this.userService.createUser(createUser);
  }
}
