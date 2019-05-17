import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { delay } from 'q';
import { Observable } from 'rxjs';
import { Portfolio } from '../../data-types/portfolio';
import { PortfolioDataService } from '../../portfolio-data.service';

@Component({
  selector: 'app-edit-portfolio',
  templateUrl: './edit-portfolio.component.html',
  styleUrls: ['./edit-portfolio.component.css']
})
export class EditPortfolioComponent implements OnInit {

  public portfolio$: Observable<Portfolio>;
  public saveP: FormGroup;
  public showMsg: boolean;
  public errorMsg: string;

  @Input() id: number;
  @Input() port: Observable<Portfolio>;

  public isFileChosen = false;
  public fileName: string;

  public isFileChosen2 = false;
  public fileName2: string;

  public uploading: boolean;

  public Image: File;
  public Resume: File;

  constructor(private fb: FormBuilder, private _portfolioDataService: PortfolioDataService) { }

  ngOnInit() {
    const reg = '[^.]+\.(jpg|jpeg|gif|tiff|bmp|png)';
    const regP = '[^.]+\.(pdf)';
    this.portfolio$ = this.port;
    this.saveP = this.fb.group({
      pName: ['', []],
      description: ['', []],
      picturePath: ['', [Validators.pattern(reg)]],
      resumePath: ['', [Validators.pattern(regP)]]
    });

  }



  onSubmit() {

    if (this.saveP.value.pName || this.saveP.value.description) {
    this._portfolioDataService.putPortfolio(this.id,
      {
        name: this.saveP.value.pName,
        description: this.saveP.value.description
      } as Portfolio).subscribe(val => this.showMsg = true);
    }


    if (this.isFileChosen) {

      this._portfolioDataService.deleteImage().subscribe(val => this.uploading = true);

      delay(1500);
      const uploadImage = new FormData();
      uploadImage.append('file', this.Image, this.Image.name);

      this._portfolioDataService.postImage(uploadImage)
    .subscribe(
      val => {
        this.showMsg = true;
        this.uploading = false;
        },
      (err: HttpErrorResponse) => {
        console.log(err);
        if (err.error instanceof Error) {
          this.errorMsg = `Error while trying to add Image: ${err.error.message}`;
        } else {
          this.errorMsg = `Error ${
            err.status
          } while trying to add Image: ${
            err.error
          }`;
        }
      }
    );

  }

    if (this.isFileChosen2) {

      this._portfolioDataService.deleteResume().subscribe(val => this.uploading = true);

      delay(1500);
      const uploadResume = new FormData();
      uploadResume.append('file', this.Resume, this.Resume.name);

      this._portfolioDataService.postResume(uploadResume)
    .subscribe(
      val => {this.showMsg = true;
             this.uploading = false;
        },
        error => {
        console.log(error);
        }
    );
      }
  }

  getErrorMessage(errors: any) {
    if (!errors) {
      return null;
    }
    if (errors.required) {
      return 'is required';
    } else if (errors.minlength) {
      return `needs at least ${
        errors.minlength.requiredLength
      } characters (got ${errors.minlength.actualLength})`;
    } else if (errors.pattern) {
      return `You must provide an URL`;
    }
  }

  isValid(field: string) {
    const input = this.saveP.get(field);
    return input.dirty && input.invalid;
  }

  fieldClass(field: string) {
    return { 'is-invalid': this.isValid(field) };
  }

  preUpload(event) {
    this.Image = event.target.files[0];
    if (event.target.files.length > 0) {
      this.isFileChosen = true;
    }
    this.fileName = this.Image.name;
  }
  preUpload2(event) {
    this.Resume = event.target.files[0];
    if (event.target.files.length > 0) {
      this.isFileChosen2 = true;
    }
    this.fileName2 = this.Resume.name;
  }
}
