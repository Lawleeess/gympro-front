import { insertIndex } from '@amcharts/amcharts5/.internal/core/util/Array';
import { numberToText, UnitDetails } from './parse-number';

describe('ParseNumber', () => {
  const unitDetails: UnitDetails = new UnitDetails();
  let text: string;
  let expectedText: string;

  // when the number is given in units
  it('should return a text using an unit', () => {
    const number: number = 0;
    expectedText = 'CERO';

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using an unit', () => {
    const number: number = 10;
    expectedText = 'DIEZ';

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using an unit with decimals', () => {
    const number = (10.5).toFixed(2);
    expectedText = 'DIEZ CON CINCUENTA'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  // when the number is given in tens
  it('should return a text using tens', () => {
    const number: number = 50;
    expectedText = 'CINCUENTA';

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using tens and units', () => {
    const number: number = 55;
    expectedText = 'CINCUENTA Y CINCO'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using tens with decimals', () => {
    const number: number = 90.87;
    expectedText = 'NOVENTA CON OCHENTA Y SIETE'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using tens and units with decimals', () => {
    const number: number = 95.87;
    expectedText = 'NOVENTA Y CINCO CON OCHENTA Y SIETE'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  // the number is given in hundreds
  it('should return a text using hundreds', () => {
    const number: number = 300;
    expectedText = 'TRESCIENTOS';

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using hundreds and tens', () => {
    const number: number = 380;
    expectedText = 'TRESCIENTOS OCHENTA'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using hundreds, tens and units', () => {
    const number: number = 381;
    expectedText = 'TRESCIENTOS OCHENTA Y UN'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using hundreds, tens and units with decimals', () => {
    const number: number = 381.46;
    expectedText = 'TRESCIENTOS OCHENTA Y UN CON CUARENTA Y SEIS'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  // the number is given in thousands (thousand units)
  it('should return a text using thousands (thousand units)', () => {
    const number: number = 7000;
    expectedText = 'SIETE MIL'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands and hundreds (thousand units)', () => {
    const number: number = 7100;
    expectedText = 'SIETE MIL CIEN'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds and tens (thousand units)', () => {
    const number: number = 7130;
    expectedText = 'SIETE MIL CIENTO TREINTA'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds, tens and units (thousand units)', () => {
    const number: number = 7132;
    expectedText = 'SIETE MIL CIENTO TREINTA Y DOS'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds, tens and units with decimals (thousand units)', () => {
    const number: number = 7132.89;
    expectedText = 'SIETE MIL CIENTO TREINTA Y DOS CON OCHENTA Y NUEVE'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  // the number is given in thousands (tens of thousands)
  it('should return a text using thousands (tens of thousands)', () => {
    const number: number = 37000;
    expectedText = 'TREINTA Y SIETE MIL'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands and hundreds (tens of thousands)', () => {
    const number: number = 37100;
    expectedText = 'TREINTA Y SIETE MIL CIEN'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds and tens (tens of thousands)', () => {
    const number: number = 37130;
    expectedText = 'TREINTA Y SIETE MIL CIENTO TREINTA'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds, tens and units (tens of thousands)', () => {
    const number: number = 37132;
    expectedText = 'TREINTA Y SIETE MIL CIENTO TREINTA Y DOS'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds, tens and units with decimals (tens of thousands)', () => {
    const number: number = 37132.89;
    expectedText =
      'TREINTA Y SIETE MIL CIENTO TREINTA Y DOS CON OCHENTA Y NUEVE'.replace(
        /\s/g,
        ''
      );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  // the number is given in thousands (hundreds of thousands)
  it('should return a text using thousands (hundreds of thousands)', () => {
    const number: number = 637000;
    expectedText = 'SEISCIENTOS TREINTA Y SIETE MIL'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands and hundreds (hundreds of thousands)', () => {
    const number: number = 637100;
    expectedText = 'SEISCIENTOS TREINTA Y SIETE MIL CIEN'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds and tens (hundreds of thousands)', () => {
    const number: number = 637130;
    expectedText = 'SEISCIENTOS TREINTA Y SIETE MIL CIENTO TREINTA'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds, tens and units (hundreds of thousands)', () => {
    const number: number = 637132;
    expectedText =
      'SEISCIENTOS TREINTA Y SIETE MIL CIENTO TREINTA Y DOS'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using thousands, hundreds, tens and units with decimals (hundreds of thousands)', () => {
    const number: number = 637132.89;
    expectedText =
      'SEISCIENTOS TREINTA Y SIETE MIL CIENTO TREINTA Y DOS CON OCHENTA Y NUEVE'.replace(
        /\s/g,
        ''
      );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  // the number is given in millions
  it('should return a text using millions', () => {
    const number: number = 2000000;
    expectedText = 'DOS MILLONES'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using millions and thousands', () => {
    const number: number = 2400000;
    expectedText = 'DOS MILLONES CUATROCIENTOS MIL'.replace(/\s/g, '');

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using millions, thousands and hundreds', () => {
    const number: number = 2400300;
    expectedText = 'DOS MILLONES CUATROCIENTOS MIL TRESCIENTOS'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using millions, thousands, hundreds and tens', () => {
    const number: number = 2400380;
    expectedText = 'DOS MILLONES CUATROCIENTOS MIL TRESCIENTOS OCHENTA'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using millions, thousands, hundreds, tens and units', () => {
    const number: number = 2400380.16;
    expectedText =
      'DOS MILLONES CUATROCIENTOS MIL TRESCIENTOS OCHENTA CON DIECISEIS'.replace(
        /\s/g,
        ''
      );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });

  it('should return a text using UnitDetails as parameter', () => {
    const number: number = 10.51;
    const unitDetails: UnitDetails = new UnitDetails();

    unitDetails.plural = 'PESOS MEXICANOS';
    unitDetails.centPlural = 'CENTAVOS';
    unitDetails.centConcat = 'Y';

    expectedText = 'DIEZ PESOS MEXICANOS Y CINCUENTA Y UN CENTAVOS'.replace(
      /\s/g,
      ''
    );

    text = numberToText(number, unitDetails).replace(/\s/g, '');
    expect(text).toEqual(expectedText);
  });
});
