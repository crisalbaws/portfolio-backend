import { Profile } from "../../profiles/profile.entity";
import { Exclude, Expose, Transform } from "class-transformer";

export class UserDetailDto {
    @Exclude()
    firstName: string;

    @Exclude()
    lastName?: string;

    @Exclude()
    secondLastName?: string;

    @Expose()
    completeName?: string;

    @Expose()
    status: string;

    @Expose()
    @Transform(({ value }) => ({
        name: value.name,
        id: value.id,
        description: value.description,
        permissions: value.permissions,
        status: value.status,
    }))
    userProfile?: Profile;

    // @Expose()
    // phoneNumber: string;

    @Expose()
    email: string;

    @Exclude()
    password: string;

    @Exclude()
    profileId: number;

    @Exclude()
    createDate: Date;

    @Exclude()
    updateDate: Date;
}