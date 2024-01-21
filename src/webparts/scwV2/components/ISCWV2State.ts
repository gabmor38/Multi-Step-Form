export interface ISCWState {
  currentPage:  number;
  commPurpose: string;
  engCommName: string;
  frCommName: string;
  engDesc: string;
  frDesc: string;
  ownerList: string[];
  showModal: boolean;
  invalidEmail: string;
  requestingUser: string;
  isLoading: boolean;
  validationStatus: number,
  showCallout: boolean;
  targetId: string;

}