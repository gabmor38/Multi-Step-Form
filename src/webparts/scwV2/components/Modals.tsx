/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { SelectLanguage } from './SelectLanguage';


interface IModalsProps {
  engName: string;
  frCommName: string;
  commPurpose: string;
  shEngDesc: string;
  shFrDesc: string;
  invalidUser?: string;
  requestor?: string;
  ownerList: string[];

  showModal: boolean;
  currentPage: number;
  prefLang: string;
  
  openModal?: () => void;
  onClose?: () => void;
}



export default class Modals extends React.Component<IModalsProps> {

public strings = SelectLanguage(this.props.prefLang);

  // private modalStyle = {
  //   main: {
  //     display: "flex",
  //     borderRadius: "5px",
  //     minWidth: "602px",
  //     maxWidth: "602px",
  //     minHeight: "207px"
  //   },
  //   header: {
  //     backgroundColor: "#106EBE",
  //     color: "white",
  //     paddingTop: "10px",
  //     paddingBottom: "10px",
  //     paddingLeft: "30px",
  //     paddingRight: "30px",
     
      
  //   },

  //   body: {
  //     paddingTop: "20px",
  //     paddingBottom: "20px",
  //     paddingLeft: "30px",
  //     paddingRight: "30px",
     
  //   },
  //   footer: {
  //     paddingBottom: "10px",
  //     marginLeft: "60px",
  //     marginRight: "60px"
  //   },
  // };

  public renderFirstPageMessage = ():JSX.Element => {

  const {commPurpose, engName, frCommName, shEngDesc, shFrDesc} = this.props;

    console.log("PROPS", this.props);

    const firstValues: any[] = [
      { name: `${ this.strings.commPurpose_title }`, value: `${commPurpose}` ,  longerText:`${this.strings.please_add_a_longer_purpose}`, addText: `${this.strings.please_add_a_purpose}` },
      { name: `${ this.strings.engName_title }`, value: `${engName}`, longerText: `${this.strings.please_add_a_longer_name}`, addText: `${this.strings.please_add_a_name}`},
      { name: `${ this.strings.frCommName_title }`, value: `${frCommName}` , longerText:`${this.strings.please_add_a_longer_name}`, addText:  `${this.strings.please_add_a_name}`},
      { name: `${ this.strings.shEngDesc_title }`, value: `${shEngDesc}` ,  longerText: `${this.strings.please_add_a_longer_description}`, addText:  `${this.strings.please_add_a_description}`},
      { name: `${ this.strings.shFrDesc_title }`, value: `${shFrDesc}`,  longerText: `${this.strings.please_add_a_longer_description}`, addText: `${this.strings.please_add_a_description}`},
    ];


      //iterate through the values in obj arary
    
      firstValues.forEach((obj) => {
        console.log("Modal", obj);
        const charAllowed = /[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûü'\s]/.test(obj.value);
        let special = '';
        const newKey = 'specialChar';

        obj.value.replace(/[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûü'\s]/g,(match:any) => {
          special  += match + " ";
          });

        if (obj.name === `${this.strings.engName_title}` || obj.name === `${this.strings.frCommName_title}` && charAllowed ) {
         obj[newKey] = special
      
        }

      });



      return (
        <>
        {firstValues.map((item, index) => (
          <>
          <h3 key={index}><strong>{( item.value.length < 5 || item.specialChar ) ? item.name : ""}</strong></h3>
          <ul>
            {(item.value.length >=1 && item.value.length < 5)  && (
                <li>{`${this.strings.minCharacters} ${item.longerText}`}</li>
              ) 
            }
          
            {item.specialChar && 
            ( <li>{`${this.strings.remove_special_char}`}<span style={{color:'#C61515'}}> {item.specialChar} </span></li>) 
            }
            {item.value === ''  && (<li>{`${this.strings.blankField} ${item.addText}`} </li>)}
          </ul>
          </>
        ))}
      </>
      );


  }
  

  public render(): React.ReactElement<IModalsProps>{

    
    return (
    <>
      
    </>
    )
  }


}