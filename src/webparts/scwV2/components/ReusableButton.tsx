/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrimaryButton } from '@fluentui/react';
import * as React from 'react';

interface IReusableButtonProps {
text: string;
onClick?: () => void;
}


export default class ReusableButton extends React.Component<IReusableButtonProps> {

  

  public render(): React.ReactElement<IReusableButtonProps>{

    
    return (
    <>
      <PrimaryButton text={this.props.text} onClick={this.props.onClick}/>
    </>
    )
  }


}