import {AbstractControl} from '@angular/forms';
import {Observable, Observer, of} from 'rxjs';

export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof (control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();
  return new Observable((observer: Observer<{ [key: string]: any }>) => {
    fileReader.addEventListener('loadend', () => {
      const array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
      let header = '';
      let isValid: boolean;

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < array.length; i++) {
        header += array[i].toString(16);
      }
      switch (header) {
        case '89504e47':
          isValid = true;
          break;
        case 'ffd8ffe0':
        case 'ffd8ffe1':
        case 'ffd8ffe2':
        case 'ffd8ffe3':
        case 'ffd8ffe8':
        case 'ffd8ffdb':
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid) {
        console.log('Valid image type');
        observer.next(null);
      } else {
        console.log('Invalid image type!');
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
};
