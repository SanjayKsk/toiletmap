import Link from "next/link";
import { Image } from "cloudinary-react";
import { ToiletsQuery_toilets } from "src/generated/ToiletsQuery";

interface IProps {
    toilets: ToiletsQuery_toilets[];
    setHighlightedId: (id: string | null) => void;
}

export default function ToiletList({toilets, setHighlightedId}: IProps) {
    return (
        <>
        {
            toilets.map(toilet => <Link key={toilet.id} href={`/toilets/${toilet.id}`}>
                <div className="px-6 pt-4 cursor-pointer flex flex-wrap" onMouseEnter={() =>  setHighlightedId(toilet.id)} onMouseLeave={() => setHighlightedId(null)}>
                    <div className="sm:w:full md:w-1/2">
                        <Image 
                            cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                            publicId={toilet.publicId}
                            alt={toilet.address}
                            secure
                            dpr="auto"
                            quality="auto"
                            width={350}
                            height={Math.floor((9/16)*350)}
                            crop="fill"
                            gravity="auto"
                            />
                    </div>
                    <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
                        <h2 className="text-lg">{toilet.address}</h2>
                        <p>Rating: {toilet.rating}/5</p>
                        <p>Handicap accessible: {toilet.handicap ? "Yes" : "No"}</p>
                        <p>Baby changing facilities: {toilet.baby ? "Yes" : "No"}</p>
                    </div>
                </div>
            </Link>)
        }
        </>
    )
}
