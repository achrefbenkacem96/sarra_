import { Component, OnInit } from '@angular/core';
import { navItems } from './sidebar-data';
import { NavService } from '../../../services/nav.service';

@Component({
  selector: 'app1-sidebar',
  templateUrl: './sidebarUser.component.html',
  styleUrls: ['./sidebar.component.scss'],

})
export class SidebarUserComponent implements OnInit {
  navItems = navItems;

  constructor(public navService: NavService) {}

  ngOnInit(): void {}
}
