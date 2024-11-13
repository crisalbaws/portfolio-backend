import { Exclude, Expose, Transform } from "class-transformer";
import { Profile } from "../../profiles/profile.entity";

export class UsersListViewDto {
    @Exclude()
    firstName: string;

    @Exclude()
    lastName: string;

    @Exclude()
    secondLastName: string;

    @Expose()
    completeName: string;

    @Exclude()
    status: string;

    // @Expose()
    // phoneNumber: string;

    @Expose()
    email: string;

    @Exclude()
    password: string;

    @Expose()
    @Transform(({ value }) => value.name)
    userProfile: Profile;

    @Exclude()
    createDate: Date;

    @Exclude()
    updateDate: Date;
}
