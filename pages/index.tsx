import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import ToiletList from "src/components/toiletList";
import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
import { ToiletsQuery, ToiletsQueryVariables } from "src/generated/ToiletsQuery";

const TOILETS_QUERY = gql`
  query ToiletsQuery($bounds: BoundsInput!) {
    toilets(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      rating
      handicap
      baby
    }
  }
`;

type BoundsArray = [[number, number],[number, number]]

const parseBounds = (boundsString: string) => {
    const bounds = JSON.parse(boundsString) as BoundsArray;
    return {
      sw: {
        latitude: bounds[0][1],
        longitude: bounds[0][0],
      },
      ne: {
        latitude: bounds[1][1],
        longitude: bounds[1][0],
      },
    };
};

export default function Home() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );
  const [debouncedDataBounds] = useDebounce(dataBounds, 200);
  const { data, error } = useQuery<ToiletsQuery, ToiletsQueryVariables>(
    TOILETS_QUERY,
    {
      variables: { bounds: parseBounds(debouncedDataBounds) },
    }
  );
  const lastData = useLastData(data);

  if (error) return <Layout main={<div>Error loading houses</div>} />;

  return (
    <Layout 
      main={
        <div className="flex">
          <div 
            className="w-1/2 pb-4" 
            style={{maxHeight: "calc(100vh - 64px)"}}
            >
              <ToiletList 
                toilets={lastData ? lastData.toilets : []}
                setHighlightedId={setHighlightedId}
              />
          </div>
          <div className="w-1/2">
            <Map 
              setDataBounds={setDataBounds} 
              toilets={lastData ? lastData.toilets : []}
              highlightedId={highlightedId}
            />
          </div>
        </div>
      } 
    />
  );
}
