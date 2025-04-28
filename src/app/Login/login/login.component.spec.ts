import { of, throwError } from "rxjs";
import { fireEvent, render } from '@testing-library/angular'
import { userEvent } from '@testing-library/user-event'
import { AuthService } from "../../services/auth.service";
import { LoginComponent } from "./login.component";
import { screen } from "@testing-library/dom";

describe('LoginComponent', () => {

  let authServiceMock: jest.Mocked<AuthService>


  beforeEach(async () => {
    authServiceMock = {
      login: jest.fn()
    } as unknown as jest.Mocked<AuthService>

    delete (window as any).location
    window.location = { href: '' } as any;
  });

  it('debería redirigir al dashboard en login exitoso', async () => {
    //given 
    authServiceMock.login.mockReturnValueOnce(of({ token: 'fake-jwt-token' }))

    await render(LoginComponent, {
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ]
    })

    //when 
    // fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com' } });
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@example.com'); //Simula un evento de tipeo por usuario

    // fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');

    // fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    // fireEvent.click(screen.getByRole('button', { name: /login/i })); //que el nombre incluya login
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    //then 
    expect(authServiceMock.login).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(window.location.href).toBe('/dashboard');

    // expect(component).toBeTruthy();
  });

  it('debería dar un error en login fallido', async () => {
    //given 
    authServiceMock.login.mockReturnValueOnce(throwError(() => ({ error: { message: 'Invalid email or passsword' } })));

    await render(LoginComponent, {
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ]
    })

    //when 
    // fireEvent.input(screen.getByPlaceholderText('Email'), { target: { value: 'user@example.com' } });
    await userEvent.type(screen.getByPlaceholderText('Email'), 'user@example.com'); //Simula un evento de tipeo por usuario

    // fireEvent.input(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrongPassword');

    // fireEvent.click(screen.getByRole('button', { name: 'Login' }))
    // fireEvent.click(screen.getByRole('button', { name: /login/i })); //que el nombre incluya login
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    //then 
    expect(authServiceMock.login).toHaveBeenCalledWith('user@example.com', 'wrongPassword');
    const errorMessage = await screen.findByText('Invalid email or password');
    expect(errorMessage).toBeTruthy();

    // expect(component).toBeTruthy();
  });
});
