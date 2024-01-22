/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { PeoplePicker, PrincipalType} from '@pnp/spfx-controls-react/lib/PeoplePicker';
import {  IButtonStyles, IIconProps, IconButton, Label, Stack} from '@fluentui/react';
import styles from './ScwV2.module.scss';

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
isCalloutVisible?: () => void ;
getTargetId?: (event: any) => void ;
//onGetErrorMessage?:(value: []) => string | Promise<string> ;
values?: () => void;
  
}


export default class ReusablePeoplePicker extends React.Component <IReusablePeoplePickerProps> {

  

  public render(): React.ReactElement<IReusablePeoplePickerProps>{

    const iconStyles: IButtonStyles = {
      root: {
        paddingTop:'10px'
      }
    }

    const infoIcon: IIconProps = {iconName: 'UnknownSolid'};


    
    return (
    <>
    <div id={this.props.lineId}>
     <Stack horizontal verticalAlign='baseline'>
          <Label  style={{fontWeight:'700'}} >
            <span style={{color:'red'}}>*</span>
            {this.props.title}
            {this.props.currentPage === 2 && 
              ( <span>
                  <IconButton id={this.props.id} styles={ iconStyles } iconProps={infoIcon} onClick={this.props.getTargetId}/>
                </span>
              )
            }
          </Label>
      </Stack>
      <PeoplePicker
        errorMessageClassName={styles.ownerError}
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
    </div> 
    </>
    )
  }


}