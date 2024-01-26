/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import type { IScwV2Props } from './IScwV2Props';
import type { ISCWState } from './ISCWV2State';
import { ProgressStepsIndicator } from '@pnp/spfx-controls-react/lib/ProgressStepsIndicator';
import ReusableButton  from './ReusableButton'
import { ISpinnerStyles, IStackTokens, Spinner, SpinnerSize, Stack} from '@fluentui/react';
import ReusableTextFields from './ReusableTextFields';
import ReusablePeoplePicker from './ReusablePeoplePicker';
import { fieldValidations, inputValidation, validateOwnerField, validateSpecialCharFields } from './InputValidation';
import { SelectLanguage } from './SelectLanguage';
import styles from './ScwV2.module.scss';
import Modals from './Modals';
import { AadHttpClient, HttpClientResponse, IHttpClientOptions } from '@microsoft/sp-http';
import Callouts from './Callouts';
//import { IReadonlyTheme } from '@microsoft/sp-component-base';


export default class ScwV2 extends React.Component<IScwV2Props, ISCWState> {

  public strings = SelectLanguage(this.props.prefLang)

  public constructor(props: IScwV2Props, state: ISCWState) {
    super(props);

    this.state = {
      currentPage: 0,
      commPurpose: '',
      engCommName: '',
      frCommName: '',
      engDesc: '',
      frDesc: '',
      ownerList: [],
      showModal: false,
      invalidEmail: '',
      requestingUser: '',
      isLoading: false,
      validationStatus: 0,
      showCallout: false,
      targetId: '',
      isError: []
    }; 
  }

  public goToNextPage = (): void => {

    const nextPage = this.state.currentPage + 1;
    const {commPurpose, engCommName, frCommName, engDesc, frDesc, ownerList, currentPage, invalidEmail, requestingUser } = this.state;
    const values = {commPurpose,engCommName,frCommName, engDesc, frDesc};
    const stateValues=[{commPurpose: commPurpose, engCommName: engCommName, frCommName: frCommName, engDesc:engDesc, frDesc:frDesc}]
    const keys = Object.keys(stateValues[0]);
    const arrayVal = Object.values(stateValues[0]);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = arrayVal[i];

      this.handleSideLineErrorValidation(key, value);
      
    }

    this.isBlankFieldError(values);

    const {isLessThanMinLength, hasSpecialChar } = fieldValidations(values);
    

    const showModal = isLessThanMinLength || hasSpecialChar || (currentPage === 1  && (ownerList.length === 0 || requestingUser || invalidEmail))
    
