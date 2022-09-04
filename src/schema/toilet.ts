import {
    ObjectType,
    InputType,
    Field,
    ID,
    Float,
    Int,
    Resolver,
    Query,
    Mutation,
    Arg,
    Ctx,
    Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import type { Context, AuthorizedContext } from "./context";

@InputType()
class CoordinatesInput {
    @Min(-90)
    @Max(90)
    @Field(_type => Float)
    latitude!: number;

    @Min(-180)
    @Max(180)
    @Field(_type => Float)
    longitude!: number;
}

@InputType()
class ToiletInput {
    @Field((_type) => String)
    address!: string;

    @Field((_type) => String)
    image!: string;

    @Field((_type) => CoordinatesInput)
    coordinates!: CoordinatesInput;

    @Field((_type) => Float)
    rating!: number;

    @Field((_type) => Boolean)
    handicap!: boolean;

    @Field((_type) => Boolean)
    baby!: boolean;
}

@ObjectType()
class Toilet {
    @Field((_type) => ID)
    id!: string;

    @Field((_type) => String)
    userId!: string;

    @Field((_type) => String)
    address!: string;

    @Field((_type) => String)
    image!: string;

    @Field((_type) => Float)
    latitude!: number;

    @Field((_type) => Float)
    longitude!: number;

    @Field((_type) => Float)
    rating!: number;

    @Field((_type) => String)
    publicId(): string {
        const parts = this.image.split("/");
        return parts[parts.length - 1];
    }

    @Field((_type) => Boolean)
    handicap!: boolean;

    @Field((_type) => Boolean)
    baby!: boolean;
}

@Resolver()
export class ToiletResolver {

    @Query((_returns) => Toilet, { nullable: true })
    async toilet(@Arg("id") id: string, @Ctx() ctx: Context) {
        return await ctx.prisma.toilet.findOne({ where: { id: parseInt(id, 10) } });
    }

    @Authorized()
    @Mutation((_returns) => Toilet, { nullable: true })
    async createToilet(
        @Arg("input") input: ToiletInput,
        @Ctx() ctx: AuthorizedContext) {
        return await ctx.prisma.toilet.create({
            data: {
                userId: ctx.uid,
                image: input.image,
                latitude: input.coordinates.latitude,
                longitude: input.coordinates.longitude,
                address: input.address,
                rating: input.rating,
                handicap: input.handicap,
                baby: input.baby,
            }
        })
    }
}