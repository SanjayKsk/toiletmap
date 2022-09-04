/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: ToiletsQuery
// ====================================================

export interface ToiletsQuery_toilets {
  __typename: "Toilet";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  rating: number;
  handicap: boolean;
  baby: boolean;
}

export interface ToiletsQuery {
  toilets: ToiletsQuery_toilets[];
}

export interface ToiletsQueryVariables {
  bounds: BoundsInput;
}
