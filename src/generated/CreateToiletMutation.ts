/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ToiletInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateToiletMutation
// ====================================================

export interface CreateToiletMutation_createToilet {
  __typename: "Toilet";
  id: string;
}

export interface CreateToiletMutation {
  createToilet: CreateToiletMutation_createToilet | null;
}

export interface CreateToiletMutationVariables {
  input: ToiletInput;
}
