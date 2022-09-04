import { useRouter } from "next/router";
import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
// import HouseNav from "src/components/houseNav";
import SingleMap from "src/components/singleMap";
import {
  ShowToiletQuery,
  ShowToiletQueryVariables,
} from "src/generated/ShowToiletQuery";


const SHOW_TOILET_QUERY = gql`
  query ShowToiletQuery($id: String!) {
    toilet(id: $id) {
      id
      userId
      address
      publicId
      latitude
      longitude
      rating
      handicap
      baby
      nearby {
        id
        latitude
        longitude
      }
    }
  }
`;
export default function ShowHouse() {
  const {query: {id}} = useRouter();

  if(!id) return null;
  return <ToiletData id ={id as string} />
}

function ToiletData({id}: {id: string}) {
  const {data, loading} = useQuery<ShowToiletQuery, ShowToiletQueryVariables>(SHOW_TOILET_QUERY, {
    variables: {id},
  });

  if(loading) return <Layout main={<div>Loading...</div>} />

  if(!data?.toilet) return <Layout main={<div>Toilet not found</div>} />

  const {toilet} = data;

  return (
    <Layout main ={
      <div className="sm:block md:flex">
        <div className="sm:w-full md-w-1/2 p-4">
          <h1 className="text-3xl my-2">{toilet.address}</h1>
          <Image
            classname="pb-2"
            cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
            publicId={toilet.publicId}
            alt={toilet.address}
            secure
            dpr="auto"
            quality="auto"
            width={900}
            height={Math.floor((9 / 16) * 900)}
            crop="fill"
            gravity="auto"
          />
          <div>
            <p className="text-2xl my-2">Rating: {toilet.rating}/5</p>
          </div>
          <div className="flex space-x-4">
            <p className="text-2xl mt-4 w-1/2">Handicap Accessible: {toilet.handicap ? "Yes" : "No"}</p>
            <p className="text-2xl mt-4 w-1/2">Baby Changing Station: {toilet.baby ? "Yes" : "No"}</p>
          </div>
        </div>
        <div className="sm:w-full md:w-1/2"><SingleMap toilet={toilet} nearby={toilet.nearby}/></div>
      </div>
      } 
    />
  );
}

