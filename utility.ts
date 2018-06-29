import { FormGroup, AbstractControl } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";

export class Utility {

    static validateFieldsOnSubmit(formGroup: FormGroup) :void {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            control.markAsTouched();
        });
    }

    static checkAuthLS() : string {
        return localStorage.getItem('userRoles');
    }
    
   static checkingDates(startDate: string, endDate: string) {
      return (formgroup: FormGroup): {[key: string]: any} => {
         let sDate = formgroup.controls[startDate].value;
         let eDate = formgroup.controls[endDate].value;
         if (sDate !== '' &&  eDate !== '') {
            if (new Date(eDate) > new Date(sDate)) {
                return null;
            } else {
                return { dateError: true };
          }
        }
      }
    }

    static errorMessageHandling(err: HttpErrorResponse) :any {
        if (err.error instanceof Error) {
            return `Error Message: ${err.error.message}`;
        } else {
            if (err.error != null) {
                if (err.error.errorMessage) {
                    return `Error Message: ${err.error.errorMessage}`;
                } else {
                    return `Error Message: Internal Technical Error occured `;
                }
            } else {
                return `Error Message: Internal Technical Error occured `;
            }
        }
    }  

}

