import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { IStaffData } from '../serviceSchool/staff-data';
import { IStaffInsert } from '../serviceSchool/istaff-insert';
import { serviceSchool } from '../serviceSchool/serviceSchool';

@Component({
  selector: 'app-staff',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './staff.html',
  styleUrl: './staff.scss'
})



export class Staff {
  public staffFormData: FormGroup;
  public addStaffFormData: FormGroup;
  public editStaffFormData: FormGroup;
  public deleteStaffFormData: FormGroup;
  private chosenStaff: string;             // form input
  public isButton: boolean;
  public isButtonAll: boolean;
  public isSuccess = false;
  public isError = false;
  public isLoading = false;
  public gotAllStaff = false;
  public gotStaffName = false;
  public postMsg = "";
  public selectedCity = '';
  public selectedStaff = '';
  public staffData: IStaffData | any = <IStaffData>{};
  public editStaffData: IStaffData | any = <IStaffData>{};
  public deleteStaffData: IStaffData | any = <IStaffData>{};
  public modelStaffData: IStaffData | any = <IStaffData>{};
  public staffInsert: IStaffInsert | any = <IStaffInsert>{};
  public staffs: any = [];
  public selectedRow = -1;
  public isSelected = false;
  env = environment;

  constructor(private service: serviceSchool, private render:Renderer2) {      // dependency injection of service object
    this.isButton = false;
    this.isButtonAll = false;
     this.staffFormData = new FormGroup({
      staffName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')])
    });

    this.addStaffFormData = new FormGroup({
      staffName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      staffTitle: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      staffStatus: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      staffNotes: new FormControl('')
    });

    this.editStaffFormData = new FormGroup({
      staffId: new FormControl('', Validators.minLength(4)),
      staffName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      staffTitle: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      staffStatus: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z, ]*')]),
      staffNotes: new FormControl('')

    });

    this.deleteStaffFormData = new FormGroup({
      staffId: new FormControl({value: '', disabled: true}),
      staffName: new FormControl({value: '', disabled: true}),
      staffTitle: new FormControl({value: '', disabled: true}),
      staffStatus: new FormControl({value: '', disabled: true}),
      staffNotes: new FormControl({value: '', disabled: true})

    });// init any HTML items as needed

    //Initialization
    this.chosenStaff = "";
  }

  ngOnInit() {
  }

  ngOnDestroy() {}


  //-----OnSubmits for Buttons-----
  public onSubmit(staffFormData: { staffName: string; value: any; }) {
      if(this.staffFormData.valid)
      {
        this.chosenStaff = staffFormData.staffName;
        this.isLoading = true;
        this.getStaffByName(this.chosenStaff);
      }

      //logging
      console.log('Form Submitted!', staffFormData.value);
      console.log('Form Data:', this.chosenStaff);
  }

  public async onSubmitAdd(addStaffFormData: {staffName: string; staffTitle: string; staffStatus: string; staffNotes: string;}){

    this.staffInsert.name = addStaffFormData.staffName;
    this.staffInsert.title = addStaffFormData.staffTitle;
    this.staffInsert.status= addStaffFormData.staffStatus;

    //might want to change this later if seems mostly worthless
    if(addStaffFormData.staffNotes != null)
    {
      this.staffInsert.notes = addStaffFormData.staffNotes;
    }
    else
    {
      this.staffInsert.notes = "";
    }

    this.isLoading = true;
    this.service.postStaffWX(this.staffInsert).subscribe
    ({
      next: (data) => {this.processDataModal(data)},
      error: (err) => {this.processErrorModal(err)}
    });
  }
  public onSubmitUpdate(editStaffFormData: {staffId: number; staffName: string; staffTitle: string; staffStatus: string; staffNotes: string;})
  {
    this.editStaffData.id = editStaffFormData.staffId;
    this.editStaffData.name = editStaffFormData.staffName;
    this.editStaffData.title = editStaffFormData.staffTitle;
    this.editStaffData.status = editStaffFormData.staffStatus;
    this.editStaffData.notes = editStaffFormData.staffNotes;

    this.service.updateStaffWX(this.editStaffData).subscribe
    ({
      next: (data) => {this.processDataModal(data)},
      error: (err) => {this.processErrorModal(err)}
    });

  }

  public onSubmitDelete(deleteStaffFormData: {staffId: number; staffName: string; staffTitle: string; staffStatus: string; staffNotes: string;})
  {
    this.deleteStaffData.id = deleteStaffFormData.staffId;
    this.deleteStaffData.name = deleteStaffFormData.staffName;
    this.deleteStaffData.title = deleteStaffFormData.staffTitle;
    this.deleteStaffData.status = deleteStaffFormData.staffStatus;
    this.deleteStaffData.notes = deleteStaffFormData.staffNotes;

    //refactor functions to be one since all reused anyway
     this.service.deleteStaffWX(this.deleteStaffData).subscribe
    ({
      next: (data) => {this.processDataModal(data)},
      error: (err) => {this.processErrorModal(err)}
    });
  }


