/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { PeoplePicker, PrincipalType} from '@pnp/spfx-controls-react/lib/PeoplePicker';

interface IReusablePeoplePickerProps {
id: string;
context: any;
ownerList: string[];
lineId: string;
instructions: string;
title: string;
currentPage?: number;
prefLang?: string;
requestor?: string;
invalidEmail?: string;
defaultSelectedUsers: string[];
onChangeGetOwners?:(values: []) => void;
  
}


export default class ReusablePeoplePicker extends React.Component <IReusablePeoplePickerProps> {

  

  public render(): React.ReactElement<IReusablePeoplePickerProps>{

    
    return (
    <>
      <PeoplePicker
        context={this.props.context}
        required={true}
        personSelectionLimit={99}
        groupName=''
        principalTypes={[ PrincipalType.User]}
        resolveDelay={1000}
        defaultSelectedUsers={this.props.ownerList}
        ensureUser={true}
        allowUnvalidated={true}
        onChange={this.props.onChangeGetOwners}

      
      />
     
    </>
    )
  }


}