/* eslint-disable @typescript-eslint/no-explicit-any */
import { IButtonStyles, IIconProps, IconButton, Label, Stack, TextField} from '@fluentui/react';
import * as React from 'react';

interface IReusableTextFieldsProps {
  id: string;
  lineId: string;
  name: string;
  title: string;
  label: string;
  instructions?: string;
  description: string;
  multiline: boolean;
  defaultValue: string;
  validateOnLoad: boolean;
  maxLength: number;
  rows: number;
  currentPage?: number;
  onChange?: (event:React.FormEvent<HTMLInputElement | HTMLTextAreaElement> , value: string) => void;
  onGetErrorMessage?:(value:string) => string |JSX.Element |undefined;
  handleSideLineErrorValidation?:(eventName: string, value: string) => void;
  showCalloutVisible?:(event: any ) => void ;
  
}


export default class ReusableTextFields extends React.Component<IReusableTextFieldsProps> {

  

  public render(): React.ReactElement<IReusableTextFieldsProps> {

    const charCountStyles = {

      characterLimitStyle: {
        description: {
          float: "right",
          marginTop: "5px",
          fontSize: "12px",
        },
        errorMessage: {
          color: '#C61515'
        }
      },
    };

    const infoIcon: IIconProps = { iconName: 'UnknownSolid' }; 

    const iconStyles: IButtonStyles = {
        root: {
            paddingTop: '10px',
        }
    }

   
    
    return (
    <>
      <div id={this.props.lineId}>
        <Stack>
          <Label>
            <span style={{color:'red'}}>*</span>
            {this.props.title}
          </Label>
          {this.props.currentPage === 2 && 
            (<span><IconButton id={this.props.id} styles={ iconStyles } iconProps={infoIcon} onClick={this.props.showCalloutVisible}/></span>)
          }
        </Stack>
        <TextField {...this.props} styles={charCountStyles.characterLimitStyle}
        />
      </div>
    </>
    )
  }


}