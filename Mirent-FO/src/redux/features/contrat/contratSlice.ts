import { Contract } from "../../../types/contrat";
import { ContractActionTypes, FETCH_CONTRACTS_FAILURE, FETCH_CONTRACTS_REQUEST, FETCH_CONTRACTS_SUCCESS } from "./contraAction";

  
interface ContractState {
    contracts: Contract[];
    loading: boolean;
    error: string | null;
}
  
const initialState: ContractState = {
    contracts: [],
    loading: false,
    error: null,
};
  
const contractReducer = (
    state = initialState,
    action: ContractActionTypes
  ): ContractState => {
    switch (action.type) {
      case FETCH_CONTRACTS_REQUEST:
        return { ...state, loading: true };
      case FETCH_CONTRACTS_SUCCESS:
        return { ...state, loading: false, contracts: action.payload };
      case FETCH_CONTRACTS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
};
  
export default contractReducer;