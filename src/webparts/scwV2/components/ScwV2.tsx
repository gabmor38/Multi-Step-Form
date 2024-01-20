/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import type { IScwV2Props } from './IScwV2Props';
import type { ISCWState } from './ISCWV2State';
import { ProgressStepsIndicator } from '@pnp/spfx-controls-react/lib/ProgressStepsIndicator';
import ReusableButton  from './ReusableButton'
import { IStackTokens, Stack } from '@fluentui/react';
import ReusableTextFields from './ReusableTextFields';
import ReusablePeoplePicker from './ReusablePeoplePicker';
import { fieldValidations, inputValidation, validateSpecialCharFields } from './InputValidation';
import { SelectLanguage } from './SelectLanguage';
import styles from './ScwV2.module.scss';
import Modals from './Modals';


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
      requestingUser: ''
    }; 
  }

  public goToNextPage = (): void => {

    const nextPage = this.state.currentPage + 1;
    const {commPurpose, engCommName, frCommName, engDesc, frDesc, ownerList, currentPage, invalidEmail, requestingUser } = this.state;
    const values = {commPurpose,engCommName,frCommName, engDesc, frDesc}
    
    console.log("nextPage", nextPage)
    
    const {isLessThanMinLength, hasSpecialChar} = fieldValidations(values);

    const showModal = isLessThanMinLength || hasSpecialChar || (currentPage === 1 && (ownerList.length === 0 || requestingUser || invalidEmail))
    
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

  public goToPreviousPage = (): void => {

    const previousPage = this.state.currentPage - 1
    console.log("nextPage", previousPage)
 
    this.setState({
      currentPage: previousPage
    })
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
    
   
    
    this.setState({
      ownerList: ownersArray,
      invalidEmail: isInvalidEmail,
      requestingUser: isRequestor
    });
  }

  public handleSideLineErrorValidation = (eventName:string, value:string ) => {

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
  
    switch (eventName) {
      case "commPurpose":
        if (value.length < 5) {
          addErrorBorder("commPurpose");
        } else {
          removeErrorBorder("commPurpose");
        }
        break;
  
      case "engCommName":
        if (value.length < 5 || charAllowed) {
          addErrorBorder("engCommName");
        } else {
          removeErrorBorder("engCommName");
        }
        break;
  
      case "frCommName":
        if (value.length < 5 || charAllowed) {
          addErrorBorder("frCommName");
        } else {
          removeErrorBorder("frCommName");
        }
        break;
  
      case "engDesc":
        if (value.length < 5) {
          addErrorBorder("engDesc");
        } else {
          removeErrorBorder("engDesc");
        }
        break;
  
      case "frDesc":
        if (value.length < 5) {
          addErrorBorder("rDesc");
        } else {
          removeErrorBorder("frDesc");
        }
        break;
     case "owners":
            if (!value) {
              addErrorBorder("owners");
            } else {    
              removeErrorBorder("owners");
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
  

  
  
  
  public render(): React.ReactElement<IScwV2Props> {


    console.log("commPurpose- state", this.state.commPurpose)
    console.log("owners", this.state.ownerList, this.state.requestingUser, this.state.invalidEmail)

    const sectionStackTokens: IStackTokens = { childrenGap: 5 };
    
    const progressSteps = [
      {id: 1, title: "Step 1", description: "Step 1 description"},
      {id: 2, title: "Step 2", description: "Step 1 description"},
      {id: 3, title: "Step 3", description: "Step 1 description"}
    ]

    const {commPurpose, engCommName, frCommName, engDesc, frDesc, ownerList, currentPage, showModal} = this.state
    

    return (
      <>
      <div>
        <ProgressStepsIndicator steps={progressSteps}  currentStep={this.state.currentPage} />
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
                    onChange={this.onChangeTextField}
                    onGetErrorMessage={(engCommName) => validateSpecialCharFields(engCommName, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                  
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
                  
                />
                <ReusableTextFields
                    id={'cfrDesc'}
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
                  
                />
              </Stack>
            </div>
          </div>
          <div>
            <Stack horizontal horizontalAlign='space-between'>
              <ReusableButton text={'previous'} onClick={this.goToPreviousPage}/>
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
              id={'Owner1'}
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
                <ReusableButton text={'previous'} onClick={this.goToPreviousPage}/>
                <ReusableButton text={'next'} onClick={this.goToNextPage}/>
              </Stack>
          </div>
        </>
      
      )} 

      {this.state.currentPage === 2 && (
        <>
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
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(commPurpose) => inputValidation(commPurpose, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                
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
                  onChange={this.onChangeTextField}
                  onGetErrorMessage={(engCommName) => inputValidation(engCommName, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
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
                  onGetErrorMessage={(engDesc) => validateSpecialCharFields(engDesc, {minCharacters: this.strings.minCharacters, blankField: this.strings.blankField, removeSpecialChar: this.strings.remove_special_char})}
                
              />
              <ReusableTextFields
                  id={'cfrDesc'}
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
              />

              <ReusablePeoplePicker 
                id={'Owner1'}
                title={'Owners'}
                instructions={'instructions for peoplepicker'}
                lineId={'owners'}
                context={this.props.context}
                ownerList={ ownerList}
                defaultSelectedUsers={this.state.ownerList}
                onChangeGetOwners={this.getOwners}
                
              />
              </Stack>
            </div>
          <div>
              <Stack horizontal horizontalAlign='space-between'>
                <ReusableButton text={'previous'} onClick={this.goToPreviousPage}/>
                <ReusableButton text={'next'} onClick={this.goToNextPage}/>
              </Stack>
          </div>
        </>
      )} 
      
      </>
    );
  }
}
