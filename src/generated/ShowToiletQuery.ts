/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowToiletQuery
// ====================================================

export interface ShowToiletQuery_toilet_nearby {
  __typename: "Toilet";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowToiletQuery_toilet {
  __typename: "Toilet";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  latitude: number;
  longitude: number;
  rating: number;
  handicap: boolean;
  baby: boolean;
  nearby: ShowToiletQuery_toilet_nearby[];
}

export interface ShowToiletQuery {
  toilet: ShowToiletQuery_toilet | null;
}

export interface ShowToiletQueryVariables {
  id: string;
}
