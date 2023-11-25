import { Component, OnInit } from '@angular/core';
import { Script } from 'src/app/models/script';
import { TableColumn } from '../../../shared/components/generic-table/generic-table.component';
import { ScriptsService } from '../../services/scripts.service';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  categoryList: string[];
  categoriesReqStatus: number = 2;

  repositoryTableColumns: TableColumn[] = [
    {
      name: 'name',
      title: 'Nombre del script',
    },
    {
      name: 'category',
      title: 'Categoría',
    },
    {
      name: 'description',
      title: 'Descripción',
    },
    {
      name: 'version',
      title: 'Última versión',
      textAlign: 'center',
    },
    {
      name: 'date',
      title: 'Fecha de lanzamiento (última versión)',
    },
  ];

  repository = {
    data: [],
    reqStatus: 0,
  };

  constructor(private scriptsService: ScriptsService) {}

  async ngOnInit() {
    this.getScripts();

    this.categoryList = this.scriptsService.categories
      ? this.scriptsService.categories
      : await this.getCategories();
  }

  getScripts(category?: string) {
    this.repository.reqStatus = 1;
    this.scriptsService.getScripts(category).subscribe(
      (res: Script[]) => {
        this.repository.data = res;
        this.repository.reqStatus = 2;
      },
      (error) => {
        console.error(`[repository.component]: ${error}`);
        this.repository.data = [];
        this.repository.reqStatus = 3;
      }
    );
  }

  getCategories() {
    this.categoriesReqStatus = 1;
    return this.scriptsService
      .getCategories()
      .toPromise()
      .then((categories: string[]) => {
        this.scriptsService.categories = categories;
        this.categoriesReqStatus = 2;
        return categories;
      })
      .catch((error) => {
        console.error(`[repository.component]: ${error}`);
        this.categoriesReqStatus = 3;
        return null;
      });
  }
}
