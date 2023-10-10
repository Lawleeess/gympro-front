import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { REQ_STATUS } from 'src/app/constants/general';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-client-audit-result',
  templateUrl: './client-audit-result.component.html',
  styleUrls: ['./client-audit-result.component.scss'],
})
export class ClientAuditResultComponent implements OnInit {
  clientID: string;
  accountID: string;
  auditID: string;

  overview: any;
  overviewReqStatus: number = REQ_STATUS.INITIAL;

  errorMsg: string;

  @ViewChildren('auditPoints') auditPoints: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.clientID = params.clientId;
      this.accountID = params.accountId;
      this.auditID = params.auditId;

      if (!!this.clientID && !!this.accountID && !!this.auditID) {
        this.errorMsg && delete this.errorMsg;
        this.getAuditResults(this.clientID, this.accountID, this.auditID);
      } else {
        console.error(
          '[client-audit-result.component]: not clientId, accountId or/and auditId provided as query param in the route'
        );

        this.errorMsg =
          'No fue posible encontrar el id del cliente, de la cuenta y/o de la auditoría.';
        this.overviewReqStatus = REQ_STATUS.ERROR;
      }
    });
  }

  goToAuditPoint(index): void {
    const auditPoint = this.auditPoints.get(index);
    // focus section title
    auditPoint.nativeElement.firstElementChild.firstElementChild.focus();
  }

  getAuditResults(clientID: string, accountID: string, auditID: string) {
    this.overviewReqStatus = REQ_STATUS.LOADING;

    this.auditService.getAudit(clientID, accountID, auditID).subscribe(
      (resp: any) => {
        this.overview = resp;
        this.overviewReqStatus = REQ_STATUS.SUCCESS;
      },
      (error) => {
        console.error(error);
        this.overviewReqStatus = REQ_STATUS.ERROR;
      }
    );
  }
}
