import { Exclude, Expose, Transform } from "class-transformer";
import { ItemCategory, ItemStatus, ItemType } from "../items-enums";
import { Provider } from "@nestjs/common";

export class ItemViewDto {
    @Expose()
    category: ItemCategory;

    @Expose()
    status: ItemStatus;

    @Expose()
    type: ItemType;

    @Exclude()
    creationDate: Date;

    @Exclude()
    userCreationName: string;

    @Exclude()
    userCreationId: string;

    @Expose()
    title: string;

    @Expose()
    description?: string;

    @Expose()
    price: number;

    @Expose()
    measures?: string;

    @Expose()
    imageUrl?: string;

    @Exclude()
    userUpdateName?: string;

    @Exclude()
    userUpdateId?: string;

    @Exclude()
    updateDate?: Date;

    @Expose()
    @Transform(({ value }) => value.name)
    createdProvider: Provider;
}