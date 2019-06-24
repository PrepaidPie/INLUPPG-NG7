import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { __await } from 'tslib';
import { User } from '../../user'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editForm: any;
  editingInfo: boolean = false;
  user: User;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getInfo();
    this.isLoggedIn();

    this.editForm = this.formBuilder.group({
      'firstName': [''],
      'surName': [''],
      'email': [''],
      'password': [''],
      'address': [''],
      'postalcode': [''],
      'city': [''],
      'country': [''],
      'dAddress': [''],
      'dPostalcode': [''],
      'dCity': [''],
      'dCountry': ['']
    })
  }

  isLoggedIn = () => {
    if( this.authService.isLoggedIn() ) {
      return true;
    } else {
      this.router.navigateByUrl("/");
      return false;
    }
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn();
  }

  cancel() {
    this.getInfo()
    this.editingInfo = false;
  }

  getInfo() {
    this.authService.getUser()
      .subscribe((res => {
        this.user = res[0];
        const editForm = this.editForm.controls;
        editForm["firstName"].setValue(res[0].firstName);
        editForm["surName"].setValue(res[0].surName);
        editForm["email"].setValue(res[0].email);
        editForm["address"].setValue(res[0].address);
        editForm["postalcode"].setValue(res[0].postalcode);
        editForm["city"].setValue(res[0].city);
        editForm["country"].setValue(res[0].country);
        editForm["dAddress"].setValue(res[0].dAddress);
        editForm["dPostalcode"].setValue(res[0].dPostalcode);
        editForm["dCity"].setValue(res[0].dCity);
        editForm["dCountry"].setValue(res[0].dCountry);

        localStorage.setItem("USER_EMAIL", this.user["email"]);
      }))
    }

    updateInfo() {
      this.authService.updateUser(this.editForm.value).subscribe(data => {
        const values = Object.keys(data).map(key => data[key]);
        const success = values.join(",");

        if(success) {
          this.editingInfo = false;
          this.getInfo();
        }
      })
    }
}