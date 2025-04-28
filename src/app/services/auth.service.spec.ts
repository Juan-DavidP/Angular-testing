import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); //verifica que no haya peticiones pendientes
  })

  it('debería hacer login correctamente', async () => {
    //given
    const mockResponse = { token: 'fake-jw-token' };

    //when 
    const login$ = service.login('user@example.com', 'password123');
    const loginPromise = firstValueFrom(login$);

    const req = httpTesting.expectOne('/api/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ // toEqual (que sea igual)
      email: 'user@example.com',
      password: 'password123'
    })

    req.flush(mockResponse); //simulamos respuesta exitosa del backend

    //then 
    expect(await loginPromise).toEqual(mockResponse);
    // expect(service).toBeTruthy();
  });
});
