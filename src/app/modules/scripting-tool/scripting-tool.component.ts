import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { TabLink } from '../shared/components/main-tab-selector/main-tab-selector.component';

@Component({
  selector: 'app-scripting-tool',
  templateUrl: './scripting-tool.component.html',
  styleUrls: ['./scripting-tool.component.scss'],
})
export class ScriptingToolComponent implements OnInit {
  basePath: '/dashboard/scripting-tool/';
  tabLinks: TabLink[] = [
    {
      pagePath: 'historical',
      label: 'Histórico de ejecuciones',
    },
    {
      pagePath: 'execute',
      label: 'Ejecutar Script',
    },
    {
      pagePath: 'repository',
      label: 'Repositorio de scripts',
    },
    {
      pagePath: 'scheduler',
      label: 'Scheduler',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
