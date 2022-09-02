import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
// import { useMutation, gql } from "@apollo/client";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
// import {
//   CreateHouseMutation,
//   CreateHouseMutationVariables,
// } from "src/generated/CreateHouseMutation";
// import {
//   UpdateHouseMutation,
//   UpdateHouseMutationVariables,
// } from "src/generated/UpdateHouseMutation";
// import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

interface IFormData {
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    handicapped: boolean;
    familyRoom: boolean;
    image: FileList;
}

interface IProps {}

export default function ToiletForm({}: IProps){
    const [submitting, setSubmitting] = useState(false);
    const {register, handleSubmit, setValue, errors, watch} = useForm<IFormData>({ defaultValues: {}});

    const address = watch("address");

    useEffect(() => {
        register({name: "address"}, {required: "Please enter an address"});
        register({name: "latitude"}, {required: true, min: -90, max: 90});
        register({name: "longitude"}, {required: true, min: -180, max: 180});
        register({name: "rating"}, {required: true, min: 0, max: 5});
    }, [register])

    const handleCreate = async(data: IFormData) => {

    };

    const onSubmit = (data: IFormData) => {
        setSubmitting(true);
        handleCreate(data);
    };

    return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text=xl">Add a New Toilet</h1>

        <div className="mt-4">
            <label htmlFor="search" className="block"> Search locations</label>
            <SearchBox onSelectAddress={(address, latitude, longitude) => {
                setValue("address", address);
                setValue("latitude", latitude);
                setValue("longitude", longitude);
            }}
            defaultValue=""/>
        </div>
    </form>
    );
}
