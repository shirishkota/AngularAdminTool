import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Utility } from '../../../utils/utility';
import { FinanceService } from '../../../services/finance.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html'
})
export class ForecastComponent implements OnInit {
  forecastForm: FormGroup;
  fileToSent: string;
  
  @ViewChild('fileInput') fileInput: ElementRef;
  
  constructor(
    private fb: FormBuilder,
    private service: FinanceService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef
  ) { }

  ngOnInit() {
    this.toastr.setRootViewContainerRef(this.vcr);
    this.fsForecastFormCreation()
  }

  fsForecastFormCreation(){
    this.forecastForm = this.fb.group({
      forecastMonth: ['', Validators.required],
      forecastAttachment: ['', Validators.required]
    })
  }

  onFileChange(event) {
    let reader = new FileReader();
    let fileTarget = event.target;
    if(fileTarget && fileTarget.files && fileTarget.files.length > 0) {
      let fileObject = fileTarget.files[0] || [];
      reader.readAsDataURL(fileObject);
      reader.onload = () => {
       this.fileToSent = reader.result.split(',')[1];
      };
    }
  }

  submitForecastForm() {
    this.forecastForm.patchValue({
      forecastAttachment: this.fileToSent
    });
    if(this.forecastForm.valid) {
      this.service.saveForecast(this.forecastForm).then((res) => {
        this.toastr.success('Forecast Report Submitted Successfully!', 'Success!', {toastLife: 10000, showCloseButton: true});
      }, (error) => {
        this.toastr.error('Error while uploading file!', 'Error!', {toastLife: 10000, showCloseButton: true});
      });
    } else {
      Utility.validateFieldsOnSubmit(this.forecastForm);
    }
  }

  restForm() {
    this.fsForecastFormCreation();
    this.forecastForm.get('forecastAttachment').setValue(null);
    this.fileInput.nativeElement.value = ''; 
  }


}