    if(!showModal ) {
      this.setState({
        currentPage: nextPage,
        
      })

    } else {
      this.setState({
        showModal: true
      })
    }
 
  }

  // public isBlankFieldError = (values: any): void => {
  //   console.log("values", values);
  //   let emptyState = {};
  //   for (const [key, value] of Object.entries(values)) {
  //     console.log(`${key}: ${value}`);
  //     if ( value === '') {
  //       emptyState = {...emptyState, [key]: true}
  //       this.setState({
  //         ...this.state,
  //         isError: [emptyState]
  //       })
  //     }
  //   }
     
  // }
  public isBlankFieldError = (values: any): void => {
    console.log("values", values);
    const emptyState = [];

  
    for (const [key, value] of Object.entries(values)) {
      console.log(`${key}: ${value}`);
      if ( value === '') {
        emptyState.push(key)
        this.setState({
          ...this.state,
          isError: emptyState
        })
      }
    }
     
  }

  public goToPreviousPage = (): void => {

    const previousPage = this.state.currentPage - 1

    const {commPurpose, engCommName, frCommName, engDesc, frDesc, ownerList, currentPage, invalidEmail, requestingUser } = this.state;
    const values = {commPurpose,engCommName,frCommName, engDesc, frDesc}
    
    
    const {isLessThanMinLength, hasSpecialChar} = fieldValidations(values);

  
    const showModal =  (currentPage === 1  && (ownerList.length === 0 || requestingUser || invalidEmail)) ||
    (currentPage === 2 && (isLessThanMinLength) || hasSpecialChar || ownerList.length === 0 || requestingUser || invalidEmail);

    
    
    if(!showModal  ) {
      this.setState({
        currentPage: previousPage
        
      })
    } else {
      this.setState({
        showModal: true
      })

    }
  }
  


  public onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>, value: string):void => {
    const name = event.target.name;
    const inputValue = value;

    this.handleSideLineErrorValidation(name, inputValue);

    this.setState({
      ...this.state,
      [name]: inputValue,
    });

  }

  public escapeQuotes = (str:any) => {
    console.log("string",str)
    return  str.replace(/"/g, '\\"');
  };
  

  public successMessage = (): void =>  { 

    const {commPurpose, engCommName, frCommName, engDesc, frDesc, ownerList, currentPage, invalidEmail, requestingUser } = this.state;
    const values = {commPurpose,engCommName,frCommName, engDesc, frDesc}
    
    
    const {isLessThanMinLength, hasSpecialChar} = fieldValidations(values);

    const showModal = isLessThanMinLength || hasSpecialChar || ownerList.length === 0 || requestingUser || invalidEmail;
   
    
    if (showModal) {
        
      this.setState({ showModal: true });
    }
    else {

        const functionUrl = "  ";
        const requestHeaders: Headers = new Headers();
        requestHeaders.append("Content-type", "application/json");
        requestHeaders.append("Cache-Control", "no-cache");
        
        const owner1 = [...ownerList, this.props.requestor].join(',');


      
        const postOptions: IHttpClientOptions = {
            headers: requestHeaders,
            body: `
            {
                "SpaceName": "${engCommName}",
                "SpaceNameFR": "${frCommName}",
                "Owner1": "${owner1}",
                "SpaceDescription": "${this.escapeQuotes(engDesc)}",
                "SpaceDescriptionFR": "${this.escapeQuotes(frDesc)}",
                "BusinessJustification":"${this.escapeQuotes(commPurpose)}",
                "TeamPurpose":"${this.escapeQuotes(commPurpose)}",
                "TemplateTitle": "Generic",
                "RequesterName": "${this.props.context.pageContext.user.displayName}",
                "RequesterEmail": "${this.props.requestor}",
                "SecurityCategory": "unclassified",
                "Status": "Submitted",
                
            }`
        };

        console.log("BODY", postOptions.body);

        
        let responseText: string = "";

        // use aad authentication


        this.setState({ isLoading: true }, () => {
       
            
          this.props.context.aadHttpClientFactory
          .getClient(" ")
          .then((client: AadHttpClient) => {
           
            client.post(functionUrl, AadHttpClient.configurations.v1, postOptions)
            .then((response: HttpClientResponse) => {
              console.log(`Status code: ${response.status}`);

              if ( response.status) {

                this.setState({
                    currentPage: currentPage + 1,
                    isLoading: false,
                    validationStatus: response.status,
                })
              } 
              
              response.json().then((responseJSON: JSON) => {
                responseText = JSON.stringify(responseJSON);
                console.log("respond is ", responseText);
                if (response.ok) {
                
                  console.log("response OK");
                } else {
                    
                console.log("Response error");

                }
              })
              .catch((response: any) => {
                
                const errMsg: string = `WARNING - error when calling URL ${functionUrl}. Error = ${response.message}`;
                console.log("err is ", errMsg);
              });
            });
          });
        });
       
        
    }
}


  public getOwners = (users: []):void => {

    const ownersArray: string[] = [];
    let isInvalidEmail: string = "";
    let isRequestor: string = '';

    console.log("users", users);

    users.forEach(user => {
      ownersArray.push(user['secondaryText'])

      if ( user['id'] === undefined) {
        isInvalidEmail = user['secondaryText']
      }

      if( user['secondaryText'] === this.props.requestor) {
        isRequestor = user['secondaryText']
      }
    })

    const getLineId = document.getElementById('owners');

    if(getLineId) {
      if(ownersArray.length === 0  || isInvalidEmail || isRequestor){
        getLineId.classList.add(styles.errorBorder);
      }
      else {
        getLineId.classList.remove(styles.errorBorder);
      }
    }

    
    this.setState({
      ownerList: ownersArray,
      invalidEmail: isInvalidEmail,
      requestingUser: isRequestor
    });
  }

  public handleSideLineErrorValidation = (eventName:string, value:string ) => {
    console.log("eventname:",eventName, "value",value)

    const charAllowed = /[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûüÆŒœæŸÿ'\s]/.test(value);

    
    const addErrorBorder = (lineId: string) => {
      const getlineId = document.getElementById(lineId)
      
      if (getlineId){
        getlineId.classList.add(styles.errorBorder);
      }
    };
  
    const removeErrorBorder = (lineId: string) => {
      const getlineId = document.getElementById(lineId);
      if (getlineId) {
        getlineId.classList.remove(styles.errorBorder);
      }
    };

    const addCharCountErrorColor = (charCountId: string) => {
      const getcharCountId = document.getElementById(charCountId)
      
      if (getcharCountId){
        getcharCountId.classList.add(styles.errorCharCount);
      }
    };
  
    const removeCharCountErrorColor = (charCountId: string) => {
      const getcharCountId = document.getElementById(charCountId);
      if (getcharCountId) {
        getcharCountId.classList.remove(styles.errorCharCount);
      }
    };

    
  
    switch (eventName) {
      case "commPurpose":
        if (value.length < 5) {
          addErrorBorder("commPurpose");
          addCharCountErrorColor('commPurposeCharCount')
        } else {
          removeErrorBorder("commPurpose");
          removeCharCountErrorColor ('commPurposeCharCount')
        }
        break;
  
      case "engCommName":
        if (value.length < 5 || charAllowed) {
          addErrorBorder("engCommName");
          addCharCountErrorColor('engCommNameCharCount')
        } else {
          removeErrorBorder("engCommName");
          removeCharCountErrorColor ('engCommNameCharCount')
        }
        break;
  
      case "frCommName":
        if (value.length < 5 || charAllowed) {
          addErrorBorder("frCommName");
          addCharCountErrorColor('frCommNameCharCount')
        } else {
          removeErrorBorder("frCommName");
          removeCharCountErrorColor ('frCommNameCharCount')
        }
        break;
  
      case "engDesc":
        if (value.length < 5) {
          addErrorBorder("engDesc");
          addCharCountErrorColor("engDescCharCount")
        } else {
          removeErrorBorder("engDesc");
          removeCharCountErrorColor("engDescCharCount")
        }
        break;
  
      case "frDesc":
        if (value.length < 5) {
          addErrorBorder("frDesc");
          addCharCountErrorColor("frDescCharCount")
        } else {
          removeErrorBorder("frDesc");
          addCharCountErrorColor("frDescCharCount")
        }
        break;
  
      default:
        break;
    }
  };

  public closeModal = (): void => {
    this.setState({
        showModal: false,
    })
  }

  public getButtonID = (event: any): void => {
    const buttonId = event.currentTarget.id;

    console.log("ID",buttonId);

    this.setState({
      targetId: buttonId
    });

    this.isCalloutVisible()
 
  }

  public isCalloutVisible = ():void => {

    this.setState(prevState => ({
        showCallout: !prevState.showCallout,
        
    }));
  };




  
  public render(): React.ReactElement<IScwV2Props> {

    console.log("isError state", this.state.isError)
    console.log("commPurpose- state", this.state.commPurpose)
    console.log("owners", this.state.ownerList, this.state.requestingUser, this.state.invalidEmail)

    const sectionStackTokens: IStackTokens = { childrenGap: 5 };
    
    const labelSpinnerStyles: Partial<ISpinnerStyles> = { root: { padding: 20 } };
    

    
    const progressSteps = [
      {id: 1, title: "Details", description: "Details"},
      {id: 2, title: "Owners", description: "Owners"},
      {id: 3, title: "Review & Submit", description: "Review & Submit"}
    ]

    const {commPurpose, engCommName, frCommName, engDesc, frDesc, ownerList, currentPage, showModal, showCallout, targetId, isError} = this.state;
    // const currentUser: string | undefined = this.props.requestor;
    //const { semanticColors }: IReadonlyTheme = this.props.themeVariant || {};

    const errors =  isError;
    console.log("errors",errors)
    // const val = Object.keys(errors);
    // console.log("val", val);

    
  

    return (
      <>
     
      <div >
        <ProgressStepsIndicator steps={progressSteps}  currentStep={this.state.currentPage} themeVariant={this.props.themeVariant} />
      </div>
      

      {showModal && (
        <Modals prefLang={ this.props.prefLang } 
        currentPage = { currentPage }  
        engName= { engCommName } 
        commPurpose= { commPurpose } 
        frCommName= { frCommName } 
        shEngDesc= { engDesc } 
        shFrDesc= { frDesc } 
        ownerList= { ownerList } 
        invalidUser= {this.state.invalidEmail}
        requestingUser = {this.state.requestingUser}
        showModal={ showModal } 
        openModal = { this.goToNextPage } 
        onClose={ this.closeModal } 
        /> 
      )}
     
      {this.state.currentPage === 0 && (
        <>
          <div >CONTENT 1
            <div>
              <Stack tokens={sectionStackTokens}>
                <div>
                  <ReusableTextFields
                      id={'commPurpose'}
                      lineId={'commPurpose'}
                      name={'commPurpose'}
                      title={'Community Purpose'}
                      label={'these are instructions'}
                      instructions={"instructions"}
                      description={`${commPurpose.length}/500`}
                      multiline
                      defaultValue={this.state.commPurpose}
                      validateOnLoad={false}
                      maxLength={500}
                      rows={3}
                      onChange={this.onChangeTextField}
                      onGetErrorMessage={(commPurpose) => inputValidation(commPurpose, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                      charCountId={"commPurposeCharCount"}
                  />

                  {isError.includes("commPurpose") && (
                    <div>Hello</div>
                  )}
              
                  
                </div>
                {/* <Stack horizontalAlign='end' >
                  <Text id={"commPurposeChar"} variant="small">{`${commPurpose.length}/500`}</Text>
                </Stack> */}

                <ReusableTextFields
                    id={'engCommName'}
                    lineId={'engCommName'}
                    name={'engCommName'}
                    title={'English Community'}
                    label={'these are instructions'}
                    instructions={"instructions"}
                    description={`${engCommName.length}/100`}
                    multiline
                    defaultValue={engCommName}
                    validateOnLoad={false}
                    maxLength={100}
                    rows={1}
                    onChange={this.onChangeTextField}
                    onGetErrorMessage={(engCommName) => validateSpecialCharFields(engCommName, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                    charCountId={"engCommNameCharCount"}
                />


                <ReusableTextFields
                    id={'frCommName'}
                    lineId={'frCommName'}
                    name={'frCommName'}
                    title={'French Community Name'}
                    label={'these are instructions'}
                    instructions={"instructions"}
                    description={`${frCommName.length}/100`}
                    charCountId={"frCommNameCharCount"}
                    multiline
                    defaultValue={frCommName}
                    validateOnLoad={false}
                    maxLength={500}
                    rows={1}
                    onChange={this.onChangeTextField}
                    onGetErrorMessage={(frCommName) => validateSpecialCharFields (frCommName, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  
                />
                <ReusableTextFields
                    id={'engDesc'}
                    lineId={'engDesc'}
                    name={'engDesc'}
                    title={'Short English Description'}
                    label={'these are instructions'}
                    instructions={"instructions"}
                    description={`${engDesc.length}/80`}
                    multiline
                    defaultValue={engDesc}
                    validateOnLoad={false}
                    maxLength={80}
                    rows={1}
                    onChange={this.onChangeTextField}
                    onGetErrorMessage={(engDesc) => inputValidation(engDesc, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                    charCountId={"engDescCharCount"}
                />
                <ReusableTextFields
                    id={'frDesc'}
                    lineId={'frDesc'}
                    name={'frDesc'}
                    title={'French Description'}
                    label={'these are instructions'}
                    instructions={"instructions"}
                    description={`${frDesc.length}/80`}
                    multiline
                    defaultValue={frDesc}
                    validateOnLoad={false}
                    maxLength={80}
                    rows={1}
                    onChange={this.onChangeTextField}
                    onGetErrorMessage={(frDesc) => inputValidation(frDesc, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                    charCountId={"frDescCharCount"}
                />
              </Stack>
            </div>
          </div>
          <div>
            <Stack horizontal horizontalAlign='space-between'>
              <ReusableButton text={'previous'} onClick={this.goToPreviousPage} className={styles.previousbtn}/>
              <ReusableButton text={'next'} onClick={this.goToNextPage}/>
            </Stack>
          </div>
        </>
      )} 
      {this.state.currentPage === 1 && (
        <>
          <div>CONTENT 2</div>
          <div>
            <ReusablePeoplePicker 
              id={'owner'}
              title={'Owners'}
              instructions={'instructions for peoplepicker'}
              lineId={'owners'}
              context={this.props.context}
              ownerList={this.state.ownerList}
              defaultSelectedUsers={this.state.ownerList}
              onChangeGetOwners={this.getOwners}
            />
            </div>
          <div>
              <Stack horizontal horizontalAlign='space-between'>
                <ReusableButton text={'previous'} onClick={this.goToPreviousPage} className={styles.previousbtn}/>
                <ReusableButton text={'next'} onClick={this.goToNextPage}/>
              </Stack>
          </div>
        </>
      
      )}

      {this.state.isLoading &&
        (<Spinner label={ this.strings.submitting_your_information } labelPosition="right"   size={ SpinnerSize.large } styles={labelSpinnerStyles}/>)

      }
      {this.state.currentPage === 2 && (
        <>
        {  showCallout && <Callouts prefLang={ this.props.prefLang } showCallout={ showCallout }  targetId= { targetId } openCallout = { this.isCalloutVisible} /> }
          <div>CONTENT 3</div>
          <div>
            <Stack tokens={sectionStackTokens}>
              <ReusableTextFields
                  id={'commPurpose'}
                  lineId={'commPurpose'}
                  name={'commPurpose'}
                  title={'Community Purpose'}
                  label={'these are instructions'}
                  instructions={"instructions"}
                  description={`${commPurpose.length}/500`}
                  multiline
                  defaultValue={commPurpose}
                  validateOnLoad={false}
                  maxLength={500}
                  rows={3}
                  currentPage={currentPage}
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(commPurpose) => inputValidation(commPurpose, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  isCalloutVisible={ this.isCalloutVisible}
                  getTargetId={this.getButtonID}
                  charCountId={"commPurposeCharCount"}
              />
              <ReusableTextFields
                  id={'engCommName'}
                  lineId={'engCommName'}
                  name={'engCommName'}
                  title={'English Community'}
                  label={'these are instructions'}
                  instructions={"instructions"}
                  description={`${engCommName.length}/100`}
                  multiline
                  defaultValue={engCommName}
                  validateOnLoad={false}
                  maxLength={100}
                  rows={1}
                  currentPage={currentPage}
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(engCommName) => validateSpecialCharFields(engCommName, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  isCalloutVisible={ this.isCalloutVisible}
                  getTargetId={this.getButtonID}
                  charCountId={"engCommNameCharCount"}
              />

              <ReusableTextFields
                  id={'frCommName'}
                  lineId={'frCommName'}
                  name={'frCommName'}
                  title={'French Community Name'}
                  label={'these are instructions'}
                  instructions={"instructions"}
                  description={`${frCommName.length}/100`}
                  multiline
                  defaultValue={frCommName}
                  validateOnLoad={false}
                  maxLength={500}
                  rows={1}
                  currentPage={currentPage}
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(frCommName) => validateSpecialCharFields (frCommName, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  isCalloutVisible={ this.isCalloutVisible}
                  getTargetId={this.getButtonID}
                  charCountId={"frCommNameDescCharCount"}
              />
              <ReusableTextFields
                  id={'engDesc'}
                  lineId={'engDesc'}
                  name={'engDesc'}
                  title={'Short English Description'}
                  label={'these are instructions'}
                  instructions={"instructions"}
                  description={`${engDesc.length}/80`}
                  multiline
                  defaultValue={engDesc}
                  validateOnLoad={false}
                  maxLength={80}
                  rows={1}
                  currentPage={currentPage}
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(engDesc) => inputValidation(engDesc, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  isCalloutVisible={ this.isCalloutVisible}
                  getTargetId={this.getButtonID}
                  charCountId={"engDescCharCount"}
              />
              <ReusableTextFields
                  id={'frDesc'}
                  lineId={'frDesc'}
                  name={'frDesc'}
                  title={'French Description'}
                  label={'these are instructions'}
                  instructions={"instructions"}
                  description={`${frDesc.length}/80`}
                  multiline
                  defaultValue={frDesc}
                  validateOnLoad={false}
                  maxLength={80}
                  rows={1}
                  currentPage={currentPage}
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(frDesc) => inputValidation(frDesc, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  isCalloutVisible={ this.isCalloutVisible}
                  getTargetId={this.getButtonID}
                  charCountId={"frDescCharCount"}
              />
              <div id='owners' style={{marginBottom: '10px'}}>
                <ReusablePeoplePicker 
                  id={'Owner1'}
                  title={`${this.strings.owners} (${this.strings.other_than_yourself})`}
                  instructions={'instructions for peoplepicker'}
                  lineId={'owners'}
                  context={this.props.context}
                  ownerList={ ownerList}
                  defaultSelectedUsers={ownerList}
                  onChangeGetOwners={this.getOwners}
                  currentPage={currentPage}
                  isCalloutVisible={ this.isCalloutVisible}
                  getTargetId={this.getButtonID}
                  
                />
                <div style={{marginTop: '5px'}}>
                  {validateOwnerField(ownerList, this.state.requestingUser, this.state.invalidEmail,{blankfield: `${this.strings.blankField} ${this.strings.please_add_another_owner}`, requestorUser: `${this.strings.invite_yourself} ${this.strings.please_remove_your_name}`, invalidEmail: `${this.strings.isInvalidEmail} ${this.state.invalidEmail}`})}
                </div>
              </div>
              </Stack>
            </div>
          <div>
              <Stack horizontal horizontalAlign='space-between'>
                <ReusableButton text={'previous'} onClick={this.goToPreviousPage} className={styles.previousbtn}/>
                <ReusableButton text={'next'} onClick={this.successMessage}/>
              </Stack>
          </div>
        </>
      )} 
      
      </>
    );
  }
}
