import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./page";

// Mock do fetch global para evitar chamadas reais à API
global.fetch = jest.fn();

// Mock de Headers para os testes
class MockHeaders {
  private headers: Map<string, string>;

  constructor(init?: Record<string, string>) {
    this.headers = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.headers.set(key.toLowerCase(), value);
      });
    }
  }

  get(key: string): string | null {
    return this.headers.get(key.toLowerCase()) || null;
  }

  has(key: string): boolean {
    return this.headers.has(key.toLowerCase());
  }
}

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear();
  // Mock do localStorage
  Object.defineProperty(window, "localStorage", {
    value: {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn(),
    },
    writable: true,
  });

  // Mock de Headers global
  global.Headers = MockHeaders as any;
});

describe("Login Component", () => {
  test("Test 1: Render login form", () => {
    render(<Login />);

    expect(screen.getByText("iFeiranet")).toBeInTheDocument();
    expect(
      screen.getByText("Entre na sua conta para continuar"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite sua senha (leia a descrição)"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ENTRAR" })).toBeInTheDocument();
  });

  test("Test 2: Switch to register form", () => {
    render(<Login />);

    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    expect(screen.getByText("Criar Conta")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite seu nome completo"),
    ).toBeInTheDocument();
  });

  test("Test 3: User type section in register", () => {
    render(<Login />);

    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    expect(screen.getByText("Tipo de Conta")).toBeInTheDocument();
    expect(screen.getByText("Usuário")).toBeInTheDocument();
    expect(screen.getByText("Feirante")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  test("Test 4: Show vendor-specific fields", () => {
    render(<Login />);

    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));
    fireEvent.click(screen.getByText("Feirante"));

    expect(
      screen.getByPlaceholderText("Digite o nome da sua banca"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Ex: Feira da 408 Sul, box 15"),
    ).toBeInTheDocument();
  });

  test("Test 5: Validate invalid email", async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "email-invalido" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("Email inválido")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 6: Validate short password (menos de 6 caracteres)", async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "teste@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(
          screen.getByText("Senha deve ter pelo menos 6 caracteres"),
        ).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 7: Show error for short password", async () => {
    render(<Login />);

    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(
          screen.getByText("Senha deve ter pelo menos 6 caracteres"),
        ).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 8: Show loading state during submission", async () => {
    // Mock successful response com headers
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 200,
      statusText: "OK",
      json: async () => ({
        email: "teste@example.com",
        access_token: "mock-token",
        nome: "Teste",
      }),
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "teste@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    // Check if button is in loading state (disabled)
    await waitFor(
      () => {
        expect(submitButton).toBeDisabled();
      },
      { timeout: 1000 },
    );

    expect(screen.getByText("ENTRANDO...")).toBeInTheDocument();
  });

  test("Test 9: Valid user registration with correct URL", async () => {
    // Mock successful registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 201,
      statusText: "Created",
      json: async () => ({
        email: "novo@email.com",
        nome: "Novo Usuário",
        access_token: "mock-token-registro",
      }),
    });

    render(<Login />);

    // Go to registration form
    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    // Fill form
    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "CRIAR CONTA" });

    fireEvent.change(nameInput, { target: { value: "Novo Usuário" } });
    fireEvent.change(emailInput, { target: { value: "novo@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    // Verify fetch was called with correct data
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/usuarios/",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: "Novo Usuário",
              email: "novo@email.com",
              senha: "Senha123!",
              tipo: "user",
            }),
          }),
        );
      },
      { timeout: 1000 },
    );
  });

  test("Test 10: Valid vendor registration", async () => {
    // Mock successful registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 201,
      statusText: "Created",
      json: async () => ({
        email: "joao@feira.com",
        nome: "João Feirante",
        access_token: "mock-token-vendor",
      }),
    });

    render(<Login />);

    // Go to registration form
    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    // Select vendor type
    fireEvent.click(screen.getByText("Feirante"));

    // Fill form
    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const bancaInput = screen.getByPlaceholderText(
      "Digite o nome da sua banca",
    );
    const localizacaoInput = screen.getByPlaceholderText(
      "Ex: Feira da 408 Sul, box 15",
    );
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "CRIAR CONTA" });

    fireEvent.change(nameInput, { target: { value: "João Feirante" } });
    fireEvent.change(bancaInput, { target: { value: "Banca do João" } });
    fireEvent.change(localizacaoInput, {
      target: { value: "Feira da 408 Sul, box 15" },
    });
    fireEvent.change(emailInput, { target: { value: "joao@feira.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    // Verify fetch was called with correct data
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/usuarios/",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: "João Feirante",
              email: "joao@feira.com",
              senha: "Senha123!",
              tipo: "feirante",
            }),
          }),
        );
      },
      { timeout: 1000 },
    );
  });

  test("Test 11: Validate required fields for vendor", async () => {
    render(<Login />);

    // Go to registration form
    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    // Select vendor type
    fireEvent.click(screen.getByText("Feirante"));

    // Fill only some fields
    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "CRIAR CONTA" });

    fireEvent.change(nameInput, { target: { value: "João Feirante" } });
    fireEvent.change(emailInput, { target: { value: "joao@feira.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    // Should show error
    await waitFor(
      () => {
        expect(
          screen.getByText("Preencha todos os campos do feirante"),
        ).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 12: Successful login with localStorage updates", async () => {
    // Mock successful login response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 200,
      statusText: "OK",
      json: async () => ({
        email: "teste@example.com",
        access_token: "mock-jwt-token",
        nome: "Teste",
      }),
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "teste@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    // Verify fetch was called
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/usuarios/login",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: "teste@example.com",
              senha: "Senha123!",
            }),
          }),
        );
      },
      { timeout: 2000 },
    );

    // Verify localStorage was called
    await waitFor(
      () => {
        // Verifica que setItem foi chamado
        expect(window.localStorage.setItem).toHaveBeenCalled();

        // Verifica token
        expect(window.localStorage.setItem).toHaveBeenCalledWith(
          "token",
          "mock-jwt-token",
        );
      },
      { timeout: 2000 },
    );
  });

  test("Test 13: Login with invalid credentials", async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ error: "Credenciais inválidas" }),
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "invalido@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    // Should show error
    await waitFor(
      () => {
        expect(screen.getByText("Credenciais inválidas")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 14: Show error when backend is down", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error"),
    );

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "teste@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("Network error")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 15: Clear form after successful registration", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 201,
      statusText: "Created",
      json: async () => ({
        email: "novo@email.com",
        nome: "Novo Usuário",
        access_token: "mock-token",
      }),
    });

    render(<Login />);

    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "CRIAR CONTA" });

    fireEvent.change(nameInput, { target: { value: "Novo Usuário" } });
    fireEvent.change(emailInput, { target: { value: "novo@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("iFeiranet")).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  test("Test 16: Validate admin registration with correct tipo", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 201,
      statusText: "Created",
      json: async () => ({
        email: "admin@teste.com",
        nome: "Administrador",
        access_token: "mock-token-admin",
      }),
    });

    render(<Login />);

    fireEvent.click(screen.getByText("Não tem uma conta? Cadastre-se"));

    fireEvent.click(screen.getByText("Admin"));

    const nameInput = screen.getByPlaceholderText("Digite seu nome completo");
    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "CRIAR CONTA" });

    fireEvent.change(nameInput, { target: { value: "Administrador" } });
    fireEvent.change(emailInput, { target: { value: "admin@teste.com" } });
    fireEvent.change(passwordInput, { target: { value: "Admin123!" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/usuarios/",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              nome: "Administrador",
              email: "admin@teste.com",
              senha: "Admin123!",
              tipo: "admin",
            }),
          }),
        );
      },
      { timeout: 1000 },
    );
  });

  test("Test 17: Show backend error message", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      headers: new MockHeaders({ "content-type": "application/json" }),
      status: 400,
      statusText: "Bad Request",
      json: async () => ({ erro: "Email já cadastrado" }),
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "existente@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("Email já cadastrado")).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  test("Test 18: Handle non-JSON response from backend", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      headers: new MockHeaders({ "content-type": "text/html" }),
      status: 500,
      statusText: "Internal Server Error",
      json: async () => {
        throw new Error("Not JSON");
      },
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("seu@email.com");
    const passwordInput = screen.getByPlaceholderText(
      "Digite sua senha (leia a descrição)",
    );
    const submitButton = screen.getByRole("button", { name: "ENTRAR" });

    fireEvent.change(emailInput, { target: { value: "teste@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Senha123!" } });
    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText(/Resposta não é JSON/i)).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });
});
