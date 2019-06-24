import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registerForm: any;
  isSubmitted: boolean = false;
  error: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
   }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'surName': ['', Validators.required],
      'birthDate': ['', Validators.required],
      'address': ['', Validators.required],
      'postalcode': ['', Validators.required],
      'city': ['', Validators.required],
      'country': ['', Validators.required],
      'dAddress': ['', Validators.required],
      'dPostalcode': ['', Validators.required],
      'dCity': ['', Validators.required],
      'dCountry': ['', Validators.required],
      'email': ['', Validators.required],
      'password': ['', Validators.required]
    })

    if( this.authService.isLoggedIn() ) {
      this.router.navigateByUrl("/profile");
    }
  }

  register() {
    this.isSubmitted = true;

    if(this.registerForm.invalid) {
      return;
    }

    this.authService.register(this.registerForm.value).subscribe((registerres) => {
      if(registerres["success"]) {
            this.router.navigateByUrl('/');  
      } else {
        return;
      }
    })
  }

  cloneBillingAddress() {
    var isChecked = (<HTMLInputElement>document.getElementById("sameAddress")).checked;
    const regForm = this.registerForm.controls;

    if( isChecked ) {
      regForm['dAddress'].setValue(regForm['address'].value);
      regForm['dPostalcode'].setValue(regForm['postalcode'].value);
      regForm['dCity'].setValue(regForm['city'].value);
      regForm['dCountry'].setValue(regForm['country'].value);
    } else {
      regForm['dAddress'].setValue("");
      regForm['dPostalcode'].setValue("");
      regForm['dCity'].setValue("");
      regForm['dCountry'].setValue("");
    }
  }
}