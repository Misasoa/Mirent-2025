import { Contract } from "../../../types/contrat";

export const FETCH_CONTRACTS_REQUEST = 'FETCH_CONTRACTS_REQUEST';
export const FETCH_CONTRACTS_SUCCESS = 'FETCH_CONTRACTS_SUCCESS';
export const FETCH_CONTRACTS_FAILURE = 'FETCH_CONTRACTS_FAILURE';

export interface FetchContractsRequestAction {
    type: typeof FETCH_CONTRACTS_REQUEST;
}

export interface FetchContractsSuccessAction {
    type: typeof FETCH_CONTRACTS_SUCCESS;
    payload: Contract[];
}
  
export interface FetchContractsFailureAction {
    type: typeof FETCH_CONTRACTS_FAILURE;
    payload: string;
}

export type ContractActionTypes = 
    | FetchContractsRequestAction
    | FetchContractsSuccessAction
    | FetchContractsFailureAction

export const fetchContractsRequest = (): FetchContractsRequestAction => ({
    type: FETCH_CONTRACTS_REQUEST,
});

export const fetchContractsSuccess = (
    contracts: Contract[]
  ): FetchContractsSuccessAction => ({
    type: FETCH_CONTRACTS_SUCCESS,
    payload: contracts,
  });

export const fetchContractsFailure = (
    error: string
    ): FetchContractsFailureAction => ({
    type: FETCH_CONTRACTS_FAILURE,
    payload: error,
});

export const fetchContracts = () => {
    return async (dispatch: any) => {
      dispatch(fetchContractsRequest());
      try {
        // Simuler une requête API
        const response = await fetch('/api/contracts');
        const data = await response.json();
        dispatch(fetchContractsSuccess(data));
      } catch (error) {
        dispatch(fetchContractsFailure('Erreur lors du chargement des contrats.'));
      }
    };
};