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
    else if ( targetId === 'engName' ) {
      message = `${ this.strings.engName_desc } <br/> ${ this.strings.engName_Instruction }`
    }
    else if ( targetId === 'FrCommName' ) {
      message = `${ this.strings.frCommName_desc } <br/> ${ this.strings.frCommName_Instruction}`
    }
    else if ( targetId === 'shEngDesc' ) {
      message = `${ this.strings.shEngDesc_desc } <br/> ${ this.strings.shEngDesc_Instruction}` 
    }
    else if ( targetId === 'shFrDesc' ) {
      message = `${ this.strings.shFrDesc_desc } <br/> ${ this.strings.shFrDesc_Instruction}`
    }
    // else if ( targetId === 'classification' ) {
    //   message = `${ this.strings.community_classification_desc } <br/><br/> ${this.strings.community_classification_link}`
    // }
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
    else if ( targetId === 'engName' ) {
      title = `${ this.strings.engName_title }`
    }
    else if ( targetId === 'FrCommName' ) {
      title = `${ this.strings.frCommName_title }`
    }
    else if ( targetId === 'shEngDesc' ) {
      title = `${ this.strings.shEngDesc_title }`
    }
    else if ( targetId === 'shFrDesc' ) {
      title = `${ this.strings.shFrDesc_title }`
    }
    // else if ( targetId === 'classification' ) {
    //   title = ` ${ this.strings.community_classification}`
    // }
    else if ( targetId === 'owners' ) {
      title = `${this.strings.owners}`
    }
    // else if ( targetId === 'members' ) {
    //   title = `${this.strings.members}`
    // }

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
                <Text>{ this.getTitles() }</Text>
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