//-----Modal Operations-----
  public openModal()
  {
    const modelElement = document.getElementById('exampleModal');
    if(modelElement != null)
    {
      modelElement.style.display = "block";
      this.addStaffFormData.setValue({
        staffName: "",
        staffTitle: "",
        staffStatus: "",
        staffNotes: ""
      });
      this.addStaffFormData.markAsUntouched();
      this.addStaffFormData.markAsPristine();
    }
  }

   public closeModal()
  {
    const modelElement = document.getElementById('exampleModal');
    const modelElementEdit = document.getElementById('editModal');
    const modelElementDelete = document.getElementById('deleteModal');
    if(modelElement != null)
    {
      modelElement.style.display = "none";
      this.postMsg = '';
      this.isSuccess = false;
      this.isError = false;
    }
    if(modelElementEdit != null)
    {
      modelElementEdit.style.display = "none";
    }
    if(modelElementDelete != null)
    {
      modelElementDelete.style.display = "none";
    }

    if(this.gotAllStaff == true)
    {
      this.getStaff();
    }
    else if(this.gotStaffName == true && this.chosenStaff != null)
    {
      this.getStaffByName(this.chosenStaff);
    }
  }

  public editModal(staffInfo: IStaffData)
  {
    const modelElement = document.getElementById('editModal');
    if(modelElement != null)
    {
      modelElement.style.display = "block";
    }

    this.modelStaffData = staffInfo;

    this.editStaffFormData.setValue({
      staffId: this.modelStaffData.id,
      staffName: this.modelStaffData.name,
      staffTitle: this.modelStaffData.title,
      staffStatus: this.modelStaffData.status,
      staffNotes: this.modelStaffData.notes
    });


    this.editStaffFormData.controls['staffId'].disable();

    console.log('Selected Staff id:', staffInfo.id);
  }

  public resetModal()
  {
    const modelElementEdit = document.getElementById('editModal');
    if(modelElementEdit != null)
    {
      this.editStaffFormData.setValue({
      staffId: this.modelStaffData.id,
      staffName: this.modelStaffData.name,
      staffTitle: this.modelStaffData.title,
      staffStatus: this.modelStaffData.status,
      staffNotes: this.modelStaffData.notes
      });
    }
  }

   public deleteModal(staffInfo: IStaffData)
  {
    const modelElement = document.getElementById('deleteModal');
    if(modelElement != null)
    {
      modelElement.style.display = "block";
    }

    this.modelStaffData = staffInfo;

    this.deleteStaffFormData.setValue({
      staffId: this.modelStaffData.id,
      staffName: this.modelStaffData.name,
      staffTitle: this.modelStaffData.title,
      staffStatus: this.modelStaffData.status,
      staffNotes: this.modelStaffData.notes
    });
  }

  //-----Search Form Processing-----
  public processClick()
  {
      this.isLoading = true;
      this.getStaff();
  }

  public getStaff()
  {
    this.gotAllStaff = true;
    this.gotStaffName = false;
    this.service.getStaffWX('staff').subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  /*public getStaffById(staffId: string)
  {
    this.service.getStaffWX('staff/'+ staffId).subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }*/

  public getStaffByName(staffName: string)
  {
    this.gotAllStaff = false;
    this.gotStaffName = true;
    this.service.getStaffWX('staff/searcher/'+ staffName).subscribe(data => { this.processData(data); },
                                     err => { this.processError(err); });
  }

  //-----Data Validator-----
  public get staffName ()
  {
      return this.staffFormData.get('staffName');
  }

  //-----Data Processing-----
  public formData(formName: String, fieldName: String)
  {
    if(formName === "addStaffFormData")
    {
      if(fieldName === "staffName")
      {
        return this.addStaffFormData.get('staffName');
      }
      else if(fieldName === "staffTitle")
      {
        return this.addStaffFormData.get('staffTitle');
      }
      else if(fieldName === "staffStatus")
      {
        return this.addStaffFormData.get('staffStatus');
      }
      else if(fieldName === "staffNotes")
      {
        return this.addStaffFormData.get('staffNotes');
      }
      else
      {
         return null;
      }
    }

    else if(formName === "editStaffFormData")
    {
      if(fieldName === "staffName")
      {
        return this.editStaffFormData.get('staffName');
      }
      else if(fieldName === "staffTitle")
      {
        return this.editStaffFormData.get('staffTitle');
      }
      else if(fieldName === "staffStatus")
      {
        return this.editStaffFormData.get('staffStatus');
      }
      else if(fieldName === "staffNotes")
      {
        return this.editStaffFormData.get('staffNotes');
      }
      else
      {
         return null;
      }
    }

    else
    {
      return null;
    }
  }

  private processData(data: string | IStaffData | null) {
    this.isLoading = false;
    if ( data == null)
    {
      data = 'Staff not found!';

    }
    else if (data == '')
    {
      alert('Staff not found!');
    }
    else {
      this.staffs = data;
    }

  }

  private processError(err: any) {
    this.isLoading = false;
    if( err.message.includes("0 Unknown Error") )
    {
      alert('Failure to connect to API! Azure web app may not be running please contact website admin.');
      console.log('Failure to connect to API! Azure web app may not be running please contact website admin.');
    }
    else
    {
      alert('Failed to load database info! Likely a timeout please try again.');
      console.log('Failed to load database info! Likely a timeout please try again.');
    }
  }

  private processDataModal(data: any)
  {
    this.isLoading = false;
    this.isError = false;
    this.isSuccess = true;
    console.log(data);
    this.postMsg = data.result;
  }

  private processErrorModal(err: any)
  {
    this.isLoading = false;
    this.isSuccess = false;
    this.isError = true;

     if( err.message.includes("0 Unknown Error") )
    {
      alert('Failure to connect to API! Azure web app may not be running please contact website admin.');
      console.log('Failure to connect to API! Azure web app may not be running please contact website admin.');
    }
    else
    {
      console.log(err);
      this.postMsg = err.error;
    }
  }

}
