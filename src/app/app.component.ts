import { Component, Input } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard'; 
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor(private clipboard: Clipboard, private modalService: NgbModal, private fb: FormBuilder) {}
  title = 'experince-rating';
  categories:any = [];
  language = "";
  copyButtonText='Copy';
  selectedExperience=0;
  categoriesRated=false;
  dataSubmitted = false;
  overallScore=0;

categoryForm:FormGroup = this.fb.group({
    categoryName: ['', Validators.required],
    subCategory: this.fb.array([
      this.fb.control('')
    ])
});

get subCategory() {
  return this.categoryForm.get('subCategory') as FormArray;
}
addSubcategory(): void {
  console.log(this.subCategory)
  this.subCategory.push(this.fb.control(''));
}
 experienceSelected=(event:any)=>{
  this.selectedExperience = event.target.value;
  }
  skillRating=(rating:any, category:any)=>{
    if(this.copyButtonText=="Copied")
    this.copyButtonText = "Copy";
    const rate = rating.target.value;
    this.categories[category]['rating'] = rate;
    this.categoriesRated = this.categories.every((obj:any)=>obj.rating!==undefined);
    if(this.categoriesRated){
     this.overallScore= this.categories.map((cat:any)=>cat.rating).reduce((a:any,b:any)=>parseInt(a)+parseInt(b),0);
    }
  }
  copyContent=()=>{
    this.clipboard.copy(JSON.stringify({
      data: this.categories,
      score:this.overallScore/this.categories.length
    }));
    this.copyButtonText="Copied"
  }
  closeResult:any;
  open(content:any) {
    this.categoryForm.reset();
  
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => { 
    }, (reason) => {
      console.log('closed')
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  onSubmit() {
    this.dataSubmitted=false;
    if(this.copyButtonText=="Copied")
    this.copyButtonText = "Copy";
    this.categories.push(this.categoryForm.value)
    this.categoriesRated = this.categories.every((obj:any)=>obj.rating!==undefined);
  }

  submitData(){
    this.dataSubmitted=true;
    console.log(this.categories)
  }
}
