/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { SelectLanguage } from './SelectLanguage';
import { DirectionalHint, FocusTrapCallout, FocusZone, IconButton, PrimaryButton, Stack, mergeStyleSets } from '@fluentui/react';
import styles from './ScwV2.module.scss';
import { Text } from '@fluentui/react/lib/Text';

interface ICalloutProps {

  showCallout: boolean;
  prefLang: string;
  targetId: string;
  openCallout?: ()=> void;


}


export default class Callouts extends React.Component<ICalloutProps> {

  public strings = SelectLanguage( this.props.prefLang);

  private messageText = () : string => {
    const { targetId } = this.props;

    console.log("TARGET_ID", targetId);

    let message: any = '';

    if ( targetId === 'commPurpose' ) {
      message = `${ this.strings.commPurpose_desc } <br/> ${ this.strings.commPurpose_Instruction}`
    }
    else if ( targetId === 'engCommName' ) {
      message = `${ this.strings.engName_desc } <br/> ${ this.strings.engName_Instruction }`
    }
    else if ( targetId === 'frCommName' ) {
      message = `${ this.strings.frCommName_desc } <br/> ${ this.strings.frCommName_Instruction}`
    }
    else if ( targetId === 'engDesc' ) {
      message = `${ this.strings.shEngDesc_desc } <br/> ${ this.strings.shEngDesc_Instruction}` 
    }
    else if ( targetId === 'frDesc' ) {
      message = `${ this.strings.shFrDesc_desc } <br/> ${ this.strings.shFrDesc_Instruction}`
    }
    else if ( targetId === 'owners' ) {
      message = `${this.strings.owners_instruction_Callout}`
    }

    return message
  }

  private getTitles = () : string => {
    const { targetId } = this.props;

    let title:string = '';


    if ( targetId === 'commPurpose' )  {
      title = `${ this.strings.commPurpose_title }`
    }
    else if ( targetId === 'engCommName' ) {
      title = `${ this.strings.engName_title }`
    }
    else if ( targetId === 'frCommName' ) {
      title = `${ this.strings.frCommName_title }`
    }
    else if ( targetId === 'engDesc' ) {
      title = `${ this.strings.shEngDesc_title }`
    }
    else if ( targetId === 'frDesc' ) {
      title = `${ this.strings.shFrDesc_title }`
    }
    else if ( targetId === 'owners' ) {
      title = `${this.strings.owners}`
    }

    return title
  }

  

  public render(): React.ReactElement<ICalloutProps>{

    
    const message = this.messageText();
   
  
  const calloutStyle = {
    root: {
      width: '40%',
      height: 'auto',
      borderRadius: '15px',
      boxShadow: 'rgb(0 0 0 / 58%) 0px 8px 16px'
    },
    beak: {
      top: '20px!important',
      backgroundColor:  "#106EBE"
    },
    calloutMain: {
      borderRadius: '15px',
    },
    beakCurtain: {
      borderRadius: '15px',
    }
  }

  const stylesCallout = mergeStyleSets({

    heading: {
      height: '50px',
     
    },
    body: {
      height: 'auto',
      padding: '10px',
    },
    title: {
      fontSize: '16px',
      padding: '10px',
      color: 'white',
      marginBottom: 12,
      fontWeight: 'normal',
      backgroundColor:  "#106EBE",

    },

    buttons: {
      width:'98%',
      padding:'10px',
      display: 'flex',
      justifyContent: 'flex-end',
    },
  });


    return (
      <>
        
          <FocusTrapCallout
            role="dialog"
            target={ `#${ this.props.targetId}` }
            isBeakVisible={ true }
            beakWidth={ 16 }
            styles={ calloutStyle }
            directionalHint={ DirectionalHint.rightTopEdge }
            gapSpace={ 10 }
            setInitialFocus = {true}
            onDismiss = { this.props.openCallout} 
          >

            <div className={stylesCallout.heading}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={ stylesCallout.title }>
                <Text style={{color: 'white'}}>{ this.getTitles() }</Text>
                <IconButton
                  aria-Label=  { this.strings.close }
                  className={ styles.cancelIcon }
                  iconProps={{ iconName: "Cancel" }}
                  onClick={ this.props.openCallout }
                />
              </Stack>
            </div>
            <div className={stylesCallout.body}>
              <Text>{ message }</Text>
              <FocusZone>
                <div className={ stylesCallout.buttons } >
                    <PrimaryButton onClick={this.props.openCallout} > {this.strings.close} </PrimaryButton>
                </div>
              </FocusZone>
            </div>
            
           

          </FocusTrapCallout>
      </>
    );
  }


}