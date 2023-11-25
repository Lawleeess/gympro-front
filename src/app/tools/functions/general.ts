import { PaginationEvent, PaginationParams } from 'src/app/models/general';

/**
 * Returns a string with a specific number of decimals;
 * useful to set number format in charts components
 * @param decimals number of required decimals
 */
export function getStringWithDecimals(decimals: number): string {
  let decimalsStr: string = '';

  if (decimals > 0) {
    decimalsStr = '.';
    for (let i = 0; i < decimals; i++) {
      decimalsStr = decimalsStr + '0';
    }
  }

  return decimalsStr;
}

/**
 * Returns PaginationParams object using mat-paginator event (PaginationEvent) as an parameter
 * in order to get offset and limit query params and send API request
 */
export function getPaginationParams(
  pagination: PaginationEvent
): PaginationParams {
  if (!pagination) {
    console.error('[general.ts]: not pagination provided');
    return;
  }
  const pagReq: PaginationParams = new PaginationParams();
  pagReq.offset =
    pagination.pageIndex > 0 ? pagination.pageIndex * pagination.pageSize : 0;
  pagReq.limit = pagination.pageSize;
  return pagReq;
  //  * Returns the increase or decrease with two given numbers
  //  * @param newValue
  //  * @param previousValue
  // */
}
export function getIncrease(newValue: number, previousValue: number): number {
  let increase: number = 0;

  if (newValue > previousValue) {
    increase = Math.abs((previousValue * 100) / newValue);
  } else if (newValue < previousValue) {
    increase = -Math.abs((newValue * 100) / previousValue);
  }

  return increase;
}
