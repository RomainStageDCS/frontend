import { Component, Input, OnChanges } from '@angular/core';
import { TypesApi } from 'src/app/api/types';
import { IType } from 'src/app/interfaces/type';

export interface IFields {
  key: string;
  name: string;
}

export interface IFieldsGroup {
  type: IFields[];
  fusioninventory: IFields[];
}

@Component({
  selector: 'app-workflowActionPanel',
  templateUrl: './workflowActionPanel.component.html',
})
export class WorkflowActionPanelComponent implements OnChanges {
  @Input() panelId: number = 0;
  @Input() panelType: string = '';

  public typeId = 3;
  public formElements: string[] = [];
  public types: IType[] = [];
  public fields: IFieldsGroup = {
    type: [],
    fusioninventory: [],
  };

  constructor (
    private typesApi: TypesApi,
  ) {
  }

  ngOnChanges (): void {
    if (this.panelType === 'Create an item') {
      this.formElements = ['field', 'value'];
      this.constructFieldsList(true);
    } else if (this.panelType === 'Update an item') {
      this.formElements = ['field', 'value', 'function'];
      this.constructFieldsList(true);
    } else if (this.panelType === 'Create event with datetime') {
      this.formElements = ['field', 'value', 'function'];
      this.constructFieldsList(true);
    } else if (this.panelType === 'Go to another type (FusionInventory)') {
      this.formElements = ['nextType', 'fusioninventorydata', 'propertyId'];
      this.loadTypes();
      this.constructFieldsList(true);

      // if (this.panelType === 'Check criteria') {
      //   this.formElements = ['field', 'operator', 'value'];
      //   this.constructFieldsList(true);
      // } else if (this.panelType === 'Get data') {
      //   this.formElements = ['source', 'field', 'function', 'variable'];
      //   // source | field | function | variable | variable type (string|item)
      //   this.constructFieldsList();
      // } else if (this.panelType === 'Rename') {
      //   this.formElements = ['field', 'renamevalue'];
      //   this.constructFieldsList();
      // } else if (this.panelType === 'searchitem') {
      //   this.formElements = ['field', 'operator', 'value'];
      //   // TODO multiple formElements
      //   this.constructFieldsList();
      // } else if (this.panelType === 'fusionforeachitem') {
      //   this.formElements = ['field', 'optionDeletenotfound', 'optionRecusriseloop'];
      //   // * [unique] property id of previous item | fusionfield
      //   // * option delete not found
      //   // * option test on all sub and sub items (recursise)

      //   this.constructFieldsList();
    } else {
      this.formElements = [];
    }
  }

  /**
   * Construct fields list from the type of item
   */
  private constructFieldsList (withFusion: boolean = false) {
    this.fields.type = [
      {
        key: 'name',
        name: 'name',
      },
    ];
    this.fields.fusioninventory = [];

    this.typesApi.get(this.typeId)
      .subscribe((type: IType) => {
        type.properties.forEach(prop => {
          this.fields.type.push(
            {
              key: 'property.' + prop.id,
              name: prop.name,
            },
          );
        });
      });

    // if (withFusion) {
    //   this.fields.fusioninventory.push(
    //     {
    //       key: 'fusioninventory.type',
    //       name: 'type in inventory',
    //     },
    //   );
    // }
    // 'name'
    // 'property xxxx - name'
    // added/updated name
    // added/updated property xxxx
  }

  private loadTypes () {
    this.typesApi.list()
      .subscribe((res) => {
        this.types = res.filter((type) => {
          return type.id > 2;
          // TODO not sure need remove organization and user
        });
      });
  }
}
