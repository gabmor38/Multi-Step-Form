import { Icon, Stack } from '@fluentui/react';
import * as React from 'react';
import styles from './ScwV2.module.scss';


export const inputValidation = (value: string , strings: {minCharacters: string , blankField: string, removeSpecialChar: string}): JSX.Element | undefined => {
  

  const trimmedValue = value.trim();
   
  console.log("Value", trimmedValue);

  if (trimmedValue.length >= 1 && trimmedValue.length < 5) {
    return (
      <Stack horizontal horizontalAlign="center">
        <Icon iconName="Error" className={styles.errorIcon} />
        <p className={styles.fieldInstruction}>
          {strings.minCharacters}
        </p>
      </Stack>
    );
  } else if (!trimmedValue.length) {


    return (
      <Stack horizontal horizontalAlign="center">
      <Icon iconName="Error" className={styles.errorIcon} />
      <p className={styles.fieldInstruction}>
        {strings.blankField}
      </p>
    </Stack>

    );
  } else {
    return ;
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
        <Stack>
          <Stack horizontal style={{ paddingBottom: "5px" }}>
            <Icon iconName="Error" className={styles.errorIcon} />
            <p className={styles.fieldInstruction}>{strings.removeSpecialChar} {specialCharFound}</p>
          </Stack>
          
          <Stack horizontal >
            <Icon iconName="Error" className={styles.errorIcon} />
            <p className={styles.fieldInstruction}>{strings.minCharacters}</p>
          </Stack>
       </Stack>
       </>
      )
    }  else {
      return (
        <Stack horizontal >
       <Icon iconName="Error" className={styles.errorIcon} />
       <p className={styles.fieldInstruction}>{strings.minCharacters}</p>
       </Stack>
      )
    }
  } else if ( value.trim().length >= 5) {
    if(charAllowed) {
      return (
        <Stack horizontal >
           <Icon iconName="Error" className={styles.errorIcon} />
           <p className={styles.fieldInstruction}>{strings.removeSpecialChar} {specialCharFound}</p>
        </Stack>
        )
    } else {
      return;
    }
  }

  if (charAllowed) {
    <Stack horizontal>
         <Icon iconName="Error" className={styles.errorIcon} />
         <p className={styles.fieldInstruction}>{strings.removeSpecialChar} {specialCharFound}</p>
    </Stack>
  }

}



interface ValidationErrors {
  isLessThanMinLength: boolean;
  hasSpecialChar: boolean;
}


export const fieldValidations = (values: Record<string, string> | string[]): ValidationErrors => {



      const validateStringLength = (value: string, minLength: number): boolean => value.length >= minLength;
      
      const isLessThanMinLength = Object.values(values).some((value) => !validateStringLength(value, 5));
      const hasSpecialChar = Object.entries(values).some(
          ([key, value]) => (key === 'engName' || key === 'frCommName') && /[^a-zA-Z0-9ÀÁÂÃÄÇÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜàáâãäçèéêëìíîïòóôõöùúûü'\s]/.test(value)
        );

      console.log("lessThan 5",isLessThanMinLength);
      console.log("specialChar", hasSpecialChar);

     
  

  return {
      isLessThanMinLength,
      hasSpecialChar
  }
 
}







