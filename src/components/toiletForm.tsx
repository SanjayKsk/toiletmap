import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
// import { useRouter } from "next/router";
import Link from "next/link";
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
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation{
    createImageSignature {
        signature
        timestamp
        }
    }
`;

interface UploadImageResponse {
    secure_url: string;
}

async function uploadImage(image: File, signature: string, timestamp: number): Promise<UploadImageResponse> {
    const url =  `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    const formData = new FormData();
    formData.append("file", image);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

    const response = await fetch(url, {
        method: "post",
        body: formData,
    });

    return response.json();
}

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
    const [previewImage, setPreviewImage] = useState<string>();
    const {register, handleSubmit, setValue, errors, watch} = useForm<IFormData>({ defaultValues: {}});

    const address = watch("address");
    const [createSignature] = useMutation<CreateSignatureMutation>(SIGNATURE_MUTATION)


    useEffect(() => {
        register({name: "address"}, {required: "Please enter an address"});
        register({name: "latitude"}, {required: true, min: -90, max: 90});
        register({name: "longitude"}, {required: true, min: -180, max: 180});
        register({name: "rating"}, {required: true, min: 0, max: 5});
    }, [register])

    const handleCreate = async(data: IFormData) => {
        //console.log({data});
        const {data: signatureData} = await createSignature();
        if (signatureData){
            const {signature, timestamp} = signatureData.createImageSignature;
            const imageData = await uploadImage(data.image[0], signature, timestamp);
            const imageUrl = imageData.secure_url;
        }
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

        <div className="mt-4">
            <label htmlFor="image" className="p-4 border-dashed border-4 border-gray-300 block cursor-pointer">
                Click to add image 16:9
            </label>
            <input 
                id="image" 
                name="image" 
                type="file" 
                // Prevent users from selecting other types of files
                accept="image/*" 
                style={{ display: "none"}}
                ref={register({
                    validate: (fileList: FileList) => {
                        if(fileList.length === 1) return true;
                        return "Please select an image";
                    }
                })}

                // Function to preview the image below the input box
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event?.target?.files?.[0]) {
                        const file = event.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            setPreviewImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                    }
                }}
            />
            {previewImage && (
                <img 
                src={previewImage} 
                className="mt-4 object-cover" 
                style={{ width: "576px", height: `${(9/16) * 576}px`}}
                />
            )}
            {errors.image && <p>{errors.image.message}</p>}
        </div>
        <div className="mt-4">
            <label htmlFor="rating" className="block">Rating</label>
            <input 
                id="rating" 
                name="rating" 
                type="number" 
                min ="0"
                max="5"
                step={0.5}
                className="p-2" 
                ref={register({
                    required: "Please enter a rating",
                    min: {value: 0, message: "Rating must be between 0 and 5"},
                    max: {value: 5, message: "Rating must be between 0 and 5"},
                    }
                )} />
                {errors.rating && <p>{errors.rating.message}</p>}
        </div>
        <div className="flex space-x-4">
            <div className="mt-4 w-1/2">
                <label htmlFor="handicapped" className="block">Handicapped Accessible?</label>
                <input id="handicapped" name="handicapped" type="checkbox" className="p-2" ref={register} />
            </div>

            <div className="mt-4 w-1/2">
                <label htmlFor="familyRoom" className="block">Baby changing facilities available?</label>
                <input id="familyRoom" name="familyRoom" type="checkbox" className="p-2" ref={register} />
            </div>
        </div>

        <div className="mt-14">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" disabled={submitting}>
                Add Toilet
            </button>{" "}

            <Link href="/">
                Cancel
            </Link>
        </div>
    </form>
    );
}
