import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: '.g-box.g-sidebar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [MessageService]
})
export class NavbarComponent implements OnInit {
  visibleSidebar1;
  mini = true;
  items: MenuItem[];

  constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig, private router : Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.primengConfig.ripple = true;

    this.items = [{
      label: 'Options',
      items: [{
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
          this.update();
        }
      },
      {
        label: 'MyAccount',
        icon: 'pi pi-times',
        command: () => {
          this.navigateToAccounts();
        }
      }
      ]
    },
    {
      label: 'Navigate',
      items: [{
        label: 'Angular Website',
        icon: 'pi pi-external-link',
        url: 'http://angular.io'
      },
      {
        label: 'Router',
        icon: 'pi pi-upload',
        routerLink : ''
      }
      ]
    }
    ];
  }

  update() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
  }

  navigateToAccounts() {
    let id = 123;
    // this.router.navigate(['/programmaticRoute'])
    // this.router.navigate(['/programmaticRoute', id]);
    this.router.navigate(['programmaticRoute/relative'], {relativeTo:this.route});
  }

  toggleSidebar() {
    if (this.mini) {
      document.getElementById("mySidebar").style.width = "100%";

      this.mini = false;
    } else {
      document.getElementById("mySidebar").style.width = "50px";
      this.mini = true;
    }
  }
}
