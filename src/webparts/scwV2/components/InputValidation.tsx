import { Icon, Stack } from '@fluentui/react';
import * as React from 'react';
import styles from './ScwV2.module.scss';


export const inputValidation = (value: string , strings: {minCharacters: string , blankField: string, removeSpecialChar: string}): JSX.Element | undefined => {

 
  const charAllowed = /[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûüÆŒœæŸÿ'\s]/.test(value);

  let specialCharFound = "";

  value.replace(/[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûü'\s]/g,(match) => {
      specialCharFound += match + " ";
      return "";
    }
  );
 

  if (!value.trim().length) {
    console.log("Iam blank")
    
    return  <Stack horizontal>
        <Icon iconName="Error" className={styles.errorIcon} />
        <p >{strings.blankField}</p>
      </Stack>
    
  } else if (value.trim().length >= 1 && value.trim().length < 5) {
    if( charAllowed ) {
      return (
        <>
      <Stack horizontal style={{ paddingBottom: "5px" }}>
         <Icon iconName="Error" className={styles.errorIcon} />
         <p >{strings.removeSpecialChar} {specialCharFound}</p>
      </Stack>
      
       <Stack horizontal>
       <Icon iconName="Error" className={styles.errorIcon} />
       <p >{strings.minCharacters}</p>
       </Stack>
       </>
      )
    }  else {
      return (
        <Stack horizontal>
       <Icon iconName="Error" className={styles.errorIcon} />
       <p >{strings.minCharacters}</p>
       </Stack>
      )
    }
  } else if ( value.trim().length >= 5) {
    if(charAllowed) {
      return (
        <Stack horizontal>
           <Icon iconName="Error" className={styles.errorIcon} />
           <p >{strings.removeSpecialChar} {specialCharFound}</p>
        </Stack>
        )
    } else {
      return ( undefined )
    }
  }

  if (charAllowed) {
    <Stack horizontal>
         <Icon iconName="Error" className={styles.errorIcon} />
         <p >{strings.removeSpecialChar} {specialCharFound}</p>
    </Stack>
  }

}

export const validateSpecialCharFields = (value: string, strings: { minCharacters: string; blankField: string; removeSpecialChar: string }): JSX.Element | undefined => {

  const charAllowed = /[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûüÆŒœæŸÿ'\s]/.test(value);

  let specialCharFound = "";

  value.replace(/[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûü'\s]/g,(match) => {
      specialCharFound += match + " ";
      return "";
    }
  );
  console.log("Value Lenght", value.length);

  if (!value.trim().length) {
    console.log("Iam blank")
    
    return  <Stack horizontal>
        <Icon iconName="Error" className={styles.errorIcon} />
        <p className={styles.fieldInstruction}>{strings.blankField}</p>
      </Stack>
    
  } else if (value.trim().length >= 1 && value.trim().length < 5) {
    if(charAllowed ) {
      return (
        <>
      <Stack horizontal style={{ paddingBottom: "5px" }}>
         <Icon iconName="Error" className={styles.errorIcon} />
         <p className={styles.fieldInstruction}>{strings.removeSpecialChar} {specialCharFound}</p>
      </Stack>
      
       <Stack horizontal>
       <Icon iconName="Error" className={styles.errorIcon} />
       <p className={styles.fieldInstruction}>{strings.minCharacters}</p>
       </Stack>
       </>
      )
    }  else {
      return (
        <Stack horizontal>
       <Icon iconName="Error" className={styles.errorIcon} />
       <p className={styles.fieldInstruction}>{strings.minCharacters}</p>
       </Stack>
      )
    }
  } else if ( value.trim().length >= 5) {
    if(charAllowed) {
      return (
        <Stack horizontal>
           <Icon iconName="Error" className={styles.errorIcon} />
           <p className={styles.fieldInstruction}>{strings.removeSpecialChar} {specialCharFound}</p>
        </Stack>
        )
    } else {
      return (undefined)
    }
  }

  if (charAllowed) {
    <Stack horizontal>
         <Icon iconName="Error" className={styles.errorIcon} />
         <p className={styles.fieldInstruction}>{strings.removeSpecialChar} {specialCharFound}</p>
    </Stack>
  }

}







